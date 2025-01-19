import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

} from '@coreui/react';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import * as XLSX from 'xlsx';
import { FaSort, FaSortUp, FaSortDown, FaFileExcel, FaFilePdf, FaEdit, FaTrash, FaEye, FaAngleDoubleLeft, FaAngleLeft, FaAngleDoubleRight, FaAngleRight } from 'react-icons/fa';
import { CIcon } from '@coreui/icons-react';
import { cilSortAscending, cilSortDescending, cilBell, cilDelete, cilEyedropper, cilPencil, cilScrubber, cilTrash, cilSortAlphaUp, cilClearAll } from '@coreui/icons'
import { deleteAdminUser, getAdminUser } from '../../../models/usersModel';
import { ToastMessage } from '../../../components/ToastMessage';
import { debounce } from 'lodash';
import { useDebounce } from './useDebounce';


const usersData = [
  { name: 'Samppa Nori', registered: 'March 1, 2021', role: 'Member', status: 'Active', imgSrc: 'path-to-img1.jpg' },
  { name: 'Estavan Lykos', registered: 'February 7, 2018', role: 'Staff', status: 'Banned', imgSrc: 'path-to-img2.jpg' },
  { name: 'Chetan Mohamed', registered: 'January 15, 2020', role: 'Admin', status: 'Inactive', imgSrc: 'path-to-img3.jpg' },
  { name: 'Derick Maximinus', registered: 'April 5, 2019', role: 'Member', status: 'Pending', imgSrc: 'path-to-img4.jpg' },
  { name: 'Friderik Dávid', registered: 'March 25, 2022', role: 'Staff', status: 'Active', imgSrc: 'path-to-img5.jpg' },
];

const getStatusBadge = (status) => {
  switch (status) {
    case 'Active':
      return 'success';
    case 'Inactive':
      return 'secondary';
    case 'Pending':
      return 'warning';
    case 'Banned':
      return 'danger';
    default:
      return 'primary';
  }
};


