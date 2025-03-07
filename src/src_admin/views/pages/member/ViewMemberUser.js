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
} from '@coreui/react'
import { FaEye } from 'react-icons/fa'

import _ from 'lodash'

import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ToastMessage } from '@component/ToastMessage'
import { constant } from '@util/constant'
import Loader from '@util/Loader'

// ### change update status property to update user status. // need work
import { updateStatusProperty, sendPropertyMails } from '@model/propertyModel'
import { getMemberUserById, getListedPropertyByMember } from '@model/usersModel.js'
import { getShortlistPropertyByUsers } from '@model/shortlistModel.js'
import { getIntrestedPropertyByUsers } from '@model/intrestedModel.js'

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

const ViewMemberUser = () => {
  const { id } = useParams() // Get property ID from the URL
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEditParam = searchParams.get('isEdit')

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
  const [statusOption, setStatusOption] = useState({ statusText: '', status: '' })

  const [isEdit, setIsEdit] = useState(isEditParam)
  const [loading, setLoading] = useState(false)
  const [toast, addToast] = useState(0)

  const toaster = useRef()

  console.log(isEdit, id)

  const loadMemberData = async () => {
    try {
      setLoading(true)
      // const offset = (currentPage);
      const result = await getMemberUserById(id)
      console.log('UI:', result.data)
      setMemberDetails(() => result.data)
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
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
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
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
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
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
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

  const changePropertyStatus = (event) => {
    // console.log(value, name)
    const { value } = event.target
    const selectedText = event.target.options[event.target.selectedIndex]
    console.log(event.target, selectedText.text)
    setStatusOption({ statusText: selectedText.text, status: value })
  }

  // console.log(memberDetails?.status, mailOption, statusOption)

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
                                <p className="m-2">{memberDetails?.mobile || '-'} </p>
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Email: </p>
                                <p className="m-2">{memberDetails?.email || '-'} </p>
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
                          onChange={(e) => changeUserStatus(e)}
                          className="mb-2"
                        >
                          <option value="-1">Select Status</option>
                          {userStatus.map((item) => (
                            <option
                              value={item.id}
                              selected={memberDetails?.status == item.id ? true : ''}
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
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  )
}

export default ViewMemberUser
