import React from 'react'
import ViewMemberUser from './views/pages/member/ViewMemberUser.js'
import ViewAdminUser from './views/pages/admin/ViewAdminUser.js'

const Dashboard = React.lazy(() => import('./views/pages/dashboard/Dashboard.js'))
const login = React.lazy(() => import('./views/pages/login/Login.js'))
const ListAmenities = React.lazy(() => import('./views/amenities/ManageAmenities.js'))
const AddAmenity = React.lazy(() => import('./views/amenities/AddAmenity.js'))
const EditAmenity = React.lazy(() => import('./views/amenities/EditAmenity.js'))

const ListProperties = React.lazy(() => import('./views/pages/properties/ListProperty.js'))
const Addproperties = React.lazy(() => import('./views/pages/properties/AddProperty.js'))
const Editproperties = React.lazy(() => import('./views/pages/properties/EditProperty.js'))
const Viewproperties = React.lazy(() => import('./views/pages/properties/ViewPropertyDetails.js'))

const ListAdminUser = React.lazy(() => import('./views/pages/admin/ListAdminUser'))
const EditAdminUser = React.lazy(() => import('./views/pages/admin/EditAdminUser'))
const AddAdminUser = React.lazy(() => import('./views/pages/admin/AddAdminUser'))

const ListMemberUser = React.lazy(() => import('./views/pages/member/ListMemberUser'))
const AddMemberUser = React.lazy(() => import('./views/pages/member/AddMemberUser'))
const EditMemberUser = React.lazy(() => import('./views/pages/member/EditMemberUser'))

const ListSubscriptionPlans = React.lazy(() => import('./views/pages/subscription/ListSubscription'))
const AddSubscriptionPlans = React.lazy(() => import('./views/pages/subscription/AddSubscription'))

const Profile = React.lazy(() => import('./views/pages/profile/profile'))
const AddBlog = React.lazy(() => import('./views/pages/blog/addBlogs'))
const Page404 = React.lazy(() => import('./views/pages/page404/page404'))
const PageNotAuthorize = React.lazy(() => import('./views/pages/page404/PageNotAuthorize'))

const routes = [
  { path: '/', exact: true, name: 'login', element: login },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/properties/ameneties', name: 'Amennities', element: ListAmenities },
  { path: '/properties/ameneties/add', name: 'Add Amennities', element: AddAmenity },
  { path: '/properties/ameneties/edit/:id', name: 'Edit Amennities', element: EditAmenity },

  { path: '/properties', name: 'Properties', element: ListProperties },
  { path: '/properties/add', name: 'Add Properties', element: Addproperties },
  { path: '/properties/edit/:id', name: 'Edit Properties', element: Editproperties },
  { path: '/properties/view/:id', name: 'View Property', element: Viewproperties },
  
  { path: '/admin', name: 'Admin', element: ListAdminUser },
  { path: '/admin/add', name: 'Add Admin', element: AddAdminUser },
  { path: '/admin/edit/:id', name: 'Edit Admin', element: EditAdminUser },
  { path: '/admin/view/:id', name: 'Edit Admin', element: ViewAdminUser },

  { path: '/member', name: 'Member', element: ListMemberUser },
  { path: '/member/add', name: 'Add Member', element: AddMemberUser },
  { path: '/member/edit/:id', name: 'Edit Member', element: EditMemberUser },
  { path: '/member/view/:id', name: 'View Member', element: ViewMemberUser },

  { path: '/subscription', name: 'Subscription', element: ListSubscriptionPlans },
  { path: '/subscription/add', name: 'Add Subscription', element: AddSubscriptionPlans },
  // { path: '/', name: 'View Subscription', element: EditSubscriptionPlans },

  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/blogs', name: 'Add Blogs', element: AddBlog },
  // { path: '/blog/add', name: 'List Blogs', element: AddBlog },

  { path: '/not-authorize', name: 'Not Authorize', element: PageNotAuthorize },
  { path: '*', name: 'Not Found', element: Page404 },
]

export default routes;
