import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CFormCheck,
  CPagination,
  CPaginationItem,
  CFormInput,
  CRow,
  CCol,
  CFormSelect,
  CFormLabel,
  CForm,
  CToast,
  CToaster,
  CTooltip,
} from '@coreui/react'

import _, { replace } from 'lodash'
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFileExcel,
  FaFilePdf,
  FaEdit,
  FaTrash,
  FaEye,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleDoubleRight,
  FaAngleRight,
  FaLink,
  FaExternalLinkAlt,
} from 'react-icons/fa'
import { ToastMessage } from '../../../components/ToastMessage'
import { deleteProperty, getPropertyList } from '../../../models/propertyModel'
import { useDebounce } from '../../../hooks/useDebounce'
import Loader from '../../../utils/Loader'
import { constant } from '../../../utils/constant'
import { useSelector } from 'react-redux';
import { deletePropertyEnquiry, getPropertyEnquiryList } from '../../../models/enquiryModel'
import { formattedDate } from '../../../utils/date'

const ListPropertyEnquiry = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { users } = useSelector((state) => state.auth);
  
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page');
  const perpage = searchParams.get('perpage');

  const [searchTerm, setSearchTerm] = useState('')
  const [stepTerm, setStepTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(Number(page) || 1)
  const [itemsPerPage, setItemsPerPage] = useState(Number(perpage) || 5)
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  const [selectedMembers, setSelectedMembers] = useState([])
  const [currentMembers, setCurrentMembers] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [actionValue, setActionValue] = useState('')
  const [loading, setLoading] = useState(false)

  const [toast, addToast] = useState(0)
  
  const toaster = useRef()
  const debounceValue = useDebounce(searchTerm, 500)
  
  const handleSearch = (event) => {
    const value = event.target.value
    setSearchTerm(value)
  }

  const handleStepSearch = (event) => {
    const value = event.target.value
    if (value !== '-1') {
      console.log(value)
      setStepTerm(value)
    }
  }

  const handleVisitExternalLink = (id, project_type = null) => {
    console.log(id, project_type)
    if (_.toUpper(project_type) === constant.PROJECT_ATTR.RENT) {
      window.open(`${constant.FRONT_BASE_URL}/PropertyDetailsPage/${id}`, '_blank')
    }
    if (_.toUpper(project_type) === constant.PROJECT_ATTR.BUY) {
      window.open(`${constant.FRONT_BASE_URL}/PropertyDetailsPage/${id}`, '_blank')
    } else {
      window.open(`${constant.FRONT_BASE_URL}/Builder/${id}`, '_blank')
    }
  }

  const handleItemsPerPageChange = async (event) => {
    setItemsPerPage(() => parseInt(event.target.value))
    setCurrentPage(1) // Reset to first page on items per page change
  }

  // Pagination section
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const getPageNumbers = () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const pageNumbers = []
    let startPage = Math.max(currentPage - 2, 1)
    let endPage = Math.min(currentPage + 2, totalPages)

    if (currentPage === 1) {
      endPage = Math.min(startPage + 4, totalPages)
    }

    if (currentPage === totalPages) {
      startPage = Math.max(endPage - 4, 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }
    return pageNumbers;
  }

  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        return <FaSortUp />
      } else if (sortConfig.direction === 'desc') {
        return <FaSortDown />
      }
    }
    return <FaSort />
  }

  const handleSelectAll = () => {
    if (selectedMembers.length === currentMembers.length) {
      setSelectedMembers([])
    } else {
      setSelectedMembers(currentMembers)
    }
  }

  const handleSelectUser = (user) => {
    setSelectedMembers((prevSelectedMembers) => {
      if (prevSelectedMembers.includes(user)) {
        return prevSelectedMembers.filter((selectedUser) => selectedUser !== user)
      } else {
        return [...prevSelectedMembers, user]
      }
    })
  }

  const actionOptions = [
    { value: '', label: 'With selected...' },
    { value: 'delete', label: 'Delete' },
  ]

  const handleAction = async (action) => {
    console.log(action, actionValue)
    if (selectedMembers.length <= 0) {
      const toastContent = <ToastMessage type="error" message="Atleast select one row!" />
      addToast(toastContent)
      return
    }
    if (action === 'delete') {
      // Implement delete functionality
      try {
        const ids = selectedMembers.map((data) => data?.book_id)

        console.log('ids:', ids)
        const result = { message: 'Deleted successfully!', affectedRow: 1 }
        // const result = await deleteMultipleAdminUsers();
        if (result.affectedRow > 0) {
          const toastContent = <ToastMessage type="success" message={result.message} />
          addToast(toastContent)
          loadSubscription()
          setSelectedMembers([])
        }
        // alert('Delete action on selected users');
      } catch (error) {
        const toastContent = <ToastMessage type="error" message={error.message} />
        addToast(toastContent)
        console.error('Error:', error.message)
      }
    }
  }

  const loadPropertyData = async () => {
    try {
      setLoading(true)
      const offset = currentPage

      const result = await getPropertyEnquiryList(
        offset,
        itemsPerPage,
        sortConfig.direction,
        sortConfig.key,
        searchTerm,
      )
      console.log(result.data)
      setCurrentMembers(() => result.data.enquiry)
      setTotalItems(result.data.totalCounts)
      
      setLoading(false)
    } catch (error) {
      console.log('Error: ', error)
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPropertyData()    
    return () => {}
  }, [itemsPerPage, currentPage, sortConfig, debounceValue, stepTerm])


  const handleDelete = async (id) => {
    let confirmDelete = confirm('Are you sure to remove?', 'message')
    if (confirmDelete) {
      try {
        setLoading(true)
        console.log(id)
        const result = await deletePropertyEnquiry(id)
        console.log('UI:', result)
        if (result) {
          loadPropertyData()
          const toastContent = (
            <ToastMessage type="success" message={result.data.message} onClick="close" />
          )
          addToast(toastContent)
        }
        setLoading(false)
      } catch (error) {
        console.log('Error: ', error)
        const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
        addToast(toastContent)
        setLoading(false)
      }
    }
  }

  const handleEditAction = (id, isEdit = true) => {
    console.log(id)
    navigate(`/properties/view/${id}?isEdit=${isEdit}`)
  }

  const resetDataHandler = () => {
    setSearchTerm('')
    setStepTerm('')
    setCurrentPage(1)
    setItemsPerPage(20);
  }
  
  const exportPDF = () => {}
  const exportExcel = () => {}

  return (
    <>
      {loading && <Loader />}
      <CCard className="mb-4">
        <CCardHeader className="d-flex">
          <strong>Enquiry List</strong>
          <CCol className="d-flex justify-content-end">
            {/* <CButton onClick={() => navigate('/properties/add')} color="primary">
              Add New
            </CButton> */}
            {/* <h1>Member Users</h1> */}
          </CCol>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol
              sm={6}
              md={4}
              lg={3}
              className="d-flex align-items-center justify-content-center mb-2"
            >
              <CFormLabel htmlFor="inputPassword" className="me-2 col-form-label">
                Search:
              </CFormLabel>
              <CFormInput
                placeholder="Search"
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={handleSearch}
              />
            </CCol>
           
            <CCol
              sm={6}
              md={4}
              lg={3}
              className="d-flex align-items-center justify-content-center mb-2"
            >
              <CButton
                color="primary"
                // size="sm"
                className="me-2"
                onClick={() => loadPropertyData()}
              >
                Refresh
              </CButton>
              <CButton
                color="primary"
                onClick={() =>
                  resetDataHandler()
                }
              >
                Clear
              </CButton>
            </CCol>
          </CRow>
          <CRow>
           
          </CRow>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>
                  {/* <CFormCheck /> */}
                  <CFormCheck
                    checked={selectedMembers.length === currentMembers.length}
                    onChange={handleSelectAll}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('id')}>
                  Id {getSortIcon('id')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('user_type')}>
                  Name {getSortIcon('user_type')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('property_type')}>
                  Mobile {getSortIcon('property_type')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('property_title')}>
                  Email {getSortIcon('property_title')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('city_name')}>
                  Property Title {getSortIcon('city_name')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('locality')}>
                  Locality {getSortIcon('locality')}
                </CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            {currentMembers.length <= 0 && <CFormLabel>No Enquiry found.</CFormLabel>}
            <CTableBody>
              {currentMembers.length > 0 &&
                currentMembers.map((property, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>
                      {/* <CFormCheck /> */}
                      <CFormCheck
                        checked={selectedMembers.includes(property)}
                        onChange={() => handleSelectUser(property)}
                      />
                    </CTableDataCell>
                    <CTableDataCell>{property.id}</CTableDataCell>
                    <CTableDataCell>{property.name}</CTableDataCell>
                    <CTableDataCell>{property.phone || '-'} </CTableDataCell>
                    <CTableDataCell>{property.email || '-'} </CTableDataCell>
                    <CTableDataCell>
                      {property.property_title && property.property_title.length > 25
                        ? `${property.property_title.slice(0, 25)}..`
                        : property.property_title || '-'}{' '}
                    </CTableDataCell>
                    <CTableDataCell>{ formattedDate( property.created_at ) || '-'}</CTableDataCell>
                    
                    <CTableDataCell>
                      <CTooltip content="Delete Property" placement="top">
                        <CButton
                          onClick={() => handleDelete(property.id)}
                          size="sm"
                          color="danger"
                          className="me-2 mb-1"
                        >
                          <FaTrash color="white" />
                        </CButton>
                      </CTooltip>

                    </CTableDataCell>
                  </CTableRow>
                ))}
            </CTableBody>
          </CTable>
          <CRow className="mt-3">
            <CCol md="6">
              <CPagination align="start">
                <CPaginationItem disabled={currentPage === 1} onClick={() => paginate(1)}>
                  <FaAngleDoubleLeft />
                </CPaginationItem>
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                >
                  <FaAngleLeft />
                </CPaginationItem>
                {getPageNumbers().map((pageNumber) => (
                  <CPaginationItem
                    key={pageNumber}
                    active={currentPage === pageNumber}
                    onClick={() => paginate(pageNumber)}
                  >
                    {pageNumber}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                  onClick={() => paginate(currentPage + 1)}
                >
                  <FaAngleRight />
                </CPaginationItem>
                <CPaginationItem
                  disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                  onClick={() => paginate(Math.ceil(totalItems / itemsPerPage))}
                >
                  <FaAngleDoubleRight />
                </CPaginationItem>
              </CPagination>
            </CCol>
            <CCol md="6" className="d-flex align-items-center justify-content-end">
              <CFormLabel className="me-2">Per Page:</CFormLabel>
              <CFormSelect
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e)}
                style={{ width: 'auto' }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  )
}

export default ListPropertyEnquiry
