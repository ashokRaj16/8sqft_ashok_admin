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
import { cilTrash, cilInfo, cilBed } from '@coreui/icons'

import axios from 'axios'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getPropertyById } from '../../../models/propertyModel'
import { ToastMessage } from '../../../components/ToastMessage'
import Loader from '../../../utils/Loader'
import _ from 'lodash'
// import { formattedDate } from '../../../utils/date';
import * as dateFns from 'date-fns'
import { constant } from '../../../utils/constant'
import { updateStatusProperty, sendPropertyMails } from '../../../models/propertyModel'
import { getMemberUserById } from '../../../models/usersModel.js'
import { getShortlistPropertyByUsers } from '../../../models/shortlistModel.js'
import { getIntrestedPropertyByUsers } from '../../../models/intrestedModel.js'

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

  const [memberDetails, setMemberDetails] = useState(null)
  const [intrestDetails, setIntrestDetails] = useState(null)
  const [shorlistDetails, setShorlistDetails] = useState(null)

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

  const loadIntrestSholistData = async () => {
    try {
      setLoading(true)
      // const offset = (currentPage);
      const shorlistResult = await getShortlistPropertyByUsers(id)
      console.log(shorlistResult, 'shorlist::')
      setShorlistDetails(() => shorlistResult.data)

      const intrestResult = await getIntrestedPropertyByUsers(id)
      console.log(intrestResult, 'intrested::')
      setIntrestDetails(() => intrestResult.data)

      setLoading(false)
    } catch (error) {
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMemberData()
    loadIntrestSholistData()

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

  console.log(memberDetails?.status, mailOption, statusOption)

  const handleStatusSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const result = await updateStatusProperty(id, statusOption)
      console.log('UI:', result)
      if (result) {
        // loadPropertyData();
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
            <CCard className='mb-4'>
              <CCardHeader>
                <strong>Member Details</strong>
                <CButton color="secondary" className="float-end" onClick={() => navigate(-1)}>
                  Back
                </CButton>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  {intrestDetails?.length > 0 && (
                    <CCol lg="3" md="3" className="text-center border rounded p-3 m-1">
                      <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                        {intrestDetails?.length || '-'}
                      </CHeader>
                      <small className="text-secondary">Total Intrested</small>
                    </CCol>
                  )}

                  {shorlistDetails?.length > 0 && (
                    <CCol lg="3" md="3" className="text-center border rounded p-3 m-1">
                      <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                        {shorlistDetails?.length || '-'}
                      </CHeader>
                      <small className="text-secondary">Total Shortlisted</small>
                    </CCol>
                  )}
                </CRow>

                <div className="mt-2">
                  <CRow >
                    {/* Left Column */}
                    {memberDetails && (
                      <CCol className="col-md-8">
                        <CAccordion activeItemKey={1} className='mb-4'>
                          {/* Property Basic Details */}
                          <CAccordionItem itemKey={1}>
                            <CAccordionHeader>Member Basic Details</CAccordionHeader>
                            <CAccordionBody>
                              <CRow className="align-items-center">
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <p className="fw-bold m-2">Name: </p>
                                  <p className="m-2">
                                    {' '}
                                    {memberDetails?.fname} {memberDetails?.mname}{' '}
                                    {memberDetails?.lname}{' '}
                                  </p>
                                  {/* <small>3 days ago</small> */}
                                </CCol>
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <p className="fw-bold m-2">Mobile: </p>
                                  <p className="m-2">{memberDetails?.mobile} </p>
                                </CCol>
                              </CRow>
                              <CRow>
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <p className="fw-bold m-2">Email: </p>
                                  <p className="m-2">{memberDetails?.email} </p>
                                  {/* <small>3 days ago</small> */}
                                </CCol>
                              </CRow>
                              <hr />

                              <CRow className="align-items-center">
                                {/* {memberDetails?.property_type && ( */}
                                <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                  <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                                    {memberDetails?.property_type || '-'}
                                  </CHeader>
                                  <small className="text-secondary">Intrested Property</small>
                                </CCol>
                                {/* )} */}

                                {/* {memberDetails?.property_type && ( */}
                                <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                  <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                                    {memberDetails?.property_type || '-'}
                                  </CHeader>
                                  <small className="text-secondary">Shortlist Property</small>
                                </CCol>
                                {/* )} */}

                                {/* {memberDetails?.property_type && ( */}
                                <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                  <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                                    {memberDetails?.property_type || '-'}
                                  </CHeader>
                                  <small className="text-secondary">Engaged Property</small>
                                </CCol>
                                {/* )} */}
                              </CRow>
                            </CAccordionBody>
                          </CAccordionItem>
                        </CAccordion>

                        <CAccordion activeItemKey={1} >
                          {/* Intrested Users */}
                          {intrestDetails && intrestDetails.length > 0 && (
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
                          )}

                          {shorlistDetails && shorlistDetails.length > 0 && (
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
