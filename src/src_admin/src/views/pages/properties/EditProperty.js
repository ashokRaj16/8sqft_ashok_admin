import React, { useEffect, useState } from 'react'
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
  CProgress,
  CProgressBar,
} from '@coreui/react'
import axios from 'axios'

// eslint-disable-next-line react/prop-types
const EditProperty = ({ propertyId }) => {
  const [activeTab, setActiveTab] = useState(1)
  const [formState, setFormState] = useState({
    gallery: {
      propertyVideo: null,
      societyVideo: null,
      propertyPhotos: [],
      societyPhotos: [],
      propertyFloorPlan: null,
      societyFloorPlan: null,
    },
    propertyDetails: {
      buildingName: '',
      locality: '',
      city: '',
      pincode: '',
      propertyType: '',
      wings: 'No',
      numberOfWings: 0,
      propertyFloor: '',
      totalFloor: '',
      area: '',
      areaUnit: '',
      rent: '',
      rentNegotiable: 'Negotiable',
      deposit: '',
      depositNegotiable: 'Negotiable',
    },
    amenities: {
      furnitureStatus: '',
      parking: '',
    },
    description: '',
    verification: {
      verificationDocs: [],
      idProofs: [],
    },
  })

  // Fetch property details on mount
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`/api/properties/${propertyId}`)
        const propertyData = response.data

        setFormState({
          gallery: {
            propertyVideo: propertyData.gallery.propertyVideo,
            societyVideo: propertyData.gallery.societyVideo,
            propertyPhotos: propertyData.gallery.propertyPhotos,
            societyPhotos: propertyData.gallery.societyPhotos,
            propertyFloorPlan: propertyData.gallery.propertyFloorPlan,
            societyFloorPlan: propertyData.gallery.societyFloorPlan,
          },
          propertyDetails: propertyData.propertyDetails,
          amenities: propertyData.amenities,
          description: propertyData.description,
          verification: propertyData.verification,
        })
      } catch (error) {
        console.error('Failed to fetch property details:', error)
      }
    }

    fetchPropertyDetails()
  }, [propertyId])

  const handleNext = () => {
    if (activeTab < 5) {
      setActiveTab(activeTab + 1)
    }
  }

  const handleBack = () => {
    if (activeTab > 1) {
      setActiveTab(activeTab - 1)
    }
  }

  const handleInputChange = (tabName, fieldName, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [tabName]: {
        ...prevState[tabName],
        [fieldName]: value,
      },
    }))
  }

  const handleFileChange = (tabName, fieldName, files) => {
    const newFiles = Array.from(files) // Convert FileList to array
    setFormState((prevState) => ({
      ...prevState,
      [tabName]: {
        ...prevState[tabName],
        [`new${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`]: newFiles, // Store new files separately
      },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Updated property details:', formState)
    // Send updated property details to the API
    axios
      .put(`/api/properties/${propertyId}`, formState)
      .then((response) => {
        console.log('Property updated successfully:', response.data)
      })
      .catch((error) => {
        console.error('Failed to update property:', error)
      })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <div>
            <h5>Gallery</h5>
            <CRow>
              {/* Property Photos */}
              <CCol md={6}>
                <label className="form-label">Property Photos</label>
                <div className="mb-3">
                  {/* Display existing property photos */}
                  {formState.gallery.propertyPhotos.length > 0 && (
                    <div className="mb-3">
                      <h6>Existing Photos:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {formState.gallery.propertyPhotos.map((photo, index) => (
                          <div key={index} className="position-relative">
                            <img
                              src={photo}
                              alt={`Property Photo ${index + 1}`}
                              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload new property photos */}
                  <CFormInput
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileChange('gallery', 'propertyPhotos', e.target.files)}
                  />
                  {/* Display previews of newly uploaded photos */}
                  {formState.gallery.newPropertyPhotos &&
                    formState.gallery.newPropertyPhotos.length > 0 && (
                      <div className="mt-3">
                        <h6>New Photos Preview:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {Array.from(formState.gallery.newPropertyPhotos).map((file, index) => (
                            <div key={index} className="position-relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`New Property Photo ${index + 1}`}
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </CCol>

              {/* Society Photos */}
              <CCol md={6}>
                <label className="form-label">Society Photos</label>
                <div className="mb-3">
                  {/* Display existing society photos */}
                  {formState.gallery.societyPhotos.length > 0 && (
                    <div className="mb-3">
                      <h6>Existing Photos:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {formState.gallery.societyPhotos.map((photo, index) => (
                          <div key={index} className="position-relative">
                            <img
                              src={photo}
                              alt={`Society Photo ${index + 1}`}
                              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload new society photos */}
                  <CFormInput
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileChange('gallery', 'societyPhotos', e.target.files)}
                  />
                  {/* Display previews of newly uploaded photos */}
                  {formState.gallery.newSocietyPhotos &&
                    formState.gallery.newSocietyPhotos.length > 0 && (
                      <div className="mt-3">
                        <h6>New Photos Preview:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {Array.from(formState.gallery.newSocietyPhotos).map((file, index) => (
                            <div key={index} className="position-relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`New Society Photo ${index + 1}`}
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </CCol>
            </CRow>
          </div>
        )
      case 2:
        return (
          <div>
            <h5>Edit Property</h5>
            <CRow>
              <CCol md={6}>
                <CFormInput
                  label="Building Name"
                  value={formState.propertyDetails.buildingName}
                  onChange={(e) =>
                    handleInputChange('propertyDetails', 'buildingName', e.target.value)
                  }
                />
              </CCol>
              {/* Add other input fields for property details */}
            </CRow>
          </div>
        )
      case 3:
        return (
          <div>
            <h5>Amenities</h5>
            <CRow>
              <CCol md={6}>
                <CFormSelect
                  value={formState.amenities.furnitureStatus}
                  onChange={(e) =>
                    handleInputChange('amenities', 'furnitureStatus', e.target.value)
                  }
                >
                  <option value="">Select Furniture Status</option>
                  <option value="Furnished">Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </CFormSelect>
              </CCol>
              {/* Add other amenities fields */}
            </CRow>
          </div>
        )
      case 4:
        return (
          <div>
            <h5>Description</h5>
            <CFormTextarea
              rows="5"
              value={formState.description}
              onChange={(e) => handleInputChange('description', 'description', e.target.value)}
            />
          </div>
        )
      case 5:
        return (
          <div>
            <h5>Verification</h5>
            <CRow>
              <CCol md={6}>
                <CFormInput
                  type="file"
                  onChange={(e) =>
                    handleFileChange('verification', 'verificationDocs', e.target.files[0])
                  }
                />
                {/* Add similar fields for other verification files */}
              </CCol>
            </CRow>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <CContainer>
      <CCard>
        <CCardHeader>Edit Property</CCardHeader>
        <CCardBody>
          <CProgress className="mb-4">
            <CProgressBar value={(activeTab / 5) * 100}>Step {activeTab} of 5</CProgressBar>
          </CProgress>

          {renderTabContent()}

          <div className="d-flex justify-content-between mt-4">
            <CButton color="secondary" onClick={handleBack} disabled={activeTab === 1}>
              Back
            </CButton>

            {activeTab < 5 && (
              <CButton color="primary" onClick={handleNext}>
                Update & Next
              </CButton>
            )}

            {activeTab === 5 && (
              <CButton color="primary" type="submit" onClick={handleSubmit}>
                Update
              </CButton>
            )}
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default EditProperty
