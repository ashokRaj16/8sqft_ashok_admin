import validator from 'validator';

/**
 * Ameneie validation
 * @param {*} req 
 * @returns 
 */
export const amenetiesValidators = (req = {}) => {

    let errors = [];

    if( !req.amenity_name )
    {
        errors.push({field: "amenity_name", message: "Amenties required!"});
    }
    if(req.amenity_name && validator.isEmpty(req.amenity_name))
    {
        errors.push({field: "amenity_name", message: "Amenties field is required!"});
    }

    return errors;
}

/**
 * Feature validation
 * @param {*} req 
 * @returns 
 */
export const featureValidators = (req = {}) => {

    let errors = [];

    if( !req.feature_name )
    {
        errors.push({field: "feature_name", message: "Features required!"});
    }

    if(req.feature_name && validator.isEmpty(req.feature_name))
    {
        errors.push({field: "feature_name", message: "Features field is required!"});
    }
    if( !req.feature_categories )
    {
        errors.push({field: "feature_categories", message: "Features categories field is required!"});
    }

    if(req.feature_categories && validator.isEmpty(req.feature_categories))
    {
        errors.push({field: "feature_categories", message: "Features categories field is required!"});
    }

    return errors;
}

/**
 * Property validation
 * @param {*} req 
 * @returns 
 */
export const propertyValidators = (req = {}) => {

    let errors = [];
    if( !req.step_id ) {
        errors.push({field: "step_id", message: "Step id is required!"});
    }
    if( !req.id && parseInt(req.step_id) !== 1 ) {
        errors.push({field: "id", message: "Property id is required!"});
    }
    
    if( !req.user_type && parseInt(req.step_id) == 1 )
    {
        errors.push({field: "user_type", message: "User type is required!"});
    }

    if( !req.property_type && parseInt(req.step_id) == 1 && req.user_type && (req.user_type ==="OWNER"))
    {
        errors.push({field: "property_type", message: "Property type is required!"});
    }

    if( !req.property_rent_buy && parseInt(req.step_id) == 1 && req.user_type && (req.user_type ==="OWNER") ) {
        errors.push({field: "property_rent_buy", message: "Property rent or buy is required!"});
    }
    
    if( !req.city_id && parseInt(req.step_id) == 2 )
    {
        errors.push({field: "city_id", message: "City id is required!"});
    }

    // if( !req.state_id && parseInt(req.step_id) == 2 )
    // {
    //     errors.push({field: "state_id", message: "State id is required!"});
    // }
    if( parseInt(req.step_id) == 2 && req.pincode && !validator.isPostalCode(req.pincode, 'IN') )
    {
        errors.push({field: "pincode", message: "Please enter valid pincode!"});
    }

    // if( parseInt(req.step_id) == 2 && req.land_area && !validator.isNumeric( req.land_area ) )
    // {
    //     errors.push({field: "area", message: "Area must be valid numbers!"});
    // }

    // if( parseInt(req.step_id) == 2 && req.bed_rooms && !validator.isNumeric( req.bed_rooms ) )
    // {
    //     errors.push({field: "bed_rooms", message: "Bed rooms count must be valid numbers!"});
    // }

    // if( parseInt(req.step_id) == 2 && req.bath_rooms && !validator.isNumeric(req.bath_rooms) )
    // {
    //     errors.push({field: "bath_rooms", message: "Bath rooms count must be valid numbers!!"});
    // }

    // if( parseInt(req.step_id) == 2 && req.property_floors && !validator.isNumeric( req.property_floors ) )
    // {
    //     errors.push({field: "property_floors", message: "Property floors must be valid numbers!"});
    // }

    // if( parseInt(req.step_id) == 2 && req.total_floors && !validator.isNumeric( req.total_floors ) )
    // {
    //     errors.push({field: "total_floors", message: "Total floors count must be valid numbers!"});
    // }

    // if( parseInt(req.step_id) == 2 && req.balcony && !validator.isNumeric(req.balcony) )
    // {
    //     errors.push({field: "balcony", message: "Balcony count must be valid numbers!!"});
    // }

    // if( parseInt(req.step_id) == 2 && req.is_wings && !validator.isNumeric( req.is_wings ) )
    // {
    //     errors.push({field: "is_wings", message: "Wings must be Yes or No!"});
    // }

    // if( parseInt(req.step_id) == 2 && req.total_wings && !validator.isNumeric( req.total_wings ) )
    // {
    //     errors.push({field: "total_wings", message: "Wings count must be valid numbers!"});
    // }

    // if( parseInt(req.step_id) == 3 && !req.furnishing_status )
    // {
    //     errors.push({field: "furnishing_status", message: "Furnishing status is required!"});
    // }
        
    // if( parseInt(req.step_id) == 3 && !req.washroom_type )
    // {
    //     errors.push({field: "washroom_type", message: "Washroom type is required!"});
    // }
    // if( parseInt(req.step_id) == 3 && !req.parking )
    // {
    //     errors.push({field: "parking", message: "parking is required!"});
    // }
    if( parseInt(req.step_id) == 3 && !req.water_supply )
    {
        errors.push({field: "water_supply", message: "Water supply is required!"});
    }

    // if( parseInt(req.step_id) == 3 && !req.granted_security )
    // {
    //     errors.push({field: "granted_security", message: "Security is required!"});
    // }

    // Image Validation

    return errors;
}

