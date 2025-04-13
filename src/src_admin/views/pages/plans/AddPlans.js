import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CFormCheck,
  CPagination,
  CPaginationItem,
  CFormInput,
  CRow,
  CCol,
  CFormSelect,
  CFormLabel,
  CForm,
  CToast,
  CToaster,
  CSpinner,
  CFormText,
  CFormSwitch,
} from '@coreui/react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import { ToastMessage } from '../../../components/ToastMessage'
import { validationPlansSchema } from './validationPlansSchema'
import { createSubscriptionPlan } from '../../../models/plansModel'
import {
  initialPlansValues,
  optionCategoryValue,
  optionUserValue,
  optionPlanValue,
  optionValue,
} from './data'
import { constant } from '../../../utils/constant'

const AddPlans = (props) => {
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const navigate = useNavigate()
  const handleSubmit = async (values, resetForm, isSubmitting) => {
    console.log(values, "values")

    try {
      const result = await createSubscriptionPlan(values)
      console.log(result)
      if (result) {
        addToast(<ToastMessage type="success" message={result.message} />)
        resetForm()
      }
    } catch (error) {
      addToast(<ToastMessage type="error" message={error.message} />)
    } finally {
      isSubmitting(false)
    }
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex">
          <strong>Add Subscription Plans</strong>
          <CCol className="d-flex justify-content-end">
            <CButton onClick={() => navigate(-1)} color="primary">
              Back
            </CButton>
          </CCol>
        </CCardHeader>
        <CCardBody>
          <Formik
            initialValues={initialPlansValues}
            validationSchema={validationPlansSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              handleSubmit(values, resetForm, setSubmitting)
            }}
          >
            {({ values, setFieldValue, setFieldError, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                
                <CRow className="mb-3">
                  <CFormLabel htmlFor="staticEmail2" className="col-sm-2 col-form-label">
                    Plan Type:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    
                    <CButton 
                        color={values.plan_type === constant.PLAN_TYPE.REGULAR ? 'primary' : '' }
                        onClick={(e)=> {
                            setFieldValue('plan_type', constant.PLAN_TYPE.REGULAR)
                        }}
                        size='sm'
                        className='border rounded-pill me-2 px-4 py-2' >{constant.PLAN_TYPE.REGULAR}</CButton>
                    <CButton 
                        color={values.plan_type === constant.PLAN_TYPE.ADDON ? 'primary' : '' }
                        onClick={(e)=> {
                            setFieldValue('plan_type', constant.PLAN_TYPE.ADDON)
                        }}
                        size='sm'
                        className='border rounded-pill me-2 px-4 py-2' >{constant.PLAN_TYPE.ADDON}</CButton>
                    <ErrorMessage name="plan_type" component={CFormText} className="text-danger" />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="staticEmail2" className="col-sm-2 col-form-label">
                    Plan Category:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    
                    <CButton 
                        color={values.plan_category === constant.PLAN_CATEGORY.GENERAL ? 'primary' : '' }
                        onClick={(e)=> {
                            setFieldValue('plan_category', constant.PLAN_CATEGORY.GENERAL)
                        }}
                        size='sm'
                        className='border rounded-pill me-2 px-3 py-2' >{constant.PLAN_CATEGORY.GENERAL}</CButton>
                    <CButton 
                        color={values.plan_category === constant.PLAN_CATEGORY.CUSTOMIZE ? 'primary' : '' }
                        onClick={(e)=> {
                            setFieldValue('plan_category', constant.PLAN_CATEGORY.CUSTOMIZE)
                        }}
                        size='sm'
                        className='border rounded-pill me-2 px-3 py-2' >{constant.PLAN_CATEGORY.CUSTOMIZE}</CButton>
                    <ErrorMessage name="plan_category" component={CFormText} className="text-danger" />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="staticEmail2" className="col-sm-2 col-form-label">
                    Plan Title:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <CFormInput
                      type="text"
                      id="plan_title"
                      name="plan_title"
                      placeholder="Plan Title"
                      value={values.plan_title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="plan_title" component={CFormText} className="text-danger" />
                  </CCol>
                </CRow>
                
                <CRow className="mb-3">
                  <CFormLabel htmlFor="staticEmail2" className="col-sm-2 col-form-label">
                    List Property Count:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <CFormInput
                      type="text"
                      id="project_list_count"
                      name="project_list_count"
                      placeholder="Plan Title"
                      value={values.project_list_count}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="project_list_count" component={CFormText} className="text-danger" />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="staticEmail2" className="col-sm-2 col-form-label">
                    Plan Validity:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <CFormInput
                      type="text"
                      id="plan_validity"
                      name="plan_validity"
                      placeholder="Plan Validity"
                      value={values.plan_validity}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="plan_validity" component={CFormText} className="text-danger" />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputPassword2" className="col-sm-2 col-form-label">
                    Property Category:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>

                    <Field name="property_category" as={CFormSelect} className="form-control">
                      <option value={-1}>Select</option>
                      {optionCategoryValue.length > 0 &&
                        optionCategoryValue.map((data) => (
                          <option key={data.id} value={data?.id}>
                            {data?.value}
                          </option>
                        ))}
                    </Field>
                    <ErrorMessage
                      name="property_category"
                      component={CFormText}
                      className="text-danger"
                    />

                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputPassword2" className="col-sm-2 col-form-label">
                    User Type:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <Field
                      name="user_type"
                      as={CFormSelect}
                      className="form-control"
                      id="user_type"
                    >
                      <option value={-1}>Select</option>
                      {optionUserValue.length > 0 &&
                        optionUserValue.map((data) => (
                          <option 
                            key={data?.id}
                            value={data?.key}>{data?.value}</option>
                        ))}
                    </Field>
                    <ErrorMessage name="user_type" component={CFormText} className="text-danger" />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputPassword2" className="col-sm-2 col-form-label">
                    Plan Names:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <Field
                      name="plan_names"
                      as={CFormSelect}
                      className="form-control"
                      id="plan_names"
                    >
                      <option value={-1}>Select</option>
                      {optionPlanValue.length > 0 &&
                        optionPlanValue.map((data) => (
                          <option 
                            key={data?.id}
                            value={data?.key}>{data?.value}</option>
                        ))}
                    </Field>
                    <ErrorMessage name="plan_names" component={CFormText} className="text-danger" />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputPassword2" className="col-sm-2 col-form-label">
                    Duration (in days):
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <CFormInput
                      placeholder="Duration"
                      name="duration_days"
                      value={values.duration_days}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      id="duration_days"
                    />
                    <ErrorMessage
                      name="duration_days"
                      component={CFormText}
                      className="text-danger"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="roles" className="col-sm-2 col-form-label">
                    Leads Counts:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <CFormInput
                      placeholder="Leads Count"
                      name="leads_counts"
                      value={values.leads_counts}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      id="leads_counts"
                    />
                    <ErrorMessage
                      name="leads_counts"
                      component={CFormText}
                      className="text-danger"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="roles" className="col-sm-2 col-form-label">
                    Contact Whatsapp Notification:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <Field
                      className="form-control"
                      as={CFormSelect}
                      name="contact_whatsapp_notification"
                      id="contact_whatsapp_notification"
                    >
                      <option value={-1}>Select</option>
                      {optionValue.length > 0 &&
                        optionValue.map((data) => 
                        <option 
                            key={data.id}
                            value={data?.key}>
                                {data?.value}
                        </option>)}
                    </Field>
                    <ErrorMessage
                      name="contact_whatsapp_notification"
                      component={CFormText}
                      className="text-danger"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="roles" className="col-sm-2 col-form-label">
                    Promotion on Web:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <Field
                      as={CFormSelect}
                      className="form-control"
                      name="promotion_on_web"
                      id="promotion_on_web"
                    >
                      <option value={-1}>Select</option>
                      { optionValue.length > 0 &&
                        optionValue.map((data) => 
                        <option 
                            key={data.id}
                            value={data?.key}>{data?.value}
                        </option>)
                        }
                    </Field>
                    <ErrorMessage
                      name="promotion_on_web"
                      component={CFormText}
                      className="text-danger"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="roles" className="col-sm-2 col-form-label">
                    Promotion on Meta:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <Field
                      as={CFormSelect}
                      className="form-control"
                      name="promotion_on_meta"
                      id="promotion_on_meta"
                    >
                      <option value={-1}>Select</option>
                      { optionValue.length > 0 &&
                        optionValue.map((data) => 
                            <option 
                                key={data?.id}
                                value={data?.key}>{data?.value}
                            </option>)
                        }
                    </Field>
                    <ErrorMessage
                      name="promotion_on_meta"
                      component={CFormText}
                      className="text-danger"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="roles" className="col-sm-2 col-form-label">
                    Paid Video Promotion on 8SQFT:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <Field
                      as={CFormSelect}
                      className="form-control"
                      name="paid_promotion_on_sqft"
                      id="paid_promotion_on_sqft"
                    >
                      <option value={-1}>Select</option>
                      { optionValue.length > 0 &&
                        optionValue.map((data) => 
                            <option 
                                key={data.id}
                                value={data?.key}>{data?.value}
                            </option>)
                        }
                    </Field>
                    <ErrorMessage
                      name="paid_promotion_on_sqft"
                      component={CFormText}
                      className="text-danger"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="roles" className="col-sm-2 col-form-label">
                    Paid Video Promotion:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <Field
                      as={CFormSelect}
                      className="form-control"
                      name="paid_video_promotion"
                      id="paid_video_promotion"
                    >
                      <option value={-1}>Select</option>
                      { optionValue.length > 0 &&
                        optionValue.map((data) => 
                            <option 
                                key={data.id}
                                value={data?.key}>
                                    {data?.value}
                            </option>)
                        }
                    </Field>
                    <ErrorMessage
                      name="paid_video_promotion"
                      component={CFormText}
                      className="text-danger"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="roles" className="col-sm-2 col-form-label">
                    Independant Sponsored ads:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <Field
                      as={CFormSelect}
                      className="form-control"
                      name="ind_sponsored_ads"
                      id="ind_sponsored_ads"
                    >
                      <option value={-1}>Select</option>
                      { optionValue.length > 0 &&
                        optionValue.map((data) => 
                            <option 
                                key={data.id}
                                value={data?.key}>{data?.value}
                            </option>)
                        }
                    </Field>
                    <ErrorMessage
                      name="ind_sponsored_ads"
                      component={CFormText}
                      className="text-danger"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="roles" className="col-sm-2 col-form-label">
                    Assign Regional Manager:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <Field
                      as={CFormSelect}
                      className="form-control"
                      name="assign_rm"
                      id="assign_rm"
                    >
                      <option value={-1}>Select</option>
                      { optionValue.length > 0 &&
                        optionValue.map((data) => 
                            <option 
                                key={data.id}
                                value={data?.key}>
                                    {data?.value}
                            </option>)
                        }
                    </Field>
                    <ErrorMessage name="assign_rm" component={CFormText} className="text-danger" />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="plan_amount" className="col-sm-2 col-form-label">
                    Agreement:
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <CFormInput
                      type="text"
                      name="agreement"
                      placeholder="Agreement"
                      value={values.agreement}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id="agreement"
                    />
                    <ErrorMessage name="agreement" component={CFormText} className="text-danger" />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="plan_amount" className="col-sm-2 col-form-label">
                    Plan Amount (in Rs):
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <CFormInput
                      type="text"
                      name="plan_amount"
                      placeholder="Plan Amount"
                      value={values.plan_amount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id="plan_amount"
                    />
                    <ErrorMessage
                      name="plan_amount"
                      component={CFormText}
                      className="text-danger"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="plan_discounted_amount" className="col-sm-2 col-form-label">
                    Discounted Amount (in Rs):
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <CFormInput
                      type="text"
                      name="plan_discounted_amount"
                      placeholder="Discount Amount"
                      value={values.plan_discounted_amount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id="plan_discounted_amount"
                    />
                    <ErrorMessage
                      name="plan_discounted_amount"
                      component={CFormText}
                      className="text-danger"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="plan_gst_per" className="col-sm-2 col-form-label">
                    GST (in per %):
                  </CFormLabel>
                  <CCol sm={10} md={6} lg={4}>
                    <CFormInput
                      type="text"
                      name="plan_gst_per"
                      placeholder="GST percentage"
                      value={values.plan_gst_per}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id="plan_gst_per"
                    />
                    <ErrorMessage
                      name="plan_gst_per"
                      component={CFormText}
                      className="text-danger"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol sm={12} md={12} lg={6}>
                    <CButton type="submit" color="primary" className="me-2" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          {' '}
                          <CSpinner size="sm" /> Submit{' '}
                        </>
                      ) : (
                        'Submit'
                      )}
                    </CButton>

                    <CButton type="reset" color="primary" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          {' '}
                          <CSpinner size="sm" /> Reset{' '}
                        </>
                      ) : (
                        'Reset'
                      )}
                    </CButton>
                  </CCol>
                </CRow>
              </Form>
            )}
          </Formik>
        </CCardBody>
      </CCard>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  )
}

export default AddPlans
