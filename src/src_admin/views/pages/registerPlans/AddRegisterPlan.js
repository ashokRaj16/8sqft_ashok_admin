import React, { useState, useRef, useEffect } from 'react';
import { 
    CRow,
    CCol,
    CSpinner,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CForm, 
    CInputGroup,
    CFormInput,
    CFormSelect,
    CFormCheck,
    CFormLabel,
    CButton, 
    CFormText,
    CToaster } from '@coreui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { validationRegisterSchema } from './registerValidation';
import { createMemberUser } from '../../../models/usersModel';
import { ToastMessage } from '../../../components/ToastMessage';
import { initialMemberValues } from './data';
import { getAllCities, getAllStates } from '../../../models/locationModel';
import { useNavigate } from 'react-router-dom';


const AddMemberUser = () => {
  
    const [ cities, setCities ] = useState([]);
    const [ toast, addToast ] = useState(0);
    const toaster = useRef();    
    const navigate = useNavigate();

    const handleSubmit = async (values, resetForm, setSubmitting) => {
        try {
          console.log(values);
            const result = await createMemberUser(values);
            console.log("Result: ", result)
            if(result) {
                addToast(<ToastMessage
                    type="success"
                    message={result.message} />)
            }
            resetForm();
          } catch ( error ) {
            addToast(<ToastMessage
              type="error"
              message={error.message} />)
          } finally {
            setSubmitting(false);
          }
    }

    useEffect( () => {

      (async () => {
        try{

          const result = await getAllCities();
          console.log(result.data)
          setCities(result.data)
        }
        catch(error) {
          addToast(<ToastMessage
            type="error"
            message={error.message} />)
        }
      })();

      // return () => {}
    }, [])


  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className='d-flex'>
            <strong>Add Member</strong>
            <CCol className="d-flex justify-content-end">
                <CButton
                onClick={() => navigate(-1)} 
                color='primary'>Back
                </CButton>
            </CCol>
        </CCardHeader>
        <CCardBody>
          <Formik
              initialValues={initialMemberValues}
              validationSchema={validationRegisterSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                console.log(values)
                  handleSubmit(values, resetForm, setSubmitting);
                }}
          >
            {({ values, handleChange, handleBlur, isSubmitting  }) => (
              <Form>
                
                {/* <CForm> */}
                  <CRow className="mb-3">
                    <CFormLabel 
                      className="col-sm-2 col-form-label"
                      htmlFor="fname">
                          First Name:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                      <CFormInput
                          name="fname"
                          type="text"
                          className="form-control"
                          placeholder="Enter first name"
                          value={values.fname}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          />
                      <ErrorMessage name="fname" component={CFormText} className="text-danger" />
                  </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CFormLabel htmlFor="mname" className="col-sm-2 col-form-label">Middle Name: </CFormLabel>
                    <CCol sm={10} md={6} lg={4}>

                      <Field
                          name="mname"
                          type="text"
                          className="form-control"
                          placeholder="Enter middle name"
                          value={values.mname}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          />
                      <ErrorMessage name="mname" component={CFormText} className="text-danger" />
                      </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CFormLabel htmlFor="lname" className="col-sm-2 col-form-label">Last Name: </CFormLabel>
                    <CCol sm={10} md={6} lg={4}>

                    <Field
                      name="lname"
                      type="text"
                      className="form-control"
                      placeholder="Enter last name"
                      value={values.lname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      />
                    <ErrorMessage name="lname" component={CFormText} className="text-danger" />
                      </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CFormLabel htmlFor="address" className="col-sm-2 col-form-label">Address: </CFormLabel>
                    <CCol sm={10} md={6} lg={4}>

                    <Field
                      name="address"
                      type="text"
                      className="form-control"
                      placeholder="Enter address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      />
                    <ErrorMessage name="address" component={CFormText} className="text-danger" />
                      </CCol>
                  </CRow>

                  {/* <CRow className="mb-3">
                    <CFormLabel htmlFor="profile_picture_url" className="col-sm-2 col-form-label">Profile Picture URL</CFormLabel>
                    <CCol sm={10} md={6} lg={4}>

                    <Field
                      name="profile_picture_url"
                      type="text"
                      className="form-control"
                      placeholder="Enter profile picture URL"
                      />
                    <ErrorMessage name="profile_picture_url" component={CFormText} className="text-danger" />
                      </CCol>
                  </CRow> */}

                  <CRow className="mb-3">
                    <CFormLabel htmlFor="mobile" className="col-sm-2 col-form-label">Mobile:</CFormLabel>
                    <CCol sm={10} md={6} lg={4}>

                    <Field
                      name="mobile"
                      type="text"
                      className="form-control"
                      placeholder="Enter mobile number"
                      value={values.mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      />
                    <ErrorMessage name="mobile" component={CFormText} className="text-danger" />
                      </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CFormLabel htmlFor="email" className="col-sm-2 col-form-label">Email: </CFormLabel>
                    <CCol sm={10} md={6} lg={4}>

                    <Field
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="Enter email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      />
                    <ErrorMessage name="email" component={CFormText} className="text-danger" />
                      </CCol>
                  </CRow>

                  {/* <CRow className="mb-3">
                    <CFormLabel htmlFor="status" className="col-sm-2 col-form-label">Status</CFormLabel>
                    <CCol sm={10} md={6} lg={4}>

                    <Field
                      name="status"
                      as="select"
                      className="form-control"
                      >
                      <option value="" label="Select status" />
                      <option value="active" label="Active" />
                      <option value="inactive" label="Inactive" />
                    </Field>
                    <ErrorMessage name="status" component={CFormText} className="text-danger" />
                        </CCol>
                  </CRow> */}

                  <CRow className="mb-3">
                    <CFormLabel htmlFor="city" className="col-sm-2 col-form-label">City: </CFormLabel>
                    <CCol sm={10} md={6} lg={4}>
                    <Field
                        name="city"
                        as="select"
                        className="form-control"
                        >
                      <option value="-1" label="Select city" />
                      {
                        cities.length > 0 && 
                        cities.map((item, index) => (
                          
                          <option key={item.id} value={item.city_name} label={item.city_name} />
                        ))
                      }
                    </Field>
                    <ErrorMessage name="city" component={CFormText} className="text-danger" />
                        </CCol>
                  </CRow>

                  <CButton 
                      type="submit" 
                      color="primary"
                      className='me-2'
                      disabled={isSubmitting}>
                    {  isSubmitting ? (  <> <CSpinner size='sm' /> Submit  </> ) : 'Submit' }
                  </CButton>
                
                  <CButton 
                      type="reset" 
                      color="primary"
                      disabled={isSubmitting}>
                      {  isSubmitting ? (  <> <CSpinner size='sm' /> Reset  </> ) : 'Reset' }
                  </CButton>
              </Form>
            )}
          </Formik>
        </CCardBody>
      </CCard>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  );
};

export default AddMemberUser;
