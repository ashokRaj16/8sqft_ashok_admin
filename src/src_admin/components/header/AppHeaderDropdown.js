import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CAvatar, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import avatar8 from './../../assets/images/avatars/profile.png'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../store/loginReducer'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {

      dispatch(logoutUser());
      navigate('/login', { replace: true })

    } catch (error) {
      console.error('Logout failed:', error.message)
    }
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem 
        
        onClick={() => navigate('/profile')}>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem onClick={() => handleLogout()}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout Account
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
