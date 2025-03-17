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

  const handleLogout = async (e) => {
    e.preventDefault()
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
          href=""
          onClick={(e) => {
            e.preventDefault()
            navigate('/profile')
          } }>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem 
          href=""
          onClick={(e) => handleLogout(e)}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>

  )
}

export default AppHeaderDropdown
