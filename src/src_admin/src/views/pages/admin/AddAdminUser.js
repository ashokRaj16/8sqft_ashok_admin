import React, { useState, useRef, useEffect } from 'react';
import { 
    CRow,
    CCol,
    CSpinner,
    CCard, 
    CCardBody,
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
    CFormTextarea} from '@coreui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { validationAdminSchema } from './adminValidation';
import { createAdminUser, getAdminRoles } from '@model/usersModel';
import { getAllCities } from '@model/locationModel';
import { initialAdminValues } from './data';
import { useNavigate, useParams } from 'react-router-dom';
import { usePushToastHelper } from '../../../hooks/usePushToastHelper'
import { getAdminUserById, updateAdminUser } from '../../../models/usersModel';

const AddAdminUser = () => {
  
    const { id } = useParams();
    const [ cities, setCities ] = useState([]);
    const [ roles, setRoles ] = useState([]);
    const [ adminUserDetails, setAdminUserDetails ] = useState(initialAdminValues);

    const toaster = useRef();
    const navigate = useNavigate();
    const { toasts, pushToastsMessage } = usePushToastHelper();

    const handleSubmit = async (values, resetForm, setSubmitting) => {
        try {
            let result;
            if(id) {
                result = await updateAdminUser(id, values);
            }
            else {
                result = await createAdminUser(values);
                resetForm();
            }
            console.log(result)
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
            const [cityResult, rolesResult] = await Promise.all([
                getAllCities(),
                getAdminRoles()
            ])
            // const result = await getAllCities();
            // const rolesResult = await getAdminRoles();
            console.log(cityResult.data, rolesResult)
            setCities(cityResult.data)
            setRoles(() => (rolesResult.data));

            if(id) {
                const result = await getAdminUserById(id)
                console.log(id, result, "user Id");
                if(!result) {
                pushToastsMessage('error', error.message)
                }
                setAdminUserDetails((prev) => ({
                ...prev,
                ...result.data
                }))
            }
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
                const result = await getAdminUserById(id)
                console.log(id, result, "user Id");
                if(!result) {
                pushToastsMessage('error', error.message)
                }
                setAdminUserDetails((prev) => ({
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

  return (
    <>
        <CCard className="mb-4">
        <CCardHeader className='d-flex'>
            <strong>
                { id ? 'Edit Admin' : 'Add Admin' }
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
                initialValues={adminUserDetails}
                validationSchema={
                    validationAdminSchema(id)
                }
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    handleSubmit(values, resetForm, setSubmitting);
                }}
            >
                {({ values, errors, setFieldValue, handleChange, handleBlur, isSubmitting  }) => (
                    console.log(values, errors, "errr"),
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
                            as={CFormTextarea}
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

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="city" className="col-sm-2 col-form-label">City: </CFormLabel>
                        <CCol sm={10} md={6} lg={4}>
                        <Field
                            name="city_id"
                            as={CFormSelect}
                            type='select'
                            value={values.city_id }
                            className="form-control"
                            onChange={(e) => {
                                let cityName = e.target.selectedOptions[e.target.selectedIndex]
                                if(e.target.value === '-1') {
                                    setFieldValue('city_id' , '')
                                    setFieldValue('city_name' , '')
                                    return;
                                }
                                setFieldValue('city_id' , e.target.value)
                                setFieldValue('city_name' , cityName)
                            }}
                            >
                        <option value="-1" label="Select city" />
                        {
                            cities.length > 0 && 
                            cities.map((item, index) => (                            
                            <option key={item.id} value={item.id} >
                                {item.city_name}
                            </option>
                            ))
                        }
                        </Field>
                        <ErrorMessage name="city_id" component={CFormText} className="text-danger" />
                            </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="role_id" className="col-sm-2 col-form-label">Role: </CFormLabel>
                        <CCol sm={10} md={6} lg={4}>
                        <Field
                            name="role_id"
                            as={CFormSelect}
                            className="form-control"
                            value={values.role_id}
                            onChange={(e) => {
                                if(e.target.value === '-1') {
                                    setFieldValue('role_id' , '')
                                    return;
                                }
                                setFieldValue('role_id' , e.target.value)
                            }}
                            >
                        <option value="-1" label="Select Role" />
                        {
                            roles.length > 0 && 
                            roles.map((item, index) => (
                                <option value={item.id} label={item.role_name} />
                            ))
                        }
                        </Field>
                        <ErrorMessage name="role_id" component={CFormText} className="text-danger" />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="password" className="col-sm-2 col-form-label">Password: </CFormLabel>
                        <CCol sm={10} md={6} lg={4}>

                        <Field
                        name="password"
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        />
                        <ErrorMessage name="password" component={CFormText} className="text-danger" />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="cpassword" className="col-sm-2 col-form-label">Confirm Password: </CFormLabel>
                        <CCol sm={10} md={6} lg={4}>

                        <Field
                        name="cpassword"
                        type="password"
                        className="form-control"
                        placeholder="Enter confirm password"
                        value={values.cpassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        />
                        <ErrorMessage name="cpassword" component={CFormText} className="text-danger" />
                        </CCol>
                    </CRow>

                    <CButton 
                        type="submit" 
                        color="primary"
                        className='me-2'
                        disabled={isSubmitting}>
                        {  
                            isSubmitting ? (  <> <CSpinner size='sm' /> Submit  </> ) : 
                            id ? 'Update' : 'Submit' 
                        }
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

export default AddAdminUser;
 