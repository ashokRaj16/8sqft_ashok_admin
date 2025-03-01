import React, { useState, useRef, useEffect } from 'react'
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
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CFormTextarea,
} from '@coreui/react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import ExcelJS from 'exceljs'
import { createAdminUser, getAdminRoles } from '@model/usersModel'
import { ToastMessage } from '@component/ToastMessage'
import { getAllCities } from '@model/locationModel'
import { useNavigate } from 'react-router-dom'
import {
  initialPromotionTempValues,
  initialPromotionValues,
  marketingTypeOption,
  promotionTypeOption,
  templateSocialTypeOption,
} from './data'
import { validationMarketingSchema, validationMarketingTempSchema } from './marketingValidation'
import { createMarketing, createMarketingTemp } from '../../../models/marketingModel'
import ExcelUploadComponent from './ExcelUploadComponent'
import GalleryModal from '../Component/GalleryModal'
import SearchSelect from '../Component/SearchSelect'
import { getListedPropertyByMember } from '../../../models/usersModel'
import { getPropertyList } from '../../../models/propertyModel'
import { useDebounce } from '../../../hooks/useDebounce'

const AddMarketingTemp = () => {
  const [properties, setProperties] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, addToast] = useState(0)

  const navigate = useNavigate()
  const toaster = useRef()

  const debounceValue = useDebounce(searchTerm, 500)

  const handleSubmit = async (values, resetForm, setSubmitting) => {
    try {
      const result = await createMarketingTemp(values)
      console.log('result', result.data)
      if (result) {
        addToast(<ToastMessage type="success" message={result.data.message} />)
      }
      setSearchTerm('')
      resetForm()
    } catch (error) {
      addToast(<ToastMessage type="error" message={error.message} />)
    } finally {
      setSubmitting(false)
    }
  }


  useEffect(() => {
    (async () => {
      try {
        const result = await getPropertyList(undefined, undefined, undefined, undefined, searchTerm, undefined, '2')
        const newProperties = result.data?.property.map((i) => ({
          id: i.id,
          value: i.id,
          label: `${ [i.id, i.property_title, i.city_name, i.user_mobile]
            .filter(Boolean)
            .join(' | ') }`
        }))
        
        console.log("result::", result.data, newProperties);

        setProperties(newProperties)
      } catch (error) {
        addToast(<ToastMessage type="error" message={error.message} />)
      }
    })()
    return () => {}
  }, [debounceValue])

  console.log('excel data:::', searchTerm)

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex">
          <strong>Marketing Whatsapp</strong>
          <CCol className="d-flex justify-content-end">
            <CButton onClick={() => navigate(-1)} color="primary">
              Back
            </CButton>
          </CCol>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol lg={6} className="mb-2">
              <Formik
                initialValues={initialPromotionTempValues}
                validationSchema={validationMarketingTempSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  handleSubmit(values, resetForm, setSubmitting)
                }}
              >
                {({ values, handleChange, handleBlur, setFieldValue, errors, isSubmitting }) => (
                  console.log(errors),
                  (
                    <Form>
                      {/* <CForm> */}

                      {/* <CRow className="mb-3">
                        <CFormLabel htmlFor="promotion_name" className="col-sm-3 col-form-label">
                          Title:
                        </CFormLabel>
                        <CCol sm={10} md={6} lg={6}>
                          <Field
                            name="promotion_name"
                            type="text"
                            placeholder="Marketing Name"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="promotion_name"
                            component={CFormText}
                            className="text-danger"
                          />
                        </CCol>
                      </CRow> */}
                     

                      <CRow className="mb-3">
                        <CFormLabel htmlFor="full_name" className="col-sm-3 col-form-label">
                          Full Name:
                        </CFormLabel>
                        <CCol sm={10} md={6} lg={6}>
                          <Field 
                            as={CFormInput} 
                            color="primary" 
                            placeholder="Full Name"
                            name="full_name" />
                          <ErrorMessage name="full_name" component="div" className="text-danger" />
                        </CCol>
                      </CRow>

                      <CRow className="mb-3">
                        <CFormLabel htmlFor="mobile" className="col-sm-3 col-form-label">
                          Mobile:
                        </CFormLabel>
                        <CCol sm={10} md={6} lg={6}>
                          <Field 
                            placeholder="Mobile"
                            as={CFormInput} 
                            color="primary" 
                            className="form-control"
                            name="mobile" />
                          
                          <ErrorMessage 
                            name="mobile" 
                            component={CFormText} 
                            className="text-danger" />
                        </CCol>
                      </CRow>

                    <SearchSelect
                      label={'properties'}
                      name={'property_id'} 
                      placeholder={'Select Property'}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      options={properties || []}/>

                      <CButton
                        type="submit"
                        color="primary"
                        className="me-2"
                        disabled={isSubmitting}
                      >
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
                    </Form>
                  )
                )}
              </Formik>
            </CCol>
            <CCol lg={6}></CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  )
}

export default AddMarketingTemp
