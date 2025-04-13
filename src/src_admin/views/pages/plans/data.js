import { constant } from "../../../utils/constant"

export const initialPlansValues = {
    plan_title: "",
    plan_validity : '',
    plan_type : constant.PLAN_TYPE.REGULAR,
    plan_category : constant.PLAN_CATEGORY.GENERAL,
	project_list_count : 1,
    property_category : "",
    user_type: "",
    plan_names: "",
    duration_days: '',
    leads_counts: '',
    contact_whatsapp_notification: "", 
    promotion_on_web: "",
    promotion_on_meta: "",
    paid_promotion_on_sqft: "",
    paid_video_promotion: "",
    ind_sponsored_ads: "",
    agreement: "",
    assign_rm: "",
    plan_amount: '',
    plan_discounted_amount : '',
    plan_gst_per : '',
    engagement : '',
    view_count : '',
    whatsapp_count : '',
    publish_date  : '',
}

export const optionCategoryValue =[
    { id: 1, key: "COMMERCIAL", value : "COMMERCIAL" },
    { id: 2, key: "RESIDENTIAL", value : "RESIDENTIAL" },
] 

export const optionUserValue =[
    { id: 1, key: "TENANTS", value : "TENANTS" },
    { id: 2, key: "OWNER", value : "OWNER" },
    { id: 3, key: "BUILDER", value : "BUILDER" },
] 

export const optionPlanValue =[
    { id: 1, key: "TRIAL", value : "TRIAL" },
    { id: 2, key: "ELITE", value : "ELITE" },
    { id: 3, key: "PRIME", value : "PRIME" },
    { id: 4, key: "LUXURY", value : "LUXURY" },
] 

export const optionValue =[
    { id: 1, key: "NO", value : "NO" },
    { id: 2, key: "YES", value : "YES" },
    { id: 3, key: "NOT APPLICABLE", value : "NOT APPLICABLE" },
]