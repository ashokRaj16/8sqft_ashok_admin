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
  CFormText,
  CImage,
  CCardImage,
  CFormTextarea,
  CCardTitle,
  CCardText,
  CSpinner,
  CLink,
  CTooltip,
  CTableFoot,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilInfo, cilBed } from '@coreui/icons'
import { FaExternalLinkAlt, FaEye, FaPencilAlt, FaShare } from 'react-icons/fa'

import axios from 'axios'
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { getPropertyById } from '../../../models/propertyModel'
import { ToastMessage } from '../../../components/ToastMessage'
import Loader from '../../../utils/Loader'
import _ from 'lodash'
// import { formattedDate } from '../../../utils/date';
import * as dateFns from 'date-fns'
import { constant } from '../../../utils/constant'
import {
  updateStatusProperty,
  sendPropertyMails,
  updatePropertyDetails,
} from '../../../models/propertyModel'
import { formattedDate } from '../../../utils/date'
import { getShortlistUsersByProperty } from '../../../models/shortlistModel'
import { getIntrestedUsersByProperty } from '../../../models/intrestedModel'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import { validationPropertyFeaturesSchema } from './validationPropertySchema'
import { mailTypes, propertyStatus, initialPropertyDetailsValues } from './data'

const ViewPropertyDetails = () => {
  const { id } = useParams() // Get property ID from the URL
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const isEditParam = searchParams.get('isEdit') === 'true'
  const activeTabId = searchParams.get('activeTab')

  const [propertyDetails, setPropertyDetails] = useState(initialPropertyDetailsValues)
  const [intrestDetails, setIntrestDetails] = useState(null)
  const [shorlistDetails, setShorlistDetails] = useState(null)

  const [activeTab, setActiveTab] = useState(activeTabId || 1)
  const [isEdit, setIsEdit] = useState(isEditParam)

  const [mailOption, setMailOptions] = useState(null)
  const [statusOption, setStatusOption] = useState({ statusText: '', status: '' })

  const [loading, setLoading] = useState(false)
  const [toast, addToast] = useState(0)

  const toaster = useRef()

  console.log('Params: ', isEdit, id, activeTab, propertyDetails)

  const changeEditSectionHandler = (editable = true, tabId = activeTab || 1) => {
    console.log(editable, tabId)
    setIsEdit(editable)
    setActiveTab(tabId)
    const params = new URLSearchParams(location.search)
    params.set('activeTab', tabId)
    params.set('isEdit', editable)
    navigate(`${location.pathname}?${params.toString()}`, { replace: true })
  }

  const handlePropertyDetailSubmit = async (values, resetForm, setSubmitting) => {
    try {
      console.log('values: ', values)
      const updatedPropertyData = {
        state_id: values.state_id,
        state_name: values.state_name,
        city_id: values.city_id,
        city_name: values.city_name,
        landmark: values.landmark,
        locality: values.locality,
        latitude: values.latitude,
        longitude: values.longitude,
        pincode: values.pincode,
        property_title: values.property_title,
        description: values.description,
        building_name: values.building_name,
        property_variety: values.property_variety,
        property_variety_type: values.property_variety_type,
        floor_number: values.floor_number,
        total_floors: values.total_floors,
        door_facing: values.door_facing,
        bed_rooms: values.bed_rooms,
        washrooms: values.washrooms,
        balcony: values.balcony,
        unit_number: values.unit_number,
        wing_name: values.wing_name,
        total_wing: values.total_wing,
        land_area: values.land_area,
        land_area_unit: values.land_area_unit,
        builtup_area: values.builtup_area,
        builtup_area_unit: values.builtup_area_unit,
        property_availibility_type: values.property_availibility_type,
        rent_amount: values.rent_amount,
        rent_is_nogotiable: values.rent_is_nogotiable,
        deposite_amount: values.deposite_amount,
        deposite_is_negotiable: values.deposite_is_negotiable,
        preferred_tenent: values.preferred_tenent,
        property_age: values.property_age,
        is_maintenance: values.is_maintenance,
        availability_date: values.availability_date,

        property_current_status: values.property_current_status,
        possession_date: values.possession_date,
        is_rera_number: values.is_rera_number,
        rera_number: values.rera_number,
        total_towers: values.total_towers,
        total_units: values.total_units,
        project_area: values.project_area,
        project_area_unit: values.project_area_unit,
        per_sqft_amount: values.per_sqft_amount,
      }

      console.log('update details:', updatedPropertyData)

      const result = await updatePropertyDetails(values.id, updatedPropertyData)

      console.log('Result: ', result)
      if (result) {
        addToast(<ToastMessage type="success" message={result.message} />)
      }
      changeEditSectionHandler(false)
    } catch (error) {
      addToast(<ToastMessage type="error" message={error.message} />)
    } finally {
      setSubmitting(false)
    }
  }

  const loadPropertyData = async () => {
    try {
      setLoading(true)
      const result = await getPropertyById(id)
      console.log(result)
      setPropertyDetails(() => result.data)
      setStatusOption({ statusText: result.data.status_text, status: result.data.status })
      setLoading(false)
    } catch (error) {
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

      const shorlistResult = await getShortlistUsersByProperty(id)
      setShorlistDetails(() => shorlistResult.data)

      const intrestResult = await getIntrestedUsersByProperty(id)
      setIntrestDetails(() => intrestResult.data)

      setLoading(false)
    } catch (error) {
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPropertyData()
    loadIntrestSholistData()

    return () => {}
  }, [id])

  const changePropertyMailSend = (event) => {
    const value = event.target.value
    // console.log(event.target)
    setMailOptions(value)
  }

  const changePropertyStatus = (event) => {
    // console.log(value, name)
    const { value } = event.target
    const selectedText = event.target.options[event.target.selectedIndex]
    console.log(event.target, selectedText.text)
    setStatusOption({ statusText: selectedText.text, status: value })
  }

  // console.log(propertyDetails?.status, mailOption, statusOption)

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

  const handleVisitExternalLink = () => {
    if (_.toUpper(propertyDetails) === constant.PROJECT_ATTR.RENT) {
      window.open(`${constant.FRONT_BASE_URL}/PropertyDetailsPage/${propertyDetails.id}`, '_blank')
    }
    if (_.toUpper(propertyDetails) === constant.PROJECT_ATTR.BUY) {
      window.open(`${constant.FRONT_BASE_URL}/PropertyDetailsPage/${propertyDetails.id}`, '_blank')
    } else {
      window.open(`${constant.FRONT_BASE_URL}/Builder/${propertyDetails.id}`, '_blank')
    }
  }

  const handleShareProperty = () => {
    if (_.toUpper(propertyDetails) === constant.PROJECT_ATTR.RENT) {
      window.open(`${constant.FRONT_BASE_URL}/PropertyDetailsPage/${propertyDetails.id}`, '_blank')
    }
    if (_.toUpper(propertyDetails) === constant.PROJECT_ATTR.BUY) {
      window.open(`${constant.FRONT_BASE_URL}/PropertyDetailsPage/${propertyDetails.id}`, '_blank')
    } else {
      window.open(`${constant.FRONT_BASE_URL}/Builder/${propertyDetails.id}`, '_blank')
    }
  }

  return (
    <>
      {loading && <Loader />}
      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Property Details</strong>

              <div className="float-end">
                {propertyDetails && propertyDetails.status === '2' && (
                  <>
                    <CTooltip content="View Property Link" placement="top">
                      <CButton
                        onClick={() => handleVisitExternalLink()}
                        size="sm"
                        color="info"
                        label="view property"
                        className="me-2 mb-1"
                      >
                        <FaExternalLinkAlt color="white" />
                      </CButton>
                    </CTooltip>

                    <CTooltip content="View Property Link" placement="top">
                      <CButton
                        onClick={() => handleShareProperty()}
                        size="sm"
                        color="success"
                        label="view property"
                        className="me-2 mb-1"
                      >
                        <FaShare color="white" />
                      </CButton>
                    </CTooltip>
                  </>
                )}

                <CButton color="secondary" onClick={() => navigate(-1)}>
                  Back
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <div className="mt-2">
                <CRow>
                  {/* Left Column */}
                  {propertyDetails && (
                    <CCol sm="12" xs="12" md="8">
                      <CAccordion activeItemKey={Number(activeTab) || 1} className="mb-4">
                        {/* Property Basic Details */}
                        <CAccordionItem itemKey={1}>
                          <CAccordionHeader>Property Basic Details</CAccordionHeader>
                          <CAccordionBody>
                            <CRow className="align-items-center">
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <div className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <p className="fw-bold m-2">Owner Name: </p>
                                  <p className="m-2">
                                    {`${propertyDetails.user?.fname || ''} ${propertyDetails.user?.mname || ''} ${propertyDetails.user?.lname || ''}` ||
                                      '-'}
                                  </p>
                                </div>
                                <p className="m-2">
                                  {!isEdit && (
                                    <CButton
                                      onClick={() => changeEditSectionHandler(true, 1)}
                                      size="sm"
                                      color="primary"
                                      className="me-2 mb-1"
                                    >
                                      <FaPencilAlt />
                                    </CButton>
                                  )}
                                </p>
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Email: </p>
                                <p className="m-2">{propertyDetails.user.email || '-'}</p>
                                {/* <small>3 days ago</small> */}
                              </CCol>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Mobile: </p>
                                <p className="m-2">{propertyDetails.user.mobile || '-'}</p>
                              </CCol>
                            </CRow>
                            <hr />

                            <CRow className="align-items-center">
                              {propertyDetails?.property_type && (
                                <CCol lg="3" md="6" className="text-center border rounded p-2 m-1">
                                  <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                                    {propertyDetails?.property_type || '-'}
                                  </CHeader>
                                  <small className="text-secondary">Property Type</small>
                                </CCol>
                              )}
                              {propertyDetails?.property_variety && (
                                <CCol lg="3" md="6" className="text-center border rounded p-2 m-1">
                                  <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                                    {propertyDetails?.property_variety || '-'}
                                  </CHeader>
                                  <small className="text-secondary">Residency Type</small>
                                </CCol>
                              )}
                              {propertyDetails?.property_rent_buy && (
                                <CCol lg="3" md="6" className="text-center border rounded p-2 m-1">
                                  <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                                    {propertyDetails?.property_rent_buy || '-'}
                                  </CHeader>
                                  <small className="text-secondary">Variety Type</small>
                                </CCol>
                              )}

                              {propertyDetails?.property_availibility_type && (
                                <CCol lg="3" md="6" className="text-center border rounded p-2 m-1">
                                  <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                                    {propertyDetails?.property_availibility_type || '-'}
                                  </CHeader>
                                  <small className="text-secondary">LEASE/RENT</small>
                                </CCol>
                              )}
                              {/* ### use currnecy conversion format   || create new method  */}
                              {/* <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                      <CHeader className="fw-bold text-center">{`₹ ${propertyDetails?.rent_amount.toFixed(2)}`}</CHeader>
                                      <small className="text-secondary">Exprected Rent</small>
                                  </CCol>

                                  <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                      <CHeader className="fw-bold text-center">{ `₹ ${propertyDetails?.deposite_amount.toFixed(2)}`}</CHeader>
                                      <small className="text-secondary">Expected Deposite</small>
                                  </CCol> */}

                              {propertyDetails?.availability_date && (
                                <CCol lg="3" md="6" className="text-center border rounded p-2 m-1">
                                  <CHeader className="fw-bold d-flex justify-content-center align-items-center ">
                                    {formattedDate(propertyDetails?.availability_date) || '-'}
                                  </CHeader>
                                  <small className="text-secondary">Available Date</small>
                                </CCol>
                              )}

                              {propertyDetails?.publish_date && (
                                <CCol lg="3" md="6" className="text-center border rounded p-2 m-1">
                                  <CHeader className="fw-bold d-flex justify-content-center align-items-center text-success">
                                    {formattedDate(propertyDetails?.publish_date) || '-'}
                                  </CHeader>
                                  <small className="text-secondary">Publish Date</small>
                                </CCol>
                              )}
                            </CRow>
                            <hr />
                            <Formik
                              initialValues={propertyDetails}
                              enableReinitialize
                              validationSchema={validationPropertyFeaturesSchema}
                              onSubmit={(values, { setSubmitting, resetForm }) => {
                                console.log(values)
                                handlePropertyDetailSubmit(values, resetForm, setSubmitting)
                              }}
                            >
                              {({ values, handleChange, handleBlur, isSubmitting }) => (
                                <Form>
                                  <CRow className="align-items-center">
                                    <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                      <CCol md={3}>
                                        <p className="fw-bold m-2">Property Title:</p>
                                      </CCol>
                                      <CCol md={9}>
                                        {isEdit && activeTab == 1 ? (
                                          <>
                                            <Field
                                              name="property_title"
                                              type="text"
                                              className="form-control"
                                              placeholder="Property Title"
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                            />
                                            <ErrorMessage
                                              name="property_title"
                                              component={CFormText}
                                              className="text-danger"
                                            />
                                          </>
                                        ) : (
                                          <p className="m-2">
                                            {propertyDetails?.property_title || '-'}
                                          </p>
                                        )}
                                      </CCol>
                                    </CCol>
                                  </CRow>
                                  <CRow className="d-flex align-items-center">
                                    <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                      <CCol md={3}>
                                        <p className="fw-bold m-2">Description: </p>
                                      </CCol>
                                      <CCol md={9}>
                                        {isEdit && activeTab == 1 ? (
                                          <>
                                            <Field
                                              type="textarea"
                                              name="description"
                                              as={CFormTextarea}
                                              rows="5"
                                              className="form-control"
                                              placeholder="Description"
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                            />
                                            <ErrorMessage
                                              name="description"
                                              component={CFormText}
                                              className="text-danger"
                                            />
                                          </>
                                        ) : (
                                          <p className="m-2">
                                            {propertyDetails?.description || '-'}
                                          </p>
                                        )}
                                      </CCol>
                                    </CCol>
                                  </CRow>
                                  <CRow className="d-flex align-items-center">
                                    <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                      <CCol md={3}>
                                        <p className="fw-bold m-2">Address: </p>
                                      </CCol>
                                      <CCol md={9}>
                                        {isEdit && activeTab == 1 ? (
                                          <>
                                            <CCol className="d-flex w-100 flex-row mb-2">
                                              <p className="fw-bold m-2">Locality: </p>

                                              <Field
                                                name="locality"
                                                type="text"
                                                className="form-control"
                                                placeholder="Locality"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              />
                                              <p className="fw-bold m-2">Landmark: </p>
                                              <Field
                                                name="landmark"
                                                type="text"
                                                className="form-control"
                                                placeholder="Landmark"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              />
                                              <ErrorMessage
                                                name="locality"
                                                component={CFormText}
                                                className="text-danger"
                                              />
                                              <ErrorMessage
                                                name="landmark"
                                                component={CFormText}
                                                className="text-danger"
                                              />
                                            </CCol>
                                            <CCol className="d-flex w-100 flex-row">
                                              <p className="fw-bold m-2">City: </p>

                                              <Field
                                                name="city_name"
                                                type="text"
                                                as={CFormSelect}
                                                className="form-control"
                                                placeholder="City"
                                              >
                                                <option value={-1}>Select</option>
                                              </Field>
                                              <p className="fw-bold m-2">Pincode: </p>
                                              <Field
                                                name="pincode"
                                                type="text"
                                                className="form-control"
                                                placeholder="Pincode"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              />
                                              <ErrorMessage
                                                name="city_name"
                                                component={CFormText}
                                                className="text-danger"
                                              />
                                              <ErrorMessage
                                                name="pincode"
                                                component={CFormText}
                                                className="text-danger"
                                              />
                                            </CCol>
                                          </>
                                        ) : (
                                          <p className="m-2">
                                            {[
                                              propertyDetails?.landmark,
                                              propertyDetails?.locality,
                                              propertyDetails?.city_name,
                                              propertyDetails?.state_name,
                                              propertyDetails?.pincode,
                                            ]
                                              .filter(Boolean) // Removes falsy values like null, undefined, empty string
                                              .join(', ') || '-'}
                                          </p>
                                        )}
                                      </CCol>
                                    </CCol>
                                  </CRow>
                                  <CRow className="d-flex align-items-center">
                                    <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                      <CCol md={3}>
                                        <p className="fw-bold m-2">Co-ordinates: </p>
                                      </CCol>
                                      <CCol md={9}>
                                        {isEdit && activeTab == 1 ? (
                                          <>
                                            {/* Latitude Field */}
                                            <CCol className="w-100 mb-2">
                                              <div className="d-none d-md-flex flex-row">
                                                <p className="fw-bold m-2">Latitude:</p>
                                                <Field
                                                  name="latitude"
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Latitude"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                              </div>
                                              <div className="d-flex d-md-none flex-column">
                                                <p className="fw-bold m-2">Latitude:</p>
                                                <Field
                                                  name="latitude"
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Latitude"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                              </div>
                                              <ErrorMessage
                                                name="latitude"
                                                component={CFormText}
                                                className="text-danger"
                                              />
                                            </CCol>

                                            {/* Longitude Field */}
                                            <CCol className="w-100 mb-2">
                                              <div className="d-none d-md-flex flex-row">
                                                <p className="fw-bold m-2">Longitude:</p>
                                                <Field
                                                  name="longitude"
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Longitude"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                              </div>
                                              <div className="d-flex d-md-none flex-column">
                                                <p className="fw-bold m-2">Longitude:</p>
                                                <Field
                                                  name="longitude"
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Longitude"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                              </div>
                                              <ErrorMessage
                                                name="longitude"
                                                component={CFormText}
                                                className="text-danger"
                                              />
                                            </CCol>
                                          </>
                                        ) : (
                                          <p className="m-2">
                                            Latitude:{' '}
                                            <span className="fst-italic">
                                              {propertyDetails?.latitude || '-'}
                                            </span>
                                            , Longitude:{' '}
                                            <span className="fst-italic">
                                              {propertyDetails?.longitude || '-'}
                                            </span>
                                          </p>
                                        )}
                                      </CCol>
                                    </CCol>
                                  </CRow>
                                  {(propertyDetails?.builtup_area || isEdit) && (
                                    <CRow className="d-flex align-items-center">
                                      <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Builtup Area: </p>
                                        </CCol>
                                        <CCol md={9}>
                                          {isEdit && activeTab == 1 ? (
                                            <>
                                              <CCol className="d-flex w-100 flex-row">
                                                <Field
                                                  name="builtup_area"
                                                  type="text"
                                                  className="form-control me-2"
                                                  placeholder="Builtup Area"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                                {/* <p className="fw-bold m-2">Unit: </p> */}
                                                <Field
                                                  name="builtup_area_unit"
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Builtup Unit"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                              </CCol>
                                              <CCol className="d-flex w-100 flex-row">
                                                <ErrorMessage
                                                  name="land_area"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                                <ErrorMessage
                                                  name="builtup_area_unit"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </CCol>
                                            </>
                                          ) : (
                                            <p className="m-2">
                                              {`${values?.builtup_area} ${values?.builtup_area_unit} `}
                                            </p>
                                          )}
                                        </CCol>
                                      </CCol>
                                    </CRow>
                                  )}
                                  {(propertyDetails?.land_area || !isEdit) &&
                                    propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.OWNER && (
                                      <CRow className="d-flex align-items-center">
                                        <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                          <CCol md={3}>
                                            <p className="fw-bold m-2">Land Area: </p>
                                          </CCol>
                                          <CCol md={9}>
                                            {isEdit && activeTab == 1 ? (
                                              <>
                                                <CCol className="d-flex w-100 flex-row">
                                                  <Field
                                                    name="land_area"
                                                    type="text"
                                                    className="form-control me-2"
                                                    placeholder="Land Area"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />

                                                  <Field
                                                    name="land_area_unit"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Land Unit"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                </CCol>
                                                <CCol className="d-flex w-100 flex-row">
                                                  <ErrorMessage
                                                    name="land_area"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                  <ErrorMessage
                                                    name="land_area_unit"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </CCol>
                                              </>
                                            ) : (
                                              <p className="m-2">
                                                {`${values?.land_area} ${values?.land_area_unit} `}
                                              </p>
                                            )}
                                          </CCol>
                                        </CCol>
                                      </CRow>
                                    )}
                                  {(propertyDetails?.project_area || !isEdit) &&
                                    propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.BUILDER && (
                                      <CRow className="d-flex align-items-center">
                                        <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                          <CCol md={3}>
                                            <p className="fw-bold m-2">Project Area: </p>
                                          </CCol>
                                          <CCol md={9}>
                                            {isEdit && activeTab == 1 ? (
                                              <>
                                                <CCol className="d-flex w-100 flex-row">
                                                  <Field
                                                    name="project_area"
                                                    type="text"
                                                    className="form-control me-2"
                                                    placeholder="Project Area"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />

                                                  <Field
                                                    name="project_area_unit"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Project Unit"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                </CCol>
                                                <CCol className="d-flex w-100 flex-row">
                                                  <ErrorMessage
                                                    name="project_area_unit"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                  <ErrorMessage
                                                    name="project_area"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </CCol>
                                              </>
                                            ) : (
                                              <p className="m-2">
                                                {`${propertyDetails?.project_area} ${propertyDetails?.project_area_unit} `}
                                              </p>
                                            )}
                                          </CCol>
                                        </CCol>
                                      </CRow>
                                    )}
                                  {propertyDetails?.rent_amount && (
                                    <CRow className="d-flex align-items-center">
                                      <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Expected Rent: </p>
                                        </CCol>
                                        <CCol md={9}>
                                          {isEdit && activeTab == 1 ? (
                                            <>
                                              <Field
                                                name="rent_amount"
                                                type="text"
                                                className="form-control"
                                                placeholder="Rent Amount"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              />
                                              <Field
                                                name="rent_is_nogotiable"
                                                type="text"
                                                className="form-control"
                                                placeholder="is Negotiable"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              />
                                              <ErrorMessage
                                                name="project_area"
                                                component={CFormText}
                                                className="text-danger"
                                              />
                                            </>
                                          ) : (
                                            <p className="m-2">
                                              {`₹ ${propertyDetails?.rent_amount?.toFixed(2)} 
                                                  ${propertyDetails?.rent_is_nogotiable == 0 ? 'Non Negotiable' : 'Negotiable'} `}
                                            </p>
                                          )}
                                        </CCol>
                                      </CCol>
                                    </CRow>
                                  )}
                                  {propertyDetails?.deposite_amount && (
                                    <CRow className="d-flex align-items-center">
                                      <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Expected Deposite: </p>
                                        </CCol>
                                        <CCol md={9}>
                                          <p className="m-2">
                                            {`₹ ${propertyDetails?.deposite_amount?.toFixed(2)} 
                                          ${propertyDetails?.deposite_is_negotiable == 0 ? 'Non Negotiable' : 'Negotiable'} `}
                                          </p>
                                        </CCol>
                                      </CCol>
                                    </CRow>
                                  )}
                                  {propertyDetails?.door_facing && (
                                    <CRow className="d-flex align-items-center">
                                      <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Door Facing: </p>
                                        </CCol>
                                        <CCol md={9}>
                                        {isEdit && activeTab == 1 ? (
                                                <>
                                                  <Field
                                                    name="door_facing"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Door Facing"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                  <ErrorMessage
                                                    name="door_facing"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </>
                                              ) : (
                                          <p className="m-2">
                                            {values?.door_facing || '-'}
                                          </p>
                                              )}
                                        </CCol>
                                      </CCol>
                                    </CRow>
                                  )}

                                  {(propertyDetails?.property_age || isEdit) &&
                                    propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.BUILDER && (
                                    <CRow className="d-flex align-items-center">
                                      <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Property Age: </p>
                                        </CCol>
                                        <CCol md={9}>
                                          {isEdit && activeTab == 1 ? (
                                            <>
                                              <Field
                                                name="property_age"
                                                type="text"
                                                className="form-control"
                                                placeholder="Property Age"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              />
                                              <ErrorMessage
                                                name="property_age"
                                                component={CFormText}
                                                className="text-danger"
                                              />
                                            </>
                                          ) : (
                                            <p className="m-2">
                                              {values?.property_age || '-'}
                                            </p>
                                          )}
                                        </CCol>
                                      </CCol>
                                    </CRow>
                                  )}
                                  {(propertyDetails?.is_maintenance || isEdit) &&
                                    propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.BUILDER && (
                                      <CRow className="d-flex align-items-center">
                                        <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                          <CCol md={3}>
                                            <p className="fw-bold m-2">Maintenance: </p>
                                          </CCol>
                                          <CCol md={9}>
                                            {isEdit && activeTab == 1 ? (
                                              <>
                                                <Field
                                                  name="is_maintenance"
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Is Maintenance"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                                <ErrorMessage
                                                  name="is_maintenance"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </>
                                            ) : (
                                              <p className="m-2">
                                                {propertyDetails?.is_maintenance}
                                              </p>
                                            )}
                                          </CCol>
                                        </CCol>
                                      </CRow>
                                    )}

                                    {(propertyDetails?.is_maintenance || isEdit) &&
                                    propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.BUILDER && (
                                      <CRow className="d-flex align-items-center">
                                        <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                          <CCol md={3}>
                                            <p className="fw-bold m-2">Monthly Maintenance: </p>
                                          </CCol>
                                          <CCol md={9}>
                                            {isEdit && activeTab == 1 ? (
                                              <>
                                                <Field
                                                  name="monthly_maintenance"
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Monthly Maintenance"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                                <ErrorMessage
                                                  name="monthly_maintenance"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </>
                                            ) : (
                                              <p className="m-2">
                                                {`₹ ${propertyDetails?.monthly_maintenance}`}
                                              </p>
                                            )}
                                          </CCol>
                                        </CCol>
                                      </CRow>
                                    )}
                                  <hr />
                                  <CRow className="d-flex align-items-center">
                                    <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    {(propertyDetails?.is_maintenance || isEdit) &&
                                    propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.BUILDER && (
                                          <>
                                            <CCol xs={6} lg={3} md={3}>
                                              <p className="fw-bold m-2">Unit Number: </p>
                                            </CCol>
                                            <CCol xs={6} lg={3} md={3}>
                                              {isEdit && activeTab == 1 ? (
                                                <>
                                                  <Field
                                                    name="unit_number"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Unit Number"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                  <ErrorMessage
                                                    name="unit_number"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </>
                                              ) : (
                                                <p className="m-2">{values?.unit_number || '-'}</p>
                                              )}
                                            </CCol>
                                          </>
                                        )}

                                      {(propertyDetails?.washrooms || isEdit) &&
                                        propertyDetails.user_type ===
                                          constant.PROPERTY_USER_TYPE.BUILDER && (
                                          <>
                                            <CCol md={2}>
                                              <p className="fw-bold m-2">Washrooms: </p>
                                            </CCol>
                                            <CCol md={4}>
                                              {isEdit && activeTab == 1 ? (
                                                <>
                                                  <Field
                                                    name="washrooms"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Washrooms"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                  <ErrorMessage
                                                    name="washrooms"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </>
                                              ) : (
                                                <p className="m-2">{values?.washrooms || '-'}</p>
                                              )}
                                            </CCol>
                                          </>
                                        )}
                                    </CCol>
                                  </CRow>

                                  <CRow className="d-flex align-items-center">
                                    <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                      {(propertyDetails?.total_wing || isEdit) &&
                                        propertyDetails.user_type ===
                                          constant.PROPERTY_USER_TYPE.BUILDER && (
                                          <>
                                            <CCol md={3}>
                                              <p className="fw-bold m-2">Total Wing: </p>
                                            </CCol>
                                            <CCol md={3}>
                                              {isEdit && activeTab == 1 ? (
                                                <>
                                                  <Field
                                                    name="total_wing"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Total Wing"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                  <ErrorMessage
                                                    name="total_wing"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </>
                                              ) : (
                                                <p className="m-2">
                                                  {propertyDetails?.total_wing || '-'}
                                                </p>
                                              )}
                                            </CCol>
                                          </>
                                        )}
                                      {(propertyDetails?.wing_name || isEdit) &&
                                        propertyDetails.user_type ===
                                          constant.PROPERTY_USER_TYPE.BUILDER && (
                                          <>
                                            <CCol md={2}>
                                              <p className="fw-bold m-2">Wing Name: </p>
                                            </CCol>
                                            <CCol md={4}>
                                              {isEdit && activeTab == 1 ? (
                                                <>
                                                  <Field
                                                    name="wing_name"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Wing Name"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                  <ErrorMessage
                                                    name="wing_name"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </>
                                              ) : (
                                                <p className="m-2">
                                                  {propertyDetails?.wing_name || '-'}
                                                </p>
                                              )}
                                            </CCol>
                                          </>
                                        )}
                                    </CCol>
                                  </CRow>
                                  <CRow className="d-flex align-items-center">
                                    <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                      {(propertyDetails?.total_floors || isEdit) &&
                                        propertyDetails.user_type ===
                                          constant.PROPERTY_USER_TYPE.BUILDER && (
                                          <>
                                            <CCol md={3}>
                                              <p className="fw-bold m-2">Total Floors: </p>
                                            </CCol>
                                            <CCol md={3}>
                                              {isEdit && activeTab == 1 ? (
                                                <>
                                                  <Field
                                                    name="total_floors"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Total Floors"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                  <ErrorMessage
                                                    name="total_floors"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </>
                                              ) : (
                                                <p className="m-2">{values?.total_floors || '-'}</p>
                                              )}
                                            </CCol>
                                          </>
                                        )}

                                      {(propertyDetails?.floor_number || isEdit) &&
                                        propertyDetails.user_type ===
                                          constant.PROPERTY_USER_TYPE.BUILDER && (
                                          <>
                                            <CCol md={2}>
                                              <p className="fw-bold m-2">Floor No: </p>
                                            </CCol>
                                            <CCol md={4}>
                                              {isEdit && activeTab == 1 ? (
                                                <>
                                                  <Field
                                                    name="floor_number"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Floor Number"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                  <ErrorMessage
                                                    name="floor_number"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </>
                                              ) : (
                                                <p className="m-2">{values?.floor_number || '-'}</p>
                                              )}
                                            </CCol>
                                          </>
                                        )}
                                    </CCol>
                                  </CRow>

                                  <CRow className="d-flex align-items-center">
                                    <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                      {(propertyDetails?.bed_rooms || isEdit) &&
                                        propertyDetails.user_type ===
                                          constant.PROPERTY_USER_TYPE.BUILDER && (
                                          <>
                                            <CCol md={3}>
                                              <p className="fw-bold m-2">Bed Rooms: </p>
                                            </CCol>
                                            <CCol md={3}>
                                              {isEdit && activeTab == 1 ? (
                                                <>
                                                  <Field
                                                    name="bed_rooms"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Bed Rooms"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                  <ErrorMessage
                                                    name="bed_rooms"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </>
                                              ) : (
                                                <p className="m-2">{values?.bed_rooms || '-'}</p>
                                              )}
                                            </CCol>
                                          </>
                                        )}

                                      {(propertyDetails?.bed_rooms || isEdit) &&
                                        propertyDetails.user_type ===
                                          constant.PROPERTY_USER_TYPE.BUILDER && (
                                          <>
                                            <CCol md={2}>
                                              <p className="fw-bold m-2">Balcony: </p>
                                            </CCol>
                                            <CCol md={4}>
                                              {isEdit && activeTab == 1 ? (
                                                <>
                                                  <Field
                                                    name="balcony"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Balcony"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                  <ErrorMessage
                                                    name="balcony"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </>
                                              ) : (
                                                <p className="m-2">{values?.balcony || '-'}</p>
                                              )}
                                            </CCol>
                                          </>
                                        )}
                                    </CCol>
                                  </CRow>
                                  <CRow className="d-flex align-items-center">
                                    {isEdit && (
                                      <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                        <CButton
                                          type="submit"
                                          color="primary"
                                          className="m-2"
                                          disabled={isSubmitting}
                                        >
                                          {isSubmitting ? (
                                            <>
                                              <CSpinner size="sm" /> Update
                                            </>
                                          ) : (
                                            'Update'
                                          )}
                                        </CButton>

                                        <CButton
                                          type="button"
                                          color="primary"
                                          className="m-2"
                                          onClick={() => {
                                            changeEditSectionHandler(false)
                                          }}
                                          disabled={isSubmitting}
                                        >
                                          {isSubmitting ? (
                                            <>
                                              <CSpinner size="sm" /> Cancel
                                            </>
                                          ) : (
                                            'Cancel'
                                          )}
                                        </CButton>
                                      </CCol>
                                    )}
                                  </CRow>
                                </Form>
                              )}
                            </Formik>
                          </CAccordionBody>
                        </CAccordionItem>

                        {/* Amenities */}
                        <CAccordionItem itemKey={2}>
                          <CAccordionHeader>Amenities</CAccordionHeader>
                          <CAccordionBody>
                            <CRow>
                              {propertyDetails.furnishing_status && (
                                <CCol
                                  lg="4"
                                  xs="11"
                                  className="d-flex align-items-center  border rounded p-2 m-2"
                                >
                                  <CCol md={4} xs="5" className="text-center">
                                    <CImage
                                      src="/assets/images/property_icons/Semifurnished.svg"
                                      alt="Tenant Icon"
                                      className="img-fluid"
                                    />
                                  </CCol>
                                  <CCol md={9} xs="7" className="m-1">
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                      {propertyDetails?.furnishing_status}
                                    </div>
                                    <small className="text-secondary">Funishing Status</small>
                                  </CCol>
                                </CCol>
                              )}

                              {propertyDetails.parking && (
                                <CCol
                                  lg="4"
                                  xs="11"
                                  className="d-flex align-items-center  border rounded p-2 m-2"
                                >
                                  <CCol md={4} xs={5} className="text-center">
                                    <CImage
                                      src={`/assets/images/property_icons/parking.svg`}
                                      alt="Tenant Icon"
                                      className="img-fluid"
                                    />
                                  </CCol>
                                  <CCol md={9} xs={7} className="m-1">
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                      {propertyDetails?.parking}
                                    </div>
                                    <small className="text-secondary">Parking</small>
                                  </CCol>
                                </CCol>
                              )}
                              {propertyDetails.water_supply && (
                                <CCol
                                  lg="4"
                                  xs={11}
                                  className="d-flex align-items-center  border rounded p-2 m-2"
                                >
                                  <CCol md={4} xs={5} className="text-center">
                                    <CImage
                                      src="/assets/images/property_icons/WaterSupplySociety.svg"
                                      alt="Tenant Icon"
                                      className="img-fluid"
                                    />
                                  </CCol>
                                  <CCol md={9} xs={7} className="m-1">
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                      {propertyDetails?.water_supply}
                                    </div>
                                    <small className="text-secondary">Water Supply</small>
                                  </CCol>
                                </CCol>
                              )}
                              {propertyDetails.pet_allowed && (
                                <CCol
                                  lg="4"
                                  xs={11}
                                  className="d-flex align-items-center  border rounded p-2 m-2"
                                >
                                  <CCol md={4} xs={5} className="text-center">
                                    <CImage
                                      src="/assets/images/property_icons/pet_allowed.svg"
                                      alt="Tenant Icon"
                                      className="img-fluid"
                                    />
                                  </CCol>
                                  <CCol md={9} xs={7} className="m-1">
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                      {propertyDetails?.pet_allowed === 0 ? 'NO' : 'YES'}
                                    </div>
                                    <small className="text-secondary">Pet Allowed</small>
                                  </CCol>
                                </CCol>
                              )}

                              {propertyDetails.non_veg_allowed && (
                                <CCol
                                  lg="4"
                                  xs={11}
                                  className="d-flex align-items-center  border rounded p-2 m-2"
                                >
                                  <CCol md={4} xs={5} className="text-center">
                                    <CImage
                                      src="/assets/images/property_icons/non-veg_not_allowed.svg"
                                      alt="Tenant Icon"
                                      className="img-fluid"
                                    />
                                  </CCol>
                                  <CCol md={9} xs={7} className="m-1">
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                      {propertyDetails?.non_veg_allowed === 0 ? 'NO' : 'YES'}
                                    </div>
                                    <small className="text-secondary">Non-Veg Allowed</small>
                                  </CCol>
                                </CCol>
                              )}

                              {propertyDetails.granted_security && (
                                <CCol
                                  lg="4"
                                  xs={11}
                                  className="d-flex align-items-center  border rounded p-2 m-2"
                                >
                                  <CCol md={4} xs={5} className="text-center">
                                    <CImage
                                      src="/assets/images/property_icons/Security.svg"
                                      alt="Tenant Icon"
                                      className="img-fluid"
                                    />
                                  </CCol>
                                  <CCol md={9} xs={7} className="m-1">
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                      {propertyDetails?.granted_security}
                                    </div>
                                    <small className="text-secondary">Granted Security</small>
                                  </CCol>
                                </CCol>
                              )}
                              {propertyDetails.drink_allowed && (
                                <CCol
                                  lg="4"
                                  xs={11}
                                  className="d-flex align-items-center  border rounded p-2 m-2"
                                >
                                  <CCol md={4} xs={5} className="text-center">
                                    <CImage
                                      src="/assets/images/property_icons/drink_bottle.svg"
                                      alt="Drink Icon"
                                      className="img-fluid"
                                    />
                                  </CCol>
                                  <CCol md={9} xs={7} className="m-1">
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                      {propertyDetails?.drink_allowed}
                                    </div>
                                    <small className="text-secondary">Drinking Allowed</small>
                                  </CCol>
                                </CCol>
                              )}

                              {propertyDetails.smoke_allowed && (
                                <CCol
                                  lg="4"
                                  xs={11}
                                  className="d-flex align-items-center  border rounded p-2 m-2"
                                >
                                  <CCol md={4} xs={5} className="text-center">
                                    <CImage
                                      src="/assets/images/property_icons/drink_bottle.svg"
                                      alt="Drink Icon"
                                      className="img-fluid"
                                    />
                                  </CCol>
                                  <CCol md={9} xs={7} className="m-1">
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                      {propertyDetails?.smoke_allowed}
                                    </div>
                                    <small className="text-secondary">Smoking Allowed</small>
                                  </CCol>
                                </CCol>
                              )}

                              {propertyDetails.pg_rules && (
                                <CCol
                                  lg="4"
                                  xs={11}
                                  className="d-flex align-items-center  border rounded p-2 m-2"
                                >
                                  <CCol md={4} xs={5} className="text-center">
                                    <CImage
                                      src="/assets/images/property_icons/drink_bottle.svg"
                                      alt="Drink Icon"
                                      className="img-fluid"
                                    />
                                  </CCol>
                                  <CCol md={9} xs={7} className="m-1">
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                      {propertyDetails?.pg_rules}
                                    </div>
                                    <small className="text-secondary">PG Rules</small>
                                  </CCol>
                                </CCol>
                              )}

                              {propertyDetails.sewage_connection && (
                                <CCol
                                  lg="4"
                                  xs={11}
                                  className="d-flex align-items-center  border rounded p-2 m-2"
                                >
                                  <CCol md={4} xs={5} className="text-center">
                                    <CImage
                                      src="/assets/images/property_icons/Sewage_treatment_plant.svg"
                                      alt="Drink Icon"
                                      className="img-fluid"
                                    />
                                  </CCol>
                                  <CCol md={9} xs={7} className="m-1">
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                      {propertyDetails?.sewage_connection === 0 ? 'NO' : 'YES'}
                                    </div>
                                    <small className="text-secondary">Sewage Connection</small>
                                  </CCol>
                                </CCol>
                              )}

                              {propertyDetails.electricity_connection && (
                                <CCol
                                  lg="4"
                                  xs={11}
                                  className="d-flex align-items-center  border rounded p-2 m-2"
                                >
                                  <CCol md={4} xs={5} className="text-center">
                                    <CImage
                                      src="/assets/images/property_icons/electricity.svg"
                                      alt="Drink Icon"
                                      className="img-fluid"
                                    />
                                  </CCol>
                                  <CCol md={9} xs={7} className="m-1">
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                      {propertyDetails?.electricity_connection === 0 ? 'NO' : 'YES'}
                                    </div>
                                    <small className="text-secondary">Electricity Connection</small>
                                  </CCol>
                                </CCol>
                              )}
                            </CRow>

                            {propertyDetails?.other_amenities && (
                              <CRow className="align-items-center">
                                <CCol md={12}>
                                  <p className="fw-bold m-2">Other Ameneties: </p>
                                </CCol>
                                <CCol md={12}>
                                  <p className="m-2">
                                    {propertyDetails?.other_amenities.split(',').map((item) => (
                                      <CButton
                                        disabled
                                        className="rounded-pill m-1"
                                        color="success"
                                        variant="outline"
                                        size="sm"
                                      >
                                        {' '}
                                        {item}
                                      </CButton>
                                    ))}
                                  </p>
                                </CCol>
                              </CRow>
                            )}
                          </CAccordionBody>
                        </CAccordionItem>

                        {/* Images */}
                        <CAccordionItem itemKey={3}>
                          <CAccordionHeader>Images</CAccordionHeader>
                          <CAccordionBody>
                            <CRow>
                              {propertyDetails.images && propertyDetails.images.length > 0 ? (
                                propertyDetails.images.map((item, index) => {
                                  return (
                                    <CCol xs="12" md="4" lg="4">
                                      <CCard className="mb-2">
                                        {/* Image Section */}
                                        {item.file_type === constant.FILE_TYPE.IMAGE_JPG ||
                                        item.file_type === constant.FILE_TYPE.IMAGE_PNG ? (
                                          <CCardImage
                                            style={{
                                              position: 'relative',
                                              height: '150px',
                                              objectFit: 'cover',
                                              borderBottom: '1px solid grey',
                                            }}
                                            orientation="top"
                                            src={
                                              item?.property_img_url ||
                                              '/assets/images/no_image/no_image.png'
                                            }
                                            alt={item?.img_title || 'property images'}
                                          />
                                        ) : item.file_type === constant.FILE_TYPE.VIDEO_AVI ||
                                          item.file_type === constant.FILE_TYPE.VIDEO_MP4 ? (
                                          <video
                                            controls
                                            style={{
                                              position: 'relative',
                                              height: '150px',
                                              objectFit: 'cover',
                                              borderBottom: '1px solid grey',
                                            }}
                                          >
                                            <source
                                              src={item.property_img_url}
                                              type={item.file_type}
                                            />
                                            Your browser does not support the video tag.
                                          </video>
                                        ) : item.file_type === constant.FILE_TYPE.PDF ? (
                                          <iframe
                                            src={item.property_img_url}
                                            style={{
                                              position: 'relative',
                                              height: '150px',
                                              objectFit: 'cover',
                                              borderBottom: '1px solid grey',
                                            }}
                                          />
                                        ) : (
                                          <p>No Supported format.</p>
                                        )}
                                        {/* <CCardImage
                                            style={{
                                              position: 'relative',
                                              height: '150px',
                                              objectFit: 'cover',
                                              borderBottom: '1px solid grey',
                                            }}
                                            orientation="top"
                                            src={
                                              item?.property_img_url ||
                                              '/assets/images/no_image/no_image.png'
                                            }
                                            alt={item?.img_title || 'property images'}
                                          /> */}
                                        {/* Text and Icons Section */}
                                        <CCardBody className="d-flex justify-content-between align-items-center">
                                          <span>{item?.img_title}</span>
                                          {item.file_type === constant.FILE_TYPE.PDF && (
                                            <CButton
                                              color="link"
                                              className="text-danger p-0 me-2"
                                              onClick={() =>
                                                window.open(`${item.property_img_url}`, '_blank')
                                              }
                                            >
                                              <FaExternalLinkAlt />
                                            </CButton>
                                          )}
                                          {isEdit === true && (
                                            <div className="d-flex align-items-center">
                                              {/* Trash Icon */}
                                              {isEdit}
                                              <CButton
                                                color="link"
                                                className="text-danger p-0 me-2"
                                              >
                                                <CIcon icon={cilTrash} size="lg" />
                                              </CButton>
                                              {/* Info Icon */}
                                              <CButton color="link" className="text-primary p-0">
                                                <CIcon icon={cilInfo} size="lg" />
                                              </CButton>
                                            </div>
                                          )}
                                        </CCardBody>
                                      </CCard>
                                    </CCol>
                                  )
                                })
                              ) : (
                                <CHeader> No Images found.</CHeader>
                              )}
                            </CRow>
                          </CAccordionBody>
                        </CAccordionItem>

                        {/* Nearby Locations */}
                        <CAccordionItem itemKey={4}>
                          <CAccordionHeader>Nearby Locations</CAccordionHeader>
                          <CAccordionBody>
                            <p>Nearby locations details go here.</p>
                          </CAccordionBody>
                        </CAccordionItem>

                        {/* Unit Configuration */}
                        {propertyDetails.configuration &&
                          propertyDetails.configuration.length > 0 && (
                            <CAccordionItem itemKey={5}>
                              <CAccordionHeader>Unit Configuration</CAccordionHeader>
                              <CAccordionBody>
                                <CTable align="middle" className="mb-0 border" hover responsive>
                                  <CTableHead color="light">
                                    <CTableRow>
                                      <CTableHeaderCell>Id</CTableHeaderCell>
                                      <CTableHeaderCell>Unit Name</CTableHeaderCell>
                                      <CTableHeaderCell>Carpet Area</CTableHeaderCell>
                                      <CTableHeaderCell>Carpet Price</CTableHeaderCell>
                                      <CTableHeaderCell>Length</CTableHeaderCell>
                                      <CTableHeaderCell>Width</CTableHeaderCell>
                                      <CTableHeaderCell>Action</CTableHeaderCell>
                                    </CTableRow>
                                  </CTableHead>
                                  {propertyDetails.configuration.length <= 0 && (
                                    <CFormLabel>No Configuration found.</CFormLabel>
                                  )}
                                  <CTableBody>
                                    {propertyDetails.configuration.length > 0 &&
                                      propertyDetails.configuration.map((configuration, index) => (
                                        <CTableRow key={index}>
                                          <CTableDataCell>{index + 1}</CTableDataCell>
                                          <CTableDataCell>
                                            {configuration.unit_name
                                              ? configuration.unit_name
                                              : '-'}{' '}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {configuration.carpet_area
                                              ? configuration.carpet_area
                                              : '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {configuration.carpet_price
                                              ? `${constant.CURRENCY_SYMBOL} ${configuration.carpet_price}`
                                              : '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {configuration.length
                                              ? `${configuration.length} ${configuration.length_unit}`
                                              : '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {configuration.width
                                              ? `${configuration.width} ${configuration.width_unit}`
                                              : '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            <CTooltip content="View Image" placement="top">
                                              <CButton
                                                onClick={() =>
                                                  window.open(
                                                    `${configuration.unit_img_url}`,
                                                    '_blank',
                                                  )
                                                }
                                                size="sm"
                                                color="info"
                                                label="view property"
                                                className="me-2 mb-1"
                                              >
                                                <FaExternalLinkAlt color="white" />
                                              </CButton>
                                            </CTooltip>
                                          </CTableDataCell>
                                        </CTableRow>
                                      ))}
                                  </CTableBody>
                                </CTable>
                              </CAccordionBody>
                            </CAccordionItem>
                          )}
                      </CAccordion>

                      <CAccordion activeItemKey={1}>
                        {/* Intrested Users */}
                        {intrestDetails && intrestDetails.length > 0 && (
                          <CAccordionItem itemKey={1}>
                            <CAccordionHeader>Contacted User</CAccordionHeader>
                            <CAccordionBody>
                              <CTable align="middle" className="mb-0 border" hover responsive>
                                <CTableHead color="light">
                                  <CTableRow>
                                    <CTableHeaderCell>Id</CTableHeaderCell>
                                    <CTableHeaderCell>First Name</CTableHeaderCell>
                                    <CTableHeaderCell>Last Name</CTableHeaderCell>
                                    <CTableHeaderCell>Email</CTableHeaderCell>
                                    <CTableHeaderCell>Mobile</CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                {intrestDetails.length <= 0 && (
                                  <CFormLabel>No intrested users found.</CFormLabel>
                                )}
                                <CTableBody>
                                  {intrestDetails.length > 0 &&
                                    intrestDetails.map((intrestUser, index) => (
                                      <CTableRow key={index}>
                                        <CTableDataCell>{index + 1}</CTableDataCell>
                                        <CTableDataCell>{intrestUser.fname || '-'}</CTableDataCell>
                                        <CTableDataCell>{intrestUser.lname || '-'}</CTableDataCell>
                                        <CTableDataCell>{intrestUser.email || '-'}</CTableDataCell>
                                        <CTableDataCell>{intrestUser.mobile || '-'}</CTableDataCell>
                                      </CTableRow>
                                    ))}
                                </CTableBody>
                              </CTable>
                              {intrestDetails.length > 5 && (
                                <div className="d-flex justify-content-end m-2">
                                  <CLink>
                                    <p>View More</p>
                                  </CLink>
                                </div>
                              )}
                            </CAccordionBody>
                          </CAccordionItem>
                        )}

                        {shorlistDetails && shorlistDetails.length > 0 && (
                          <CAccordionItem itemKey={2}>
                            <CAccordionHeader>Shortlist User</CAccordionHeader>
                            <CAccordionBody>
                              <CTable align="middle" className="mb-0 border" hover responsive>
                                <CTableHead color="light">
                                  <CTableRow>
                                    <CTableHeaderCell>Id</CTableHeaderCell>
                                    <CTableHeaderCell>First Name</CTableHeaderCell>
                                    <CTableHeaderCell>Last Name</CTableHeaderCell>
                                    <CTableHeaderCell>Email</CTableHeaderCell>
                                    <CTableHeaderCell>Mobile</CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                {shorlistDetails.length <= 0 && (
                                  <CFormLabel>No shortlist users found.</CFormLabel>
                                )}
                                <CTableBody>
                                  {shorlistDetails.length > 0 &&
                                    shorlistDetails.map((shortlistUser, index) => (
                                      <CTableRow key={index}>
                                        <CTableDataCell>{index + 1}</CTableDataCell>
                                        <CTableDataCell>
                                          {shortlistUser.fname || '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {shortlistUser.lname || '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {shortlistUser.email || '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {shortlistUser.mobile || '-'}
                                        </CTableDataCell>
                                      </CTableRow>
                                    ))}
                                </CTableBody>
                              </CTable>
                              {shorlistDetails.length > 5 && (
                                <div className="d-flex justify-content-end m-2">
                                  <CLink>
                                    <p>View More</p>
                                  </CLink>
                                </div>
                              )}
                            </CAccordionBody>
                          </CAccordionItem>
                        )}
                      </CAccordion>
                    </CCol>
                  )}

                  {/* {( intrestDetails.length > 0 && shorlistDetails.length > 0) && ( */}

                  {/* )} */}

                  {/* Right Column */}
                  <CCol sm="12" xs="12" md="4">
                    <CCard className="mb-4">
                      <CCardBody>
                        <h4>Actions</h4>

                        {/* Mail Status */}
                        {/* <strong>Mails</strong>
                          <CFormSelect
                            name="propertyMails"
                            onChange={(e) => changePropertyMailSend(e)}
                            className="mb-2"
                          >
                            <option value="-1">Select Mails</option>
                            {mailTypes.map((item) => (
                              <option value={item.id}>{item.title}</option>
                            ))}
                          </CFormSelect>
                          <CButton
                            disabled={loading}
                            onClick={(e) => handleMailSubmit(e)}
                            color="primary"
                          >
                            {loading && <CSpinner size="sm" />}
                            Send
                          </CButton>

                          <hr /> */}
                        {/* Property Status */}
                        <strong>Status</strong>
                        <CFormSelect
                          name="propertyStatus"
                          onChange={(e) => changePropertyStatus(e)}
                          className="mb-2"
                        >
                          <option value="-1">Select Status</option>
                          {propertyStatus.map((item) => (
                            <option
                              value={item.id}
                              selected={propertyDetails?.status == item.id ? true : ''}
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

                    <CCard className="mb-4">
                      <CCardBody>
                        <CRow>
                          <strong>Highlights</strong>
                          {/* {intrestDetails?.length > 0 && ( */}
                          <CCol lg="5" md="5" className="text-center border rounded p-3 m-1">
                            <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                              {intrestDetails?.length || '0'}
                            </CHeader>
                            <small className="text-secondary">Total Contacted</small>
                          </CCol>
                          {/* )} */}

                          {/* {shorlistDetails?.length > 0 && ( */}
                          <CCol lg="5" md="5" className="text-center border rounded p-3 m-1">
                            <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                              {shorlistDetails?.length || '0'}
                            </CHeader>
                            <small className="text-secondary">Total Shortlisted</small>
                          </CCol>
                          {/* )}  */}
                        </CRow>
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
                            <CListGroupItem>
                              Activity 5: Property description updated
                            </CListGroupItem>
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

export default ViewPropertyDetails
