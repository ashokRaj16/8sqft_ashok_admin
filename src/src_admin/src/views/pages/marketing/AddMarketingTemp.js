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
import { useNavigate, Link } from 'react-router-dom'
import {
  initialPromotionLeadValues,
  initialPromotionTempValues,
  templateSocialGupshupOption,
  templateSocialTypeOption,
} from './data'
import { validationMarketingLeadSchema, validationMarketingTempSchema } from './marketingValidation'
import { createMarketingWAImageLead, createMarketingWAMarathiLead, createMarketingWAOwner } from '../../../models/marketingModel'

import ExcelUploadComponent from './ExcelUploadComponent'
import GalleryModal from '../Component/GalleryModal'
import SearchSelect from '../Component/SearchSelect'

import { getPropertyList } from '../../../models/propertyModel'
import { useDebounce } from '../../../hooks/useDebounce'
import { usePushToastHelper } from '../../../hooks/usePushToastHelper'
import { FaDownload } from 'react-icons/fa'
import SearchSelectMaster from '../Component/SearchSelectMaster'
import { constant } from '../../../utils/constant'

const AddMarketingTemp = () => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState(1)

  const [isVisible, setIsVisible] = useState(false)
  const [selectedImages, setSelectedImages] = useState('')
  const [isExcelVisible, setIsExcelVisible] = useState(false)
  const [selectedExcel, setSelectedExcel] = useState('')

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
        }
      }
      console.log(updatedValues, 'valuesssss')
      let result;
      if(updatedValues.template_type === templateSocialGupshupOption[0].value) 
      {
        result = await createMarketingWAImageLead(updatedValues)
      }
      if(updatedValues.template_type === templateSocialGupshupOption[1].value) 
      {
        result = await createMarketingWAMarathiLead(updatedValues)
      }
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
                      validationSchema={validationMarketingLeadSchema(selectedExcel)}
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
                              <CFormLabel
                                htmlFor="template_type"
                                className="col-sm-3 col-form-label"
                              >
                                Template Type:{' '}
                              </CFormLabel>
                              <CCol sm={10} md={6} lg={6}>
                                <Field
                                  name="template_type"
                                  as={CFormSelect}
                                  className="form-control"
                                >
                                  <option value="-1" label="Select Type" />
                                  {templateSocialGupshupOption.map((item, index) => (
                                    <option key={index} value={item.value} label={item.title} />
                                  ))}
                                </Field>
                                <ErrorMessage
                                  name="template_type"
                                  component={CFormText}
                                  className="text-danger"
                                />
                              </CCol>
                            </CRow>

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

                            <CFormLabel>
                              <em>
                                <strong>OR</strong>
                              </em>
                            </CFormLabel>
                            <CRow className="mb-3">
                              <GalleryModal
                                visible={isExcelVisible}
                                setVisible={setIsExcelVisible}
                                maxSelectedCount={1}
                                onSelectImages={(files) => {
                                  if (files && files.length > 0) {
                                    let file = files[0]
                                    // if(file.type !== 'excel'){
                                    //   alert('Please select excel file');
                                    //   return;
                                    // }
                                    setFieldValue('contacts_file', file.url)
                                  }
                                }}
                              />
                              <CFormLabel htmlFor="mobile" className="col-sm-3 col-form-label">
                                Select Excel:
                              </CFormLabel>
                              <CCol sm={10} md={6} lg={6}>
                                <CButton
                                  onClick={() => setIsExcelVisible(true)}
                                  type="button"
                                  color="primary"
                                >
                                  Select
                                </CButton>
                                <ErrorMessage
                                  name="contacts_file"
                                  component={CFormText}
                                  className="text-danger"
                                />
                                <CCol sm={10} md={6} lg={6} className="mt-2">
                                  {/* {selectedExcel.length > 0 && (
                                    <>
                                      <Link to={selectedExcel[0]?.url}>
                                        <FaDownload />
                                      </Link>
                                      <CFormLabel>{selectedExcel[0]?.name}</CFormLabel>
                                    </>
                                  )} */}
                                  {values.contacts_file && (
                                    <>
                                      <Link target="_blank" to={values.contacts_file}>
                                        <FaDownload />
                                      </Link>
                                      <CFormLabel>{values.contacts_file}</CFormLabel>
                                    </>
                                  )}
                                </CCol>
                              </CCol>
                            </CRow>
                            {values.template_type === templateSocialGupshupOption[0].value && (
                              <>
                                <CRow className="mb-3">
                                  <CFormLabel htmlFor="mobile" className="col-sm-3 col-form-label">
                                    Select Proeprty:
                                  </CFormLabel>
                                  <CCol sm={10} md={6} lg={6}>
                                    <SearchSelectMaster
                                      name={'property_id'}
                                      placeholder={'Select Property'}
                                      searchTerm={searchTerm}
                                      setSearchTerm={setSearchTerm}
                                      setSelectedValue={(val) =>
                                        setFieldValue('property_id', val.id)
                                      }
                                      options={properties || []}
                                    />
                                    <ErrorMessage
                                      name="property_id"
                                      component={CFormText}
                                      className="text-danger"
                                    />
                                  </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                  <GalleryModal
                                    visible={isVisible}
                                    setVisible={setIsVisible}
                                    maxSelectedCount={1}
                                    onSelectImages={(files) => {
                                      if (files && files.length > 0) {
                                        let file = files[0]
                                        setFieldValue('banner_image', file.url)
                                      }
                                    }}
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
                                      Select
                                    </CButton>
                                    <ErrorMessage
                                      name="banner_image"
                                      component={CFormText}
                                      className="text-danger"
                                    />
                                    <CCol sm={10} md={6} lg={6} className="mt-2">
                                      {values.banner_image && (
                                        <CImage
                                          src={values.banner_image || ''}
                                          width={200}
                                          height={100}
                                        />
                                      )}
                                    </CCol>
                                  </CCol>
                                </CRow>
                              </>
                            ) }
                            {values.template_type === templateSocialGupshupOption[1].value && (
                              <>
                                <CRow className="mb-3">
                                  <CFormLabel htmlFor="txt_marathi" className="col-sm-3 col-form-label">
                                    Message (In Marathi):
                                  </CFormLabel>
                                  <CCol sm={10} md={6} lg={6}>
                                    <Field as={CFormTextarea} placeholder="Text Marathi" name="txt_marathi" />
                                    <ErrorMessage
                                      name="txt_marathi"
                                      component={CFormText}
                                      className="text-danger"
                                    />
                                  </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                  <CFormLabel htmlFor="msg_mobile" className="col-sm-3 col-form-label">
                                    Mobile No:
                                  </CFormLabel>
                                  <CCol sm={10} md={6} lg={6}>
                                    <Field as={CFormInput} placeholder="Msg Mobile" name="msg_mobile" />
                                    <ErrorMessage
                                      name="msg_mobile"
                                      component={CFormText}
                                      className="text-danger"
                                    />
                                  </CCol>
                                </CRow>
                              </>
                            )}
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
