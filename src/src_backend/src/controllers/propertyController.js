import pool from '../config/db.js';
import * as propertyValidators from './validators/propertyValidators.js';
import { successResponse, badRequestResponse, internalServerResponse, successWithDataResponse } from '../utils/response.js';
import validator from 'validator';
import dotenv from 'dotenv';

dotenv.config();

import { 
  createAmenties, 
  createFeatures, 
  createProperty, 
  updateProperty, 
  updatePropertyBuilder,
  updatePropertyAmeneties,
  updatePropertyDescription,
  getPropertyAmenetiesById, 
  getPropertyListById, 
  getPropertyImagesById, 
  getPropertyConfigurationById,
  getAllPropertyList,
  getAllPropertyCount, 
  updatePropertySteps, 
  updatePropertyFinal, 
  getPropertyDetailsByIdAndUser,
  getPropertyFaqById,
  updatePropertySlug, 
  getPropertyCountById,
  getPropertyCountByIds,
  getPropertyNearbyLocationsById, 
  insertGeneratedNearbyLocationsData} from '../models/propertyModels.js';

import { renderEmailTemplate } from '../config/nodemailer.js';
import { sendMailTemplate } from '../config/nodemailer.js';
import { generateSlug } from '../utils/slugHelper.js';
import { sanitizedField, sanitizedNumber } from '../utils/commonHelper.js';
import axios from 'axios';


