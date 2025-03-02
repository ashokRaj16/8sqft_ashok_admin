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
import { FaSort, FaSortUp, FaSortDown, FaFileExcel, FaFilePdf, FaEdit, FaTrash, FaEye, FaAngleDoubleLeft, FaAngleLeft, FaAngleDoubleRight, FaAngleRight } from 'react-icons/fa';
import { ToastMessage } from '@component/ToastMessage';
import { getSubscriptionPlan } from '@model/plansModel';
import { useDebounce } from '@hook/useDebounce';
import SubscriptionDetailsModal from './SubscriptionDetailsModal';

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

const ListPlans = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [currentPlans, setCurrentPlans] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [actionValue, setActionValue] = useState('');
  const [modalVisible, setModalVisible] = useState({});

  const [toast, addToast] = useState(0);
  const navigate = useNavigate();
  const toaster = useRef();

  const debounceValue = useDebounce(searchTerm, 500);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleItemsPerPageChange = async (event) => {
    setItemsPerPage(() => parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page on items per page change
    // await loadSubscription()
  };

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
    if (selectedPlans.length === currentPlans.length) {
      setSelectedPlans([]);
    } else {
      setSelectedPlans(currentPlans);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedPlans(prevSelectedPlans => {
      if (prevSelectedPlans.includes(user)) {
        return prevSelectedPlans.filter(selectedUser => selectedUser !== user);
      } else {
        return [...prevSelectedPlans, user];
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
    if(selectedPlans.length <= 0){
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
        const ids = selectedPlans.map((data) => ( data?.book_id ));

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

  const loadSubscription = async () => {
    try{

        const offset = (currentPage);
        const result = await getSubscriptionPlan(offset, itemsPerPage, sortConfig.direction, sortConfig.key, searchTerm);
        console.log(result.data.data);
        setCurrentPlans(() => result.data.plans)
        setTotalItems(result.data.totalCounts);
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

    loadSubscription();

    return () => {}
  }, [itemsPerPage, currentPage, sortConfig, debounceValue]);


  const handleViewAction = (id) => {
    console.log(id, modalVisible)
    setModalVisible({visible: true, id });
  }

  const handleEditAction = (id) => {
    console.log(id)
    navigate(`/subscription/edit/${id}`)
  }
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
    
    { modalVisible?.visible && <SubscriptionDetailsModal 
      isModalVisible={modalVisible.visible} 
      toggleModal={() => setModalVisible(() => (modalVisible, {visible : !modalVisible.visible }))}
      id={modalVisible.id} /> }
    <CCard className="mb-4">
    <CCardHeader className='d-flex'>
    <strong>Plan Details</strong>
    <CCol className="d-flex justify-content-end">

      <CButton
        onClick={() => navigate('/plans/add')} 
        color='primary'>Add New
      </CButton>
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
        
        {/* <CRow>
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
        </CRow> */}

      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>
              {/* <CFormCheck /> */}
              <CFormCheck
                checked={selectedPlans.length === currentPlans.length}
                onChange={handleSelectAll}
              />
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort('id')}>
              Id {getSortIcon('id')}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort('title')}>
              Plan Title {getSortIcon('title')}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort('property_category')}>
              Category {getSortIcon('property_category')}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort('user_type')}>
              Type {getSortIcon('user_type')}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort('plan_amount')}>
              Amount {getSortIcon('plan_amount')}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort('plan_discounted_amount')}>
              Dis Amount {getSortIcon('plan_discounted_amount')}
            </CTableHeaderCell>
            <CTableHeaderCell>
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentPlans.map((plan, index) => (
            <CTableRow key={index}>
              <CTableDataCell>
                {/* <CFormCheck /> */}
                <CFormCheck
                  checked={selectedPlans.includes(plan)}
                  onChange={() => handleSelectUser(plan)}
                />
              </CTableDataCell>
              <CTableDataCell>{plan.id}</CTableDataCell>
              <CTableDataCell>{plan.plan_title}</CTableDataCell>
              <CTableDataCell>{plan.property_category}</CTableDataCell>
              <CTableDataCell>{plan.user_type}</CTableDataCell>
              <CTableDataCell>{plan.plan_amount}</CTableDataCell>
              <CTableDataCell>{plan.plan_discounted_amount}</CTableDataCell>
              {/* <CTableDataCell>
                <CBadge color={getStatusBadge(plan.status)}>
                  {plan.status}
                </CBadge>
              </CTableDataCell> */}
              <CTableDataCell>
                <CButton 
                  size='sm' 
                  color="primary" 
                  onClick={() => handleViewAction(plan.id)}
                  className="me-2 mb-1">
                    <FaEye />
                </CButton>
                <CButton 
                  onClick={() => handleEditAction(plan.id)}
                  size='sm' color="primary" 
                  className="me-2 mb-1">
                    <FaEdit />
                </CButton>
                {/* <CButton size='sm' color="danger" className="me-2 mb-1">
                    <FaTrash color='white' />
                </CButton> */}
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

export default ListPlans;
