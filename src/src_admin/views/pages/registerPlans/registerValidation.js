import * as Yup from 'yup';

export const validationRegisterSchema = Yup.object({
    fname: Yup.string().required('First name is required'),
    mname: Yup.string(),
    lname: Yup.string().required('Last name is required'),
    address: Yup.string(),
    mobile: Yup.string().required('Mobile name is required'),
    email: Yup.string().required('Email name is required').email("Email is not valid."),
    city: Yup.string()
        .required('City name is required')
        .test("not-default", "Please select a valid city.", (value) => value !== '-1')
});