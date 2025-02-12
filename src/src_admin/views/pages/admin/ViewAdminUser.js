import React, { useEffect, useState, useRef } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CToaster,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CListGroup,
  CFormInput,
  CListGroupItem,
  CFormSelect,
  CHeader,
  CFormLabel,
  CImage,
  CCardImage,
  CCardTitle,
  CCardText,
  CSpinner,

} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilInfo, cilBed } from '@coreui/icons';


import axios from 'axios'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getPropertyById } from '../../../models/propertyModel'
import { ToastMessage } from '../../../components/ToastMessage';
import Loader from '../../../utils/Loader';
import _ from 'lodash';
// import { formattedDate } from '../../../utils/date';
import * as dateFns from 'date-fns';
import { constant } from '../../../utils/constant';
import { updateStatusProperty, sendPropertyMails } from '../../../models/propertyModel';
import { getAdminUserById } from '../../../models/usersModel';

const mailTypes = [
  { id: 1, title: 'Porperty Approved' },
  { id: 2, title: 'Porperty Rejected' },
  { id: 3, title: 'Porperty Pending' },
  { id: 4, title: 'Porperty Notification' },
]

const userStatus = [
  { id: 1, title: constant.USER_STATUS.ACTIVE },
  { id: 2, title: constant.USER_STATUS.INACTIVE },
  { id: 3, title: constant.USER_STATUS.PENDING },
  { id: 4, title: constant.USER_STATUS.BLOCK },
  { id: 5, title: constant.USER_STATUS.DISABLED },
  { id: 6, title: constant.USER_STATUS.SUSPENDED },
  { id: 7, title: constant.USER_STATUS.REJECTED },
]

