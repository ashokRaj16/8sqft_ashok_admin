import * as Yup from 'yup';
import { promotionTypeOption, templateSocialTypeOption } from './data';

export const validationMarketingSchema = Yup.object({
    promotion_name: Yup.string().required('First name is required'),
    // marketing_type : Yup.string().notOneOf(['-1'], 'marketing type is required').required('Marketing type is Required'),
    // template_type: Yup.string().notOneOf(['-1'], 'Template type is required').required('Template type is Required'),
    promotion_type: Yup.string()
    .when('template_type', {
        is: (value) =>  ![templateSocialTypeOption[4].value].includes(value),
        then : (schema) => schema.notOneOf(['-1'], 'Promotion type is required').required('Promotion type is Required'),
        otherwise: (schema) => schema.nullable()
    }),
    // .notOneOf(['-1'], 'Promotion type is required').required('Promotion type is Required'),
    publish_date: Yup.string().required('Publish date is required.'),
    property_id: Yup.string()
        .when('template_type', {
            is: (value) =>  [templateSocialTypeOption[0].value, templateSocialTypeOption[6].value].includes(value),
            then : (schema) => schema.required('Property is required.'),
            otherwise: (schema) => schema.nullable()
        }),
    excel_file: Yup.string()
        .when('promotion_type', {
            is: (value) =>  [promotionTypeOption[3].value].includes(value),
            then : (schema) => schema.required('Excel file is required.'),
            otherwise: (schema) => schema.nullable()
        })
});

export const validationMarketingTempSchema = Yup.object({
    full_name: Yup.string().required('Full Name is required.'),
    mobile : Yup.string()
            .required('Mobile is required.')
            .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
    property_id: Yup.string().required('Property is required.')
});

export const validationMarketingLeadSchema = Yup.object({
    full_name: Yup.string().required('Full Name is required.'),
    mobile : Yup.string()
            .required('Mobile is required.')
            .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
    property_id: Yup.string().required('Property is required.')
});