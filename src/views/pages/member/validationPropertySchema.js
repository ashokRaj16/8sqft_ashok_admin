import * as Yup from 'yup';

export const validationPropertyFeaturesSchema = Yup.object({
    property_title: Yup.string().required('Proeprty Title is required'),
    description: Yup.string().required('Description is required'),
    latitude: Yup.string().required('Latitute is required'),
    longitude : Yup.string().required('longitude is required'),
    // builtup_area: Yup.string().required('Builtup Area is required'),
    // land_area: Yup.string().required('Land Area is required'),
    builtup_area: Yup.string().when('user_type', {
        is: 'OWNER',
        then : (schema) => schema.required('Builtup area is required.'),
        otherwise : (schema) => schema.notRequired()
    }),
    builtup_area_unit: Yup.string().when('user_type', {
        is: 'OWNER',
        then : (schema) => schema.notOneOf(["-1"], "Builtup area unit is required.").required('Project area unit is required.'),
        otherwise : (schema) => schema.notRequired()
    }),
    land_area: Yup.string().when('user_type', {
        is: 'OWNER',
        then : (schema) => schema.required('Land area is required.'),
        otherwise : (schema) => schema.notRequired()
    }),
    land_area_unit: Yup.string().when('user_type', {
        is: 'OWNER',
        then : (schema) => schema.notOneOf(["-1"], "Land area unit is required.").required('Project area unit is required.'),
        otherwise : (schema) => schema.notRequired()
    }),

    rent_amount: Yup.string().when('user_type', {
        is: 'OWNER',
        then : (schema) => schema.required('Rent Amount is required.'),
        otherwise : (schema) => schema.notRequired()
    }),
    deposite_amount: Yup.string().when('user_type', {
        is: 'OWNER',
        then : (schema) => schema.required('Deposite amount is required.'),
        otherwise : (schema) => schema.notRequired()
    }),

    rent_is_nogotiable: Yup.string().when('user_type', {
        is: 'OWNER',
        then : (schema) => schema.notOneOf(["-1"], "Rent negotiable is required.").required('Project area unit is required.'),
        otherwise : (schema) => schema.notRequired()
    }),
    deposite_is_negotiable: Yup.string().when('user_type', {
        is: 'OWNER',
        then : (schema) => schema.notOneOf(["-1"], "Deposite negotiable is required.").required('Project area unit is required.'),
        otherwise : (schema) => schema.notRequired()
    }),

    project_area: Yup.string().when('user_type', {
        is: 'BUILDER',
        then : (schema) => schema.required('Project area is required.'),
        otherwise : (schema) => schema.notRequired()
    }),
    project_area_unit: Yup.string().when('user_type', {
        is: 'BUILDER',
        then : (schema) => schema.notOneOf(["-1"], "Project area unit is required.").required('Project area unit is required.'),
        otherwise : (schema) => schema.notRequired()
    })
    
    // property_age: Yup.string().required('Property age is required.'),
    // bed_rooms: Yup.string().required('Bed rooms is required.'),
    // balcony: Yup.string().required('Balcony is required.')
});

export const validationPropertyAmenetiesSchema = Yup.object({
    // furnishing_status: Yup.string().required('Furnishing status is required'),
    // // .test(), "required"),
    // parking: Yup.string().required('Parking is required'),
    // water_supply: Yup.string().required('Water Supply is required'),
    // granted_security : Yup.string().required('Security is required'),
    // pet_allowed: Yup.string().required('Pet Allowed is required'),
    // non_veg_allowed: Yup.string().required('Non veg allowed is required'),
    // other_amenities: Yup.string().required('Other ameneties name is required.')
});


export const validationPropertyImagesSchema = Yup.object({
    property_title: Yup.string().required('First name is required'),
    description: Yup.string(),
    latitude: Yup.string().required('Last name is required'),
    longitude : Yup.string(),
    land_area: Yup.string().required('Mobile name is required'),
    project_area: Yup.string().required('Email name is required'),
    property_age: Yup.string().required('City name is required.')
        
});


export const validationPropertyConfigurationSchema = Yup.object({
  unit_name: Yup.string().when('$property_type', (property_type, schema) => {
      const normalizedPropertyType = Array.isArray(property_type) ? property_type[0] : property_type;
      console.log('ppppttt:', normalizedPropertyType)

    if (!['COMMERCIAL', 'RESIDENTIAL'].includes(normalizedPropertyType)) {
      return schema.required('Unit name required.')
    }
    
    return schema.notRequired()
    // is: (value) => ['COMMERCIAL', 'RESIDENTIAL'].includes(value),
    // then: (schema) => schema.required('Unit name required.'),
    // otherwise: (schema) => schema.notRequired(),
  }),
  //   OPEN LAND
//   carpet_area: Yup.string().required('Carpet area is required'),
//   carpet_price: Yup.string().required('Carpet price is required'),
//   length: Yup.string().required('Length is required'),
//   width: Yup.string().required('Width is required'),
//   length_unit: Yup.string().required('Length unit is required'),
//   width_unit: Yup.string().required('Width unit is required'),
//   image: Yup.string().required('Image is required'),
})


export const WrapperValidationSchema = ( propertyType = '') => {
    console.log("PType" , propertyType )
    return Yup.object({
        
        // unit_name : Yup.string()
        //     .when([], {
        //         is: () => propertyType === 'COMMERCIAL',
        //         then : Yup.string().nullable(),
        //         otherwise : Yup.string().required('Type is required')
        //     }),

        unit_name: propertyType === 'COMMERCIAL'
            ? Yup.string().nullable()
            : Yup.string().required('Type is required'),
    })
}

export const validationPropertyFQSchema = Yup.object({
    faq_questions: Yup.string().required('Question is required'),
    faq_answer: Yup.string().required('Answer is required'),
});