export const postProperty = async (req, res) => {
    
    try {
      // ### If error then unlink all images.
      // ### upload images within steps only = step: 1 {property_videos, property_flooring_plans, property_description} step 2: { pan_card, addhar_card, verification_document}
      // ### check if proeprty_id
      // ### validate images.

      const { step_id } = req.body;
      const errors = propertyValidators.propertyValidators(req.body);
      if(errors.length > 0)
      {
        return badRequestResponse(res, false, 'Validation Message', errors)
      }

      if(Number.parseInt(step_id) === 1){
        // Property description
        // trim all values.

        const { 
            step_id,
            property_type,
            property_rent_buy,
            user_type
          } = req.body;
                    
          const data = { 
            step_id,
            user_id: req.userId,
            property_type: property_type && sanitizedField(property_type, true, 'UPPERCASE') || null,
            property_rent_buy: property_rent_buy && sanitizedField(property_rent_buy, true, 'UPPERCASE') || null,
            user_type: user_type && sanitizedField(user_type, true, 'UPPERCASE') || null,
            ip_address : req.headers['x-forwarded-for'] || req.connection.remoteAddress || '',
            user_agent : req.headers['user-agent'] || '',
            host_name : req.headers['host'] || "" 
        };

        const result = await createProperty(data);
        if(result) {
            return successResponse(res, true, 'Property created!', result);
        }

      } else if(Number.parseInt(step_id) === 2){
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
            full_address,
            latitude,
            longitude,
            pincode,
            property_title,
            building_name,
            property_variety,
            property_variety_type,
            door_facing,
            land_area,
            land_area_unit,
            builtup_area,
            builtup_area_unit,
            rent_amount,
            rent_is_nogotiable,
            deposite_amount,
            deposite_is_negotiable,
            expected_amount,
            exected_amount_sqft,
            monthly_maintenance,
            ownership_type,
            dimension_length,
            dimension_width,
            width_facing_road,
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
            availability_duration
            } = req.body;
            
            const data = { 
              step_id,
              landmark: landmark && sanitizedField(landmark, true, "CAPITALIZE") || null,
              locality: locality && sanitizedField(locality, true) || null,
              city_id: city_id && sanitizedNumber(city_id) || null,
              city_name: city_name && sanitizedField(city_name, true, 'CAPITALIZE') || null,
              state_id : state_id && sanitizedNumber(state_id) || null,
              state_name : state_name && sanitizedField(state_name, true, 'UPPERCASE') || null,
              full_address : full_address && sanitizedField(full_address, true, 'CAPITALIZE') || null,
              latitude : latitude || null,
              longitude : longitude || null,
              pincode : pincode && sanitizedNumber(pincode) || null,
              property_title : property_title && sanitizedField(property_title, true) || null,
              building_name : building_name & sanitizedField(building_name, true , 'CAPITALIZE') || null,
              property_variety : property_variety && sanitizedField(property_variety, true, 'UPPERCASE') || null,
              property_variety_type : property_variety_type && sanitizedField(property_variety_type, true, 'UPPERCASE') || null,
            door_facing : door_facing && sanitizedField(door_facing, true, 'UPPERCASE') || null,
            land_area : land_area && sanitizedNumber(land_area, { allowDecimal: true, decimalPlaces: 2 }) || null,
            land_area_unit : land_area_unit && sanitizedField(land_area_unit, true, 'UPPERCASE') || null,
            builtup_area : builtup_area && sanitizedNumber(builtup_area, {allowDecimal: true}) || null,
            builtup_area_unit : builtup_area_unit && sanitizedField(builtup_area_unit, true, 'UPPERCASE') || null,
            rent_amount : rent_amount && sanitizedNumber(rent_amount, { allowDecimal : true}) || null,
            rent_is_nogotiable: rent_is_nogotiable || null,
            deposite_amount : deposite_amount && sanitizedNumber(deposite_amount, { allowDecimal :true }) || null,
            deposite_is_negotiable: deposite_is_negotiable || null,
            expected_amount : expected_amount && sanitizedNumber(expected_amount, { allowDecimal : true}) || null,
            exected_amount_sqft : exected_amount_sqft && sanitizedNumber(exected_amount_sqft, {allowDecimal: true}) || null,
            monthly_maintenance : monthly_maintenance && sanitizedNumber(monthly_maintenance, { allowDecimal: true}) || null,
            ownership_type : ownership_type || null,
            dimension_length: dimension_length && sanitizedNumber(dimension_length, { allowDecimal: true, decimalPlaces: 2}) || null,
            dimension_width : dimension_width && sanitizedNumber(dimension_width, {allowDecimal: true, decimalPlaces: 2}) || null,
            width_facing_road : width_facing_road && sanitizedNumber(width_facing_road, { allowDecimal: true, decimalPlaces: 2}) || null,
            bed_rooms : bed_rooms || null,
            washrooms : washrooms || null,
            balcony: balcony && sanitizedNumber(balcony) || null,
            unit_number: unit_number && sanitizedNumber(unit_number) || null,
            floor_number: floor_number && sanitizedNumber(floor_number) || null,
            total_floors : total_floors && sanitizedNumber(total_floors) || null,
            total_wing : total_wing && sanitizedNumber(total_wing) || null,
            is_wings: is_wings || null,
            wing_name : wing_name && sanitizedField(wing_name, true, 'UPPERCASE') || null,
            property_availibility_type : property_availibility_type || null,
            preferred_tenent : preferred_tenent || null,            
            property_age: property_age && sanitizedField(property_age, true, 'CAPITALIZE') || null,
            property_floors : property_floors & sanitizedNumber(property_floors) || null,
            is_maintenance : is_maintenance || null ,
            availability_date: availability_date || null,
            availability_duration: availability_duration || null
        };

        const id = req.body.id;
        const result = await updateProperty(id, data);
        if(result) {

          const title_slug = generateSlug(property_title, locality, city_name, id);

          const resultSlug = await updatePropertySlug(id, title_slug);

            return successResponse(res, true, 'Property updated!', result);
        }

      } else if(Number.parseInt(step_id) === 3) {
        // Proeprty ameneties
        
        const { 
          id,
          step_id,
          furnishing_status,
          parking,
          water_supply,
          washroom_type,
          granted_security,
          pet_allowed,
          non_veg_allowed,
          drink_allowed,
          smoke_allowed,
          pg_rules,
          sewage_connection,
          electricity_connection,
          other_amenities,
          description
        } = req.body;

        const data = { 
          step_id,
          furnishing_status : furnishing_status && sanitizedField(furnishing_status, true, 'CAPITALIZE') || null,
          parking : parking && sanitizedField(parking, true, 'CAPITALIZE') || null,
          water_supply : water_supply && sanitizedField(water_supply, true, 'CAPITALIZE') || null,
          washroom_type : washroom_type && sanitizedField(washroom_type, true, 'CAPITALIZE') || null,
          granted_security : granted_security || null,
          pet_allowed : pet_allowed || null,
          non_veg_allowed : non_veg_allowed || null,
          drink_allowed : drink_allowed || null,
          smoke_allowed : smoke_allowed || null,
          sewage_connection : sewage_connection || null,
          electricity_connection : electricity_connection || null,
          pg_rules : pg_rules && sanitizedField(pg_rules, true, 'CAPITALIZE') || null,
          other_amenities : other_amenities && sanitizedField(other_amenities, true, 'UPPERCASE') || null,
          description : description && sanitizedField(description, true) || null
        };
    
        // const id = req.body;
        const result = await updatePropertyAmeneties(id, data);
        if(result) {
            return successResponse(res, true, 'Property updated!', result);
        }
      } else if(Number.parseInt(step_id) === 4) {
        // Image uplaods
        // ### verify images
        const { 
          id,
          step_id
          } = req.body;

        const data = { 
          step_id,
        };
      
        // const id = req.body;
        const result = await updatePropertySteps(id, data);
        if(result) {
            return successResponse(res, true, 'Property updated!', result);
        }

      } else if(Number.parseInt(step_id) === 5){
        // proeprtt preview and last step
        // Image uplaods
        // ### verify proeprty details
        const { 
          id,
          step_id
          } = req.body;

        const data = { 
          step_id,
          form_status: "COMPLETED"
        };
      
        // const id = req.body;
        const result = await updatePropertyFinal(id, data);

          // ### get useremail from tbl_user, 
          // ### get proeprty details from tbl_property 
          // const mailOptions = {
          //   from: `"8Sqft Team" <${process.env.SMTP_USER}>`, 
          //   to: 'ashokambore1@8sqft.com',
          //   subject: 'Property Listed',
          //   text: `Your Property is Listed`, 
          // };
          
          // const mailParams = { name : 'Ashok', propertyName: "City Avenue",  location : "Wakad", listingId: "123" }
          // const templateData = await renderEmailTemplate('templates/propertyListed', mailParams)

          // setImmediate(async () => { 
          //   try {
          //     await sendMailTemplate(mailOptions.to, mailOptions.subject, '', templateData);
          //   } catch (error) {
          //     console.error('Error sending email:', error);
          //   }
          // });

        if(result) {
            return successResponse(res, true, 'Property updated!', result);
        }
      } else{
        return badRequestResponse(res, false, 'Wrong step id, please enter proper step id.',);  
      }
    } catch (error) {
      console.error("Database Error:", error);
      return badRequestResponse(res, false, 'Failed to create property!', error);
    }
};

