import React from 'react'
import { CNavGroup, CNavItem} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Amenities',
  //   to: '/manage-amenities',
  // },
  {
    component: CNavGroup,
    name: 'Properties',
    to: '/properties',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [ 
      {
        component: CNavItem,
        name: 'Rent Property',
        // icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        to: '/properties'
      },
      {
        component: CNavItem,
        name: 'Contact View',
        // icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        to: '/contact-view'
      }
    ]
  },
  
  {
    component: CNavGroup,
    name: 'Subscription Plans',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    to : '/subscription',
    items: [ 
      {
        component: CNavItem,
        name: 'Subscriptions',
        to: '/subscription'
      },
      {
        component: CNavItem,
        name: 'Coupons',
        to: '/coupons'
      },
  ]
  },
  {
    component: CNavGroup,
    name: 'Register Plans',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    to : '/plans',
    items: [ 
      {
        component: CNavItem,
        name: 'Plans',
        to: '/plans'
      },
      {
        component: CNavItem,
        name: 'Renewal',
        to: '/renewal'
      }
  ]
    
  },
  {
    component: CNavItem,
    name: 'Contact Us',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    to : '/contact-us',
  },
  {
    component: CNavItem,
    name: 'Blogs',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    to : '/blogs',
  },
    
  {
    component: CNavGroup,
    name: 'Users',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    to : '/',
    items: [ 
      {
        component: CNavItem,
        name: 'Admin',
        to: '/admin'
      },
      {
        component: CNavItem,
        name: 'Member',
        to: '/member'
      }
  ]
  },
  {
    component: CNavItem,
    name: 'Setting',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    to : '/setting',
  },
]

export default _nav
