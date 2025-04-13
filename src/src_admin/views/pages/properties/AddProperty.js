import React, { useState } from 'react'
import axios from 'axios';

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormCheck,
  CFormTextarea,
  CFormSelect,
  CRow,
  CProgress,
  CProgressBar,
} from '@coreui/react'


const barrierToken = localStorage.getItem('eightsqfttoken')
// API URL and headers
const API_URL = 'http://localhost:5000/api/v1/admin/property'
const API_HEADERS = {
  'x-api-key': 'A8SQFT7767',
  'Content-Type': 'multipart/form-data',
  'Authorization': `Bearer ${barrierToken}`, // Ensure `barrierToken` is defined or passed as a prop/context
}

const AddProperty = () => {
  const [activeTab, setActiveTab] = useState(1)

  const [formState, setFormState] = useState({
    id : 0,
    user_id: 7,
    step_id: activeTab,
    society_images: null,
    property_images: null,
    property_flooring_plans: null,
    society_flooring_plans: null,
    host_name : 'Windows',
    user_agent : 'Mozzila/Chrome',
    ip_address : '127.0.0.1',
    property_title : '',
    building_name : '',
    on_rent_buy : '',
    property_type : '',
    property_sub_variant : '',
    flat_type : '',
    deposite : 0,
    deposite_is_negotiable : 0 ,
    rent: 0,
    rent_is_nogotiable : 0,
    area : 0,
    area_type : '',
    property_floors : 0,
    total_floors : 0,
    balcony : 0,
    is_wings : 0,
    wings_count : 0,
    bath_rooms : 0,
    bed_rooms : 0,
    property_age : '',
    landmark : '',
    locality : '',
    state_id: 1,
    state_name : '',
    city_id : 1,
    city_name: '',
    pincode : '',
    amenties: [ 
    ],
    property_description: '',
    availability_date : '2024-11-11',
    pan_card : null,
    verification_document : null,
  })

  console.log(formState, activeTab);

  const handleNext = async () => {
    await handleApiCall(activeTab) // Submit data for the current step
    console.log(activeTab);
    if (activeTab < 5) {
      setActiveTab(activeTab + 1)
    }
    setFormState((prevState) => ({ ...prevState, step_id: activeTab + 1}) )
  }

  const handleBack = () => {
    if (activeTab > 1) {
      setActiveTab(activeTab - 1)
    }
  }

  const handleFileChange = (tabName, fieldName, files) => {
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: files || null,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleApiCall(activeTab)
    console.log('Form submitted successfully!', formState)
  }

  const handleApiCall = async (stepId) => {
    const stepData = getStepData(stepId)
    console.log(stepId) // Extract the specific data for this step
    try {
      const formData = new FormData();

      for (const key in formState) {
        const value = formState[key];
        if (value instanceof FileList) {
          Array.from(value).forEach((file) => formData.append(key, file));
        } else if (Array.isArray(value)) {
          // Handle arrays (e.g., amenities)
          formData.append(key, JSON.stringify(value));
        } else {
          console.log(formState['step_id'])
          formData.set('step_id', stepId);
          if( formState['step_id'] === 1 ) {
            if (key === 'id') continue;
            // console.log('1: ',key);
            formData.append( key, value );
          }
          else {
            // console.log('2: ',key);
            formData.append( key, value );
          }
        }
      }
      // formData.set('step_id', stepId);
      for (const [key, value] of formData.entries()) {
        console.log(`Key: ${key}:`, value);
      }
      console.log(API_URL, API_HEADERS);
      const response = await axios.post(
        API_URL,
        formData,
        { headers: API_HEADERS },
      )

      console.log(`Step ${stepId} submitted successfully:`, response.data)

      alert('Success: ' + response.data.message);
      setFormState((prevState) => (
        { ...prevState, id : response.data.data.id }
      ))
      // Handle success (e.g., show a toast notification or move to the next step)
      
    } catch (error) {
      alert('Failed: '+ error);
      console.error(`Error submitting step ${stepId}:`, error.response?.data || error.message)
    }
  }

  const getStepData = (stepId) => {
    switch (stepId) {
      case 1:
        return { ...formState }
      case 2:
        return { ...formState }
      case 3:
        return { ...formState }
      case 4:
        return { ...formState }
      case 5:
        return { ...formState }
      default:
        return {}
    }
  }

  const handleInputChange = (tabName, fieldName, event) => {
    console.log(event.target)
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      setFormState((prevState) => ({
        ...prevState,
        [name]: checked,
      }))
    } else {
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const handlePropertyAmentiesChange = (tabName, fieldName, value, e) => {
    const { name, id } = e.target;
    console.log(e)
    setFormState(prevState => {
      const updatedAmenities = prevState.amenties.map(amenity => {
        if (amenity.amenety_title === name) {
          return { ...amenity, amenety_value: value };
        }
        return amenity;
      });
  
      // If the amenity doesn't exist yet, add it to the list
      if (!updatedAmenities.some(amenity => amenity.amenety_title === name)) {
        updatedAmenities.push({
          property_id: prevState.id,
          amenety_id: id, // Ensure unique ID
          amenety_title: name,
          amenety_value: value,
        });
      }
  
      return { ...prevState, amenties: updatedAmenities };
    });
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <div>
            <h5>Gallery</h5>
            <CRow>
              <CCol md={6}>
                <CFormInput
                  type="file"
                  label="Upload video of property"
                  className="mb-3"
                  accept="video/*"
                  onChange={(e) => handleFileChange('gallery', 'propertyVideo', e.target.files)}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="file"
                  label="Upload video of society"
                  className="mb-3"
                  accept="video/*"
                  onChange={(e) => handleFileChange('gallery', 'societyVideo', e.target.files)}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="file"
                  label="Upload photo of property"
                  className="mb-3"
                  accept="image/*"
                  nam="property_images"
                  multiple
                  onChange={(e) => handleFileChange('gallery', 'property_images', e.target.files)}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="file"
                  label="Upload photo of society"
                  className="mb-3"
                  accept="image/*"
                  name="society_images"
                  multiple
                  onChange={(e) => handleFileChange('gallery', 'society_images', e.target.files)}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="file"
                  label="Upload photo of property flooring plan"
                  className="mb-3"
                  name="property_flooring_plans"
                  accept="image/*"
                  onChange={(e) => handleFileChange('gallery', 'property_flooring_plans', e.target.files)}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="file"
                  label="Upload photo of society flooring plan"
                  className="mb-3"
                  accept="image/*"
                  name="society_flooring_plans"
                  onChange={(e) => handleFileChange('gallery', 'society_flooring_plans', e.target.files)}
                />
              </CCol>
            </CRow>
          </div>
        )
      case 2:
        return (
          <div>
            <h5>Property Details</h5>
            <CRow>
              <CCol md={6}>
                <CFormInput
                  label="Building Name"
                  placeholder="Enter building name"
                  className="mb-3"
                  name="building_name"
                  value={formState.building_name || ''}
                  onChange={(e) =>
                    handleInputChange('propertyDetails', 'building_name', e)
                  }
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Locality"
                  placeholder="Enter locality"
                  className="mb-3"
                  value={formState.locality || ''}
                  name="locality"
                  onChange={(e) =>
                    handleInputChange('propertyDetails', 'locality', e)
                  }
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="City"
                  placeholder="Enter city name"
                  className="mb-3"
                  value={formState.city_name || ''}
                  name="city_name"
                  onChange={(e) =>
                    handleInputChange('propertyDetails', 'city_name', e)
                  }
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Pincode"
                  placeholder="Enter pincode"
                  className="mb-3"
                  value={formState.pincode || ''}
                  name="pincode"
                  onChange={(e) =>
                    handleInputChange('propertyDetails', 'pincode', e)
                  }
                />
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  label="Property Type"
                  className="mb-3"
                  value={formState.property_type || ''}
                  name="property_type"
                  onChange={(e) =>
                    handleInputChange('propertyDetails', 'property_type', e)
                  }
                >
                  <option>Select Type</option>
                  <option value="Shop">Shop</option>
                  <option value="Office">Office</option>
                  <option value="Showroom">Showroom</option>
                  <option value="Warehouse">Warehouse</option>
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  label="Wings"
                  className="mb-3"
                  value={formState.is_wings || ''}
                  name="is_wings"
                  onChange={(e) =>
                    handleInputChange('propertyDetails', 'is_wings', e)
                  }
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <div className="mt-2">
                  <label>Number of Wings</label>
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-outline-secondary me-2"
                      onClick={() =>
                        (formState.wings_count !== 0) ? 
                          setFormState((prevState) => ({ ...prevState, wings_count: prevState.wings_count - 1 } ))
                          : null
                      }
                    >
                      -
                    </button>
                    <CFormInput
                      type="number"
                      placeholder="Number of wings"
                      className="me-2"
                      style={{ width: '80px' }}
                      value={formState.wings_count || 0}
                      name="wings_count"
                      onChange={(e) =>
                        handleInputChange(
                          'propertyDetails',
                          'wings_count',
                          e,
                        )
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setFormState((prevState) => ({ ...prevState, wings_count: prevState.wings_count + 1 } ))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </CCol>
              <CCol md={12}>
                <CFormInput
                  label="Floor"
                  placeholder="Property Floor"
                  className="mb-3 d-inline-block me-3"
                  style={{ width: '30%' }}
                  value={formState.property_floors || ''}
                  name="property_floors"
                  onChange={(e) =>
                    handleInputChange('propertyDetails', 'property_floors', e )
                  }
                />
                <CFormInput
                  placeholder="Total Floor"
                  className="mb-3 d-inline-block"
                  style={{ width: '30%' }}
                  value={formState.total_floors || ''}
                  name="total_floors"
                  onChange={(e) =>
                    handleInputChange('propertyDetails', 'total_floors', e )
                  }
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  label="Area"
                  placeholder="Enter Area"
                  className="mb-3 d-inline-block me-3"
                  style={{ width: '30%' }}
                  value={formState.area || ''}
                  name="area"
                  onChange={(e) =>
                    handleInputChange('propertyDetails', 'area', e )
                  }
                />
                <CFormSelect
                  className="mb-3 d-inline-block"
                  style={{ width: '30%' }}
                  value={formState.area_type || ''}
                  name="area_type"
                  onChange={(e) =>
                    handleInputChange('propertyDetails', 'area_type', e )
                  }
                >
                  <option>Select Unit</option>
                  <option value="Square Meter">Square Meter</option>
                  <option value="Square Feet">Square Feet</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </div>
        )
      case 3: 
      return (
        <div>
          <CRow className="mb-3 align-items-center">
          <CCol xs="2">
            <CFormLabel>Preferred Tenant</CFormLabel>
          </CCol>
          <CCol xs="10">
          <CRow className="justify-content-start">
            <CCol>
              <CFormCheck
                type="checkbox"
                label="Family Only"
                name="preferred_tenant"
                id="1"
                checked={formState.amenties.some(amenity => amenity.amenety_title === 'preferred_tenant' && amenity.amenety_value === 'Family Only')}
                onChange={(e) =>
                  handlePropertyAmentiesChange('amenety', 'preferred_tenant', "Family Only", e)
                }
              />
            </CCol>
            <CCol>
              <CFormCheck
                type="checkbox"
                label="Bachelors Male"
                name="preferred_tenant"
                id="1"
                checked={formState.amenties.some(amenity => amenity.amenety_title === 'preferred_tenant' && amenity.amenety_value === 'Bachelors Male')}
                onChange={(e) =>
                  handlePropertyAmentiesChange('amenety', 'preferred_tenant', "Bachelors Male", e)
                }
              />
            </CCol>
            <CCol>
              <CFormCheck
                type="checkbox"
                label="Bachelors Female"
                name="preferred_tenant"
                id="1"
                checked={formState.amenties.some(amenity => amenity.amenety_title === 'preferred_tenant' && amenity.amenety_value === 'Bachelors Female')}
                onChange={(e) =>
                  handlePropertyAmentiesChange('amenety', 'preferred_tenant', "Bachelors Female", e)
                }
              />
            </CCol>
            <CCol>
              <CFormCheck
                type="checkbox"
                label="Family / Bachelors Both"
                name="preferred_tenant"
                id="1"
                checked={formState.amenties.some(amenity => amenity.amenety_title === 'preferred_tenant' && amenity.amenety_value === 'Family / Bachelors Both')}
                onChange={(e) =>
                  handlePropertyAmentiesChange('amenety', 'preferred_tenant', "Family / Bachelors Both", e)
                }
              />
            </CCol>
            </CRow>
          </CCol>
        </CRow>
        <CRow className="mb-3 align-items-center">
          <CCol xs="2">
            <CFormLabel>Furnishing Status</CFormLabel>
          </CCol>
          <CCol xs="10">
            <CRow>
            <CCol>
              <CFormCheck
                type="checkbox"
                label="Furnished"
                name="furnishing_status"
                id="2"
                checked={formState.amenties.some(amenity => amenity.amenety_title === 'furnishing_status' && amenity.amenety_value === 'Furnished')}
                onChange={(e) =>
                  handlePropertyAmentiesChange('amenety', 'furnishing_status', "Furnished", e)
                }
              />
            </CCol>
            <CCol>
              <CFormCheck
                type="checkbox"
                label="Unfurnished"
                name="furnishing_status"
                id="2"
                checked={formState.amenties.some(amenity => amenity.amenety_title === 'furnishing_status' && amenity.amenety_value === 'Unfurnished')}
                onChange={(e) =>
                  handlePropertyAmentiesChange('amenety', 'furnishing_status', "Unfurnished", e)
                }
              />
            </CCol>
            <CCol>
              <CFormCheck
                type="checkbox"
                label="Semi Furnished"
                name="furnishing_status"
                id="2"
                checked={formState.amenties.some(amenity => amenity.amenety_title === 'furnishing_status' && amenity.amenety_value === 'Semi Furnished')}
                onChange={(e) =>
                  handlePropertyAmentiesChange('amenety', 'furnishing_status', "Semi Furnished", e)
                }
              />
            </CCol>
           
            </CRow>
          </CCol>
        </CRow>
        </div>
      )
      case 4: 
      return (
        <div>
          <h5>Description</h5>
          <CFormTextarea
            rows="5"
            label="Property Description"
            placeholder="Enter Property Description"
            className="mb-3"
            name="property_description"
            value={formState.property_description || ''}
            onChange={(e) =>
              handleInputChange('property_description', 'property_description', e)
            }
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
                  label="Upload photo of Adhaar Card"
                  className="mb-3"
                  name="addhar_card"
                  accept="image/*"
                  onChange={(e) => handleFileChange('gallery', 'addhar_card', e.target.files)}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="file"
                  label="Upload photo of Verification document"
                  className="mb-3"
                  accept="image/*"
                  name="verification_document"
                  onChange={(e) => handleFileChange('gallery', 'verification_document', e.target.files)}
                />
              </CCol>
            </CRow>
        </div>
      )
      // Add similar adjustments for other cases
      default:
        return null
    }
  }

  return (
    <CContainer>
      <CCard>
        <CCardHeader>
          <strong>Add New Property</strong>
        </CCardHeader>
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
                Save & Next
              </CButton>
            )}

            {activeTab === 5 && (
              <CButton color="primary" type="submit" onClick={handleSubmit}>
                Submit
              </CButton>
            )}
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default AddProperty
