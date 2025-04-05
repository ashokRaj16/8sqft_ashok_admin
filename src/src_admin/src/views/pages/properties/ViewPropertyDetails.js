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
import _ from 'lodash'

import {
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaExternalLinkAlt,
  FaEye,
  FaPencilAlt,
  FaShare,
  FaTimes,
  FaTimesCircle,
  FaTrash,
  FaUserAlt,
} from 'react-icons/fa'
import { useParams, useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import Loader from '@util/Loader'
import { ToastMessage } from '@component/ToastMessage'
import { constant } from '@util/constant'
import { formattedDate } from '@util/date'

import {
  sendPropertyMails,
  updateStatusProperty,
  updatePropertyDetails,
  createPropertyFandQ,
} from '@model/propertyModel'

import { getAllCities } from '@model/locationModel'
import { getShortlistUsersByProperty } from '@model/shortlistModel'
import { getIntrestedUsersByProperty } from '@model/intrestedModel'
import { getLeadUsersbyPropertyId } from '@model/marketingModel'
import {
  deletePropertyFandQ,
  getPropertyById,
  updatePropertyFandQ,
  createPropertyConfiguration,
  deletePropertyConfiguration,
  updatePropertyAmeneties,
  updatePropertyConfiguration,
} from '@model/propertyModel'

import {
  validationPropertyFeaturesSchema,
  validationPropertyFQSchema,
  validationPropertyAmenetiesSchema,
  validationPropertyConfigurationSchema,
  validationPropertyImagesSchema,
  validationPropertyNearbySchema,
  WrapperValidationPropertyConfigurationSchema,
} from './validationPropertySchema'

import {
  mailTypes,
  propertyStatus,
  initialPropertyDetailsValues,
  initialPropertyFandQValues,
  FurnishingStatusAmenties,
  initialPropertyConfigurationValues,
  configurationUnit,
  projectAreaUnit,
  ParkingAmenties,
  BasicYNAmenties,
  WashroomAmenties,
  otherAmenties,
  pgRuleAmenties,
  isMaintenanceOptions,
  doorFacingOptions,
  NegotiableType,
  PreferredTenent,
  initialPropertyImagesValues,
  ImageOptions,
  initialPropertyNearbyValues,
  NearbyOptions,
  availableYears,
  availableMonths,
  unitNameConfigOption,
} from './data'
import {
  createPropertyImage,
  createPropertyNearby,
  deletePropertyImage,
  deletePropertyNearby,
  getPropertyNearbyAllCategory,
  updatePropertyImage,
  updatePropertyNearby,
} from '../../../models/propertyModel'
import SearchSelectMaster from '../Component/SearchSelectMaster'
import { getMemberUser } from '../../../models/usersModel'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const ViewPropertyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const quillRef = useRef(null)

  const [searchParams] = useSearchParams()
  const isEditParam = searchParams.get('isEdit') === 'true'
  const activeTabId = searchParams.get('activeTab')

  const [cities, setCities] = useState([])
  const [propertyDetails, setPropertyDetails] = useState(initialPropertyDetailsValues)
  const [intrestDetails, setIntrestDetails] = useState(null)
  const [shorlistDetails, setShorlistDetails] = useState(null)
  const [leadDetails, setLeadDetails] = useState(null)

  const [activeTab, setActiveTab] = useState(activeTabId || 1)
  const [isEdit, setIsEdit] = useState(isEditParam)
  const [isFaqAddNew, setIsFaqAddNew] = useState(false)
  const [isConfAddNew, setIsConfAddNew] = useState(false)
  const [isImageAddNew, setIsImageAddNew] = useState(false)
  const [isNearbyAddNew, setIsNearbyAddNew] = useState(false)
  const [nearbyCategory, setNearbyCategory] = useState([])

  const [previewImage, setPreviewImage] = useState('')
  const [previewImageGallery, setPreviewImageGalllery] = useState('')

  const [mailOption, setMailOptions] = useState(null)
  const [statusOption, setStatusOption] = useState({ statusText: '', status: '' })

  const [isExpandale, setIsExpandable] = useState(false)

  const [loading, setLoading] = useState(false)
  const [userMemberList, setUserMemberList] = useState([])

  const toaster = useRef()
  const [toast, setToasts] = useState(0)

  const EditorOptions = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['table'],
        // ["link", "image"]
      ],
      // handlers : {
      //   image: () => handleImageInsert(),
      // },
    },
  }

  const addToast = (type, message) => {
    const newToast = {
      id: Date.now(),
      component: <ToastMessage key={Date.now()} type={type} message={message} />,
    }
    setToasts((prevToasts) => newToast.component)
  }

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
      // console.log('values: ', values)
      const updatedPropertyData = {
        contact_no: values.contact_no,
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
        property_current_status: values.property_current_status,
        possession_date: values.possession_month
          ? `${values.possession_month ? _.startCase(values.possession_month) : ''}, ${values.possession_year ? values.possession_year : ''} `
          : '',
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

      if (result) {
        addToast('success', result.message)
      }
      changeEditSectionHandler(false)
    } catch (error) {
      addToast('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePropertyAmenetiesSubmit = async (values, resetForm, setSubmitting) => {
    try {
      const updatedPropertyData = {
        furnishing_status: values.furnishing_status,
        parking: values.parking,
        water_supply: values.water_supply,
        granted_security: values.granted_security,
        pet_allowed: values.pet_allowed,
        non_veg_allowed: values.non_veg_allowed,
        other_amenities: values.other_amenities,
        washroom_type: values.washroom_type,
        drink_allowed: values.drink_allowed,
        smoke_allowed: values.smoke_allowed,
        pg_rules: values.pg_rules,
        sewage_connection: values.sewage_connection,
        electricity_connection: values.electricity_connection,
      }
      // console.log('update details:', updatedPropertyData)
      const result = await updatePropertyAmeneties(values.id, updatedPropertyData)

      console.log('Result: ', result)
      if (result) {
        addToast('success', result.message)
      }
      changeEditSectionHandler(false)
    } catch (error) {
      addToast('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  // F&Q section
  const handleCreatePropertyFandqSubmit = async (values, resetForm, setSubmitting) => {
    try {
      console.log('values: ', values)
      const updatedPropertyFandQ = {
        faq_question: values.faq_questions,
        faq_answer: values.faq_answer,
      }

      console.log('update F&Q:', updatedPropertyFandQ)
      const result = await createPropertyFandQ(propertyDetails.id, updatedPropertyFandQ)

      console.log('Result: ', result)
      if (result) {
        addToast('success', result.message)
      }
      loadPropertyData()
      resetForm()
    } catch (error) {
      addToast('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdatePropertyFandqSubmit = async (sid, values, resetForm, setSubmitting) => {
    try {
      console.log('values: ', values)
      const updatedPropertyFandQ = {
        faq_question: values.faq_questions,
        faq_answer: values.faq_answer,
      }

      console.log('update details:', updatedPropertyFandQ)
      const result = await updatePropertyFandQ(propertyDetails.id, sid, updatedPropertyFandQ)

      console.log('Result: ', result)
      if (result) {
        addToast('success', result.message)
      }
      changeEditSectionHandler(false)
      resetForm()
    } catch (error) {
      addToast('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePropertyFandqSubmit = async (sid) => {
    try {
      const result = await deletePropertyFandQ(propertyDetails.id, sid)

      console.log('Result: ', result)
      if (result) {
        addToast('success', result.message)
      }
      loadPropertyData()
    } catch (error) {
      addToast('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Nearby Secion

  const handleCreatePropertyNearbySubmit = async (values, resetForm, setSubmitting) => {
    try {
      // console.log('values: ', values)
      const updatedPropertyNearby = {
        location_title: values.location_title,
        location_value: values.location_value,
        nearby_id: values.nearby_id,
        distance: values.distance,
        time: values.time,
        latitude: values.latitude,
        longitude: values.longitude,
      }

      console.log('update details:', updatedPropertyNearby)
      const result = await createPropertyNearby(propertyDetails.id, updatedPropertyNearby)

      console.log('Result: ', result)
      if (result) {
        addToast('success', result.message)
      }
      // changeEditSectionHandler(false)
      loadPropertyData()
      resetForm()
    } catch (error) {
      addToast('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdatePropertyNearbySubmit = async (sid, values, resetForm, setSubmitting) => {
    try {
      // console.log('values: ', values)
      const updatedPropertyNearby = {
        location_title: values.location_title,
        location_value: values.location_value,
        nearby_id: values.nearby_id,
        distance: values.distance,
        time: values.time,
        latitude: values.latitude,
        longitude: values.longitude,
      }

      console.log('update details:', updatedPropertyNearby)
      const result = await updatePropertyNearby(propertyDetails.id, sid, updatedPropertyNearby)

      console.log('Result: ', result)
      if (result) {
        addToast('success', result.message)
      }
      changeEditSectionHandler(false)
      resetForm()
    } catch (error) {
      addToast('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePropertyNearbySubmit = async (sid) => {
    try {
      const result = await deletePropertyNearby(propertyDetails.id, sid)

      console.log('Result: ', result)
      if (result) {
        addToast('success', result.message)
      }
      loadPropertyData()
    } catch (error) {
      addToast('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Configuration section
  const handleCreatePropertyConfigurationSubmit = async (values, resetForm, setSubmitting) => {
    try {
      const formData = new FormData()

      formData.set('property_id', propertyDetails.id)
      formData.set('unit_name', values.unit_name)
      formData.set('carpet_area', values.carpet_area)
      formData.set('carpet_price', values.carpet_price)
      formData.set('length', values.length)
      formData.set('width', values.width)
      formData.set('width_unit', values.width_unit)
      formData.set('length_unit', values.length_unit)

      if (Array.isArray(values.image)) {
        values.image.forEach((file) => {
          formData.append('images', file)
        })
      } else if (values.image) {
        formData.append('images', values.image)
      } else {
        formData.append('images', '')
      }

      const result = await createPropertyConfiguration(propertyDetails.id, formData)

      if (result) {
        addToast('success', result.message)
      }
      loadPropertyData()
      resetForm()
      setPreviewImage('')
    } catch (error) {
      addToast('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdatePropertyConfigurationSubmit = async (sid, values, resetForm, setSubmitting) => {
    try {
      console.log('values: ', values)
      const updatedPropertyConfiguration = {
        faq_question: values.faq_questions,
        faq_answer: values.faq_answer,
      }

      console.log('update details:', updatedPropertyConfiguration)
      const result = await updatePropertyConfiguration(
        propertyDetails.id,
        sid,
        updatedPropertyConfiguration,
      )

      console.log('Result: ', result)
      if (result) {
        addToast('success', result.message)
      }
      changeEditSectionHandler(false)
      resetForm()
    } catch (error) {
      addToast('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePropertyConfigurationSubmit = async (sid) => {
    try {
      const result = await deletePropertyConfiguration(propertyDetails.id, sid)

      if (result) {
        addToast('success', result.message)
      }
      loadPropertyData()
    } catch (error) {
      addToast('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Image Section
  const handleCreatePropertyImageSubmit = async (values, resetForm, setSubmitting) => {
    try {
      const formData = new FormData()

      formData.set('property_id', propertyDetails.id)
      formData.set('img_title', values.img_title)
      formData.set('image_category', values.image_category)

      if (Array.isArray(values.images)) {
        values.images.forEach((file) => {
          formData.append('images', file)
        })
      } else if (values.images) {
        formData.append('images', values.images)
      } else {
        formData.append('images', '')
      }

      const result = await createPropertyImage(propertyDetails.id, formData)

      if (result) {
        addToast('success', result.message)
      }
      loadPropertyData()
      resetForm()
      setPreviewImageGalllery('')
    } catch (error) {
      addToast('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  // const handleUpdatePropertyImageSubmit = async (sid, values, resetForm, setSubmitting) => {
  //   try {
  //     console.log('values: ', values)
  //     const updatedPropertyConfiguration = {
  //       img_title: values.img_title,
  //       image_category: values.image_category,
  //       images : values.images
  //     }

  //     console.log('update details:', updatedPropertyConfiguration)
  //     const result = await updatePropertyImage(
  //       propertyDetails.id,
  //       sid,
  //       updatedPropertyConfiguration,
  //     )

  //     console.log('Result: ', result)
  //     if (result) {
  //       addToast(<ToastMessage type="success" message={result.message} />)
  //     }
  //     changeEditSectionHandler(false)
  //     resetForm()
  //   } catch (error) {
  //     addToast(<ToastMessage type="error" message={error.message} />)
  //   } finally {
  //     setSubmitting(false)
  //   }
  // }

  const handleDeletePropertyImageSubmit = async (sid) => {
    try {
      const result = await deletePropertyImage(propertyDetails.id, sid)

      if (result) {
        addToast('success', result.message)
      }
      loadPropertyData()
    } catch (error) {
      addToast('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdatePropertyImageSubmit = async (
    sid,
    statusVal = null,
    img_title = null,
    image_category = null,
  ) => {
    try {
      console.log('Status:::', statusVal, sid)
      const data = {
        img_title: img_title || null,
        image_category: image_category || null,
        status: (statusVal && statusVal.toString()) || null,
      }
      const result = await updatePropertyImage(propertyDetails.id, sid, data)

      if (result) {
        addToast('success', result.message)
      }

      setPropertyDetails((prev) => {
        let updatedImages = prev.images.map((item) => {
          // return (item.id == sid ) ? { ...item, status : statusVal.toString() } : item
          if (item.id === sid) {
            if (statusVal) {
              return { ...item, status: statusVal.toString() }
            }
            if (img_title) {
              return { ...item, img_title: img_title }
            }
          }

          return item
        })
        return { ...prev, images: updatedImages }
      })
    } catch (error) {
      addToast('error', error.message)
    } finally {
      // setSubmitting(false)
    }
  }

  const loadPropertyData = async () => {
    try {
      setLoading(true)
      const result = await getPropertyById(id)
      // console.log(result)
      setPropertyDetails(() => {
        const possessionDate = result.data?.possession_date
          ? result.data?.possession_date.trim()
          : null

        let possession_month = null
        let possession_year = null

        if (typeof possessionDate === 'string' && /^[A-Za-z]+,\s\d{4}$/.test(possessionDate)) {
          possession_month = possessionDate.split(',')[0].trim().toLowerCase()
          possession_year = possessionDate.split(',')[1].trim()
        }
        return {
          ...result.data,
          possession_month,
          possession_year,
        }
      })
      setStatusOption({ statusText: result.data.status_text, status: result.data.status })
      setLoading(false)
    } catch (error) {
      console.log(error, 'errorr')
      addToast('error', error.message)
      setLoading(false)
      setTimeout(() => {
        navigate(-1)
      }, 1000)
    }
  }

  // Intrested & shortlisted property
  const loadIntrestSholistData = async () => {
    try {
      setLoading(true)

      const [shorlistResult, intrestResult, leadResult] = await Promise.all([
        getShortlistUsersByProperty(id),
        getIntrestedUsersByProperty(id),
        getLeadUsersbyPropertyId(id),
      ])
      // const shorlistResult = await getShortlistUsersByProperty(id)
      // const intrestResult = await getIntrestedUsersByProperty(id)
      setShorlistDetails(() => shorlistResult.data)
      setIntrestDetails(() => intrestResult.data)
      setLeadDetails(() => leadResult.data)

      setLoading(false)
    } catch (error) {
      addToast('error', error.message)
      setLoading(false)
    }
  }

  const loadCities = () => {
    ;(async () => {
      try {
        const result = await getAllCities()
        setCities(result.data)
      } catch (error) {
        addToast('error', error.message)
      }
    })()
  }

  const loadNearbyCategory = () => {
    ;(async () => {
      try {
        const result = await getPropertyNearbyAllCategory(propertyDetails.id)
        setNearbyCategory(result.data)
      } catch (error) {
        addToast('error', error.message)
      }
    })()
  }

  useEffect(() => {
    loadCities()
    loadPropertyData()

    return () => {}
  }, [])

  useEffect(() => {
    if (propertyDetails && propertyDetails.id) {
      loadNearbyCategory()
      loadIntrestSholistData()
    }

    return () => {}
  }, [propertyDetails.id])

  const [propertySelectedUser, setPropertySelectedUser] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isPropertyUserAssign, setIsPropertyUserAssign] = useState(false)

  console.log(propertySelectedUser, 'selected usersss')

  useEffect(() => {
    ;(async () => {
      const result = await getMemberUser(undefined, 5, undefined, undefined, searchTerm)
      console.log(result, 'userlist...')
      let updatedUsersList = result.data?.users.map((item) => ({
        value: item.id,
        label: [
          `${item.fname || ''} ${item.mname || ''} ${item.lname || ''}`,
          item.mobile,
          item.city_name,
        ]
          .filter(Boolean)
          .join(' | '),
      }))
      setUserMemberList(updatedUsersList || [])
    })()

    return () => {}
  }, [searchTerm])

  const changePropertyMailSend = (event) => {
    const value = event.target.value
    setMailOptions(value)
  }

  const changePropertyStatus = (event) => {
    const { value } = event.target
    const selectedText = event.target.options[event.target.selectedIndex]
    console.log(event.target, selectedText.text)
    setStatusOption({ statusText: selectedText.text, status: value })
  }

  const handleStatusSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const result = await updateStatusProperty(id, statusOption)
      if (result) {
        addToast('success', result.data.message)
      }
      setLoading(false)
    } catch (error) {
      addToast('error', error.message)
      setLoading(false)
    }
  }

  const handlePropertyUserHandler = async (e) => {
    e.preventDefault()
    try {
      if (!propertySelectedUser) {
        addToast('error', 'User not selected. Please select user.')
        setSearchTerm('')
        return
      }
      setLoading(true)
      const updatedUser = {
        user_id: propertySelectedUser,
      }
      const result = await updatePropertyDetails(id, updatedUser)
      if (result) {
        addToast('success', 'User successfully assign to property.')
        setSearchTerm('')
        setPropertySelectedUser('')
        loadPropertyData()
      }
      setLoading(false)
    } catch (error) {
      addToast('error', error.message)
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

        addToast('success', result.data.message)
      }
      setLoading(false)
    } catch (error) {
      console.log('Error: ', error)
      addToast('error', error.message)
      setLoading(false)
    }
  }

  const handleVisitExternalLink = () => {
    if (_.toUpper(propertyDetails) === constant.PROJECT_ATTR.RENT) {
      window.open(
        `${constant.FRONT_BASE_URL}/PropertyDetailsPage/${propertyDetails.title_slug}`,
        '_blank',
      )
    }
    if (_.toUpper(propertyDetails) === constant.PROJECT_ATTR.BUY) {
      window.open(
        `${constant.FRONT_BASE_URL}/PropertyDetailsPage/${propertyDetails.title_slug}`,
        '_blank',
      )
    } else {
      window.open(`${constant.FRONT_BASE_URL}/Builder/${propertyDetails.title_slug}`, '_blank')
    }
  }

  const handleShareProperty = () => {
    addToast('Warning', 'Feature will coming soon')
    // if (_.toUpper(propertyDetails) === constant.PROJECT_ATTR.RENT) {
    //   window.open(`${constant.FRONT_BASE_URL}/PropertyDetailsPage/${propertyDetails.title_slug}`, '_blank')
    // }
    // if (_.toUpper(propertyDetails) === constant.PROJECT_ATTR.BUY) {
    //   window.open(`${constant.FRONT_BASE_URL}/PropertyDetailsPage/${propertyDetails.title_slug}`, '_blank')
    // } else {
    //   window.open(`${constant.FRONT_BASE_URL}/Builder/${propertyDetails.title_slug}`, '_blank')
    // }
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
                            <CRow className="d-flex justify-content-between align-items-center">
                              <CCol className="d-flex flex-column flex-md-row justify-content-start">
                                <p className="fw-bold m-2">Owner Name:</p>
                                <p className="m-2">
                                  <Link to={`/member/view/${propertyDetails.user?.id}`}>
                                    {`${propertyDetails.user?.fname || ''} ${propertyDetails.user?.mname || ''} ${propertyDetails.user?.lname || ''}`.trim() ||
                                      '-'}
                                  </Link>
                                </p>
                              </CCol>

                              <CCol className="d-flex flex-column flex-md-row justify-content-end align-items-center">
                                <CTooltip
                                  content="Assign Property to different user"
                                  placement="top"
                                >
                                  <CButton
                                    onClick={() => setIsPropertyUserAssign((prev) => !prev)}
                                    size="sm"
                                    color="primary"
                                    className="me-2 mb-1"
                                  >
                                    <FaUserAlt />
                                  </CButton>
                                </CTooltip>

                                {isPropertyUserAssign && (
                                  <>
                                    <SearchSelectMaster
                                      options={userMemberList || []}
                                      searchTerm={searchTerm}
                                      setSearchTerm={setSearchTerm}
                                      selectedValue={propertySelectedUser}
                                      setSelectedValue={setPropertySelectedUser}
                                      name="User"
                                      placeholder="Select User"
                                    />
                                    <CButton
                                      onClick={(e) => handlePropertyUserHandler(e)}
                                      size="sm"
                                      color="success"
                                      className="ms-2 mb-1"
                                    >
                                      <FaCheck color="white" />
                                    </CButton>
                                    <CButton
                                      onClick={() => {
                                        setIsPropertyUserAssign(false)
                                        setSearchTerm('')
                                        setPropertySelectedUser('')
                                      }}
                                      size="sm"
                                      color="danger"
                                      className="me-2 ms-2 mb-1"
                                    >
                                      <FaTimes color="white" />
                                    </CButton>
                                  </>
                                )}
                              </CCol>
                            </CRow>

                            <CRow>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Email: </p>
                                <p className="m-2">{propertyDetails.user?.email || '-'}</p>
                                {/* <small>3 days ago</small> */}
                              </CCol>
                              <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                <p className="fw-bold m-2">Mobile: </p>
                                <p className="m-2">{propertyDetails.user?.mobile || '-'}</p>
                              </CCol>
                            </CRow>
                            <hr />

                            <CRow className="align-items-center">
                              <div className="pr-3 d-flex w-100 flex-column align-items-end">
                                <p className="m-2">
                                  {(!isEdit || activeTab !== 1) && (
                                    <CTooltip content="Edit Property" placement="top">
                                      <CButton
                                        onClick={() => changeEditSectionHandler(true, 1)}
                                        size="sm"
                                        color="primary"
                                        className="me-2 mb-1"
                                      >
                                        <FaPencilAlt />
                                      </CButton>
                                    </CTooltip>
                                  )}
                                </p>
                              </div>

                              {propertyDetails?.property_type && (
                                <>
                                  <CCol
                                    lg="3"
                                    md="6"
                                    className="text-center border rounded p-2 m-1"
                                  >
                                    <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                                      {propertyDetails?.property_type || '-'}
                                    </CHeader>
                                    <small className="text-secondary">Property Type</small>
                                  </CCol>
                                </>
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

                              {propertyDetails?.form_step_id && (
                                <CCol lg="3" md="6" className="text-center border rounded p-2 m-1">
                                  <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                                    {`${propertyDetails?.form_step_id} : ${propertyDetails?.form_status} ` ||
                                      '-'}
                                  </CHeader>
                                  <small className="text-secondary">Step Id</small>
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
                              {({
                                values,
                                errors,
                                setFieldValue,
                                handleChange,
                                handleBlur,
                                isSubmitting,
                                resetForm,
                              }) => (
                                <Form>
                                  {/* Property Title */}
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
                                          <p className="m-2">{values?.property_title || '-'}</p>
                                        )}
                                      </CCol>
                                    </CCol>
                                  </CRow>

                                  <CRow className="align-items-center">
                                    <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                      <CCol md={3}>
                                        <p className="fw-bold m-2">Contact No:</p>
                                      </CCol>
                                      <CCol md={9}>
                                        {isEdit && activeTab == 1 ? (
                                          <>
                                            <Field
                                              name="contact_no"
                                              type="text"
                                              className="form-control"
                                              placeholder="Contact Number"
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                            />
                                            <ErrorMessage
                                              name="contact_no"
                                              component={CFormText}
                                              className="text-danger"
                                            />
                                          </>
                                        ) : (
                                          <p className="m-2">{values?.contact_no || '-'}</p>
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
                                            <ReactQuill
                                              ref={quillRef}
                                              name="description"
                                              theme="snow"
                                              value={values.description}
                                              modules={EditorOptions}
                                              onChange={(content) =>
                                                setFieldValue('description', content)
                                              }
                                              placeholder="Write the content..."
                                            />
                                            {/* <Field
                                              type="textarea"
                                              name="description"
                                              as={CFormTextarea}
                                              rows="5"
                                              value={values?.description || ''}
                                              className="form-control"
                                              placeholder="Description"
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                            /> */}
                                            <ErrorMessage
                                              name="description"
                                              component={CFormText}
                                              className="text-danger"
                                            />
                                          </>
                                        ) : (
                                          <>
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html: isExpandale
                                                  ? values?.description
                                                  : values?.description.slice(0, 400),
                                              }}
                                            />
                                            {isExpandale ? (
                                              <span
                                                style={{ color: 'red', cursor: 'pointer' }}
                                                onClick={() => {
                                                  setIsExpandable(false)
                                                }}
                                              >
                                                Show Less
                                              </span>
                                            ) : (
                                              <span
                                                style={{ color: 'red', cursor: 'pointer' }}
                                                onClick={() => {
                                                  setIsExpandable(true)
                                                }}
                                              >
                                                Show More
                                              </span>
                                            )}
                                          </>
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
                                                name="city_id"
                                                as={CFormSelect}
                                                className="form-control"
                                                onChange={(e) => {
                                                  const selectedCity = cities.find(
                                                    (city) =>
                                                      city.id === parseInt(e.target.value, 10),
                                                  )
                                                  if (selectedCity) {
                                                    setFieldValue('city_id', selectedCity.id)
                                                    setFieldValue(
                                                      'city_name',
                                                      selectedCity.city_name,
                                                    )
                                                  } else {
                                                    setFieldValue('city_id', '')
                                                    setFieldValue('city_name', '')
                                                  }
                                                }}
                                              >
                                                <option value="-1">Select city</option>
                                                {cities.map((item) => (
                                                  <option key={item.id} value={item.id}>
                                                    {item.city_name}
                                                  </option>
                                                ))}
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
                                              values?.landmark,
                                              values?.locality,
                                              values?.city_name,
                                              values?.state_name,
                                              values?.pincode,
                                            ]
                                              .filter(Boolean) // Removes falsy values like null, undefined, empty string
                                              .join(', ') || '-'}
                                          </p>
                                        )}
                                      </CCol>
                                    </CCol>
                                  </CRow>

                                  <CRow className="d-flex align-items-center">
                                    <CCol className="pr-3 d-flex w-100 flex-row flex-md-row justify-content-left mb-2">
                                      <CCol md={3}>
                                        <p className="fw-bold m-2">Co-ordinates: </p>
                                      </CCol>
                                      <CCol
                                        md={12}
                                        xs={12}
                                        sm={12}
                                        className="pr-3 d-flex w-100 flex-row flex-column flex-md-column flex-sm-column justify-content-left mb-2"
                                      >
                                        {isEdit && activeTab == 1 ? (
                                          <>
                                            <CCol
                                              md={12}
                                              sm={12}
                                              xs={12}
                                              className="pr-3 d-flex flex-row flex-md-row "
                                            >
                                              <CCol md={3} sm={4} xs={4}>
                                                <p className="fw-bold m-2">Latitude:</p>
                                              </CCol>
                                              <CCol md={6} sm={6} xs={4}>
                                                <Field
                                                  name="latitude"
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Latitude"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                                <ErrorMessage
                                                  name="latitude"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </CCol>
                                            </CCol>

                                            {/* Longitude Field */}
                                            <CCol
                                              md={12}
                                              xs={12}
                                              sm={12}
                                              className="pr-3 d-flex flex-row flex-md-row"
                                            >
                                              <CCol md={3} sm={4} xs={4}>
                                                <p className="fw-bold m-2">Longitude:</p>
                                              </CCol>
                                              <CCol md={6} sm={6} xs={4}>
                                                <Field
                                                  name="longitude"
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Longitude"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                                <ErrorMessage
                                                  name="longitude"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </CCol>
                                            </CCol>
                                          </>
                                        ) : (
                                          <p className="m-2">
                                            Latitude:{' '}
                                            <span className="fst-italic">
                                              {values?.latitude || '-'}
                                            </span>
                                            , Longitude:{' '}
                                            <span className="fst-italic">
                                              {values?.longitude || '-'}
                                            </span>
                                          </p>
                                        )}
                                      </CCol>
                                    </CCol>
                                  </CRow>

                                  {(values?.builtup_area || isEdit) &&
                                    (propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.BUILDER ||
                                      propertyDetails.user_type ===
                                        constant.PROPERTY_USER_TYPE.OWNER) && (
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
                                                    as={CFormSelect}
                                                    name="builtup_area_unit"
                                                    // type="text"
                                                    className="form-control"
                                                    placeholder="Builtup Unit"
                                                    // onChange={handleChange}
                                                    // onBlur={handleBlur}
                                                  >
                                                    <option value={-1}>Select</option>
                                                    {configurationUnit.map((item, index) => (
                                                      <option key={index} value={item.value}>
                                                        {item.title}
                                                      </option>
                                                    ))}
                                                  </Field>
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

                                  {(values?.rera_number || isEdit) &&
                                    propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.BUILDER && (
                                      <CRow className="d-flex align-items-center">
                                        <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                          <CCol md={3}>
                                            <p className="fw-bold m-2">Rera Number: </p>
                                          </CCol>
                                          <CCol md={9}>
                                            {isEdit && activeTab == 1 ? (
                                              <>
                                                <CCol className="d-flex w-100 flex-row">
                                                  <Field
                                                    name="rera_number"
                                                    type="text"
                                                    className="form-control me-2"
                                                    placeholder="Rera_Number"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                </CCol>
                                                <CCol className="d-flex w-100 flex-row">
                                                  <ErrorMessage
                                                    name="rera_number"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </CCol>
                                              </>
                                            ) : (
                                              <p className="m-2">{`${values?.rera_number}`}</p>
                                            )}
                                          </CCol>
                                        </CCol>
                                      </CRow>
                                    )}

                                  {(values?.land_area || isEdit) &&
                                    activeTab == 1 &&
                                    (propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.BUILDER ||
                                      propertyDetails.user_type ===
                                        constant.PROPERTY_USER_TYPE.OWNER) && (
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
                                                    // type="text"
                                                    as={CFormSelect}
                                                    className="form-control"
                                                    placeholder="Land Unit"
                                                    // onChange={handleChange}
                                                    // onBlur={handleBlur}
                                                  >
                                                    <option value={-1}>Select</option>
                                                    {configurationUnit.map((item, index) => (
                                                      <option value={item.value} key={index}>
                                                        {item.title}
                                                      </option>
                                                    ))}
                                                  </Field>
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

                                  {(values?.project_area || isEdit) &&
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
                                                    as={CFormSelect}
                                                    className="form-control"
                                                    placeholder="Project Unit"
                                                    onChange={(e) =>
                                                      setFieldValue(
                                                        'project_area_unit',
                                                        e.target.value !== '-1'
                                                          ? e.target.value
                                                          : null,
                                                      )
                                                    }
                                                  >
                                                    <option value={-1}>Select</option>
                                                    {projectAreaUnit.map((item, index) => (
                                                      <option key={index} value={item.value}>
                                                        {item.title}
                                                      </option>
                                                    ))}
                                                  </Field>
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
                                                {`${values?.project_area} ${values?.project_area_unit} `}
                                              </p>
                                            )}
                                          </CCol>
                                        </CCol>
                                      </CRow>
                                    )}

                                  {(values?.per_sqft_amount || isEdit) &&
                                    propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.BUILDER && (
                                      <CRow className="d-flex align-items-center">
                                        <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                          <CCol md={3}>
                                            <p className="fw-bold m-2">Per SQFT Amount: </p>
                                          </CCol>
                                          <CCol md={9}>
                                            {isEdit && activeTab == 1 ? (
                                              <>
                                                <CCol className="d-flex w-100 flex-row">
                                                  <Field
                                                    name="per_sqft_amount"
                                                    type="text"
                                                    className="form-control me-2"
                                                    placeholder="Per SQFT Amt"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                </CCol>
                                                <CCol className="d-flex w-100 flex-row">
                                                  <ErrorMessage
                                                    name="per_sqft_amount"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </CCol>
                                              </>
                                            ) : (
                                              <p className="m-2">
                                                {`${constant.CURRENCY_SYMBOL} ${values?.per_sqft_amount} `}
                                              </p>
                                            )}
                                          </CCol>
                                        </CCol>
                                      </CRow>
                                    )}

                                  {(values?.rent_amount || isEdit) &&
                                    activeTab == 1 &&
                                    propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.OWNER && (
                                      <CRow className="d-flex align-items-center">
                                        <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                          <CCol md={3}>
                                            <p className="fw-bold m-2">Expected Rent: </p>
                                          </CCol>
                                          <CCol md={9}>
                                            {isEdit && activeTab == 1 ? (
                                              <>
                                                <CCol className="d-flex w-100 flex-row">
                                                  <Field
                                                    name="rent_amount"
                                                    type="text"
                                                    className="form-control me-2"
                                                    placeholder="Rent Amount"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />

                                                  <Field
                                                    name="rent_is_nogotiable"
                                                    type="text"
                                                    as={CFormSelect}
                                                    className="form-control"
                                                    placeholder="Negotiable"
                                                    onChange={(e) =>
                                                      setFieldValue(
                                                        'rent_is_nogotiable',
                                                        e.target.value !== '-1'
                                                          ? e.target.value
                                                          : null,
                                                      )
                                                    }
                                                  >
                                                    <option value="-1">Select</option>
                                                    {NegotiableType.map((item, index) => (
                                                      <option key={index} value={item.value}>
                                                        {item.title}
                                                      </option>
                                                    ))}
                                                  </Field>
                                                </CCol>
                                                <CCol className="d-flex w-100 flex-row">
                                                  <ErrorMessage
                                                    name="rent_amount"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                  <ErrorMessage
                                                    name="rent_is_nogotiable"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </CCol>
                                              </>
                                            ) : (
                                              <p className="m-2">
                                                {`₹ ${values?.rent_amount && Number(values?.rent_amount || 0).toFixed(2)} 
                                                  ${values?.rent_is_nogotiable == 0 ? 'Non Negotiable' : 'Negotiable'} `}
                                              </p>
                                            )}
                                          </CCol>
                                        </CCol>
                                      </CRow>
                                    )}

                                  {/* ### need two textbox */}
                                  {(values?.deposite_amount || isEdit) &&
                                    activeTab == 1 &&
                                    propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.OWNER && (
                                      <CRow className="d-flex align-items-center">
                                        <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                          <CCol md={3}>
                                            <p className="fw-bold m-2">Expected Deposite: </p>
                                          </CCol>
                                          <CCol md={9}>
                                            {isEdit && activeTab == 1 ? (
                                              <>
                                                <CCol className="d-flex w-100 flex-row">
                                                  <Field
                                                    name="deposite_amount"
                                                    type="text"
                                                    className="form-control me-2"
                                                    placeholder="Deposite Amount"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />

                                                  <Field
                                                    name="deposite_is_negotiable"
                                                    as={CFormSelect}
                                                    className="form-control"
                                                    placeholder="Negotiable"
                                                    onChange={(e) =>
                                                      setFieldValue(
                                                        'deposite_is_negotiable',
                                                        e.target.value !== '-1'
                                                          ? e.target.value
                                                          : null,
                                                      )
                                                    }
                                                  >
                                                    <option value="-1">Select</option>
                                                    {NegotiableType.map((item, index) => (
                                                      <option key={index} value={item.value}>
                                                        {item.title}
                                                      </option>
                                                    ))}
                                                  </Field>
                                                </CCol>
                                                <CCol className="d-flex w-100 flex-row">
                                                  <ErrorMessage
                                                    name="deposite_amount"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                  <ErrorMessage
                                                    name="deposite_is_negotiable"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </CCol>
                                              </>
                                            ) : (
                                              <p className="m-2">
                                                {`₹ ${values?.deposite_amount && Number(values?.deposite_amount || 0).toFixed(2)} 
                                                ${values?.deposite_is_negotiable == 0 ? 'Non Negotiable' : 'Negotiable'} `}
                                              </p>
                                            )}
                                          </CCol>
                                        </CCol>
                                      </CRow>
                                    )}

                                  {(values?.door_facing || isEdit) &&
                                    propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.BUILDER && (
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
                                                  as={CFormSelect}
                                                  className="form-control"
                                                  placeholder="Door Facing"
                                                  onChange={(e) =>
                                                    setFieldValue(
                                                      'door_facing',
                                                      e.target.value !== '-1'
                                                        ? e.target.value
                                                        : null,
                                                    )
                                                  }
                                                >
                                                  <option value="-1">Select</option>
                                                  {doorFacingOptions.map((item, index) => (
                                                    <option key={index} value={item.value}>
                                                      {item.title}
                                                    </option>
                                                  ))}
                                                </Field>
                                                <ErrorMessage
                                                  name="door_facing"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </>
                                            ) : (
                                              <p className="m-2">{values?.door_facing || '-'}</p>
                                            )}
                                          </CCol>
                                        </CCol>
                                      </CRow>
                                    )}

                                  {(values?.property_age || isEdit) &&
                                    (propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.BUILDER ||
                                      propertyDetails.user_type ===
                                        constant.PROPERTY_USER_TYPE.OWNER) && (
                                      <CRow className="d-flex align-items-center">
                                        <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
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
                                              <p className="m-2">{values?.property_age || '-'}</p>
                                            )}
                                          </CCol>
                                        </CCol>
                                      </CRow>
                                    )}

                                  {(values?.possession_date || isEdit) &&
                                    propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.BUILDER && (
                                      <CRow className="d-flex align-items-center">
                                        <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                          <CCol md={3}>
                                            <p className="fw-bold m-2">Possession Date: </p>
                                          </CCol>
                                          <CCol md={9}>
                                            {isEdit && activeTab == 1 ? (
                                              <CRow className="d-flex flex-column flex-md-row">
                                                <CCol md={6} className="mb-2">
                                                  <Field
                                                    name="possession_month"
                                                    as={CFormSelect}
                                                    className="form-control"
                                                    value={
                                                      values.possession_month?.toLowerCase() || '-1'
                                                    }
                                                    placeholder="Possession month"
                                                    onChange={(e) => {
                                                      setFieldValue(
                                                        'possession_month',
                                                        e.target.value !== '-1'
                                                          ? e.target.value
                                                          : null,
                                                      )
                                                    }}
                                                  >
                                                    <option value="-1">Select Date</option>
                                                    {availableMonths.map((item, index) => (
                                                      <option
                                                        key={index}
                                                        value={item.title?.toLowerCase()}
                                                      >
                                                        {item.title}
                                                      </option>
                                                    ))}
                                                  </Field>
                                                  <ErrorMessage
                                                    name="possession_month"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </CCol>
                                                <CCol md={6} className="mb-2">
                                                  <Field
                                                    name="possession_year"
                                                    as={CFormSelect}
                                                    className="form-control"
                                                    placeholder="Possession year"
                                                    onChange={(e) => {
                                                      setFieldValue(
                                                        'possession_year',
                                                        e.target.value !== '-1'
                                                          ? e.target.value
                                                          : null,
                                                      )
                                                    }}
                                                  >
                                                    <option value="-1">Select Year</option>
                                                    {availableYears.map((item, index) => (
                                                      <option key={index} value={item.value}>
                                                        {item.title}
                                                      </option>
                                                    ))}
                                                  </Field>
                                                  <ErrorMessage
                                                    name="possession_year"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </CCol>
                                              </CRow>
                                            ) : (
                                              <p className="m-2">
                                                {values.possession_date
                                                  ? `${_.startCase(values?.possession_month)}, ${values.possession_year}`
                                                  : '-'}
                                              </p>
                                            )}
                                          </CCol>
                                        </CCol>
                                      </CRow>
                                    )}

                                  {(values?.preferred_tenent || isEdit) &&
                                    propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.OWNER && (
                                      <CRow className="d-flex align-items-center">
                                        <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                          <CCol md={3}>
                                            <p className="fw-bold m-2">Preferred Tenent: </p>
                                          </CCol>
                                          <CCol md={9}>
                                            {isEdit && activeTab == 1 ? (
                                              <>
                                                <Field
                                                  name="preferred_tenent"
                                                  as={CFormSelect}
                                                  className="form-control"
                                                  placeholder="Preferred Tenent"
                                                  onChange={(e) => {
                                                    setFieldValue(
                                                      'preferred_tenant',
                                                      e.target.value !== '-1'
                                                        ? e.target.value
                                                        : null,
                                                    )
                                                  }}
                                                >
                                                  <option value="-1">Select</option>
                                                  {PreferredTenent.map((item, index) => (
                                                    <option key={index} value={item.value}>
                                                      {item.title}
                                                    </option>
                                                  ))}
                                                </Field>
                                                <ErrorMessage
                                                  name="preferred_tenent"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </>
                                            ) : (
                                              <p className="m-2">
                                                {values?.preferred_tenent || '-'}
                                              </p>
                                            )}
                                          </CCol>
                                        </CCol>
                                      </CRow>
                                    )}

                                  {(values?.is_maintenance || isEdit) &&
                                    (propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.BUILDER ||
                                      propertyDetails.user_type ===
                                        constant.PROPERTY_USER_TYPE.OWNER) && (
                                      <CRow className="d-flex align-items-center">
                                        <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                          <CCol md={3}>
                                            <p className="fw-bold m-2">Maintenance: </p>
                                          </CCol>
                                          <CCol md={9}>
                                            {isEdit && activeTab == 1 ? (
                                              <>
                                                <Field
                                                  name="is_maintenance"
                                                  as={CFormSelect}
                                                  className="form-control"
                                                  placeholder="Is Maintenance"
                                                  onChange={(e) => {
                                                    setFieldValue(
                                                      'is_maintenance',
                                                      e.target.value !== '-1'
                                                        ? e.target.value
                                                        : null,
                                                    )
                                                  }}
                                                >
                                                  <option value="-1">Select</option>
                                                  {isMaintenanceOptions.map((item, index) => (
                                                    <option key={index} value={item.value}>
                                                      {item.title}
                                                    </option>
                                                  ))}
                                                </Field>
                                                <ErrorMessage
                                                  name="is_maintenance"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </>
                                            ) : (
                                              <p className="m-2">{values?.is_maintenance}</p>
                                            )}
                                          </CCol>
                                        </CCol>
                                      </CRow>
                                    )}

                                  {(values?.monthly_maintenance || isEdit) &&
                                    propertyDetails.user_type ===
                                      constant.PROPERTY_USER_TYPE.BUILDER && (
                                      <CRow className="d-flex align-items-center">
                                        <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
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
                                                {`₹ ${values?.monthly_maintenance}`}
                                              </p>
                                            )}
                                          </CCol>
                                        </CCol>
                                      </CRow>
                                    )}

                                  <hr />
                                  <CRow className="d-flex align-items-center">
                                    <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                      {(values?.unit_number || isEdit) &&
                                        (propertyDetails.user_type ===
                                          constant.PROPERTY_USER_TYPE.BUILDER ||
                                          propertyDetails.user_type ===
                                            constant.PROPERTY_USER_TYPE.OWNER) && (
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

                                      {(values?.washrooms || isEdit) &&
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
                                    <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                      {(values?.total_units || isEdit) &&
                                        (propertyDetails.user_type ===
                                          constant.PROPERTY_USER_TYPE.BUILDER ||
                                          propertyDetails.user_type ===
                                            constant.PROPERTY_USER_TYPE.OWNER) && (
                                          <>
                                            <CCol xs={6} lg={3} md={3}>
                                              <p className="fw-bold m-2">Total Units: </p>
                                            </CCol>
                                            <CCol xs={6} lg={3} md={3}>
                                              {isEdit && activeTab == 1 ? (
                                                <>
                                                  <Field
                                                    name="total_units"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Total Units"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                  <ErrorMessage
                                                    name="total_units"
                                                    component={CFormText}
                                                    className="text-danger"
                                                  />
                                                </>
                                              ) : (
                                                <p className="m-2">{values?.total_units || '-'}</p>
                                              )}
                                            </CCol>
                                          </>
                                        )}
                                    </CCol>
                                  </CRow>
                                  <CRow className="d-flex align-items-center">
                                    <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                      {(values?.total_wing || isEdit) &&
                                        propertyDetails.user_type ===
                                          constant.PROPERTY_USER_TYPE.OWNER && (
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
                                                <p className="m-2">{values?.total_wing || '-'}</p>
                                              )}
                                            </CCol>
                                          </>
                                        )}

                                      {(values?.wing_name || isEdit) &&
                                        propertyDetails.user_type ===
                                          constant.PROPERTY_USER_TYPE.OWNER && (
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
                                                <p className="m-2">{values?.wing_name || '-'}</p>
                                              )}
                                            </CCol>
                                          </>
                                        )}
                                    </CCol>
                                  </CRow>
                                  <CRow className="d-flex align-items-center">
                                    <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                      {(values?.total_floors || isEdit) &&
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

                                      {(values?.floor_number || isEdit) &&
                                        (propertyDetails.user_type ===
                                          constant.PROPERTY_USER_TYPE.BUILDER ||
                                          propertyDetails.user_type ===
                                            constant.PROPERTY_USER_TYPE.OWNER) && (
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
                                    <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left mb-2">
                                      {(values?.bed_rooms || isEdit) &&
                                        propertyDetails.user_type ===
                                          constant.PROPERTY_USER_TYPE.OWNER && (
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

                                      {(values?.balcony || isEdit) &&
                                        propertyDetails.user_type ===
                                          constant.PROPERTY_USER_TYPE.OWNER && (
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
                                    {isEdit && activeTab == 1 && (
                                      <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left ">
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
                                            resetForm()
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
                            <Formik
                              initialValues={propertyDetails}
                              enableReinitialize
                              validationSchema={validationPropertyAmenetiesSchema}
                              onSubmit={(values, { setSubmitting, resetForm }) => {
                                console.log(values)
                                handlePropertyAmenetiesSubmit(values, resetForm, setSubmitting)
                              }}
                            >
                              {({
                                values,
                                setFieldValue,
                                handleChange,
                                handleBlur,
                                isSubmitting,
                                resetForm,
                              }) => (
                                <Form>
                                  <CRow>
                                    <p className="m-2 text-end">
                                      {/* { isEdit.toString()} { activeTab} */}
                                      {(!isEdit || activeTab !== 2) && (
                                        <CButton
                                          onClick={() => changeEditSectionHandler(true, 2)}
                                          size="sm"
                                          color="primary"
                                          className="me-2 mb-1"
                                        >
                                          <FaPencilAlt />
                                        </CButton>
                                      )}
                                    </p>
                                    {isEdit && activeTab == 2 ? (
                                      <CRow className="mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Furnishing:</p>
                                        </CCol>
                                        <CCol md={4}>
                                          <Field
                                            name="furnishing_status"
                                            as={CFormSelect}
                                            className="form-control"
                                            onChange={(e) => {
                                              setFieldValue(
                                                'furnishing_status',
                                                e.target.value !== '-1' ? e.target.value : null,
                                              )
                                            }}
                                          >
                                            <option value="-1">Select</option>
                                            {FurnishingStatusAmenties.map((item) => (
                                              <option value={item.value}>{item.title}</option>
                                            ))}
                                          </Field>
                                          <ErrorMessage
                                            name="furnishing_status"
                                            component={CFormText}
                                            className="text-danger"
                                          />
                                        </CCol>
                                      </CRow>
                                    ) : (
                                      values.furnishing_status && (
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
                                              {values?.furnishing_status}
                                            </div>
                                            <small className="text-secondary">
                                              Funishing Status
                                            </small>
                                          </CCol>
                                        </CCol>
                                      )
                                    )}

                                    {isEdit && activeTab == 2 ? (
                                      <CRow className="mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Parking:</p>
                                        </CCol>
                                        <CCol md={4}>
                                          <Field
                                            name="parking"
                                            as={CFormSelect}
                                            className="form-control"
                                            onChange={(e) => {
                                              setFieldValue(
                                                'parking',
                                                e.target.value !== '-1' ? e.target.value : null,
                                              )
                                            }}
                                          >
                                            <option value="-1">Select</option>
                                            {ParkingAmenties.map((item) => (
                                              <option value={item.value}>{item.title}</option>
                                            ))}
                                          </Field>
                                          <ErrorMessage
                                            name="parking"
                                            component={CFormText}
                                            className="text-danger"
                                          />
                                        </CCol>
                                      </CRow>
                                    ) : (
                                      values.parking && (
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
                                              {values?.parking}
                                            </div>
                                            <small className="text-secondary">Parking</small>
                                          </CCol>
                                        </CCol>
                                      )
                                    )}

                                    {isEdit && activeTab == 2 ? (
                                      <CRow className="mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Water Supply:</p>
                                        </CCol>
                                        <CCol md={4}>
                                          <Field
                                            name="water_supply"
                                            as={CFormSelect}
                                            className="form-control"
                                            onChange={(e) => {
                                              setFieldValue(
                                                'water_supply',
                                                e.target.value !== '-1' ? e.target.value : null,
                                              )
                                            }}
                                          >
                                            <option value="-1">Select</option>
                                            {BasicYNAmenties.map((item) => (
                                              <option value={item.title}>{item.title}</option>
                                            ))}
                                          </Field>
                                          <ErrorMessage
                                            name="water_supply"
                                            component={CFormText}
                                            className="text-danger"
                                          />
                                        </CCol>
                                      </CRow>
                                    ) : (
                                      values.water_supply && (
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
                                              {values?.water_supply}
                                            </div>
                                            <small className="text-secondary">Water Supply</small>
                                          </CCol>
                                        </CCol>
                                      )
                                    )}

                                    {isEdit && activeTab == 2 ? (
                                      <CRow className="mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Washroom Type:</p>
                                        </CCol>
                                        <CCol md={4}>
                                          <Field
                                            name="washroom_type"
                                            as={CFormSelect}
                                            className="form-control"
                                            onChange={(e) => {
                                              setFieldValue(
                                                'washroom_type',
                                                e.target.value !== '-1' ? e.target.value : null,
                                              )
                                            }}
                                          >
                                            <option value="-1">Select</option>
                                            {WashroomAmenties.map((item) => (
                                              <option value={item.value}>{item.title}</option>
                                            ))}
                                          </Field>
                                          <ErrorMessage
                                            name="washroom_type"
                                            component={CFormText}
                                            className="text-danger"
                                          />
                                        </CCol>
                                      </CRow>
                                    ) : (
                                      values.washroom_type && (
                                        <CCol
                                          lg="4"
                                          xs={11}
                                          className="d-flex align-items-center  border rounded p-2 m-2"
                                        >
                                          <CCol md={4} xs={5} className="text-center">
                                            <CImage
                                              src="/assets/images/property_icons/Washroom.svg"
                                              alt="Tenant Icon"
                                              className="img-fluid"
                                            />
                                          </CCol>
                                          <CCol md={9} xs={7} className="m-1">
                                            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                              {values?.washroom_type}
                                            </div>
                                            <small className="text-secondary">Washroom Type</small>
                                          </CCol>
                                        </CCol>
                                      )
                                    )}
                                    {isEdit && activeTab == 2 ? (
                                      <CRow className="mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Pet Allowed:</p>
                                        </CCol>
                                        <CCol md={4}>
                                          <Field
                                            name="pet_allowed"
                                            as={CFormSelect}
                                            className="form-control"
                                            onChange={(e) => {
                                              setFieldValue(
                                                'pet_allowed',
                                                e.target.value !== '-1' ? e.target.value : null,
                                              )
                                            }}
                                          >
                                            <option value="-1">Select</option>
                                            {BasicYNAmenties.map((item) => (
                                              <option value={item.value}>{item.title}</option>
                                            ))}
                                          </Field>
                                          <ErrorMessage
                                            name="pet_allowed"
                                            component={CFormText}
                                            className="text-danger"
                                          />
                                        </CCol>
                                      </CRow>
                                    ) : (
                                      values.pet_allowed && (
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
                                              {values?.pet_allowed === 0 ? 'NO' : 'YES'}
                                            </div>
                                            <small className="text-secondary">Pet Allowed</small>
                                          </CCol>
                                        </CCol>
                                      )
                                    )}

                                    {isEdit && activeTab == 2 ? (
                                      <CRow className="mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Non Veg Allowed:</p>
                                        </CCol>
                                        <CCol md={4}>
                                          <Field
                                            name="non_veg_allowed"
                                            as={CFormSelect}
                                            className="form-control"
                                            onChange={(e) => {
                                              setFieldValue(
                                                'non_veg_allowed',
                                                e.target.value !== '-1' ? e.target.value : null,
                                              )
                                            }}
                                          >
                                            <option value="-1">Select</option>
                                            {BasicYNAmenties.map((item) => (
                                              <option value={item.value}>{item.title}</option>
                                            ))}
                                          </Field>
                                          <ErrorMessage
                                            name="non_veg_allowed"
                                            component={CFormText}
                                            className="text-danger"
                                          />
                                        </CCol>
                                      </CRow>
                                    ) : (
                                      values.non_veg_allowed && (
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
                                              {values?.non_veg_allowed === 0 ? 'NO' : 'YES'}
                                            </div>
                                            <small className="text-secondary">
                                              Non-Veg Allowed
                                            </small>
                                          </CCol>
                                        </CCol>
                                      )
                                    )}

                                    {isEdit && activeTab == 2 ? (
                                      <CRow className="mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Security:</p>
                                        </CCol>
                                        <CCol md={4}>
                                          <Field
                                            name="granted_security"
                                            as={CFormSelect}
                                            className="form-control"
                                            onChange={(e) => {
                                              setFieldValue(
                                                'granted_security',
                                                e.target.value !== '-1' ? e.target.value : null,
                                              )
                                            }}
                                          >
                                            <option value="-1">Select</option>
                                            {BasicYNAmenties.map((item) => (
                                              <option value={item.title}>{item.title}</option>
                                            ))}
                                          </Field>
                                          <ErrorMessage
                                            name="granted_security"
                                            component={CFormText}
                                            className="text-danger"
                                          />
                                        </CCol>
                                      </CRow>
                                    ) : (
                                      values.granted_security && (
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
                                              {values?.granted_security}
                                            </div>
                                            <small className="text-secondary">
                                              Granted Security
                                            </small>
                                          </CCol>
                                        </CCol>
                                      )
                                    )}

                                    {isEdit && activeTab == 2 ? (
                                      <CRow className="mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Drink Allowed:</p>
                                        </CCol>
                                        <CCol md={4}>
                                          <Field
                                            name="drink_allowed"
                                            as={CFormSelect}
                                            className="form-control"
                                            onChange={(e) => {
                                              setFieldValue(
                                                'drink_allowed',
                                                e.target.value !== '-1' ? e.target.value : null,
                                              )
                                            }}
                                          >
                                            <option value="-1">Select</option>
                                            {BasicYNAmenties.map((item) => (
                                              <option value={item.value}>{item.title}</option>
                                            ))}
                                          </Field>
                                          <ErrorMessage
                                            name="drink_allowed"
                                            component={CFormText}
                                            className="text-danger"
                                          />
                                        </CCol>
                                      </CRow>
                                    ) : (
                                      values.drink_allowed && (
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
                                              {values?.drink_allowed === '1' ? 'YES' : 'No'}
                                            </div>
                                            <small className="text-secondary">
                                              Drinking Allowed
                                            </small>
                                          </CCol>
                                        </CCol>
                                      )
                                    )}

                                    {isEdit && activeTab == 2 ? (
                                      <CRow className="mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Smoke Allowed:</p>
                                        </CCol>
                                        <CCol md={4}>
                                          <Field
                                            name="smoke_allowed"
                                            as={CFormSelect}
                                            className="form-control"
                                            onChange={(e) => {
                                              setFieldValue(
                                                'smoke_allowed',
                                                e.target.value !== '-1' ? e.target.value : null,
                                              )
                                            }}
                                          >
                                            <option value="-1">Select</option>
                                            {BasicYNAmenties.map((item) => (
                                              <option value={item.value}>{item.title}</option>
                                            ))}
                                          </Field>
                                          <ErrorMessage
                                            name="smoke_allowed"
                                            component={CFormText}
                                            className="text-danger"
                                          />
                                        </CCol>
                                      </CRow>
                                    ) : (
                                      values.smoke_allowed && (
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
                                              {values?.smoke_allowed === '1' ? 'YES' : 'No'}
                                            </div>
                                            <small className="text-secondary">
                                              Smoking Allowed
                                            </small>
                                          </CCol>
                                        </CCol>
                                      )
                                    )}

                                    {isEdit && activeTab == 2 ? (
                                      <CRow className="mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">PG Rules:</p>
                                        </CCol>
                                        <CCol md={4}>
                                          <Field
                                            name="pg_rules"
                                            as={CFormSelect}
                                            className="form-control"
                                            onChange={(e) => {
                                              setFieldValue(
                                                'pg_rules',
                                                e.target.value !== '-1' ? e.target.value : null,
                                              )
                                            }}
                                          >
                                            <option value="-1">Select</option>
                                            {pgRuleAmenties.map((item) => (
                                              <option value={item.title}>{item.title}</option>
                                            ))}
                                          </Field>
                                          <ErrorMessage
                                            name="pg_rules"
                                            component={CFormText}
                                            className="text-danger"
                                          />
                                        </CCol>
                                      </CRow>
                                    ) : (
                                      values.pg_rules && (
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
                                              {values?.pg_rules}
                                            </div>
                                            <small className="text-secondary">PG Rules</small>
                                          </CCol>
                                        </CCol>
                                      )
                                    )}

                                    {isEdit && activeTab == 2 ? (
                                      <CRow className="mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Sewage Connection:</p>
                                        </CCol>
                                        <CCol md={4}>
                                          <Field
                                            name="sewage_connection"
                                            as={CFormSelect}
                                            className="form-control"
                                            onChange={(e) => {
                                              setFieldValue(
                                                'sewage_connection',
                                                e.target.value !== '-1' ? e.target.value : null,
                                              )
                                            }}
                                          >
                                            <option value="-1">Select</option>
                                            {BasicYNAmenties.map((item) => (
                                              <option value={item.value}>{item.title}</option>
                                            ))}
                                          </Field>
                                          <ErrorMessage
                                            name="sewage_connection"
                                            component={CFormText}
                                            className="text-danger"
                                          />
                                        </CCol>
                                      </CRow>
                                    ) : (
                                      values.sewage_connection && (
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
                                              {values?.sewage_connection === 0 ? 'NO' : 'YES'}
                                            </div>
                                            <small className="text-secondary">
                                              Sewage Connection
                                            </small>
                                          </CCol>
                                        </CCol>
                                      )
                                    )}

                                    {isEdit && activeTab == 2 ? (
                                      <CRow className="mb-2">
                                        <CCol md={3}>
                                          <p className="fw-bold m-2">Electricity Connection:</p>
                                        </CCol>
                                        <CCol md={4}>
                                          <Field
                                            name="electricity_connection"
                                            as={CFormSelect}
                                            className="form-control"
                                            onChange={(e) => {
                                              setFieldValue(
                                                'electricity_connection',
                                                e.target.value !== '-1' ? e.target.value : null,
                                              )
                                            }}
                                          >
                                            <option value="-1">Select</option>
                                            {BasicYNAmenties.map((item) => (
                                              <option value={item.value}>{item.title}</option>
                                            ))}
                                          </Field>
                                          <ErrorMessage
                                            name="electricity_connection"
                                            component={CFormText}
                                            className="text-danger"
                                          />
                                        </CCol>
                                      </CRow>
                                    ) : (
                                      values.electricity_connection && (
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
                                              {values?.electricity_connection === 0 ? 'NO' : 'YES'}
                                            </div>
                                            <small className="text-secondary">
                                              Electricity Connection
                                            </small>
                                          </CCol>
                                        </CCol>
                                      )
                                    )}
                                  </CRow>

                                  {isEdit && activeTab == 2 ? (
                                    <CRow className="mb-2">
                                      <CCol md={3}>
                                        <p className="fw-bold m-2">Other Amenities:</p>
                                      </CCol>
                                      <CCol md={4}>
                                        <Field
                                          name="other_amenities"
                                          // as={CFormSelect}
                                          as="select"
                                          className="form-control"
                                          multiple
                                          value={
                                            values.other_amenities
                                              ? values.other_amenities
                                                  .split(',')
                                                  .map((v) => v.toLowerCase().trim())
                                              : []
                                          }
                                          onChange={(e) => {
                                            console.log(
                                              Array.from(
                                                e.target.selectedOptions,
                                                (option) => option.value,
                                              ),
                                            )
                                            const selectedvalue = Array.from(
                                              e.target.selectedOptions,
                                              (option) => option.value,
                                            )
                                            const commaSeperated = selectedvalue.join(',')
                                            setFieldValue('other_amenities', commaSeperated)
                                          }}
                                        >
                                          <option value="-1">Select</option>
                                          {otherAmenties.map((item) => (
                                            <option value={item.value.toLowerCase().trim()}>
                                              {item.title}
                                            </option>
                                          ))}
                                        </Field>
                                        <ErrorMessage
                                          name="other_amenities"
                                          component={CFormText}
                                          className="text-danger"
                                        />
                                      </CCol>
                                    </CRow>
                                  ) : (
                                    values?.other_amenities && (
                                      <CRow className="align-items-center">
                                        <CCol md={12}>
                                          <p className="fw-bold m-2">Other Ameneties: </p>
                                        </CCol>
                                        <CCol md={12}>
                                          <p className="m-2">
                                            {values.other_amenities &&
                                              values?.other_amenities
                                                .split(',')
                                                .map((item, index) => (
                                                  <CButton
                                                    key={index}
                                                    disabled
                                                    className="rounded-pill m-1"
                                                    color="success"
                                                    variant="outline"
                                                    size="sm"
                                                  >
                                                    {item}
                                                  </CButton>
                                                ))}
                                          </p>
                                        </CCol>
                                      </CRow>
                                    )
                                  )}

                                  <CRow className="d-flex align-items-center">
                                    {isEdit && activeTab == 2 && (
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
                                            resetForm()
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

                        {/* Images */}
                        <CAccordionItem itemKey={3}>
                          <CAccordionHeader>Images</CAccordionHeader>
                          <CAccordionBody>
                            <CRow>
                              {propertyDetails.images.length <= 0 && (
                                <CHeader> No Images found.</CHeader>
                              )}

                              {isEdit && activeTab == 3 && (
                                <CCol className="mt-4">
                                  <CButton
                                    className="me-2"
                                    disabled={loading}
                                    onClick={() => setIsImageAddNew(() => !isImageAddNew)}
                                    color="primary"
                                  >
                                    Add New
                                  </CButton>

                                  <CButton
                                    disabled={loading}
                                    onClick={() => changeEditSectionHandler(false)}
                                    color="primary"
                                  >
                                    Cancel
                                  </CButton>
                                </CCol>
                              )}

                              {((isImageAddNew && isEdit) ||
                                propertyDetails.images?.length <= 0) && (
                                <CRow>
                                  <CRow>
                                    <Formik
                                      initialValues={initialPropertyImagesValues}
                                      validationSchema={validationPropertyImagesSchema}
                                      onSubmit={(values, { setSubmitting, resetForm }) => {
                                        console.log(values)
                                        handleCreatePropertyImageSubmit(
                                          values,
                                          resetForm,
                                          setSubmitting,
                                        )
                                      }}
                                    >
                                      {({
                                        values,
                                        handleChange,
                                        handleBlur,
                                        isSubmitting,
                                        setFieldValue,
                                        resetForm,
                                      }) => (
                                        <Form>
                                          <CHeader className="d-flex">
                                            <CCol md={2} className="fw-bold">
                                              Title:
                                            </CCol>
                                            <CCol md={10}>
                                              <>
                                                <Field
                                                  name="img_title"
                                                  as={CFormSelect}
                                                  className="form-control"
                                                  placeholder="Title"
                                                >
                                                  <option value="-1">Select</option>
                                                  {ImageOptions.map((item, index) => (
                                                    <option key={item.id} value={item.title}>
                                                      {item.title}
                                                    </option>
                                                  ))}
                                                </Field>
                                                <ErrorMessage
                                                  name="img_title"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </>
                                            </CCol>
                                          </CHeader>

                                          <CRow className="mt-2">
                                            <CCol md={2} className="fw-bold">
                                              Category:
                                            </CCol>
                                            <CCol md={10}>
                                              <>
                                                {/* <Field
                                                  name="image_category"
                                                  type="text"
                                                  as={CFormInput}
                                                  className="form-control"
                                                  placeholder="Category"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                /> */}
                                                <Field
                                                  name="image_category"
                                                  as={CFormSelect}
                                                  className="form-control"
                                                  placeholder="Title"
                                                >
                                                  <option value="-1">Select</option>
                                                  {[
                                                    ...new Set(
                                                      ImageOptions.map(
                                                        (item, index) => item.category,
                                                      ),
                                                    ),
                                                  ].map((item, index) => (
                                                    <option key={index} value={item}>
                                                      {item}
                                                    </option>
                                                  ))}
                                                </Field>
                                                <ErrorMessage
                                                  name="image_category"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </>
                                            </CCol>
                                          </CRow>

                                          <CRow className="mb-3 mt-2">
                                            {/* <CCol md="12"> */}
                                            <CCol md={2} className="fw-bold">
                                              Image:
                                            </CCol>
                                            <CCol md={10}>
                                              <CFormInput
                                                type="file"
                                                className="mb-2"
                                                name="images"
                                                multiple
                                                onChange={(e) => {
                                                  const file = e.target.files[0]
                                                  if (file) {
                                                    console.log(file.type)
                                                    setFieldValue('images', e.target.files[0])
                                                    setFieldValue('youtube_link', '')
                                                    setFieldValue('images_type', file.type)
                                                    setPreviewImageGalllery(
                                                      URL.createObjectURL(file),
                                                    )
                                                  }
                                                }}
                                              />

                                              {/* {values.images_type + previewImageGallery} */}
                                              <ErrorMessage
                                                name="images"
                                                component="div"
                                                className="text-danger"
                                              />
                                            </CCol>
                                          </CRow>

                                          <CRow className="mb-3 mt-2">
                                            {/* <CCol md="12"> */}
                                            <CCol md={2} className="fw-bold">
                                              Youtube :
                                            </CCol>
                                            <CCol md={10}>
                                              <CFormInput
                                                type="text"
                                                className="mb-2"
                                                name="youtube_link"
                                                multiple
                                                value={values.youtube_link}
                                                onChange={(e) => {
                                                  const file = e.target.value
                                                  if (file) {
                                                    console.log(file)
                                                    setFieldValue('images', '')
                                                    setFieldValue('youtube_link', e.target.value)
                                                    setFieldValue('images_type', constant.YOUTUBE)
                                                    setPreviewImageGalllery(file)
                                                  }
                                                }}
                                              />

                                              <ErrorMessage
                                                name="youtube_link"
                                                component="div"
                                                className="text-danger"
                                              />
                                            </CCol>
                                          </CRow>

                                          {previewImageGallery &&
                                            (values.images_type === constant.FILE_TYPE.IMAGE_PNG ||
                                            values.images_type === constant.FILE_TYPE.IMAGE_JPG ||
                                            values.images_type === constant.FILE_TYPE.IMAGE_BMP ? (
                                              <CImage
                                                width={200}
                                                height={100}
                                                className="w-full h-full object-cover"
                                                src={previewImageGallery || ''}
                                              />
                                            ) : values.images_type ===
                                                constant.FILE_TYPE.VIDEO_MP4 ||
                                              values.images_type === constant.FILE_TYPE.VIDEO_MOV ||
                                              values.images_type ===
                                                constant.FILE_TYPE.VIDEO_WEBM ? (
                                              <video
                                                src={`${previewImageGallery}`}
                                                width={200}
                                                height={100}
                                                controls
                                                className="w-full h-full object-cover"
                                                allow="fullscreen"
                                              >
                                                {' '}
                                              </video>
                                            ) : values.images_type === constant.FILE_TYPE.PDF ||
                                              values.images_type === constant.YOUTUBE ? (
                                              <iframe
                                                src={
                                                  previewImageGallery.includes(
                                                    'youtube.com/watch?v=',
                                                  )
                                                    ? previewImageGallery.replace(
                                                        'watch?v=',
                                                        'embed/',
                                                      )
                                                    : previewImageGallery.includes('youtu.be/')
                                                      ? previewImageGallery.replace(
                                                          'youtu.be/',
                                                          'youtube.com/embed/',
                                                        )
                                                      : previewImageGallery.includes(
                                                            'youtube.com/shorts/',
                                                          )
                                                        ? previewImageGallery.replace(
                                                            'youtube.com/shorts/',
                                                            'youtube.com/embed/',
                                                          )
                                                        : `${previewImageGallery}`
                                                }
                                                width={200}
                                                height={100}
                                                className="w-full h-full object-cover"
                                                allow="fullscreen"
                                              >
                                                {' '}
                                              </iframe>
                                            ) : null)}
                                          <CButton
                                            disabled={isSubmitting}
                                            type="submit"
                                            color="primary"
                                          >
                                            {isSubmitting && <CSpinner size="sm" />}
                                            Save
                                          </CButton>
                                        </Form>
                                      )}
                                    </Formik>
                                  </CRow>
                                </CRow>
                              )}

                              {propertyDetails.images && propertyDetails.images.length > 0 && (
                                <>
                                  <p className="m-2 text-end">
                                    {(!isEdit || activeTab !== 6) && (
                                      <CButton
                                        onClick={() => changeEditSectionHandler(true, 3)}
                                        size="sm"
                                        color="primary"
                                        className="me-2 mb-1"
                                      >
                                        <FaPencilAlt />
                                      </CButton>
                                    )}
                                  </p>

                                  {propertyDetails.images.map((item, index) => {
                                    return (
                                      <CCol key={index} xs="12" md="4" lg="4">
                                        <CCard className="mb-2">
                                          {/* Image Section */}
                                          {item.file_type === constant.FILE_TYPE.IMAGE_JPG ||
                                          item.file_type === constant.FILE_TYPE.IMAGE_JPEG ||
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
                                          <CCardBody className="d-flex justify-content-between align-items-center p-1">
                                            <CCol className="m-2">
                                              {isEdit && activeTab === 3 ? (
                                                <CFormSelect
                                                  name="img_title"
                                                  className="form-control"
                                                  placeholder="Title"
                                                  value={item.img_title}
                                                  onChange={(e) => {
                                                    console.log(item.id)
                                                    let imgTitle = e.target.value
                                                    let imageObject = ImageOptions.find(
                                                      (e) => e.title === imgTitle,
                                                    )
                                                    // console.log("logasss", imgTitle, imageObject.category);
                                                    handleUpdatePropertyImageSubmit(
                                                      item.id,
                                                      undefined,
                                                      imgTitle,
                                                      imageObject.category,
                                                    )
                                                  }}
                                                >
                                                  {ImageOptions.map((item, index) => (
                                                    <option value={item.title}>{item.title}</option>
                                                  ))}
                                                </CFormSelect>
                                              ) : (
                                                <span>{item?.img_title}</span>
                                              )}
                                            </CCol>

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
                                            {isEdit && activeTab === 3 && (
                                              <div className="d-flex align-items-center">
                                                {/* Trash Icon */}
                                                {isEdit}
                                                <CButton
                                                  color="link"
                                                  className="text-danger p-0 me-2"
                                                  onClick={() =>
                                                    handleDeletePropertyImageSubmit(item.id)
                                                  }
                                                >
                                                  {/* <CIcon icon={cilTrash} size="lg" /> */}
                                                  <FaTrash />
                                                </CButton>
                                                {/* Info Icon */}
                                                <CButton
                                                  color="link"
                                                  onClick={() =>
                                                    handleUpdatePropertyImageSubmit(
                                                      item.id,
                                                      item.status === '0' ? '1' : '0',
                                                    )
                                                  }
                                                  className="text-primary p-0"
                                                >
                                                  {item.status === '1' ? (
                                                    <FaCheckCircle color="green" />
                                                  ) : (
                                                    <FaTimesCircle color="grey" />
                                                  )}
                                                </CButton>
                                              </div>
                                            )}
                                          </CCardBody>
                                        </CCard>
                                      </CCol>
                                    )
                                  })}
                                </>
                              )}
                            </CRow>
                          </CAccordionBody>
                        </CAccordionItem>

                        {/* Nearby Locations */}
                        <CAccordionItem itemKey={4}>
                          <CAccordionHeader>Nearby Locations</CAccordionHeader>
                          <CAccordionBody>
                            {propertyDetails.nearby && propertyDetails.nearby.length <= 0 && (
                              <>
                                <CFormLabel>No Nearby found.</CFormLabel>
                              </>
                            )}

                            {isEdit && activeTab === 4 && (
                              <CCol className="mb-2">
                                <CButton
                                  className="me-2"
                                  disabled={loading}
                                  onClick={() => setIsNearbyAddNew(() => !isNearbyAddNew)}
                                  color="primary"
                                >
                                  Add New
                                </CButton>

                                <CButton
                                  disabled={loading}
                                  onClick={() => {
                                    changeEditSectionHandler(false)
                                    setIsNearbyAddNew(false)
                                  }}
                                  color="primary"
                                >
                                  Cancel
                                </CButton>
                              </CCol>
                            )}

                            {((isNearbyAddNew && isEdit) ||
                              propertyDetails.nearby?.length <= 0) && (
                              <CRow className="mb-2">
                                <CRow>
                                  <Formik
                                    initialValues={initialPropertyNearbyValues}
                                    validationSchema={validationPropertyNearbySchema}
                                    onSubmit={(values, { setSubmitting, resetForm }) => {
                                      handleCreatePropertyNearbySubmit(
                                        values,
                                        resetForm,
                                        setSubmitting,
                                      )
                                    }}
                                  >
                                    {({
                                      values,
                                      handleChange,
                                      handleBlur,
                                      isSubmitting,
                                      resetForm,
                                      setFieldValue,
                                      errors,
                                    }) => (
                                      <Form>
                                        <CRow className="mt-2">
                                          <CCol md={2} className="fw-bold">
                                            Location Name:
                                          </CCol>
                                          <CCol md={10}>
                                            <>
                                              <Field
                                                name="location_title"
                                                type="text"
                                                className="form-control"
                                                placeholder="Title Name"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              />
                                              <ErrorMessage
                                                name="location_title"
                                                // component={CFormText}
                                                component="div"
                                                className="text-danger"
                                              />
                                            </>
                                          </CCol>
                                        </CRow>

                                        {/* <CRow className="mt-2">
                                            <CCol md={2} className="fw-bold">
                                              Location Value:
                                            </CCol>
                                            <CCol md={10}>
                                              <>
                                                <Field
                                                  name="location_value"
                                                  type="text"
                                                  as={CFormInput}
                                                  className="form-control"
                                                  placeholder="Area"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                                <ErrorMessage
                                                  name="location_value"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </>
                                            </CCol>
                                          </CRow> */}

                                        <CRow className="mt-2">
                                          <CCol md={2} className="fw-bold">
                                            Category:
                                          </CCol>
                                          <CCol md={10}>
                                            <>
                                              <Field
                                                name="nearby_id"
                                                as={CFormSelect}
                                                className="form-control"
                                                placeholder="Unit"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              >
                                                <option value="-1"> Select </option>
                                                {nearbyCategory.map((item, index) => {
                                                  return (
                                                    <option key={index} value={item.id}>
                                                      {item.locations_name}
                                                    </option>
                                                  )
                                                })}
                                              </Field>
                                              <ErrorMessage
                                                name="nearby_id"
                                                component={CFormText}
                                                className="text-danger"
                                              />
                                            </>
                                          </CCol>
                                        </CRow>

                                        <CRow className="mt-2">
                                          <CCol md={2} className="fw-bold">
                                            Distance: (in km)
                                          </CCol>
                                          <CCol md={4}>
                                            <>
                                              <Field
                                                name="distance"
                                                type="text"
                                                as={CFormInput}
                                                className="form-control"
                                                placeholder="Distance"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              />
                                              <ErrorMessage
                                                name="distance"
                                                component={CFormText}
                                                className="text-danger"
                                              />
                                            </>
                                          </CCol>
                                          <CCol md={2} className="fw-bold">
                                            Time : (in min)
                                          </CCol>
                                          <CCol md={4}>
                                            <>
                                              <Field
                                                name="time"
                                                as={CFormInput}
                                                className="form-control"
                                                placeholder="Time"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              />
                                              <ErrorMessage
                                                name="time"
                                                component={CFormText}
                                                className="text-danger"
                                              />
                                            </>
                                          </CCol>
                                        </CRow>

                                        <CRow className="mt-2">
                                          <CCol md={2} className="fw-bold">
                                            Longitude:
                                          </CCol>
                                          <CCol md={4}>
                                            <>
                                              <Field
                                                name="longitude"
                                                type="text"
                                                as={CFormInput}
                                                className="form-control"
                                                placeholder="Longitude"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              />
                                              <ErrorMessage
                                                name="longitude"
                                                component={CFormText}
                                                className="text-danger"
                                              />
                                            </>
                                          </CCol>

                                          <CCol md={2} className="fw-bold">
                                            Latitude :
                                          </CCol>
                                          <CCol md={4}>
                                            <>
                                              <Field
                                                name="latitude"
                                                as={CFormInput}
                                                className="form-control"
                                                placeholder="Area"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              />
                                              <ErrorMessage
                                                name="latitude"
                                                component={CFormText}
                                                className="text-danger"
                                              />
                                            </>
                                          </CCol>
                                        </CRow>

                                        <CButton
                                          disabled={isSubmitting}
                                          type="submit"
                                          color="primary"
                                        >
                                          {isSubmitting && <CSpinner size="sm" />}
                                          Save
                                        </CButton>
                                      </Form>
                                    )}
                                  </Formik>
                                </CRow>
                              </CRow>
                            )}

                            {propertyDetails.nearby && propertyDetails.nearby.length > 0 && (
                              <>
                                <p className="m-2 text-end">
                                  {(!isEdit || activeTab !== 4) && (
                                    <CButton
                                      onClick={() => changeEditSectionHandler(true, 4)}
                                      size="sm"
                                      color="primary"
                                      className="me-2 mb-1"
                                    >
                                      <FaPencilAlt />
                                    </CButton>
                                  )}
                                </p>

                                <CTable align="middle" className="mb-0 border" hover responsive>
                                  <CTableHead color="light">
                                    <CTableRow>
                                      <CTableHeaderCell>Id</CTableHeaderCell>
                                      <CTableHeaderCell>Location Name</CTableHeaderCell>
                                      <CTableHeaderCell>Category</CTableHeaderCell>
                                      <CTableHeaderCell>Distance</CTableHeaderCell>
                                      <CTableHeaderCell>Time</CTableHeaderCell>
                                      <CTableHeaderCell>Latitude</CTableHeaderCell>
                                      <CTableHeaderCell>Longitude</CTableHeaderCell>
                                      <CTableHeaderCell>Action</CTableHeaderCell>
                                    </CTableRow>
                                  </CTableHead>

                                  <CTableBody>
                                    {propertyDetails.nearby.length > 0 &&
                                      propertyDetails.nearby.map((location, index) => (
                                        <CTableRow key={index}>
                                          <CTableDataCell>{index + 1} </CTableDataCell>
                                          <CTableDataCell>
                                            {location.location_title
                                              ? location.location_title
                                              : '-'}
                                          </CTableDataCell>
                                          {/* <CTableDataCell>
                                                {location.location_value
                                                  ? location.location_value
                                                  : '-'}
                                              </CTableDataCell> */}
                                          <CTableDataCell>
                                            {location.locations_name
                                              ? `${location.locations_name}`
                                              : '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {location.distance
                                              ? `${location.distance} ${constant.CALCULATION_UNITS.MIN.key}`
                                              : '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {location.time
                                              ? `${location.time} ${constant.CALCULATION_UNITS.KM.key}`
                                              : '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {location.longitude ? `${location.longitude}` : '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {location.latitude ? `${location.latitude}` : '-'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            <CTooltip content="View on Map" placement="top">
                                              <CButton
                                                onClick={() =>
                                                  // ###put map url
                                                  window.open(`${location.latitude}`, '_blank')
                                                }
                                                size="sm"
                                                color="info"
                                                label="View Map"
                                                className="me-2 mb-1"
                                              >
                                                <FaExternalLinkAlt color="white" />
                                              </CButton>
                                            </CTooltip>
                                            {isEdit && activeTab === 4 && (
                                              <CTooltip content="Delete Nearby" placement="top">
                                                <CButton
                                                  onClick={() =>
                                                    handleDeletePropertyNearbySubmit(location.id)
                                                  }
                                                  size="sm"
                                                  color="danger"
                                                  label="Delete property"
                                                  className="me-2 mb-1"
                                                >
                                                  <FaTrash color="white" />
                                                </CButton>
                                              </CTooltip>
                                            )}
                                          </CTableDataCell>
                                        </CTableRow>
                                      ))}
                                  </CTableBody>
                                </CTable>
                              </>
                            )}
                          </CAccordionBody>
                        </CAccordionItem>

                        {/* F and Q */}
                        <CAccordionItem itemKey={5}>
                          <CAccordionHeader>F & Q</CAccordionHeader>
                          <CAccordionBody>
                            <CRow>
                              {propertyDetails.faq && propertyDetails.faq.length <= 0 && (
                                <CFormLabel>F & Q not found.</CFormLabel>
                              )}
                              {isEdit && activeTab == 5 && (
                                <CCol className="mt-4">
                                  <CButton
                                    className="me-2"
                                    disabled={loading}
                                    onClick={() => setIsFaqAddNew(() => !isFaqAddNew)}
                                    color="primary"
                                  >
                                    Add New
                                  </CButton>

                                  <CButton
                                    disabled={loading}
                                    onClick={() => changeEditSectionHandler(false)}
                                    color="primary"
                                  >
                                    Cancel
                                  </CButton>
                                </CCol>
                              )}

                              {((isFaqAddNew && isEdit) || propertyDetails.faq?.length <= 0) && (
                                <CRow>
                                  <CRow>
                                    <Formik
                                      initialValues={initialPropertyFandQValues}
                                      validationSchema={validationPropertyFQSchema}
                                      onSubmit={(values, { setSubmitting, resetForm }) => {
                                        console.log(values)
                                        handleCreatePropertyFandqSubmit(
                                          values,
                                          resetForm,
                                          setSubmitting,
                                        )
                                      }}
                                    >
                                      {({
                                        values,
                                        handleChange,
                                        handleBlur,
                                        isSubmitting,
                                        resetForm,
                                      }) => (
                                        <Form>
                                          <CHeader className="d-flex">
                                            <CCol md={2} className="fw-bold">
                                              QN.
                                            </CCol>
                                            <CCol md={10}>
                                              <>
                                                <Field
                                                  name="faq_questions"
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Questions"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                                <ErrorMessage
                                                  name="faq_questions"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </>
                                            </CCol>
                                          </CHeader>

                                          <CRow className="mt-2">
                                            <CCol md={2} className="fw-bold">
                                              ANS.
                                            </CCol>
                                            <CCol md={10}>
                                              <>
                                                <Field
                                                  name="faq_answer"
                                                  type="text"
                                                  as={CFormTextarea}
                                                  className="form-control"
                                                  placeholder="Answer"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                                <ErrorMessage
                                                  name="faq_answer"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </>
                                            </CCol>
                                          </CRow>

                                          <CButton
                                            disabled={isSubmitting}
                                            type="submit"
                                            color="primary"
                                          >
                                            {isSubmitting && <CSpinner size="sm" />}
                                            Save
                                          </CButton>
                                        </Form>
                                      )}
                                    </Formik>
                                  </CRow>
                                </CRow>
                              )}

                              {propertyDetails.faq && propertyDetails.faq.length > 0 && (
                                <>
                                  {(!isEdit || activeTab !== 5) && (
                                    <p className="m-2 text-end">
                                      <CButton
                                        onClick={() => changeEditSectionHandler(true, 5)}
                                        size="sm"
                                        color="primary"
                                        className="me-2 mb-1"
                                      >
                                        <FaPencilAlt />
                                      </CButton>
                                    </p>
                                  )}

                                  {propertyDetails?.faq &&
                                    propertyDetails?.faq.map((item, index) => {
                                      return (
                                        <div key={index}>
                                          <CRow className="mt-2">
                                            <CCol md={2} className="fw-bold">
                                              QN.
                                            </CCol>
                                            <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-between align-items-center">
                                              {/* <CCol md={10} className="fw-bold dx-flex flex-row"> */}
                                              {item.faq_question || '-'}
                                              {isEdit && activeTab == 5 && (
                                                <p className="m-2">
                                                  <CButton
                                                    onClick={() =>
                                                      handleDeletePropertyFandqSubmit(item.id)
                                                    }
                                                    size="sm"
                                                    color="danger"
                                                    className="me-2 mb-1"
                                                  >
                                                    <FaTrash color="white" />
                                                  </CButton>
                                                </p>
                                              )}
                                            </CCol>
                                          </CRow>

                                          <CRow className="mt-2">
                                            <CCol md={2} className="fw-bold">
                                              ANS.
                                            </CCol>
                                            <CCol md={10} className="border-bottom pb-2">
                                              {item.faq_answer || '-'}
                                            </CCol>
                                          </CRow>
                                        </div>
                                      )
                                    })}
                                </>
                              )}
                            </CRow>
                          </CAccordionBody>
                        </CAccordionItem>

                        {/* Unit Configuration */}
                        {propertyDetails.property_rent_buy === constant.PROJECT_ATTR.PROJECT && (
                          <CAccordionItem itemKey={6}>
                            <CAccordionHeader>Unit Configuration</CAccordionHeader>
                            <CAccordionBody>
                              {propertyDetails.configuration &&
                                propertyDetails.configuration.length <= 0 && (
                                  <>
                                    <CFormLabel>No Configuration found.</CFormLabel>
                                  </>
                                )}
                              {isEdit && activeTab === 6 && (
                                <CCol className="mb-2">
                                  <CButton
                                    className="me-2"
                                    disabled={loading}
                                    onClick={() => setIsConfAddNew(() => !isConfAddNew)}
                                    color="primary"
                                  >
                                    Add New
                                  </CButton>

                                  <CButton
                                    disabled={loading}
                                    onClick={() => {
                                      changeEditSectionHandler(false)
                                      setIsConfAddNew(false)
                                    }}
                                    color="primary"
                                  >
                                    Cancel
                                  </CButton>
                                </CCol>
                              )}

                              {((isConfAddNew && isEdit) ||
                                propertyDetails.configuration?.length <= 0) && (
                                <CRow className="mb-2">
                                  <CRow>
                                    <Formik
                                      initialValues={initialPropertyConfigurationValues}
                                      validationSchema={WrapperValidationPropertyConfigurationSchema(
                                        propertyDetails.property_type,
                                      )}
                                      onSubmit={(values, { setSubmitting, resetForm }) => {
                                        handleCreatePropertyConfigurationSubmit(
                                          values,
                                          resetForm,
                                          setSubmitting,
                                        )
                                      }}
                                    >
                                      {({
                                        values,
                                        handleChange,
                                        handleBlur,
                                        isSubmitting,
                                        resetForm,
                                        setFieldValue,
                                        errors,
                                      }) => (
                                        <Form>
                                          {propertyDetails.property_type ===
                                            constant.PROPERTY_TYPE.RESIDENTIAL &&
                                            propertyDetails.user_type ===
                                              constant.PROPERTY_USER_TYPE.BUILDER && (
                                              <CRow className="mt-2">
                                                <CCol md={2} className="fw-bold">
                                                  Unit name:
                                                </CCol>
                                                <CCol md={10}>
                                                  <>
                                                    <Field
                                                      name="unit_name"
                                                      type="text"
                                                      as={CFormSelect}
                                                      className="form-control"
                                                      placeholder="Unit Name"
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                    >
                                                      <option value={'-1'}>Select</option>
                                                      {unitNameConfigOption
                                                        .filter((i) =>
                                                          i.varietyType.includes(
                                                            propertyDetails.property_variety,
                                                          ),
                                                        )
                                                        .map((item) => (
                                                          <option value={item.value}>
                                                            {item.title}
                                                          </option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage
                                                      name="unit_name"
                                                      // component={CFormText}
                                                      component="div"
                                                      className="text-danger"
                                                    />
                                                  </>
                                                </CCol>
                                              </CRow>
                                            )}
                                          <CRow className="mt-2">
                                            <CCol md={2} className="fw-bold">
                                              Carpet Area:
                                            </CCol>
                                            <CCol md={10}>
                                              <>
                                                <Field
                                                  name="carpet_area"
                                                  type="text"
                                                  as={CFormInput}
                                                  className="form-control"
                                                  placeholder="Area"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                                <ErrorMessage
                                                  name="carpet_area"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </>
                                            </CCol>
                                          </CRow>

                                          <CRow className="mt-2">
                                            <CCol md={2} className="fw-bold">
                                              Carpet Price:
                                            </CCol>
                                            <CCol md={10}>
                                              <>
                                                <Field
                                                  name="carpet_price"
                                                  type="text"
                                                  as={CFormInput}
                                                  className="form-control"
                                                  placeholder="Price"
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                />
                                                <ErrorMessage
                                                  name="carpet_price"
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </>
                                            </CCol>
                                          </CRow>
                                          {propertyDetails.property_type ===
                                            constant.PROPERTY_TYPE.OPEN_LAND &&
                                            propertyDetails.user_type ===
                                              constant.PROPERTY_USER_TYPE.BUILDER && (
                                              <CRow className="mt-2">
                                                <CCol md={2} className="fw-bold">
                                                  Length:
                                                </CCol>
                                                <CCol md={4}>
                                                  <>
                                                    <Field
                                                      name="length"
                                                      type="text"
                                                      as={CFormInput}
                                                      className="form-control"
                                                      placeholder="Length"
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                    />
                                                    <ErrorMessage
                                                      name="length"
                                                      component={CFormText}
                                                      className="text-danger"
                                                    />
                                                  </>
                                                </CCol>
                                                <CCol md={2} className="fw-bold">
                                                  Unit :
                                                </CCol>
                                                <CCol md={4}>
                                                  <>
                                                    <Field
                                                      name="length_unit"
                                                      as={CFormSelect}
                                                      className="form-control"
                                                      placeholder="Unit"
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                    >
                                                      <option value="-1"> Select </option>
                                                      {configurationUnit.map((item) => {
                                                        return (
                                                          <option value={item.value}>
                                                            {item.title}
                                                          </option>
                                                        )
                                                      })}
                                                    </Field>
                                                    <ErrorMessage
                                                      name="length_unit"
                                                      component={CFormText}
                                                      className="text-danger"
                                                    />
                                                  </>
                                                </CCol>
                                              </CRow>
                                            )}
                                          {propertyDetails.property_type ===
                                            constant.PROPERTY_TYPE.OPEN_LAND &&
                                            propertyDetails.user_type ===
                                              constant.PROPERTY_USER_TYPE.BUILDER && (
                                              <CRow className="mt-2">
                                                <CCol md={2} className="fw-bold">
                                                  Width:
                                                </CCol>
                                                <CCol md={4}>
                                                  <>
                                                    <Field
                                                      name="width"
                                                      type="text"
                                                      as={CFormInput}
                                                      className="form-control"
                                                      placeholder="Width"
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                    />
                                                    <ErrorMessage
                                                      name="width"
                                                      component={CFormText}
                                                      className="text-danger"
                                                    />
                                                  </>
                                                </CCol>

                                                <CCol md={2} className="fw-bold">
                                                  Unit :
                                                </CCol>
                                                <CCol md={4}>
                                                  <>
                                                    <Field
                                                      name="width_unit"
                                                      as={CFormSelect}
                                                      className="form-control"
                                                      placeholder="Area"
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                    >
                                                      <option value="-1"> Select </option>
                                                      {configurationUnit.map((item) => {
                                                        return (
                                                          <option value={item.value}>
                                                            {item.title}
                                                          </option>
                                                        )
                                                      })}
                                                    </Field>
                                                    <ErrorMessage
                                                      name="width_unit"
                                                      component={CFormText}
                                                      className="text-danger"
                                                    />
                                                  </>
                                                </CCol>
                                              </CRow>
                                            )}
                                          <CRow className="mb-3 mt-2">
                                            {/* <CCol md="12"> */}
                                            <CCol md={2} className="fw-bold">
                                              Image:
                                            </CCol>
                                            <CCol md={10}>
                                              <CFormInput
                                                type="file"
                                                className="mb-2"
                                                name="image"
                                                multiple
                                                // value={values.image}
                                                onChange={(e) => {
                                                  console.log(
                                                    'images: ',
                                                    values.image,
                                                    e.target.files[0],
                                                  )
                                                  const file = e.target.files[0]
                                                  if (file) {
                                                    setFieldValue('image', e.target.files[0])
                                                    setPreviewImage(URL.createObjectURL(file))
                                                  }
                                                }}
                                              />

                                              {previewImage && (
                                                <CImage
                                                  width={200}
                                                  height={100}
                                                  className="w-full h-full object-cover"
                                                  src={previewImage || ''}
                                                />
                                              )}
                                              <ErrorMessage
                                                name="image"
                                                component="div"
                                                className="text-danger"
                                              />
                                            </CCol>
                                          </CRow>

                                          <CButton
                                            disabled={isSubmitting}
                                            type="submit"
                                            color="primary"
                                          >
                                            {isSubmitting && <CSpinner size="sm" />}
                                            Save
                                          </CButton>
                                        </Form>
                                      )}
                                    </Formik>
                                  </CRow>
                                </CRow>
                              )}

                              {propertyDetails.configuration &&
                                propertyDetails.configuration.length > 0 && (
                                  <>
                                    <p className="m-2 text-end">
                                      {(!isEdit || activeTab !== 6) && (
                                        <CButton
                                          onClick={() => changeEditSectionHandler(true, 6)}
                                          size="sm"
                                          color="primary"
                                          className="me-2 mb-1"
                                        >
                                          <FaPencilAlt />
                                        </CButton>
                                      )}
                                    </p>

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

                                      <CTableBody>
                                        {propertyDetails.configuration.length > 0 &&
                                          propertyDetails.configuration.map(
                                            (configuration, index) => (
                                              <CTableRow key={index}>
                                                <CTableDataCell>{index + 1} </CTableDataCell>
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
                                                  <CTooltip content="View Config" placement="top">
                                                    <CButton
                                                      onClick={() =>
                                                        window.open(
                                                          `${configuration.unit_img_url}`,
                                                          '_blank',
                                                        )
                                                      }
                                                      size="sm"
                                                      color="info"
                                                      label="View Image"
                                                      className="me-2 mb-1"
                                                    >
                                                      <FaExternalLinkAlt color="white" />
                                                    </CButton>
                                                  </CTooltip>
                                                  {isEdit && activeTab === 6 && (
                                                    <CTooltip
                                                      content="Delete Config"
                                                      placement="top"
                                                    >
                                                      <CButton
                                                        onClick={() =>
                                                          handleDeletePropertyConfigurationSubmit(
                                                            configuration.id,
                                                          )
                                                        }
                                                        size="sm"
                                                        color="danger"
                                                        label="Delete property"
                                                        className="me-2 mb-1"
                                                      >
                                                        <FaTrash color="white" />
                                                      </CButton>
                                                    </CTooltip>
                                                  )}
                                                </CTableDataCell>
                                              </CTableRow>
                                            ),
                                          )}
                                      </CTableBody>
                                    </CTable>
                                  </>
                                )}
                            </CAccordionBody>
                          </CAccordionItem>
                        )}
                      </CAccordion>

                      <CAccordion activeItemKey={1}>
                        {/* Intrested Users */}
                        {intrestDetails && intrestDetails.users.length > 0 && (
                          <CAccordionItem id="intrestUsers" itemKey={1}>
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
                                    <CTableHeaderCell>Action</CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                {intrestDetails.users.length <= 0 && (
                                  <CFormLabel>No intrested users found.</CFormLabel>
                                )}
                                <CTableBody>
                                  {intrestDetails.users.length > 0 &&
                                    intrestDetails.users.map((intrestUser, index) => (
                                      <CTableRow key={index}>
                                        <CTableDataCell>{index + 1}</CTableDataCell>
                                        <CTableDataCell>
                                          {' '}
                                          {intrestUser.fname || '-'}{' '}
                                        </CTableDataCell>
                                        <CTableDataCell>{intrestUser.lname || '-'}</CTableDataCell>
                                        <CTableDataCell>{intrestUser.email || '-'}</CTableDataCell>
                                        <CTableDataCell>{intrestUser.mobile || '-'}</CTableDataCell>
                                        <CTableDataCell>
                                          <CButton
                                            size="sm"
                                            color="primary"
                                            onClick={() =>
                                              navigate(`/member/view/${intrestUser.id}`)
                                            }
                                          >
                                            <FaEye />
                                          </CButton>
                                        </CTableDataCell>
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

                        {shorlistDetails && shorlistDetails.users.length > 0 && (
                          <CAccordionItem id="shorlistUsers" itemKey={2} className="mb-2">
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
                                    <CTableHeaderCell>Action</CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                {shorlistDetails.users.length <= 0 && (
                                  <CFormLabel>No shortlist users found.</CFormLabel>
                                )}
                                <CTableBody>
                                  {shorlistDetails.users.length > 0 &&
                                    shorlistDetails.users.map((shortlistUser, index) => (
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
                                        <CTableDataCell>
                                          <CButton
                                            size="sm"
                                            color="primary"
                                            onClick={() =>
                                              navigate(`/member/view/${shortlistUser.id}`)
                                            }
                                          >
                                            <FaEye />
                                          </CButton>
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

                        {leadDetails && leadDetails.marketingLead.length > 0 && (
                          <CAccordionItem id="leadUsers" itemKey={3} className="mb-2">
                            <CAccordionHeader>Lead User</CAccordionHeader>
                            <CAccordionBody>
                              <CTable align="middle" className="mb-0 border" hover responsive>
                                <CTableHead color="light">
                                  <CTableRow>
                                    <CTableHeaderCell>Id</CTableHeaderCell>
                                    <CTableHeaderCell>Fulll Name</CTableHeaderCell>
                                    <CTableHeaderCell>Email</CTableHeaderCell>
                                    <CTableHeaderCell>Mobile</CTableHeaderCell>
                                    <CTableHeaderCell>Action</CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                {leadDetails.marketingLead.length <= 0 && (
                                  <CFormLabel>No leads users found.</CFormLabel>
                                )}
                                <CTableBody>
                                  {leadDetails.marketingLead.length > 0 &&
                                    leadDetails.marketingLead.map((shortlistUser, index) => (
                                      <CTableRow key={index}>
                                        <CTableDataCell>{index + 1}</CTableDataCell>
                                        <CTableDataCell>
                                          {shortlistUser.full_name || '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {shortlistUser.email || '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {shortlistUser.mobile || '-'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          <CButton
                                            size="sm"
                                            color="primary"
                                            onClick={() =>
                                              navigate(`/member/view/${shortlistUser.id}`)
                                            }
                                          >
                                            <FaEye />
                                          </CButton>
                                        </CTableDataCell>
                                      </CTableRow>
                                    ))}
                                </CTableBody>
                              </CTable>
                              {leadDetails.length > 5 && (
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
                          value={statusOption?.status || '-1'}
                        >
                          <option value="-1">Select Status</option>
                          {propertyStatus.map((item) => (
                            <option
                              key={item.id}
                              value={item.id}
                              // selected={propertyDetails?.status == item.id ? true : ''}
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

                          {/* contacted user count */}
                          <CCol lg="5" md="5" className="text-center border rounded p-3 m-1">
                            <a
                              style={{textDecoration: 'none'}} 
                              href="#intrestUsers">
                              <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                                {(intrestDetails && intrestDetails.totalCount) || '0'}
                              </CHeader>
                            </a>
                            <small className="text-secondary">Total Contacted</small>
                          </CCol>

                          {/* Shorlist user count */}
                          <CCol lg="5" md="5" className="text-center border rounded p-3 m-1">
                            <a 
                              style={{textDecoration: 'none'}} 
                              href="#shorlistUsers">
                              <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                                {(shorlistDetails && shorlistDetails?.totalCount) || '0'}
                              </CHeader>
                            </a>
                            <small className="text-secondary">Total Shortlisted</small>
                          </CCol>

                          {/* Total Lead */}
                          <CCol lg="5" md="5" className="text-center border rounded p-3 m-1">
                            <a
                              style={{textDecoration: 'none'}}  
                              href="#leadUsers">
                              <CHeader className="fw-bold d-flex justify-content-center align-items-center">
                                {(leadDetails && leadDetails?.totalCount) || '0'}
                              </CHeader>
                            </a>
                            <small className="text-secondary">Total Lead</small>
                          </CCol>
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
