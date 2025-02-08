// import React, { useEffect, useState, useRef } from 'react'
// import { Formik, Form, Field, ErrorMessage } from 'formik'
// import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CContainer,
//   CRow,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CToaster,
//   CAccordion,
//   CAccordionItem,
//   CAccordionHeader,
//   CAccordionBody,
//   CListGroup,
//   CFormInput,
//   CListGroupItem,
//   CFormSelect,
//   CHeader,
//   CFormLabel,
//   CFormText,
//   CImage,
//   CCardImage,
//   CCardTitle,
//   CCardText,
//   CSpinner,
//   CBadge,
// } from '@coreui/react'

// import CIcon from '@coreui/icons-react'
// import { cilTrash, cilInfo, cilBed } from '@coreui/icons'

// import _ from 'lodash'
// import * as dateFns from 'date-fns'

// import { ToastMessage } from '../../../components/ToastMessage'
// import Loader from '../../../utils/Loader'

// import { constant } from '../../../utils/constant'
// import { updateStatusProperty, sendPropertyMails } from '../../../models/propertyModel'

// import { createBlogCategory, getBlogCategory } from '../../../models/blogCategoryModel.js'
// import { initialCategoryValues } from './data.js'
// import { validationCategorySchema } from './categoryValidation.js'

// const mailTypes = [
//   { id: 1, title: 'Porperty Approved' },
//   { id: 2, title: 'Porperty Rejected' },
//   { id: 3, title: 'Porperty Pending' },
//   { id: 4, title: 'Porperty Notification' },
// ]

// const userStatus = [
//   { id: 1, title: constant.USER_STATUS.ACTIVE },
//   { id: 2, title: constant.USER_STATUS.INACTIVE },
//   { id: 3, title: constant.USER_STATUS.PENDING },
//   { id: 4, title: constant.USER_STATUS.BLOCK },
//   { id: 5, title: constant.USER_STATUS.DISABLED },
//   { id: 6, title: constant.USER_STATUS.SUSPENDED },
//   { id: 7, title: constant.USER_STATUS.REJECTED },
// ]

// const BlogCategory = () => {
//   const { id } = useParams() // Get property ID from the URL
//   const navigate = useNavigate()

//   const [blogCategories, setBlogCategories] = useState(null)

//   const [mailOption, setMailOptions] = useState(null)
//   const [statusOption, setStatusOption] = useState({ statusText: '', status: '' })

//   const [loading, setLoading] = useState(false)
//   const [toast, addToast] = useState(0)

//   const toaster = useRef()

//   const handleSubmit = async (values, resetForm, setSubmitting) => {
//     try {
//       const result = await createBlogCategory(values)
//       console.log(result)
//       if (result) {
//         addToast(<ToastMessage type="success" message={result.message} />)
//       }
//       resetForm()
//     } catch (error) {
//       addToast(<ToastMessage type="error" message={error.message} />)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const loadBlogCategoryData = async () => {
//     try {
//       setLoading(true)
//       // const offset = (currentPage);
//       const result = await getBlogCategory(id)
//       console.log('UI:', result.data)
//       setBlogCategories(() => result.data)

//       setLoading(false)
//     } catch (error) {
//       console.log('Error: ', error)
//       const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
//       addToast(toastContent)
//       setLoading(false)
//       setTimeout(() => {
//         navigate(-1)
//       }, 1000)
//     }
//   }

//   useEffect(() => {
//     loadBlogCategoryData()

//     return () => {}
//   }, [id])

//   const changePropertyMailSend = (event) => {
//     const value = event.target.value
//     console.log(event.target)
//     setMailOptions(value)
//   }

//   const changePropertyStatus = (event) => {
//     // console.log(value, name)
//     const { value } = event.target
//     const selectedText = event.target.options[event.target.selectedIndex]
//     console.log(event.target, selectedText.text)
//     setStatusOption({ statusText: selectedText.text, status: value })
//   }

//   console.log(blogCategories?.status, mailOption, statusOption)

//   const handleStatusSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       setLoading(true)
//       const result = await updateStatusProperty(id, statusOption)
//       console.log('UI:', result)
//       if (result) {
//         // loadPropertyData();
//         const toastContent = (
//           <ToastMessage type="success" message={result.data.message} onClick="close" />
//         )
//         addToast(toastContent)
//       }
//       setLoading(false)
//     } catch (error) {
//       console.log('Error: ', error)
//       const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
//       addToast(toastContent)
//       setLoading(false)
//     }
//   }

//   const handleMailSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       setLoading(true)
//       const result = await sendPropertyMails(id, mailOption)
//       console.log('UI:', result.data.property)
//       if (result) {
//         loadPropertyData()
//         const toastContent = (
//           <ToastMessage type="success" message={result.data.message} onClick="close" />
//         )
//         addToast(toastContent)
//       }
//       setLoading(false)
//     } catch (error) {
//       console.log('Error: ', error)
//       const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
//       addToast(toastContent)
//       setLoading(false)
//     }
//   }

