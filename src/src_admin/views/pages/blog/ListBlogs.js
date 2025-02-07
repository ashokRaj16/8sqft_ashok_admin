import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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
} from '@coreui/react'
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import * as XLSX from 'xlsx';
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
} from 'react-icons/fa'
import { ToastMessage } from '../../../components/ToastMessage'
import { deleteMemberUser, getMemberUser } from '../../../models/usersModel'
import { useDebounce } from '../../../hooks/useDebounce'
import Loader from '../../../utils/Loader'
import { formattedDate } from '../../../utils/date'
import { deleteBlog, getBlog } from '../../../models/blogModel'

const getStatusBadge = (status) => {
  switch (status) {
    case 'verified':
      return 'success'
    case 'Inverified':
      return 'secondary'
    default:
      return 'primary'
  }
}

const ListBlogs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  const [selectedBlogs, setSelectedBlogs] = useState([])
  const [currentBlogs, setCurrentBlogs] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [actionValue, setActionValue] = useState('')
  const [loading, setLoading] = useState(false)

  const [toast, addToast] = useState(0)
  const navigate = useNavigate()
  const toaster = useRef()
  const debounceValue = useDebounce(searchTerm, 500)

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
    console.log(event.target)
  }

  const handleItemsPerPageChange = async (event) => {
    setItemsPerPage(() => parseInt(event.target.value))
    setCurrentPage(1) // Reset to first page on items per page change
    // await loadSubscription()
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

    return pageNumbers
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
    // Add more actions as needed
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

  const loadBlogData = async () => {
    try {
      const offset = currentPage - 1
      const result = await getBlog(
        offset,
        itemsPerPage,
        sortConfig.direction,
        sortConfig.key,
        searchTerm,
      )
      console.log(result)
      setCurrentBlogs(() => result.data.blogs)
      setTotalItems(result.data.totalCounts)
    } catch (error) {
      console.log('Error: ', error)
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      console.log(id)
      const result = await deleteBlog(id)
      console.log('UI:', result)
      if (result) {
        loadBlogData()
        const toastContent = (
          <ToastMessage type="success" message={result.data.message} onClick="close" />
        )
        addToast(toastContent)
      }
      setLoading(false)
    } catch (error) {
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
      setLoading(false)
    }
  }

  const handleEditAction = (id) => {
    console.log(id)
    navigate(`/blogs/view/${id}`)
  }

  useEffect(() => {
    loadBlogData()

    return () => {}
  }, [itemsPerPage, currentPage, sortConfig, debounceValue])

  const exportPDF = () => {}
  const exportExcel = () => {}

  return (
    <>
      {loading && <Loader />}
      <CCard className="mb-4">
        <CCardHeader className="d-flex">
          <strong>Blog Details</strong>
          <CCol className="d-flex justify-content-end">
            <CButton onClick={() => navigate('/blogs/add')} color="primary">
              Add New
            </CButton>
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
                onClick={() => loadSubscription()}
              >
                Refresh
              </CButton>
              <CButton color="primary" onClick={() => setSearchTerm('')}>
                Clear
              </CButton>
            </CCol>
          </CRow>

          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>
                  {/* <CFormCheck /> */}
                  <CFormCheck
                    checked={selectedBlogs.length === currentBlogs.length}
                    onChange={handleSelectAll}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('id')}>
                  Id {getSortIcon('id')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('fname')}>
                  Title {getSortIcon('fname')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('email')}>
                  Short Description {getSortIcon('email')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('mobile')}>
                  Category {getSortIcon('mobile')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('is_verified')}>
                  Tags {getSortIcon('is_verified')}
                </CTableHeaderCell>
                <CTableHeaderCell>Created Date</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentBlogs.map((blog, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>
                    {/* <CFormCheck /> */}
                    <CFormCheck
                      checked={selectedBlogs.includes(blog)}
                      onChange={() => handleSelectUser(blog)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{blog.title.length > 25 ? `${blog.title.slice(0, 25)} ...`  : blog.title || '-'}</CTableDataCell> 
                  <CTableDataCell>{blog.short_description.length > 25 ? `${blog.short_description.slice(0, 25)} ...`  : blog.short_description || '-'}</CTableDataCell> 
                  <CTableDataCell>{blog.cat_id || '-'}</CTableDataCell>
                  <CTableDataCell>{blog.tags}</CTableDataCell>
                  <CTableDataCell>{formattedDate(blog?.created_at) || '-'}</CTableDataCell>

                  <CTableDataCell>
                    <CButton
                      size="sm"
                      color="primary"
                      onClick={() => handleEditAction(blog.id)}
                      className="me-2 mb-1"
                    >
                      <FaEye />
                    </CButton>
                    {/* <CButton size="sm" color="primary" className="me-2 mb-1">
                      <FaEdit />
                    </CButton> */}
                    <CButton
                      size="sm"
                      color="danger"
                      onClick={() => handleDelete(blog.id)}
                      className="me-2 mb-1"
                    >
                      <FaTrash color="white" />
                    </CButton>
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
                <option value={15}>15</option>
                <option value={20}>20</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  )
}

export default ListBlogs
