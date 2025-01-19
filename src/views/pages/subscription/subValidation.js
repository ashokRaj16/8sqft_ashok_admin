import * as Yup from 'yup';

// Validation schema using Yup
export const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  gender: Yup.string().required('Gender is required'),
  country: Yup.string().required('Country is required'),
  terms: Yup.bool().oneOf([true], 'You must accept the terms and conditions'),
  publish_date: Yup.date().required('Publish date is required'), // Required field
});
