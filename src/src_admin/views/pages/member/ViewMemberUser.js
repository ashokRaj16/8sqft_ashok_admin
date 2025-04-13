import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CLink,
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
  CTooltip,
} from '@coreui/react'
import {
  FaArrowCircleLeft,
  FaCheck,
  FaCheckCircle,
  FaCloudscale,
  FaCross,
  FaEye,
  FaTicketAlt,
  FaTimes,
  FaTimesCircle,
} from 'react-icons/fa'

import _ from 'lodash'

import { useParams, useNavigate } from 'react-router-dom'
import { ToastMessage } from '@component/ToastMessage'
import Loader from '@util/Loader'

// ### change update status property to update user status. // need work

import { getMemberUserById, getListedPropertyByMember } from '@model/usersModel.js'
import { getShortlistPropertyByUsers } from '@model/shortlistModel.js'
import { getIntrestedPropertyByUsers } from '@model/intrestedModel.js'
import { formattedDate } from '../../../utils/date'
import { userStatus, mailTypes } from './data'
import { updateMemberUser } from '../../../models/usersModel'
import { usePushToastHelper } from '../../../hooks/usePushToastHelper'

const ViewMemberUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [memberDetails, setMemberDetails] = useState([])
  const [intrestDetails, setIntrestDetails] = useState([])
  const [shorlistDetails, setShorlistDetails] = useState([])
  const [listedDetails, setListedDetails] = useState([])
  const [intrestTotalCount, setIntrestTotalCount] = useState(0)
  const [shorlistTotalCount, setShorlistTotalCount] = useState(0)
  const [listTotalCount, setListTotalCount] = useState(0)
  const [pageLimit, setPageLimit] = useState(2)

  const [listPage, setListPage] = useState(1)
  const [intrestPage, setIntrestPage] = useState(1)
  const [shortlistPage, setShortlistPage] = useState(1)

  const [mailOption, setMailOptions] = useState(null)
  const [statusOption, setStatusOption] = useState({ status: '' })

  const [loading, setLoading] = useState(false)

  const toaster = useRef()
  const { toasts, pushToastsMessage } = usePushToastHelper();

  // console.log(isEdit, id)

  const loadMemberData = async () => {
    try {
      setLoading(true)
      const result = await getMemberUserById(id)
      setMemberDetails(() => result.data)
      setStatusOption({ status: result.data?.status })

      setLoading(false)
    } catch (error) {
      pushToastsMessage('error', error.message)
      setLoading(false)
      setTimeout(() => {
        navigate(-1)
      }, 1000)
    }
  }

  const loadIntrestData = async () => {
    try {
      setLoading(true)

      const intrestResult = await getIntrestedPropertyByUsers(id, {
        page: intrestPage,
        limit: pageLimit,
      })
      if (intrestResult) {
        setIntrestTotalCount(() => intrestResult.data.totalCounts)
        setIntrestDetails((prevDetails) => {
          const newProperties = intrestResult?.data?.properties || []

          if (!prevDetails.length) {
            return newProperties
          }

          const updatedDetails = prevDetails.concat(newProperties)
          return updatedDetails
        })
      }

      setLoading(false)
    } catch (error) {
      pushToastsMessage('error', error.message)
      setLoading(false)
    }
  }

  const loadSholistData = async () => {
    try {
      setLoading(true)
      const shorlistResult = await getShortlistPropertyByUsers(id, {
        page: shortlistPage,
        limit: pageLimit,
      })
      if (shorlistResult) {
        setShorlistTotalCount(() => shorlistResult.data.totalCounts)
        setShorlistDetails((prevDetails) => {
          const newProperties = shorlistResult?.data?.properties || []

          if (!prevDetails.length) {
            return newProperties
          }

          const updatedDetails = prevDetails.concat(newProperties)
          return updatedDetails
        })
      }
      setLoading(false)
    } catch (error) {
      pushToastsMessage('error', error.message)
      setLoading(false)
    }
  }

  const loadListedData = async () => {
    try {
      setLoading(true)

      const listResult = await getListedPropertyByMember(id, { page: listPage, limit: pageLimit })
      if (listResult) {
        setListedDetails((prevDetails) => {
          const newProperties = listResult?.data?.properties || []

          if (!prevDetails.length) {
            return newProperties
          }

          const updatedDetails = prevDetails.concat(newProperties)
          return updatedDetails
        })

        setListTotalCount(() => listResult.data.totalCounts)
      }
      setLoading(false)
    } catch (error) {
      pushToastsMessage('error', error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMemberData()

    return () => {}
  }, [id])

  useEffect(() => {
    loadListedData()
    return () => {}
  }, [listPage])

  useEffect(() => {
    loadSholistData()
    return () => {}
  }, [shortlistPage])

  useEffect(() => {
    loadIntrestData()
    return () => {}
  }, [intrestPage])

  const changePropertyMailSend = (event) => {
    const value = event.target.value
    console.log(event.target)
    setMailOptions(value)
  }

  const changeMemberStatus = (event) => {
    const { value } = event.target
    setStatusOption({ status: value })
  }

  const handleStatusSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const result = await updateMemberUser(id, statusOption)
      if (result) {
        pushToastsMessage('success', result.message)        
      }
      setLoading(false)
    } catch (error) {
      console.log('Error: ', error)
      pushToastsMessage('error', error.message)
      setLoading(false)
    }
  }

  const handleMailSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      // const result = await sendPropertyMails(id, mailOption)   //change to user Mail
      // console.log('UI:', result.data.property)
      // if (result) {
      //   loadPropertyData()
      //   pushToastsMessage('success', result.message)
      // }
      setLoading(false)
    } catch (error) {
      console.log('Error: ', error)
      
      pushToastsMessage('error', error.message)

      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loader />}
      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Member Details</strong>
              <CButton color="secondary" className="float-end" onClick={() => navigate(-1)}>
                Back
              </CButton>
            </CCardHeader>
            <CCardBody>
              {/* <CRow>
                  {intrestTotalCount !== 0 && (
                    <CCol lg="3" md="3" className="text-center border rounded p-3 m-1">
                      <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                        {intrestTotalCount || '-'}
                      </CHeader>
                      <small className="text-secondary">Total Intrested</small>
                    </CCol>
                  )}

                  {shorlistTotalCount !== 0 && (
                    <CCol lg="3" md="3" className="text-center border rounded p-3 m-1">
                      <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                        {shorlistTotalCount || '-'}
                      </CHeader>
                      <small className="text-secondary">Total Shortlisted</small>
                    </CCol>
                  )}
                </CRow> */}

              <div className="mt-2">
                <CRow>
                  {/* Left Column */}
                  {memberDetails && (
                    <CCol className="col-md-8">
                      <CAccordion activeItemKey={1} className="mb-4">
                        {/* Property Basic Details */}
                        <CAccordionItem itemKey={1}>
                          <CAccordionHeader>Member Basic Details</CAccordionHeader>
                          <CAccordionBody>
                            <CRow className="align-items-center">
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Name: </p>
                                <p className="m-2">
                                  {' '}
                                  {memberDetails?.fname || ''} {memberDetails?.mname || ''}
                                  {memberDetails?.lname || ''}
                                </p>
                                {/* <small>3 days ago</small> */}
                              </CCol>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Mobile: </p>
                                <p className="m-2">{memberDetails?.mobile || '-'} 
                                {memberDetails?.is_mobile_verified &&
                                memberDetails?.is_mobile_verified === '1' ? (
                                  <CTooltip content="Mobile Verified" title="ver">
                                    <small>
                                      <FaCheckCircle className='ms-2' color="green" />
                                    </small>
                                  </CTooltip>
                                ) : (
                                  <CTooltip content="Mobile Not Verified">
                                    <small>
                                      <FaTimesCircle className='ms-2' color="red" />
                                    </small>
                                  </CTooltip>
                                )}
                                </p>
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Email: </p>
                                <p className="m-2">{memberDetails?.email || '-'}
                                {memberDetails?.is_email_verified &&
                                memberDetails?.is_email_verified === '1' ? (
                                  <CTooltip content="Email Verified" title="ver">
                                    <small>
                                      <FaCheckCircle className='ms-2' color="green" />
                                    </small>
                                  </CTooltip>
                                ) : (
                                  <CTooltip content="Email Not Verified">
                                    <small>
                                      <FaTimesCircle className='ms-2' color="red" />
                                    </small>
                                  </CTooltip>
                                )}
                                 </p>
                              </CCol>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Contact 2: </p>
                                <p className="m-2">{memberDetails?.contact_2 || '-'} </p>
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Company Name : </p>
                                <p className="m-2">{memberDetails?.company_name || '-'} </p>
                                {/* <small>3 days ago</small> */}
                              </CCol>
                            </CRow>
                            <hr />
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Address: </p>
                                <p className="m-2">{
                                  [memberDetails?.address_1, memberDetails.city_name, memberDetails.state_name ].filter(Boolean).join(',')
                                } 
                                </p>
                                {/* <small>3 days ago</small> */}
                              </CCol>
                            </CRow>

                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">lattitude: </p>
                                <p className="m-2">{memberDetails?.latitude || '-'} </p>
                              </CCol>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">longitude: </p>
                                <p className="m-2">{memberDetails?.longitude || '-'} </p>
                              </CCol>
                            </CRow>
                            <hr />
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Facebook : </p>
                                <p className="m-2">{memberDetails?.facebook_url || '-'} </p>
                                {/* <small>3 days ago</small> */}
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Instagram: </p>
                                <p className="m-2">{memberDetails?.instagram_url || '-'} </p>
                                {/* <small>3 days ago</small> */}
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Youtube: </p>
                                <p className="m-2">{memberDetails?.youtube_url || '-'} </p>
                                {/* <small>3 days ago</small> */}
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Whatsapp Notification: </p>
                                <p className="m-2">
                                  {memberDetails?.whatsapp_notification === '1'
                                    ? 'Yes'
                                    : 'No' || '-'}{' '}
                                </p>
                                {/* <small>3 days ago</small> */}
                              </CCol>
                            </CRow>
                            <hr />
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Added Date: </p>
                                <p className="m-2">
                                  {(memberDetails?.created_at &&
                                    formattedDate(memberDetails?.created_at)) ||
                                    '-'}{' '}
                                </p>
                                {/* <small>3 days ago</small> */}
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">IP Address: </p>
                                <p className="m-2">{memberDetails?.ip_address || '-'} </p>
                                {/* <small>3 days ago</small> */}
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Register Device: </p>
                                <p className="m-2">{memberDetails?.user_agent || '-'} </p>
                                {/* <small>3 days ago</small> */}
                              </CCol>
                            </CRow>
                            <hr />

                            <CRow className="align-items-center">
                              {/* {memberDetails?.property_type && ( */}
                              <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                                  {intrestTotalCount || '-'}
                                </CHeader>
                                <small className="text-secondary">Intrested Property</small>
                              </CCol>
                              {/* )} */}

                              {/* {memberDetails?.property_type && ( */}
                              <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                                  {shorlistTotalCount || '-'}
                                </CHeader>
                                <small className="text-secondary">Shortlist Property</small>
                              </CCol>
                              {/* )} */}

                              {/* {memberDetails?.property_type && ( */}
                              <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                                  {listTotalCount || '-'}
                                </CHeader>
                                <small className="text-secondary">Listed Property</small>
                              </CCol>
                              {/* )} */}
                            </CRow>
                          </CAccordionBody>
                        </CAccordionItem>
                      </CAccordion>

                      <CAccordion activeItemKey={1}>
                        {/* Intrested Properties */}
                        {listedDetails && listedDetails.length > 0 && (
                          <CAccordionItem itemKey={1}>
                            <CAccordionHeader>Listed Property</CAccordionHeader>
                            <CAccordionBody>
                              <CTable align="middle" className="mb-0 border" hover responsive>
                                <CTableHead color="light">
                                  <CTableRow>
                                    <CTableHeaderCell>Id</CTableHeaderCell>
                                    <CTableHeaderCell>Property Title</CTableHeaderCell>
                                    <CTableHeaderCell>Property Type</CTableHeaderCell>
                                    <CTableHeaderCell>User Type</CTableHeaderCell>
                                    <CTableHeaderCell>Locality</CTableHeaderCell>
                                    <CTableHeaderCell>Action</CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                {listedDetails.length <= 0 && (
                                  <CFormLabel>No listed property found.</CFormLabel>
                                )}
                                <CTableBody>
                                  {listedDetails.length > 0 &&
                                    listedDetails.map((listProperty, index) => (
                                      <CTableRow key={index}>
                                        <CTableDataCell>{index + 1}</CTableDataCell>
                                        <CTableDataCell>
                                          {listProperty.property_title &&
                                          listProperty.property_title.length > 30
                                            ? `${listProperty.property_title.slice(0, 30)}...`
                                            : listProperty.property_title || '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {listProperty.property_type || '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {listProperty.user_type || '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {listProperty.locality || '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          <Link to={`/properties/view/${listProperty.id}`}>
                                            <CButton
                                              size="sm"
                                              color="primary"
                                              className="me-2 mb-1"
                                            >
                                              <FaEye />
                                            </CButton>
                                          </Link>
                                        </CTableDataCell>
                                      </CTableRow>
                                    ))}
                                </CTableBody>
                              </CTable>

                              {listedDetails.length >= pageLimit &&
                                listTotalCount > listedDetails.length && (
                                  <div className="d-flex justify-content-end">
                                    <CLink
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => setListPage((prevPage) => prevPage + 1)}
                                      className="float-end"
                                    >
                                      View More
                                    </CLink>
                                  </div>
                                )}
                            </CAccordionBody>
                          </CAccordionItem>
                        )}

                        {/* Intrested Properties */}
                        {intrestDetails && intrestDetails.length > 0 && (
                          <CAccordionItem itemKey={2}>
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
                                    <CTableHeaderCell>Action</CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                {intrestDetails.length <= 0 && (
                                  <CFormLabel>No intrested property found.</CFormLabel>
                                )}
                                <CTableBody>
                                  {intrestDetails.length > 0 &&
                                    intrestDetails.map((intrestProperty, index) => (
                                      <CTableRow key={index}>
                                        <CTableDataCell>{index + 1}</CTableDataCell>
                                        <CTableDataCell>
                                          {/* <Link to={`/properties/view/${intrestProperty.id}`} > */}
                                          {intrestProperty.property_title || '-'}
                                          {/* </Link> */}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {intrestProperty.description
                                            ? intrestProperty.description.slice(0, 20) + '...'
                                            : '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {intrestProperty.locality || '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {intrestProperty.property_type || '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          <Link to={`/properties/view/${intrestProperty.id}`}>
                                            <CButton
                                              size="sm"
                                              color="primary"
                                              className="me-2 mb-1"
                                            >
                                              <FaEye />
                                            </CButton>
                                          </Link>
                                        </CTableDataCell>
                                      </CTableRow>
                                    ))}
                                </CTableBody>
                              </CTable>
                              {/* <p>count: { listTotalCount + " " + intrestDetails.length }</p> */}
                              {intrestDetails.length >= pageLimit &&
                                intrestTotalCount > intrestDetails.length && (
                                  <div className="d-flex justify-content-end">
                                    <CLink
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => {
                                        setIntrestPage((prevPage) => prevPage + 1)
                                      }}
                                      className="float-end"
                                    >
                                      View More
                                    </CLink>
                                  </div>
                                )}
                            </CAccordionBody>
                          </CAccordionItem>
                        )}

                        {/* Shortliste Properties */}
                        {shorlistDetails && shorlistDetails.length > 0 && (
                          <CAccordionItem itemKey={3}>
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
                                    <CTableHeaderCell>Action</CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                {shorlistDetails.length <= 0 && (
                                  <CFormLabel>No shortlist property found.</CFormLabel>
                                )}
                                <CTableBody>
                                  {shorlistDetails.length > 0 &&
                                    shorlistDetails.map((shortlistProperty, index) => (
                                      <CTableRow key={index}>
                                        <CTableDataCell>{index + 1}</CTableDataCell>
                                        <CTableDataCell>
                                          {shortlistProperty.property_title || '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {shortlistProperty.description
                                            ? shortlistProperty.description.slice(0, 20) + '...'
                                            : '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {shortlistProperty.locality || '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {shortlistProperty.property_type || '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          <Link to={`/properties/view/${shortlistProperty.id}`}>
                                            <CButton
                                              size="sm"
                                              color="primary"
                                              className="me-2 mb-1"
                                            >
                                              <FaEye />
                                            </CButton>
                                          </Link>
                                        </CTableDataCell>
                                      </CTableRow>
                                    ))}
                                </CTableBody>
                              </CTable>
                              {shorlistDetails.length >= pageLimit &&
                                shorlistTotalCount > shorlistDetails.length && (
                                  <div className="d-flex justify-content-end">
                                    <CLink
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => {
                                        setShortlistPage((prevPage) => prevPage + 1)
                                      }}
                                      className="float-end"
                                    >
                                      View More
                                    </CLink>
                                  </div>
                                )}
                            </CAccordionBody>
                          </CAccordionItem>
                        )}
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
                          value={statusOption.status}
                          onChange={(e) => 
                            changeMemberStatus(e)
                          }
                          className="mb-2"
                        >
                          {userStatus.map((item) => (
                            <option
                              value={item.id}
                              key={item.id}
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
      <CToaster ref={toaster} push={toasts} placement="top-end" />
    </>
  )
}

export default ViewMemberUser