export const postPropertyBuilder = async (req, res) => {
    
  try {
    // ### If error then unlink all images.
    // ### upload images within steps only = step: 1 {property_videos, property_flooring_plans, property_description} step 2: { pan_card, addhar_card, verification_document}
    // ### check if proeprty_id
    // ### validate images.

    const { step_id } = req.body;
    const errors = propertyValidators.propertyValidators(req.body);
    if(errors.length > 0)
    {
      return badRequestResponse(res, false, 'Validation Message', errors)
    }

    if(Number.parseInt(step_id) === 1){
      // Property description
      // trim all values.

      const { 
          step_id,
          property_type,
          property_rent_buy,
          company_name,
          user_type
        } = req.body;

      const data = { 
          step_id,
          user_id: req.userId,
          property_type: property_type && sanitizedField(property_type, true, 'UPPERCASE') || null,
          company_name: company_name && sanitizedField(company_name, true, 'CAPITALIZE') || null,
          property_rent_buy: property_rent_buy && sanitizedField(property_rent_buy, true, 'UPPERCASE') || null,
          user_type: user_type && sanitizedField(user_type, true, 'UPPERCASE') || null,
          ip_address : req.headers['x-forwarded-for'] || req.connection.remoteAddress || '',
          user_agent : req.headers['user-agent'] || '',
          host_name : req.headers['host'] || "" 
      };

      const result = await createProperty(data);
      if(result) {
          return successResponse(res, true, 'Property created!', result);
      }

    } else if(Number.parseInt(step_id) === 2){
      const { 
          step_id,
          landmark,
          locality,
          city_id,
          city_name,
          state_id,
          state_name,
          full_address,
          contact_no,
          latitude,
          longitude,
          pincode,
          property_title,
          building_name,
          property_type,
          property_variety,
          property_current_status,
          possession_date,
          is_rera_number,
          rera_number,
          total_towers,
          total_units,
          total_floors,
          builtup_area,
          builtup_area_unit,
          project_area,
          project_area_unit,
          per_sqft_amount,
          width_facing_road,
          property_age,
          } = req.body;

      const data = { 
          step_id,
          landmark: landmark && sanitizedField(landmark, true, 'CAPITALIZE') || null,
          locality: locality && sanitizedField(locality, true) || null,
          city_id: city_id && sanitizedNumber(city_id) || null,
          city_name: city_name && sanitizedField(city_name, true, 'CAPITALIZE') || null,
          state_id : state_id && sanitizedNumber(state_id) || null,
          state_name : state_name && sanitizedField(state_name, true, 'UPPERCASE') || null,
          full_address : full_address && sanitizedField(full_address, true, 'CAPITALIZE') || null,
          contact_no : contact_no && sanitizedNumber(contact_no, { }) || null,
          latitude : latitude || null,
          longitude : longitude || null,
          pincode : pincode && sanitizedNumber(pincode) || null,
          property_title : property_title && sanitizedField(property_title, true) || null,
          building_name : building_name || null,
          property_type : property_type && sanitizedField(property_type, true, 'UPPERCASE' )|| null,
          property_variety : property_variety && sanitizedField(property_variety, true, 'UPPERCASE') || null,
          property_current_status : property_current_status && sanitizedField(property_current_status, true, 'CAPITALIZE') || null,
          possession_date : possession_date && sanitizedField(possession_date, true, 'LOWERCASE' ) || null, 
          is_rera_number: is_rera_number || null,
          rera_number : rera_number && sanitizedField(rera_number, true, 'UPPERCASE') || null,
          total_towers : total_towers && sanitizedNumber(total_towers) || null,
          total_units : total_units && sanitizedNumber(total_units) || null,
          total_floors : total_floors && sanitizedNumber(total_floors) || null,
          builtup_area : builtup_area && sanitizedNumber(builtup_area, {allowDecimal: true}) || null,
          builtup_area_unit : builtup_area_unit && sanitizedField(builtup_area_unit, true, 'UPPERCASE') || null,
          width_facing_road : width_facing_road && sanitizedNumber(width_facing_road, { allowDecimal: true, decimalPlaces: 2}) || null,
          project_area : project_area && sanitizedNumber(project_area, { allowDecimal: true, decimalPlaces: 2}) || null,
          project_area_unit : project_area_unit && sanitizedField(project_area_unit, true, 'UPPERCASE') || null,
          per_sqft_amount : per_sqft_amount && sanitizedNumber(per_sqft_amount, { allowDecimal: true, decimalPlaces: 2}) || null,
          property_age: property_age && sanitizedField(property_age, true, 'CAPITALIZE') || null,
      };

      const id = req.body.id;
      const result = await updatePropertyBuilder(id, data);

      if(result) {
         const title_slug = generateSlug(property_title, locality, city_name, id);
         await updatePropertySlug(id, title_slug);
         return successResponse(res, true, 'Property updated!', result);
      }

    } else if(Number.parseInt(step_id) === 3) {
      // Proeprty ameneties
      
      const { 
        id,
        step_id,
        furnishing_status,
        parking,
        water_supply,
        washroom_type,
        granted_security,
        sewage_connection,
        electricity_connection,
        other_amenities,
        description
      } = req.body;
      
      const data = { 
        step_id,
        furnishing_status : furnishing_status && sanitizedField(furnishing_status, true, 'CAPITALIZE') || null,
        parking : parking && sanitizedField(parking, true, 'CAPITALIZE') || null,
        water_supply : water_supply && sanitizedField(water_supply, true, 'CAPITALIZE') || null,
        washroom_type : washroom_type && sanitizedField(washroom_type, true, 'CAPITALIZE') || null,
        granted_security : granted_security || null,
        pet_allowed : null,
        non_veg_allowed : null,
        drink_allowed : null,
        smoke_allowed : null,
        pg_rules : null,
        sewage_connection : sewage_connection || null,
        electricity_connection : electricity_connection || null,
        other_amenities : other_amenities && sanitizedField(other_amenities, true, 'UPPERCASE') || null,
        description : description && sanitizedField(description, true) || null
      };
  
      // const id = req.body;
      const result = await updatePropertyAmeneties(id, data);
      if(result) {
          return successResponse(res, true, 'Property updated!', result);
      }
    } else if(Number.parseInt(step_id) === 4) {
      // Image uplaods
      // ### verify images
      const { 
        id,
        step_id
        } = req.body;

      const data = { 
        step_id,
      };
    
      // const id = req.body;
      const result = await updatePropertySteps(id, data);
      if(result) {
          return successResponse(res, true, 'Property updated!', result);
      }

    } else if(Number.parseInt(step_id) === 5){
      // property preview and last step
      // Image uplaods
      // ### verify proeprty details
      const { 
        id,
        step_id
        } = req.body;

      const data = { 
        step_id,
        form_status: "COMPLETED"
      };
    
      // const id = req.body;
      const result = await updatePropertyFinal(id, data);

        // // ### get useremail from tbl_user, 
        // // ### get proeprty details from tbl_property 
        // // ### send via whatsapp also.
        // const mailOptions = {
        //   from: `"8Sqft Team" <${process.env.SMTP_USER}>`, 
        //   to: 'ashokambore1@8sqft.com',
        //   subject: 'Property Listed',
        //   text: `Your Property is Listed`, 
        // };
        
        // const mailParams = { name : 'Ashok', propertyName: "City Avenue",  location : "Wakad", listingId: "123" }
        // const templateData = await renderEmailTemplate('templates/propertyListed', mailParams)

        // setImmediate(async () => { 
        //   try {
        //     await sendMailTemplate(mailOptions.to, mailOptions.subject, '', templateData);
        //   } catch (error) {
        //     console.error('Error sending email:', error);
        //   }
        // });

      if(result) {
          return successResponse(res, true, 'Property updated!', result);
      }
    } else{
      return badRequestResponse(res, false, 'Wrong step id, please enter proper step id.',);  
    }
  } catch (error) {
    console.error("Database Error:", error);
    return badRequestResponse(res, false, 'Failed to create property!', error);
  }
};

