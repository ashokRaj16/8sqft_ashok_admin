import validator from 'validator';

const whatsappImageTemplateValidator = (req = {}) => {

    const errors = [];
    if(!req.contacts_file && (!req.full_name || !req.mobile)) {
        errors.push({ fields: 'contact', message : 'Full name & mobile or Contact File is required.' })
    }

    if (req.mobile && !validator.isMobilePhone(req.mobile)) {
        errors.push({ fields: 'mobile', message : 'Mobile is not valid format.' })
    }

    if (req.mobile && !validator.isLength(req.mobile, { min: 10, max: 12})) {
        errors.push({ fields: 'mobile', message : 'Mobile must be 10 digit long.' })
    }

    if (!req.property_id ) {
        errors.push({ fields: 'property_id', message : 'Property is required.' })
    }

    return errors;
}

const whatsappMarathiTemplateValidator = (req = {}) => {

    const errors = [];
    if(!req.contacts_file && (!req.full_name || !req.mobile)) {
        errors.push({ fields: 'contact', message : 'Full name & mobile or Contact File is required.' })
    }

    if (req.mobile && !validator.isMobilePhone(req.mobile)) {
        errors.push({ fields: 'mobile', message : 'Mobile is not valid format.' })
    }

    if (req.mobile && !validator.isLength(req.mobile, { min: 10, max: 12})) {
        errors.push({ fields: 'mobile', message : 'Mobile must be 10 digit long.' })
    }

    if(!req.txt_marathi)
    {
        errors.push({ fields: 'email', message : 'Marathi text in valid format.' })
    }

    if (!req.msg_mobile) {
        errors.push({ fields: 'mobile', message : 'Message mobile is required.' })
    }

    if (req.msg_mobile && !validator.isMobilePhone(req.msg_mobile)) {
        errors.push({ fields: 'mobile', message : 'Message mobile is not valid format.' })
    }

    if (req.msg_mobile && !validator.isLength(req.msg_mobile, { min: 10, max: 12})) {
        errors.push({ fields: 'mobile', message : 'Message mobile number must be 10 digit long.' })
    }

    return errors;
}

export { whatsappMarathiTemplateValidator, whatsappImageTemplateValidator };