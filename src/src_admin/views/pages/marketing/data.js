
export let initialPromotionValues = { 
    promotion_name: '',
    marketing_type: '',
    promotion_type: '',
    publish_date: '',
    property_id: ''
    // Add Facebook & Google

}

export let initialPromotionTempValues = { 
    full_name: '',
    mobile: '',
    property_id: ''
}

export let initialPromotionLeadValues = { 
    template_type : '',
    full_name: '',
    mobile: '',
    property_id: '',
    banner_image : '',
    contacts_file : '',
    txt_marathi : '',
    msg_mobile : ''
}

export const marketingTypeOption = [
    { id: 1, title: 'Email', value: 'Email'},
    { id: 2, title: 'Mobile', value: 'Mobile'},
    { id: 3, title: 'Facebook', value: 'Facebook'},
    { id: 4, title: 'Google', value: 'Google'},
    { id: 5, title: 'Twitter', value: 'Twitter'},
]

export const templateSocialTypeOption = [
    { id: 1, title: 'Gupshup Property Ads', value: 'gupshup_property_ads', type: 'WHATSAPP', status: 1},
    { id: 2, title: 'Gupshup Property Marathi Ads', value: 'gupshup_property_marathi_ads', type: 'WHATSAPP', status: 1},
    { id: 3, title: 'Gupshup Payment Reminder', value: 'gupshup_payment_reminder', type: 'WHATSAPP', status: 0},
    { id: 4, title: 'Gupshup New Plan Reminder', value: 'Gupshup_new_plan_reminder', type: 'WHATSAPP', status: 0},
    { id: 5, title: 'Gupshup External Promotion', value: 'Gupshup_external_promotion', type: 'WHATSAPP', status: 0},
    { id: 6, title: 'Gupshup Offer Ads', value: 'Facebook', type: 'WHATSAPP', status: 1},
    
    { id: 7, title: 'Gmail Property Ads', value: 'gupshup_property_ads', type: 'Email', status: 0},
    { id: 8, title: 'Gmail Payment Reminder', value: 'gupshup_payment_reminder', type: 'Email', status: 0},
    { id: 9, title: 'Gmail Offer Ads', value: 'Facebook', type: 'Email', status: 0},
    { id: 10, title: 'Gmail New Plan Reminder', value: 'Gupshup_new_plan_reminder', type: 'Email', status: 0}
]

export const templateSocialGupshupOption = [
    { id: 1, title: 'Gupshup Property Ads', value: 'gupshup_property_ads', type: 'WHATSAPP', status: 1},
    { id: 2, title: 'Gupshup Property Marathi Ads', value: 'gupshup_property_marathi_ads', type: 'WHATSAPP', status: 1} 
]

export const promotionTypeOption = [
    { id: 1, title: 'User', value: 'User'},
    { id: 2, title: 'Property', value: 'Property'},
    { id: 3, title: 'Payment', value: 'Payment'},
    { id: 4, title: 'External', value: 'External'}
]


// Detail page
export const mailTypes = [
  { id: 1, title: 'Porperty Approved' },
  { id: 2, title: 'Porperty Rejected' },
  { id: 3, title: 'Porperty Pending' },
  { id: 4, title: 'Porperty Notification' },
]

export const marketingAction = [
  { id: 1, title: 'RESEND' },
  { id: 2, title: 'REMOVE' },
]