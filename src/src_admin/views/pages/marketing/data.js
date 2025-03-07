
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

export const marketingTypeOption = [
    { id: 1, title: 'Email', value: 'Email'},
    { id: 2, title: 'Mobile', value: 'Mobile'},
    { id: 3, title: 'Facebook', value: 'Facebook'},
    { id: 4, title: 'Google', value: 'Google'},
    { id: 5, title: 'Twitter', value: 'Twitter'},
]

export const templateSocialTypeOption = [
    { id: 1, title: 'Gupshup Property Ads', value: 'gupshup_property_ads', type: 'Mobile'},
    { id: 2, title: 'Gupshup Payment Reminder', value: 'gupshup_payment_reminder', type: 'Mobile'},
    { id: 3, title: 'Gupshup Offer Ads', value: 'Facebook', type: 'Mobile'},
    { id: 4, title: 'Gupshup New Plan Reminder', value: 'Gupshup_new_plan_reminder', type: 'Mobile'},
    { id: 5, title: 'Gupshup External Promotion', value: 'Gupshup_external_promotion', type: 'Mobile'},

    { id: 6, title: 'Gmail Property Ads', value: 'gupshup_property_ads', type: 'Email'},
    { id: 7, title: 'Gmail Payment Reminder', value: 'gupshup_payment_reminder', type: 'Email'},
    { id: 8, title: 'Gmail Offer Ads', value: 'Facebook', type: 'Email'},
    { id: 9, title: 'Gmail New Plan Reminder', value: 'Gupshup_new_plan_reminder', type: 'Email'}
]

export const promotionTypeOption = [
    { id: 1, title: 'User', value: 'User'},
    { id: 2, title: 'Property', value: 'Property'},
    { id: 3, title: 'Payment', value: 'Payment'},
    { id: 4, title: 'External', value: 'External'}
]