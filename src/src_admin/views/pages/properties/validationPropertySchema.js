import * as Yup from 'yup';

export const validationPropertyFeaturesSchema = Yup.object({
    property_title: Yup.string().required('Proeprty Title is required'),
    description: Yup.string().required('Description is required'),
    latitude: Yup.string().required('Latitute is required'),
    longitude : Yup.string().required('longitude is required'),
    builtup_area: Yup.string().required('Builtup Area is required'),
    // land_area: Yup.string().required('Land Area is required'),
    project_area: Yup.string().required('Project area is required.'),
    project_area_unit: Yup.string().required('Project area unit is required.'),
    property_age: Yup.string().required('Property age is required.'),
    bed_rooms: Yup.string().required('Bed rooms is required.'),
    balcony: Yup.string().required('Balcony is required.')
});


export const validationPropertyAmenetiesSchema = Yup.object({
    property_title: Yup.string().required('First name is required'),
    description: Yup.string(),
    latitude: Yup.string().required('Last name is required'),
    longitude : Yup.string(),
    land_area: Yup.string().required('Mobile name is required'),
    project_area: Yup.string().required('Email name is required'),
    property_age: Yup.string().required('City name is required.')
       
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
    property_title: Yup.string().required('First name is required'),
    description: Yup.string(),
    latitude: Yup.string().required('Last name is required'),
    longitude : Yup.string(),
    land_area: Yup.string().required('Mobile name is required'),
    project_area: Yup.string().required('Email name is required'),
    property_age: Yup.string().required('City name is required.')

});


export const validationPropertyFQSchema = Yup.object({
    property_title: Yup.string().required('First name is required'),
    description: Yup.string(),
    latitude: Yup.string().required('Last name is required'),
    longitude : Yup.string(),
    land_area: Yup.string().required('Mobile name is required'),
    project_area: Yup.string().required('Email name is required'),
    property_age: Yup.string().required('City name is required.')

});