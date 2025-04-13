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
import { FaDownload, FaTrash } from 'react-icons/fa'

import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ToastMessage } from '../../../components/ToastMessage'
import Loader from '../../../utils/Loader'
import _ from 'lodash'
// import { formattedDate } from '../../../utils/date';
// import { updateStatusProperty, sendPropertyMails } from '../../../models/propertyModel'
import { getMarketingDetailsById, deleteMarketingDetailsById } from '../../../models/marketingModel'
import { marketingAction, mailTypes } from './data.js'
import { formattedDate } from '../../../utils/date.js'

const ViewMarketing = () => {
  const { id } = useParams() // Get property ID from the URL
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEditParam = searchParams.get('isEdit')

  const [marketingDetails, setMarketingDetails] = useState(null)
  const [mailOption, setMailOptions] = useState(null)
  const [statusOption, setStatusOption] = useState({ statusText: '', status: '' })

  const [loading, setLoading] = useState(false)
  const [toast, addToast] = useState(0)

  const toaster = useRef()

  // console.log(isEdit, id);

  const loadMarketingData = async () => {
    try {
      setLoading(true)
      const result = await getMarketingDetailsById(id)
      setMarketingDetails(() => result.data)
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

  useEffect(() => {
    loadMarketingData()

    return () => {}
  }, [id])

  const changeUserStatus = (event) => {
    // console.log(value, name)
    const { value } = event.target
    const selectedText = event.target.options[event.target.selectedIndex]
    console.log(event.target, selectedText.text)
    setStatusOption({ statusText: selectedText.text, status: value })
  }

  const handleStatusSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      // const result = await updateStatusProperty(id, statusOption);
      const result = {}
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
      // setLoading(true)
      // const result = await sendPropertyMails(id, mailOption)
      // console.log('UI:', result.data.property)
      // if (result) {
      //   loadPropertyData()
      //   const toastContent = (
      //     <ToastMessage type="success" message={result.data.message} onClick="close" />
      //   )
      //   addToast(toastContent)
      // }
      // setLoading(false)
    } catch (error) {
      console.log('Error: ', error)
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
      setLoading(false)
    }
  }

  const handleDelete = async (sid) => {
    let confirmDelete = confirm('Are you sure to remove?', 'message')
    if (confirmDelete) {
      try {
        setLoading(true)
        const result = await deleteMarketingDetailsById(id, sid)
        if (result) {
          loadMarketingData()
          const toastContent = (
            <ToastMessage type="success" message={result.message} onClick="close" />
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

  return (
    <>
      {loading && <Loader />}
      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Marketing Details</strong>
              <CButton color="secondary" className="float-end" onClick={() => navigate(-1)}>
                Back
              </CButton>
            </CCardHeader>
            <CCardBody>
              <div className="mt-2">
                <CRow>
                  {/* Left Column */}
                  {marketingDetails && (
                    <CCol className="col-md-8">
                      <p>
                        <strong> Name:</strong> {marketingDetails?.promotion_name || '-'}
                      </p>
                      <p>
                        <strong> Type:</strong> {marketingDetails?.marketing_type || '-'}
                      </p>
                      <p>
                        <strong> Property:</strong>{' '}
                        {marketingDetails?.property_title
                          ? `${marketingDetails?.property_title}, ${marketingDetails?.city_name}`
                          : ''}
                      </p>

                      <CTable align="middle" className="mb-0 border" hover responsive>
                        <CTableHead color="light">
                          <CTableRow>
                            <CTableHeaderCell>Id</CTableHeaderCell>
                            <CTableHeaderCell>Full Name</CTableHeaderCell>
                            <CTableHeaderCell>Mobile</CTableHeaderCell>
                            <CTableHeaderCell>Contact File</CTableHeaderCell>
                            <CTableHeaderCell>Total Contact</CTableHeaderCell>
                            <CTableHeaderCell>Sent Contact</CTableHeaderCell>
                            <CTableHeaderCell>Banner Image</CTableHeaderCell>
                            <CTableHeaderCell>Status</CTableHeaderCell>
                            <CTableHeaderCell>Publish Date</CTableHeaderCell>
                            <CTableHeaderCell>Action</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {marketingDetails &&
                            marketingDetails?.marketing_log.map((item, index) => (
                              <CTableRow key={index}>
                                <CTableDataCell>{item.id}</CTableDataCell>
                                <CTableDataCell>{item?.full_name || '-'}</CTableDataCell>
                                <CTableDataCell>{item?.mobile || '-'}</CTableDataCell>

                                <CTableDataCell>
                                  {item?.contacts_file ? (
                                    <Link to={item?.contacts_file}>
                                      <FaDownload />
                                    </Link>
                                  ) : (
                                    '-'
                                  )}
                                </CTableDataCell>
                                <CTableDataCell>{item?.total_contact || '-'}</CTableDataCell>
                                <CTableDataCell>{item?.msg_send_contact || '-'}</CTableDataCell>
                                
                                <CTableDataCell>
                                  {
                                    item?.banner_image ?
                                      <CImage
                                        width={50}
                                        src={item?.banner_image || ''}
                                        alt="Banner Image"
                                      />
                                    : '-'
                                  }
                                </CTableDataCell>
                                <CTableDataCell>{item?.status_text || '-'}</CTableDataCell>
                                <CTableDataCell>
                                  {formattedDate(item?.created_at) || '-'}
                                </CTableDataCell>

                                <CTableDataCell>
                                  <CButton
                                    size="sm"
                                    color="danger"
                                    onClick={() => handleDelete(item.id)}
                                    className="me-2 mb-1"
                                  >
                                    <FaTrash color="white" />
                                  </CButton>
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                        </CTableBody>
                      </CTable>
                    </CCol>
                  )}
                  {/* Right Column */}
                  <CCol className="col-md-4">
                    <CCard className="mb-4">
                      <CCardBody>
                        <h4>Actions</h4>

                        <CFormSelect
                          name="propertyStatus"
                          onChange={(e) => changeUserStatus(e)}
                          className="mb-2"
                        >
                          <option value="-1">Select</option>
                          {marketingAction.map((item) => (
                            <option
                              value={item.id}
                              selected={marketingDetails?.status == item.id ? true : ''}
                            >
                              {item.title}
                            </option>
                          ))}
                        </CFormSelect>
                        <CButton
                          disabled={loading}
                          // onClick={(e) => handleStatusSubmit(e)}
                          color="primary"
                        >
                          {loading && <CSpinner size="sm" />}
                          Submit
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

export default ViewMarketing
