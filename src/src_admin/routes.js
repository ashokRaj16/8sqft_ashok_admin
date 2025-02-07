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

  { path: '/subscription', name: 'Subscription', element: ListRegisterPlan },
  { path: '/subscription/view/:id', name: 'Add Subscription', element: ViewRegisterPlan },

  { path: '/plans', name: 'Register Plans', element: ListPlans },
  { path: '/plans/add', name: 'View Register Plans', element: AddPlans },

  { path: '/profile', name: 'Profile', element: Profile },
  
  { path: '/blogs', name: 'Blogs', element: ListBlogs },
  { path: '/blogs/add', name: 'Add Blogs', element: AddBlog },
  { path: '/blogs/view/:id', name: 'View Blogs', element: ViewBlogs },

  { path: '/category', name: 'Category', element: BlogCategory },

  { path: '/contact-us', name: 'Contact', element: ListContactUs },
  // { path: '/contact-us/view/:id', name: 'View Contact', element: ViewContactUs },

  // { path: '/blog/add', name: 'List Blogs', element: AddBlog },

  { path: '/not-authorize', name: 'Not Authorize', element: PageNotAuthorize },
  { path: '*', name: 'Not Found', element: Page404 },
]

export default routes;
