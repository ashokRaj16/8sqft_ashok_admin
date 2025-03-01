import validator from 'validator';

const registerUserValidator = (req = {}) => {

    const errors = [];
    if(!req.email && !req.mobile) {
        errors.push({ fields: 'email_mobile', message : 'Mobile or Email id is required.' })
    }

    if(req.email && !validator.isEmail(req.email))
    {
        errors.push({ fields: 'email', message : 'Email id not in valid format.' })
    }

    // if (!req.mobile) {
    //     errors.push({ fields: 'mobile', message : 'Mobile number is required.' })
    // }

    if (req.mobile && !validator.isMobilePhone(req.mobile)) {
        errors.push({ fields: 'mobile', message : 'Mobile number is not valid format.' })
    }

    if (req.mobile && !validator.isLength(req.mobile, { min: 10, max: 12})) {
        errors.push({ fields: 'mobile', message : 'Mobile number must be 10 digit long.' })
    }

    if(!req.first_name)
    {
        errors.push({ fields: 'first_name', message : 'First name is required.' })
    }

    if(!req.last_name) {
        errors.push({ fields: 'last_name', message : 'Last name is required.' })
    }

    return errors;
}


export { registerUserValidator };