export const getProperty = async (req, res) => {
    try {
      
        let data = {};
          const searchName  = req.query.searchName || ""; 
          const page        = parseInt(req.query.page) || 1;
          const limit       = parseInt(req.query.limit) || 10;
          const offset      = (page - 1) * limit;
    
        let searchQuery = "WHERE 1 = 1"; 
    
        if (searchName) {
          searchQuery += ` AND property_title LIKE '%${searchName}%' AND building_name LIKE '%${searchName}%'`;
        }
    
        const totalCountQuery = `SELECT COUNT(*) AS count FROM tbl_property ${searchQuery}`;
        const propertyQuery = `SELECT * FROM tbl_property ${searchQuery} LIMIT ${limit} OFFSET ${offset}`;
    
        const [[totalCountResult]] = await pool.query(totalCountQuery);
        const totalCount = totalCountResult.count;
        data['totalCounts'] = totalCount;
    
        const [amenties] = await pool.query(propertyQuery);
        data['property'] = amenties;
    
        const totalPages = Math.ceil(totalCount / limit);
        const startIndex = offset + 1;
        const endIndex   = Math.min(offset + limit, totalCount);
        data['totalPages'] = totalPages;
        data['startIndex'] = startIndex;
        data['endIndex'] = endIndex;
    
        return successWithDataResponse(res, true, "Property list", data);
      } 
      catch (error) 
      {
        console.error(error);
        return badRequestResponse(res, false, 'Error fetching property!', error);
      }
};

