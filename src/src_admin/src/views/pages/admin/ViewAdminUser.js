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
import _ from 'lodash';
import { cilTrash, cilInfo, cilBed } from '@coreui/icons';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'

import Loader from '../../../utils/Loader';
import { ToastMessage } from '../../../components/ToastMessage';
import { sendPropertyMails } from '../../../models/propertyModel';
import { getAdminUserById, updateAdminUser } from '../../../models/usersModel';
import { userStatus } from './data';
import { usePushToastHelper } from '../../../utils/toastHelper';
import { useCallback } from 'react';

const ViewAdminUser = () => {

  const { id } = useParams() // Get property ID from the URL
  const navigate = useNavigate()

  const [userDetails, setUserDetails] = useState(null)
  const [mailOption, setMailOptions] = useState(null)
  const [statusOption, setStatusOption] = useState({ status: '' })
  const [loading, setLoading] = useState(false);

  const toaster = useRef();
  const { toasts, pushToastsMessage } = usePushToastHelper()


  const loadAdminUserData = async () => {
    try {
      setLoading(true);
      // const offset = (currentPage);
      const result = await getAdminUserById(id);
      console.log("UI from users:", result.data);
      setUserDetails(() => result.data)
      setStatusOption({ status: result.data.status });

      setLoading(false);
    }
    catch (error) {
      console.log("Error: ", error);
      pushToastsMessage("error",error.message)      
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
    const { value } = event.target;
    setStatusOption(prev => ({ ...prev, status: value }));
  };


  const handleStatusSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await updateAdminUser(id, statusOption);
      console.log("UI:", result);
      if (result) {
        pushToastsMessage("success", result.message)
      }
      setLoading(false);
    }
    catch (error) {
      pushToastsMessage("error", error.message)
      setLoading(false);
    }
  }, [statusOption])

  const handleMailSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await sendPropertyMails(id, mailOption);
      console.log("UI:", result.data.property);
      if (result) {
        loadPropertyData();
        pushToastsMessage("success", result.data.message)
      }
      setLoading(false);
    }
    catch (error) {      
      pushToastsMessage("error", error.message)
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
                                    {`${userDetails?.fname || ''} ${userDetails?.mname || ''} ${userDetails?.lname || ''} `}
                                  </p>
                                  {/* <small>3 days ago</small> */}
                                </CCol>
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <p className='fw-bold m-2' >Mobile: </p>
                                  <p className="m-2">{userDetails?.mobile || '-'}</p>
                                </CCol>
                              </CRow>
                              <CRow>
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <p className='fw-bold m-2' >Email: </p>
                                  <p className="m-2">{userDetails.email || '-'}</p>
                                  {/* <small>3 days ago</small> */}
                                </CCol>
                              </CRow>

                              <CRow>
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <p className='fw-bold m-2' >Role: </p>
                                  <p className="m-2">{userDetails.role_id || '-'}</p>
                                  {/* <small>3 days ago</small> */}
                                </CCol>
                              </CRow>

                              {/* <CRow className="align-items-center">
                              </CRow> */}

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
                            value={statusOption?.status ?? "-1"}
                            onChange={(e) => changeUserStatus(e)}
                            className="mb-2" >
                            {
                              userStatus.map(item => (
                                <option
                                  value={item.id}
                                  key={item.id}
                                  // selected={userDetails?.status == item.id ? true : ''}
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
      
      <CToaster ref={toaster} push={toasts} placement="top-end" />
    </>
  )
}

export default ViewAdminUser;
