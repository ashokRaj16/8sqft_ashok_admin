import React, { useState, useRef, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CFormSelect,
  CFormCheck,
  CButton,
  CRow,
  CCol,
  CContainer,
  CCardHeader,
  CCardFooter,
  CSpinner,
  CToaster,
  CImage,
} from '@coreui/react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { blogValidationSchema } from './blogValidation'
import { initialBlogValues } from './data'

import { createBlog } from '../../../models/blogModel'
import { getBlogCategory } from '../../../models/blogCategoryModel'

import { ToastMessage } from '../../../components/ToastMessage'
import { useNavigate } from 'react-router-dom'
import { uploadBlogImage } from '../../../models/blogModel'
import { constant } from '../../../utils/constant'

// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

const AddBlog = () => {
  // Validation Schema
  const [toast, addToast] = useState(0)
  const [category, setCategory] = useState([])
  const [ previewImage, setPreviewImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate()
  const toaster = useRef()

  const handleSubmit = async (values, resetForm, setSubmitting) => {
    console.log('Blog Submitted:', values)
    // Perform API call to save the blog
    try {
      const blogValues = {
        banner_image: '',
        banner_video: '',
        ...values,
      }
      const result = await createBlog(blogValues)
      console.log(result)
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

  const handleUploadImage = async (e, setFieldValue, setFieldError) => {
    console.log('Blog Submitted:', e.target)
    setUploading(true)
    try {
      const fileData = e.currentTarget.files[0];
      
      if(fileData) {
        
        const allowedTypes = [ constant.FILE_TYPE.IMAGE_JPG, constant.FILE_TYPE.IMAGE_PNG];
        if(!allowedTypes.includes( fileData.type) ) {
          console.log(fileData, allowedTypes);

          setFieldError("banner_image", "Only PNG and JPEG files are allowed.");
          return;
        }
        // ### call image upload url and set it to given form values.
        setPreviewImage(URL.createObjectURL(fileData));
        
        // const result = await uploadBlogImage(fileData);
        // if(result.success) {
        //   const imgURL = result.data.imgUrl;
        //   setFieldValue(imgURL)
        //   setPreviewImage(URL.createObjectURL(imgURL));
        // }
      }
      else {
        setFieldError("banner_image", 'Please select image.')
      }
    } catch (error) {
      console.log(error);
      // addToast(<ToastMessage type="error" message={error.message} />)
      setFieldError("banner_image", error.message || 'Error uploading image.')
    }
    setUploading(false);
  }

  // get blog categories & tags.
  useEffect(() => {
    ;(async () => {
      try {
        const categoryResult = await getBlogCategory()
        console.log(categoryResult.data.category)
        setCategory(categoryResult.data.category)
      } catch (error) {
        addToast(<ToastMessage type="error" message={error.message} />)
      }
    })()

    return () => {}
  }, [])

  return (
    <>
      {/* <CContainer> */}
      {/* <CRow> */}
      {/* <CCol> */}
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Add Blog</strong>
          <CButton color="secondary" className="float-end" onClick={() => navigate(-1)}>
            Back
          </CButton>
        </CCardHeader>
        <CCardBody>
          <div className="mt-2">
            <Formik
              initialValues={initialBlogValues}
              validationSchema={blogValidationSchema}
              onSubmit={(values, { resetForm, setSubmitting }) => {
                handleSubmit(values, resetForm, setSubmitting)
              }}
            >
              {({ setFieldValue, setFieldError, values, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <CRow className="mb-3">
                    <CCol lg={8} md={8} sm={12} className="mb-2">
                      <CCard>
                        <CCardBody>
                          {/* Blog Details Section */}
                          <CRow className="mb-3">
                            <CCol md="12">
                              <CFormLabel>Blog Title</CFormLabel>
                              <Field
                                name="title"
                                as={CFormInput}
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter the blog title"
                              />
                              <ErrorMessage name="title" component="div" className="text-danger" />
                            </CCol>
                          </CRow>

                          <CRow className="mb-3">
                            <CCol md="12">
                              <CFormLabel>Description</CFormLabel>
                              <Field
                                type="textarea"
                                name="description"
                                rows={5}
                                as={CFormTextarea}
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter the blog description"
                              />
                              <ErrorMessage
                                name="description"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>

                          <CRow className="mb-3">
                            <CCol md="12">
                              <CFormLabel>Short Description</CFormLabel>
                              <Field
                                type="textarea"
                                name="short_description"
                                rows={5}
                                as={CFormTextarea}
                                value={values.short_description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter the blog description"
                              />
                              <ErrorMessage
                                name="short_description"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>

                          {/* upload image seperately and set image url */}
                          <CRow className="mb-3">
                            <CCol md="12">
                              <CFormLabel>Blog Image</CFormLabel>
                              <CFormInput
                                type="file"
                                className='mb-2'
                                name="banner_image"
                                value={values.banner_image}
                                onChange={(e) => {
                                  handleUploadImage(e, setFieldValue, setFieldError)
                                }}
                                // onBlur={handleBlur}
                                // onChange={(event) =>
                                //   setFieldValue('banner_image', event.currentTarget.files[0])
                                // }
                              />
                              {/* Show server uploaded image url. */}
                              { previewImage &&
                                <CImage 
                                width={200}
                                height={100}
                                 className="w-full h-full object-cover"
                                src={previewImage || ''} />
                              }
                              <ErrorMessage
                                name="banner_image"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>

                          <CRow className="mb-3">
                            <CCol md="6">
                              <CFormLabel>Author</CFormLabel>
                              <Field
                                name="author_name"
                                as={CFormInput}
                                value={values.author_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter the author's name"
                              />
                              <ErrorMessage
                                name="author_name"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>

                          <CRow className="mb-3">
                            <CCol md="12">
                              <CFormCheck
                                id="commentEnabled"
                                label="Enable Comments"
                                value={values.comment_enabled}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                // checked={values.commentEnabled}
                                // onChange={() =>
                                //   setFieldValue('commentEnabled', !values.commentEnabled)
                                // }
                              />
                            </CCol>
                          </CRow>

                          {/* SEO Section */}
                          <h4 className="mb-3">SEO Details</h4>
                          <CRow className="mt-4">
                            <CCol md="12">
                              <CFormLabel>Meta Title</CFormLabel>
                              <Field
                                name="meta_title"
                                as={CFormInput}
                                value={values.meta_title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter the meta title"
                              />
                              <ErrorMessage
                                name="meta_title"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>
                          <CRow className="mb-3">
                            <CCol md="12">
                              <CFormLabel>Meta Description</CFormLabel>
                              <Field
                                name="meta_description"
                                as={CFormTextarea}
                                rows={4}
                                value={values.meta_description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Write the meta description (max 160 characters)"
                              />
                              <ErrorMessage
                                name="meta_description"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>
                          <CRow className="mb-3">
                            <CCol md="12">
                              <CFormLabel>Meta Keywords</CFormLabel>
                              <Field
                                name="meta_keyword"
                                as={CFormInput}
                                value={values.meta_keyword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter meta keywords (comma-separated)"
                              />
                              <ErrorMessage
                                name="meta_keyword"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>
                          {/* <CRow className="mb-3">
                                <CCol md="12">
                                  <CFormLabel>Canonical URL</CFormLabel>
                                  <Field
                                    name="canonicalUrl"
                                    as={CFormInput}
                                    placeholder="Enter canonical URL"
                                  />
                                  <ErrorMessage
                                    name="canonicalUrl"
                                    component="div"
                                    className="text-danger"
                                  />
                                </CCol>
                              </CRow> */}

                          {/* </Form>
                          )}
                        </Formik> */}
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol lg={4} md={4} sm={12}>
                      <CCard className="mb-4">
                        <CCardBody>
                          {/* <CRow className="mt-4"> */}
                          <CCol>
                            <CFormLabel>Publish Date</CFormLabel>
                            <Field
                              name="publish_date"
                              type="date"
                              value={values.publish_date}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              as={CFormInput}
                            />
                            <ErrorMessage
                              name="publish_date"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>

                          <CCol>
                            <CFormLabel>Category</CFormLabel>
                            <Field name="category" as={CFormSelect} placeholder="Select category">
                              <option value="-1">Select a category</option>
                              {category.map((item, index) => (
                                <option value={item.id}>{item.title}</option>
                              ))}
                              {/* <option value="Technology">Technology</option>
                                  <option value="Education">Education</option> */}
                            </Field>
                            <ErrorMessage name="category" component="div" className="text-danger" />
                          </CCol>
                          <CCol>
                            <CFormLabel>Tags</CFormLabel>
                            <Field
                              name="tags"
                              as={CFormInput}
                              placeholder="Enter tags (comma-separated)"
                            />
                            <ErrorMessage name="tags" component="div" className="text-danger" />
                          </CCol>
                          {/* </CRow> */}
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol sm={12} lg={8} md={8} className="mb-2">
                      <CCard className="mb-4">
                        <CCardBody>
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
                          {/* </CRow> */}
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                </Form>
              )}
            </Formik>
          </div>
        </CCardBody>
      </CCard>
      {/* </CCol> */}
      {/* </CRow> */}
      {/* </CContainer> */}
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  )
}

export default AddBlog
