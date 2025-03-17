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
import { Formik, Field, Form, ErrorMessage, useFormikContext } from 'formik'
import { blogValidationSchema } from './blogValidation'
import { initialBlogValues } from './data'

import { createBlog } from '../../../models/blogModel'
import { getBlogCategory } from '../../../models/blogCategoryModel'

import { ToastMessage } from '../../../components/ToastMessage'
import { useNavigate } from 'react-router-dom'
import { uploadBlogImage } from '../../../models/blogModel'
import { constant } from '../../../utils/constant'
import GalleryModal from '../Component/GalleryModal';

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { usePushToastHelper } from '../../../utils/toastHelper'


const AddBlog = () => {
  const [category, setCategory] = useState([])
  const [previewImage, setPreviewImage] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [savedRange, setSavedRange] = useState({ index: 0, length: 0 });
  const [selectedImages, setSelectedImages] = useState('');
  const [isVisible, setIsVisible] = useState('');
  const { toasts, pushToastsMessage  } = usePushToastHelper();

  const quillRef = useRef(null);
  const navigate = useNavigate()
  const toaster = useRef()

  const handleSubmit = async (values, resetForm, setSubmitting) => {
    console.log('Blog Submitted:', selectedImages[0], values)
    try {
      if(!selectedImages || selectedImages.length <= 0 ) {
        pushToastsMessage('error', 'Atleast one banner image required.')
        return;
      }
      const file = selectedImages[0].orgFile;
      const blogValues = {
        ...values,
        banner_image: selectedImages[0]?.url,
        banner_size: file?.size || '',
        banner_type: file?.type || '',
        banner_video: '',
      }

      // console.log(blogValues, "updated values");
      const result = await createBlog(blogValues)
      console.log(result)
      if (result) {
        pushToastsMessage('success', result.message)
      }
      resetForm()
      setSelectedImages('');
    } catch (error) {
      pushToastsMessage('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  // const handleUploadImage = async (e, setFieldValue, setFieldError) => {
  //   console.log('Blog Submitted:', e.target)
  //   setUploading(true)
  //   try {
  //     const fileData = e.currentTarget.files[0];
      
  //     if(fileData) {
        
  //       const allowedTypes = [ constant.FILE_TYPE.IMAGE_JPG, constant.FILE_TYPE.IMAGE_PNG];
  //       if(!allowedTypes.includes( fileData.type) ) {
  //         console.log(fileData, allowedTypes);

  //         setFieldError("banner_image", "Only PNG and JPEG files are allowed.");
  //         return;
  //       }
  //       // ### call image upload url and set it to given form values.
  //       setPreviewImage(URL.createObjectURL(fileData));
        
  //       // const result = await uploadBlogImage(fileData);
  //       // if(result.success) {
  //       //   const imgURL = result.data.imgUrl;
  //       //   setFieldValue(imgURL)
  //       //   setPreviewImage(URL.createObjectURL(imgURL));
  //       // }
  //     }
  //     else {
  //       setFieldError("banner_image", 'Please select image.')
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setFieldError("banner_image", error.message || 'Error uploading image.')
  //   }
  //   setUploading(false);
  // }

  const EditorOptions = {
    toolbar : {
      container :
     [
      [ { header: [1, 2, 3, 4, 5, false]}],
      ['bold', 'italic', 'underline'],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ['table']
      // ["link", "image"]
     ],
      // handlers : {
      //   image: () => handleImageInsert(),
      // },
    },
  }


  // function handleImageInsert() {
  //   const editor = quillRef.current.getEditor();
  //   const range = editor.getSelection();
  
  //   if (!range) {
  //     alert("Place the cursor where you want the image before inserting.");
  //     return;
  //   }
  
  //   const updateSavedRange = { index: range.index, length: range.length }; // ✅ Save the range safely
  //   // setSavedRange(updateSavedRange);
  
  //   const url = prompt("Enter the image URL:");
  //   if (url) {
  //     insertImage(url, updateSavedRange); // Pass the range directly
  //   }
  // }
  
  
  // function insertImage(url, range) {
  //   const editor = quillRef.current.getEditor();
  //   editor.focus();
  
  //   try {
  //     // const response = await fetch(url);
  //     // const blob = await response.blob();
  
  //     const length = editor.getLength();
  //     const index = Math.min(range.index, length - 1);
  
  //     editor.setSelection(index, range.length);
  //     editor.insertEmbed(index, "image", url);
  //   } catch (error) {
  //     console.error("Error inserting image:", error);
  //     alert("Could not insert the image.");
  //   }
  // }

  // get blog categories & tags.
 
  useEffect(() => {
    (async () => {
      try {
        const categoryResult = await getBlogCategory()
        console.log(categoryResult.data.category)
        setCategory(categoryResult.data.category)
      } catch (error) {
        pushToastsMessage('error', error.message)
      }
    })()

    return () => {}
  }, [])

  // const { setFieldValue } = useFormikContext();
  
  // useEffect(() => {
  //   console.log(selectedImages, "images")
  //   if(selectedImages) {
  //     setFieldValue('banner_image', selectedImages[0].url )
  //   }

  //   return null;
  // }, [selectedImages])

  return (
    <>
      {/* <CContainer> */}
      {/* <CRow> */}
      {/* <CCol> */}
      <GalleryModal 
        visible={isVisible} 
        setVisible={setIsVisible} 
        selectImageCount={1}
        onSelectImages={setSelectedImages} />

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
              enableReinitialize
              initialValues={initialBlogValues}
              validationSchema={blogValidationSchema}
              onSubmit={(values, { resetForm, setSubmitting }) => {
                handleSubmit(values, resetForm, setSubmitting)
              }}
            >
              {({ setFieldValue, setFieldError, values, errors, handleChange, handleBlur, isSubmitting }) => (
                console.log(values, errors, "values"),

                <Form>
                  <CRow className="mb-3">
                    <CCol lg={8} md={8} sm={12} className="mb-2">
                      <CCard>
                        <CCardBody>
                          {/* Blog Details Section */}
                          <CRow className="mb-3">
                            <CCol md="12">
                              <CFormLabel>Title</CFormLabel>
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

                          <CRow className="mb-4">
                            <CCol md="12">
                              <CFormLabel>Description</CFormLabel>
                              {/* <CFormTextarea /> */}
                              
                              <ReactQuill
                                ref={quillRef}
                                name="description"
                                theme="snow"
                                value={values.description}
                                modules={EditorOptions}
                                // onChangeSelection={(range) => {
                                //   if (range) setSavedRange(range); // Save the cursor position
                                // }}
                                onChange={(content) => setFieldValue("description", content)}
                                placeholder="Write the blog content..."
                              />
                              <ErrorMessage name="description" component="div" className="text-danger" />
                            </CCol>
                          </CRow>


                          {/* <CRow className="mb-3">
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
                          </CRow> */}

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
                              <CButton 
                                onClick={ () => setIsVisible(true)}
                                className='btn btn-info mb-2'
                                color='white'
                                >
                                Select Banner
                              </CButton>
                              </CCol>

                              {/* Show server uploaded image url. */}
                              <CCol md="12">
                              { 
                              (selectedImages && selectedImages.length > 0) &&
                                <CImage 
                                  width={200}
                                  height={100}
                                  className="w-full h-full object-cover"
                                  src={ selectedImages[0]?.url || ''}
                                 />
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
                              <CFormLabel>Youtube Url</CFormLabel>
                              <Field
                                name="youtube_url"
                                as={CFormInput}
                                value={values.youtube_url}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter the youtube video link"
                              />
                              <ErrorMessage
                                name="youtube_url"
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
                                id="comment_enabled"
                                label="Enable Comments"
                                checked={values.comment_enabled === '1' }
                                onChange={() =>
                                  setFieldValue('comment_enabled', values.comment_enabled === '1' ? '0' : '1')
                                }
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
                            <Field 
                              name="cat_id" 
                              as={CFormSelect} 
                              placeholder="Select category">
                              <option value="-1">Select a category</option>
                              {category.map((item, index) => (
                                <option key={item.id} value={item.id}>{item.title}</option>
                              ))}
                            </Field>
                            <ErrorMessage name="cat_id" component="div" className="text-danger" />
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
      <CToaster ref={toaster} push={toasts} placement="top-end" />
    </>
  )
}

export default AddBlog
