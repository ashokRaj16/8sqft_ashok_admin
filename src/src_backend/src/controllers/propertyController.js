import pool from '../config/db.js';
import * as propertyValidators from './validators/propertyValidators.js';
import { successResponse, badRequestResponse, internalServerResponse, successWithDataResponse } from '../utils/response.js';
import validator from 'validator';
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
  getPropertyListByIdAndUser } from '../models/propertyModels.js';

import { renderEmailTemplate } from '../config/nodemailer.js';
import { sendMailTemplate } from '../config/nodemailer.js';

export const postProperty = async (req, res) => {
    
    try {
      // console.log(req.body.step_id)
      // ### If error then unlink all images.
      // ### upload images within steps only = step: 1 {property_videos, property_flooring_plans, property_description} step 2: { pan_card, addhar_card, verification_document}
      // ### check if proeprty_id
      // ### validate images.

      const { step_id } = req.body;
      const errors = propertyValidators.propertyValidators(req.body);
      // console.log("Body: ",req.body);
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
            property_type: property_type?.toUpperCase() || null,
            property_rent_buy: property_rent_buy?.toUpperCase() || null,
            user_type: user_type.toUpperCase() || null,
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
            landmark: landmark || null,
            locality: locality || null,
            city_id: parseInt( city_id) || null,
            city_name: city_name || null,
            state_id : parseInt( state_id ) || null,
            state_name : state_name || null,
            latitude : latitude || null,
            longitude : longitude || null,
            pincode : pincode || null,
            property_title : property_title || null,
            building_name : building_name || null,
            property_variety : property_variety || null,
            property_variety_type : property_variety_type || null,
            door_facing : door_facing || null,
            land_area : land_area || null,
            land_area_unit : land_area_unit || null,
            builtup_area : builtup_area || null,
            builtup_area_unit : builtup_area_unit || null,
            rent_amount : rent_amount || null,
            rent_is_nogotiable: rent_is_nogotiable || null,
            deposite_amount : deposite_amount || null,
            deposite_is_negotiable: deposite_is_negotiable || null,
            expected_amount : expected_amount || null,
            exected_amount_sqft : exected_amount_sqft || null,
            monthly_maintenance : monthly_maintenance || null,
            ownership_type : ownership_type || null,
            dimension_length: dimension_length || null,
            dimension_width : dimension_width || null,
            width_facing_road : width_facing_road || null,
            bed_rooms : bed_rooms || null,
            washrooms : washrooms || null,
            balcony: balcony || null,
            unit_number: unit_number || null,
            floor_number: floor_number || null,
            total_floors : total_floors || null,
            total_wing : total_wing || null,
            wing_name : wing_name || null,
            property_availibility_type : property_availibility_type || null,
            preferred_tenent : preferred_tenent || null,
            property_age : property_age || null,
            property_floors : property_floors || null,
            is_wings: is_wings || null,
            is_maintenance : is_maintenance || null ,
            availability_date: availability_date || null,
            availability_duration: availability_duration || null
        };

        const id = req.body.id;
        const result = await updateProperty(id, data);
        if(result) {
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
          furnishing_status : furnishing_status || null,
          parking : parking || null,
          water_supply : water_supply || null,
          washroom_type : washroom_type || null,
          granted_security : granted_security || null,
          pet_allowed : pet_allowed || null,
          non_veg_allowed : non_veg_allowed || null,
          drink_allowed : drink_allowed || null,
          smoke_allowed : smoke_allowed || null,
          pg_rules : pg_rules || null,
          sewage_connection : sewage_connection || null,
          electricity_connection : electricity_connection || null,
          other_amenities : other_amenities || null,
          description : description || null
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
          //     console.log('Email sent successfully');
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
    // console.log(req.body.step_id)
    // ### If error then unlink all images.
    // ### upload images within steps only = step: 1 {property_videos, property_flooring_plans, property_description} step 2: { pan_card, addhar_card, verification_document}
    // ### check if proeprty_id
    // ### validate images.

    const { step_id } = req.body;
    const errors = propertyValidators.propertyValidators(req.body);
    // console.log("Body: ",req.body);
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
          property_type: property_type || null,
          company_name: company_name || null,
          property_rent_buy: property_rent_buy?.toUpperCase() || null,
          user_type: user_type.toUpperCase() || null,
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
      console.log(req.body);
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
          landmark: landmark || null,
          locality: locality || null,
          city_id: parseInt( city_id) || null,
          city_name: city_name || null,
          state_id : parseInt( state_id ) || null,
          state_name : state_name || null,
          latitude : latitude || null,
          longitude : longitude || null,
          pincode : pincode || null,
          property_title : property_title || null,
          building_name : building_name || null,
          property_type : property_type || null,
          property_variety : property_variety || null,
          property_current_status : property_current_status || null,
          possession_date : possession_date || null, 
          is_rera_number: is_rera_number || null,
          rera_number : rera_number || null,
          total_towers : total_towers || null,
          total_units : total_units || null,
          total_floors: total_floors || null,
          builtup_area: builtup_area || null,
          builtup_area_unit: builtup_area_unit || null,
          width_facing_road: width_facing_road || null,
          project_area : project_area || null,
          project_area_unit : project_area_unit || null,
          per_sqft_amount : per_sqft_amount || null,
          property_age: property_age || null,
      };

      const id = req.body.id;
      const result = await updatePropertyBuilder(id, data);
      if(result) {
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
        furnishing_status : furnishing_status || null,
        parking : parking || null,
        water_supply : water_supply || null,
        washroom_type : washroom_type || null,
        granted_security : granted_security || null,
        pet_allowed : null,
        non_veg_allowed : null,
        drink_allowed : null,
        smoke_allowed : null,
        pg_rules : null,
        sewage_connection : sewage_connection || null,
        electricity_connection : electricity_connection || null,
        other_amenities : other_amenities || null,
        description : description || null
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
        //     console.log('Email sent successfully');
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
    const pageCount         = parseInt(page) || 1;
    const limitCount        = parseInt(limit) || 100;
    const offset          = (page - 1) * limit;

    // ## add order by here //done

    const filters = req.query;
    let whereClauses = [];
    
    // if (filters?.property_variety_type) {
    //   whereClauses.push(`property_variety_type = '${ validator.escape(filters.property_variety_type)}'`);
    // }
    
    if (filters?.property_type) {
      whereClauses.push(`property_type = '${validator.escape(filters.property_type) }'`);
    }

    if (filters?.property_variety) {
      whereClauses.push(`property_variety = '${validator.escape(filters.property_variety) }'`);
    }

    if (filters?.property_rent_buy) {
      whereClauses.push(`property_rent_buy = '${validator.escape(filters.property_rent_buy) }'`);
    }

    if (filters?.property_availibility_type) {
      whereClauses.push(`property_availibility_type = '${validator.escape(filters.property_availibility_type) }'`);
    }

    if (filters?.furnishing) {
      whereClauses.push(`furnishing_status = '${ validator.escape(filters.furnishing)}'`);
    }
    
    if (filters?.availability_date) {
      whereClauses.push(`availability_date = '${validator.escape(filters.availability_date) }'`);
    }

    if (filters?.city_name) {
      whereClauses.push(`city_name = '${validator.escape(filters.city_name) }'`);
    }

    if (filters?.state_name) {
      whereClauses.push(`state_name = '${validator.escape(filters.state_name) }'`);
    }

    if (filters?.landmark) {
      whereClauses.push(`landmark like '%${validator.escape(filters.landmark) }%'`);
    }
    
    if (filters?.property_variety_type) {
      const updatedVarityType = filters.property_variety_type.split(',').map(item => (`${item.trim()}`));
      const sanitizedVarityType = updatedVarityType.map(
        variety_type => `'${variety_type.replace(/'/g, "''")}'`
      ) .join(',');
      whereClauses.push(`property_variety_type IN (${sanitizedVarityType})`);
    }

    // used for postal names. 
    // ### need to update for selecting multiple areas. //done
    if (filters?.locality) {
      const updatedLocality = filters.locality.split(',').map(item => (`${item.trim()}`));
      const sanitizedLocality = updatedLocality.map(
        locality => `'${locality.replace(/'/g, "''")}'`
      ) .join(',');
      whereClauses.push(`locality IN (${sanitizedLocality})`);
    }

    if (filters?.preferred_tenent) {
      const updatedPreferredTenent = filters.preferred_tenent.split(',').map(item => (`${item.trim()}`));
      const sanitizedPreferredTenent = updatedPreferredTenent.map(
        tenent => `'${tenent.replace(/'/g, "''")}'`
      ) .join(',');
      whereClauses.push(`preferred_tenent IN (${sanitizedPreferredTenent})`);
    }

    if (filters?.parking) {
      const updatedparking = filters.parking.split(',').map(item => (`${item.trim()}`));
      const sanitizedparking = updatedparking.map(
        tenent => `'${tenent.replace(/'/g, "''")}'`
      ) .join(',');
      whereClauses.push(`parking IN (${sanitizedparking})`);
    }

    if (filters?.pincode) {
      whereClauses.push(`pincode = '${validator.escape(filters.pincode) }'`);
    }
    
    if (filters?.amount_range) {
      const [min, max] = filters.amount_range.split('-').map(Number);
      if(!parseInt(min) || !parseInt(max)) {
        return badRequestResponse(res, false, 'Amount range must be a number!');
      }
      console.log(min, max);
      whereClauses.push(`rent_amount BETWEEN ${parseInt(min)} AND ${parseInt(max)}`);
    }

    whereClauses.push(`status = '2'`);

    let baseQuery = '';
    if (whereClauses.length > 0) {
      baseQuery = ` WHERE ` + whereClauses.join(' AND ');
    }
    
      const allowedColumns = ['id', 'rent_amount', 'availability_date', '	created_at'];
      const allowedOrders = ['ASC', 'DESC'];

      const sortColumn = allowedColumns.includes(filters.sortColumn) ? filters.sortColumn : 'id';
      const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase()) ? filters.sortOrder?.toUpperCase() : 'DESC';

      console.log('order', sortOrder)
      const propertyResult = await getAllPropertyList(baseQuery, pageCount, limitCount, sortColumn, sortOrder);
      const propertyTotalCount = await getAllPropertyCount(baseQuery);
      

    // Fetch configuration images for each property
    // if(propertyResult)
    // {
    //   for (const property of propertyResult) {
    //     const configurationImages = await getPropertyConfigurationById(property.id);
    //     property.configuration = configurationImages;
    //   }
    // }

      // console.log(propertyResult);
      data['property'] = propertyResult;
      data['totalCounts'] = propertyTotalCount;
  
      const totalPages = Math.ceil(propertyTotalCount / limit);
      const startIndex = offset + 1;
      const endIndex   = Math.min(offset + limit, propertyTotalCount);
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

export const getPropertyById = async (req, res) => {
  try {    
    let data = {};
    const searchId = req.params.id || null;
    console.log(req.params, searchId)
  
      if (!searchId) {
        return badRequestResponse(res, false, 'Property id requred with request!');
      }
  
      const [resultProperty] = await getPropertyListById(searchId);
      data = resultProperty;

      if (resultProperty) {
        const resultImages = await getPropertyImagesById(searchId);
        data['images'] = resultImages;

        const configurationImages = await getPropertyConfigurationById(searchId);
        data['configuration'] = configurationImages;
  
        // const incrementViewCountQuery = `UPDATE tbl_property SET unique_view_count = unique_view_count + 1 WHERE id = ? `;
        // await pool.execute(incrementViewCountQuery, [searchId]);
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
    console.log(req.userId);
    console.log(req.userId, searchId)
  
      if (!searchId) {
        return badRequestResponse(res, false, 'Property id requred with request!');
      }
  
      const [resultProperty] = await getPropertyListByIdAndUser(searchId, req.userId);
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
