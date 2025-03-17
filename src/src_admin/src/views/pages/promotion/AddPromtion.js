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
    CToaster } from '@coreui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { ToastMessage } from '@component/ToastMessage';
import { initialPromotionValues, categoriesOption } from './data';
import { useNavigate } from 'react-router-dom';
import { validationPromotionSchema } from './promotionValidation';
import { createPromotionProperty, getPromotionSequenceByCategories } from '../../../models/promotionModel';
import { getPropertyList } from '../../../models/propertyModel';
import { useDebounce } from '../../../hooks/useDebounce';
import SearchSelect from '../Component/SearchSelect';

const AddPromtion = () => {
  
    const [ properties, setProperties ] = useState([]);
    const [ currentSequence, setCurrentSequence] = useState(1);
    const [ toast, addToast ] = useState(0);
    const [searchTerm, setSearchTerm] = useState('')

    const navigate = useNavigate();
    const toaster = useRef();

    const debounceValue = useDebounce(searchTerm, 500)

    const handleSubmit = async (values, resetForm, setSubmitting) => {
        try {
            const result = await createPromotionProperty(values);
            console.log(result)
            if(result) {
                addToast(<ToastMessage
                    type="success"
                    message={result.message} />)
            }
            resetForm();
            setCurrentSequence(() => currentSequence + 1);
        } catch ( error ) {
            addToast(<ToastMessage
                type="error"
                message={error.message} />)
        } finally {
            setSubmitting(false);
        }
    }

    const categoryChangeHandler = async (catVal = null, setFieldValue ) => {
        try {
            let data = catVal ? catVal : ''
            
            const resultSequence = await getPromotionSequenceByCategories(data);
            console.log(resultSequence)
            setCurrentSequence(() => (resultSequence.data.last_sequence_no));
            setFieldValue('categories', catVal);
            setFieldValue('sequence_no', resultSequence.data.last_sequence_no ? resultSequence.data.last_sequence_no + 1 : 1)
        } catch ( error ) {
            addToast(<ToastMessage
                type="error"
                message={error.message} />)
        } 
    }

    useEffect( () => {
      (async () => {
        try{
            const result = await getPropertyList(undefined, undefined, undefined, undefined, searchTerm, undefined, '2')
            const resultSequence = await getPromotionSequenceByCategories();

            // console.log(result.data, resultSequence.data)
            const newProperties = result.data?.property.map((i) => ({
                id: i.id,
                value: i.id,
                label: `${ [i.id, i.property_title, i.city_name, i.user_mobile]
                      .filter(Boolean)
                      .join(' | ') }`
              }))

            setProperties(newProperties)
            setCurrentSequence(() => (resultSequence.data.last_sequence_no));
        }
        catch(error) {
          addToast(<ToastMessage
            type="error"
            message={error.message} />)
        }
      })();

      // return () => {}
    }, [debounceValue])


  return (
    <>
        <CCard className="mb-4">
        <CCardHeader className='d-flex'>
            <strong>Add Sponsared</strong>
            <CCol className="d-flex justify-content-end">
                                
                <CButton
                onClick={() => navigate(-1)} 
                color='primary'>Back
                </CButton>
            </CCol>
        </CCardHeader>
        <CCardBody>
            <CRow>
                        <CCol lg={6} className="mb-2">

                        
            <Formik
                enableReinitialize
                initialValues={initialPromotionValues}
                validationSchema={validationPromotionSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    handleSubmit(values, resetForm, setSubmitting);
                }}
            >
                {({ values, errors, handleChange,  setFieldValue, handleBlur, isSubmitting  }) => (
                    useEffect(() => {
                        if(currentSequence ) {
                            setFieldValue("sequence_no", currentSequence  + 1);
                        }
                    }, [currentSequence, setFieldValue]),
                    console.log(values, errors)
                    ,
                <Form>
                    {/* <CForm> */}
                    {/* <CRow className="mb-3"> */}
                        {/* <CFormLabel 
                        className="col-sm-2 col-form-label"
                        htmlFor="fname">
                            Property Title:
                    </CFormLabel> */}
                    {/* <CCol sm={10} md={6} lg={4}> */}
                        {/* <Field
                            name="property_id"
                            type="text"
                            as={CFormSelect}
                            className="form-control"
                            placeholder="Property Title"
                            onChange={(e) => {
                                let id = e.target.value
                                setFieldValue('property_id', id )
                            }}
                            >
                                <option value={'-1'}>Select</option>
                                {
                                    properties && properties.map((i, i) => (
                                        <option value={item.id}>{
                                            `${ [item.id, item.property_title, item.city_name, item.user_mobile]
                                                    .filter(Boolean)
                                                    .join(' | ') }`
                                            }
                                        </option>
                                    ))
                                }

                        </Field> */}
                        <SearchSelect
                            label={'Properties'}
                            name={'property_id'} 
                            placeholder={'Select Property'}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            // labelWidth='col-sm-2'

                            options={properties || []}/>
                        <ErrorMessage name="property_id" component={CFormText} className="text-danger" />
                    {/* </CCol> */}
                    {/* </CRow> */}

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="mname" className="col-sm-3 col-form-label">
                            Categories: 
                        </CFormLabel>
                        <CCol sm={10} md={6} lg={6}>

                        <Field
                            name="categories"
                            // type="text"
                            as={CFormSelect}
                            className="form-control"
                            placeholder="Categories"
                            value={values.categories}
                            onChange={(e) => {

                                let catVal = e.target.value;
                                categoryChangeHandler(catVal , setFieldValue );
                            }
                            }
                            >
                            <option value={'-1'}>Select</option>
                            {
                                categoriesOption && categoriesOption.map((item, i) => (
                                    <option value={item.value}>{item.title }</option>
                                ))
                            }
                        </Field>
                        <ErrorMessage name="categories" component={CFormText} className="text-danger" />
                        </CCol>
                    </CRow>
                    {
                        (values.categories === categoriesOption[1].value || values.categories === categoriesOption[2].value || values.categories === categoriesOption[3].value ) &&
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="banner_id" className="col-sm-3 col-form-label">
                                Banner: 
                            </CFormLabel>
                            <CCol sm={10} md={6} lg={6}>

                            <Field
                                name="banner_id"
                                // type="text"
                                as={CFormSelect}
                                className="form-control"
                                placeholder="banner_id"
                                value={values.banner_id}
                                onChange={(e) => {
                                    let bannerVal = e.target.value;
                                    setFieldValue('banner_id', bannerVal)
                                }
                                }
                                >
                                <option value={'-1'}>Select</option>
                                {
                                    categoriesOption && categoriesOption.map((item, i) => (
                                        <option value={item.value}>{ item.title }</option>
                                    ))
                                }
                            </Field>
                            <ErrorMessage name="banner_id" component={CFormText} className="text-danger" />
                            </CCol>
                        </CRow>
                    }

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="sequence_no" className="col-sm-3 col-form-label">Sequence No: </CFormLabel>
                        <CCol sm={10} md={6} lg={6}>

                        <Field
                        name="sequence_no"
                        type="text"
                        className="form-control"
                        placeholder="Sequence No"
                        disabled
                        value={values.sequence_no}                        
                        />
                        <ErrorMessage name="sequence_no" component={CFormText} className="text-danger" />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="published_date" className="col-sm-3 col-form-label">Published Date: </CFormLabel>
                        <CCol sm={10} md={6} lg={6}>

                        <Field
                        name="published_date"
                        type="date"
                        className="form-control"
                        placeholder="Published Date"
                        value={values.published_date}
                        />
                        <ErrorMessage name="published_date" component={CFormText} className="text-danger" />
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
            </CCol>
            </CRow>
        </CCardBody>
      </CCard>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  );
};

export default AddPromtion;
