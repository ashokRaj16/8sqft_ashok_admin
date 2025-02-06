import React from 'react'
import { CBadge, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CRow } from '@coreui/react'
import WidgetsDropdown from '../../widgets/WidgetsDropdown'

const Dashboard = () => {
  
  return (
    <>
      <CRow className="justify-content-center mb-4">
        <CCol md={12}>
          <CCard className="text-center shadow-sm">
            <CCardBody>
              {/* <CBadge color="success" className="p-3 fs-5"> */}
              <CCardTitle style={{ color: '#fc6600'}}>
                Welcome to the 8sqft Admin Panel!!!
                </CCardTitle>  
              {/* </CBadge> */}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <WidgetsDropdown className="mb-4"  />
    </>
  )
}

export default Dashboard
