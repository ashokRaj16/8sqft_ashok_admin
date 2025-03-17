import * as Yup from 'yup';

// export const validationAdminSchema = Yup.object({
//     fname: Yup.string().required('First name is required'),
//     lname: Yup.string().required('Last name is required'),
//     mobile: Yup.string().required('Mobile name is required'),
//     email: Yup.string().required('Email name is required').email("Email is not valid."),
//     city: Yup.string()
//         .required('City name is required')
//         .test("not-default", "Please select a valid city.", (value) => value !== '-1'),
//     role_id : Yup.string()
//         .required('Role is required')
//         .test("not-default", "Please select a role.", (value) => value !== '-1'),
//     password: Yup.string().required('Password name is required.').min(4).max(12),
//     cpassword: Yup.string()
//     .required('Confirm Password is required.')
//     .oneOf([Yup.ref('password'), null], 'Passwords must match.'),
// });

export const validationAdminSchema = (id) => {
    console.log(id,'validatess')
    return Yup.object({
        fname: Yup.string().required('First name is required'),
        lname: Yup.string().required('Last name is required'),
        mobile: Yup.string()
            .required('Mobile name is required')
            .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
        email: Yup.string().required('Email name is required')
            .email("Email is not valid."),
        city_id: Yup.string()
            .required('City name is required')
            .test("not-default", "Please select a valid city.", (value) => value !== '-1'),
        role_id : Yup.string()
            .required('Role is required')
            .test("not-default", "Please select a role.", (value) => value !== '-1'),
        password: (!id) ? Yup.string().
                required('Password name is required.').min(4).max(12) 
            : Yup.string().nullable() ,
        cpassword: (!id) ? Yup.string()
                .required('Confirm Password is required.')
                .oneOf([Yup.ref('password'), null], 'Passwords must match.')
            : Yup.string().nullable()
    });
}