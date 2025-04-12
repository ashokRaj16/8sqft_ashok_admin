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
import { FaCheckCircle, FaEye, FaTimesCircle, FaTrash } from 'react-icons/fa'

import _ from 'lodash'

import { useParams, useNavigate } from 'react-router-dom'
import Loader from '@util/Loader'

import { formattedDate } from '../../../utils/date'
import { generalStatus, mailTypes } from './data'
import { usePushToastHelper } from '../../../hooks/usePushToastHelper'
import { getSponsaredById } from '../../../models/promotionModel'
import { constant } from '../../../utils/constant'

const ViewSponsaredDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [sponsaredDetails, setSponsaredDetails] = useState({})
  const [mailOption, setMailOptions] = useState(null)
  const [statusOption, setStatusOption] = useState({ status: '' })

  const [loading, setLoading] = useState(false)

  const toaster = useRef()
  const { toasts, pushToastsMessage } = usePushToastHelper()

  // console.log(isEdit, id)

  const loadSponsaredData = async () => {
    try {
      setLoading(true)
      const result = await getSponsaredById(id)
      setSponsaredDetails(() => result.data)
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

  useEffect(() => {
    loadSponsaredData()

    return () => {}
  }, [id])

  const changePropertyMailSend = (event) => {
    const value = event.target.value
    console.log(event.target)
    setMailOptions(value)
  }

  const changeSponsaredStatus = (event) => {
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

  return (
    <>
      {loading && <Loader />}
      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Sponsared Details</strong>
              <CButton color="secondary" className="float-end" onClick={() => navigate(-1)}>
                Back
              </CButton>
            </CCardHeader>
            <CCardBody>
              <div className="mt-2">
                <CRow>
                  {/* Left Column */}
                  {sponsaredDetails && (
                    <CCol className="col-md-8" sm={12} md={8} lg={8}>
                      <CAccordion activeItemKey={1} className="mb-4">
                        {/* Property Basic Details */}
                        <CAccordionItem itemKey={1}>
                          <CAccordionHeader>Sponsared Basic Details</CAccordionHeader>
                          <CAccordionBody>
                            <CRow className="align-items-center">
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Category: </p>
                                <p className="m-2"> {sponsaredDetails?.categories || '-'}</p>
                                {/* <small>3 days ago</small> */}
                              </CCol>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Sequence No: </p>
                                <p className="m-2">{sponsaredDetails?.sequence_no || '-'}</p>
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Publish Date: </p>
                                <p className="m-2">
                                  {formattedDate(sponsaredDetails?.published_date) || ''}
                                </p>
                              </CCol>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Status : </p>
                                <p className="m-2">
                                  {sponsaredDetails?.status === '1' ? 'Active' : 'In Active' || '-'}{' '}
                                </p>
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Slug : </p>
                                <p className="m-2">{sponsaredDetails?.spotlight_slug || '-'} </p>
                              </CCol>
                            </CRow>
                            <hr />

                            {/* Dedicated Property Details */}
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Dedicated Page : </p>
                                <p className="m-2">
                                  {sponsaredDetails?.is_dedicated === '1' ? 'Yes' : 'No' || '-'}{' '}
                                </p>
                              </CCol>
                            </CRow>
                            {(sponsaredDetails.categories ===
                              constant.SPONSARED_CATEGORY.HOME_BANNER ||
                              sponsaredDetails.categories ===
                                constant.SPONSARED_CATEGORY.PROPERTY_DETAILS_BANNER ||
                              sponsaredDetails.categories ===
                                constant.SPONSARED_CATEGORY.PROPERTY_LIST_BANNER) && (
                              <>
                                <CRow>
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">Property Title: </p>
                                    <p className="m-2">
                                      {sponsaredDetails?.property_title || '-'}{' '}
                                    </p>
                                  </CCol>
                                </CRow>
                                <CRow>
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">Description: </p>
                                    <p className="m-2">{sponsaredDetails?.description || '-'} </p>
                                  </CCol>
                                </CRow>

                                <CRow>
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">Address: </p>
                                    <p className="m-2">
                                      {sponsaredDetails?.landmark || '-'}{' '}
                                      {sponsaredDetails?.locality || '-'}{' '}
                                      {sponsaredDetails?.city_name || '-'}{' '}
                                    </p>
                                  </CCol>
                                </CRow>
                                <CRow>
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">Features: </p>
                                    <p className="m-2">{sponsaredDetails?.key_features || '-'} </p>
                                  </CCol>
                                </CRow>
                              </>
                            )}
                            <hr />
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Theme Dark: </p>
                                <p className="m-2">{sponsaredDetails?.theme_color_dark || '-'} </p>
                              </CCol>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Theme Light: </p>
                                <p className="m-2">{sponsaredDetails?.theme_color_light || '-'} </p>
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Gradient: </p>
                                <p className="m-2">
                                  {sponsaredDetails?.theme_color_gradient || '-'}{' '}
                                </p>
                              </CCol>
                            </CRow>
                            <hr />
                            {/* Dedicated Builder Details */}
                            {sponsaredDetails.categories ===
                              constant.SPONSARED_CATEGORY.BUILDER_SPOTLIGHT && (
                              <>
                                <CRow>
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">User Name : </p>
                                    <p className="m-2">
                                      {sponsaredDetails?.fname || ''}{' '}
                                      {sponsaredDetails?.mname || ''}{' '}
                                      {sponsaredDetails?.lname || ''}{' '}
                                    </p>
                                  </CCol>
                                </CRow>

                                <CRow>
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">Mobile : </p>
                                    <p className="m-2">{sponsaredDetails?.mobile || '-'} </p>
                                  </CCol>

                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">Email : </p>
                                    <p className="m-2">{sponsaredDetails?.email || '-'} </p>
                                  </CCol>
                                </CRow>

                                <CRow>
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">Company Name : </p>
                                    <p className="m-2">{sponsaredDetails?.company_name || '-'} </p>
                                  </CCol>

                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">Company Web Address: </p>
                                    <p className="m-2">
                                      {sponsaredDetails?.company_web_url || '-'}{' '}
                                    </p>
                                  </CCol>
                                </CRow>

                                <CRow>
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">Sponsared Title : </p>
                                    <p className="m-2">
                                      {sponsaredDetails?.sponsared_title || '-'}{' '}
                                    </p>
                                  </CCol>
                                </CRow>
                                <CRow>
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">Description: </p>
                                    <p className="m-2">
                                      {sponsaredDetails?.sponsared_description || '-'}{' '}
                                    </p>
                                  </CCol>
                                </CRow>
                                <CRow>
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">Short Description: </p>
                                    <p className="m-2">
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: sponsaredDetails?.user_short_description,
                                        }}
                                      />
                                    </p>
                                  </CCol>
                                </CRow>
                                <CRow>
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">Total Site Visits: </p>
                                    <p className="m-2">
                                      {sponsaredDetails?.total_site_visits || '-'}{' '}
                                    </p>
                                  </CCol>
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">Total Bookings: </p>
                                    <p className="m-2">
                                      {sponsaredDetails?.total_bookings || '-'}{' '}
                                    </p>
                                  </CCol>
                                </CRow>

                                <CRow></CRow>

                                <CRow>
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">Direct Site Visits: </p>
                                    <p className="m-2">
                                      {sponsaredDetails?.direct_site_visits || '-'}{' '}
                                    </p>
                                  </CCol>
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <p className="fw-bold m-2">Total Revenue: </p>
                                    <p className="m-2">{sponsaredDetails?.total_revenue || '-'} </p>
                                  </CCol>
                                </CRow>

                                <CRow></CRow>
                              </>
                            )}
                          </CAccordionBody>
                        </CAccordionItem>

                        {/* gallery Section */}
                        <CAccordionItem itemKey={2}>
                          <CAccordionHeader>Gallery Image</CAccordionHeader>
                          <CAccordionBody>
                            <CRow>
                              {sponsaredDetails?.gallery?.length === 0 && <p>No Images Found.</p>}
                              {sponsaredDetails?.gallery?.length > 0 &&
                                sponsaredDetails?.gallery.map((item, index) => {
                                  return (
                                    <CCol key={index} xs="12" md="4" lg="4" className="mb-4">
                                      {item.file_type === constant.FILE_TYPE.IMAGE_PNG ||
                                      item.file_type === constant.FILE_TYPE.IMAGE_JPG ||
                                      item.file_type === constant.FILE_TYPE.IMAGE_JPEG ||
                                      item.file_type === constant.FILE_TYPE.IMAGE_BMP ? (
                                        <CImage
                                          width={200}
                                          height={100}
                                          style={{
                                            position: 'relative',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderBottom: '1px solid grey',
                                          }}
                                          src={item.img_url || ''}
                                        />
                                      ) : item.file_type === constant.FILE_TYPE.VIDEO_MP4 ||
                                        item.file_type === constant.FILE_TYPE.VIDEO_MOV ||
                                        item.file_type === constant.FILE_TYPE.VIDEO_WEBM ? (
                                        <video
                                          src={`${item.img_url}`}
                                          width={200}
                                          height={100}
                                          controls
                                          style={{
                                            position: 'relative',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderBottom: '1px solid grey',
                                          }}
                                          className="w-full h-full object-cover"
                                          allow="fullscreen"
                                        ></video>
                                      ) : item.file_type === constant.FILE_TYPE.PDF ||
                                        item.file_type === constant.YOUTUBE ? (
                                        <iframe
                                          src={`${item.img_url}`}
                                          width={200}
                                          height={100}
                                          style={{
                                            position: 'relative',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderBottom: '1px solid grey',
                                          }}
                                          className="w-full h-full object-cover"
                                          allow="fullscreen"
                                        ></iframe>
                                      ) : <div style={{
                                            position: 'relative',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderBottom: '1px solid grey',
                                          }}>
                                          <p className='text-center'>No Image supported.</p>
                                        </div>}
                                    </CCol>
                                  )
                                })}
                            </CRow>
                          </CAccordionBody>
                        </CAccordionItem>

                        {/* Construction Section */}
                        {(sponsaredDetails.categories === constant.SPONSARED_CATEGORY.HOME_BANNER ||
                          sponsaredDetails.categories ===
                            constant.SPONSARED_CATEGORY.PROPERTY_LIST_BANNER ||
                          sponsaredDetails.categories ===
                            constant.SPONSARED_CATEGORY.PROPERTY_DETAILS_BANNER) && (
                          <CAccordionItem itemKey={3}>
                            <CAccordionHeader>Construction Details</CAccordionHeader>
                            <CAccordionBody>
                              <CRow>
                                {sponsaredDetails?.construction?.length === 0 && (
                                  <p>No Construction details Found.</p>
                                )}
                                {sponsaredDetails?.construction?.length > 0 && (
                                  <CTable align="middle" className="mb-0 border" hover responsive>
                                    <CTableHead color="light">
                                      <CTableRow>
                                        <CTableHeaderCell>Id</CTableHeaderCell>
                                        <CTableHeaderCell>Phase Name</CTableHeaderCell>
                                        <CTableHeaderCell>Completion</CTableHeaderCell>
                                        <CTableHeaderCell>Per (%)</CTableHeaderCell>
                                        <CTableHeaderCell>Possession Date</CTableHeaderCell>
                                        <CTableHeaderCell>Back Image</CTableHeaderCell>
                                        {/* <CTableHeaderCell>Created</CTableHeaderCell> */}
                                        <CTableHeaderCell>Action</CTableHeaderCell>
                                      </CTableRow>
                                    </CTableHead>

                                    <CTableBody>
                                      {sponsaredDetails?.construction.map((item, index) => (
                                        <CTableRow key={index}>
                                          <CTableDataCell>{index + 1} </CTableDataCell>
                                          <CTableDataCell>{item.phase_name || '-'}</CTableDataCell>
                                          <CTableDataCell>
                                            {item.completion_status === '1' ? 'Yes' : 'No' || '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {item.completion_percentage || '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {item.posession_date || '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            <CImage
                                              src={item.ref_image_url || '-'}
                                              width={80}
                                              height={80}
                                              style={{ borderRadius: '10px' }}
                                              alt={item.phase_name || '-'}
                                            />
                                          </CTableDataCell>
                                          {/* <CTableDataCell>
                                              {formattedDate(item.created_at) || '-'}
                                            </CTableDataCell> */}
                                          <CTableDataCell>
                                            <FaTrash color="red" />
                                          </CTableDataCell>
                                        </CTableRow>
                                      ))}
                                    </CTableBody>
                                  </CTable>
                                )}
                              </CRow>
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

                        <strong>Status</strong>
                        <CFormSelect
                          name="generalStatus"
                          value={statusOption.status}
                          onChange={(e) => changeSponsaredStatus(e)}
                          className="mb-2"
                        >
                          {generalStatus.map((item) => (
                            <option value={item.id} key={item.id}>
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

export default ViewSponsaredDetails