export const getAllProperty = async (req, res) => {
  try {
    let data = {};
    const { page, limit } = req.query;
    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 100;
    const offset = (pageCount - 1) * limitCount;

    const filters = req.query;
    let whereClauses = [];

    if (filters?.property_type) {
      whereClauses.push(`tp.property_type = '${validator.escape(filters.property_type) }'`);
    }
    if (filters?.property_variety) {
      whereClauses.push(`tp.property_variety = '${validator.escape(filters.property_variety) }'`);
    }

    if (filters?.property_rent_buy) {
      whereClauses.push(`tp.property_rent_buy = '${validator.escape(filters.property_rent_buy) }'`);
    }

    if (filters?.property_availibility_type) {
      whereClauses.push(`tp.property_availibility_type = '${validator.escape(filters.property_availibility_type) }'`);
    }

    if (filters?.furnishing) {
      whereClauses.push(`tp.furnishing_status = '${ validator.escape(filters.furnishing)}'`);
    }
    
    if (filters?.availability_date) {
      whereClauses.push(`tp.availability_date = '${validator.escape(filters.availability_date) }'`);
    }

    if (filters?.city_name) {
      whereClauses.push(`tp.city_name = '${validator.escape(filters.city_name) }'`);
    }
    if (filters?.state_name) {
      whereClauses.push(`tp.state_name = '${validator.escape(filters.state_name) }'`);
    }
    if (filters?.landmark) {
      whereClauses.push(`tp.landmark LIKE '%${validator.escape(filters.landmark)}%'`);
    }
    
    if (filters?.property_variety_type) {
      const updatedVarityType = filters.property_variety_type.split(',').map(item => (`${item.trim()}`));
      const sanitizedVarityType = updatedVarityType.map(
        variety_type => `'${variety_type.replace(/'/g, "''")}'`
      ) .join(',');
      whereClauses.push(`tp.property_variety_type IN (${sanitizedVarityType})`);
    }

    if (filters?.locality) {
      const updatedLocality = filters.locality.split(',').map(item => (`${item.trim()}`));
      const sanitizedLocality = updatedLocality.map(
        locality => `'${locality.replace(/'/g, "''")}'`
      ) .join(',');
      whereClauses.push(`tp.locality IN (${sanitizedLocality})`);
    }

    if (filters?.preferred_tenent) {
      const updatedPreferredTenent = filters.preferred_tenent.split(',').map(item => (`${item.trim()}`));
      const sanitizedPreferredTenent = updatedPreferredTenent.map(
        tenent => `'${tenent.replace(/'/g, "''")}'`
      ) .join(',');
      whereClauses.push(`tp.preferred_tenent IN (${sanitizedPreferredTenent})`);
    }

    if (filters?.parking) {
      const updatedparking = filters.parking.split(',').map(item => (`${item.trim()}`));
      const sanitizedparking = updatedparking.map(
        tenent => `'${tenent.replace(/'/g, "''")}'`
      ) .join(',');
      whereClauses.push(`tp.parking IN (${sanitizedparking})`);
    }

    if (filters?.other_amenities) {
      const updatedAmenities = filters.other_amenities.split(',').map(item => item.trim());
    
      const sanitizedAmenities = updatedAmenities.map(amenity => 
        `FIND_IN_SET('${amenity.replace(/'/g, "''")}', tp.other_amenities)`
      ).join(' OR ');
    
      whereClauses.push(`(${sanitizedAmenities})`);
    }

    if (filters?.pincode) {
      whereClauses.push(`tp.pincode = '${validator.escape(filters.pincode)}'`);
    }

    if (filters?.is_rera_number !== undefined && filters?.is_rera_number !== null) {
      whereClauses.push(`tp.is_rera_number = '${filters.is_rera_number }'`);
    }
    if (filters?.property_current_status) {
      whereClauses.push(`tp.property_current_status = '${validator.escape(filters.property_current_status) }'`);
    }
    
    if (filters?.amount_range) {
      const [min, max] = filters.amount_range.split('-').map(Number);
    
      if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0) {
        return badRequestResponse(res, false, 'Amount range must be a positive number!');
      }
    
      whereClauses.push(`
        tp.rent_amount BETWEEN ${sanitizedNumber(min, { allowDecimal: 2, allowNegative: false })} 
        AND ${sanitizedNumber(max, { allowDecimal: 2, allowNegative: false })}
      `);
    }

    if (filters?.width_facing_road) {
      const [min, max] = filters.	width_facing_road.split('-').map(Number);
      if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0) {
        return badRequestResponse(res, false, 'Range must be a positive number!');
      }
      
      whereClauses.push(`
        tp.width_facing_road BETWEEN ${sanitizedNumber(min, { allowDecimal: 2, allowNegative: false })} 
        AND ${sanitizedNumber(max, { allowDecimal: 2, allowNegative: false })}
      `);
    }

    if (filters?.project_area) {
      const [min, max] = filters.	project_area.split('-').map(Number);
      if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0) {
        return badRequestResponse(res, false, 'Range must be a positive number!');
      }
      
      whereClauses.push(`
        tp.project_area BETWEEN ${sanitizedNumber(min, { allowDecimal: 2, allowNegative: false })} 
        AND ${sanitizedNumber(max, { allowDecimal: 2, allowNegative: false })}
      `);
    }

    // Unit config filters
    if (filters?.price_range) {
      const [min, max] = filters.price_range.split('-').map(Number);
      if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0) {
        return badRequestResponse(res, false, 'Range must be a positive number!');
      }
      
      whereClauses.push(`
        tpuc.carpet_price BETWEEN ${sanitizedNumber(min, { allowDecimal: 2, allowNegative: false })} AND ${sanitizedNumber(max, { allowDecimal: 2, allowNegative: false })}
      `);
    }

    if (filters?.property_config_type) {
      const updatedUnitNameType = filters.property_config_type.split(',').map(item => (`${item.trim()}`));
      const sanitizedUnitNameType = updatedUnitNameType.map(
        unitName => `'${unitName.replace(/'/g, "''")}'`
      ) .join(',');
      whereClauses.push(`tpuc.unit_name IN (${sanitizedUnitNameType})`);
    }

    whereClauses.push(`tp.status = '2'`);
    whereClauses.push(`tp.is_deleted = '0'`);

    let baseQuery = whereClauses.length > 0 ? ` WHERE ` + whereClauses.join(' AND ') : '';

    const allowedColumns = ['id', 'rent_amount', 'availability_date', 'created_at'];
    const allowedOrders = ['ASC', 'DESC'];
    const sortColumn = allowedColumns.includes(filters.sortColumn) ? filters.sortColumn : 'tp.id';
    const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase()) ? filters.sortOrder?.toUpperCase() : 'DESC';

    const propertyResult = await getAllPropertyList(baseQuery, pageCount, limitCount, sortColumn, sortOrder);
    const propertyTotalCount = await getAllPropertyCount(baseQuery);
    let ids = propertyResult.map((i) => `${i.id}`);

    let resultCountProperty = await getPropertyCountByIds(ids);

    let jsonLdArray = [];

    let newUpdatedProperty = propertyResult.map((item) => {
      let findProperty = resultCountProperty.find((i) => i.property_id === item.id);
      if (findProperty) {
        item.unique_view_count = (item.unique_view_count || 0) + (findProperty?.views || 0);
      }

      // Convert images to ImageObject format
      let imageArray = {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        "contentUrl": item.property_img_url || "",
        "name": item.property_title || "Property Image",
        "description": item.meta_description,
        "author": {
          "@type": "Organization",
          "name": "8sqft.com"
        },
        "datePublished": new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        "license": "",
        "height": "1080",
        "width":  "1920"
      };

      // JSON-LD Schema stored separately
      jsonLdArray.push({
        "@context": "https://schema.org",
        "@type": "ApartmentComplex",
        "name": item.property_title || "Property Details",
        "description": item.meta_description,
        "image": imageArray, // Using ImageObject format
        "url": `https://8sqft.com/Property/${item.title_slug}`,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": item.address || "",
          "addressLocality": item.city_name || "",
          "addressRegion": item.state_name || "",
          "postalCode": item.zip_code || "",
          "addressCountry": item.country || "India"
        },
        "offers": {
          "@type": "Offer",
          "price": item.price || "Contact for price",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock"
        }
      });

      return item;
    });

    data['meta_title'] = "Find the Best Properties for Rent and Sale in Maharashtra | www.8sqft.com";
    data['meta_description'] = "Explore a wide range of properties for rent and sale in Maharashtra. Find your dream home with verified listings, affordable prices, and top amenities.";
    data['property'] = newUpdatedProperty;
    data['jsonLdSchema'] = jsonLdArray;  // JSON-LD stored in a separate array
    data['totalCounts'] = propertyTotalCount;
    data['totalPages'] = Math.ceil(propertyTotalCount / limitCount);
    data['startIndex'] = offset + 1;
    data['endIndex'] = Math.min(offset + limitCount, propertyTotalCount);

    return successWithDataResponse(res, true, "Property list", data);
  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, 'Error fetching property!', error);
  }
};

