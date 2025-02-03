//#region 
// import React, { useState, useEffect } from 'react'
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CContainer,
//   CRow,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CPagination,
//   CPaginationItem,
// } from '@coreui/react'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'

// const ManageAmenities = () => {
//   const [properties, setProperties] = useState([]) // Use correct variable naming
//   const [totalPages, setTotalPages] = useState(1)
//   const [currentPage, setCurrentPage] = useState(1)

//   const navigate = useNavigate()

//   // Fetch data from API
//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         const barier_token = localStorage.getItem('eightsqfttoken')
//         const response = await axios.get(
//           `http://localhost:5000/api/v1/admin/property/list_properties?page=${currentPage}&limit=10`,
//           {
//             headers: {
//               'x-api-key': 'A8SQFT7767',
//               Authorization: `Bearer ${barier_token}`,
//             },
//           },
//         )
//         console.log('Response Data:', response.data) // Debugging log
//         setProperties(response.data.data.property || []) // Correct mapping
//         setTotalPages(response.data.data.totalPages || 1) // Adjust for API structure
//       } catch (error) {
//         console.error('Error fetching properties:', error)
//       }
//     }
//     fetchProperties()
//   }, [currentPage])

//   // Navigate to Add/Edit Property Page
//   const handleAdd = () => {
//     navigate('/properties/add')
//   }

//   const handleEdit = (id) => {
//     navigate(`/properties/edit/${id}`)
//   }

//   const handleView = (id) => {
//     navigate(`/properties/view/${id}`)
//   }

//   return (
//     <CContainer>
//       <CRow>
//         <CCol>
//           <CCard>
//             <CCardHeader>
//               <strong>Properties Management</strong>
//               <CButton color="primary" className="float-end" onClick={handleAdd}>
//                 Add Property
//               </CButton>
              
//             </CCardHeader>
//             <CCardBody>
//               <CTable bordered hover responsive>
//                 <CTableHead>
//                   <CTableRow>
//                     <CTableHeaderCell>ID</CTableHeaderCell>
//                     <CTableHeaderCell>Property Title</CTableHeaderCell>
//                     <CTableHeaderCell>City Name</CTableHeaderCell>
//                     <CTableHeaderCell>Building Name</CTableHeaderCell>
//                     <CTableHeaderCell>Status</CTableHeaderCell>
//                     <CTableHeaderCell>Action</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {properties.map((property) => (
//                     <CTableRow key={property.id}>
//                       <CTableDataCell>{property.id}</CTableDataCell>
//                       <CTableDataCell>{property.property_title}</CTableDataCell>
//                       <CTableDataCell>{property.city_id}</CTableDataCell>
//                       <CTableDataCell>{property.building_name}</CTableDataCell>
//                       <CTableDataCell>
//                         <CButton
//                           color={
//                             property.status === '1'
//                               ? 'warning'
//                               : property.status === '2'
//                                 ? 'success'
//                                 : 'danger'
//                           }
//                           size="sm"
//                           className="me-2"
//                         >
//                           {property.status === '1'
//                             ? 'Pending'
//                             : property.status === '2'
//                               ? 'Approved'
//                               : 'Rejected'}
//                         </CButton>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <CButton color="info" size="sm" onClick={() => handleEdit(property.id)}>
//                           Edit
//                         </CButton>{' '}
//                         &nbsp; | &nbsp;
//                         <CButton color="primary" size="sm" onClick={() => handleView(property.id)}>
//                           View
//                         </CButton>
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))}
//                 </CTableBody>
//               </CTable>
//               <CPagination align="end">
//                 <CPaginationItem
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((prev) => prev - 1)}
//                 >
//                   Previous
//                 </CPaginationItem>
//                 {[...Array(totalPages)].map((_, index) => (
//                   <CPaginationItem
//                     key={index}
//                     active={index + 1 === currentPage}
//                     onClick={() => setCurrentPage(index + 1)}
//                   >
//                     {index + 1}
//                   </CPaginationItem>
//                 ))}
//                 <CPaginationItem
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage((prev) => prev + 1)}
//                 >
//                   Next
//                 </CPaginationItem>
//               </CPagination>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </CContainer>
//   )
// }

// export default ManageAmenities
//#endregion

import React, { useEffect, useState, useRef, useCallback  } from 'react';
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
import _ from 'lodash';
import { FaSort, FaSortUp, FaSortDown, FaFileExcel, FaFilePdf, FaEdit, FaTrash, FaEye, FaAngleDoubleLeft, FaAngleLeft, FaAngleDoubleRight, FaAngleRight } from 'react-icons/fa';
import { ToastMessage } from '../../../components/ToastMessage';
import { deleteProperty, getPropertyList } from '../../../models/propertyModel';
import { useDebounce } from '../../../hooks/useDebounce';
import Loader from '../../../utils/Loader';

const getStatusBadge = (status) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
      return 'danger';
    default:
      return 'primary';
  }
};

