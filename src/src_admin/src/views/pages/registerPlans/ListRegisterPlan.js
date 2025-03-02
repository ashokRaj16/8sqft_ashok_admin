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
import { ToastMessage } from '@component/ToastMessage'
import { getRegisterPlans } from '@model/registerPlansModel'
import { useDebounce } from '@hook/useDebounce'
import { formattedDate } from '@util/date'
import { deleteRegisterPlans } from '@model/registerPlansModel'
import Loader from '@util/Loader'

const getStatusBadge = (status) => {
  switch (status) {
    case 'SUCCESS':
      return 'success'
    case 'PENDING':
      return 'secondary'
    case 'CREATED':
      return 'info'
    case 'CAPTURE':
      return 'primary'
    default:
      return 'primary'
  }
}

const ListRegisterPlan = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  const [selectedRegisterPlans, setSelectedRegisterPlans] = useState([])
  const [currentRegisterPlans, setCurrentRegisterPlans] = useState([])
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
    if (selectedRegisterPlans.length === currentRegisterPlans.length) {
      setSelectedRegisterPlans([])
    } else {
      setSelectedRegisterPlans(currentRegisterPlans)
    }
  }

  const handleSelectUser = (plan) => {
    setSelectedRegisterPlans((prevSelected) => {
      if (prevSelected.includes(plan)) {
        return prevSelected.filter((selectedRegister) => selectedRegister !== plan)
      } else {
        return [...prevSelected, plan]
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
    if (selectedRegisterPlans.length <= 0) {
      const toastContent = <ToastMessage type="error" message="Atleast select one row!" />
      addToast(toastContent)
      return
    }
    if (action === 'delete') {
      // Implement delete functionality
      try {
        const ids = selectedRegisterPlans.map((data) => data?.book_id)

        console.log('ids:', ids)
        const result = { message: 'Deleted successfully!', affectedRow: 1 }
        // const result = await deleteMultipleAdminUsers();
        if (result.affectedRow > 0) {
          const toastContent = <ToastMessage type="success" message={result.message} />
          addToast(toastContent)
          loadSubscription()
          setSelectedRegisterPlans([])
        }
        // alert('Delete action on selected users');
      } catch (error) {
        const toastContent = <ToastMessage type="error" message={error.message} />
        addToast(toastContent)
        console.error('Error:', error.message)
      }
    }
  }

  const loadRegisterPlansData = async () => {
    try {
      const offset = currentPage - 1
      const result = await getRegisterPlans(
        offset,
        itemsPerPage,
        sortConfig.direction,
        sortConfig.key,
        searchTerm,
      )
      console.log(result)
      setCurrentRegisterPlans(() => result.data.plans)
      setTotalItems(result.data.totalCounts)
    } catch (error) {
      console.log('Error: ', error)
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
    }
  }

  const handleDelete = async (id) => {
    let confirmDelete = confirm('Are you sure to remove?' + id, 'message')
    if (confirmDelete) {
      try {
        setLoading(true)
        console.log(id)
        const result = await deleteRegisterPlans(id);
        console.log('UI:', result)
        if (result) {
          loadRegisterPlansData()
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

  const handleEditAction = (id) => {
    console.log(id)
    navigate(`/subscription/view/${id}`)
    return plansModel(true);
  }

  useEffect(() => {
    loadRegisterPlansData()

    return () => {}
  }, [itemsPerPage, currentPage, sortConfig, debounceValue])

  const exportPDF = () => {}
  const exportExcel = () => {}

  return (
    <>
      {loading && <Loader />}
      <CCard className="mb-4">
        <CCardHeader className="d-flex">
          <strong>Register Plans Details</strong>
          <CCol className="d-flex justify-content-end">
            {/* <CButton onClick={() => navigate('/member/add')} color="primary">
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
                onClick={() => loadRegisterPlansData()}
              >
                Refresh
              </CButton>
              <CButton color="primary" onClick={() => setSearchTerm('')}>
                Clear
              </CButton>
            </CCol>
          </CRow>
          <CRow>
           
          </CRow>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                {/* <CTableHeaderCell>
                  <CFormCheck
                    checked={selectedRegisterPlans.length === currentRegisterPlans.length}
                    onChange={handleSelectAll}
                  />
                </CTableHeaderCell> */}
                <CTableHeaderCell onClick={() => requestSort('id')}>
                  Id {getSortIcon('id')}
                </CTableHeaderCell>                
                <CTableHeaderCell onClick={() => requestSort('order_id')}>
                  Order Id {getSortIcon('order_id')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('order_amount')}>
                  Amount {getSortIcon('order_amount')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('fname')}>
                  Member Name {getSortIcon('fname')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('email')}>
                  Plan Title {getSortIcon('email')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('mobile')}>
                  Plan Name {getSortIcon('mobile')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('payment_status')}>
                  Status {getSortIcon('payment_status')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('payment_mode')}>
                  Mode {getSortIcon('payment_mode')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('created_at')}>
                  Created Date {getSortIcon('created_at')}
                </CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentRegisterPlans.map((plan, index) => (
                <CTableRow key={index}>                  
                  <CTableDataCell>{plan.sub_id}</CTableDataCell>
                  <CTableDataCell>{plan.order_id}</CTableDataCell>
                  <CTableDataCell>{plan.order_amount}</CTableDataCell>
                  <CTableDataCell>{`${plan.fname || ''} ${plan.lname || ''} `}</CTableDataCell>
                  <CTableDataCell>{plan.plan_title}</CTableDataCell>
                  <CTableDataCell>{plan.plan_names}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getStatusBadge(`${plan.payment_status || ''}`)}>{plan.payment_status.toUpperCase() || '-'}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{plan?.payment_mode || '-'}</CTableDataCell>
                  <CTableDataCell>{formattedDate(plan?.created_at) || '-'}</CTableDataCell>
                  
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      color="primary"
                      onClick={() => handleEditAction(plan.sub_id)}
                      className="me-2 mb-1"
                    >
                      <FaEye />
                    </CButton>
                    
                    <CButton
                      size="sm"
                      color="danger"
                      onClick={() => handleDelete(plan.sub_id)}
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

export default ListRegisterPlan