export const getPropertyById = async (req, res) => {
  try {    
    let data = {};
    const searchId = req.params.id || null;
  
    if (!searchId) {
      return badRequestResponse(res, false, 'Property id required with request!');
    }

    let [resultProperty] = await getPropertyListById(searchId);
    let [resultCountProperty] = await getPropertyCountById(searchId);

    if (resultCountProperty) {
      resultProperty = {
        ...resultProperty,
        unique_view_count:
          (resultProperty.unique_view_count || 0) + (resultCountProperty?.views || 0),
        intrestedCount:
          (resultProperty.intrestedCount || 0) + (resultCountProperty?.contact || 0),
        shortlistedCount:
          (resultProperty.shortlistedCount || 0) + (resultCountProperty?.shortlist || 0),
      };
    }

    if (!resultProperty) {
      return badRequestResponse(res, false, 'No Property found!');
    }

    data = resultProperty;

    // Handle images
    const excludedCategories = [
      'Light Bill',
      'Property Tax',
      'Water Bill',
      'Property Agreement',
      'Power of Attorney',
      '7/12 or 8A',
      'Plan'
    ];

    const resultImages = await getPropertyImagesById(searchId);
    const filteredImages = resultImages.filter(img => !excludedCategories.includes(img.image_category));
    data['images'] = filteredImages;

    const configurationImages = await getPropertyConfigurationById(searchId);
    data['configuration'] = configurationImages;

    const propertyFaq = await getPropertyFaqById(searchId);
    data['faq'] = propertyFaq;

    const nearbyLocations = await getPropertyNearbyLocationsById(searchId);
    data['nearbyLocations'] = nearbyLocations || [];

    // SEO Handling
    if (!data.meta_title) {
      data.meta_title = data.property_title || `Property ${searchId}`;
    }

    if (!data.meta_description) {
      data.meta_description = data.description 
        ? data.description.substring(0, 160).replace(/\s+/g, ' ')+ "..." 
        : "Property details available.";
    }

    let canon_url;
    if (data.user_type === 'BUILDER') {
      canon_url = `https://8sqft.com/Builder/${data.title_slug.replace(/\s+/g, '-')}`;
    } else {
      canon_url = `https://8sqft.com/PropertyDetailsPage/${data.title_slug.replace(/\s+/g, '-')}`;
    }

    // JSON-LD Schema with ImageObject
    data.jsonLdSchema = {
      "@context": "https://schema.org",
      "@type": data.property_type || "Property",
      "name": data.property_title || "Property Details",
      "description": (data.meta_description || data.short_description || "Property details available.").replace(/\s+/g, ' ').trim(),
      "image": data.images.length > 0 
        ? data.images.map(img => ({
            "@type": "ImageObject",
            "contentUrl": img.property_img_url,
            "name": img.image_category || "Property Image",
            "description": data.property_title || "Property Image",
            "height": img.image_height || "1080",
            "width": img.image_width || "1920"
          }))
        : [],
      "url": canon_url || "https://8sqft.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": data.full_address || "",
        "addressLocality": data.locality || "",
        "addressRegion": data.state_name || "",
        "postalCode": data.pincode || "",
        "addressCountry": data.country || "India"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": data.latitude || "",
        "longitude": data.longitude || ""
      },
      "numberOfRooms": data.total_units || 0,
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": data.builtup_area || "",
        "unitCode": "SQM"
      },
      "offers": {
        "@type": "Offer",
        "price": data.rent_amount || data.per_sqft_amount || "Contact for price",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      },
      "provider": {
        "@type": "Organization",
        "name": "8sqft",
        "url": "https://8sqft.com",
        "logo": "https://8sqft.com/assets/logo/ForWebSiteWhite.svg"
      }
    };

    return successWithDataResponse(res, true, "Property Details.", data);
  } 
  catch (error) {
    console.error(error);
    return badRequestResponse(res, false, 'Error fetching property!', error);
  }
};