const ListProperty = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [currentMembers, setCurrentMembers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [actionValue, setActionValue] = useState('');
  const [ loading, setLoading ] = useState(false);

  const [toast, addToast] = useState(0);
  const navigate = useNavigate();
  const toaster = useRef();
  const debounceValue = useDebounce(searchTerm, 500);
  
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

   // Debounced function for handling API calls or delayed updates
  //  const debouncedSearch = useCallback(
  //   _.debounce(async (value) => {
  //     console.log("Debounced value:", value);
  //     // await loadPropertyData();
  //     // Perform actions like API calls here
  //   }, 500),
  //   [] // Ensures debounce function is stable across renders
  // );

  // const handleSearch = (event) => {
  //   const value = event.target.value;
  //   setSearchTerm(value); // Update the text field immediately
  //   debouncedSearch(value); // Pass the value to the debounced function
  // };

  const handleItemsPerPageChange = async (event) => {
    setItemsPerPage(() => parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page on items per page change
    // await loadSubscription()
  };

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
    if (selectedMembers.length === currentMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(currentMembers);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedMembers(prevSelectedMembers => {
      if (prevSelectedMembers.includes(user)) {
        return prevSelectedMembers.filter(selectedUser => selectedUser !== user);
      } else {
        return [...prevSelectedMembers, user];
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
    if(selectedMembers.length <= 0){
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
        const ids = selectedMembers.map((data) => ( data?.book_id ));

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
        loadSubscription();
        setSelectedMembers([]);
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


  const loadPropertyData = async () => {
    try{
        setLoading(true);
        const offset = (currentPage);
        const result = await getPropertyList(offset, itemsPerPage, sortConfig.direction, sortConfig.key, searchTerm);
        console.log("UI:", result.data.property);
        setCurrentMembers(() => result.data.property)
        setTotalItems(result.data.totalCounts);
        setLoading(false);
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
        setLoading(false);
    }
  }

  useEffect(() => {
    loadPropertyData();

    return () => {}
  }, [itemsPerPage, currentPage, sortConfig, debounceValue]);

  const handleDelete = async (id) => {
    try{
      setLoading(true);
      console.log(id);
      const result = await deleteProperty(id);
      console.log("UI:", result);
      if(result) {
        loadPropertyData();
        const toastContent = (
          <ToastMessage
              type="success"
              message={result.data.message}
              onClick="close" />
        )
        addToast(toastContent)
      }
      setLoading(false);
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
        setLoading(false);
    }
  }

  const handleEditAction = (id, isEdit = true) => {
      console.log(id);
      navigate(`/properties/view/${id}?isEdit=${isEdit}`)
  }

  const exportPDF = () => {}
  const exportExcel = () => {}

  return (
    <>
    { loading && <Loader /> }
    <CCard className="mb-4">
      <CCardHeader className='d-flex'>
      <strong>Property Details</strong>
      <CCol className="d-flex justify-content-end">

        <CButton
          onClick={() => navigate('/properties/add')} 
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
                  onClick={() => loadSubscription()}
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
          </CCol>
          {/* </CRow> */}
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
              <CTableHeaderCell onClick={() => requestSort('property_title')}>
                Property Title {getSortIcon('property_title')}
              </CTableHeaderCell>
              <CTableHeaderCell onClick={() => requestSort('city_name')}>
                City Name {getSortIcon('city_name')}
              </CTableHeaderCell>
              <CTableHeaderCell onClick={() => requestSort('locality')}>
                Locality {getSortIcon('locality')}
              </CTableHeaderCell>
              <CTableHeaderCell onClick={() => requestSort('email')}>
                User Email {getSortIcon('email')}
              </CTableHeaderCell>
              <CTableHeaderCell onClick={() => requestSort('mobile')}>
                User Mobile {getSortIcon('mobile')}
              </CTableHeaderCell>
              <CTableHeaderCell>
                Status
              </CTableHeaderCell>
              <CTableHeaderCell>
                Action
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          { currentMembers.length <= 0 && <CFormLabel>No Property found.</CFormLabel> }
          <CTableBody>
            { currentMembers.length > 0 && currentMembers.map((property, index) => (
              <CTableRow key={index}>
                <CTableDataCell>
                  {/* <CFormCheck /> */}
                  <CFormCheck
                    checked={selectedMembers.includes(property)}
                    onChange={() => handleSelectUser(property)}
                  />
                </CTableDataCell>
                <CTableDataCell>{property.id}</CTableDataCell>
                <CTableDataCell>{property.property_title} </CTableDataCell>
                <CTableDataCell>{property.city_name}</CTableDataCell>
                <CTableDataCell>{property.locality}</CTableDataCell>
                <CTableDataCell>{property.user_email}</CTableDataCell>
                <CTableDataCell>{property.user_mobile}</CTableDataCell>

                <CTableDataCell>{
                  property.status === "1" ?
                  <CBadge color={getStatusBadge('PENDING')}>
                    PENDING
                  </CBadge> :
                  property.status === "2" ?
                  <CBadge color={getStatusBadge('APPROVED')}>
                    APPROVED
                  </CBadge> :
                  <CBadge color={getStatusBadge("REJECTED")}>
                    REJECTED
                </CBadge>
                }</CTableDataCell>
                <CTableDataCell>
                  <CButton 
                    onClick={() => handleEditAction(property.id, false)} 
                    size='sm' 
                    color="primary" 
                    className="me-2 mb-1">
                      <FaEye />
                  </CButton>
                  <CButton 
                    onClick={() => handleEditAction(property.id, true)} 
                    size='sm' 
                    color="primary" 
                    className="me-2 mb-1">
                      <FaEdit />
                  </CButton>
                  <CButton 
                    onClick={() => handleDelete(property.id)} 
                    size='sm' 
                    color="danger" 
                    className="me-2 mb-1">
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

export default ListProperty;
