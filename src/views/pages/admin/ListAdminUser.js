import React, { useEffect, useState, useRef } from 'react';
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
import { FaSort, FaSortUp, FaSortDown, FaFileExcel, FaFilePdf, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { CIcon } from '@coreui/icons-react';
import { cilSortAscending, cilSortDescending, cilBell, cilDelete, cilEyedropper, cilPencil, cilScrubber, cilTrash, cilSortAlphaUp, cilClearAll } from '@coreui/icons'
import { getAdminUser } from '../../../models/usersModel';
import { ToastMessage } from '../../../components/ToastMessage';

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

  const navigate = useNavigate();
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page on items per page change
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        return <FaSortUp />;
      } else if (sortConfig.direction === 'descending') {
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
    { value: 'delete', label: 'Delete' },
    // Add more actions as needed
  ];
  
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const handleAction = (action) => {
    const toastContent = (
        <ToastMessage
            type="success"
            message="Thanks!" />
    )
    addToast(toastContent)
      if (action === 'delete') {
          // Implement delete functionality
          alert('Delete action on selected users');
    }
  };


  const CallToAPI = async () => {
    try{
        const result = await getAdminUser();
        addToast(ToastMessage)
    }
    catch (error) {
        console.log("Error: ",error);
        const toastContent = (
            <ToastMessage
                type="error"
                message={error.message}
                onClick="close" />
        )
        // addToast(toastContent)
    }
}

  useEffect(() => {
    CallToAPI();

    return () => {}
  }, []);
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
          <CFormInput placeholder="Search" type="password" id="inputPassword" />
        </CCol>
        <CCol sm={6} md={4} lg={3} className="d-flex align-items-center justify-content-center mb-2" >
            <CFormLabel className="me-2" htmlFor="inputPassword" >
                Status: 
            </CFormLabel>
            <CFormInput
                type="text"
                placeholder="Status..."
                value={searchTerm}
                onChange={handleSearch}
                />
        </CCol>
        </CRow>
        <CRow>
        <CCol md="4" className="d-flex mb-3 justify-content-end">
          <CFormSelect
            className="me-3"
            options={actionOptions}
            placeholder="With selected..."
            onChange={(selectedOption) => handleAction(selectedOption.value)}
            />
            <CButton 
                color="primary" 
                size="sm" 
                onClick={() => handleAction(1)}
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
          {currentUsers.map((user, index) => (
            <CTableRow key={index}>
              <CTableDataCell>
                {/* <CFormCheck /> */}
                <CFormCheck
                  checked={selectedUsers.includes(user)}
                  onChange={() => handleSelectUser(user)}
                />
              </CTableDataCell>
              <CTableDataCell>{user.name}</CTableDataCell>
              <CTableDataCell>{user.registered}</CTableDataCell>
              <CTableDataCell>{user.role}</CTableDataCell>
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
          <CPagination align="start">
            <CPaginationItem disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>
              Previous
            </CPaginationItem>
            {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }, (_, index) => (
              <CPaginationItem
                key={index + 1}
                active={currentPage === index + 1}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)}
              onClick={() => paginate(currentPage + 1)}
            >
              Next
            </CPaginationItem>
          </CPagination>
        </CCol>
        <CCol md="6" className="d-flex align-items-center justify-content-end">
            <CFormLabel className="me-2">
                Per Page: 
            </CFormLabel>
          <CFormSelect
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
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
