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

const mailTypes = [
  { id: 1, title: 'Porperty Approved' },
  { id: 2, title: 'Porperty Rejected' },
  { id: 3, title: 'Porperty Pending' },
  { id: 4, title: 'Porperty Notification' },
]

const propertyStatus = [
  { id: 1, title: constant.PROPERTY_STATUS.PENDING },
  { id: 2, title: constant.PROPERTY_STATUS.APPROVED },
  { id: 3, title: constant.PROPERTY_STATUS.REJECTED },
  { id: 4, title: constant.PROPERTY_STATUS.DELISTED },
  { id: 5, title: constant.PROPERTY_STATUS.SOLD_OUT },
  { id: 5, title: constant.PROPERTY_STATUS.RENT_OUT }
]

const ViewAdminUser = () => {

  const { id } = useParams() // Get property ID from the URL
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const isEditParam = searchParams.get('isEdit');

  const [propertyDetails, setPropertyDetails] = useState(null)
  const [mailOption, setMailOptions] = useState(null)
  const [statusOption, setStatusOption] = useState({ statusText: '', status: '' })

  const [isEdit, setIsEdit] = useState(isEditParam)
  const [loading, setLoading] = useState(false);
  const [toast, addToast] = useState(0);

  const toaster = useRef();

  console.log(isEdit, id);

  const loadPropertyData = async () => {
    try {
      setLoading(true);
      // const offset = (currentPage);
      const result = await getPropertyById(id);
      console.log("UI:", result.data);
      setPropertyDetails(() => result.data)
      setStatusOption({ statusText: result.data.status_text, status: result.data.status });

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
    loadPropertyData()

    return () => { };
  }, [id])

  const changePropertyMailSend = (event) => {
    const value = event.target.value;
    console.log(event.target)
    setMailOptions(value);
  };

  const changePropertyStatus = (event) => {
    // console.log(value, name)
    const { value } = event.target;
    const selectedText = event.target.options[event.target.selectedIndex];
    console.log(event.target, selectedText.text)
    setStatusOption({ statusText: selectedText.text, status: value });
  };

  console.log(propertyDetails?.status, mailOption, statusOption);

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
      <CContainer>
        <CRow>
          <CCol>
            <CCard>
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

                {/* {propertyDetails ? (
                <CTable bordered hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Field</CTableHeaderCell>
                      <CTableHeaderCell>Value</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>ID</CTableDataCell>
                      <CTableDataCell>{propertyDetails.id}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>User ID</CTableDataCell>
                      <CTableDataCell>{propertyDetails.user_id}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Title</CTableDataCell>
                      <CTableDataCell>{propertyDetails.property_title}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Description</CTableDataCell>
                      <CTableDataCell>{propertyDetails.property_description}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Short Description</CTableDataCell>
                      <CTableDataCell>{propertyDetails.property_short_description}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Building Name</CTableDataCell>
                      <CTableDataCell>{propertyDetails.building_name}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Landmark</CTableDataCell>
                      <CTableDataCell>{propertyDetails.landmark}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Locality</CTableDataCell>
                      <CTableDataCell>{propertyDetails.locality}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>City</CTableDataCell>
                      <CTableDataCell>{propertyDetails.city_name}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>State</CTableDataCell>
                      <CTableDataCell>{propertyDetails.state_name}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Pincode</CTableDataCell>
                      <CTableDataCell>{propertyDetails.pincode}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Latitude</CTableDataCell>
                      <CTableDataCell>{propertyDetails.latitude}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Longitude</CTableDataCell>
                      <CTableDataCell>{propertyDetails.longitude}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Flat Type</CTableDataCell>
                      <CTableDataCell>{propertyDetails.flat_type}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Area</CTableDataCell>
                      <CTableDataCell>{propertyDetails.area}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Area Type</CTableDataCell>
                      <CTableDataCell>{propertyDetails.area_type}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Rent</CTableDataCell>
                      <CTableDataCell>{propertyDetails.rent}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Deposit</CTableDataCell>
                      <CTableDataCell>{propertyDetails.deposite}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Property Type</CTableDataCell>
                      <CTableDataCell>{propertyDetails.property_type}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Property Sub-Variant</CTableDataCell>
                      <CTableDataCell>{propertyDetails.property_sub_variant}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Rent/Buy</CTableDataCell>
                      <CTableDataCell>{propertyDetails.on_rent_buy}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Rent Negotiable</CTableDataCell>
                      <CTableDataCell>
                        {propertyDetails.rent_is_nogotiable === '1' ? 'Yes' : 'No'}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Deposit Negotiable</CTableDataCell>
                      <CTableDataCell>
                        {propertyDetails.deposite_is_negotiable === '1' ? 'Yes' : 'No'}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Availability Date</CTableDataCell>
                      <CTableDataCell>{propertyDetails.availability_date}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Property Age</CTableDataCell>
                      <CTableDataCell>{propertyDetails.property_age}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>IP Address</CTableDataCell>
                      <CTableDataCell>{propertyDetails.ip_address}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>User Agent</CTableDataCell>
                      <CTableDataCell>{propertyDetails.user_agent}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Host Name</CTableDataCell>
                      <CTableDataCell>{propertyDetails.host_name}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Status</CTableDataCell>
                      <CTableDataCell>
                        {propertyDetails.status === '1'
                          ? 'Pending'
                          : propertyDetails.status === '2'
                            ? 'Approved'
                            : 'Rejected'}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Created At</CTableDataCell>
                      <CTableDataCell>{propertyDetails.created_at}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Updated At</CTableDataCell>
                      <CTableDataCell>{propertyDetails.updated_at}</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              ) : (
                <p>Loading property details...</p>
              )} */}
                <div className="mt-2">
                  <CRow>
                    {/* Left Column */}
                    {propertyDetails &&
                      <CCol className="col-md-8">
                        <CAccordion activeItemKey={2} >
                          {/* Property Basic Details */}
                          <CAccordionItem itemKey={1}>
                            <CAccordionHeader>Property Basic Details</CAccordionHeader>
                            <CAccordionBody>

                              <CRow className="align-items-center">
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <p className='fw-bold m-2' >Owner Name: </p>
                                  <p className="m-2"> {/* {propertyDetails?.email} */} ASHOK AMBORE </p>
                                  {/* <small>3 days ago</small> */}
                                </CCol>
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <p className='fw-bold m-2' >Mobile: </p>
                                  <p className="m-2">7767944781</p>
                                </CCol>
                              </CRow>
                              <CRow>
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <p className='fw-bold m-2' >Email: </p>
                                  <p className="m-2">ashokambore16@gmail.com</p>
                                  {/* <small>3 days ago</small> */}
                                </CCol>
                              </CRow>
                              <hr />

                              <CRow className="align-items-center">
                                <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                  <CHeader className="fw-bold">{propertyDetails?.property_type || "-"}</CHeader>
                                  <small className="text-secondary">Property Type</small>
                                </CCol>

                                <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                  <CHeader className="fw-bold text-center">{propertyDetails?.property_variety || "-"}</CHeader>
                                  <small className="text-secondary">Residency Type</small>
                                </CCol>

                                <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                  <CHeader className="fw-bold text-center">{propertyDetails?.property_rent_buy || "-"}</CHeader>
                                  <small className="text-secondary">Variety Type</small>
                                </CCol>

                                <CCol lg="2" md="6" className="text-center border rounded p-3 m-1">
                                  <CHeader className="fw-bold text-center">{propertyDetails?.property_availibility_type || "-"}</CHeader>
                                  <small className="text-secondary">LEASE/RENT</small>
                                </CCol>

                                {/* ### use currnecy conversion format   || create new method  */}
                                {/* <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                      <CHeader className="fw-bold text-center">{`₹ ${propertyDetails?.rent_amount.toFixed(2)}`}</CHeader>
                                      <small className="text-secondary">Exprected Rent</small>
                                  </CCol>

                                  <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                      <CHeader className="fw-bold text-center">{ `₹ ${propertyDetails?.deposite_amount.toFixed(2)}`}</CHeader>
                                      <small className="text-secondary">Expected Deposite</small>
                                  </CCol> */}

                                <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                  <CHeader className="fw-bold text-center">{`${dateFns.format(propertyDetails?.availability_date, "dd/MM/yyyy") || "-"}`}</CHeader>
                                  <small className="text-secondary">Available date</small>
                                </CCol>
                              </CRow>
                              <hr />


                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className='fw-bold m-2' >Property Title: </p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">
                                    {propertyDetails?.property_title}
                                  </p>
                                </CCol>
                                {/* <small>3 days ago</small> */}
                              </CRow>

                              <CRow className="d-flex align-items-center">
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Description: </p>
                                  </CCol>
                                  <CCol md={9}>
                                    <p className="m-2">
                                      {propertyDetails?.description}
                                    </p>
                                  </CCol>
                                </CCol>
                              </CRow>

                              <CRow className="d-flex align-items-center">
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Address: </p>
                                  </CCol>
                                  <CCol md={9}>
                                    <p className="m-2">
                                      {`${propertyDetails?.landmark} ,  ${propertyDetails?.locality} ,  
                                        ${propertyDetails?.city_name} ,  ${propertyDetails?.state_name} ,  ${propertyDetails?.pincode}`}
                                    </p>
                                  </CCol>
                                </CCol>
                              </CRow>
                              <CRow className="d-flex align-items-center">
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <CCol md={3}>

                                    <p className='fw-bold m-2' >Co-ordinates: </p>
                                  </CCol>
                                  <CCol md={9}>

                                    <p className="m-2">
                                      {`Latitute: ${propertyDetails?.latitude} , Longitude: ${propertyDetails?.longitude} `}
                                    </p>
                                  </CCol>
                                </CCol>
                              </CRow>
                              <CRow className="d-flex align-items-center">
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Builtup Area: </p>
                                  </CCol>
                                  <CCol md={9}>

                                    <p className="m-2">
                                      {`${propertyDetails?.builtup_area} ${propertyDetails?.builtup_area_unit} `}
                                    </p>
                                  </CCol>
                                </CCol>
                              </CRow>

                              <CRow className="d-flex align-items-center">
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Land Area: </p>
                                  </CCol>
                                  <CCol md={9}>

                                    <p className="m-2">
                                      {`${propertyDetails?.land_area} ${propertyDetails?.land_area_unit} `}
                                    </p>
                                  </CCol>
                                </CCol>
                              </CRow>
                              {propertyDetails?.project_area_unit &&
                                <CRow className="d-flex align-items-center">
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <CCol md={3}>
                                      <p className='fw-bold m-2' >Project Area: </p>
                                    </CCol>
                                    <CCol md={9}>

                                      <p className="m-2">
                                        {`${propertyDetails?.project_area} ${propertyDetails?.project_area_unit} `}
                                      </p>
                                    </CCol>
                                  </CCol>
                                </CRow>
                              }

                              <CRow className="d-flex align-items-center">
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Expected Rent: </p>
                                  </CCol>
                                  <CCol md={9}>

                                    <p className="m-2">
                                      {`₹ ${propertyDetails?.rent_amount?.toFixed(2)} 
                                          ${propertyDetails?.rent_is_nogotiable == 0 ? "Non Negotiable" : "Negotiable"} `}
                                    </p>
                                  </CCol>
                                </CCol>
                              </CRow>

                              <CRow className="d-flex align-items-center">
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Expected Deposite: </p>
                                  </CCol>
                                  <CCol md={9}>

                                    <p className="m-2">
                                      {`₹ ${propertyDetails?.deposite_amount?.toFixed(2)} 
                                          ${propertyDetails?.deposite_is_negotiable == 0 ? "Non Negotiable" : "Negotiable"} `}
                                    </p>
                                  </CCol>
                                </CCol>
                              </CRow>

                              <CRow className="d-flex align-items-center">
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Door Facing: </p>
                                  </CCol>
                                  <CCol md={9}>
                                    <p className="m-2">
                                      {propertyDetails?.door_facing}
                                    </p>
                                  </CCol>
                                </CCol>
                              </CRow>
                              {propertyDetails?.property_age &&
                                <CRow className="d-flex align-items-center">
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <CCol md={3}>
                                      <p className='fw-bold m-2' >Property Age: </p>
                                    </CCol>
                                    <CCol md={9}>
                                      <p className="m-2">
                                        {propertyDetails?.property_age}
                                      </p>
                                    </CCol>
                                  </CCol>
                                </CRow>
                              }
                              {/* {propertyDetails?.property_age &&
                              <CRow className="d-flex align-items-center"> 
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Property Age: </p>
                                  </CCol>
                                  <CCol md={9}>
                                    <p className="m-2">
                                      {propertyDetails?.property_age}
                                    </p>
                                  </CCol>
                                </CCol>
                              </CRow>
                              } */}
                              {propertyDetails?.is_maintenance &&
                                <CRow className="d-flex align-items-center">
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <CCol md={3}>
                                      <p className='fw-bold m-2' >Maintenance: </p>
                                    </CCol>
                                    <CCol md={9}>
                                      <p className="m-2">
                                        {propertyDetails?.is_maintenance}
                                      </p>
                                    </CCol>
                                  </CCol>
                                </CRow>
                              }
                              {propertyDetails?.monthly_maintenance &&
                                <CRow className="d-flex align-items-center">
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <CCol md={3}>
                                      <p className='fw-bold m-2' >Monthly Maintenance: </p>
                                    </CCol>
                                    <CCol md={9}>
                                      <p className="m-2">
                                        {`₹ ${propertyDetails?.monthly_maintenance}`}
                                      </p>
                                    </CCol>
                                  </CCol>
                                </CRow>
                              }
                              {/* <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                      <CHeader className="fw-bold text-center">{`₹ ${propertyDetails?.rent_amount.toFixed(2)}`}</CHeader>
                                      <small className="text-secondary">Exprected Rent</small>
                                  </CCol>

                                  <CCol lg="3" md="6" className="text-center border rounded p-3 m-1">
                                      <CHeader className="fw-bold text-center">{ `₹ ${propertyDetails?.deposite_amount.toFixed(2)}`}</CHeader>
                                      <small className="text-secondary">Expected Deposite</small>
                                  </CCol> */}

                              <hr />
                              {/*  */}
                              <CRow className="d-flex align-items-center">
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <CCol xs={6} lg={3} md={3}>
                                    <p className='fw-bold m-2' >Unit Number: </p>
                                  </CCol>
                                  <CCol xs={6} lg={3} md={3}>
                                    <p className="m-2">
                                      {propertyDetails?.unit_number}
                                    </p>
                                  </CCol>

                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Washrooms: </p>
                                  </CCol>
                                  <CCol md={3}>
                                    <p className="m-2">
                                      {propertyDetails?.washrooms || "-"}
                                    </p>
                                  </CCol>
                                </CCol>
                              </CRow>

                              <CRow className="d-flex align-items-center">
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Total Wing: </p>
                                  </CCol>
                                  <CCol md={3}>
                                    <p className="m-2">
                                      {propertyDetails?.total_wing || "-"}
                                    </p>
                                  </CCol>
                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Wing Name: </p>
                                  </CCol>
                                  <CCol md={4}>
                                    <p className="m-2">
                                      {propertyDetails?.wing_name || "-"}
                                    </p>
                                  </CCol>
                                </CCol>
                              </CRow>

                              <CRow className="d-flex align-items-center">
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Total Floors: </p>
                                  </CCol>
                                  <CCol md={3}>
                                    <p className="m-2">
                                      {propertyDetails?.total_floors || "-"}
                                    </p>
                                  </CCol>
                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Floor Number: </p>
                                  </CCol>
                                  <CCol md={4}>
                                    <p className="m-2">
                                      {propertyDetails?.floor_number || "-"}
                                    </p>
                                  </CCol>
                                </CCol>
                              </CRow>
                              <CRow className="d-flex align-items-center">
                                <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Bed Rooms: </p>
                                  </CCol>
                                  <CCol md={3}>
                                    <p className="m-2">
                                      {propertyDetails?.bed_rooms || "-"}
                                    </p>
                                  </CCol>
                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Balcony: </p>
                                  </CCol>
                                  <CCol md={4}>
                                    <p className="m-2">
                                      {propertyDetails?.balcony || "-"}
                                    </p>
                                  </CCol>
                                </CCol>
                              </CRow>

                              {/* <CRow className="d-flex align-items-center">
                                  <CCol className="pr-3 d-flex w-100 flex-column flex-md-row justify-content-left">
                                    <CCol md={3}>
                                    <p className='fw-bold m-2' >Wing Name: </p>
                                    </CCol>
                                    <CCol md={9}>
                                      <p className="m-2">
                                      {propertyDetails?.wing_name}
                                      </p>
                                    </CCol>
                                  </CCol>
                                </CRow> */}

                            </CAccordionBody>
                          </CAccordionItem>

                          {/* Amenities */}
                          <CAccordionItem itemKey={2}>
                            <CAccordionHeader>Amenities</CAccordionHeader>
                            <CAccordionBody>
                              <CRow>

                              {propertyDetails.furnishing_status &&
                                <CCol lg="4" xs="11" className="d-flex align-items-center  border rounded p-2 m-2">
                                  <CCol md={4} xs="5" className="text-center">
                                    <CImage
                                      src="/src/assets/images/property_icons/Semifurnished.svg"
                                      alt="Tenant Icon"
                                      className="img-fluid"
                                    />
                                  </CCol>
                                  <CCol md={9} xs="7" className='m-1'>
                                    <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                                      {propertyDetails?.furnishing_status}
                                    </div>
                                    <small className="text-secondary">Funishing Status</small>
                                  </CCol>
                                </CCol>
                                }

                                {propertyDetails.parking &&
                                <CCol lg="4" xs="11" className="d-flex align-items-center  border rounded p-2 m-2">
                                  <CCol md={4} xs={5} className="text-center">
                                    <CImage
                                      src="/src/assets/images/property_icons/parking.svg"
                                      alt="Tenant Icon"
                                      className="img-fluid"
                                    />
                                  </CCol>
                                  <CCol md={9} xs={7} className='m-1'>
                                    <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                                      {propertyDetails?.parking}
                                    </div>
                                    <small className="text-secondary">Parking</small>
                                  </CCol>
                                </CCol>
                                }
                                {propertyDetails.water_supply &&
                                <CCol lg="4" xs={11} className="d-flex align-items-center  border rounded p-2 m-2">
                                  <CCol md={4} xs={5} className="text-center">
                                    <CImage
                                      src="/src/assets/images/property_icons/WaterSupplySociety.svg"
                                      alt="Tenant Icon"
                                      className="img-fluid"
                                    />
                                  </CCol>
                                  <CCol md={9} xs={7} className='m-1'>
                                    <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                                      {propertyDetails?.water_supply}
                                    </div>
                                    <small className="text-secondary">Water Supply</small>
                                  </CCol>
                                </CCol>
}
                                {propertyDetails.pet_allowed &&
                                  <CCol lg="4" xs={11} className="d-flex align-items-center  border rounded p-2 m-2">
                                    <CCol md={4} xs={5} className="text-center">
                                      <CImage
                                        src="/src/assets/images/property_icons/pet_allowed.svg"
                                        alt="Tenant Icon"
                                        className="img-fluid"
                                      />
                                    </CCol>
                                    <CCol md={9} xs={7} className='m-1'>
                                      <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                                        {
                                          propertyDetails?.pet_allowed === 0 ? "NO" : "YES"
                                        }
                                      </div>
                                      <small className="text-secondary">Pet Allowed</small>
                                    </CCol>
                                  </CCol>
                                }

{propertyDetails.non_veg_allowed &&
                                  <CCol lg="4" xs={11} className="d-flex align-items-center  border rounded p-2 m-2">
                                    <CCol md={4} xs={5} className="text-center">
                                      <CImage
                                        src="/src/assets/images/property_icons/non-veg_not_allowed.svg"
                                        alt="Tenant Icon"
                                        className="img-fluid"
                                      />
                                    </CCol>
                                    <CCol md={9} xs={7} className='m-1'>
                                      <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                                        {
                                          propertyDetails?.non_veg_allowed === 0 ? "NO" : "YES"
                                        }
                                      </div>
                                      <small className="text-secondary">Non-Veg Allowed</small>
                                    </CCol>
                                  </CCol>
                                }
                                
                                {propertyDetails.granted_security &&
                                  <CCol lg="4" xs={11} className="d-flex align-items-center  border rounded p-2 m-2">
                                    <CCol md={4} xs={5} className="text-center">
                                      <CImage
                                        src="/src/assets/images/property_icons/Security.svg"
                                        alt="Tenant Icon"
                                        className="img-fluid"
                                      />
                                    </CCol>
                                    <CCol md={9} xs={7} className='m-1'>
                                      <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                                        {
                                          propertyDetails?.granted_security
                                        }
                                      </div>
                                      <small className="text-secondary">Granted Security</small>
                                    </CCol>
                                  </CCol>
                                }
                                {propertyDetails.drink_allowed &&
                                  <CCol lg="4" xs={11} className="d-flex align-items-center  border rounded p-2 m-2">
                                    <CCol md={4} xs={5} className="text-center">
                                      <CImage
                                        src="/src/assets/images/property_icons/drink_bottle.svg"
                                        alt="Drink Icon"
                                        className="img-fluid"
                                      />
                                    </CCol>
                                    <CCol md={9} xs={7} className='m-1'>
                                      <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                                        {
                                          propertyDetails?.drink_allowed
                                        }
                                      </div>
                                      <small className="text-secondary">Drinking Allowed</small>
                                    </CCol>
                                  </CCol>
                                }
                            
                            {propertyDetails.smoke_allowed &&
                                  <CCol lg="4" xs={11} className="d-flex align-items-center  border rounded p-2 m-2">
                                    <CCol md={4} xs={5} className="text-center">
                                      <CImage
                                        src="/src/assets/images/property_icons/drink_bottle.svg"
                                        alt="Drink Icon"
                                        className="img-fluid"
                                      />
                                    </CCol>
                                    <CCol md={9} xs={7} className='m-1'>
                                      <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                                        {
                                          propertyDetails?.smoke_allowed
                                        }
                                      </div>
                                      <small className="text-secondary">Smoking Allowed</small>
                                    </CCol>
                                  </CCol>
                                }
                                
                                {propertyDetails.pg_rules &&
                                  <CCol lg="4" xs={11} className="d-flex align-items-center  border rounded p-2 m-2">
                                    <CCol md={4} xs={5} className="text-center">
                                      <CImage
                                        src="/src/assets/images/property_icons/drink_bottle.svg"
                                        alt="Drink Icon"
                                        className="img-fluid"
                                      />
                                    </CCol>
                                    <CCol md={9} xs={7} className='m-1'>
                                      <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                                        {
                                          propertyDetails?.pg_rules
                                        }
                                      </div>
                                      <small className="text-secondary">PG Rules</small>
                                    </CCol>
                                  </CCol>
                                }

{propertyDetails.sewage_connection &&
                                  <CCol lg="4" xs={11} className="d-flex align-items-center  border rounded p-2 m-2">
                                    <CCol md={4} xs={5} className="text-center">
                                      <CImage
                                        src="/src/assets/images/property_icons/Sewage_treatment_plant.svg"
                                        alt="Drink Icon"
                                        className="img-fluid"
                                      />
                                    </CCol>
                                    <CCol md={9} xs={7} className='m-1'>
                                      <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                                        {
                                          propertyDetails?.sewage_connection === 0 ? "NO" : "YES"
                                        }
                                      </div>
                                      <small className="text-secondary">Sewage Connection</small>
                                    </CCol>
                                  </CCol>
                                }

                                {propertyDetails.electricity_connection &&
                                  <CCol lg="4" xs={11} className="d-flex align-items-center  border rounded p-2 m-2">
                                    <CCol md={4} xs={5} className="text-center">
                                      <CImage
                                        src="/src/assets/images/property_icons/electricity.svg"
                                        alt="Drink Icon"
                                        className="img-fluid"
                                      />
                                    </CCol>
                                    <CCol md={9} xs={7} className='m-1'>
                                      <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                                        {
                                          propertyDetails?.electricity_connection === 0 ? "NO" : "YES"
                                        }
                                      </div>
                                      <small className="text-secondary">Electricity Connection</small>
                                    </CCol>
                                  </CCol>
                                }
                                
                              </CRow>

                              {
                                propertyDetails?.other_amenities &&
                                <CRow className="align-items-center">
                                  <CCol md={3}>
                                    <p className='fw-bold m-2' >Other Ameneties: </p>
                                  </CCol>
                                  <CCol md={9}>
                                    <p className="m-2">
                                      {propertyDetails?.other_amenities.split(",").map((item) => (
                                        <CButton disabled className="rounded-pill m-1" color="success" variant="outline" size="sm"> {item}
                                        </CButton>
                                      ))}
                                    </p>
                                  </CCol>
                                </CRow>
                              }
                            </CAccordionBody>
                          </CAccordionItem>

                          {/* Images */}
                          <CAccordionItem itemKey={3}>
                            <CAccordionHeader>Images</CAccordionHeader>
                            <CAccordionBody>
                              <CRow>
                                {propertyDetails.images.length > 0 ?
                                  propertyDetails.images.map((item, index) => {
                                    return (
                                      <CCol xs="12" md="4" lg="4" >
                                        <CCard>
                                          {/* Image Section */}
                                          <CCardImage
                                            style={{ position: 'relative', height: "150px", objectFit: 'cover' }}
                                            orientation="top"
                                            src={item?.property_img_url || '/src/assets/images/no_image/no_image.png'}
                                            alt={item?.img_title || "property images"}
                                          />
                                          {/* Text and Icons Section */}
                                          <CCardBody className="d-flex justify-content-between align-items-center">
                                            <span>{item?.img_title}</span>
                                            <div className="d-flex align-items-center">
                                              {/* Trash Icon */}
                                              <CButton color="link" className="text-danger p-0 me-2">
                                                <CIcon icon={cilTrash} size="lg" />
                                              </CButton>
                                              {/* Info Icon */}
                                              <CButton color="link" className="text-primary p-0">
                                                <CIcon icon={cilInfo} size="lg" />
                                              </CButton>
                                            </div>
                                          </CCardBody>
                                        </CCard>
                                      </CCol>
                                    )
                                  })
                                  :
                                  <CHeader> No Images found.</CHeader>
                                }
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
                        </CAccordion>
                      </CCol>
                    }
                    {/* Right Column */}
                    <CCol className="col-md-4">
                      <CCard className="mb-4">
                        <CCardBody>
                          <h4>Actions</h4>

                          {/* <CRow className='d-flex m-2'> */}
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
                          </CButton>
                          {/* </CRow> */}
                          <hr />
                          <strong>Status</strong>
                          <CFormSelect
                            name="propertyStatus"
                            onChange={(e) => changePropertyStatus(e)}
                            className="mb-2" >
                            <option value="-1">Select Status</option>
                            {
                              propertyStatus.map(item => (
                                <option
                                  value={item.id}
                                  selected={propertyDetails?.status == item.id ? true : ''}
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

                      <CCard>
                        <CCardBody>
                          <h4>Activity</h4>
                          <CListGroup>
                            <CListGroupItem>Activity 1: Property listed</CListGroupItem>
                            <CListGroupItem>Activity 2: Price updated</CListGroupItem>
                            <CListGroupItem>Activity 3: New images added</CListGroupItem>
                            <CListGroupItem>Activity 4: Status changed to Sold</CListGroupItem>
                            <CListGroupItem>Activity 5: Property description updated</CListGroupItem>
                            {/* Add more activities as needed up to 10 */}
                          </CListGroup>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <CToaster ref={toaster} push={toast} placement="top-end" />


    </>
  )
}

export default ViewAdminUser;
