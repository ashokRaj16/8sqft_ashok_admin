import React, { useEffect, useState, useRef } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CToaster,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CListGroup,
  CFormInput,
  CListGroupItem,
  CFormSelect,
  CHeader,
  CFormLabel,
  CImage,
  CCardImage,
  CCardTitle,
  CCardText,
  CSpinner,
  CBadge
} from '@coreui/react'

import _ from 'lodash'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ToastMessage } from '../../../components/ToastMessage'
import Loader from '../../../utils/Loader'

import { constant } from '../../../utils/constant'
import { updateStatusProperty, sendPropertyMails } from '../../../models/propertyModel'
import { getBlogById } from '../../../models/blogModel.js'

const mailTypes = [
  { id: 1, title: 'Porperty Approved' },
  { id: 2, title: 'Porperty Rejected' },
  { id: 3, title: 'Porperty Pending' },
  { id: 4, title: 'Porperty Notification' },
]

const userStatus = [
  { id: 1, title: constant.GENERAL_STATUS.ACTIVE },
  { id: 2, title: constant.GENERAL_STATUS.INACTIVE },
  { id: 3, title: constant.GENERAL_STATUS.DRAFT }
]

const ViewBlogs = () => {
  const { id } = useParams() // Get property ID from the URL
  const navigate = useNavigate()
  // const [searchParams] = useSearchParams()
  // const isEditParam = searchParams.get('isEdit')

  const [blogDetails, setBlogDetails] = useState(null)

  const [mailOption, setMailOptions] = useState(null)
  const [statusOption, setStatusOption] = useState({ statusText: '', status: '' })

  // const [isEdit, setIsEdit] = useState(isEditParam)
  const [loading, setLoading] = useState(false)
  const [toast, addToast] = useState(0)

  const toaster = useRef()

  // console.log(isEdit, id)

  const loadBlogData = async () => {
    try {
      setLoading(true)
      // const offset = (currentPage);
      const result = await getBlogById(id)
      console.log('UI:', result.data)
      setBlogDetails(() => result.data)
      setStatusOption({ statusText: result.data.status_text, status: result.data.status })

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
    loadBlogData()

    return () => {}
  }, [id])

  const changePropertyMailSend = (event) => {
    const value = event.target.value
    console.log(event.target)
    setMailOptions(value)
  }

  const changePropertyStatus = (event) => {
    // console.log(value, name)
    const { value } = event.target
    const selectedText = event.target.options[event.target.selectedIndex]
    console.log(event.target, selectedText.text)
    setStatusOption({ statusText: selectedText.text, status: value })
  }

  console.log(blogDetails?.status, mailOption, statusOption)

  const handleStatusSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const result = await updateStatusProperty(id, statusOption)
      console.log('UI:', result)
      if (result) {
        // loadPropertyData();
        const toastContent = (
          <ToastMessage type="success" message={result.data.message} onClick="close" />
        )
        addToast(toastContent)
      }
      setLoading(false)
    } catch (error) {
      console.log('Error: ', error)
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
      setLoading(false)
    }
  }

  const handleMailSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const result = await sendPropertyMails(id, mailOption)
      console.log('UI:', result.data.property)
      if (result) {
        loadPropertyData()
        const toastContent = (
          <ToastMessage type="success" message={result.data.message} onClick="close" />
        )
        addToast(toastContent)
      }
      setLoading(false)
    } catch (error) {
      console.log('Error: ', error)
      const toastContent = <ToastMessage type="error" message={error.message} onClick="close" />
      addToast(toastContent)
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loader />}
      {/* <CContainer> */}
        <CRow>
          <CCol>
            <CCard className='mb-4'>
              <CCardHeader>
                <strong>Blog Details</strong>
                <CButton color="secondary" className="float-end" onClick={() => navigate(-1)}>
                  Back
                </CButton>
              </CCardHeader>
              <CCardBody>

                <div className="mt-2">
                  <CRow >
                    {/* Left Column */}
                    {blogDetails && (
                      <CCol sm={12} md={8} lg={8}>
                        <CAccordion activeItemKey={1} className='mb-4'>
                          {/* Property Basic Details */}
                          <CAccordionItem itemKey={1}>
                            <CAccordionHeader>Blog Basic Details</CAccordionHeader>
                            <CAccordionBody>
                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Title:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{blogDetails?.title || '-'}</p>
                                </CCol>
                              </CRow>
                              
                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Short Description:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{blogDetails?.short_description || '-'}</p>
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Description:</p>
                                </CCol>
                                <CCol md={9} className='border rounded'>
                                  <div dangerouslySetInnerHTML={{__html:  blogDetails?.description}} />
                                  {/* <p className="m-2">{ blogDetails?.description || '-'}</p> */}
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Category:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{blogDetails?.category_title || '-'}</p>
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Tags:</p>
                                </CCol>
                                <CCol md={9}>
                                  {/* <p className="m-2">{blogDetails?.tags || '-'}</p> */}
                                  { blogDetails.tags && blogDetails.tags.split(',').map((item, index) => (
                                    <CBadge className='m-1' color="info" shape="rounded-pill">{item}</CBadge>
                                  ))}
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Banner Image:</p>
                                </CCol>
                                <CCol md={9}>
                                  {/* <p className="m-2">{blogDetails?.tags || '-'}</p> */}
                                  {
                                    blogDetails.banner_image ? 
                                    <CImage width={450} height={200} src={blogDetails.banner_image || ''} />
                                    : '-'
                                  }
                                </CCol>
                              </CRow>

                              <CHeader>SEO Info:</CHeader>


                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Meta Title:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{blogDetails?.meta_title || '-'}</p>
                                </CCol>
                              </CRow>
                              
                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Meta Description:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{blogDetails?.meta_description || '-'}</p>
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Meta Keywords:</p>
                                </CCol>
                                <CCol md={9}>
                                  { blogDetails.meta_keyword && blogDetails.meta_keyword.split(',').map((item, index) => (
                                    <CBadge className='m-1' color="warning" shape="rounded-pill">{item}</CBadge>
                                  ))}
                                </CCol>
                              </CRow>

                              <CRow className="align-items-center">
                                <CCol md={3}>
                                  <p className="fw-bold m-2">Meta URL:</p>
                                </CCol>
                                <CCol md={9}>
                                  <p className="m-2">{blogDetails?.canonical_url || '-'}</p>
                                </CCol>
                              </CRow>
                            </CAccordionBody>
                          </CAccordionItem>
                          </CAccordion>
                      </CCol>
                    )}
                    {/* Right Column */}
                    <CCol sm={12} md={12} lg={4}>
                      <CCard className="mb-4">
                        <CCardBody>
                          <h4>Actions</h4>
                          <strong>Status</strong>
                          <CFormSelect
                            name="userStatus"
                            onChange={(e) => changeUserStatus(e)}
                            className="mb-2"
                          >
                            <option value="-1">Select Status</option>
                            {userStatus.map((item) => (
                              <option
                                value={item.id}
                                selected={blogDetails?.status == item.id ? true : ''}
                              >
                                {item.title}
                              </option>
                            ))}
                          </CFormSelect>
                          <CButton
                            disabled={loading}
                            onClick={(e) => handleStatusSubmit(e)}
                            color="primary"
                          >
                            {loading && <CSpinner size="sm" />}
                            Change
                          </CButton>
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
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  )
}

export default ViewBlogs
