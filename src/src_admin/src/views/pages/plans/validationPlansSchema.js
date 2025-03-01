import * as Yup from 'yup';

export const validationPlansSchema = Yup.object({
        plan_title: Yup.string().required('Plan title is required.'),    
        plan_names: Yup.string().required('Plan title is required.'),
        property_category: Yup.string()
                .required('Property Category is required.')
                .test("not-default", "Please select a Promotion.", (value) => value !== '-1'),
        user_type: Yup.string()
                .required('User types is required.')
                .test("not-default", "Please select a user types.", (value) => value !== '-1'),
        duration_days: Yup.string().required('Duration days is required.'),
        leads_counts: Yup.string().required('Leads counts is required.'),
        contact_whatsapp_notification: Yup.string()
                .required('Contact on whatsapp is required')
                .test("not-default", "Please select a contact on whatsapp.", (value) => value !== '-1'),
        promotion_on_web: Yup.string()
                .required('Promotion on web is required')
                .test("not-default", "Please select a Promotion.", (value) => value !== '-1'),
        promotion_on_meta: Yup.string()
        .required('Promotion on meta is required')
        .test("not-default", "Please select a valid promotion item.", (value) => value !== '-1'),
        paid_promotion_on_sqft: Yup.string()
        .required('promotion item is required')
        .test("not-default", "Please select a valid promotion item.", (value) => value !== '-1'),
        paid_video_promotion: Yup.string()
        .required('promotion item is required')
        .test("not-default", "Please select a valid promotion item.", (value) => value !== '-1'),

        ind_sponsored_ads: Yup.string()
        .required('Sponsored ads is required')
        .test("not-default", "Please select a valid sponsored ads.", (value) => value !== '-1'),
        agreement: Yup.string()
        .required('Agreements is required'),
        assign_rm: Yup.string()
        .required('Assign RM is required')
        .test("not-default", "Please select a valid Assign RM.", (value) => value !== '-1'),
        plan_amount: Yup.string()
        .required('Amount is required.'),
        plan_discounted_amount: Yup.string()
        .required('Discount amount is required.'),
        plan_gst_per: Yup.string()
        .required('GST percerntage is required'),
});
