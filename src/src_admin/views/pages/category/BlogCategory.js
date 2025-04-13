import React, { useState, useEffect, useRef } from 'react'
import {
  CContainer,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormText,
  CInputGroup,
  CInputGroupText,
  CFormCheck,
  CSpinner,
} from '@coreui/react'
import { Formik, Field, Form, ErrorMessage } from 'formik';

import { initialCategoryValues } from './data';
import { validationCategorySchema } from './categoryValidation';
import { ToastMessage } from '../../../components/ToastMessage';

import { createBlogCategory, deleteBlogCategory, getBlogCategory } from '../../../models/blogCategoryModel.js'
import Loader from '../../../utils/Loader'
import { FaTrash } from 'react-icons/fa';

const BlogCategory = () => {
  const [blogCategories, setBlogCategories] = useState([])
  const [categoriesParent, setCategoriesParent] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, addToast] = useState(0)

  const toaster = useRef()

  const handleSubmit = async (values, resetForm, setSubmitting) => {
    try {
      const result = await createBlogCategory(values)
      console.log(result)
      if (result) {
        loadBlogCategoryData();
        addToast(<ToastMessage type="success" message={result.message} />)
      }
      resetForm()
    } catch (error) {
      addToast(<ToastMessage type="error" message={error.message} />)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const result = await deleteBlogCategory(id)
      if (result) {
        loadBlogCategoryData();
        addToast(<ToastMessage type="success" message={result.message} />)
      }
    } catch (error) {
      addToast(<ToastMessage type="error" message={error.message} />)
    }
  }

  const loadBlogCategoryData = async () => {
    try {
      setLoading(true)
      // const offset = (currentPage);
      const result = await getBlogCategory()
      console.log('UI:', result.data)
      setBlogCategories(() => result.data.category)
      setCategoriesParent(() => result.data.category)

      setLoading(false)
    } catch (error) {
      console.log('Error: ', error)
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
      setLoading(false)
      setTimeout(() => {
        navigate(-1)
      }, 1000)
    }
  }

  useEffect(() => {
    loadBlogCategoryData()

    return () => {}
  }, [])

  return (
    <>
      {loading && <Loader />}
      {/* <CContainer> */}
        <CRow>
          <CCol>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Category Details</strong>
                {/* <CButton color="secondary" className="float-end" onClick={() => navigate(-1)}>
                  Back
                </CButton> */}
              </CCardHeader>
              <CCardBody>
                <div className="mt-2">
                  <CRow>
                    {/* Left Side: Add New Category */}
                    <CCol md="6">
                      <CCard>
                        <CCardBody>
                          <h5>Add New Category</h5>
                          <Formik
                            initialValues={initialCategoryValues}
                            validationSchema={validationCategorySchema}
                            onSubmit={(values, { resetForm, setSubmitting }) => {
                              handleSubmit(values, resetForm, setSubmitting)
                            }}
                          >
                            {({
                              values,
                              setFieldValue,
                              handleChange,
                              handleBlur,
                              isSubmitting,
                            }) => (
                              <Form>
                                <CRow className="mt-3">
                                  <CCol md="12">
                                    <CFormLabel>Category Title:</CFormLabel>

                                    <Field
                                      name="title"
                                      as={CFormInput}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      placeholder="Enter category name"
                                    />
                                    <ErrorMessage
                                      name="title"
                                      component="div"
                                      className="text-danger"
                                    />
                                  </CCol>
                                </CRow>
                                <CRow className="mt-3">
                                  <CFormLabel htmlFor="mname" className="col-form-label">
                                    Description:{' '}
                                  </CFormLabel>
                                  <CCol md={12}>
                                    <Field
                                      name="description"
                                      type="textarea"
                                      as="textarea"
                                      className="form-control"
                                      placeholder="Enter Description"
                                      value={values.description}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    <ErrorMessage
                                      name="description"
                                      component={CFormText}
                                      className="text-danger"
                                    />
                                  </CCol>
                                </CRow>
                                {/* <CRow className="mt-3">
                                  <CCol md="12">
                                    <CFormInput
                                      id="cat_icon"
                                      type="file"
                                      label="Upload Category Icon"
                                      onChange={(event) =>
                                        setFieldValue('cat_icon', event.currentTarget.files[0])
                                      }
                                    />
                                    <ErrorMessage
                                      name="cat_icon"
                                      component="div"
                                      className="text-danger"
                                    />
                                  </CCol>
                                </CRow> */}

                                <CRow className="mt-3">
                                  <CCol md="12">
                                    <CFormLabel>Parent Category</CFormLabel>
                                    <Field
                                      name="parent_cat_id"
                                      as={CFormSelect}
                                      placeholder="Select Parent Category"
                                    >
                                      <option value="-1" label="Select Category" />
                                      {categoriesParent.length > 0 &&
                                        categoriesParent.map((item, index) => (
                                          <option value={item.id} label={item.title} />
                                        ))}
                                    </Field>
                                  </CCol>
                                </CRow>
                                <div className="mt-3">
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
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </CCardBody>
                      </CCard>
                    </CCol>

                    {/* Right Side: Categories Table with Search */}
                    <CCol md="6">
                      <CCard>
                        <CCardBody>
                          <h5>Category List</h5>

                          {/* Search Bar */}
                          <CInputGroup className="mb-3">
                            <CInputGroupText>Search</CInputGroupText>
                            <CFormInput
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search categories"
                            />
                          </CInputGroup>

                          {/* Categories Table */}
                          <CTable>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell>Id</CTableHeaderCell>
                                <CTableHeaderCell>Title</CTableHeaderCell>
                                <CTableHeaderCell>Description</CTableHeaderCell>
                                <CTableHeaderCell>Parent</CTableHeaderCell>
                                <CTableHeaderCell>Actions</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {blogCategories
                                .filter((category) =>
                                  category.title.toLowerCase().includes(searchTerm.toLowerCase()),
                                )
                                .map((category, index) => (
                                  <CTableRow key={category.id}>
                                    <CTableDataCell>{index + 1}</CTableDataCell>
                                    <CTableDataCell>{category.title}</CTableDataCell>
                                    <CTableDataCell>
                                      {category.description && category.description.length > 15
                                        ? `${category.description.slice(0, 15)} ...`
                                        : category.description || '-'}
                                    </CTableDataCell>
                                    <CTableDataCell>{category.parent_cat_title || '-'}</CTableDataCell>
                                    <CTableDataCell>
                                      <CButton
                                        color="danger"
                                        size="sm"
                                        onClick={ () => handleDelete(category.id) }
                                      >
                                        <FaTrash color='white' />
                                      </CButton>
                                    </CTableDataCell>
                                  </CTableRow>
                                ))}
                            </CTableBody>
                          </CTable>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      {/* </CContainer> */}
    </>
  )
}

export default BlogCategory
