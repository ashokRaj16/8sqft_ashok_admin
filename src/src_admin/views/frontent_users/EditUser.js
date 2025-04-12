import React, { useState } from 'react'
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
  CRow,
} from '@coreui/react'

const EditAmenity = () => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    status: 'Active',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Edit Amenity:', formData)
    // Add API call here
  }

  return (
    <CContainer>
      <CRow>
        <CCol md={6} className="offset-md-3">
          <CCard>
            <CCardHeader>
              <strong>Edit Amenity</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <CFormInput
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mb-3"
                />
                <CFormInput
                  type="file"
                  placeholder="Image"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="mb-3"
                />
                <CFormTextarea
                  rows="3"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mb-3"
                />
                <CFormInput
                  type="text"
                  placeholder="Status (Active/Inactive)"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mb-3"
                />
                <CButton
                  type="submit"
                  style={{ backgroundColor: '#FF8C00', borderColor: '#FF8C00' }}
                >
                  Update
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default EditAmenity
