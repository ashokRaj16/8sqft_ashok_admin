import { constant } from "../../../utils/constant";

export let initialAdminValues = { 
    fname: '',
    mname: '',
    lname: '',
    address: '',
    profile_picture_url: '',
    mobile: '',
    email: '',
    status: '',
    city_id: '',
    city_name: '',
    role_id: '',
    password: '',
    cpassword: ''
}

export const userStatus = [
  { id: 0, title: constant.USER_STATUS.INACTIVE },
  { id: 1, title: constant.USER_STATUS.ACTIVE },
  { id: 2, title: constant.USER_STATUS.PENDING },
  { id: 3, title: constant.USER_STATUS.BLOCK },
  { id: 4, title: constant.USER_STATUS.DISABLED },
  { id: 5, title: constant.USER_STATUS.SUSPENDED },
  { id: 6, title: constant.USER_STATUS.REJECTED },
]

export const mailTypes = [
  { id: 1, title: 'Porperty Approved' },
  { id: 2, title: 'Porperty Rejected' },
  { id: 3, title: 'Porperty Pending' },
  { id: 4, title: 'Porperty Notification' },
]
