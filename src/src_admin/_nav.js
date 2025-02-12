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
    role : ['SUPER ADMIN', 'SUB ADMIN', "EXECUTIVE"]
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
    role : ['SUPER ADMIN', 'SUB ADMIN', "EXECUTIVE"],
    items: [ 
      {
        component: CNavItem,
        name: 'Property',
        // icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        to: '/properties',
        role : ['SUPER ADMIN', 'SUB ADMIN', "EXECUTIVE"]
      },
      // {
      //   component: CNavItem,
      //   name: 'Contact View',
      //   // icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
      //   to: '/contact-view'
      // }
    ]
  },
  
  {
    component: CNavGroup,
    name: 'Plans',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    to : '/plans',
    role : ['SUPER ADMIN', 'SUB ADMIN'],
    items: [ 
      {
        component: CNavItem,
        name: 'Plans',
        to: '/plans',
        role : ['SUPER ADMIN', 'SUB ADMIN']
      },
      // {
      //   component: CNavItem,
      //   name: 'Coupons',
      //   to: '/coupons'
      // },
  ]
  },
  {
    component: CNavGroup,
    name: 'Subscriptions Plans',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    to : '/subscription',
    role : ['SUPER ADMIN'],
    items: [ 
      {
        component: CNavItem,
        name: 'Subscription',
        to: '/subscription',
        role : ['SUPER ADMIN']
      },
      // {
      //   component: CNavItem,
      //   name: 'Renewal',
      //   to: '/renewal'
      // }
  ]
    
  },
  {
    component: CNavItem,
    name: 'Contact Us',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    to : '/contact-us',
    role : ['SUPER ADMIN']
  },
  // {
  //   component: CNavItem,
  //   name: 'Blogs',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   to : '/blogs',
  // },
    
  {
    component: CNavGroup,
    name: 'Blogs',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    to : '/',
    items: [ 
      {
        component: CNavItem,
        name: 'Category',
        to: '/category',
        role : ['SUPER ADMIN', 'SUB ADMIN']
      },
      {
        component: CNavItem,
        name: 'Blog',
        to: '/blogs',
        role : ['SUPER ADMIN', 'SUB ADMIN']
      }
  ]
  },
  {
    component: CNavGroup,
    name: 'Users',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    role : ['SUPER ADMIN', 'SUB ADMIN'],
    to : '/',
    items: [ 
      {
        component: CNavItem,
        name: 'Admin',
        to: '/admin',
        role : ['SUPER ADMIN']
      },
      {
        component: CNavItem,
        name: 'Member',
        to: '/member',
        role : ['SUPER ADMIN', 'SUB ADMIN']
      }
  ]
  },
  {
    component: CNavItem,
    name: 'Setting',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    to : '/setting',
    role : ['SUPER ADMIN']
  },
]

export default _nav
