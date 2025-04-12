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
  CToaster,
  CTooltip,
  CImage,
  CHeader,
} from '@coreui/react'
import {
  FaTrash,
  FaEye,
  FaTrashAlt,
  FaList,
  FaTh,
  FaThLarge,
  FaPlus,
  FaDownload,
  FaFileExcel,
  FaEllipsisV,
  FaFilePdf,
} from 'react-icons/fa'
import _ from 'lodash'
import { FaFilter, FaSort } from 'react-icons/fa6'
import { Link, useNavigate } from 'react-router-dom'

import { getPropertyList } from '../../../models/propertyModel.js'
import { deleteImageFromGallery, listAllImage } from '../../../models/galleryModel.js'

import { usePushToastHelper } from '../../../hooks/usePushToastHelper.js'
import { useDebounce } from '../../../hooks/useDebounce.js'

import { imageList } from './data.js'
import Loader from '../../../utils/Loader'
import { constant } from '../../../utils/constant.js'
import { currentDateInfo, formattedDate } from '../../../utils/date.js'
import { MONTHS_AVAILABLE, YEARS_AVAILABLE } from '../../../utils/MasterData.js'

import GalleryModal from '../Component/GalleryModal.js'
import SearchSelectMaster from '../Component/SearchSelectMaster.js'

