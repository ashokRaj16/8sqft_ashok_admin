import React, { useState, useRef } from 'react'
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
  CToaster,
} from '@coreui/react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { profileSchema, passwordSchema } from './profileValidationSchema'
import { initialProfileValues, initialPasswordValues } from './data'
import { useDispatch, useSelector } from 'react-redux'
import { updateUsers } from '../../../store/loginReducer'
import { ToastMessage } from '../../../components/ToastMessage'
import { updateUserPassword } from '../../../models/profileModel'
import { result } from 'lodash'

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [isEditable, setIsEditable] = useState(false)
  const [toast, addToast] = useState(0)

  const dispatch = useDispatch()
  const toaster = useRef()

  const { users, loading, error } = useSelector((state) => state.auth)
  console.log('profile values', isEditable)

  const initialDefaultValues = {
    ...initialProfileValues,
    ...users,
  }

  const handleProfileSubmit = (values, resetForm, setSubmitting) => {
    console.log('Profile Updated:', values)
    try {
      dispatch(updateUsers(values))
      addToast(<ToastMessage type="success" message={'Profile success updated.'} />)
      setIsEditable(false)
    } catch (error) {
      console.log(error)
      addToast(<ToastMessage type="error" message={error.message} />)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (values, resetForm, setSubmitting) => {
    console.log('Password Updated:', values)
    try {
      const updateValues = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }
      const result = await updateUserPassword(updateValues)
      console.log(result, 'sdsd')
      if (result) {
        addToast(<ToastMessage type="success" message={result?.message || 'Passowrd updated.'} />)
        resetForm()
      }
    } catch (error) {
      console.log(error)
      addToast(<ToastMessage type="error" message={error.message} />)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <CCard>
        <CCardBody>
          {/* Profile Image and Email */}
          <CRow className="align-items-center mb-4">
            <CCol md="2" className="text-center">
              <CImage
                roundedCircle
                src={`${users?.img_url || '/src/assets/images/avatars/profile.png'}`}
                alt="Profile"
                width={100}
                height={100}
              />
            </CCol>
            <CCol md="10">
              <h4>{initialProfileValues.fullName}</h4>
              <p className="text-muted">{`${users?.email || 'Welcome'}`}</p>
              <p className="text-muted">{`${users?.role_name || 'Admin'}`}</p>
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
                initialValues={initialDefaultValues}
                validationSchema={profileSchema}
                onSubmit={(values, { resetForm, setSubmitting }) => {
                  handleProfileSubmit(values, resetForm, setSubmitting)
                }}
              >
                {({ values, handleChange, handleBlur, isSubmitting }) => (
                  <Form className="mt-4">
                    <CRow className="mb-3">
                      <CCol md="12">
                        <label>Full Name</label>
                      </CCol>
                      <CCol md="3 mb-2">
                        <Field
                          as={CFormInput}
                          placeholder="Enter first name"
                          name="fname"
                          value={values.fname}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={!isEditable}
                        />
                        <ErrorMessage name="fname" component="div" className="text-danger" />
                      </CCol>
                      <CCol md="3 mb-2">
                        <Field
                          as={CFormInput}
                          name="mname"
                          value={values.mname}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter middle name"
                          disabled={!isEditable}
                        />
                        <ErrorMessage name="mname" component="div" className="text-danger" />
                      </CCol>
                      <CCol md="3 mb-2">
                        <Field
                          as={CFormInput}
                          name="lname"
                          value={values.lname}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter middle name"
                          disabled={!isEditable}
                        />
                        <ErrorMessage name="lname" component="div" className="text-danger" />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol md="6">
                        <label>Email:</label>
                        <Field
                          as={CFormInput}
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Mail Address"
                          disabled={!isEditable}
                        />
                        <ErrorMessage name="email" component="div" className="text-danger" />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol md="6">
                        <label>Mobile:</label>
                        <Field
                          as={CFormInput}
                          name="mobile"
                          value={values.mobile}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Mail Address"
                          disabled={!isEditable}
                        />
                        <ErrorMessage name="mobile" component="div" className="text-danger" />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol md="6">
                        <label>PAN No:</label>
                        <Field
                          name="pan"
                          as={CFormInput}
                          value={values.pan}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="PAN number"
                          disabled={!isEditable}
                        />
                        <ErrorMessage name="pan" component="div" className="text-danger" />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <label>Address:</label>
                        <Field
                          name="address"
                          as={CFormTextarea}
                          value={values.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
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
                            onClick={(e) => {
                              e.preventDefault()
                              setIsEditable(false)
                            }}
                          >
                            Cancel
                          </CButton>
                        </>
                      ) : (
                        <CButton
                          type="button"
                          color="primary"
                          onClick={(e) => {
                            e.preventDefault() // Prevent default behavior
                            setIsEditable(true)
                          }}
                        >
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
                // onSubmit={handlePasswordSubmit}
                onSubmit={(values, { resetForm, setSubmitting }) => {
                  handlePasswordSubmit(values, resetForm, setSubmitting)
                }}
              >
                {({ values, handleChange, handleBlur, isSubmitting }) => (
                  <Form className="mt-4">
                    <CRow className="mb-3">
                      <CCol md="12">
                        <label>Old Password</label>
                        <Field
                          as={CFormInput}
                          name="oldPassword"
                          type="password"
                          value={values.oldPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter old password"
                        />
                        <ErrorMessage name="oldPassword" component="div" className="text-danger" />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol md="12">
                        <label>New Password</label>
                        <Field
                          as={CFormInput}
                          name="newPassword"
                          type="password"
                          value={values.newPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter new password"
                        />
                        <ErrorMessage name="newPassword" component="div" className="text-danger" />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol md="12">
                        <label>Confirm Password</label>
                        <Field
                          as={CFormInput}
                          name="confirmPassword"
                          type="password"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Confirm new password"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-danger"
                        />
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
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  )
}

export default Profile
