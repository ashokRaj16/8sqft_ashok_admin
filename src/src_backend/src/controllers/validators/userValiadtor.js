

export const createAdminValidator = (req = {}) => {
    let errors = [];
    if(!req.mobile || !req.email) {
        errors.push('mobile', 'Mobile or email is required')
    }

    if(!req.role_id) {
        errors.push('role_id', 'Role id is required')
    }

    return errors;
}

export const updateAdminValidator = (id, req = {}) => {
    let errors = [];
    if(!req.mobile || !req.email) {
        errors.push('mobile', 'Mobile or email is required')
    }

    if(!req.role_id) {
        errors.push('role_id', 'Role id is required')
    }

    return errors;
}