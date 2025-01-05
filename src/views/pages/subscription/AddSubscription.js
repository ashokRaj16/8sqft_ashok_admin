import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
//   CFormGroup,
  CInputGroup,
  CFormText,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSelect,
  CFormCheck,
//   CInputRadio,
} from '@coreui/react';

// Validation schema using Yup
const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  gender: Yup.string().required('Gender is required'),
  country: Yup.string().required('Country is required'),
  terms: Yup.bool().oneOf([true], 'You must accept the terms and conditions'),
  address: Yup.string(), // Optional field, no required validation
  publish_date: Yup.date().required('Publish date is required'), // Required field
});

const AddSubscription = () => {
  return (
    <CRow>
      <CCol xs="12" sm="6">
        <CCard>
          <CCardHeader>
            <h4>Registration Form</h4>
          </CCardHeader>
          <CCardBody>
            <Formik
              initialValues={{
                username: '',
                email: '',
                password: '',
                gender: '',
                country: '',
                terms: false,
                address: '',
                publish_date: '', // Initialize with an empty string
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                console.log('Form submitted successfully', values);
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, handleChange, handleBlur }) => (
                <Form>
                  <CInputGroup>
                    <CFormLabel htmlFor="username">Username</CFormLabel>
                    <Field
                      as={CFormInput}
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Enter your username"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="username" component={CFormText} className="help-block" />
                  </CInputGroup>

                  <CInputGroup>
                    <CFormLabel htmlFor="email">Email</CFormLabel>
                    <Field
                      as={CFormInput}
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="email" component={CFormText} className="help-block" />
                  </CInputGroup>

                  <CInputGroup>
                    <CFormLabel htmlFor="password">Password</CFormLabel>
                    <Field
                      as={CFormInput}
                      type="pCFormInputassword"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="password" component={CFormText} className="help-block" />
                  </CInputGroup>

                  <CInputGroup>
                    <CFormLabel>Gender</CFormLabel>
                    <div>
                      <Field
                        as={CFormInput}
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <CFormLabel htmlFor="male">Male</CFormLabel>
                      <Field
                        as={CFormInput}
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <CFormLabel htmlFor="female">Female</CFormLabel>
                    </div>
                    <ErrorMessage name="gender" component={CFormText} className="help-block" />
                  </CInputGroup>

                  <CInputGroup>
                    <CFormLabel htmlFor="country">Country</CFormLabel>
                    <CFormSelect
                      as={CFormSelect}
                      id="country"
                      name="country"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select your country</option>
                      <option value="USA">USA</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">UK</option>
                    </CFormSelect>
                    <ErrorMessage name="country" component={CFormText} className="help-block" />
                  </CInputGroup>

                  <CInputGroup>
                    <CFormLabel htmlFor="address">Address</CFormLabel>
                    <Field
                      as={CFormInput}
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Enter your address (optional)"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="address" component={CFormText} className="help-block" />
                  </CInputGroup>

                  <CInputGroup>
                    <CFormLabel htmlFor="publish_date">Publish Date</CFormLabel>
                    <Field
                      as={CFormInput}
                      type="date"
                      id="publish_date"
                      name="publish_date"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="publish_date" component={CFormText} className="help-block" />
                  </CInputGroup>

                  <CInputGroup>
                    <Field
                      as={CFormCheck}
                      type="checkbox"
                      id="terms"
                      name="terms"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <CFormLabel htmlFor="terms">
                      I accept the terms and conditions
                    </CFormLabel>
                    <ErrorMessage name="terms" component={CFormText} className="help-block" />
                  </CInputGroup>

                  <CButton type="submit" color="primary" disabled={isSubmitting}>
                    Register
                  </CButton>
                </Form>
              )}
            </Formik>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddSubscription;
