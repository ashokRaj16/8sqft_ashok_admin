import React from 'react'

const Dashboard = React.lazy(() => import('@page/dashboard/Dashboard.js'))
const login = React.lazy(() => import('@page/login/Login.js'))

const ListAmenities = React.lazy(() => import('./views/amenities/ManageAmenities.js'))
const AddAmenity = React.lazy(() => import('./views/amenities/AddAmenity.js'))
const EditAmenity = React.lazy(() => import('./views/amenities/EditAmenity.js'))

const ListProperties = React.lazy(() => import('@page/properties/ListProperty.js'))
const Addproperties = React.lazy(() => import('@page/properties/AddProperty.js'))
const Editproperties = React.lazy(() => import('@page/properties/EditProperty.js'))
const Viewproperties = React.lazy(() => import('@page/properties/ViewPropertyDetails.js'))

const ListAdminUser = React.lazy(() => import('@page/admin/ListAdminUser'))
const EditAdminUser = React.lazy(() => import('@page/admin/EditAdminUser'))
const AddAdminUser = React.lazy(() => import('@page/admin/AddAdminUser'))
const ViewAdminUser = React.lazy(() => import('@page/admin/ViewAdminUser'))

const ListMemberUser = React.lazy(() => import('@page/member/ListMemberUser'))
const AddMemberUser = React.lazy(() => import('@page/member/AddMemberUser'))
const EditMemberUser = React.lazy(() => import('@page/member/EditMemberUser'))
const ViewMemberUser = React.lazy(() => import('@page/member/ViewMemberUser'))

const ListPlans = React.lazy(() => import('@page/plans/ListPlans'))
const AddPlans = React.lazy(() => import('@page/plans/AddPlans'))

const ListRegisterPlan = React.lazy(() => import('@page/registerPlans/ListRegisterPlan'))
const ViewRegisterPlan = React.lazy(() => import('@page/registerPlans/ViewRegisterPlan'))

const ListContactUs = React.lazy(() => import('@page/contact/ListContactUs'))

const Profile = React.lazy(() => import('@page/profile/profile'))
const AddBlog = React.lazy(() => import('@page/blog/addBlogs'))
const ListBlogs = React.lazy(() => import('@page/blog/ListBlogs'))
const ViewBlogs = React.lazy(() => import('@page/blog/ViewBlogs'))

const BlogCategory = React.lazy(() => import('@page/category/BlogCategory'))

const Page404 = React.lazy(() => import('@page/page404/page404'))
const PageNotAuthorize = React.lazy(() => import('@page/page404/PageNotAuthorize'))

const routes = [
  { path: '/', exact: true, name: 'login', element: login },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard , allowedRole: ['SUPER ADMIN', 'SUB ADMIN', "EXECUTIVE", "AREA HEAD LIST", "AREA HEAD SITE"] },
  
  { path: '/properties/ameneties', name: 'Amennities', element: ListAmenities },
  { path: '/properties/ameneties/add', name: 'Add Amennities', element: AddAmenity },
  { path: '/properties/ameneties/edit/:id', name: 'Edit Amennities', element: EditAmenity },

  { path: '/properties', name: 'Properties', element: ListProperties, allowedRole: ['SUPER ADMIN', 'SUB ADMIN', "EXECUTIVE"] },
  { path: '/properties/add', name: 'Add Properties', element: Addproperties, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },
  { path: '/properties/edit/:id', name: 'Edit Properties', element: Editproperties, allowedRole: ['SUPER ADMIN', 'SUB ADMIN']  },
  { path: '/properties/view/:id', name: 'View Property', element: Viewproperties, allowedRole: ['SUPER ADMIN', 'SUB ADMIN', "EXECUTIVE"]  },
  
  { path: '/admin', name: 'Admin', element: ListAdminUser, allowedRole: ['SUPER ADMIN']  },
  { path: '/admin/add', name: 'Add Admin', element: AddAdminUser, allowedRole: ['SUPER ADMIN'] },
  { path: '/admin/edit/:id', name: 'Edit Admin', element: EditAdminUser, allowedRole: ['SUPER ADMIN'] },
  { path: '/admin/view/:id', name: 'Edit Admin', element: ViewAdminUser, allowedRole: ['SUPER ADMIN'] },

  { path: '/member', name: 'Member', element: ListMemberUser, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },
  { path: '/member/add', name: 'Add Member', element: AddMemberUser, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },
  { path: '/member/edit/:id', name: 'Edit Member', element: EditMemberUser, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },
  { path: '/member/view/:id', name: 'View Member', element: ViewMemberUser, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },

  { path: '/subscription', name: 'Subscription', element: ListRegisterPlan, allowedRole: ['SUPER ADMIN'] },
  { path: '/subscription/view/:id', name: 'Add Subscription', element: ViewRegisterPlan, allowedRole: ['SUPER ADMIN'] },

  { path: '/plans', name: 'Register Plans', element: ListPlans, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },
  { path: '/plans/add', name: 'View Register Plans', element: AddPlans, allowedRole: ['SUPER ADMIN'] },

  { path: '/profile', name: 'Profile', element: Profile, allowedRole: ['SUPER ADMIN', 'SUB ADMIN', "EXECUTIVE", "AREA HEAD LIST", "AREA HEAD SITE"] },
  
  { path: '/blogs', name: 'Blogs', element: ListBlogs , allowedRole: ['SUPER ADMIN'] },
  { path: '/blogs/add', name: 'Add Blogs', element: AddBlog, allowedRole: ['SUPER ADMIN'] },
  { path: '/blogs/view/:id', name: 'View Blogs', element: ViewBlogs, allowedRole: ['SUPER ADMIN'] },

  { path: '/category', name: 'Category', element: BlogCategory, allowedRole: ['SUPER ADMIN'] },

  { path: '/contact-us', name: 'Contact', element: ListContactUs, allowedRole: ['SUPER ADMIN'] },
  // { path: '/contact-us/view/:id', name: 'View Contact', element: ViewContactUs },

  { path: '/401', name: '401', element: PageNotAuthorize, allowedRole: ['SUPER ADMIN', 'SUB ADMIN', "EXECUTIVE", "AREA HEAD LIST", "AREA HEAD SITE"] },
  { path: '*', name: 'Not Found', element: Page404, allowedRole : ['SUPER ADMIN', 'SUB ADMIN', "EXECUTIVE", "AREA HEAD LIST", "AREA HEAD SITE"] },
]

export default routes;
