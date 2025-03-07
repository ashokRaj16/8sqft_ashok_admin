import React, { useState, useEffect, useRef } from "react";
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CRow, CCol, CFormLabel, CFormInput, CFormSelect,
  CToaster,
  CHeader
 } from "@coreui/react";
import { getPlansById } from "@model/plansModel";
import { ToastMessage } from '@component/ToastMessage'


const PromotionDetailsModal = ({ isModalVisible, toggleModal, id }) => {
  
  console.log('modals props:', isModalVisible, toggleModal, id)
  const [ planData, setPlanData] = useState({})
  const [loading, setLoading] = useState(false)
  const [toast, addToast] = useState(0)

  const toaster = useRef()
  // Example data

  // const planData = {
  //   title: "Premium Subscription",
  //   amount: 5000,
  //   disAmount: 500,
  //   propertyCat: "Residential",
  //   planNames: "Basic, Advanced",
  //   duration: "12 months",
  //   leadCount: 100,
  // };
  
    const loadPlanData = async () => {
      try {
        setLoading(true)
        // const offset = (currentPage);
        const result = await getPlansById(id)
        // const result = []
        console.log('UI:', result.data)
        setPlanData(() => result.data)
        // setStatusOption({ statusText: result.data.status_text, status: result.data.status })
  
        setLoading(false)
      } catch (error) {
        console.log('Error: ', error)
        const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
        addToast(toastContent)
        setLoading(false)
        // setTimeout(() => {
        //   toggleModal()
        // }, 1000)
      }
    }
    
    console.log(planData)
    useEffect(() => {
      loadPlanData()  
      return () => {}
    }, [id])
  
  return (
    <>
    <CModal scrollable className="custom-modal" visible={isModalVisible} onClose={toggleModal}>
      <CModalHeader>
        <CModalTitle>Plan Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow className="mb-1">
          <CCol md="6">
            <CFormLabel>Title</CFormLabel>
            <p className="fw-bold">
              { planData.plan_title}
            </p>
          </CCol>
          <CCol md="6">
            <CFormLabel>Category</CFormLabel>
            <p className="fw-bold">
              {planData.property_category}
            </p>
          </CCol>
        </CRow>
        <CRow className="mb-1">
          <CCol md="6">
            <CFormLabel>User Type</CFormLabel>
            <p className="fw-bold">
              {planData.user_type}
            </p>
          </CCol>
          <CCol md="6">
            <CFormLabel>Plan Name</CFormLabel>
            <p className="fw-bold">
              {planData.plan_names}
            </p>
          </CCol>
        </CRow>
        <CRow className="mb-1">

          <CCol md="6">
            <CFormLabel>Plan Rent/Sale</CFormLabel>
            <p className="fw-bold">
              {planData.plan_rent_sale || '-'}
            </p> 
          </CCol>

          <CCol md="6">
            <CFormLabel>Plan Guarentee</CFormLabel>
            <p className="fw-bold">
              {planData.plan_guarentee || '-'}
            </p> 
          </CCol>

        </CRow>
        <CRow className="mb-1">
          <CCol md="6">
            <CFormLabel>Duration</CFormLabel>
            <p className="fw-bold">
              {planData.duration_days} days
            </p>
          </CCol>

          <CCol md="6">
            <CFormLabel>Leads</CFormLabel>
            <p className="fw-bold">
              {planData.leads_counts}
            </p>
          </CCol>
        </CRow>
        <CRow className="mb-1">
          <CCol md="6">
            <CFormLabel>Contact Whatsapp Notification</CFormLabel>
            <p className="fw-bold">
              {planData.contact_whatsapp_notification}
            </p> 
          </CCol>

          <CCol md="6">
            <CFormLabel>Promotion On Web</CFormLabel>
            <p className="fw-bold">
              {planData.promotion_on_web || '-'}
            </p> 
          </CCol>
        </CRow>

        <CRow className="mb-1">
          <CCol md="6">
            <CFormLabel>Promotion on Meta</CFormLabel>
            <p className="fw-bold">
              {planData.promotion_on_meta || '-'}
            </p> 
          </CCol>

          <CCol md="6">
            <CFormLabel>Promotion On 8sqft</CFormLabel>
            <p className="fw-bold">
              {planData.paid_promotion_on_sqft || '-'}
            </p> 
          </CCol>
        </CRow>

        <CRow className="mb-1">
          <CCol md="6">
            <CFormLabel>Paid Video Promotion</CFormLabel>
            <p className="fw-bold">
              {planData.paid_video_promotion || '-'}
            </p> 
          </CCol>

          <CCol md="6">
            <CFormLabel>Sponsored Ads</CFormLabel>
            <p className="fw-bold">
              {planData.ind_sponsored_ads || '-'}
            </p> 
          </CCol>
          {/* <CCol md="6"> */}
            {/* <CButton color="secondary" onClick={toggleModal} >
              Close
            </CButton> */}
          {/* </CCol> */}
        </CRow>

        <CRow className="mb-1">
          <CCol md="6">
            <CFormLabel>Plan Amount</CFormLabel>
            <p className="fw-bold">
              {`₹ ${planData.plan_amount}` || '-'}
            </p> 
          </CCol>

          <CCol md="6">
            <CFormLabel>Discount Amount</CFormLabel>
            <p className="fw-bold">
              {`₹ ${planData.plan_discounted_amount}` || '-'}
            </p> 
          </CCol>
        </CRow>

        <CRow className="mb-1">
          <CCol md="6">
            <CFormLabel>Plan GST</CFormLabel>
            <p className="fw-bold">
              {planData.plan_gst_per || '-'} %
            </p> 
          </CCol>

          <CCol md="6">
            <CFormLabel>Publish Date</CFormLabel>
            <p className="fw-bold">
              {planData.publish_date || '-'}
            </p> 
          </CCol>
        </CRow>
      </CModalBody>
    </CModal>
    <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  );
};

export default PromotionDetailsModal;
