import React, { useState, useRef, useEffect } from 'react'
import {
  CRow,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CTab,
  CTabPane,
  CTabContent,
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
  CContainer,
  CImage,
} from '@coreui/react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { ToastMessage } from '@component/ToastMessage'
import { useNavigate } from 'react-router-dom'
import { initialPromotionLeadValues, initialPromotionTempValues } from './data'
import { validationMarketingLeadSchema, validationMarketingTempSchema } from './marketingValidation'
import { createMarketingWAImageLead, createMarketingWAOwner } from '../../../models/marketingModel'

import ExcelUploadComponent from './ExcelUploadComponent'
import GalleryModal from '../Component/GalleryModal'
import SearchSelect from '../Component/SearchSelect'

import { getPropertyList } from '../../../models/propertyModel'
import { useDebounce } from '../../../hooks/useDebounce'
import { usePushToastHelper } from '../../../utils/toastHelper'

const AddMarketingTemp = () => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState(0)

  const [isVisible, setIsVisible] = useState(false)
  const [selectedImages, setSelectedImages] = useState('')

  const toaster = useRef()
  const { toasts, pushToastsMessage } = usePushToastHelper()

  const debounceValue = useDebounce(searchTerm, 500)

  const handleSubmit = async (values, resetForm, setSubmitting) => {
    try {
      const result = await createMarketingWAOwner(values)
      console.log('result', result.data)
      if (result) {
        pushToastsMessage('success', result.data.message)
      }
      setSearchTerm('')
      resetForm()
    } catch (error) {
      pushToastsMessage('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePropertyLeadSubmit = async (values, resetForm, setSubmitting) => {
    try {
      let updatedValues = values
      if (selectedImages.length > 0) {
        updatedValues = {
          ...values,
          banner_image: selectedImages[0].url,
        }
      }
      const result = await createMarketingWAImageLead(updatedValues)
      if (result) {
        pushToastsMessage('success', result.data.message)
      }
      setSearchTerm('')
      setSelectedImages('')
      resetForm()
    } catch (error) {
      pushToastsMessage('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const result = await getPropertyList(
          undefined,
          undefined,
          undefined,
          undefined,
          searchTerm,
          undefined,
          '2',
        )
        const newProperties = result.data?.property.map((i) => ({
          id: i.id,
          value: i.id,
          label: `${[i.id, i.property_title, i.city_name, i.user_mobile]
            .filter(Boolean)
            .join(' | ')}`,
        }))

        setProperties(newProperties)
      } catch (error) {
        pushToastsMessage('error', error.message)
      }
    })()
    return () => {}
  }, [debounceValue])

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
          {/* Tabs */}
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
                Lead to Owner
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
                Property Lead
              </CNavLink>
            </CNavItem>
          </CNav>

          <CTabContent>
            {/* Tab 1: Lead to Owner */}
            <CTabPane visible={activeTab === 0}>
              <CContainer className="mt-2">
                <CRow>
                  <CCol lg={6} className="mb-2">
                    <Formik
                      initialValues={initialPromotionTempValues}
                      validationSchema={validationMarketingTempSchema}
                      onSubmit={(values, { setSubmitting, resetForm }) => {
                        handleSubmit(values, resetForm, setSubmitting)
                      }}
                    >
                      {({
                        values,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                        errors,
                        isSubmitting,
                      }) => (
                        <Form>
                          <CRow className="mb-3">
                            <CFormLabel htmlFor="full_name" className="col-sm-3 col-form-label">
                              Full Name:
                            </CFormLabel>
                            <CCol sm={10} md={6} lg={6}>
                              <Field as={CFormInput} placeholder="Full Name" name="full_name" />
                              <ErrorMessage
                                name="full_name"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>

                          <CRow className="mb-3">
                            <CFormLabel htmlFor="mobile" className="col-sm-3 col-form-label">
                              Mobile:
                            </CFormLabel>
                            <CCol sm={10} md={6} lg={6}>
                              <Field as={CFormInput} placeholder="Mobile" name="mobile" />
                              <ErrorMessage
                                name="mobile"
                                component={CFormText}
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>

                          <SearchSelect
                            label={'Properties'}
                            name={'property_id'}
                            placeholder={'Select Property'}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            options={properties || []}
                          />

                          <CButton
                            type="submit"
                            color="primary"
                            className="me-2"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <CSpinner size="sm" /> Submit
                              </>
                            ) : (
                              'Submit'
                            )}
                          </CButton>

                          <CButton type="reset" color="primary" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <CSpinner size="sm" /> Reset
                              </>
                            ) : (
                              'Reset'
                            )}
                          </CButton>
                        </Form>
                      )}
                    </Formik>
                  </CCol>
                </CRow>
              </CContainer>
            </CTabPane>

            {/* Tab 2: Property Lead */}
            <CTabPane visible={activeTab === 1}>
              <CContainer className="mt-2">
                <CRow>
                  <CCol lg={6} className="mb-2">
                    <Formik
                      initialValues={initialPromotionLeadValues}
                      validationSchema={validationMarketingLeadSchema}
                      onSubmit={(values, { setSubmitting, resetForm }) => {
                        handlePropertyLeadSubmit(values, resetForm, setSubmitting)
                      }}
                    >
                      {({
                        values,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                        errors,
                        isSubmitting,
                      }) => (
                        console.log(values, errors, 'val'),
                        (
                          <Form>
                            <CRow className="mb-3">
                              <CFormLabel htmlFor="full_name" className="col-sm-3 col-form-label">
                                Full Name:
                              </CFormLabel>
                              <CCol sm={10} md={6} lg={6}>
                                <Field as={CFormInput} placeholder="Full Name" name="full_name" />
                                <ErrorMessage
                                  name="full_name"
                                  component="div"
                                  className="text-danger"
                                />
                              </CCol>
                            </CRow>

                            <CRow className="mb-3">
                              <CFormLabel htmlFor="mobile" className="col-sm-3 col-form-label">
                                Mobile:
                              </CFormLabel>
                              <CCol sm={10} md={6} lg={6}>
                                <Field as={CFormInput} placeholder="Mobile" name="mobile" />
                                <ErrorMessage
                                  name="mobile"
                                  component={CFormText}
                                  className="text-danger"
                                />
                              </CCol>
                            </CRow>

                            <SearchSelect
                              label={'Properties'}
                              name={'property_id'}
                              placeholder={'Select Property'}
                              searchTerm={searchTerm}
                              setSearchTerm={setSearchTerm}
                              options={properties || []}
                            />

                            <CRow className="mb-3">
                              <GalleryModal
                                visible={isVisible}
                                setVisible={setIsVisible}
                                onSelectImages={setSelectedImages}
                              />
                              <CFormLabel htmlFor="mobile" className="col-sm-3 col-form-label">
                                Image:
                              </CFormLabel>
                              <CCol sm={10} md={6} lg={6}>
                                <CButton
                                  onClick={() => setIsVisible(true)}
                                  type="button"
                                  color="primary"
                                >
                                  {' '}
                                  Select{' '}
                                </CButton>
                                <ErrorMessage
                                  name="banner_image"
                                  component={CFormText}
                                  className="text-danger"
                                />
                              <CCol sm={10} md={6} lg={6} className='mt-2'>
                                { selectedImages.length > 0 &&
                                  <CImage src={selectedImages[0]?.url || ''} width={200} height={100} />
                                }
                              </CCol>
                              </CCol>

                            </CRow>

                            <CButton
                              type="submit"
                              color="primary"
                              className="me-2"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <CSpinner size="sm" /> Submit
                                </>
                              ) : (
                                'Submit'
                              )}
                            </CButton>

                            <CButton type="reset" color="primary" disabled={isSubmitting}>
                              {isSubmitting ? (
                                <>
                                  <CSpinner size="sm" /> Reset
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
                </CRow>
              </CContainer>
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
      <CToaster ref={toaster} push={toasts} placement="top-end" />
    </>
  )
}

export default AddMarketingTemp
