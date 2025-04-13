import * as Yup from 'yup';
import { promotionTypeOption, templateSocialGupshupOption, templateSocialTypeOption } from './data';

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

export const validationMarketingLeadSchema = () => {
    return Yup.object({

      template_type: Yup.string()
        .notOneOf(['-1'], 'Template type is required')
        .required('Template type is Required'),
  
      full_name: Yup.string().nullable(),
      mobile: Yup.string()
        .nullable()
        .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
      contacts_file: Yup.mixed()
        .nullable()
        .test(
          'file-or-fields',
          'Either upload a contact file OR enter full name and mobile number.',
          function (value) {
            const { full_name, mobile } = this.parent;
            const hasFile = !!value;
            const hasFields = !!full_name && /^[0-9]{10}$/.test(mobile || '');
            return hasFile || hasFields;
          }
        ),
  
      property_id: Yup.string().when('template_type', {
        is: (value) => [templateSocialGupshupOption[0].value].includes(value),
        then: (schema) =>
          schema
            .required('Property is required'),
        otherwise: (schema) => schema.nullable(),
      }),
  
      txt_marathi: Yup.string().when('template_type', {
        is: (value) => [templateSocialGupshupOption[1].value].includes(value),
        then: (schema) => schema.required('Marathi text is required'),
        otherwise: (schema) => schema.nullable(),
      }),
  
      msg_mobile: Yup.string().when('template_type', {
        is: (value) => [templateSocialGupshupOption[1].value].includes(value),
        then: (schema) =>
          schema
            .required('Mobile number is required')
            .matches(/^[0-9]{10}$/, 'Number must be 10 digits.'),
        otherwise: (schema) => schema.nullable(),
      }),
    })
};