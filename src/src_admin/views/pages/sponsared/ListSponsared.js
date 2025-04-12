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
// import * as XLSX from 'xlsx';
// import 'jspdf-autotable';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'

import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleDoubleRight,
  FaAngleRight
} from 'react-icons/fa'
import { formattedDate } from '../../../utils/date'
import Loader from '../../../utils/Loader'
import { useDebounce } from '../../../hooks/useDebounce'
import { categoriesOption } from './data'
import { updatePromotionProperty } from '../../../models/promotionModel';
import { updateMultipleSequenceInPromotion, deletePromotionPropertyById, getPromotionProperty } from '../../../models/promotionModel'
import SortableRows from './SortableRows'
import { ToastMessage } from '../../../components/ToastMessage'

const ListSponsared = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortConfig, setSortConfig] = useState({ key: 'sequence_no', direction: 'ASC' })
  const [selectedPromotion, setSelectedPromotion] = useState([])
  const [currentPromotion, setCurrentPromotion] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [actionValue, setActionValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState('SPOTLIGHT')
  const [isEdit, setIsEdit] = useState(false)

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
    setCurrentPage(1)
  }

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
    if (selectedPromotion.length === currentPromotion.length) {
      setSelectedPromotion([])
    } else {
      setSelectedPromotion(currentPromotion)
    }
  }

  const handleSelectPromotion = (item) => {
    setSelectedPromotion((prevSelectedPromotion) => {
      if (prevSelectedPromotion.includes(item)) {
        return prevSelectedPromotion.filter((selectedPromotion) => selectedPromotion !== item)
      } else {
        return [...prevSelectedPromotion, item]
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
    if (selectedPromotion.length <= 0) {
      const toastContent = <ToastMessage type="error" message="Atleast select one row!" />
      addToast(toastContent)
      return
    }
    if (action === 'delete') {
      // Implement delete functionality
      try {
        const ids = selectedPromotion.map((data) => data?.book_id)

        console.log('ids:', ids)
        const result = { message: 'Deleted successfully!', affectedRow: 1 }
        // const result = await deleteMultipleAdminUsers();
        if (result.affectedRow > 0) {
          const toastContent = <ToastMessage type="success" message={result.message} />
          addToast(toastContent)
          loadSubscription()
          setSelectedPromotion([])
        }
        // alert('Delete action on selected users');
      } catch (error) {
        const toastContent = <ToastMessage type="error" message={error.message} />
        addToast(toastContent)
        console.error('Error:', error.message)
      }
    }
  }

  const loadPromotionData = async () => {
    try {
      const offset = currentPage - 1
      const result = await getPromotionProperty(
        offset,
        itemsPerPage,
        sortConfig.direction,
        sortConfig.key,
        searchTerm,
        categories
      )
      console.log(result.data)
      setCurrentPromotion(() => result.data.sponsared)
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
        const result = await deletePromotionPropertyById(id)
        console.log('UI:', result)
        if (result) {
          loadPromotionData()
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
    navigate(`/sponsared/view/${id}`)
  }

  const editPromotionHanndler = () => {
    console.log(isEdit, categories)
    if (!categories && (!isEdit || isEdit === '-1')) {
      alert('Please select categories to edit.')
      return
    } else if (isEdit) {
      setCategories('')
      setIsEdit(() => false)
      return
    }
    setIsEdit(() => !isEdit)
  }

  const moveItem = (fromIndex, toIndex) => {
    console.log('indexxxx:::', fromIndex, toIndex)
    // ### Make api call to update sequence.
    const updatedItems = [...currentPromotion]
    const [movedItem] = updatedItems.splice(fromIndex, 1)
    updatedItems.splice(toIndex, 0, movedItem)
    setCurrentPromotion(updatedItems)
    // setItems(updatedItems);
  }

  useEffect(() => {
    loadPromotionData()
    return () => {}
  }, [itemsPerPage, currentPage, sortConfig, debounceValue, categories])


  // useEffect(() => {
  //   if (!loading) {
      
  //     (async () => {        
  //       try{
  //         const updateData = currentPromotion.map((i) => ({
  //             id: i.tps_id,
  //             property_id: i.id,
  //             sequence_no: i.sequence_no
  //         }));

  //         let result = await updateSequenceInPromotion(updateData);
  //         if(result.affectedRow > 0) {
  //           const toastContent = <ToastMessage type="success" message={result.message} onClick="close" />
  //           addToast(toastContent)  
  //         }
  //       }
  //       catch (error) {
  //         console.log('Error: ', error)
  //         const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
  //         addToast(toastContent)
  //       }
  //     })()
  // }
  // }, [currentPromotion])

  const exportPDF = () => {}
  const exportExcel = () => {}

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )
      
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    console.log(active, over, "index:::");

    if (!over || active.id === over.id) {
        console.log("No change needed");
        setLoading(false);
        return;
    }

    setCurrentPromotion((prevItem) => {
        let updatedItems = [...prevItem];

        // Find indices of dragged and target items
        const activeIndex = updatedItems.findIndex(i => i.sequence_no === active.id);
        const newIndex = updatedItems.findIndex(i => i.sequence_no === over.id);

        if (activeIndex === -1 || newIndex === -1) return prevItem; // Safety check

        // Move dragged item to the new position
        const [draggedItem] = updatedItems.splice(activeIndex, 1);
        updatedItems.splice(newIndex, 0, draggedItem);

        // Recalculate sequence numbers
        updatedItems = updatedItems.map((item, index) => ({
            ...item,
            sequence_no: index + 1
        }));

        // 🔥 Call API to update sequence AFTER state is updated
        updateMultipleSequenceInPromotion(updatedItems.map(i => ({
            id: i.tps_id,
            property_id: i.id,
            sequence_no: i.sequence_no
        })))
        .then((result) => {
            if (result.affectedRow > 0) {
                addToast(<ToastMessage type="success" message={result.message} onClick="close" />);
            }
        })
        .catch((error) => {
            console.error("Error updating sequence:", error);
            addToast(<ToastMessage type="error" message={error.message} onClick="close" />);
        })
        .finally(() => {
            setLoading(false);
        });

        return updatedItems;
    });
};

const changeStatusHandler = async (id, status = '0') => {
  const confirmStatus = confirm('Are want to change status?')
  if(confirmStatus) 
  {
    console.log(id)
    const data = { status }
    try{ 

      const result = await updatePromotionProperty(id, data)
      loadPromotionData();
      if (result.affectedRow > 0) {
        const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
        addToast(toastContent)
      }
      
    }
    catch(error) {
      console.log(error, "resultssss error");
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
    }
  }
}

  return (
    <>
      {loading && <Loader />}

      <CCard className="mb-4">
        <CCardHeader className="d-flex flex-column flex-md-row flex-wrap">
          {/* Title - Always Full Width */}
          <CCol sm={12} md={6} lg={6}>
            <strong>Sponsared List</strong>
          </CCol>

          {/* Buttons - Full width on small screens, right-aligned on large screens */}
          <CCol className="d-flex justify-content-end">            
            <CButton onClick={() => navigate('/sponsared/add')} color="primary">
              Add New
            </CButton>
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
            <CCol sm={12} md={3} lg={3} className="mt-2 mt-md-0 mb-2">
            <CFormSelect
              name="banner_id"
              className="form-control"
              placeholder="banner_id"
              value={categories}
              onChange={(e) => {
                let bannerVal = e.target.value
                if (bannerVal !== '-1') {
                  setCategories(bannerVal)
                }
                else {
                  setCategories('')
                }
              }}
            >
              <option value={'-1'}>Select</option>
              {categoriesOption &&
                categoriesOption.map((item, i) => (
                  <option key={i} value={item.title}>
                    {item.title}
                  </option>
                ))}
            </CFormSelect>
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
                onClick={() => loadPromotionData()}
              >
                Refresh
              </CButton>
              <CButton color="primary" onClick={() => {
                setSearchTerm('')
                setCategories('');
              } 
              }>
                Clear
              </CButton>
            </CCol>
          </CRow>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={currentPromotion && currentPromotion.map((item) => item.sequence_no)}>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>
                      {/* <CFormCheck /> */}
                      {/* <CFormCheck
                        checked={selectedPromotion.length === currentPromotion.length}
                        onChange={handleSelectAll}
                      /> */}
                    </CTableHeaderCell>
                    <CTableHeaderCell onClick={() => requestSort('tps_id')}>
                      Id {getSortIcon('tps_id')}
                    </CTableHeaderCell>
                    <CTableHeaderCell>Property Title</CTableHeaderCell>
                    <CTableHeaderCell>City</CTableHeaderCell>
                    <CTableHeaderCell>Customer</CTableHeaderCell>
                    <CTableHeaderCell onClick={() => requestSort('categories')}>
                      Categories {getSortIcon('categories')}
                    </CTableHeaderCell>
                    <CTableHeaderCell onClick={() => requestSort('sequence_no')}>
                      Sequence No {getSortIcon('sequence_no')}
                    </CTableHeaderCell>
                    <CTableHeaderCell>Published Date</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {
                      currentPromotion && currentPromotion.map((item, index) => (
                          <SortableRows 
                            key={index} 
                            item={item} 
                            deleteHandler={handleDelete}
                            viewHandlder={handleViewAction}
                            changeStatusHandler={changeStatusHandler}
                            isCategoreisSame={!!categories}
                            index={ index } />
                      ))
                  }
                </CTableBody>
              </CTable>
            </SortableContext>
          </DndContext>

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

export default ListSponsared;
