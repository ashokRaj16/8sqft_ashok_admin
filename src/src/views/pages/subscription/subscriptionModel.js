import React, { useState } from "react";
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CRow, CCol, CFormLabel, CFormInput, CFormSelect } from "@coreui/react";

const SubscriptionDetailsModal = ({ isModalVisible, toggleModal }) => {
  // Example data
  const subscriptionData = {
    title: "Premium Subscription",
    amount: 5000,
    disAmount: 500,
    propertyCat: "Residential",
    planNames: "Basic, Advanced",
    duration: "12 months",
    leadCount: 100,
  };

  return (
    <CModal visible={isModalVisible} onClose={toggleModal}>
      <CModalHeader>
        <CModalTitle>Subscription Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow className="mb-3">
          <CCol md="6">
            <CFormLabel>Title</CFormLabel>
            <CFormInput type="text" value={subscriptionData.title} disabled />
          </CCol>
          <CCol md="6">
            <CFormLabel>Amount</CFormLabel>
            <CFormInput type="number" value={subscriptionData.amount} disabled />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md="6">
            <CFormLabel>Discount Amount</CFormLabel>
            <CFormInput type="number" value={subscriptionData.disAmount} disabled />
          </CCol>
          <CCol md="6">
            <CFormLabel>Property Category</CFormLabel>
            <CFormInput type="text" value={subscriptionData.propertyCat} disabled />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md="6">
            <CFormLabel>Plan Names</CFormLabel>
            <CFormInput type="text" value={subscriptionData.planNames} disabled />
          </CCol>
          <CCol md="6">
            <CFormLabel>Duration</CFormLabel>
            <CFormInput type="text" value={subscriptionData.duration} disabled />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md="6">
            <CFormLabel>Lead Count</CFormLabel>
            <CFormInput type="number" value={subscriptionData.leadCount} disabled />
          </CCol>
        </CRow>
      </CModalBody>
      <CButton color="secondary" onClick={toggleModal} className="ms-2">
        Close
      </CButton>
    </CModal>
  );
};

// const ListSubscription = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const toggleModal = () => setIsModalVisible(!isModalVisible);

//   return (
//     <div>
//       <CButton color="primary" onClick={toggleModal}>
//         View Subscription Details
//       </CButton>

//       <SubscriptionDetailsModal isModalVisible={isModalVisible} toggleModal={toggleModal} />
//     </div>
//   );
// };

// export default ListSubscription;
