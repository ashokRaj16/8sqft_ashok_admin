import validator from 'validator';

const loginValidator = (req = {}) => {

    const errors = [];
    if(!req.email){
        errors.push({ field: "email", message: "Email id is required."})
    }
    if(req.email && !validator.isEmail(req.email)){
        errors.push({ field: "email", message: "Email id is not valid."})
    }
    if(!req.password){
        errors.push({ field: "password", message: "Password is required."})
    }

    if(req.password && !validator.isLength(req.password, { min: 4})){
        errors.push({ field: "password", message: "Password is between 4 to 12 character.."})
    }
    
    return errors;
}

export { loginValidator };