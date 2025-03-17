import React from 'react'
// import ListPromotion from './views/pages/promotion/ListPromotion.js'

const Dashboard = React.lazy(() => import('@page/dashboard/Dashboard'))
const login = React.lazy(() => import('@page/login/Login'))

const Gallery = React.lazy(() => import('@page/gallery/ImageGallery'))

const ListAmenities = React.lazy(() => import('./views/amenities/ManageAmenities'))
const AddAmenity = React.lazy(() => import('./views/amenities/AddAmenity'))
const EditAmenity = React.lazy(() => import('./views/amenities/EditAmenity'))

const ListProperties = React.lazy(() => import('@page/properties/ListProperty'))
const Addproperties = React.lazy(() => import('@page/properties/AddProperty'))
const Editproperties = React.lazy(() => import('@page/properties/EditProperty'))
const Viewproperties = React.lazy(() => import('@page/properties/ViewPropertyDetails'))

const ListPropertyEnquiry = React.lazy(() => import('@page/enquiry/ListPropertyEnquiry'))

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
const ListPromotion = React.lazy(() => import('@page/promotion/ListPromotion'))
const AddPromtion = React.lazy(() => import('@page/promotion/AddPromtion'))
 
const ListMarketing = React.lazy(() => import('@page/marketing/ListMarketing'))
const AddMarketing = React.lazy(() => import('@page/marketing/AddMarketing'))
const ViewMarketing = React.lazy(() => import('@page/marketing/ViewMarketing'))
const AddMarketingTemp = React.lazy(() => import('@page/marketing/AddMarketingTemp'))

const Page404 = React.lazy(() => import('@page/page404/page404'))
const PageNotAuthorize = React.lazy(() => import('@page/page404/PageNotAuthorize'))

const routes = [
  { path: '/', exact: true, name: 'login', element: login, allowedRole: ['SUPER ADMIN', 'SUB ADMIN', "EXECUTIVE", "AREA HEAD LIST", "AREA HEAD SITE"] },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard , allowedRole: ['SUPER ADMIN', 'SUB ADMIN', "EXECUTIVE", "AREA HEAD LIST", "AREA HEAD SITE"] },
  { path: '/gallery', name: 'Gallery', element: Gallery , allowedRole: ['SUPER ADMIN'] },
  

  { path: '/properties/ameneties', name: 'Amennities', element: ListAmenities },
  { path: '/properties/ameneties/add', name: 'Add Amennities', element: AddAmenity },
  { path: '/properties/ameneties/edit/:id', name: 'Edit Amennities', element: EditAmenity },

  { path: '/properties', name: 'Properties', element: ListProperties, allowedRole: ['SUPER ADMIN', 'SUB ADMIN', "EXECUTIVE"] },
  { path: '/properties/add', name: 'Add Properties', element: Addproperties, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },
  { path: '/properties/edit/:id', name: 'Edit Properties', element: Editproperties, allowedRole: ['SUPER ADMIN', 'SUB ADMIN']  },
  { path: '/properties/view/:id', name: 'View Property', element: Viewproperties, allowedRole: ['SUPER ADMIN', 'SUB ADMIN', "EXECUTIVE"]  },
  
  { path: '/enquiry', name: 'Enquiry', element: ListPropertyEnquiry, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },

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
  
  { path: '/blogs', name: 'Blogs', element: ListBlogs , allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },
  { path: '/blogs/add', name: 'Add Blogs', element: AddBlog, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },
  { path: '/blogs/view/:id', name: 'View Blogs', element: ViewBlogs, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },

  { path: '/category', name: 'Category', element: BlogCategory, allowedRole: ['SUPER ADMIN'] },

  { path: '/contact-us', name: 'Contact', element: ListContactUs, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },
  // { path: '/contact-us/view/:id', name: 'View Contact', element: ViewContactUs },

  { path: '/marketing', name: 'Marketing', element: ListMarketing, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },
  { path: '/marketing/add', name: 'Add marketing', element: AddMarketing, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },
  { path: '/marketing/view/:id', name: 'View marketing', element: ViewMarketing, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },
  { path: '/marketing/addmark', name: 'Add marketing', element: AddMarketingTemp, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },

  { path: '/promotion', name: 'Promotion', element: ListPromotion, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },
  { path: '/promotion/add', name: 'Add Promotion', element: AddPromtion, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },

  // { path: '/promotion/edit', name: 'Edit Promotion', element: AddPromtion, allowedRole: ['SUPER ADMIN', 'SUB ADMIN'] },

  { path: '/401', name: '401', element: PageNotAuthorize, allowedRole: ['SUPER ADMIN', 'SUB ADMIN', "EXECUTIVE", "AREA HEAD LIST", "AREA HEAD SITE"] },
  { path: '*', name: 'Not Found', element: Page404, allowedRole : ['SUPER ADMIN', 'SUB ADMIN', "EXECUTIVE", "AREA HEAD LIST", "AREA HEAD SITE"] },
]

export default routes;
