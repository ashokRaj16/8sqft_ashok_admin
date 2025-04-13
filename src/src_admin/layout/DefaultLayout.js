import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Check for authentication token in localStorage
    const token = localStorage.getItem('eightsqfttoken')
    if (!token) {
      // Redirect to login if no token is found
      navigate('/login', { replace: true })
    }
  }, [navigate])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
