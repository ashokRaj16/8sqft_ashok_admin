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
  CLink,
  CBadge,
} from '@coreui/react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilInfo, cilBed } from '@coreui/icons'
import _ from 'lodash'

import Loader from '@util/Loader'
import { constant } from '@util/constant'
import { ToastMessage } from '@component/ToastMessage'
import { updateStatusProperty, sendPropertyMails } from '@model/propertyModel'
import { getRegisterPlansById } from '@model/registerPlansModel.js'
import { formattedDate } from '@util/date.js'


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

const ViewRegisterPlanDetails = () => {
  const { id } = useParams() // Get property ID from the URL
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEditParam = searchParams.get('isEdit')

  const [registerPlanDetails, setRegisterPlanDetails] = useState(null)

  const [mailOption, setMailOptions] = useState(null)
  const [statusOption, setStatusOption] = useState({ statusText: '', status: '' })

  const [isEdit, setIsEdit] = useState(isEditParam)
  const [loading, setLoading] = useState(false)
  const [toast, addToast] = useState(0)

  const toaster = useRef()

  console.log(isEdit, id)

  const loadRegisterPlansData = async () => {
    try {
      setLoading(true)
      // const offset = (currentPage);
      const result = await getRegisterPlansById(id)
      console.log('UI:', result.data)
      setRegisterPlanDetails(() => result.data)
      setStatusOption({ statusText: result.data.status_text, status: result.data.status })

      setLoading(false)
    } catch (error) {
      console.log('Error: ', error)
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
      setLoading(false)
      setTimeout(() => {
        navigate(-1)
      }, 1000)
    }
  }

  // const loadIntrestSholistData = async () => {
  //   try {
  //     setLoading(true)
  //     // const offset = (currentPage);
  //     const shorlistResult = await getShortlistPropertyByUsers(id)
  //     console.log(shorlistResult, 'shorlist::')
  //     setShorlistDetails(() => shorlistResult.data)

  //     const intrestResult = await getIntrestedPropertyByUsers(id)
  //     console.log(intrestResult, 'intrested::')
  //     setIntrestDetails(() => intrestResult.data)

  //     setLoading(false)
  //   } catch (error) {
  //     const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
  //     addToast(toastContent)
  //     setLoading(false)
  //   }
  // }

  useEffect(() => {
    loadRegisterPlansData()
    // loadIntrestSholistData()

    return () => {}
  }, [id])

  const changePropertyMailSend = (event) => {
    const value = event.target.value
    console.log(event.target)
    setMailOptions(value)
  }

  const changePropertyStatus = (event) => {
    // console.log(value, name)
    const { value } = event.target
    const selectedText = event.target.options[event.target.selectedIndex]
    console.log(event.target, selectedText.text)
    setStatusOption({ statusText: selectedText.text, status: value })
  }

  console.log(registerPlanDetails?.status, mailOption, statusOption)

  const handleStatusSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const result = await updateStatusProperty(id, statusOption)
      console.log('UI:', result)
      if (result) {
        
        const toastContent = (
          <ToastMessage type="success" message={result.data.message} onClick="close" />
        )
        addToast(toastContent)
      }
      setLoading(false)
    } catch (error) {
      console.log('Error: ', error)
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
      setLoading(false)
    }
  }

  const handleMailSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const result = await sendPropertyMails(id, mailOption)
      console.log('UI:', result.data.property)
      if (result) {
        loadPropertyData()
        const toastContent = (
          <ToastMessage type="success" message={result.data.message} onClick="close" />
        )
        addToast(toastContent)
      }
      setLoading(false)
    } catch (error) {
      console.log('Error: ', error)
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loader />}
      {/* <CContainer> */}
        <CRow>
          <CCol>
            <CCard className='mb-4'>
              <CCardHeader>
                <strong>Register Plan Details</strong>
                <CButton color="secondary" className="float-end" onClick={() => navigate(-1)}>
                  Back
                </CButton>
              </CCardHeader>
              <CCardBody>
               
                <div className="mt-2">
                  <CRow >
                    {/* Left Column */}
                    {registerPlanDetails && (
                      <CCol className="col-md-8">
                        <CAccordion activeItemKey={1} className='mb-4'>
                          {/* Property Basic Details */}
                          <CAccordionItem itemKey={1}>
                            <CAccordionHeader>Subscription Details</CAccordionHeader>
                            <CAccordionBody>
                              <h5 className="ass-plan-reg-header" >Order Info</h5> 

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Order Id:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{registerPlanDetails?.order_id || '-'}</p>
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Order Amount:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">₹ {registerPlanDetails?.order_amount || '-'}</p>
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">GST Percentage:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{registerPlanDetails?.gst_per && `${registerPlanDetails?.gst_per} %` || '-'}</p>
                                </CCol>
                              </CRow>
                              
                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">GST Amount:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{registerPlanDetails?.gst_amount && `₹ ${registerPlanDetails?.gst_amount}` || '-'}</p>
                                </CCol>
                              </CRow>
                              
                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Currency:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{registerPlanDetails?.currency || '-'}</p>
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Created Date:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{formattedDate(registerPlanDetails?.created_at) || '-'}</p>
                                </CCol>
                              </CRow>
                              
                              <hr />
                              <h5 className="ass-plan-reg-header">Payment Info</h5> 
                             
                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Payment Order Id:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{registerPlanDetails?.razorpay_order_id || '-'}</p>
                                </CCol>
                              </CRow>

                              
                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Razorpay Payment Id:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{registerPlanDetails?.razorpay_payment_id || '-'}</p>
                                </CCol>
                              </CRow>

                              
                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Payment Mode:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{registerPlanDetails?.payment_mode || '-'}</p>
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Payment Status:</p>
                                </CCol>
                                <CCol md={9}>
                                  <CBadge color={registerPlanDetails?.payment_status === 'SUCCESS' ? 'success' : 'danger'}>
                                    {registerPlanDetails?.payment_status || '-'}

                                  </CBadge>
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Start Date:</p>
                                </CCol>
                                <CCol md={3}>
                                  <p className="m-2">{ registerPlanDetails?.plan_start_date && formattedDate(registerPlanDetails?.plan_start_date) || '-'}</p>
                                </CCol>

                                <CCol md={2}>
                                  <p className="fw-bold m-2">End Date:</p>
                                </CCol>
                                <CCol md={3}>
                                  <p className="m-2">{registerPlanDetails?.plan_end_date && formattedDate(registerPlanDetails?.plan_end_date) || '-'}</p>
                                </CCol>
                              </CRow>

                              <hr />
                              <h5 className="ass-plan-reg-header">Device Info</h5>
                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">IP Address:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{registerPlanDetails?.ip_address || '-'}</p>
                                </CCol>

                                <CCol md={3}>
                                  <p className="fw-bold m-2">Browser Agent:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{registerPlanDetails?.user_agent || '-'}</p>
                                </CCol>
                              </CRow>
                              <hr />
                              <h5 className="ass-plan-reg-header">User Info</h5>

                              <CRow className="align-items-center">
                                <CCol md={3}> 
                                  <p className="fw-bold m-2">Full Name:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">
                                  <CLink style={{ cursor: "pointer" }} onClick={() => navigate(`/member/view/${registerPlanDetails.user_id}`)} >
                                    {registerPlanDetails?.fname || '-'} {registerPlanDetails?.mname || '-'} {registerPlanDetails?.lname || '-'}
                                  </CLink>  
                                  </p>
                                </CCol>
                              </CRow>
                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Email:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{registerPlanDetails?.email || '-'}</p>
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Mobile:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">₹ {registerPlanDetails?.mobile || '-'}</p>
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Address:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{registerPlanDetails?.address || '-'}</p>
                                </CCol>
                              </CRow>

                            </CAccordionBody>
                          </CAccordionItem>

                          <CAccordionItem itemKey={2}>
                            <CAccordionHeader>Plan Details</CAccordionHeader>
                            <CAccordionBody>
                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Plan Title: </p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">
                                    
                                    <CLink style={{ cursor: "pointer" }}  onClick={() => navigate(`/subscription/view/${registerPlanDetails.plan_id}`)} >
                                      {registerPlanDetails?.plan_title || '-'}
                                    </CLink>
                                  </p>
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Name: </p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{registerPlanDetails?.plan_names || '-'} </p>
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">User Type: </p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{registerPlanDetails?.user_type || '-'} </p>
                                </CCol>
                                </CRow>

                              <CRow className="align-items-center">                              
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Category: </p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{registerPlanDetails?.property_category} </p>                                  
                                </CCol>
                              </CRow>

                              <CRow>
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">                              
                                <CCol md={3}>
                                  <p className="fw-bold m-2">RENT OR SALE: </p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{registerPlanDetails?.plan_rent_sale || '-'} </p>                                  
                                </CCol>
                              </CRow>
                                                           
                            </CAccordionBody>
                          </CAccordionItem>
                        </CAccordion>

                        <CAccordion activeItemKey={1} >
                          {/* Intrested Users */}
                          {/* {intrestDetails && intrestDetails.length > 0 && (
                            <CAccordionItem itemKey={1}>
                              <CAccordionHeader>Intrested Property</CAccordionHeader>
                              <CAccordionBody>
                                <CTable align="middle" className="mb-0 border" hover responsive>
                                  <CTableHead color="light">
                                    <CTableRow>
                                      <CTableHeaderCell>Id</CTableHeaderCell>
                                      <CTableHeaderCell>Property Title</CTableHeaderCell>
                                      <CTableHeaderCell>Description</CTableHeaderCell>
                                      <CTableHeaderCell>Locality</CTableHeaderCell>
                                      <CTableHeaderCell>Property Type</CTableHeaderCell>
                                    </CTableRow>
                                  </CTableHead>
                                  {intrestDetails.length <= 0 && (
                                    <CFormLabel>No intrested property found.</CFormLabel>
                                  )}
                                  <CTableBody>
                                    {intrestDetails.length > 0 &&
                                      intrestDetails.map((intrestUser, index) => (
                                        <CTableRow key={index}>
                                          <CTableDataCell>{index + 1}</CTableDataCell>
                                          <CTableDataCell>
                                            {intrestUser.property_title || '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                          {intrestUser.description ? intrestUser.description.slice(0, 20) + "..."  : '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {intrestUser.locality || '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {intrestUser.property_type || '-'}
                                          </CTableDataCell>
                                        </CTableRow>
                                      ))}
                                  </CTableBody>
                                  {intrestDetails.length > 5 && (
                                    <CLink className="float-end">
                                      <p>View More</p>
                                    </CLink>
                                  )}
                                </CTable>
                              </CAccordionBody>
                            </CAccordionItem>
                          )} */}

                          {/* {shorlistDetails && shorlistDetails.length > 0 && (
                            <CAccordionItem itemKey={2}>
                              <CAccordionHeader>Shortlist Property</CAccordionHeader>
                              <CAccordionBody>
                                <CTable align="middle" className="mb-0 border" hover responsive>
                                  <CTableHead color="light">
                                    <CTableRow>
                                      <CTableHeaderCell>Id</CTableHeaderCell>
                                      <CTableHeaderCell>Property Title</CTableHeaderCell>
                                      <CTableHeaderCell>Description</CTableHeaderCell>
                                      <CTableHeaderCell>Locality</CTableHeaderCell>
                                      <CTableHeaderCell>Property Type</CTableHeaderCell>
                                    </CTableRow>
                                  </CTableHead>
                                  {shorlistDetails.length <= 0 && (
                                    <CFormLabel>No shortlist property found.</CFormLabel>
                                  )}
                                  <CTableBody>
                                    {shorlistDetails.length > 0 &&
                                      shorlistDetails.map((shortlistUser, index) => (
                                        <CTableRow key={index}>
                                          <CTableDataCell>{index + 1}</CTableDataCell>
                                          <CTableDataCell>
                                            {shortlistUser.property_title || '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                          {shortlistUser.description ? shortlistUser.description.slice(0, 20) + "..."  : '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {shortlistUser.locality || '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {shortlistUser.property_type || '-'}
                                          </CTableDataCell>
                                        </CTableRow>
                                      ))}
                                  </CTableBody>
                                  {shorlistDetails.length > 5 && (
                                    <CLink className="float-end">
                                      <p>View More</p>
                                    </CLink>
                                  )}
                                </CTable>
                              </CAccordionBody>
                            </CAccordionItem>
                          )} */}
                        </CAccordion>
                      </CCol>
                    )}
                    {/* Right Column */}
                    <CCol className="col-md-4">
                      <CCard className="mb-4">
                        <CCardBody>
                          <h4>Actions</h4>

                          {/* <strong>Mails</strong>
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
                            name="userStatus"
                            onChange={(e) => changeUserStatus(e)}
                            className="mb-2"
                          >
                            <option value="-1">Select Status</option>
                            {userStatus.map((item) => (
                              <option
                                value={item.id}
                                selected={registerPlanDetails?.status == item.id ? true : ''}
                              >
                                {item.title}
                              </option>
                            ))}
                          </CFormSelect>
                          <CButton
                            disabled={loading}
                            onClick={(e) => handleStatusSubmit(e)}
                            color="primary"
                          >
                            {loading && <CSpinner size="sm" />}
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
      {/* </CContainer> */}
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  )
}

export default ViewRegisterPlanDetails