export const updatePropertyViewCount = async (req, res) => {
  try {
    const propertyId = req.params.id;

    if (!propertyId) {
      return badRequestResponse(res, false, "Property ID is required.");
    }

    const incrementViewCountQuery = `UPDATE tbl_property SET unique_view_count = unique_view_count + 1 WHERE id = ?`;
    const [result] = await pool.execute(incrementViewCountQuery, [propertyId]);

    if(result.affectedRows == 0) {
      return badRequestResponse(res, false, "Property id not found or wrong id.");
    }
    return successWithDataResponse(res, true, "View count updated successfully.", result);
  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, "Error updating view count.", error);
  }
};

export const getAuthorizedPropertyById = async (req, res) => {
  try {    
    let data = {};
    const searchId = req.params.id || null;
    // const searchId  = req.query.id || null;  
      if (!searchId) {
        return badRequestResponse(res, false, 'Property id requred with request!');
      }
  
      const [resultProperty] = await getPropertyDetailsByIdAndUser(searchId, req.userId);
      data = resultProperty;
      if(resultProperty) {
        const resultImages = await getPropertyImagesById(searchId);
        data['images'] = resultImages;
        
        const configurationImages = await getPropertyConfigurationById(searchId);
        data['configuration'] = configurationImages;
      }

      if(data) {
        return successWithDataResponse(res, true, "Property Details.", data);
      }
      return badRequestResponse(res, false, 'No Property found!');
    } 
    catch (error) 
    {
      console.error(error);
      return badRequestResponse(res, false, 'Error fetching property!', error);
    }
};

export const getReviewsByPropertyId = async (req, res) => {
  const { id } = req.params;
  let data = {};
  if (!id) {
    return badRequestResponse(res, false, 'Property ID is required' );
  }
  try {
      const [reviews] = await pool.execute(
          `SELECT r.*, u.fname, u.lname, u.profile_picture_url 
           FROM tbl_property_review r 
           JOIN tbl_users u ON r.user_id = u.id 
           WHERE r.property_id = ? AND r.status = '1'`,
          [id]
      );
      
      const [[{ total_reviews }]] = await pool.execute(
          `SELECT COUNT(*) AS total_reviews FROM tbl_property_review WHERE property_id = ? AND status = '1'`,
          [id]
      );
      
      let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let totalRating = 0;

      reviews.forEach(({ rating }) => {
        const floatRating = parseFloat(rating);

        const roundedRating = Math.round(floatRating);
    
        ratingDistribution[roundedRating] = (ratingDistribution[roundedRating] || 0) + 1;
        totalRating += floatRating;
    });
    
    const averageRating = total_reviews > 0 ? parseFloat((totalRating / total_reviews).toFixed(1)) : 0;
      data['reviews'] = reviews;
      data['rating_distribution'] = ratingDistribution;
      data['average_rating'] = averageRating;
      data['total_count'] = total_reviews;

      return successWithDataResponse(res, true, 'review list:', data)

  } catch (error) {
    return badRequestResponse(res, false, 'Error fetching reviews' );
  }
};