/**
 * Property validation
 * @param {*} req 
 * @returns 
 */
export const propertyUpdateFeaturesValidators = (req = {}) => {

    let errors = [];
   
    // if( !parseInt(req.city_id) )
    // {
    //     errors.push({field: "city_id", message: "City id is required!"});
    // }

    // if( !parseInt(req.state_id) )
    // {
    //     errors.push({field: "city_id", message: "City id is required!"});
    // }
    // if( req.pincode && !validator.isPostalCode(req.pincode, 'IN') )
    // {
    //     errors.push({field: "pincode", message: "Please enter valid pincode!"});
    // }

    // if( req.area && !validator.isNumeric( req.area ) )
    // {
    //     errors.push({field: "area", message: "Area must be valid numbers!"});
    // }

    // if( req.bed_rooms && !validator.isNumeric( req.bed_rooms ) )
    // {
    //     errors.push({field: "bed_rooms", message: "Bed rooms count must be valid numbers!"});
    // }

    // if( req.bath_rooms && !validator.isNumeric(req.bath_rooms) )
    // {
    //     errors.push({field: "bath_rooms", message: "Bath rooms count must be valid numbers!!"});
    // }

    // if( req.property_floors && !validator.isNumeric( req.property_floors ) )
    // {
    //     errors.push({field: "property_floors", message: "Property floors must be valid numbers!"});
    // }

    // if( req.total_floors && !validator.isNumeric( req.total_floors ) )
    // {
    //     errors.push({field: "total_floors", message: "Total floors count must be valid numbers!"});
    // }

    // if( req.balcony && !validator.isNumeric(req.balcony) )
    // {
    //     errors.push({field: "balcony", message: "Balcony count must be valid numbers!!"});
    // }

    // if( req.is_wings && !validator.isNumeric( req.is_wings ) )
    // {
    //     errors.push({field: "is_wings", message: "Wings must be Yes or No!"});
    // }

    // if( req.wings_count && !validator.isNumeric( req.wings_count ) )
    // {
    //     errors.push({field: "wings_count", message: "Wings count must be valid numbers!"});
    // }
    
    // if( !req.description )
    // {
    //     errors.push({field: "description", message: "Description is required!"});
    // }

    return errors;
}


export const propertyContactValidators = (req = {}) => {

    let errors = [];
   
    if( !req.name )
    {
        errors.push({field: "name", message: "Name is required!"});
    }

    if( !req.phone )
    {
        errors.push({field: "phone", message: "Phone is required."});
    }
    if( !req.email)
    {
        errors.push({field: "email", message: "Email is required."});
    }

    if( req.email && !validator.isEmail(req.email))
    {
        errors.push({field: "email", message: "Email is not valid."});
    }

    if( !req.selected_plot_size)
    {
        errors.push({field: "selected_plot_size", message: "Plot size is required."});
    }    

    return errors;
}

export const propertyConfigurationValidator = (req = {}) => {

    let errors = [];
   
    if( !req.property_id )
    {
        errors.push({field: "property_id", message: "Property Id is required!"});
    }


    // ### check from database reference.
    if( req.property_id && !validator.isNumeric(req.property_id))
    {
        errors.push({field: "property_id", message: "Please enter valid Property Id!"});
    }

    if( !req.carpet_price )
    {
        errors.push({field: "carpet_price", message: "Carpet price is required."});
    }

    if( !req.carpet_area )
    {
        errors.push({field: "carpet_area", message: "Carpet area is required."});
    }
  
    return errors;
}


export const propertyFandQValidator = (req = {}) => {

    let errors = [];
   
    if( !req.faq_question )
    {
        errors.push({field: "faq_question", message: "Question is required."});
    }

    if( !req.faq_answer )
    {
        errors.push({field: "faq_answer", message: "Answer is required."});
    }
  
    return errors;
}


export const propertyNearbyValidator = (req = {}) => {

    let errors = [];
   
    if( !req.nearby_id )
    {
        errors.push({field: "nearby_id", message: "Nearby id is required."});
    }

    if( !req.location_title )
    {
        errors.push({field: "location_title", message: "Location title is required."});
    }

    if( !req.distance )
    {
        errors.push({field: "distance", message: "Distance is required."});
    }

    if( !req.time )
    {
        errors.push({field: "time", message: "Time is required."});
    }

    if( !req.longitude )
    {
        errors.push({field: "lagitute", message: "Lagitute is required."});
    }

    if( !req.latitude )
    {
        errors.push({field: "latitute", message: "Latitute is required."});
    }
  
    return errors;
}

export const nearybyValidation = (req ={}) => {
    let errors = [];
   
    if( !req.location_title )
    {
        errors.push({field: "location_title", message: "Title is required."});
    }

    if( !req.address )
    {
        errors.push({field: "address", message: "Address is required."});
    }

    if( !req.distance )
    {
        errors.push({field: "distance", message: "Distance is required."});
    }

    if( !req.time )
    {
        errors.push({field: "time", message: "Time is required."});
    }

    if( !req.longitude )
    {
        errors.push({field: "lagitute", message: "Lagitute is required."});
    }

    if( !req.latitude )
    {
        errors.push({field: "latitute", message: "Latitute is required."});
    }

    if( !req.nearby_id )
        {
            errors.push({field: "nearby_id", message: "Nearby id required."});
        }
  
    return errors;
}