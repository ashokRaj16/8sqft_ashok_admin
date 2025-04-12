import * as Yup from 'yup';

export const validationLoginSchema = Yup.object({
    email: Yup.string().required('Email is required').email('Email is not valid.'),
    password: Yup.string().required('Password is required').min(4).max(12)
});