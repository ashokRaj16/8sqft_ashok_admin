import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CForm,
  CFormTextarea,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CImage,
} from "@coreui/react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditable, setIsEditable] = useState(false);

  // Yup validation schemas
  const profileSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    address: Yup.string().required("Address is required"),
    education: Yup.string().required("Education is required"),
    aadhaar: Yup.string()
      .matches(/^\d{12}$/, "Aadhaar must be 12 digits")
      .required("Aadhaar is required"),
    pan: Yup.string()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
      .required("PAN is required"),
  });

  const passwordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const initialProfileValues = {
    fullName: "John Doe",
    address: "123 Main Street",
    education: "Bachelor's Degree",
    aadhaar: "123456789012",
    pan: "ABCDE1234F",
  };

  const initialPasswordValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  // Handlers for form submissions
  const handleProfileSubmit = (values) => {
    console.log("Profile Updated:", values);
    setIsEditable(false);
  };

  const handlePasswordSubmit = (values) => {
    console.log("Password Updated:", values);
    // Call API to update password
  };

  return (
    <CCard>
      <CCardBody>
        {/* Profile Image and Email */}
        <CRow className="align-items-center mb-4">
          <CCol md="3" className="text-center">
            <CImage
              roundedCircle
              src="https://via.placeholder.com/150"
              alt="Profile"
              width={150}
              height={150}
            />
          </CCol>
          <CCol md="9">
            <h4>{initialProfileValues.fullName}</h4>
            <p className="text-muted">john.doe@example.com</p>
          </CCol>
        </CRow>

        {/* Tabs */}
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
              Profile Details
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
              Password
            </CNavLink>
          </CNavItem>
        </CNav>

        <CTabContent>
          {/* Profile Details Tab */}
          <CTabPane visible={activeTab === 0}>
            <Formik
              initialValues={initialProfileValues}
              validationSchema={profileSchema}
              onSubmit={handleProfileSubmit}
            >
              {({ values }) => (
                <Form className="mt-4">
                  <CRow className="mb-3">
                    <CCol md="6">
                      <label>Full Name</label>
                      <Field
                        name="fullName"
                        as={CFormInput}
                        placeholder="Enter your full name"
                        disabled={!isEditable}
                      />
                      <ErrorMessage name="fullName" component="div" className="text-danger" />
                    </CCol>
                    <CCol md="6">
                      <label>Education</label>
                      <Field
                        name="education"
                        as={CFormInput}
                        placeholder="Enter your education"
                        disabled={!isEditable}
                      />
                      <ErrorMessage name="education" component="div" className="text-danger" />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md="6">
                      <label>Aadhaar Number</label>
                      <Field
                        name="aadhaar"
                        as={CFormInput}
                        placeholder="Enter your Aadhaar number"
                        disabled={!isEditable}
                      />
                      <ErrorMessage name="aadhaar" component="div" className="text-danger" />
                    </CCol>
                    <CCol md="6">
                      <label>PAN Number</label>
                      <Field
                        name="pan"
                        as={CFormInput}
                        placeholder="Enter your PAN number"
                        disabled={!isEditable}
                      />
                      <ErrorMessage name="pan" component="div" className="text-danger" />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol>
                      <label>Address</label>
                      <Field
                        name="address"
                        as={CFormTextarea}
                        placeholder="Enter your address"
                        rows={3}
                        disabled={!isEditable}
                      />
                      <ErrorMessage name="address" component="div" className="text-danger" />
                    </CCol>
                  </CRow>

                  <div className="d-flex justify-content-between">
                    {isEditable ? (
                      <>
                        <CButton type="submit" color="primary">
                          Save Changes
                        </CButton>
                        <CButton
                          type="button"
                          color="secondary"
                          onClick={() => setIsEditable(false)}
                        >
                          Cancel
                        </CButton>
                      </>
                    ) : (
                      <CButton type="button" color="primary" onClick={() => setIsEditable(true)}>
                        Edit
                      </CButton>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </CTabPane>

          {/* Password Tab */}
          <CTabPane visible={activeTab === 1}>
            <Formik
              initialValues={initialPasswordValues}
              validationSchema={passwordSchema}
              onSubmit={handlePasswordSubmit}
            >
              {() => (
                <Form className="mt-4">
                  <CRow className="mb-3">
                    <CCol md="12">
                      <label>Old Password</label>
                      <Field
                        name="oldPassword"
                        type="password"
                        as={CFormInput}
                        placeholder="Enter old password"
                      />
                      <ErrorMessage name="oldPassword" component="div" className="text-danger" />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md="12">
                      <label>New Password</label>
                      <Field
                        name="newPassword"
                        type="password"
                        as={CFormInput}
                        placeholder="Enter new password"
                      />
                      <ErrorMessage name="newPassword" component="div" className="text-danger" />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md="12">
                      <label>Confirm Password</label>
                      <Field
                        name="confirmPassword"
                        type="password"
                        as={CFormInput}
                        placeholder="Confirm new password"
                      />
                      <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                    </CCol>
                  </CRow>
                  <CButton type="submit" color="primary">
                    Update Password
                  </CButton>
                </Form>
              )}
            </Formik>
          </CTabPane>
        </CTabContent>
      </CCardBody>
    </CCard>
  );
};

export default Profile;
