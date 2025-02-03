import React, { useState, useEffect } from 'react'
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
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

const ManageAmenities = () => {
  const [amenities, setAmenities] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10 // Assuming the API returns 10 items per page

  const navigate = useNavigate()

  // Fetch data from API
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const barrierToken = localStorage.getItem('eightsqfttoken')
        const response = await axios.get(
          `http://localhost:5000/api/v1/admin/property/property_amenties?page=${currentPage}`,
          {
            headers: {
              'x-api-key': 'A8SQFT7767',
              Authorization: `Bearer ${barrierToken}`,
            },
          },
        )
        const { totalCounts, amenties } = response.data.data
        setAmenities(amenties)
        setTotalPages(Math.ceil(totalCounts / itemsPerPage)) // Calculate total pages
      } catch (error) {
        console.error('Error fetching amenities:', error)
      }
    }
    fetchAmenities()
  }, [currentPage])

  // Navigate to Add/Edit Amenities Page
  const handleAdd = () => {
    navigate('/manage-amenities/add')
  }

  const handleEdit = (id) => {
    navigate(`/manage-amenities/edit/${id}`)
  }

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>Amenities Management</strong>
              <CButton color="primary" className="float-end" onClick={handleAdd}>
                Add Amenity
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable bordered hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Image</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {amenities.map((amenity) => (
                    <CTableRow key={amenity.id}>
                      <CTableDataCell>{amenity.id}</CTableDataCell>
                      <CTableDataCell>{amenity.amenity_name}</CTableDataCell>
                      <CTableDataCell>
                        <img
                          src={amenity.icon_url}
                          alt={amenity.amenity_name}
                          width="30"
                          height="30"
                          style={{ objectFit: 'cover' }}
                        />
                      </CTableDataCell>
                      <CTableDataCell>{amenity.description}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color={amenity.status === '1' ? 'success' : 'warning'}
                          size="sm"
                          className="me-2"
                        >
                          Status
                        </CButton>
                        <CButton color="info" size="sm" onClick={() => handleEdit(amenity.id)}>
                          Edit
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <CPagination align="end">
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </CPaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <CPaginationItem
                    key={index}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ManageAmenities
