import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://www.8sqft.com" target="_blank" rel="noopener noreferrer">
          8sqft.com
        </a>
        <span className="ms-1">&copy; 2024</span>
      </div>
      <div className="ms-auto">
        <span className="me-1"></span>
        8sqft Admin v 0.1
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
