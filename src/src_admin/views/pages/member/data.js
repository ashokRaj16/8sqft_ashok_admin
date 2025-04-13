import { constant } from "../../../utils/constant"

export let initialMemberValues = {
  fname: '',
  mname: '',
  lname: '',
  address_1: '',
  profile_picture_url: '',
  mobile: '',
  email: '',
  status: '',
  city_id: '',
  city_name: '',
  state_id: '',
  state_name: '',
  instagram_url: '',
  facebook_url: '',
  youtube_url: '',
  whatsapp_notification: '',
}

export const mailTypes = [
  { id: 1, title: 'Porperty Approved' },
  { id: 2, title: 'Porperty Rejected' },
  { id: 3, title: 'Porperty Pending' },
  { id: 4, title: 'Porperty Notification' },
]

export const userStatus = [
  { id: 0, title: constant.USER_STATUS.INACTIVE },
  { id: 1, title: constant.USER_STATUS.ACTIVE },
  { id: 2, title: constant.USER_STATUS.PENDING },
  { id: 3, title: constant.USER_STATUS.BLOCK },
  { id: 4, title: constant.USER_STATUS.DISABLED },
  { id: 5, title: constant.USER_STATUS.SUSPENDED },
  { id: 6, title: constant.USER_STATUS.REJECTED },
]
