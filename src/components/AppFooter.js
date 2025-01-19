import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://nexusyard.com" target="_blank" rel="noopener noreferrer">
          Ashok Work
        </a>
        <span className="ms-1">&copy; 2025 ashokLabs.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://nexusyard.com" target="_blank" rel="noopener noreferrer">
          Ashok React Admin
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
