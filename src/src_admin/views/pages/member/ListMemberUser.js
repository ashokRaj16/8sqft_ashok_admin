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

const getVerificationBadge = (status) => {
  switch (status) {
    case 'verified':
      return 'success'
    case 'Inverified':
      return 'secondary'
    default:
      return 'primary'
  }
}

const getStatusBadge = (status) => {
  switch (status) {
    case 'inactive':
      return 'secondary'
    case 'active':
      return 'success'
    case 'pending':
        return 'secondary'
    case 'blocked':
      return 'secondary'
    case 'disabled':
      return 'secondary'
    case 'suspended':
      return 'secondary'
    case 'rejected':
      return 'secondary'
    default:
      return 'primary'
  }
}

const ListMemberUser = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  const [selectedMembers, setSelectedMembers] = useState([])
  const [currentMembers, setCurrentMembers] = useState([])
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

  //   const sortedMembers = [...membersData].sort((a, b) => {
  //     if (sortConfig.key) {
  //       if (sortConfig.direction === 'ascending') {
  //         return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
  //       } else if (sortConfig.direction === 'descending') {
  //         return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  //       }
  //     }
  //     return 0;
  //   });

  //   const filteredMembers = sortedMembers.filter(user =>
  //     user.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

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

  const loadMemberData = async () => {
    try {
      const offset = currentPage - 1
      const result = await getMemberUser(
        offset,
        itemsPerPage,
        sortConfig.direction,
        sortConfig.key,
        searchTerm,
      )
      console.log(result)
      setCurrentMembers(() => result.data.users)
      setTotalItems(result.data.totalCounts)
    } catch (error) {
      console.log('Error: ', error)
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
    }
  }

  const handleDelete = async (id) => {
    let confirmDelete = confirm('Are you sure to remove?', 'message')
    if (confirmDelete) {
      try {
        setLoading(true)
        console.log(id)
        const result = await deleteMemberUser(id)
        console.log('UI:', result)
        if (result) {
          loadMemberData()
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
  }

  const handleViewAction = (id) => {
    console.log(id)
    navigate(`/member/view/${id}`)
  }

  const handleEditAction = (id) => {
    console.log(id)
    navigate(`/member/edit/${id}`)
  }

  useEffect(() => {
    loadMemberData()

    return () => {}
  }, [itemsPerPage, currentPage, sortConfig, debounceValue])

  const exportPDF = () => {}
  const exportExcel = () => {}

  return (
    <>
      {loading && <Loader />}
      <CCard className="mb-4">
        <CCardHeader className="d-flex">
          <strong>Member List</strong>
          <CCol className="d-flex justify-content-end">
            <CButton onClick={() => navigate('/member/add')} color="primary">
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
          <CRow>
            {/* <CCol md="4" className="d-flex mb-3 justify-content-end">
          <CFormSelect
            className="me-3"
            value={actionValue}
            onChange={(e) => setActionValue(e.target.value)}
          >
            {actionOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </CFormSelect>
              <CButton 
                  color="primary" 
                  size="sm" 
                  onClick={() => handleAction(actionValue)}
                  >
                  Submit
              </CButton>
          </CCol>

          <CCol className="d-flex justify-content-end">
              <CButton 
                  color="success" 
                  size='sm'
                  className="me-2 mb-2 rounded" 
                  onClick={exportExcel}>
                  <FaFileExcel color='white' />
              </CButton>
              <CButton 
                  color="danger" 
                  size='sm'
                  className="ml-2 mb-2"
                  onClick={exportPDF} >
                  <FaFilePdf color='white' />
              </CButton>
          </CCol> */}
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
                <CTableHeaderCell onClick={() => requestSort('fname')}>
                  Full Name {getSortIcon('fname')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('email')}>
                  email {getSortIcon('email')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('mobile')}>
                  mobile {getSortIcon('mobile')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('is_verified')}>
                  Verified {getSortIcon('is_verified')}
                </CTableHeaderCell>
                <CTableHeaderCell>
                  Status
                </CTableHeaderCell>
                <CTableHeaderCell>Created Date</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentMembers.map((member, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>
                    {/* <CFormCheck /> */}
                    <CFormCheck
                      checked={selectedMembers.includes(member)}
                      onChange={() => handleSelectUser(member)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{member.id}</CTableDataCell>
                  <CTableDataCell>{`${member.fname} ${member?.mname || ''} ${member.lname} `}</CTableDataCell>
                  <CTableDataCell>{member.email}</CTableDataCell>
                  <CTableDataCell>{member.mobile}</CTableDataCell>
                  <CTableDataCell>
                    {member.is_verified === '1' ? (
                      <CBadge color={getVerificationBadge('verified')}>Yes</CBadge>
                    ) : (
                      <CBadge color={getVerificationBadge('Inverified')}>No</CBadge>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    { member.status === '0' ? (
                      <CBadge color={getStatusBadge('inactive')}>Inactive</CBadge>
                    ) : member.status === '1' ? (
                      <CBadge color={getStatusBadge('active')}>Active</CBadge>
                    ) : member.status === '2' ? (
                      <CBadge color={getStatusBadge('pending')}>Pending</CBadge>
                    ) : member.status === '3' ? (
                      <CBadge color={getStatusBadge('blocked')}>Blocked</CBadge>
                    ) : member.status === '4' ? (
                      <CBadge color={getStatusBadge('disabled')}>Disabled</CBadge>
                    ) : member.status === '5' ? (
                      <CBadge color={getStatusBadge('suspended')}>Suspended</CBadge>
                    ) : (
                      <CBadge color={getStatusBadge('rejected')}>Rejected</CBadge>
                    )
                  }
                  </CTableDataCell>
                  <CTableDataCell>{formattedDate(member?.created_at) || '-'}</CTableDataCell>
                  {/* <CTableDataCell>
                  <CBadge color={getStatusBadge(member.status)}>
                    {member.status}
                  </CBadge>
                </CTableDataCell> */}
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      color="primary"
                      onClick={() => handleViewAction(member.id)}
                      className="me-2 mb-1"
                    >
                      <FaEye />
                    </CButton>
                    <CButton 
                      size="sm" 
                      color="primary" 
                      onClick={() => handleEditAction(member.id)}
                      className="me-2 mb-1">
                      <FaEdit />
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      onClick={() => handleDelete(member.id)}
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

export default ListMemberUser
