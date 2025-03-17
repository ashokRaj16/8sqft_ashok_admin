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
    CToaster, 
    CProgress,
    CFormTextarea} from '@coreui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { validationMemberSchema } from './memberValidation';
import { createMemberUser, updateMemberUser, getMemberUserById } from '../../../models/usersModel';
import { initialMemberValues } from './data';
import { getAllCities, getAllStates } from '../../../models/locationModel';
import { useNavigate, useParams } from 'react-router-dom';
import { usePushToastHelper } from '../../../utils/toastHelper';

const AddMemberUser = () => {
  
    const { id } = useParams();
    
    const [ cities, setCities ] = useState([]);
    const [ memberDetails, setMemberDetails ] = useState(initialMemberValues);
    const { toasts, pushToastsMessage } = usePushToastHelper();
    const toaster = useRef();    
    const navigate = useNavigate();
    
    const handleSubmit = async (values, resetForm, setSubmitting) => {
      try {
        console.log(values);
        let result;
        if(!id) {
          result = await createMemberUser(values);
          resetForm();
        }
        else {
          result = await updateMemberUser(id, values);
        }
        if(result) {
            pushToastsMessage('success', result.message)
          }

        } catch ( error ) {
          pushToastsMessage('error', error.message)
        } finally {
          setSubmitting(false);
        }
    }
    
    useEffect( () => {
      
      (async () => {
        try{              
          const result = await getAllCities();
          setCities(result.data)
        }
        catch(error) {
            pushToastsMessage('error', error.message)
          }
        })();            
        
        // return () => {}
    }, [])
        
    useEffect( () => {
      (async () => { if(id) {
        try{

          const result = await getMemberUserById(id)
          console.log(id, result, "user Id");
          if(!result) {
            pushToastsMessage('error', error.message)
          }
          setMemberDetails((prev) => ({
            ...prev,
            ...result.data
          }))
        } catch(error) {
          pushToastsMessage('error', error.message)

          setTimeout(() => {
            navigate(-1)
          }, 1000)
        }
        
      }})()

      // return () => {}
    }, [id])

    console.log(memberDetails, "memberDetails data")

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className='d-flex'>
            <strong>
            { id ? 'Edit Member' : 'Add Member' } 
            </strong>
            <CCol className="d-flex justify-content-end">
                <CButton
                onClick={() => navigate(-1)} 
                color='primary'>Back
                </CButton>
            </CCol>
        </CCardHeader>
        <CCardBody>
          <Formik
              enableReinitialize
              initialValues={memberDetails}
              validationSchema={validationMemberSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                  handleSubmit(values, resetForm, setSubmitting);
              }}
          >
            {({ values, errors, handleChange, setFieldValue, setFieldError, handleBlur, isSubmitting  }) => (
              console.log(values, errors, "log"),
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

                  <CRow className="mb-3">
                    <CFormLabel htmlFor="address" className="col-sm-2 col-form-label">Address: </CFormLabel>
                    <CCol sm={10} md={6} lg={4}>
                    <CFormTextarea 
                      name="address_1"
                      className="form-control"
                      placeholder="Enter address"
                      value={values.address_1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="address_1" component={CFormText} className="text-danger" />
                      </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CFormLabel htmlFor="city_id" className="col-sm-2 col-form-label">City: </CFormLabel>
                    <CCol sm={10} md={6} lg={4}>
                    <Field
                        name="city_id"
                        as={CFormSelect}
                        type="select"
                        onChange={(e) => {
                          const selectedOption = e.target.options[e.target.selectedIndex];
                          const cityName = selectedOption.text;
                          if(e.target.value === '-1') {
                            setFieldValue('city_id', '');
                            setFieldValue('city_name', '');  
                            return
                          }
                          setFieldValue('city_id', e.target.value);
                          setFieldValue('city_name', cityName);
                        }}
                        className="form-control"
                        >
                      <option value="-1" label="Select city" />
                      {
                        cities.length > 0 && 
                        cities.map((item, index) => (                          
                          <option key={item.id} value={item.id} > { item.city_name } </option>
                        ))
                      }
                    </Field>
                    <ErrorMessage name="city_id" component={CFormText} className="text-danger" />
                        </CCol>
                  </CRow>
                      
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="instagram_url" className="col-sm-2 col-form-label">Instagram URL</CFormLabel>
                    <CCol sm={10} md={6} lg={4}>
                    <Field
                      name="instagram_url"
                      type="text"
                      className="form-control"
                      placeholder="Instagram URL"
                      />
                    <ErrorMessage name="instagram_url" component={CFormText} className="text-danger" />
                      </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CFormLabel htmlFor="facebook_url" className="col-sm-2 col-form-label">Facebook URL</CFormLabel>
                    <CCol sm={10} md={6} lg={4}>
                    <Field
                      name="facebook_url"
                      type="text"
                      className="form-control"
                      placeholder="Facebook URL"
                      />
                    <ErrorMessage name="facebook_url" component={CFormText} className="text-danger" />
                      </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CFormLabel htmlFor="youtube_url" className="col-sm-2 col-form-label">Youtube URL</CFormLabel>
                    <CCol sm={10} md={6} lg={4}>
                    <Field
                      name="youtube_url"
                      type="text"
                      className="form-control"
                      placeholder="Youtube URL"
                      />
                    <ErrorMessage name="youtube_url" component={CFormText} className="text-danger" />
                      </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CFormLabel htmlFor="whatsapp_notification" className="col-sm-2 col-form-label">Whatsapp Notification</CFormLabel>
                    <CCol sm={10} md={6} lg={4}>
                      <CFormCheck 
                        type='checkbox'
                        value={values?.whatsapp_notification }
                        name='whatsapp_notification'
                        onChange={(e) => {
                          setFieldValue('whatsapp_notification', e.target.checked ? '1' : '0')
                        }}
                        checked={values?.whatsapp_notification === '1'} />
                    
                    <ErrorMessage name="whatsapp_notification" component={CFormText} className="text-danger" />
                      </CCol>
                  </CRow>

                  <CButton 
                      type="submit" 
                      color="primary"
                      className='me-2'
                      disabled={isSubmitting}>
                    {  isSubmitting ? (  <> 
                      <CSpinner size='sm' /> Submit  
                      </> ) : id ? 'Update' : 'Submit' }
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
      <CToaster ref={toaster} push={toasts} placement="top-end" />
    </>
  );
};

export default AddMemberUser;