//   return (
//     <>
//       {loading && <Loader />}
//       <CContainer>
//         <CRow>
//           <CCol>
//             <CCard className="mb-4">
//               <CCardHeader>
//                 <strong>Category Details</strong>
//                 {/* <CButton color="secondary" className="float-end" onClick={() => navigate(-1)}>
//                   Back
//                 </CButton> */}
//               </CCardHeader>
//               <CCardBody>
//                 <div className="mt-2">
//                   <CRow>
//                     {/* Left Column */}
//                     <CCol className="col-md-4">
//                       <CCard className="mb-4">
//                         <CCardBody>
//                           <Formik
//                             initialValues={initialCategoryValues}
//                             validationSchema={validationCategorySchema}
//                             onSubmit={(values, { setSubmitting, resetForm }) => {
//                               handleSubmit(values, resetForm, setSubmitting)
//                             }}
//                           >
//                             {({ values, handleChange, handleBlur, isSubmitting }) => (
//                               <Form>
//                                 <CRow className="mb-3">
//                                   <CFormLabel htmlFor="mname" className="col-form-label">
//                                     Category Title:{' '}
//                                   </CFormLabel>
//                                   <CCol md={12}>
//                                     <Field
//                                       name="title"
//                                       type="text"
//                                       className="form-control"
//                                       placeholder="Enter title"
//                                       value={values.title}
//                                       onChange={handleChange}
//                                       onBlur={handleBlur}
//                                     />
//                                     <ErrorMessage
//                                       name="title"
//                                       component={CFormText}
//                                       className="text-danger"
//                                     />
//                                   </CCol>
//                                 </CRow>

//                                 <CRow className="mb-3">
//                                   <CFormLabel htmlFor="mname" className="col-form-label">
//                                     Description:{' '}
//                                   </CFormLabel>
//                                   <CCol md={12}>
//                                     <Field
//                                       name="description"
//                                       type="textarea"
//                                       as="textarea"
//                                       className="form-control"
//                                       placeholder="Enter Description"
//                                       value={values.description}
//                                       onChange={handleChange}
//                                       onBlur={handleBlur}
//                                     />
//                                     <ErrorMessage
//                                       name="description"
//                                       component={CFormText}
//                                       className="text-danger"
//                                     />
//                                   </CCol>
//                                 </CRow>

//                                 <CRow className="mb-3">
//                                   <CCol md={12}>
//                                     <CButton
//                                       type="submit"
//                                       color="primary"
//                                       className="me-2"
//                                       disabled={isSubmitting}
//                                     >
//                                       {isSubmitting ? (
//                                         <>
//                                           {' '}
//                                           <CSpinner size="sm" /> Submit{' '}
//                                         </>
//                                       ) : (
//                                         'Submit'
//                                       )}
//                                     </CButton>

//                                     <CButton type="reset" color="primary" disabled={isSubmitting}>
//                                       {isSubmitting ? (
//                                         <>
//                                           {' '}
//                                           <CSpinner size="sm" /> Reset{' '}
//                                         </>
//                                       ) : (
//                                         'Reset'
//                                       )}
//                                     </CButton>
//                                   </CCol>
//                                 </CRow>
//                               </Form>
//                             )}
//                           </Formik>
//                         </CCardBody>
//                       </CCard>
//                     </CCol>

//                     {/* Right Column */}
//                     <CCol className="col-md-8">
//                       <CCard className="mb-4">
//                         <CCardBody>
//                           <h4>Actions</h4>
//                           <strong>Status</strong>
//                           <CFormSelect
//                             name="userStatus"
//                             onChange={(e) => changeUserStatus(e)}
//                             className="mb-2"
//                           >
//                             <option value="-1">Select Status</option>
//                             {userStatus.map((item) => (
//                               <option
//                                 value={item.id}
//                                 selected={blogCategories?.status == item.id ? true : ''}
//                               >
//                                 {item.title}
//                               </option>
//                             ))}
//                           </CFormSelect>
//                           <CButton
//                             disabled={loading}
//                             onClick={(e) => handleStatusSubmit(e)}
//                             color="primary"
//                           >
//                             {loading && <CSpinner size="sm" />}
//                             Change
//                           </CButton>
//                         </CCardBody>
//                       </CCard>
//                     </CCol>
//                   </CRow>
//                 </div>
//               </CCardBody>
//             </CCard>
//           </CCol>
//         </CRow>
//       </CContainer>
//       <CToaster ref={toaster} push={toast} placement="top-end" />
//     </>
//   )
// }

// export default BlogCategory

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

import { createBlogCategory, getBlogCategory } from '../../../models/blogCategoryModel.js'
import Loader from '../../../utils/Loader'

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
                                    <CTableDataCell>{category.parent_cat_id || '-'}</CTableDataCell>
                                    <CTableDataCell>
                                      <CButton
                                        color="danger"
                                        size="sm"
                                        onClick={() => alert('Delete category')}
                                      >
                                        Delete
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