const ImageGallery = () => {
  const navigate = useNavigate()

  const [galleryImages, setGalleryImage] = useState([])
  const [selectedImages, setSelectedImages] = useState()
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeView, setActiveView] = useState('grid')
  const [isVisible, setIsVisible] = useState(false)

  const [limit, setLimit] = useState(4)
  const [sortOrder, setSortOrder] = useState('DESC')
  const [sortColumn, setSortColumn] = useState('LastModified')

  const [filterValue, setFilterValue] = useState({
    month: currentDateInfo({ shortMonthInWord: true }).month,
    year: currentDateInfo({ year: true }).year,
  })
  const [isFilterVisible, setIsFilterVisible] = useState(false)
  const [searchPropertyTerm, setSearchPropertyTerm] = useState('')
  const [selectedProperty, setSelectedProperty] = useState('')
  const [properties, setProperties] = useState([]);

  const toaster = useRef()
  const { toasts, pushToastsMessage } = usePushToastHelper()

  const debounceValue = useDebounce(searchPropertyTerm, 500);

  const handleDelete = async (e) => {
    e.preventDefault()
    let messageResponse = confirm('Are you sure to remove?')
    if (!messageResponse) {
      return
    }
    if (!selectedImages) {
      pushToastsMessage('error', 'Atleast select one file.')
    }
    try {
      // const result = true;
      const result = await deleteImageFromGallery(selectedImages)
      if (result) {
        setGalleryImage((prev) => prev.filter((item) => item.Key != selectedImages.Key))
      }
    } catch (error) {
      pushToastsMessage('error', error.message)
    }
  }

  const loadImageGalleryData = async () => {
    try {
      setLoading(true)

      // const result = imageList
      // setGalleryImage(() => result)
      let prefix;

      if (filterValue.year || filterValue.month) {
        prefix = `${_.camelCase(filterValue.month)}-${filterValue.year}`
      }
      
      if (selectedProperty) {
        prefix += `/${selectedProperty}`
      }
      const result = await listAllImage(searchTerm, prefix, limit, sortColumn, sortOrder)
      setGalleryImage(() => result.data?.images)
      setLoading(false)
    } catch (error) {
      console.log('Error: ', error)
      pushToastsMessage('error', error.message)
      setLoading(false)
      setTimeout(() => {
        navigate(-1)
      }, 1000)
    }
  }

  useEffect(() => {
    loadImageGalleryData()

    return () => {}
  }, [searchTerm, selectedProperty, filterValue, limit, sortOrder, sortColumn])


  useEffect(() => {
      ;(async () => {
        try {
          const result = await getPropertyList(
            undefined,
            undefined,
            undefined,
            undefined,
            searchPropertyTerm,
            undefined,
            '2',
          )
          const newProperties = result.data?.property.map((i) => ({
            id: i.id,
            value: i.id,
            label: `${[i.id, i.property_title, i.city_name, i.user_mobile]
              .filter(Boolean)
              .join(' | ')}`,
          }))
  
          setProperties(newProperties)
        } catch (error) {
          pushToastsMessage('error', error.message)
        }
      })()
      return () => {}
    }, [debounceValue])

  const filterHandler = () => {
    try {
      const params = {
        prefix: `${filterValue.month}-${filterValue.year}`,
      }
      loadImageGalleryData()
    } catch (error) {
      pushToastsMessage('error', error.message)
    }
  }

  return (
    <>
      {loading && <Loader />}
      <GalleryModal
        visible={isVisible}
        setVisible={setIsVisible}
        // onSelectImages={(files) => {
        //   console.log(files, "gallary select")
        // }}
        // maxSelectedCount={2}
      />
      {/* <CContainer> */}
      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Gallery Details</strong>

              <CButton
                color={'secondary'}
                size="sm"
                type="button"
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
                        <CCol className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
                          <h5>Welcome to Gallery</h5>
                          {isFilterVisible && (
                            <CRow>
                              <CCol lg={3} md={6} className="mb-2">
                                <CFormSelect
                                  value={filterValue.month.toLowerCase()}
                                  onChange={(e) => {
                                    let val = e.target.value
                                    if (val === '-1') {
                                      setFilterValue((prev) => ({ ...prev, month: '' }))
                                      return
                                    }
                                    setFilterValue((prev) => ({ ...prev, month: val }))
                                  }}
                                >
                                  <option value={'-1'}>Month</option>
                                  {Object.entries(MONTHS_AVAILABLE).map(([key, value], index) => {
                                    return (
                                      <option 
                                        key={index}
                                        value={key.toLowerCase()}>{value}</option>
                                    )
                                  })}
                                </CFormSelect>
                              </CCol>
                              <CCol lg={3} md={6} className="mb-2">
                                <CFormSelect
                                  value={filterValue.year}
                                  onChange={(e) => {
                                    let val = e.target.value
                                    if (val === '-1') {
                                      setFilterValue((prev) => ({ ...prev, year: '' }))
                                      return
                                    }
                                    setFilterValue((prev) => ({ ...prev, year: val }))
                                  }}
                                >
                                  <option value={'-1'}>Year</option>
                                  {Object.entries(YEARS_AVAILABLE).map(([key, value], index) => {
                                    return <option 
                                      key={index}
                                      value={key}>{value}
                                      </option>
                                  })}
                                </CFormSelect>
                                </CCol>
                                <CCol lg={3} md={6} className="mb-2">
                                <SearchSelectMaster 
                                  name={'property_id'}
                                  placeholder={'Property'}
                                  searchTerm={searchPropertyTerm}
                                  setSearchTerm={setSearchPropertyTerm}
                                  setSelectedValue={setSelectedProperty}
                                  options={properties || []}
                                />
                              </CCol>
                              <CCol lg={3} md={6} className="mb-2">
                                <CButton
                                  className="me-1"
                                  color="primary"
                                  size="sm"
                                  onClick={() => filterHandler()}
                                >
                                  Search
                                </CButton>
                                <CButton
                                  className=""
                                  color="primary"
                                  size="sm"
                                  onClick={() => {
                                    setSearchPropertyTerm('')
                                    setSelectedProperty('')
                                    // setFilterValue((prev) => {
                                    //   return { ...prev, year: currentDateInfo({ year: true}).year, month: currentDateInfo({shortMonthInWord: true}).month}
                                    // })
                                    setFilterValue((prev) => {
                                      return { ...prev, year: '', month:''}
                                    })
                                  }}
                                >
                                  Clear
                                </CButton>
                              </CCol>
                            </CRow>
                          )}
                          <FaFilter
                            color={isFilterVisible ? 'red' : ''}
                            onClick={() => setIsFilterVisible((prev) => !prev)}
                          />
                        </CCol>
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

                        { galleryImages.length == 0 && <p className='text-center'>No file found.</p>}
                        {/* Categories Table */}
                        {activeView === 'list' ? (
                          <CTable>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell>Id</CTableHeaderCell>
                                <CTableHeaderCell>Title</CTableHeaderCell>
                                <CTableHeaderCell>Type</CTableHeaderCell>
                                <CTableHeaderCell>Size</CTableHeaderCell>
                                <CTableHeaderCell>Date</CTableHeaderCell>
                                <CTableHeaderCell>Actions</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {galleryImages
                                .filter((image) =>
                                  image.Key.toLowerCase().includes(searchTerm.toLowerCase()),
                                )
                                .map((image, index) => (
                                  <CTableRow
                                    key={image.id}
                                    onClick={() => setSelectedImages(image)}
                                  >
                                    <CTableDataCell>{index + 1}</CTableDataCell>
                                    <CTableDataCell
                                      className={
                                        selectedImages?.Key === image.Key ? 'ass-selected-row' : ''
                                      }
                                    >
                                      <CTooltip content={image?.Key || ''}>
                                        <span>
                                          {image.Key && image.Key.length > 20
                                            ? `${image.Key.slice(0, 20)}...`
                                            : image.Key || '-'}
                                        </span>
                                      </CTooltip>
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      <CTooltip content={image?.Type || ''}>
                                        <span>
                                          {image.Type && image.Type.length > 10
                                            ? `${image.Type.slice(0, 10)}...`
                                            : image.Type || '-'}
                                        </span>
                                      </CTooltip>
                                    </CTableDataCell>
                                    <CTableDataCell>{image.Size || '-'}</CTableDataCell>
                                    <CTableDataCell>
                                      {(image.LastModified && formattedDate(image.LastModified)) ||
                                        '-'}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      {/* {image.Url || '-'} */}

                                      {[
                                        constant.FILE_TYPE.IMAGE_JPEG,
                                        constant.FILE_TYPE.IMAGE_JPG,
                                        constant.FILE_TYPE.IMAGE_PNG,
                                      ].some((item) => item.includes(image.Type)) ? (
                                        <Link target="_blank" to={image.Url}>
                                          <FaEye />
                                        </Link>
                                      ) : (
                                        <Link to={image.Url}>
                                          <FaDownload />
                                        </Link>
                                      )}
                                    </CTableDataCell>
                                    <CTableDataCell></CTableDataCell>
                                  </CTableRow>
                                ))}
                            </CTableBody>
                          </CTable>
                        ) : (
                          <CRow>
                            {galleryImages
                              .filter((image) =>
                                image.Key.toLowerCase().includes(searchTerm.toLowerCase()),
                              )
                              .map((file, index) => (
                                <CCol
                                  key={index}
                                  md={4}
                                  lg={3}
                                  sm={6}
                                  xs={12}
                                  className="mb-2 text-center"
                                >
                                  <div
                                    className="position-relative rounded shadow-sm d-flex flex-column align-items-center justify-content-center ass-hover-effect"
                                    style={{
                                      border: '2px solid #ccc',
                                      borderRadius: '10px',
                                      minHeight: '200px',
                                      backgroundColor:
                                        selectedImages?.Key === file.Key ? '#c2e7ff' : '#f8f9fa',
                                    }}
                                    onClick={() => setSelectedImages(file)}
                                  >
                                    {/* <CFormCheck
                                      className="position-absolute"
                                      style={{
                                        position: 'absolute',
                                        top: '5px',
                                        left: '5px',
                                        zIndex: 1,
                                      }}
                                      checked={
                                        selectedImages &&
                                        selectedImages.some((item) => item.Key === file.Key)
                                      }
                                      // onChange={() => handleSelectImage(file)}
                                    /> */}
                                    {/* <FaTrashAlt
                                      className="position-absolute"
                                      style={{
                                        top: '5px',
                                        right: '5px',
                                        cursor: 'pointer',
                                        color: 'red',
                                        fontSize: '1.2rem',
                                      }}
                                      // onClick={() => handleDelete(file.id)}
                                    /> */}
                                    {/* <FaEllipsisV 
                                      className="position-absolute py-1 rounded"
                                      color='#000'
                                      style={{
                                        top: '5px',
                                        right: '5px',
                                        cursor: 'pointer',
                                        backgroundColor: 'grey',
                                        fontSize: '1.5rem',
                                      }}
                                     /> */}
                                    <p
                                      className="my-2 text-muted text-center"
                                      style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        wordBreak: 'break-word',
                                      }}
                                    >
                                      <CTooltip key={index} content={file.Key || 'No Name'}>
                                        <span>
                                          {file.Key.length > 15
                                            ? file.Key.substring(0, 15) + '...'
                                            : file.Key}
                                        </span>
                                      </CTooltip>
                                    </p>
                                    {[
                                      constant.FILE_TYPE.IMAGE_JPEG,
                                      constant.FILE_TYPE.IMAGE_JPG,
                                      constant.FILE_TYPE.IMAGE_PNG,
                                    ].some((item) => item.includes(file.Type)) ? (
                                      <CImage
                                        src={file.Url}
                                        alt={file.Key}
                                        className="img-fluid rounded"
                                        style={{
                                          objectFit: 'cover',
                                          maxHeight: '150px',
                                          width: '90%',
                                          height: '120px',
                                        }}
                                      />
                                    ) : [
                                        constant.FILE_TYPE.VIDEO_MP4,
                                        constant.FILE_TYPE.VIDEO_MKV_EXT,
                                        constant.FILE_TYPE.VIDEO_AVI_EXT,
                                      ].some((item) => item.includes(file.Type)) ? (
                                      <video
                                        style={{
                                          maxHeight: '150px',
                                          width: '90%',
                                          height: '120px',
                                        }}
                                        // width="150"
                                        controls
                                      >
                                        <source src={file.Url} type={`video/${file.Type}`} />
                                        Your browser does not support the video tag.
                                      </video>
                                    ) : [constant.FILE_TYPE.PDF, constant.FILE_TYPE.DOC].some(
                                        (item) => item.includes(file.Type),
                                      ) ? (
                                      <FaFilePdf size={50} color="red" />
                                    ) : [
                                        constant.FILE_TYPE.XLS,
                                        constant.FILE_TYPE.XLSX,
                                        'xlsx',
                                      ].some((item) => item.includes(file.Type)) ? (
                                      <FaFileExcel size={50} color="green" />
                                    ) : (
                                      <p>Unsupported file type</p>
                                    )}
                                    <p
                                      className="mt-2 mb-1 text-muted text-center"
                                      style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        wordBreak: 'break-word',
                                      }}
                                    >
                                      <span>{formattedDate(file.LastModified)}</span>
                                    </p>
                                  </div>
                                </CCol>
                              ))}
                          </CRow>
                        )}
                        <div className="d-flex justify-content-center mt-3">
                          {galleryImages.length > 0 && (
                            <CButton
                              className="primary rounded-pill px-4"
                              size="sm"
                              color="primary"
                              onClick={(e) => setLimit((prev) => prev + 4)}
                            >
                              {loading ? (
                                <>
                                  Load More <CSpinner size="sm" />
                                </>
                              ) : (
                                'Load More'
                              )}
                            </CButton>
                          )}
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>

                  <CCol md="3" lg="3">
                    <CCard style={{ position: 'sticky', top: '120px', zIndex: 1000 }}>
                      <CCardBody>
                        <h5>Image Info</h5>
                        <hr />
                        {selectedImages && (
                          <>
                            <CCol className="mb-4">
                              <CHeader>
                                <strong>Name:</strong>
                                <span style={{ wordWrap: 'break-word' }}>
                                  {selectedImages.Key || '-'}
                                </span>
                              </CHeader>
                              <CHeader>
                                <strong>Type:</strong>
                                <span>{selectedImages?.Type || '-'}</span>
                              </CHeader>
                              <CHeader>
                                <strong>Size:</strong>
                                <span>{selectedImages.Size || '-'}</span>
                              </CHeader>
                              <CHeader>
                                <strong>Modified Date:</strong>
                                <span style={{ wordWrap: 'break-word' }}>
                                  {selectedImages.LastModified || '-'}
                                </span>
                              </CHeader>
                            </CCol>
                            <h5>Link Info</h5>
                            <hr />
                            {'-'}
                            <hr />
                            <CButton
                              className="primary rounded-pill px-4"
                              style={{ color: '#fff' }}
                              size="sm"
                              color="danger"
                              onClick={(e) => handleDelete(e)}
                            >
                              Remove Image
                            </CButton>
                          </>
                        )}
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CToaster ref={toaster} push={toasts} placement="top-end" />

      {/* </CContainer> */}
    </>
  )
}

export default ImageGallery
