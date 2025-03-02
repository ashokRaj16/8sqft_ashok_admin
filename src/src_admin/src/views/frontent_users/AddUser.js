import React, { useState } from 'react'
import axios from 'axios'

import { useNavigate } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CRow,
} from '@coreui/react'

const AddAmenity = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    amenity_name: '', // Maps to "name"
    icon_image: null, // Holds the uploaded file
    description: '', // Optional
    status: '1', // "1" for active, "2" for inactive
  })

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prepare form data for API
    const data = new FormData()
    data.append('amenity_name', formData.amenity_name)
    data.append('icon_image', formData.icon_image)
    data.append('status', formData.status)

    try {
      console.log(formData)
      const barier_token = localStorage.getItem('eightsqfttoken')
      const response = await axios.post(
        'http://localhost:5000/api/v1/admin/property/property_amenties',
        data,
        {
          headers: {
            'x-api-key': 'A8SQFT7767',
            Authorization: `Bearer ${barier_token}`,
          },
        },
      )
      console.log('Amenity added successfully:', response.data)
      alert('Amenity added successfully!')
      window.location.href = '/manage-amenities'
      // setTimeout(navigate, 0, '/manage-amenities')
      // Clear form or redirect if needed
      setFormData({
        amenity_name: '',
        icon_image: null,
        description: '',
        status: '1',
      })
    } catch (error) {
      console.error('Error adding amenity:', error)
      alert('Failed to add amenity. Please try again.')
    }
  }

  return (
    <CContainer>
      <CRow>
        <CCol md={6} className="offset-md-3">
          <CCard>
            <CCardHeader>
              <strong>Add New Amenity</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                {/* Name Field */}
                <CFormInput
                  type="text"
                  placeholder="Name"
                  value={formData.amenity_name}
                  onChange={(e) => setFormData({ ...formData, amenity_name: e.target.value })}
                  className="mb-3"
                  required
                />

                {/* Image Upload */}
                <CFormInput
                  type="file"
                  onChange={(e) => setFormData({ ...formData, icon_image: e.target.files[0] })}
                  className="mb-3"
                  required
                />

                {/* Description Field */}
                <CFormTextarea
                  rows="3"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mb-3"
                />

                {/* Status Dropdown */}
                <CFormSelect
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mb-3"
                  required
                >
                  <option value="1">Active</option>
                  <option value="2">Inactive</option>
                </CFormSelect>

                {/* Submit Button */}
                <CButton
                  type="submit"
                  style={{ backgroundColor: '#FF8C00', borderColor: '#FF8C00' }}
                >
                  Save
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default AddAmenity
