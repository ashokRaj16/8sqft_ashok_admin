import * as propoertyValidators from './validators/propertyValidators.js';
import { successResponse, badRequestResponse, internalServerResponse, successWithDataResponse } from '../utils/response.js';
import validator from 'validator';
import { 
    createAmenties, 
    createFeatures, 
    createProperty, 
    updateProperty, 
    updatePropertyGallery, 
    updatePropertyAmeneties,
    updatePropertyDescription,
    getPropertyListById, 
    getPropertyAmenetiesById, 
    getPropertyImagesById, 
    getAllPropertyList,
    getAllPropertyCount } from '../models/propertyModels.js';

export const postProperty = async (req, res) => {
    
    try {
      // console.log(req.body.step_id)
      // ### If error then unlink all images.
      // ### upload images within steps only = step: 1 {property_videos, property_flooring_plans, property_description} step 2: { pan_card, addhar_card, verification_document}
      // ### check if proeprty_id
      // ### validate images.

      const { step_id } = req.body;
      const errors = propoertyValidators.propertyValidators(req.body);

      if(errors.length > 0)
      {
        return badRequestResponse(res, false, 'Validation Message', errors)
      }

      if(Number.parseInt(step_id) === 1){
        // Property description
        // trim all values.

        const { 
            step_id,
            landmark,
            locality,
            city_id,
            city_name,
            state_id,
            state_name,
            latitude,
            longitude,
            pincode,
            property_title,
            building_name,
            property_type,
            property_rent_buy,
            property_variety,
            proeprty_variety_type,
            door_facing,
            land_area,
            land_area_unit,
            builtup_area,
            builtup_area_unit,
            rent_amount,
            rent_is_nogotiable,
            deposite_amount,
            deposite_is_negotiable,
            bed_rooms,
            washrooms,
            balcony,
            unit_number,
            floor_number,
            total_floors,
            property_floors,
            is_wings,
            total_wing,
            wing_name,
            property_availibility_type,
            preferred_tenent,
            property_age,
            is_maintenance,
            availability_date,
            } = req.body;

        data = { 
            step_id,
            user_id: req.userId,
            landmark: landmark || null,
            locality: locality || null,
            city_id: Number.parseFloat( city_id) || null,
            city_name: city_name || null,
            state_id : Number.parseFloat( state_id ) || null,
            state_name : state_name || null,
            latitude,
            longitude,
            pincode : pincode || null,
            property_title,
            building_name,
            property_rent_buy,
            property_variety,
            proeprty_variety_type,
            door_facing,
            land_area,
            land_area_unit,
            builtup_area,
            builtup_area_unit,
            rent_amount,
            rent_is_nogotiable: rent_is_nogotiable || null,
            deposite_amount,
            deposite_is_negotiable: deposite_is_negotiable || null,
            rent: Number.parseFloat(rent) || null,
            deposite: Number.parseFloat(deposite) || null,
            bed_rooms : Number.parseFloat(bed_rooms) || null,
            washrooms : Number.parseFloat(washrooms) || null,
            balcony: Number.parseFloat(balcony) || null,
            unit_number,
            floor_number,
            total_floors : Number.parseFloat(total_floors) || null,
            total_wing : Number.parseFloat(total_wing) || null,
            wing_name,
            property_availibility_type,
            preferred_tenent,
            property_age : property_age || null,
            property_type: property_type || null,
            property_sub_variant: property_sub_variant || null,
            flat_type : flat_type || null,
            area: Number.parseFloat(area) || null,
            area_type : area_type || null,
            property_floors : Number.parseFloat(property_floors) || null,
            is_wings: Number.parseFloat(is_wings) || null,
            is_maintenance,
            availability_date: availability_date || null,
            ip_address : req.headers['x-forwarded-for'] || req.connection.remoteAddress || '',
            user_agent : req.headers['user-agent'] || '',
            host_name : req.headers['host'] || "" 
        };

        if(!req.body.id) {
            const result = await createProperty(data);
            if(result) {
                return successResponse(res, true, 'Property created!', result);
            }
        } else {
            const id = req.body;
            const result = await updateProperty(id, data);
            if(result) {
                return successResponse(res, true, 'Property updated!', result);
            }
        }

      } else if(Number.parseInt(step_id) === 2) {
        // Proeprty ameneties
      }
      else if(Number.parseInt(step_id) === 3) {
        // Image uplaods

      } else if(Number.parseInt(step_id) === 4){
        // proeprtt preview and last step

      }

      if(Number.parseInt(step_id) === 1)
      {
      
          if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
          }
          
            let data = [];
            const { 
              user_id, ip_address, user_agent, host_name
            } = req.body;
            
            data['property'] = { user_id: Number.parseInt(req.userId), ip_address, user_agent, host_name };
            data['gallery'] = [];
            // data['amenties'] = [];
            // data['nearby_location'] = [];
            // data['features'] = [];
            // data['faq'] = [];

            //   console.log("files", req.files);
              Object.keys(req.files).forEach((fieldName) => {
                req.files[fieldName].forEach((file) => {
                  data['gallery'].push({ img_title: file.fieldname, img_type: file.mimetype, property_img_url:  `${process.env.SERVER_UPLOAD_URL || null}${file.filename}`});
              });
            });

          if(!req.body.id) {
              const result = await createProperty(data);
              if(result) {
                  return successResponse(res, true, 'Property created!', result);
              }
          } else {
              const id = req.body;
              const result = await updateProperty(id, data);
              if(result) {
                  return successResponse(res, true, 'Property updated!', result);
              }
          }

      } else if(Number.parseInt( step_id) === 2) {
        
          const { id } = req.body;
          
          if(!id) {
              return badRequestResponse(res, false, 'Validation Message', { fields: 'id', message: "Id must required."})
          }

          let data = [];
          const { 
            landmark,
            locality,
            city_id,
            city_name,
            state_id,
            state_name,
            pincode,
            on_rent_buy,
            property_type,
            property_sub_variant,
            flat_type,
            area,
            area_type,
            bed_rooms,
            bath_rooms,
            property_floors,
            total_floors,
            balcony,
            is_wings,
            wings_count,
            rent,
            rent_is_nogotiable,
            deposite,
            deposite_is_negotiable,
            availability_date,
            property_age,
          } = req.body;

          data['property'] = { 
            landmark: landmark || null,
            locality: locality || null,
            city_id: Number.parseFloat( city_id) || null,
            city_name: city_name || null,
            state_id : Number.parseFloat( state_id ) || null,
            state_name : state_name || null,
            pincode : pincode || null,
            on_rent_buy: Number.parseFloat(on_rent_buy) || null,
            property_type: property_type || null,
            property_sub_variant: property_sub_variant || null,
            flat_type : flat_type || null,
            area: Number.parseFloat(area) || null,
            area_type : area_type || null,
            bed_rooms : Number.parseFloat(bed_rooms) || null,
            bath_rooms : Number.parseFloat(bath_rooms) || null,
            property_floors : Number.parseFloat(property_floors) || null,
            total_floors : Number.parseFloat(total_floors) || null,
            balcony: Number.parseFloat(balcony) || null,
            is_wings: Number.parseFloat(is_wings) || null,
            wings_count : Number.parseFloat(wings_count) || null,
            rent: Number.parseFloat(rent) || null,
            rent_is_nogotiable: rent_is_nogotiable || null,
            deposite: Number.parseFloat(deposite) || null,
            deposite_is_negotiable: deposite_is_negotiable || null,
            availability_date: availability_date || null,
            property_age : property_age || null
          };

          const result = await updateProperty( id, data);
          if(result) {
              return successResponse(res, true, 'Property updated!', result);
          }

      } else if( Number.parseInt(step_id) === 3) {
        let data = [];  
        data['amenties'] = [];
        
        const { id }= req.body;
        // if(!id) {
        //     return badRequestResponse(res, false, 'Validation Message', { fields: 'id', message: "Id must required."})
        // }

        data['amenties'] =JSON.parse(req.body.amenties );
        // console.log(data.amenties)
        data.amenties.map((amenety) => {
          // console.log(amenety);
          if(! amenety.property_id) {
            return badRequestResponse(res, false, 'Validation Message', { field: 'property_id', message: 'Property id is required.'})
          }
          if(! amenety.amenety_id) {
            return badRequestResponse(res, false, 'Validation Message', { field: 'amenety_id', message: 'Amenety id is required.'})
          }
          if(! amenety.amenety_title) {
            return badRequestResponse(res, false, 'Validation Message', { field: 'amenety_title', message: 'Amenety title is required.'})
          }
          if(! amenety.amenety_value) {
            return badRequestResponse(res, false, 'Validation Message', { field: 'amenety_value', message: 'Amenety value is required.'})
          }

          // console.log(parseInt(amenety.property_id), amenety.amenety_id);
          if(amenety.property_id && !validator.isNumeric( amenety.property_id)) {
            return badRequestResponse(res, false, 'Validation Message', { field: 'property_id', message: 'Property id is not valid.'})
          }

          if(amenety.amenety_id && !validator.isNumeric(amenety.amenety_id)) {
            return badRequestResponse(res, false, 'Validation Message', { field: 'amenety_id', message: 'Amenety id is not valid.'})
          }
         
        })
        // data['features'] = [];
        // data['faq'] = [];
          
          const result = await updatePropertyAmeneties( id, data);
          if(result) {
              return successResponse(res, true, 'Property updated!', result);
          }

      } else if(Number.parseInt(step_id) === 4) {
        let data = [];  
        const { id, property_description } = req.body;
        if(!id) {
          return badRequestResponse(res, false, 'Validation Message', { fields: 'id', message: "Id must required."})
        }
        
        data['property'] = { property_description };
          
          const result = await updatePropertyDescription( id, data);
          if(result) {
              return successResponse(res, true, 'Property updated!', result);
          }
      } else if(Number.parseInt(step_id) === 5) {
        
        let { id } = req.body;
        if(!id) {
          return badRequestResponse(res, false, 'Validation Message', { fields: 'id', message: "Id must required."})
        }

        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).json({ message: 'No files uploaded' });
        }
        
            let data = [];
            data['gallery'] = [];
            console.log("files", req.files);

            Object.keys(req.files).forEach((fieldName) => {
                req.files[fieldName].forEach((file) => {
                  data['gallery'].push({ img_title: file.fieldname, img_type: file.mimetype, property_img_url: `${process.env.SERVER_UPLOAD_URL || null}${file.filename}`});
              });
            });

              const result = await updatePropertyGallery(id, data);
              if(result) {
                  return successResponse(res, true, 'Property updated!', result);
              }
      }
      else{
        return badRequestResponse(res, false, 'Wrong step id, please enter proper step id.',);  
      }
   
    } catch (error) {
      console.error("Database Error:", error);
      return badRequestResponse(res, false, 'Failed to create property!', error);
    }
};
