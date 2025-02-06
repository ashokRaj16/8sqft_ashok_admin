

// plan_title,
//  property_category,
//  user_type,
//  plan_names,
//  duration_days,
//  leads_counts,
//  contact_whatsapp_notification,
//  promotion_on_web,
//  promotion_on_meta,
//  paid_promotion_on_sqft,
//  paid_video_promotion,
//  ind_sponsored_ads,
//  agreement,
//  assign_rm,
//  plan_amount,
//  plan_discounted_amount,
//  plan_gst_per,

export const validateSubscription = (req) => {
  const newErrors = {}

  if(!req.plan_title) {
    newErrors.plan_title = 'Plan title is required.';
  }
  // if(!req.property_category) {
  //   newErrors.property_category = 'Product category is required.';
  // }
  // if(!req.user_type ) {
  //   newErrors.user_type = 'User Type is required.';
  // }

  // if(!req.plan_names) {
  //   newErrors.plan_names = 'Plan names is required.';
  // }
  // if(!req.duration_days) {
  //   newErrors.duration_days = 'Duration is required.';
  // }
  // if(!req.leads_counts ) {
  //   newErrors.leads_counts = 'Leads count is required.';
  // }

  // if(!req.contact_whatsapp_notification) {
  //   newErrors.contact_whatsapp_notification = 'Whatsapp notification is required.';
  // }
  // if(!req.promotion_on_web) {
  //   newErrors.promotion_on_web = 'Promotion on web is required.';
  // }
  // if(!req.promotion_on_meta ) {
  //   newErrors.promotion_on_meta = 'Promotion on meta is required.';
  // }

  // if(!req.paid_promotion_on_sqft) {
  //   newErrors.paid_promotion_on_sqft = 'Promotion on SQFT is required.';
  // }
  // if(!req.paid_video_promotion) {
  //   newErrors.paid_video_promotion = 'Video promotion is required.';
  // }
  // if(!req.ind_sponsored_ads ) {
  //   newErrors.ind_sponsored_ads = 'Sponsored ads is required.';
  // }
  // if(!req.assign_rm) {
  //   newErrors.assign_rm = 'Assign relational manager is required.';
  // }
  // if(!req.agreement) {
  //   newErrors.agreement = 'Agreement is required.';
  // }
  // if(!req.plan_amount ) {
  //   newErrors.plan_amount = 'Plan amount is required.';
  // }

  // if(!req.plan_discounted_amount) {
  //   newErrors.plan_discounted_amount = 'Plan discount amount is required.';
  // }
  // if(!req.plan_gst_per) {
  //   newErrors.plan_gst_per = 'GST percentage is required.';
  // }
  
  return newErrors;
}