const ViewAdminUser = () => {

  const { id } = useParams() // Get property ID from the URL
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const isEditParam = searchParams.get('isEdit');

  const [userDetails, setUserDetails] = useState(null)
  const [mailOption, setMailOptions] = useState(null)
  const [statusOption, setStatusOption] = useState({ statusText: '', status: '' })

  const [isEdit, setIsEdit] = useState(isEditParam)
  const [loading, setLoading] = useState(false);
  const [toast, addToast] = useState(0);

  const toaster = useRef();

  console.log(isEdit, id);

  const loadAdminUserData = async () => {
    try {
      setLoading(true);
      // const offset = (currentPage);
      const result = await getAdminUserById(id);
      console.log("UI:", result.data);
      setUserDetails(() => result.data)
      // setStatusOption({ statusText: result.data.status_text, status: result.data.status });

      setLoading(false);
    }
    catch (error) {
      console.log("Error: ", error);
      const toastContent = (
        <ToastMessage
          type="error"
          message={error.message}
          onClick="close" />
      )
      addToast(toastContent)
      setLoading(false);
      setTimeout(() => {
        navigate(-1)
      }, 1000)
    }
  }

  useEffect(() => {
    loadAdminUserData()

    return () => { };
  }, [id])

  const changeUserMailSend = (event) => {
    const value = event.target.value;
    console.log(event.target)
    setMailOptions(value);
  };

  const changeUserStatus = (event) => {
    // console.log(value, name)
    const { value } = event.target;
    const selectedText = event.target.options[event.target.selectedIndex];
    console.log(event.target, selectedText.text)
    setStatusOption({ statusText: selectedText.text, status: value });
  };

  // console.log(userDetails?.status, mailOption, statusOption);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await updateStatusProperty(id, statusOption);
      console.log("UI:", result);
      if (result) {
        // loadPropertyData();
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
      console.log("Error: ", error);
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

  const handleMailSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await sendPropertyMails(id, mailOption);
      console.log("UI:", result.data.property);
      if (result) {
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
      console.log("Error: ", error);
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

  return (
    <>
      {loading && <Loader />}
        <CRow>
          <CCol>
            <CCard className='mb-4'>
              <CCardHeader>
                <strong>Admin Details</strong>
                <CButton
                  color="secondary"
                  className="float-end"
                  onClick={() => navigate(-1)}
                >
                  Back
                </CButton>
              </CCardHeader>
              <CCardBody>
              
                <div className="mt-2">
                  <CRow>
                    {/* Left Column */}
                    {userDetails &&
                      <CCol className="col-md-8">
                        <CAccordion activeItemKey={1} >
                          {/* Property Basic Details */}
                          <CAccordionItem itemKey={1}>
                            <CAccordionHeader>Basic Details</CAccordionHeader>
                            <CAccordionBody>

                              <CRow className="align-items-center">
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <p className='fw-bold m-2' >Name: </p>
                                  <p className="m-2"> 
                                    {`${userDetails?.fname} ${userDetails?.mname} ${userDetails?.lname} `}
                                  </p>
                                  {/* <small>3 days ago</small> */}
                                </CCol>
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <p className='fw-bold m-2' >Mobile: </p>
                                  <p className="m-2">{userDetails?.mobile}</p>
                                </CCol>
                              </CRow>
                              <CRow>
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <p className='fw-bold m-2' >Email: </p>
                                  <p className="m-2">{userDetails.email}</p>
                                  {/* <small>3 days ago</small> */}
                                </CCol>
                              </CRow>

                              <CRow>
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <p className='fw-bold m-2' >Role: </p>
                                  <p className="m-2">{userDetails.role_id}</p>
                                  {/* <small>3 days ago</small> */}
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                {/* <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                  <CHeader className="fw-bold">{userDetails?.property_type || "-"}</CHeader>
                                  <small className="text-secondary">Property Added</small>
                                </CCol>

                                <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                  <CHeader className="fw-bold text-center">{userDetails?.property_variety || "-"}</CHeader>
                                  <small className="text-secondary">User Added</small>
                                </CCol>

                                <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                  <CHeader className="fw-bold text-center">{userDetails?.property_rent_buy || "-"}</CHeader>
                                  <small className="text-secondary">Variety Visited</small>
                                </CCol>

                                <CCol lg="2" md="6" className="text-center border rounded p-3 m-1">
                                  <CHeader className="fw-bold text-center">{userDetails?.property_availibility_type || "-"}</CHeader>
                                  <small className="text-secondary">LEASE/RENT</small>
                                </CCol> */}
                              </CRow>

                            </CAccordionBody>
                          </CAccordionItem>

                          {/* Images */}
                          <CAccordionItem itemKey={2}>
                            <CAccordionHeader>User Listed</CAccordionHeader>
                            <CAccordionBody>
                              <CRow>
                                  <CHeader>No user found.</CHeader>
                              </CRow>
                            </CAccordionBody>
                          </CAccordionItem>

                          {/* Nearby Locations */}
                          <CAccordionItem itemKey={3}>
                            <CAccordionHeader>Recent Followup</CAccordionHeader>
                            <CAccordionBody>
                              <p>No Recent followup.</p>
                            </CAccordionBody>
                          </CAccordionItem>
                        </CAccordion>
                      </CCol>
                    }
                    {/* Right Column */}
                    <CCol className="col-md-4">
                      <CCard className="mb-4">
                        <CCardBody>
                          {/* <h4>Actions</h4>

                          <strong>Mails</strong>
                          <CFormSelect
                            name="propertyMails"
                            onChange={(e) => changePropertyMailSend(e)}
                            className="mb-2"
                          >
                            <option value="-1">Select Mails</option>
                            {
                              mailTypes.map(item => (
                                <option
                                  value={item.id}>
                                  {item.title}
                                </option>
                              ))
                            }
                          </CFormSelect>
                          <CButton
                            disabled={loading}
                            onClick={(e) => handleMailSubmit(e)}
                            color="primary">
                            {loading && <CSpinner size='sm' />}
                            Send
                          </CButton> */}
                          <hr />
                          <strong>Status</strong>
                          <CFormSelect
                            name="propertyStatus"
                            onChange={(e) => changeUserStatus(e)}
                            className="mb-2" >
                            <option value="-1">Select Status</option>
                            {
                              userStatus.map(item => (
                                <option
                                  value={item.id}
                                  selected={userDetails?.status == item.id ? true : ''}
                                >
                                  {item.title}
                                </option>
                              ))
                            }
                          </CFormSelect>
                          <CButton
                            disabled={loading}
                            onClick={(e) => handleStatusSubmit(e)}
                            color="primary" >
                            {loading && <CSpinner size='sm' />}
                            Change
                          </CButton>
                        </CCardBody>
                      </CCard>

                      {/* <CCard>
                        <CCardBody>
                          <h4>Activity</h4>
                          <CListGroup>
                            <CListGroupItem>Activity 1: Property listed</CListGroupItem>
                            <CListGroupItem>Activity 2: Price updated</CListGroupItem>
                            <CListGroupItem>Activity 3: New images added</CListGroupItem>
                            <CListGroupItem>Activity 4: Status changed to Sold</CListGroupItem>
                            <CListGroupItem>Activity 5: Property description updated</CListGroupItem>
                          </CListGroup>
                        </CCardBody>
                      </CCard> */}
                    </CCol>
                  </CRow>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  )
}

export default ViewAdminUser;
