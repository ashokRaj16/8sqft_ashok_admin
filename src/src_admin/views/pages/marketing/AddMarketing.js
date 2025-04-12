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
  initialPromotionValues,
  marketingTypeOption,
  promotionTypeOption,
  templateSocialTypeOption,
} from './data'
import { validationMarketingSchema } from './marketingValidation'
import { createMarketing } from '../../../models/marketingModel'
import ExcelUploadComponent from './ExcelUploadComponent'
import GalleryModal from '../Component/GalleryModal'

const AddMarketing = () => {
  const [cities, setCities] = useState([])
  const [toast, addToast] = useState(0)
  const [excelData, setExcelData] = useState([])

  const navigate = useNavigate()
  const toaster = useRef()

  const handleSubmit = async (values, resetForm, setSubmitting) => {
    try {
      const result = await createMarketing(values)
      console.log("result",result)
      if (result) {
        addToast(<ToastMessage type="success" message={result.message} />)
      }
      resetForm()
    } catch (error) {
      addToast(<ToastMessage type="error" message={error.message} />)
    } finally {
      setSubmitting(false)
    }
  }

  const uploadExcelSheetNanlder = (e) => {
    console.log(e.target.files)
    let file = e.target.files[0];

    let newFileObject = {
      id: Date.now(), // Unique ID for deletion
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
    }
    console.log(newFileObject, file)
    if(file){
        setExcelData([newFileObject])
    }
    // const reader = new FileReader();
    // reader.readAsArrayBuffer(file);
    // reader.onload = async (event) => {
    //   const buffer = event.target.result;
    //   const workbook = new ExcelJS.Workbook();
    //   await workbook.xlsx.load(buffer);

    //   const worksheet = workbook.worksheets[0]; // First sheet
    //   const rows = [];

    //   worksheet.eachRow((row, rowIndex) => {
    //     if (rowIndex === 1) return; // Skip headers
    //     rows.push(row.values.slice(1)); // Exclude row index (first value)
    //   });

    //   console.log("Parsed Excel Data:", rows);
    //   setExcelData(rows);
    // }
  }

  useEffect(() => {
    // (async () => {
    //   try {
    //     // const result = await getAllCities()
    //     // const rolesResult = await getAdminRoles()
    //     // console.log(result.data, rolesResult)
    //     // setCities(result.data)
    //     // setRoles(() => rolesResult.data)
    //   } catch (error) {
    //     addToast(<ToastMessage type="error" message={error.message} />)
    //   }
    // })()

    // return () => {}
  }, [])

  const [visible, setVisible] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])

  console.log("excel data:::",excelData);

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex">
          <strong>Add Admin</strong>
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
                initialValues={initialPromotionValues}
                validationSchema={validationMarketingSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  handleSubmit(values, resetForm, setSubmitting)
                }}
              >
                {({ values, handleChange, handleBlur, setFieldValue, errors, isSubmitting }) => (
                  console.log(errors),
                  (
                    <Form>
                      {/* <CForm> */}

                      <CRow className="mb-3">
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
                      </CRow>

                      {/* <CRow className="mb-3">
                        <CFormLabel htmlFor="marketing_type" className="col-sm-3 col-form-label">
                          Marketing Type:{' '}
                        </CFormLabel>
                        <CCol sm={10} md={6} lg={6}>
                          <Field name="marketing_type" as={CFormSelect} className="form-control">
                            <option value="-1" label="Select Type" />
                            {marketingTypeOption.map((item, index) => (
                              <option value={item.value} label={item.title} />
                            ))}
                          </Field>
                          <ErrorMessage
                            name="marketing_type"
                            component={CFormText}
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>

                      <CRow className="mb-3">
                        <CFormLabel htmlFor="template_type" className="col-sm-3 col-form-label">
                          Template Type:{' '}
                        </CFormLabel>
                        <CCol sm={10} md={6} lg={6}>
                          <Field name="template_type" as={CFormSelect} className="form-control">
                            <option value="-1" label="Select Type" />
                            {templateSocialTypeOption
                              .filter((i) => i.type === values.marketing_type)
                              .map((item, index) => (
                                <option value={item.value} label={item.title} />
                              ))}
                          </Field>
                          <ErrorMessage
                            name="template_type"
                            component={CFormText}
                            className="text-danger"
                          />
                        </CCol>
                      </CRow> */}

                      {/* { values.template_type !== templateSocialTypeOption[4].value && ( */}
                        <CRow className="mb-3">
                          <CFormLabel htmlFor="promotion_type" className="col-sm-3 col-form-label">
                            Promotion Type:{' '}
                          </CFormLabel>
                          <CCol sm={10} md={6} lg={6}>
                            <Field name="promotion_type" as={CFormSelect} className="form-control">
                              <option value="-1" label="Select Type" />
                              {promotionTypeOption.map((item, index) => (
                                <option value={item.value} label={item.title} />
                              ))}
                            </Field>
                            <ErrorMessage
                              name="promotion_type"
                              component={CFormText}
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      {/* )} */}

                        {/* { values.promotion_type === promotionTypeOption[3].value && (
                        <CRow className="mb-3">
                          <CFormLabel htmlFor="excel_file" className="col-sm-3 col-form-label">
                            Choose Excel :
                          </CFormLabel>
                          <CCol sm={10} md={6} lg={6}>

                            
                                <GalleryModal visible={visible} setVisible={setVisible} onSelectImages={setExcelData} />
                                <Field as={CButton} 
                                  color="primary" 
                                  name="excel_file" 
                                  onClick={() => {
                                    setVisible(!visible)
                                    console.log(excelData)
                                    if (excelData.length > 0) {
                                      setFieldValue('excel_file', excelData[0].url);
                                    }
                                  }
                                 }>
                                  Select File
                                </Field>
                                <CFormLabel>{values.excel_file}</CFormLabel>
                            <ErrorMessage
                              name="excel_file"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      )} */}

{ values.promotion_type === promotionTypeOption[3].value && (
                        <CRow className="mb-3">
                          <CFormLabel htmlFor="excel_file" className="col-sm-3 col-form-label">
                            Enter Number(in comma seperated):
                          </CFormLabel>
                          <CCol sm={10} md={6} lg={6}>
                              
                                <Field as={CFormTextarea} 
                                  color="primary" 
                                  name="excel_file" 
                                 />
                                {/* <CFormLabel>{values.excel_file}</CFormLabel> */}
                            <ErrorMessage
                              name="excel_file"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      )}

                      <CRow className="mb-3">
                        <CFormLabel htmlFor="password" className="col-sm-3 col-form-label">
                          Publish Date:{' '}
                        </CFormLabel>
                        <CCol sm={10} md={6} lg={6}>
                          <Field
                            name="publish_date"
                            type="date"
                            className="form-control"
                            placeholder="Select date"
                          />
                          <ErrorMessage
                            name="publish_date"
                            component={CFormText}
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>

                      <CRow className="mb-3">
                        <CFormLabel htmlFor="property_id" className="col-sm-3 col-form-label">
                          Property :{' '}
                        </CFormLabel>
                        <CCol sm={10} md={6} lg={6}>
                          <Field
                            name="property_id"
                            type="text"
                            className="form-control"
                            placeholder="Select Property"
                          />
                          <ErrorMessage
                            name="property_id"
                            component={CFormText}
                            className="text-danger"
                          />
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
            <CCol lg={6}>
              <h4>Template Preview</h4>
              <hr />
              <pre
                className="bg-light p-3 rounded border border-grey"
                dangerouslySetInnerHTML={{
                  __html: `Discover exclusive properties tailored to your preferences!

Take a closer look at - <strong>${'Test Property</b>'} </strong>

located in the prime area of - ${'Wakad Location'}
Tap the buttons below to explore further or find more option 
| [Visit Website,https://www.8sqft.com/] 
| [Contact, +917030000031]`,
                }}
              ></pre>

              <h4>Contact List</h4>
              <hr />
             <ExcelUploadComponent selectedFiles={excelData}  />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  )
}

export default AddMarketing;
