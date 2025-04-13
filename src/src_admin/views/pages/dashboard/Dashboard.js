import React, { useEffect, useRef, useState } from 'react'
import { CBadge, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CRow, CToaster } from '@coreui/react'
import { usePushToastHelper } from '@hook/usePushToastHelper'
import { getCountInfo } from '@model/dashboardModel'
import WidgetsCountCard from '../../widgets/WidgetsCountCard'

const Dashboard = () => {

  const { toasts, pushToastsMessage } = usePushToastHelper()
  const toaster = useRef();
  const [counts, setCounts ] = useState({});

  const getCounts = async () => {
    try {
      const result = await getCountInfo();
      setCounts(() => ({
          userCounts : result.data.total_users,
          propertyCounts : result.data.total_property,
          userCountByMonth : result.data.userCountByMonth,
          propertyCountByMonth : result.data.propertyCountByMonth
         }));
    }
    catch (error) {
      pushToastsMessage('error', error.message)
    }
  }
  
  useEffect(() => {
    getCounts();

    () => {}
  }, [])
  
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
      
      <WidgetsCountCard
        userRangeCounts={counts?.userCountByMonth}
        propertyRangeCounts={counts?.propertyCountByMonth}
        userCount={counts?.userCounts}
        propertyCount={counts?.propertyCounts} />

      <CToaster ref={toaster} push={toasts} placement="top-end" />
    </>
  )
}

export default Dashboard
