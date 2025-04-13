import React, { useState, useEffect, useRef } from "react";
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CRow, CCol, CFormLabel, CFormInput, CFormSelect,
  CToaster,
  CHeader
 } from "@coreui/react";
import { getPlansById } from "@model/plansModel";
import { ToastMessage } from '@component/ToastMessage'
import { formattedDate } from "../../../utils/date";
import { getContactUsById } from "../../../models/contactsModel";


const ContactUsDetailsModal = ({ isModalVisible, toggleModal, id }) => {
  
  console.log('modals props:', isModalVisible, toggleModal, id)
  const [ planData, setPlanData] = useState({})
  const [loading, setLoading] = useState(false)
  const [toast, addToast] = useState(0)

  const toaster = useRef()
  // Example data
  
    const loadContactUsData = async () => {
      try {
        setLoading(true)

        const result = await getContactUsById(id)
        console.log('UI:', result.data)
        setPlanData(() => result.data)
 
        setLoading(false)
      } catch (error) {
        console.log('Error: ', error)
        const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
        addToast(toastContent)
        setLoading(false)        
      }
    }
    
    console.log(planData)
    useEffect(() => {
      loadContactUsData()  
      return () => {}
    }, [id])
  
  return (
    <>
    <CModal scrollable className="custom-modal" visible={isModalVisible} onClose={toggleModal}>
      <CModalHeader>
        <CModalTitle>Contact Us Details</CModalTitle>
      </CModalHeader>
      <CModalBody >
        <CRow className="mb-1">
          <CCol md="6">
            <CFormLabel className="fw-bold">Full Name</CFormLabel>
            <p>
              { planData.full_name || '-'}
            </p>
          </CCol>
          <CCol md="6">
            <CFormLabel className="fw-bold">Created Date</CFormLabel>
            <p>
              {formattedDate( planData.created_at )}
            </p>
          </CCol>
        </CRow>
        <CRow className="mb-1">
          <CCol md="6">
            <CFormLabel className="fw-bold">Email</CFormLabel>
            <p >
              {planData.email || '-'}
            </p>
          </CCol>
          <CCol md="6">
            <CFormLabel className="fw-bold">Mobile</CFormLabel>
            <p>
              {planData.phone || '-'}
            </p>
          </CCol>
          </CRow>
          <CRow className="mb-1">
          <CCol md="6">
            <CFormLabel className="fw-bold">Message</CFormLabel>
            <p>
              {planData.message || '-'}
            </p>
          </CCol>
        </CRow>
        <CRow className="mb-1">

          <CCol md="6">
            <CFormLabel className="fw-bold">IP Address</CFormLabel>
            <p>
              {planData.ip_address || '-'}
            </p> 
          </CCol>

          <CCol md="6">
            <CFormLabel className="fw-bold">User Agent</CFormLabel>
            <p>
              {planData.user_agent || '-'}
            </p> 
          </CCol>

        </CRow>
        <CRow className="mb-1">
          <CCol md="6">
            <CFormLabel className="fw-bold">Host </CFormLabel>
            <p>
              {planData.user_host || '-'} days
            </p>
          </CCol>
          
        </CRow>
        
      </CModalBody>
    </CModal>
    <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  );
};

export default ContactUsDetailsModal;