const ListAdminUser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [actionValue, setActionValue] = useState('');
  
  const [toast, addToast] = useState(0);
  const navigate = useNavigate();
  const toaster = useRef();
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  // const handleSearch = (event) => {
  //   setSearchTerm(event.target.value);
  //   console.log(event.target)
  // };

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);


  const handleItemsPerPageChange = async (event) => {
    setItemsPerPage(() => parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page on items per page change
    // await loadAdminUser()
  };

  const sortedUsers = [...usersData].sort((a, b) => {
    if (sortConfig.key) {
      if (sortConfig.direction === 'ascending') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      } else if (sortConfig.direction === 'descending') {
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination section
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageNumbers = [];
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(currentPage + 2, totalPages);

    if (currentPage === 1) {
      endPage = Math.min(startPage + 4, totalPages);
    }

    if (currentPage === totalPages) {
      startPage = Math.max(endPage - 4, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        return <FaSortUp />;
      } else if (sortConfig.direction === 'desc') {
        return <FaSortDown />;
      }
    }
    return <FaSort />;
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUsers(prevSelectedUsers => {
      if (prevSelectedUsers.includes(user)) {
        return prevSelectedUsers.filter(selectedUser => selectedUser !== user);
      } else {
        return [...prevSelectedUsers, user];
      }
    });
  };

  const actionOptions = [
    { value: '', label: 'With selected...' },
    { value: 'delete', label: 'Delete' },
    // Add more actions as needed
  ];
  

  const handleAction = async (action) => {
    console.log(action, actionValue)
    if(selectedUsers.length <= 0){
      const toastContent = (
        <ToastMessage
        type="error"
        message="Atleast select one row!" />
      )
      addToast(toastContent)
      return;
    }
    if (action === 'delete') {
      // Implement delete functionality
      try{
        const ids = selectedUsers.map((data) => ( data?.book_id ));

        console.log("ids:",ids)
        const result= { message: 'Deleted successfully!', affectedRow : 1};
      // const result = await deleteMultipleAdminUsers();
      if(result.affectedRow > 0) {
        const toastContent = (
          <ToastMessage
          type="success"
          message={result.message} />
        )
        addToast(toastContent)
        loadAdminUser();
        setSelectedUsers([]);
      }
      // alert('Delete action on selected users');
    } catch (error) {
      const toastContent = (
        <ToastMessage
        type="error"
        message={ error.message } />
      )
      addToast(toastContent)
      console.error('Error:', error.message);
    }
  }
  };

  const loadAdminUser = async (offset = 0, per_page = 20, sortOrder = 'asc', sortColumn = '', searchFilter = '' ) => {
    try{

        const offset = (currentPage - 1);
        const result = await getAdminUser(offset, itemsPerPage, sortConfig.direction, sortConfig.key, searchTerm);
        console.log(result);
        if(result) {
          // setCurrentUsers(() => result.payload.book_list)
          // setTotalItems(result.payload.total_count);
        }
    }
    catch (error) {
        console.log("Error: ",error);
        const toastContent = (
            <ToastMessage
                type="error"
                message={error.message}
                onClick="close" />
        )
        addToast(toastContent)
    }
  }

  useEffect(() => {

    loadAdminUser(currentPage, itemsPerPage, sortConfig.direction, sortConfig.key, searchTerm);

    return () => {}
  }, [itemsPerPage, currentPage, sortConfig, debouncedSearchTerm]);


  const exportPDF = () => {}
  const exportExcel = () => {}
  
//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.autoTable({
//       head: [['Name', 'Registered', 'Role', 'Status']],
//       body: filteredUsers.map(user => [user.name, user.registered, user.role, user.status])
//     });
//     doc.save('users.pdf');
//   };

//   const exportExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
//     XLSX.writeFile(workbook, 'users.xlsx');
//   };

  return (
    <>
     <CCard className="mb-4">
    <CCardHeader className='d-flex'>
    <strong>Admin Users</strong>
    <CCol className="d-flex justify-content-end">

      <CButton
        onClick={() => navigate('/admin/add')} 
        color='primary'>Add New</CButton>
    {/* <h1>Member Users</h1> */}
    </CCol>
    </CCardHeader>
    <CCardBody>
    
        <CRow className="mb-3">
        <CCol sm={6} md={4} lg={3} className="d-flex align-items-center justify-content-center mb-2" >
            <CFormLabel htmlFor="inputPassword" className="me-2 col-form-label">
                Search:
            </CFormLabel>
          <CFormInput 
            placeholder="Search" 
            type="text"
            name='search' 
            id="search"
            value={searchTerm}
            onChange={handleSearch}
              />
        </CCol>
          <CCol sm={6} md={4} lg={3} className="d-flex align-items-center justify-content-center mb-2" >
            <CButton 
                color="primary" 
                // size="sm"
                className='me-2' 
                onClick={() => loadAdminUser()}
                >
                Refresh
            </CButton>
            <CButton 
                color="primary" 
                onClick={() => setSearchTerm('')}
                >
                Clear
            </CButton>
          </CCol>
        </CRow>
        <CRow>
        <CCol md="4" className="d-flex mb-3 justify-content-end">
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
        {/* <CRow className="mb-3 "> */}
        <CCol className="d-flex justify-content-end">
            <CButton 
                color="success" 
                className="me-2 mb-2" 
                onClick={exportExcel}>
                <FaFileExcel color='white' />
            </CButton>
            <CButton 
                color="danger" 
                className="ml-2 mb-2"
                onClick={exportPDF} >
                <FaFilePdf color='white' />
            </CButton>
        </CCol>
        {/* </CRow> */}
        </CRow>
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>
              {/* <CFormCheck /> */}
              <CFormCheck
                checked={selectedUsers.length === currentUsers.length}
                onChange={handleSelectAll}
              />
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort('book_id')}>
              Id {getSortIcon('book_id')}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort('name')}>
              Name {getSortIcon('name')}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort('registered')}>
              Registered {getSortIcon('registered')}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort('role')}>
              Role {getSortIcon('role')}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort('status')}>
              Status {getSortIcon('status')}
            </CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentUsers && currentUsers.map((user, index) => (
            <CTableRow key={index}>
              <CTableDataCell>
                {/* <CFormCheck /> */}
                <CFormCheck
                  checked={selectedUsers.includes(user)}
                  onChange={() => handleSelectUser(user)}
                />
              </CTableDataCell>
              <CTableDataCell>{user.book_id}</CTableDataCell>
              <CTableDataCell>{user.book_series}</CTableDataCell>
              <CTableDataCell>{user.book_author}</CTableDataCell>
              <CTableDataCell>{user.book_price}</CTableDataCell>
              <CTableDataCell>
                <CBadge color={getStatusBadge(user.status)}>
                  {user.status}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell>
                <CButton color="primary" className="me-2 mb-1">
                    <FaEye />
                </CButton>
                <CButton color="primary" className="me-2 mb-1">
                    <FaEdit />
                </CButton>
                <CButton color="danger" className="me-2 mb-1">
                    <FaTrash color='white' />
                </CButton>
            </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <CRow className="mt-3">
        <CCol md="6">
          {/* <CPagination align="start">
            <CPaginationItem disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>
              Previous
            </CPaginationItem>
            {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, index) => (
              <CPaginationItem
                key={index + 1}
                active={currentPage === index + 1}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
              onClick={() => paginate(currentPage + 1)}
            >
              Next
            </CPaginationItem>
          </CPagination> */}
          <CPagination align="start">
        <CPaginationItem 
          disabled={currentPage === 1} 
          onClick={() => paginate(1)}>
          <FaAngleDoubleLeft />
        </CPaginationItem>
        <CPaginationItem 
          disabled={currentPage === 1} 
          onClick={() => paginate(currentPage - 1)}>
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
            <CFormLabel className="me-2">
                Per Page: 
            </CFormLabel>
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
  );
};

export default ListAdminUser;
