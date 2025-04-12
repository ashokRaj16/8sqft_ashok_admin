import * as Yup from 'yup';

// export const validationMemberSchema = Yup.object({
//     fname: Yup.string().required('First name is required'),
//     mname: Yup.string(),
//     lname: Yup.string().required('Last name is required'),
//     address: Yup.string().required('Address is required'),
//     profile_picture_url: Yup.string().url('Invalid URL').required('Profile picture URL is required'),
//     mobile: Yup.string()
//       .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
//       .required('Mobile number is required'),
//     email: Yup.string().email('Invalid email address').required('Email is required'),
//     status: Yup.string().oneOf(['active', 'inactive'], 'Invalid status').required('Status is required'),
//     city: Yup.string().required('City is required'),
//     acceptTerms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
// });

export const validationMemberSchema = Yup.object({
    fname: Yup.string().required('First name is required'),
    lname: Yup.string().required('Last name is required'),
    mobile: Yup.string().required('Mobile name is required')
            .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    email: Yup.string().required('Email name is required').email("Email is not valid."),
    city_id: Yup.string()
        .required('City name is required')
        .test("not-default", "Please select a valid city.", (value) => value !== '-1')
});