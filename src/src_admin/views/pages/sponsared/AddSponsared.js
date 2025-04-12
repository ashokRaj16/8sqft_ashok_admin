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
  CImage,
  CCardFooter,
  CFormTextarea,
  CHeader,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'

import { initialSponsaredValues, categoriesOption } from './data'
import { validationSponsaredSchema } from './sponsaredValidation'

import { useDebounce } from '@hook/useDebounce'
import { usePushToastHelper } from '@hook/usePushToastHelper'

import { createPromotionProperty, getPromotionSequenceByCategories } from '@model/promotionModel'
import { getPropertyImagesByPropertyId, getPropertyList } from '@model/propertyModel'
import { getMemberUser } from '@model/usersModel'
import GalleryModal from '@page/Component/GalleryModal'

import { constant } from '@util/constant'
import { ToastMessage } from '@component/ToastMessage'
import SearchSelectMaster from '@page/Component/SearchSelectMaster'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const AddSponsared = () => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [users, setUsers] = useState([])

  const [currentSequence, setCurrentSequence] = useState(1)
  const [toast, addToast] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchUserTerm, setSearchuserTerm] = useState('')

  const [isVisible, setIsVisible] = useState(false)
  const [isBackImageVisible, setIsbackImageVisible] = useState(false)
  const [isSpotGalleryVisible, setIsSpotGalleryVisible] = useState(false)

  const [selectedImages, setSelectedImages] = useState('')
  const [imageGallery, setImageGallery] = useState([])

  const toaster = useRef()
  const quillRef = useRef(null)
  const debounceValue = useDebounce(searchTerm, 500)
  const debounceUserValue = useDebounce(searchUserTerm, 500)
  const { toasts, pushToastsMessage } = usePushToastHelper()

  const [isGalleryAddNew, setIsGalleryAddNew] = useState(true)
  const [gallerySection, setGallerySection] = useState([])

  const EditorOptions = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['table'],
      ],
    },
  }

  const handleSubmit = async (values, resetForm, setSubmitting, validateForm) => {
    try {
      const errors = await validateForm();

      if (Object.keys(errors).length > 0) {
        console.log('Errors found:', errors);
        setSubmitting(false);
        return;
      }
 
      let updatedvalues = {
        ...values,
        categories: categoriesOption.find((item) => item.value === values.categories).title,
      }

      if (
        updatedvalues.categories === constant.SPONSARED_CATEGORY.HOME_BANNER ||
        updatedvalues.categories === constant.SPONSARED_CATEGORY.PROPERTY_LIST_BANNER ||
        updatedvalues.categories === constant.SPONSARED_CATEGORY.PROPERTY_DETAILS_BANNER
      ) {
        updatedvalues.sponsared_gallery_list = null
      }

      if (
        updatedvalues.categories === constant.SPONSARED_CATEGORY.DEDICATED_PAGE ||
        updatedvalues.categories === constant.SPONSARED_CATEGORY.SPOTLIGHT
      ) {
        updatedvalues.sponsared_gallery = null
        updatedvalues.sponsared_gallery_list = null
      }
      const result = await createPromotionProperty(updatedvalues)
      console.log(result)

      if (result) {
        pushToastsMessage('success', result.message)
      }
      resetForm()
      setSearchTerm('')
      setSelectedImages([])
      setCurrentSequence(() => currentSequence + 1)
    } catch (error) {
      pushToastsMessage('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const updateImageHanlder = async (e, values) => {
    try {
      pushToastsMessage('success', 'result.message')

      const updateGalleryInfo = {
        img_url: values.img_url,
        title: values.img_title,
        description: values.img_description,
        file_type: values.file_type,
        file_size: values.file_size,
      }
      setGallerySection((prev) => {
        return prev.push(updateGalleryInfo)
      })
    } catch (error) {
      pushToastsMessage('error', error.message)
    }
  }

  const categoryChangeHandler = async (catVal = null, cattitle, setFieldValue) => {
    try {
      let data = catVal ? catVal : ''

      const resultSequence = await getPromotionSequenceByCategories(data)
      console.log(resultSequence)
      setCurrentSequence(() => resultSequence.data.last_sequence_no)
      setFieldValue('categories', catVal)
      setFieldValue(
        'sequence_no',
        resultSequence.data.last_sequence_no ? resultSequence.data.last_sequence_no + 1 : 1,
      )
    } catch (error) {
      pushToastsMessage('error', error.message)
    }
  }

  const selectPropertyHanlder = async (val, setFieldValue) => {
    try {
      const result = await getPropertyImagesByPropertyId(val.id)
      setFieldValue('property_id', val.id)
      setFieldValue('property_title', val.title)

      console.log(val, 'resss')
      if (result) {
        let updateImageGqallery = result.data?.images.map((item, index) => ({
          id: index,
          img_title: item.img_title,
          img_url: item.property_img_url,
          type: item.file_type,
          size: item.image_size,
        }))
        setImageGallery(() => updateImageGqallery)
      }
    } catch (error) {
      pushToastsMessage('error', error.message)
    }
  }

  const selectUserHanlder = async (val, setFieldValue) => {
    try {
      setFieldValue('user_id', val.id)
      setFieldValue('user_name', val.title)
    } catch (error) {
      pushToastsMessage('error', error.message)
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
        const resultSequence = await getPromotionSequenceByCategories()

        // console.log(result.data, resultSequence.data)
        const newProperties = result.data?.property.map((i) => ({
          id: i.id,
          value: i.id,
          title: i.property_title,
          label: `${[i.id, i.property_title, i.city_name, i.user_mobile]
            .filter(Boolean)
            .join(' | ')}`,
        }))

        setProperties(newProperties)
        setCurrentSequence(() => resultSequence.data.last_sequence_no)
      } catch (error) {
        addToast(<ToastMessage type="error" message={error.message} />)
      }
    })()

    // return () => {}
  }, [debounceValue])

  useEffect(() => {
    ;(async () => {
      try {
        const result = await getMemberUser(
          undefined,
          undefined,
          undefined,
          undefined,
          searchUserTerm,
        )
        // const resultSequence = await getPromotionSequenceByCategories()

        console.log(result.data, 'result user data')
        const newUsers = result.data?.users.map((i) => ({
          id: i.id,
          value: i.id,
          title: `${[i.fname, i.lname, i.company_name].filter(Boolean).join(' ')}`,
          label: `${[i.id, i.fname, i.lname, i.mobile, i.company_name]
            .filter(Boolean)
            .join(' | ')}`,
        }))

        setUsers(newUsers)
        // setCurrentSequence(() => resultSequence.data.last_sequence_no)
      } catch (error) {
        addToast(<ToastMessage type="error" message={error.message} />)
      }
    })()

    // return () => {}
  }, [debounceUserValue])

  console.log(initialSponsaredValues, 'gallery')

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex">
          <strong>Add Sponsared</strong>
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
                enableReinitialize
                initialValues={initialSponsaredValues}
                validationSchema={() => validationSponsaredSchema()}
                onSubmit={(values, { setSubmitting, resetForm, validateForm }) => {
                  handleSubmit(values, resetForm, setSubmitting, validateForm)
                }}
              >
                {({
                  values,
                  errors,
                  handleChange,
                  setFieldValue,
                  handleBlur,
                  isSubmitting,
                  validateForm,
                }) => (
                  useEffect(() => {
                    if (currentSequence) {
                      setFieldValue('sequence_no', currentSequence + 1)
                    }
                  }, [currentSequence, setFieldValue]),
                  console.log(values, errors, 'error log'),
                  console.log('Errors:', errors.sponsared_gallery_list),
                  (
                    <Form>
                      <CRow className="mb-3">
                        <CFormLabel htmlFor="mname" className="col-sm-3 col-form-label">
                          Categories:
                        </CFormLabel>
                        <CCol sm={10} md={6} lg={8}>
                          <Field
                            name="categories"
                            // type="text"
                            as={CFormSelect}
                            className="form-control"
                            placeholder="Categories"
                            value={values.categories || 2}
                            onChange={(e) => {
                              let catVal = e.target.value
                              let catTitle = e.target.options[e.target.selectedIndex].text
                              categoryChangeHandler(catVal, catTitle, setFieldValue)
                            }}
                          >
                            <option value={'-1'}>Select</option>
                            {categoriesOption &&
                              categoriesOption.map((item, i) => (
                                <option key={item.id} value={item.value}>
                                  {item.title}
                                </option>
                              ))}
                          </Field>
                          <ErrorMessage
                            name="categories"
                            component={CFormText}
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>

                      {values.categories !== categoriesOption[4].value && (
                        <CRow className="mb-3">
                          <CFormLabel htmlFor="mname" 
                          className="col-sm-3 col-form-label">
                            Property:
                          </CFormLabel>
                          <CCol sm={10} md={6} lg={8}>
                            <SearchSelectMaster
                              name={'property_id'}
                              placeholder={'Select Property'}
                              searchTerm={searchTerm}
                              setSearchTerm={setSearchTerm}
                              setSelectedValue={(val) => {
                                console.log(val, 'val')
                                selectPropertyHanlder(val, setFieldValue)
                              }}
                              options={properties || []}
                            />
                            <ErrorMessage
                              name="property_id"
                              component={CFormText}
                              className="text-danger"
                            />
                          </CCol>{' '}
                        </CRow>
                      )}

                      {(values.categories === categoriesOption[1].value ||
                        values.categories === categoriesOption[2].value ||
                        values.categories === categoriesOption[3].value) && (
                        <CRow className="mb-3">
                          <CFormLabel htmlFor="mname" className="col-sm-3 col-form-label">
                            Set Dedicated :
                          </CFormLabel>
                          <CCol sm={10} md={6} lg={6}>
                            <Field
                              name={'is_dedicated'}
                              as={CFormCheck}
                              checked={values?.is_dedicated === '1'}
                              onChange={(e) => {
                                setFieldValue('is_dedicated', e.target.checked ? '1' : '0')
                              }}
                            />
                            <ErrorMessage
                              name="is_dedicated"
                              component={CFormText}
                              className="text-danger"
                            />
                          </CCol>{' '}
                        </CRow>
                      )}

                      {values.categories === categoriesOption[4].value && (
                        <CRow className="mb-3">
                          <CFormLabel htmlFor="mname" className="col-sm-3 col-form-label">
                            Builder:
                          </CFormLabel>
                          <CCol sm={10} md={6} lg={8}>
                            <SearchSelectMaster
                              name={'user_id'}
                              placeholder={'Select User'}
                              searchTerm={searchUserTerm}
                              setSearchTerm={setSearchuserTerm}
                              setSelectedValue={(val) => {
                                console.log(val, 'val')
                                selectUserHanlder(val, setFieldValue)
                              }}
                              options={users || []}
                            />
                            <ErrorMessage
                              name="user_id"
                              component={CFormText}
                              className="text-danger"
                            />
                          </CCol>{' '}
                        </CRow>
                      )}

                      {values.categories === categoriesOption[4].value && (
                        <>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor="sponsared_title"
                              className="col-sm-3 col-form-label"
                            >
                              Title:
                            </CFormLabel>
                            <CCol sm={10} md={6} lg={8}>
                              <Field
                                name="sponsared_title"
                                type="text"
                                className="form-control"
                                placeholder="Story Title"
                                value={values.sponsared_title}
                              />
                              <ErrorMessage
                                name="sponsared_title"
                                component={CFormText}
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>

                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor="sponsared_description"
                              className="col-sm-3 col-form-label"
                            >
                              Description:
                            </CFormLabel>
                            <CCol sm={10} md={6} lg={8}>
                              <Field
                                type="textarea"
                                name="sponsared_description"
                                rows={5}
                                as={CFormTextarea}
                                value={values.sponsared_description}
                                placeholder="Enter the description"
                              />
                              <ErrorMessage
                                name="sponsared_description"
                                component={CFormText}
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>

                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor="user_short_description"
                              className="col-sm-3 col-form-label"
                            >
                              Long Description:
                            </CFormLabel>
                            <CCol sm={10} md={6} lg={8}>
                              <ReactQuill
                                ref={quillRef}
                                name="user_short_description"
                                theme="snow"
                                value={values.user_short_description}
                                modules={EditorOptions}
                                onChange={(content) =>
                                  setFieldValue('user_short_description', content)
                                }
                                placeholder="Write the content..."
                              />
                              <ErrorMessage
                                name="user_short_description"
                                component={CFormText}
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>

                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor="total_site_visits"
                              className="col-sm-3 col-form-label"
                            >
                              Total Site Visits:
                            </CFormLabel>
                            <CCol sm={10} md={6} lg={8}>
                              <Field
                                name="total_site_visits"
                                type="text"
                                className="form-control"
                                placeholder="Total Visits"
                                value={values.total_site_visits}
                              />
                              <ErrorMessage
                                name="total_site_visits"
                                component={CFormText}
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>

                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor="total_bookings"
                              className="col-sm-3 col-form-label"
                            >
                              Total Bookings:
                            </CFormLabel>
                            <CCol sm={10} md={6} lg={8}>
                              <Field
                                name="total_bookings"
                                type="text"
                                className="form-control"
                                placeholder="Total Bookings"
                                value={values.total_bookings}
                              />
                              <ErrorMessage
                                name="total_bookings"
                                component={CFormText}
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>

                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor="direct_site_visits"
                              className="col-sm-3 col-form-label"
                            >
                              Total Direct Visits:
                            </CFormLabel>
                            <CCol sm={10} md={6} lg={8}>
                              <Field
                                name="direct_site_visits"
                                type="text"
                                className="form-control"
                                placeholder="Total Direct Visits"
                                value={values.direct_site_visits}
                              />
                              <ErrorMessage
                                name="direct_site_visits"
                                component={CFormText}
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>

                          <CRow className="mb-3">
                            <CFormLabel htmlFor="total_revenue" className="col-sm-3 col-form-label">
                              Total Revenue:
                            </CFormLabel>
                            <CCol sm={10} md={6} lg={8}>
                              <Field
                                name="total_revenue"
                                type="text"
                                className="form-control"
                                placeholder="Total Revenue"
                                value={values.total_revenue}
                              />
                              <ErrorMessage
                                name="total_revenue"
                                component={CFormText}
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>

                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor="background_img_url"
                              className="col-sm-3 col-form-label"
                            >
                              Background Banner:
                            </CFormLabel>
                            <GalleryModal
                              visible={isBackImageVisible}
                              maxSelectedCount={1}
                              setVisible={setIsbackImageVisible}
                              onSelectImages={(file) => {
                                console.log(file);
                                setFieldValue('background_img_url', file[0].url)
                              }}
                            />

                            <CCol sm={10} md={6} lg={8}>
                              <CRow className="g-2">
                                <CCol sm={6} md={6}>
                                  <div
                                    className="position-relative rounded shadow-sm d-flex flex-column align-items-center justify-content-center ass-hover-effect mb-2"
                                    style={{
                                      border: '2px solid #ccc',
                                      borderRadius: '10px',
                                      minHeight: '120px',
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                      setIsbackImageVisible((prev) => !prev)
                                      setFieldValue('background_img_url', '')
                                    }}
                                  >
                                    <p
                                      className="my-2 text-muted text-center"
                                      style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        wordBreak: 'break-word',
                                      }}
                                    >
                                      <span>Upload</span>
                                    </p>
                                    <CImage
                                      src={
                                        values?.background_img_url ||
                                        '/assets/images/image-uploader.png'
                                      }
                                      alt={'file.Key'}
                                      className="img-fluid rounded"
                                      style={{
                                        objectFit: 'contain',
                                        maxHeight: '100px',
                                        width: '90%',
                                        height: '100px',
                                      }}
                                    />
                                    <span>
                                      { 'Background Image' }
                                    </span>
                                  </div>
                                </CCol>
                              </CRow>
                            </CCol>
                          </CRow>

                          {/* Image Gallery Section */}
                          <CRow className="mb-3">
                            <CFormLabel htmlFor="theme_color" className="col-sm-3 col-form-label">
                              Image Section:
                            </CFormLabel>
                            <CCol sm={10} md={6} lg={8}>
                              {isGalleryAddNew && (
                                <div>
                                  <FieldArray name="sponsared_gallery_list">
                                    {({ push, remove, form }) => (
                                      <>
                                        {form.values.sponsared_gallery_list.map((_, index) => (
                                          <div key={index} className="mb-4 p-3 border rounded">
                                            <h5>Gallery Item {index + 1}</h5>

                                            {/* Title Field */}
                                            <CRow className="me-2 mb-2">
                                              <CCol md={10} className="fw-bold">
                                                Title:
                                              </CCol>
                                              <CCol md={10}>
                                                <Field
                                                  name={`sponsared_gallery_list[${index}].img_title`}
                                                  as={CFormInput}
                                                  className="form-control"
                                                  placeholder="Title"
                                                  value={
                                                    values.sponsared_gallery_list[index].img_title
                                                  }
                                                />
                                                <ErrorMessage
                                                  name={`sponsared_gallery_list[${index}].img_title`}
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </CCol>
                                            </CRow>

                                            {/* Description Field */}
                                            <CRow className="mt-2 mb-2">
                                              <CCol md={10} className="fw-bold">
                                                Description:
                                              </CCol>
                                              <CCol md={10}>
                                                <Field
                                                  name={`sponsared_gallery_list[${index}].img_description`}
                                                  as={CFormTextarea}
                                                  className="form-control"
                                                  placeholder="Description"
                                                  rows={5}                                                  
                                                />

                                                <ErrorMessage
                                                  name={`sponsared_gallery_list[${index}].img_description`}
                                                  component={CFormText}
                                                  className="text-danger"
                                                />
                                              </CCol>
                                            </CRow>

                                            {/* Image Field */}
                                            <CRow className="mb-3 mt-2">
                                              <GalleryModal
                                                visible={isSpotGalleryVisible}
                                                setVisible={setIsSpotGalleryVisible}
                                                maxSelectedCount={1}
                                                onSelectImages={(file) => {                                                
                                                  if (file) {
                                                    setFieldValue(
                                                      `sponsared_gallery_list[${index}].img_url`,
                                                      file[0]?.url,
                                                    )
                                                    setFieldValue(
                                                      `sponsared_gallery_list[${index}].file_type`,
                                                      file[0]?.type,
                                                    )
                                                    setFieldValue(
                                                      `sponsared_gallery_list[${index}].file_size`,
                                                      file[0]?.size,
                                                    )
                                                  }
                                                }}
                                              />
                                              <CCol md={10} className="fw-bold">
                                                Image:
                                              </CCol>
                                              <CCol md={10}>
                                                <CButton
                                                  onClick={() =>
                                                    setIsSpotGalleryVisible(true)
                                                  }
                                                  color="primary"
                                                  size="sm"
                                                >
                                                  Select Image
                                                </CButton>

                                                {values.sponsared_gallery_list[index].img_url && (
                                                  <div className="mt-2">
                                                    <img
                                                      src={
                                                        values.sponsared_gallery_list[index].img_url
                                                      }
                                                      alt="Selected"
                                                      width={100}
                                                      height={100}
                                                      style={{
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                      }}
                                                    />
                                                  </div>
                                                )}

                                                <ErrorMessage
                                                  name={`sponsared_gallery_list[${index}].img_url`}
                                                >
                                                  {(msg) => (
                                                    <CFormText className="text-danger">
                                                      {msg}
                                                    </CFormText>
                                                  )}
                                                </ErrorMessage>
                                              </CCol>
                                            </CRow>

                                            {/* Remove Button */}
                                            <CButton
                                              type="button"
                                              color="danger"
                                              size="sm"
                                              className="mt-2"
                                              onClick={() => remove(index)}
                                              disabled={values.sponsared_gallery_list.length === 1}
                                            >
                                              Remove
                                            </CButton>
                                          </div>
                                        ))}

                                        {/* Add New Gallery Item */}
                                        <CButton
                                          type="button"
                                          color="success"
                                          size="sm"                                        
                                          onClick={async () => {
                                            // Validate entire form before adding new block
                                            const errors = await validateForm()
                                            console.log('Errors list:', errors)
                                            if (
                                              errors &&
                                              errors.sponsared_gallery_list &&
                                              errors.sponsared_gallery_list.length > 0
                                            ) {
                                              alert(
                                                'Please fill out the existing block before adding a new one.',
                                              )
                                            } else {
                                              push({
                                                img_title: '',
                                                img_description: '',
                                                img_url: '',
                                              })
                                            }
                                          }}
                                        >
                                          Add More
                                        </CButton>
                                      </>
                                    )}
                                  </FieldArray>
                                </div>
                              )}
                            </CCol>
                          </CRow>

                          <CRow className="mb-3">
                            <CFormLabel htmlFor="theme_color" className="col-sm-3 col-form-label">
                              Pick Theme Code:
                            </CFormLabel>
                            <CCol sm={10} md={6} lg={8}>
                              <div className="d-flex">
                                <Field
                                  name="theme_color"
                                  type="text"
                                  className="form-control mb-2"
                                  placeholder="Enter or choose Code"
                                  value={values.theme_color}
                                ></Field>
                                <Field
                                  type="color"
                                  name="theme_color"
                                  style={{
                                    height: '38px',
                                    width: '50px',
                                    // border: '4px solid #ccc',
                                    border: 'none',
                                    borderRadius: '0px 12px 12px 0px',
                                    backgroundColor: values.theme_color || '#ffffff',
                                    cursor: 'pointer',
                                  }}
                                />
                              </div>
                              <ErrorMessage
                                name="theme_color"
                                component={CFormText}
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>
                        </>
                      )}

                      {/* </CCol> */}
                      {/* </CRow> */}

                      {(values.categories === categoriesOption[1].value ||
                        values.categories === categoriesOption[2].value ||
                        values.categories === categoriesOption[3].value) && (
                        <CRow className="mb-3">
                          <CFormLabel htmlFor="banner_id" className="col-sm-3 col-form-label">
                            Select Banner:
                          </CFormLabel>
                          <GalleryModal
                            visible={isVisible}
                            setVisible={setIsVisible}
                            maxSelectedCount={1}
                            onSelectImages={(file) => {
                              console.log(file, "fileeeeee")
                              let updatedSponsared = {
                                img_url: file[0]?.url || null,
                                title: file[0]?.name,
                                file_type: file[0]?.type || null,
                                file_size: file[0]?.size || null,
                              }

                              setFieldValue('sponsared_gallery', updatedSponsared)
                            }}
                          />
                          <CCol sm={10} md={6} lg={8}>
                            <CRow className="g-2">
                              <CCol sm={6} md={6}>
                                <div
                                  className="position-relative rounded shadow-sm d-flex flex-column align-items-center justify-content-center ass-hover-effect mb-2"
                                  style={{
                                    border: '2px solid #ccc',
                                    borderRadius: '10px',
                                    minHeight: '120px',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => {
                                    setIsVisible((prev) => !prev)
                                    setFieldValue('banner_id', '')
                                  }}
                                >
                                  <p
                                    className="my-2 text-muted text-center"
                                    style={{
                                      fontSize: '0.85rem',
                                      fontWeight: 'bold',
                                      wordBreak: 'break-word',
                                    }}
                                  >
                                    <span>Upload</span>
                                  </p>
                                  <CImage
                                    src={
                                        values.sponsared_gallery?.img_url || '/assets/images/image-uploader.png'
                                    }
                                    alt={'file.Key'}
                                    className="img-fluid rounded"
                                    style={{
                                      objectFit: 'contain',
                                      maxHeight: '100px',
                                      width: '90%',
                                      height: '100px',
                                    }}
                                  />
                                  <span className='text-center'>
                                    { (values.sponsared_gallery?.img_url && values.sponsared_gallery?.img_url.length > 20) ? `${values.sponsared_gallery?.img_url.slice(0,20)}...` : values.sponsared_gallery?.img_url || '-'}                                    
                                  </span>
                                </div>
                              </CCol>
                            </CRow>
                            <CFormLabel>OR Select From list</CFormLabel>
                            <CRow className="g-2">
                              {imageGallery.map((file, index) => (
                                <CCol key={index} sm={6} md={6}>
                                  <div
                                    className="position-relative rounded shadow-sm d-flex flex-column align-items-center justify-content-center ass-hover-effect"
                                    style={{
                                      border: '2px solid #ccc',
                                      borderRadius: '10px',
                                      minHeight: '140px',
                                      cursor: 'pointer',
                                      backgroundColor:
                                        selectedImages[0]?.id === file.id ? '#c2e7ff' : '#f8f9fa',
                                    }}
                                    onClick={() => {
                                      setSelectedImages((prev) => {
                                        let updatedImage = {
                                          ...prev[0],
                                          id: file.id,
                                          name: file.img_title,
                                          url: file.img_url,
                                          orgFile: file.img_url,
                                          type: file?.type,
                                        }

                                        return [updatedImage, ...prev.slice(1)] // Replace first element, keep the rest
                                      })
                                      let updatedSponsared = {
                                        img_url: file.img_url,
                                        title: values.categories,
                                        file_type: file.type,
                                        file_size: file.size,
                                      }

                                      setFieldValue('sponsared_gallery', updatedSponsared)
                                    }}
                                  >
                                    <p
                                      className="my-2 text-muted text-center"
                                      style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        wordBreak: 'break-word',
                                      }}
                                    >
                                      <span>{file?.img_title}</span>
                                    </p>
                                    <CImage
                                      src={file.img_url}
                                      alt={'file.Key'}
                                      className="img-fluid rounded"
                                      style={{
                                        objectFit: 'cover',
                                        maxHeight: '100px',
                                        width: '90%',
                                        height: '80px',
                                      }}
                                    />
                                    <span>{file?.img_title}</span>
                                  </div>
                                </CCol>
                                // <CCol sm={6} md={6} key={index}>
                                //   <CCard style={{ maxHeight: '250px' }}>
                                //     <CCardBody className="text-center">
                                //       <CImage src={category.image} fluid />
                                //     </CCardBody>
                                //     <CCardFooter>
                                //       <p className="">{category.name}</p>
                                //     </CCardFooter>
                                //   </CCard>
                                // </CCol>
                              ))}
                            </CRow>
                            <ErrorMessage
                              name="sponsared_gallery.img_url"
                              component={CFormText}
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      )}

                      <CRow className="mb-3">
                        <CFormLabel htmlFor="sequence_no" className="col-sm-3 col-form-label">
                          Sequence No:{' '}
                        </CFormLabel>
                        <CCol sm={10} md={6} lg={8}>
                          <Field
                            name="sequence_no"
                            type="text"
                            className="form-control"
                            placeholder="Sequence No"
                            disabled
                            value={values.sequence_no}
                          />
                          <ErrorMessage
                            name="sequence_no"
                            component={CFormText}
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>

                      <CRow className="mb-3">
                        <CFormLabel htmlFor="published_date" className="col-sm-3 col-form-label">
                          Published Date:{' '}
                        </CFormLabel>
                        <CCol sm={10} md={6} lg={8}>
                          <Field
                            name="published_date"
                            type="date"
                            className="form-control"
                            placeholder="Published Date"
                            value={values.published_date}
                          />
                          <ErrorMessage
                            name="published_date"
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
          </CRow>
        </CCardBody>
      </CCard>
      <CToaster ref={toaster} push={toasts} placement="top-end" />
    </>
  )
}

export default AddSponsared