export const submitReview = async (req, res) => {
  const { property_id, rating, review } = req.body;
  const user_id = req.userId;

  if (!property_id || !rating || rating < 1 || rating > 5 || !review) {
    return badRequestResponse(res, false, 'Missing required fields')
  }

  try {
      const [existingReview] = await pool.execute(
          'SELECT id FROM tbl_property_review WHERE user_id = ? AND property_id = ?',
          [user_id, property_id]
      );

      if (existingReview.length > 0) {
          const [result] = await pool.execute(
              'UPDATE tbl_property_review SET rating = ?, review = ? WHERE user_id = ? AND property_id = ?',
              [rating, review, user_id, property_id]
          );
          if(result.affectedRows > 0) {
            return successWithDataResponse(res, true, 'Review updated successfully')
          }
          return badRequestResponse(res, false, 'User or property id have issue, Unable to update review.')
      } else {
          const [result] = await pool.execute(
              'INSERT INTO tbl_property_review (user_id, property_id, rating, review) VALUES (?, ?, ?, ?)',
              [user_id, property_id, rating, review]
          );
          if(result.affectedRows > 0) {
            return successWithDataResponse(res, true, 'Review submitted successfully')
          }
          return badRequestResponse(res, false, 'User or property id have issue, Unable to create review.')
      }

  } catch (error) {
      return badRequestResponse(res, false, 'Error submitting review')
  }
};

    // const newCategoryKeywords = {
    //   Transit: [
    //     'bus station', 'railway station', 'airport', 'metro station',
    //     'tram station', 'taxi stand', 'ferry terminal', 'truck stop', 'bicycle stand'
    //   ],
    //   Essential: [
    //     'hospital', 'clinic', 'pharmacy', 'convenience store', // for "Mini Store"
    //     'school', 'university', 'police station', 'fire station',
    //     'post office', 'government office'
    //   ],
    //   Utility: [
    //     'power station', 'water treatment plant', 'telecom tower',
    //     'waste collection center', 'fuel station', 'bank', // covers bank branch
    //     'toll plaza', 'data center', 'atm', 'shopping mall',
    //     'movie theater', 'ev charging station', 'multiplex', 'inox', 'pvr'
    //   ],
    //   Showrooms: [
    //     'vehicle showroom',
    //     'car showroom',
    //     'bike showroom',
    //     'motorcycle showroom',
    //     'auto showroom'
    //   ]
    // };


// export const getNearbyLocations = async (req, res) => {
//   const id = req.params.id;
  
//   if (!id) {
//   return badRequestResponse(res, false, 'Property ID is required');
//   }
  
//   try {
//   // Step 1: Get latitude & longitude for the property
//   const [propertyRows] = await pool.execute(
//   'SELECT latitude, longitude FROM tbl_property WHERE id = ?',
//   [id]
//   );
  
//   if (propertyRows.length === 0) {
//   return badRequestResponse(res, false, 'Property not found');
//   }
  
//   const { latitude, longitude } = propertyRows[0];
  
//   // Step 2: Get location types and categories
//   const [locationRows] = await pool.execute(
//   'SELECT locations_name as location_type, location_categories as category FROM tbl_master_nearby_locations'
//   );
  
//   if (locationRows.length === 0) {
//   return badRequestResponse(res, false, 'No location types defined');
//   }
  
//   // Step 3: Build category-wise keywords
//   const categoryKeywords = {};
//   for (const row of locationRows) {
//   if (!categoryKeywords[row.category]) {
//   categoryKeywords[row.category] = [];
//   }
//   categoryKeywords[row.category].push(row.location_type);
//   }
  
//   const radius = 50000; // 5 KM
//   const groupedResults = {};
  
//   for (const [category, keywords] of Object.entries(categoryKeywords)) {
//   groupedResults[category] = [];
  
//   for (const keyword of keywords) {
//   const overpassUrl = `https://overpass-api.de/api/interpreter`;
  
//   const query = `[out:json];
//   node(around:${radius},${latitude},${longitude})[name]["amenity"="${keyword.replace(' ','_').toLowerCase()}" ];
//   out body;`;
//   console.log(keyword.replace(' ','_').toLowerCase(), radius, latitude, longitude, "reponse")
  
//   const response = await axios.post(overpassUrl, query, {
//   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//   });
  
//   const elements = response.data.elements || [];
//   console.log(elements, "reponse route")

//   const locations = await Promise.all(elements.slice(0, 5).map(async (place) => {
//   const distRes = await axios.get('https://router.project-osrm.org/route/v1/driving/' +
//   `${longitude},${latitude};${place.lon},${place.lat}?overview=false`);
  
//   const route = distRes.data.routes[0];
//   console.log(route, "reponse route")
//   return {
//   name: place.tags.name || 'Unnamed',
//   address: `${place.tags.amenity || keyword}`,
//   location: {
//   lat: place.lat,
//   lng: place.lon,
//   },
//   types: keyword,
//   type_match: keyword,
//   distance_text: route?.distance ? `${(route.distance / 1000).toFixed(1)} km` : '',
//   duration_text: route?.duration ? `${Math.ceil(route.duration / 60)} min` : '',
//   };
//   }));
  
//   groupedResults[category].push(...locations);
//   }
//   }
  
//   return successWithDataResponse(res, true, 'Nearby locations grouped by category', groupedResults);
  
//   } catch (error) {
//   console.error('Nearby Location Error:', error.message);
//   return badRequestResponse(res, false, 'Error fetching nearby locations');
//   }
//   };

