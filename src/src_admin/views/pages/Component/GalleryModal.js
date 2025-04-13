import { useState, useCallback, useRef, useEffect } from 'react'
import {
  CRow,
  CImage,
  CCol,
  CFormCheck,
  CNav,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CTab,
  CTableHead,
  CTableBody,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CToaster,
  CSpinner,
} from '@coreui/react'
import { useDropzone } from 'react-dropzone'
import { FaFilePdf, FaFileExcel, FaFileVideo, FaTrashAlt } from 'react-icons/fa'
import {
  listAllImage,
  postImageComplete,
  postImageStart,
  uploadChunkWithRetry,
} from '../../../models/galleryModel'
import { usePushToastHelper } from '../../../hooks/usePushToastHelper'
import { constant } from '../../../utils/constant'

const GalleryModal = ({
  visible = false,
  setVisible = () => {},
  onSelectImages = null,
  acceptedFormat = null,
  maxSelectedCount = null,
}) => {
  const [activeTab, setActiveTab] = useState(0)
  const [limit, setLimit] = useState(4)
  const [gallery, setGallery] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState({})

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const toaster = useRef()
  const { toasts, pushToastsMessage } = usePushToastHelper()

  const fetchImages = async () => {
    console.log('fetching imagessss')
    if (loading) return
    setLoading(true)
    try {
      const result = await listAllImage(undefined, undefined, limit)
      const images = result.data?.images
      const updatedGallery = images.map((file, index) => ({
        id: Date.now() + index,
        url: file.Url,
        orgFile: file.Url,
        type: file.Type,
        name: file.Key,
        lastModified: file.LastModified,
      }))

      setGallery(() => updatedGallery)
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = useCallback((acceptedFiles) => {
    setUploading(true)
    const fileObjects = acceptedFiles.map((file, index) => ({
      id: Date.now() + index, // Unique ID for deletion
      url: URL.createObjectURL(file),
      orgFile: file,
      type: file.type,
      name: file.name,
      lastModified: Date.now(),
    }))
    startImageUpload(fileObjects)
    setGallery((prev) => [...prev, ...fileObjects])
    setActiveTab(1)
    setUploading(false)
  }, [])

  const startImageUpload = async (files) => {
    // console.log(files, 'filessss')

    for (let fileObj of files) {
      try {
        const file = fileObj.orgFile
        const fileName = fileObj.name
        const mimetype = file.type // ### check
        setUploadingFiles((prev) => ({
          ...prev,
          [fileName]: { fileName, isUploading: true },
        }))

        if (!file) {
          console.error('No valid file found!')
          // addToast("error", "No valid file selected.");
          pushToastsMessage('error', 'No valid file selected.')
          return
        }

        const totalSize = file?.size
        const chunkSize = 5 * 1024 * 1024
        const totalParts = Math.ceil(totalSize / chunkSize)

        // Upload whole file
        if (totalSize < chunkSize) {
          console.log('File is smaller than chunk size, sending as a single request.')

          const formData = new FormData()
          formData.append('fileName', fileName)
          formData.append('file', file)

          const result = await uploadChunkWithRetry(formData)
          console.log(result, 'Response for single-part upload')
          // setUploading(false);

          setGallery((prev) =>
            prev.map((oldFile) =>
              oldFile.id === fileObj.id
                ? {
                    ...oldFile,
                    url: result?.data?.Location,
                    size: totalSize,
                    type: mimetype,
                    name: fileName,
                  }
                : oldFile,
            ),
          )

          setUploadingFiles((prev) => {
            const updated = { ...prev }
            delete updated[fileName]
            return updated
          })
          return
        }

        // Upload chunk file.
        const response = await postImageStart(fileName, mimetype)
        const uploadId = response.data.uploadId
        let partNumber = 0
        let parts = []

        for (let start = 0; start < totalSize; start += chunkSize) {
          partNumber += 1
          const chunk = file.slice(start, start + chunkSize)
          console.log(chunk, 'updated chunkkkk size')

          console.log(`Chunk ${partNumber}: Size = ${chunk.size} bytes`)
          if (chunk.size === 0) {
            console.error(`Empty chunk detected at part ${partNumber}, skipping.`)
            continue
          }

          const formData = new FormData()
          formData.append('fileName', response.data.fileName)
          formData.append('uploadId', uploadId)
          formData.append('partNumber', partNumber)
          formData.append('file', chunk)

          console.log(`Uploading part ${partNumber} of ${totalParts}...`)
          const result = await uploadChunkWithRetry(formData)
          console.log(result, `Response for part ${partNumber}`)

          if (result?.data) {
            parts.push({
              ETag: result.data?.ETag ? result.data.ETag?.replace(/"/g, '') : '',
              partNumber: Number(result.data.PartNumber),
            })
          }
        }

        const resultFinish = await postImageComplete(response.data.fileName, uploadId, parts)

        setGallery((prev) =>
          prev.map((oldFile) =>
            oldFile.id === fileObj.id
              ? {
                  ...oldFile,
                  url: resultFinish?.data?.Location,
                  size: totalSize,
                  type: mimetype,
                  name: fileName,
                }
              : oldFile,
          ),
        )

        setUploadingFiles((prev) => {
          const updated = { ...prev }
          delete updated[fileName]
          return updated
        })
      } catch (error) {
        setUploading(false)
        setUploadingFiles((prev) => {
          const updated = { ...prev }
          delete updated[fileObj.name]
          return updated
        })

        setGallery((prev) => prev.filter((item) => item.id !== fileObj.id))

        console.log(error, 'error uploading...')
        pushToastsMessage('error', error.message)
      }
    }
  }

  const handleDelete = (id) => {
    // console.log(gallery, selectedImages)
    setGallery((prev) => prev.filter((file) => file.id !== id))
    setSelectedImages((prev) => prev.filter((file) => file.id !== id))
  }

  const handleSelectImage = (file) => {
    setSelectedImages((prev) => {
      const isSelected = prev.some((item) => item.id === file.id)
      const newSelection = isSelected ? prev.filter((item) => item.id !== file.id) : [...prev, file]
      return newSelection
    })
  }

  const selectFileHanlder = () => {
    if (selectedImages.length <= 0) {
      alert('Please select atleast 1 file')
      return
    }
    setVisible(false)
    onSelectImages(selectedImages)
  }

  // console.log(maxSelectedCount, selectedImages, 'selected file')
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
      'video/*': [],
      'application/pdf': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
      'application/vnd.ms-excel': [],
    },
    onDrop,
  })

  useEffect(() => {
    if (gallery.length === 0 || limit > gallery.length) {
      fetchImages()
    }

    return () => {}
  }, [limit])

  return (
    <>
      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>File Uploader</CModalTitle>
        </CModalHeader>
        <CModalBody
          style={{
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
                Upload Image
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
                Select Gallery
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            {/* Upload section */}
            <CTabPane visible={activeTab === 0}>
              <div
                {...getRootProps()}
                className="mt-3 p-5 border border-dashed rounded-lg text-center cursor-pointer"
                style={{
                  borderColor: isDragActive ? 'blue' : '#ccc',
                  backgroundColor: isDragActive ? '#f0f8ff' : 'transparent',
                }}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-primary">Drop the files here...</p>
                ) : (
                  <p>Drag & drop an image here, or click to select files</p>
                )}
              </div>
            </CTabPane>

            {/* Gallery section */}
            <CTabPane visible={activeTab === 1}>
              <CRow className="mt-3">
                {gallery ? (
                  gallery.map((file) => (
                    <CCol key={file.id} md={4} lg={3} sm={6} xs={6} className="mb-3 text-center">
                      <div
                        className="position-relative p-3 rounded shadow-sm d-flex flex-column align-items-center justify-content-center"
                        style={{
                          border: '2px solid #ccc',
                          borderRadius: '10px',
                          maxWidth: '180px',
                          minHeight: '200px',
                          backgroundColor: '#f8f9fa',
                        }}
                      >
                        {uploadingFiles[file.name]?.isUploading ? (
                          <FaTrashAlt
                            className="position-absolute"
                            style={{
                              top: '5px',
                              right: '5px',
                              cursor: 'pointer',
                              color: 'red',
                              fontSize: '1.2rem',
                            }}
                            onClick={() => handleDelete(file.id)}
                          />
                        ) : (
                          <>
                            {onSelectImages !== null &&
                              (( maxSelectedCount !== null ? selectedImages.length < maxSelectedCount : true ) ||
                                selectedImages.some((item) => item.id === file.id)) && (
                                <CFormCheck
                                  className="position-absolute"
                                  style={{
                                    position: 'absolute',
                                    top: '5px',
                                    left: '5px',
                                    zIndex: 1,
                                  }}
                                  checked={selectedImages.some((item) => item.id === file.id)}
                                  onChange={() => handleSelectImage(file)}
                                />
                              )}
                          </>
                        )}
                        {uploadingFiles[file.name]?.isUploading ? (
                          <CSpinner color="primary" size="lg" />
                        ) : [
                            constant.FILE_TYPE.IMAGE_JPEG,
                            constant.FILE_TYPE.IMAGE_JPG,
                            constant.FILE_TYPE.IMAGE_PNG,
                          ].some((item) => item.includes(file.type)) ? (
                          <CImage
                            src={file.url}
                            alt={file.name}
                            className="rounded"
                            style={{
                              objectFit: 'cover',
                              maxHeight: '150px',
                              width: '95%',
                              height: '120px',
                            }}
                          />
                        ) : [
                            constant.FILE_TYPE.VIDEO_MP4,
                            constant.FILE_TYPE.VIDEO_MKV_EXT,
                            constant.FILE_TYPE.VIDEO_AVI_EXT,
                            constant.FILE_TYPE.VIDEO_MKV,
                            constant.FILE_TYPE.VIDEO_AVI,
                          ].some((item) => item.includes(file.type)) ? (
                          <video width="150" controls>
                            <source src={file.url} type={file.type} />
                            Your browser does not support the video tag.
                          </video>
                        ) : [constant.FILE_TYPE.PDF, constant.FILE_TYPE.DOC].some((item) =>
                            item.includes(file.type),
                          ) ? (
                          <FaFilePdf size={50} color="red" />
                        ) : [constant.FILE_TYPE.XLS, constant.FILE_TYPE.XLSX, 'xlsx'].some((item) =>
                            item.includes(file.type),
                          ) ? (
                          <FaFileExcel size={50} color="green" />
                        ) : (
                          <p>Unsupported file type</p>
                        )}
                        <p
                          className="mt-2 mb-0 text-muted text-center"
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            wordBreak: 'break-word',
                          }}
                        >
                          {file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name}
                        </p>
                      </div>
                    </CCol>
                  ))
                ) : (
                  <p>No files uploaded yet.</p>
                )}
              </CRow>
              <div className="text-center mt-3">
                <CButton
                  color="primary"
                  onClick={() => setLimit((prev) => prev + 4)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      Loading... <CSpinner size="sm" />
                    </>
                  ) : (
                    'Load More'
                  )}
                </CButton>
              </div>
            </CTabPane>
          </CTabContent>
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setSelectedImages([])
              setVisible(false)
            }}
          >
            Close
          </CButton>
          {onSelectImages !== null && (
            <CButton color="primary" onClick={() => selectFileHanlder()}>
              Select
            </CButton>
          )}
        </CModalFooter>
      </CModal>
      <CToaster ref={toaster} push={toasts} placement="top-end" />
    </>
  )
}

export default GalleryModal
