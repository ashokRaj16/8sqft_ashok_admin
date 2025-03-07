import React, { useState, useEffect, useRef } from 'react'
import {
  CContainer,
  CCard,
  CCardBody,
  CButtonGroup,
  CCardHeader,
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormText,
  CInputGroup,
  CInputGroupText,
  CFormCheck,
  CSpinner,
} from '@coreui/react'
import { ToastMessage } from '../../../components/ToastMessage'

import {
  createBlogCategory,
  deleteBlogCategory,
  getBlogCategory,
} from '../../../models/blogCategoryModel.js'
import Loader from '../../../utils/Loader'
import { FaTrash, FaTrashAlt, FaList, FaTh, FaThLarge, FaPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import GalleryModal from '../Component/GalleryModal.js'

const ImageGallery = () => {
  const [galleryImages, setGalleryImage] = useState([])
  const [selectedImages, setSelectedImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, addToast] = useState(0)
  const [activeView, setActiveView] = useState('list')
  const [isVisible, setIsVisible] = useState(false)

  const toaster = useRef()

  const navigate = useNavigate();
  const handleDelete = async (id) => {
    try {
      const result = await deleteBlogCategory(id)
      if (result) {
        loadBlogCategoryData()
        addToast(<ToastMessage type="success" message={result.message} />)
      }
    } catch (error) {
      addToast(<ToastMessage type="error" message={error.message} />)
    }
  }

  const loadImageGalleryData = async () => {
    try {
      setLoading(true)
      // const offset = (currentPage);
      const result = await getBlogCategory()
      const fileObjects = result.data.category.map((file, index) => ({
        id: Date.now() + index, // Unique ID for deletion
        url: URL.createObjectURL(file),
        type: 'test',
        name: 'file.name',
        ...file
    }));

      setGalleryImage(() => fileObjects)

      setLoading(false)
    } catch (error) {
      console.log('Error: ', error)
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
      setLoading(false)
      // setTimeout(() => {
      //   navigate(-1)
      // }, 1000)
    }
  }

  useEffect(() => {
    // loadImageGalleryData()

    return () => {}
  }, [])

  return (
    <>
      {loading && <Loader />}
      <GalleryModal visible={isVisible} onSelectImages={setSelectedImages} setVisible={setIsVisible} />
      {/* <CContainer> */}
      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Gallery Details</strong>
               
                <CButton
                  color={'secondary'}
                  size='sm'
                  type='button'
                  className="border rounded-pill ms-4 " 
                  onClick={() => setIsVisible(() => true)}
                >
                  Upload{'  '} <FaPlus /> 
                </CButton>
              <CButtonGroup
                role="group"
                style={{ height: '30px' }}
                className="border rounded-pill overflow-hidden float-end "
              >
                <CButton
                  color={activeView === 'list' ? 'primary' : 'light'}
                  active={activeView === 'list'}
                  onClick={() => setActiveView('list')}
                  className="d-flex align-items-center justify-content-center" // Center icon vertically & horizontally
                  style={{ height: '30px', width: '40px', padding: '4px' }}
                >
                  <FaList />
                </CButton>
                <CButton
                  color={activeView === 'grid' ? 'primary' : 'light'}
                  active={activeView === 'grid'}
                  onClick={() => setActiveView('grid')}
                  className="d-flex align-items-center justify-content-center" // Center icon vertically & horizontally
                  style={{ height: '30px', width: '40px', padding: '4px' }}
                >
                  <FaTh />
                </CButton>
              </CButtonGroup>
            </CCardHeader>
            <CCardBody>
              <div className="mt-2">
                <CRow>
                  {/* Right Side: Categories Table with Search */}
                  <CCol md="9">
                    <CCard>
                      <CCardBody>
                        <h5>Welcome to Gallery</h5>

                        {/* Search Bar */}
                        {/* ### search, delete, trash, multiselect */}
                        <CInputGroup className="mb-3">
                          <CInputGroupText>Search</CInputGroupText>
                          <CFormInput
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search Image"
                          />
                        </CInputGroup>

                        {/* Categories Table */}
                        {activeView === 'list' ? (
                          <CTable>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell>Title</CTableHeaderCell>
                                <CTableHeaderCell>Reason</CTableHeaderCell>
                                <CTableHeaderCell>Owner</CTableHeaderCell>
                                <CTableHeaderCell>Location</CTableHeaderCell>
                                <CTableHeaderCell>Actions</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {galleryImages
                                .filter((category) =>
                                  category.title.toLowerCase().includes(searchTerm.toLowerCase()),
                                )
                                .map((category, index) => (
                                  <CTableRow key={category.id}>
                                    <CTableDataCell>{category.title}</CTableDataCell>
                                    <CTableDataCell>
                                      {category.description && category.description.length > 15
                                        ? `${category.description.slice(0, 15)} ...`
                                        : category.description || '-'}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      {category.parent_cat_title || '-'}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      <CButton
                                        color="danger"
                                        size="sm"
                                        onClick={() => handleDelete(category.id)}
                                      >
                                        <FaTrash color="white" />
                                      </CButton>
                                    </CTableDataCell>
                                  </CTableRow>
                                ))}
                            </CTableBody>
                          </CTable>
                        ) : (
                          <div>
                            {galleryImages
                              .filter((category) =>
                                category.title.toLowerCase().includes(searchTerm.toLowerCase()),
                              )
                              .map((file, index) => (
                                <CCol
                                  key={file.id}
                                  md={4}
                                  lg={3}
                                  sm={6}
                                  xs={6}
                                  className="mb-3 text-center"
                                >
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
                                    <CFormCheck
                                      className="position-absolute"
                                      style={{
                                        position: 'absolute',
                                        top: '5px',
                                        left: '5px',
                                        zIndex: 1,
                                      }}
                                      checked={
                                        selectedImages &&
                                        selectedImages.some((item) => item.id === file.id)
                                      }
                                      // onChange={() => handleSelectImage(file)}
                                    />
                                    <FaTrashAlt
                                      className="position-absolute"
                                      style={{
                                        top: '5px',
                                        right: '5px',
                                        cursor: 'pointer',
                                        color: 'red',
                                        fontSize: '1.2rem',
                                      }}
                                      // onClick={() => handleDelete(file.id)}
                                    />
                                    {file.type.startsWith('image/') ? (
                                      <CImage
                                        src={file.url}
                                        width={150}
                                        height={150}
                                        alt={file.name}
                                        className="rounded"
                                        style={{ objectFit: 'contain', maxHeight: '150px' }}
                                      />
                                    ) : file.type.startsWith('video/') ? (
                                      <video width="150" controls>
                                        <source src={file.url} type={file.type} />
                                        Your browser does not support the video tag.
                                      </video>
                                    ) : file.type === 'application/pdf' ? (
                                      <FaFilePdf size={50} color="red" />
                                    ) : file.type.includes('spreadsheet') ||
                                      file.type.includes('excel') ? (
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
                                      {file.name.length > 15
                                        ? file.name.substring(0, 12) + '...'
                                        : file.name}
                                    </p>
                                  </div>
                                </CCol>
                              ))}
                          </div>
                        )}
                      </CCardBody>
                    </CCard>
                  </CCol>

                  <CCol md="3">
                    <CCard>
                      <CCardBody>
                        <h5>Image Info</h5>

                        {/* Search Bar */}
                        <CInputGroup className="mb-3">
                          <CFormInput
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search categories"
                          />
                        </CInputGroup>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* </CContainer> */}
    </>
  )
}

export default ImageGallery
