import React, { useState, useEffect, useRef } from 'react'
import validator from 'validator';
import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormText,
  CSpinner,
  CToaster
} from '@coreui/react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux';

import { loginUser  } from '../../../store/loginReducer'
import { validationLoginSchema } from './loginSchema';
import { ToastMessage } from '../../../components/ToastMessage';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [toast, addToast] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toaster = useRef();
  const { users, isLoggedIn, loading, error } = useSelector((state) => state.auth);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   setFormData((prevData) => ({ ...prevData, [name]: value }));

  //   const validateErrors = validateFields( { 
  //     email : formData.email,
  //     password : formData.password
  //   });

  //   setErrors((prevErrors) => ({ ...prevErrors, [name]: validateErrors[name] }));
  // };

  const handleLogin = async (values) => {
     try {
          dispatch(loginUser(values));
      } catch ( error ) {
        console.log(error)
        addToast(<ToastMessage
            type="error"
            message={error.message} />)
      }
    } 

    // console.log(errors);
  useEffect(() => {
    isLoggedIn && navigate('/dashboard')
  }, []);

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <Formik
                      initialValues={{
                        email: '',
                        password: ''
                      }}
                      validationSchema={validationLoginSchema}
                      onSubmit={(values, { setSubmitting }) => {
                          handleLogin(values);
                          setSubmitting(false);
                        }}
                  >
                    {({ values, handleChange, handleBlur, isSubmitting  }) => (
                      <Form>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>

                    {/* Error Message */}
                    {error && <p className="text-danger">{error}</p>}

                    {/* Email Input */}
                    <CCol className="mb-3">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        name="email"
                        autoComplete="username"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </CInputGroup>
                      <ErrorMessage name="email" component={CFormText} className="text-danger" />
                    </CCol>

                    {/* Password Input */}
                    <CCol className="mb-4">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        name="password"
                        autoComplete="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        />
                    </CInputGroup>
                      <ErrorMessage name="password" component={CFormText} className="text-danger" />
                    </CCol>

                    {/* Login Button */}
                    <CRow>
                      <CCol xs={6}>

                        <CButton 
                            type="submit" 
                            color="primary"
                            style={{ color: 'white', backgroundColor: '#FF8C00', borderColor: '#FF8C00' }}
                            disabled={isSubmitting}>
                          {  isSubmitting ? (  <> <CSpinner size='sm' /> Submit  </> ) : 'Login' }
                        </CButton>
                      </CCol>
                    </CRow>
                      </Form>
                    )}
                    </Formik>
                </CCardBody>
              </CCard>

              {/* Sign Up Section */}
              <CCard className="pt-4" style={{ backgroundColor: '#fc6600', color: 'white' }}>
                <CCardBody className="text-center">
                  <div>
                    <h1>Welcome Again!</h1>
                    <p className="text-white">Good to see you</p>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
        <CToaster ref={toaster} push={toast} placement="top-end" />
      </CContainer>
    </div>
  )
}

export default Login;