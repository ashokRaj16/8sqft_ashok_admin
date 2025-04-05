import pool from '../../config/db.js';
import validator from 'validator';
import _ from 'lodash';
import path from 'path';
import { PutObjectCommand, ListObjectsCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

import { propertyValidators, propertyUpdateFeaturesValidators, amenetiesValidators, featureValidators, propertyFandQValidator, propertyNearbyValidator } from '../validators/propertyValidators.js';
import { successResponse, badRequestResponse, internalServerResponse, successWithDataResponse } from '../../utils/response.js';
import { uploadTempFile as upload, s3 } from '../../utils/imageUploadHelper.js';
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
  getPropertyConfigurationById,
  getPropertyFaqById,
  getAllPropertyList,
  getAllPropertyCount,
  delPropertyById, 
  getAllPropertyListAdmin,
  getAllPropertyCountAdmin,
  getPropertyListAdminById,
  updatePropertyImagesAdminDb,
  updatePropertyFeaturesDb,
  updatePropertyAmenetiesAdminDb,
  updatePropertyStatusById,
  updatePropertyConfigurationAdminDb,
  delPropertyFandqByIdAdminDb,
  updatePropertyFandqAdminDb,
  createPropertyFandQAdminDb,
  createPropertyNearbyAdminDb,
  updatePropertyNearbyAdminDb,
  delPropertyNearbyByIdAdminDb,
  getAllPropertyNearbyCategoryAdmin,
  getPropertyNearbyById
 } from '../../models/propertyModels.js';
import { getUsersById } from '../../models/userModel.js';
import { propertyConfigurationValidator } from '../validators/propertyValidators.js';
import { sanitizedField, sanitizedNumber } from '../../utils/commonHelper.js';
import fs from 'fs';

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
        data['admin'] = "test";

    
        const totalPages = Math.ceil(totalCount / limit);
        const startIndex = offset + 1;
        const endIndex   = Math.min(offset + limit, totalCount);
        data['totalPages'] = totalPages;
        data['startIndex'] = startIndex;
        data['endIndex'] = endIndex;
    
        return successWithDataResponse(res, true, "Property list", data);
      } catch (error) {
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

    const filters = req.query;
    let whereClauses = [];
    
    if (filters?.searchFilter && filters?.searchFilter.trim()) {
      const newSearchfilter = `( tp.property_title like '%${ validator.escape(filters.searchFilter.trim())}%' OR
                      tp.city_name like '%${ validator.escape(filters.searchFilter.trim())}%' OR 
                      tp.locality like '%${ validator.escape(filters.searchFilter.trim())}%' OR 
                      tu.email like '%${ validator.escape(filters.searchFilter.trim())}%' OR
                      tu.mobile like '%${ validator.escape(filters.searchFilter.trim())}%' )`
      whereClauses.push(newSearchfilter);
    }

    if (filters?.stepTerm) {
      whereClauses.push(` tp.form_step_id = '${filters.stepTerm}' `);
    }
    
    if(filters?.activeStep) {
      whereClauses.push(` tp.status >= '2' `);
    }
    
    whereClauses.push(` tp.is_deleted = '0' `);
    let baseQuery = '';
    if (whereClauses.length > 0) {
     baseQuery = ` WHERE ` + whereClauses.join(' AND ');
    }

    const allowedColumns = ['id', 'city_name', 'locality', 'email', 'mobile'];
    const allowedOrders = ['ASC', 'DESC'];
    
    const sortColumn = allowedColumns.includes(filters.sortColumn) ? filters.sortColumn : 'id';
    const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase()) ? filters.sortOrder?.toUpperCase() : 'DESC';
    
    const propertyResult = await getAllPropertyListAdmin(baseQuery, sortColumn, sortOrder, pageCount, limitCount);
    const propertyTotalCount = await getAllPropertyCountAdmin(baseQuery);

      data['property'] = propertyResult;
      data['totalCounts'] = propertyTotalCount;
  
      const totalPages = Math.ceil(propertyTotalCount / limit);
      const startIndex = offset + 1;
      const endIndex   = Math.min(offset + limit, propertyTotalCount);
      data['totalPages'] = totalPages;
      data['startIndex'] = startIndex;
      data['endIndex'] = endIndex;
  
      return successWithDataResponse(res, true, "Property list.", data);
    } 
    catch (error) 
    {
      console.error("errors:",error);
      return badRequestResponse(res, false, 'Error fetching property!', error);
    }
};

export const postProperty = async (req, res) => {
    
    try {
      // ### If error then unlink all images.
      // ### upload images within steps only = step: 1 {property_videos, property_flooring_plans, property_description} step 2: { pan_card, addhar_card, verification_document}
      // ### check if proeprty_id
      // ### validate images.

      const { step_id } = req.body;
      const errors = propertyValidators(req.body);
      if(errors.length > 0)
      {
        return badRequestResponse(res, false, 'Validation Message.', errors)
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
            
            data['property'] = { user_id: Number.parseInt(user_id), ip_address, user_agent, host_name };
            data['gallery'] = [];
            // data['amenties'] = [];
            // data['nearby_location'] = [];
            // data['features'] = [];
            // data['faq'] = [];

              Object.keys(req.files).forEach((fieldName) => {
                req.files[fieldName].forEach((file) => {
                  data['gallery'].push({ img_title: file.fieldname, img_type: 'image/jpeg', property_img_url:  file.path});
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
            state_id : state_id || null,
            state_name : state_name || null,
            pincode : pincode || null,
            on_rent_buy: on_rent_buy || null,
            property_type: property_type || null,
            property_sub_variant: property_sub_variant || null,
            flat_type : flat_type || null,
            area: Number.parseFloat(area) || null,
            area_type : area_type || null,
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
        
        const { id }= req.body;
        if(!id) {
            return badRequestResponse(res, false, 'Validation Message', { fields: 'id', message: "Id must required."})
        }

        data['amenties'] =JSON.parse(req.body.amenties );
          
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
        
        data['property'] = {  property_description: validator.escape(property_description) };
          
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

            Object.keys(req.files).forEach((fieldName) => {
                req.files[fieldName].forEach((file) => {
                  data['gallery'].push({ img_title: file.fieldname, img_type: 'image/jpeg', property_img_url:  file.path});
              });
            });

              const result = await updatePropertyGallery(id, data);
              if(result) {
                  return successResponse(res, true, 'Property updated!', result);
              }
      } else {
        return badRequestResponse(res, false, 'Wrong step id, please enter proper step id.',);  
      }
   
    } catch (error) {
      console.error("Database Error:", error);
      return badRequestResponse(res, false, 'Failed to create property!', error);
    }
};

export const deletePropertyById = async (req, res) => {

  try {
      const { id } = req.params;

      const result = await delPropertyById(id);
      if(result) {
        return successResponse(res, true, "Property deleted.")
      }
  }
  catch (error) {
    return badRequestResponse(res, false, "Something went wrong.", error);
  }
};

export const getPropertyById = async (req, res) => {
  try {    
    let data = {};
    const searchId = req.params.id || null;
  
      if (!searchId) {
        return badRequestResponse(res, false, 'Property id requred with request!');
      }

      const [resultProperty] = await getPropertyListAdminById(searchId);
      data = resultProperty;
      if(resultProperty) {
        const resultImages = await getPropertyImagesById(searchId);
        data['images'] = resultImages;

        const userDetails = await getUsersById(resultProperty.user_id);
        data['user'] = userDetails[0];

        const configurationImages = await getPropertyConfigurationById(searchId);
        data['configuration'] = configurationImages;

        const propertyFaq = await getPropertyFaqById(searchId);
        data['faq'] = propertyFaq;

        // ## update it for frontend
        const propertyNearby = await getPropertyNearbyById(searchId);
        data['nearby'] = propertyNearby;

      }

      if(data) {
        return successWithDataResponse(res, true, "Property Details.", data);
      }
      return badRequestResponse(res, false, 'Error fetching property!');
    } 
    catch (error) 
    {
      console.error(error, "errorssss");
      return badRequestResponse(res, false, 'Error fetching property!', error);
    }
};

export const getPropertyAllImagesById = async (req, res) => {
  try {    
    let data = {};

    const searchId = req.params.id || null;
  
      if (!searchId) {
        return badRequestResponse(res, false, 'Property id requred with request!');
      }

      const resultImages = await getPropertyImagesById(searchId);
      data['images'] = resultImages;

      if(data) {
        return successWithDataResponse(res, true, "Images Details.", data);
      }
      return badRequestResponse(res, false, 'Error fetching images!');
    } 
    catch (error) 
    {
      console.error(error);
      return badRequestResponse(res, false, 'Error fetching images!', error);
    }
};

// property updates basic feature
export const updatePropertyFeaturesAdmin = async (req, res) => {
  try {
      const { id } = req.params;
      if(!id) {
          return badRequestResponse(res, false, 'Validation Message', { fields: 'id', message: "Id must required."})
      }

      const errors = propertyUpdateFeaturesValidators(req.body);
      if(errors.length > 0)
      {
        return badRequestResponse(res, false, 'Validation Message.', errors)
      }

      const { 
        // basic
        user_id,
        property_type,
        property_rent_buy,
        company_name,
        contact_no,
        
        // Owner
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
        description,
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
        availability_duration,

        // builder 
        property_current_status,
        possession_date,
        is_rera_number,
        rera_number,
        total_towers,
        total_units,
        project_area,
        project_area_unit,
        per_sqft_amount,

      } = req.body;
      
      // ### Sanitize all field, Except description.
      let data = { 
        // basic
        user_id : user_id || null,
        property_type : property_type || null,
        property_rent_buy : property_rent_buy || null,
        company_name : company_name || null,
        contact_no : contact_no || null,

        // owner
        landmark: landmark || null,
        locality: locality || null,
        city_id: city_id && parseInt( city_id) || null,
        city_name: city_name || null,
        state_id : state_id && parseInt( state_id ) || null,
        state_name : state_name || null,
        latitude : latitude || null,
        longitude : longitude || null,
        pincode : pincode || null,
        property_title : property_title || null,
        description: description || null,
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
        availability_duration: availability_duration || null,
        
        // builder 
        property_current_status : property_current_status || null,
        possession_date : possession_date || null,
        is_rera_number : is_rera_number || null,
        rera_number : rera_number || null,
        total_towers : total_towers || null,
        total_units : total_units || null,
        project_area : project_area || null,
        project_area_unit : project_area_unit || null,
        per_sqft_amount : per_sqft_amount || null,
        updated_by : req.userId || null
      };
      
      const result = await updatePropertyFeaturesDb( id, data);
      if(result) {
          return successResponse(res, true, 'Property updated!', result);
      }
 
  } catch (error) {
    console.error("Database Error:", error);
    return badRequestResponse(res, false, 'Failed to update property!', error);
  }
};

export const updatePropertyAmenetiesAdmin = async (req, res) => {
    
  try {

    const { id } = req.params;


    if(!id) {
        return badRequestResponse(res, false, 'Validation Message', { fields: 'id', message: "Id must required."})
    }

    const {
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
      other_amenities
     } = req.body;

    const data = {
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

      // builder
      updated_by : req.userId || null
    }

      const result = await updatePropertyAmenetiesAdminDb( id, data );
      if(result) {
          return successResponse(res, true, 'Property Ameneties updated!', result);
      }

  } catch (error) {
    console.error("Database Error:", error);
    return badRequestResponse(res, false, 'Failed to update property!', error);
  }
};

/**
 * Property Update: Images and its status
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const updatePropertyImages = async (req, res) => {
  try {

    const { id, sid } = req.params;
    if(!sid || !id) {
      return badRequestResponse(res, false, "Image id required with query.")
    }

    const { 
      img_title, 
      image_category,
      status
    } = req.body;

    const data = {
      img_title : img_title || null, 
      image_category : image_category || null,
      status : status || null
    }

    const result = await updatePropertyImagesAdminDb(sid, data);
    if(result) {
        return successResponse(res, true, 'Property gallery updated!', result);
    }
 
  } catch (error) {
    return badRequestResponse(res, false, 'Failed to update gallery property!', error);
  }
};

export const updatePropertyConfiguration = async (req, res) => {
  try {

    const { id, sid } = req.params;
        
    if(!sid || !id) {
      return badRequestResponse(res, false, "Image id required with query.")
    }
    const { 
      carpet_area,
      carpet_price,
      length,
      width,
      width_unit,
      length_unit
    } = req.body;

    const data = {
      carpet_area : carpet_area || null,
      carpet_price : carpet_price || null,
      length : length || null,
      width : width || null,
      width_unit : width_unit || null,
      length_unit : length_unit || null
    }

    const result = await updatePropertyConfigurationAdminDb(sid, data);
    if(result) {
        return successResponse(res, true, 'Property gallery updated!', result);
    }
 
  } catch (error) {
    console.error("Database Error:", error);
    return badRequestResponse(res, false, 'Failed to update property!', error);
  }
};

export const createPropertyFandqAdmin = async (req, res) => {
  try {

    const {id} = req.params;
    const errors = propertyFandQValidator(req.body);

    if(!id) {
      return badRequestResponse(res, false, "Property id is required.")
    }

    if(id && !validator.isNumeric(id)) {
      return badRequestResponse(res, false, "Property id is not valid.")
    }

    if(errors.length > 0) {
      return badRequestResponse(res, false, "Validation Message", errors)
    }
    const { 
      faq_question,
      faq_answer
    } = req.body;

    const data = {
      property_id :id,
      faq_question : faq_question || null,
      faq_answer : faq_answer || null
    }

    const result = await createPropertyFandQAdminDb(data);
    if(result) {
        return successResponse(res, true, 'Property f&q created!', result);
    }
 
  } catch (error) {
    console.error("Database Error:", error);
    return badRequestResponse(res, false, 'Failed to create f&q property!', error);
  }
};

/**
 * Update: F&q and status
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const updatePropertyFandqAdmin = async (req, res) => {
  try {
    const { id, sid } = req.params;
    if(!sid || !id) {
      return badRequestResponse(res, false, "F & q id required with query.")
    }
    const { 
      faq_question,
      faq_answer,
      status
    } = req.body;

    const data = {
      faq_question : faq_question || null,
      faq_answer : faq_answer || null,
      status: status || null
    }

    const result = await updatePropertyFandqAdminDb(sid, data);
    if(result) {
        return successResponse(res, true, 'Property f&q updated!', result);
    }
 
  } catch (error) {
    console.error("Database Error:", error);
    return badRequestResponse(res, false, 'Failed to update f&q property!', error);
  }
};

export const deletePropertyFandqAdmin = async (req, res) => {
    
  try {

    const { id, sid } = req.params;

    if (!id || !sid) {
      return badRequestResponse(res, false, 'id or f&q id required with request.');
    }
    
    const result = await delPropertyFandqByIdAdminDb(sid);
    if(result) {
        return successResponse(res, true, 'Property f & q deleted!', result);
    }
 
  } catch (error) {
    console.error("Database Error:", error);
    return badRequestResponse(res, false, 'Failed to delete f&q!', error);
  }
};

export const uploadPropertyImagesAdmin = async (req, res) => {
  upload.array('images')(req, res, async (err) => {
      if (err) {
          console.error("Multer error:", err);
          return badRequestResponse(res, false, "Error processing uploaded files", err);
      }

      const { property_id, img_title } = req.body;
      const files = req.files;

      if (!property_id || !img_title || !files || !files.length) {
          return badRequestResponse(res, false, "Missing required fields or files");
      }

      let imageUrls = [];
      let connection;

      try {
          const updatedImages = [];
          const bucketName = process.env.AWS_S3_BUCKET_NAME;

          const currentDate = new Date();
          const monthYear = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' }).toLowerCase().replace(" ", "-"); // Example: "feb-2025"

          const monthFolder = `${monthYear}/`;
          const propertyFolder = `${monthFolder}${property_id}/`;

          async function ensureFolderExists(folderPath) {
              try {
                  await s3.send(new HeadObjectCommand({ Bucket: bucketName, Key: folderPath }));
              } catch (error) {
                  if (error.name === "NotFound") {
                      await s3.send(new PutObjectCommand({
                          Bucket: bucketName,
                          Key: `${folderPath}placeholder.txt`,
                          Body: "Folder placeholder",
                          ACL: "private",
                      }));
                  }
              }
          }

          await ensureFolderExists(monthFolder);
          await ensureFolderExists(propertyFolder);

          connection = await pool.getConnection();
          await connection.beginTransaction();

          for (const file of files) {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
              const extension = path.extname(file.originalname).toLowerCase();
              const fileName = `${img_title.toLowerCase().replace(/\s+/g, "-")}-${uniqueSuffix}${extension}`;
              const filePath = `${propertyFolder}${fileName}`;

              const params = {
                  Bucket: bucketName,
                  Key: filePath,
                  Body: file.buffer,
                  ContentType: file.mimetype,
                  ACL: "public-read",
              };

              await s3.send(new PutObjectCommand(params));
              const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`;

              const insertQuery = `INSERT INTO tbl_property_gallery 
              (property_id, img_title, image_category, file_type, image_size, property_img_url)
              VALUES (?, ?, ?, ?, ?, ?) `;

              const insertValues = [property_id, img_title, img_title, file.mimetype, file.size, imageUrl];
              const [dbResponse] = await connection.query(insertQuery, insertValues);

              imageUrls.push({ id: dbResponse.insertId, imageUrl });
              updatedImages.push(dbResponse);
          }

          await connection.commit();

          const data = { [img_title]: imageUrls };
          return successWithDataResponse(res, true, "Images uploaded successfully.", data);

      } catch (error) {
          if (connection) {
              await connection.rollback();
          }
          console.error("Error updating images:", error);
          return badRequestResponse(res, false, "Failed to upload images.", error);
      } finally {
          if (connection) {
              connection.release();
          }
      }
  });
};


export const deletePropertyImageAdmin = async (req, res) => {
  const { id, sid } = req.params;

  if (!id || !sid) {
      return badRequestResponse(res, false, "Missing required field: image_id");
  }

  let connection;

  try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      const selectQuery = `SELECT property_img_url FROM tbl_property_gallery WHERE id = ?`;
      const [rows] = await connection.query(selectQuery, [sid]);

      if (!rows.length) {
          return badRequestResponse(res, false, "Image not found");
      }

      const imageUrl = rows[0].property_img_url;
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const s3Key = imageUrl.replace(`https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`, "");
      

      const pathParts = s3Key.split("/");
      // if (pathParts.length < 3) {
      //     return badRequestResponse(res, false, "Invalid image path format");
      // }

      if (pathParts.length < 3) {
        // return badRequestResponse(res, false, "Invalid image path format");
        await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }));

        const deleteQuery = `DELETE FROM tbl_property_gallery WHERE id = ?`;
        await connection.query(deleteQuery, [sid]);
        await connection.commit();

        return successResponse(res, true, "Image deleted successfully.");
    }

      const monthFolder = pathParts[0] + "/";
      const propertyFolder = pathParts[0] + "/" + pathParts[1] + "/";

      await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }));

      const deleteQuery = `DELETE FROM tbl_property_gallery WHERE id = ?`;
      await connection.query(deleteQuery, [sid]);

      const listPropertyObjects = await s3.send(new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: propertyFolder,
      }));

      if (!listPropertyObjects.Contents || listPropertyObjects.Contents.length === 0) {
          await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: propertyFolder + "placeholder.txt" }));
      }

      const listMonthObjects = await s3.send(new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: monthFolder,
      }));

      if (!listMonthObjects.Contents || listMonthObjects.Contents.length === 0) {
          await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: monthFolder + "placeholder.txt" }));
      }

      await connection.commit();

      return successResponse(res, true, "Image deleted successfully");

  } catch (error) {
      if (connection) {
          await connection.rollback();
      }
      console.error("Error deleting image:", error);
      return badRequestResponse(res, false, "Failed to delete image.", error);
  } finally {
      if (connection) {
          connection.release();
      }
  }
};

export const uploadPropertyConfigurationAdmin = async (req, res) => {

  upload.array('images') (req, res, async (err) => {

    if (err) {
      console.error("SQFT Multer error:", err);
      return badRequestResponse(res, false, "Error processing uploaded files.", err);
    }

    const errors = propertyConfigurationValidator(req.body);
    if(errors.length > 0)
    {
      return badRequestResponse(res, false, 'Validation Message', errors)
    }

    const {
      property_id,
      unit_name,
      carpet_area,
      length,
      width,
      width_unit,
      length_unit,
      carpet_price,
    } = req.body;

    const files = req.files;

    let imageUrls = [];
    let connection;
    try {
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const now = new Date();

      const monthFolder = `${now.toLocaleString("default", { month: "short" }).toLowerCase()}-${now.getFullYear()}/`;
      const propertyFolder = `${monthFolder}${property_id}/`;

      async function ensureFolderExists(folderKey) {
        const listParams = { Bucket: bucketName, Prefix: folderKey, MaxKeys: 1 };
        const listObjects = await s3.send(new ListObjectsCommand(listParams));

        if (!listObjects.Contents || listObjects.Contents.length === 0) {
          await s3.send(
            new PutObjectCommand({
              Bucket: bucketName,
              Key: `${folderKey}placeholder.txt`,
              Body: "This is a placeholder file.",
              ACL: "private",
            })
          );
        }
      }

      await ensureFolderExists(monthFolder);
      await ensureFolderExists(propertyFolder);

      connection = await pool.getConnection();
      await connection.beginTransaction();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.buffer.length === 0) {
          console.error(`⚠️ File buffer is empty for: ${file.originalname}`);
          return badRequestResponse(res, false, "Failed to add configuration.");
        }

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname).toLowerCase();
        const fileName = `${unit_name ? unit_name.toLowerCase().replace(/ /g, "-") : "configuration"}-${uniqueSuffix}${extension}`;
        const fileKey = `${propertyFolder}${fileName}`;

        const awsresult = await s3.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read",
          })
        );

        const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

        const insertQuery = `INSERT INTO tbl_property_unit_configuration 
            (property_id, unit_name, carpet_area, length, width, width_unit, length_unit, carpet_price, unit_img_url, file_type, file_size)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          const insertValues = [
            property_id, 
            unit_name ? sanitizedField(unit_name, true, 'UPPERCASE') : null, 
            carpet_area !== '' ? sanitizedNumber(carpet_area, { allowDecimal: true }) : null, 
            length !== '' ? sanitizedNumber(length, { allowDecimal: true }) : null, 
            width !== '' ? sanitizedNumber(width, { allowDecimal: true }) : null, 
            width_unit || null, 
            length_unit || null, 
            carpet_price !== '' ? sanitizedNumber(carpet_price, { allowDecimal: true }) : null, 
            imageUrl, 
            file.mimetype || null, 
            file.size || null 
          ];

        const [dbResponse] = await connection.query(insertQuery, insertValues);

        imageUrls.push({ id: dbResponse.insertId, imageUrl });
      }

      await connection.commit();

      const data = { [unit_name || "configuration"]: imageUrls };

      return successWithDataResponse(res, true, "Configuration added successfully.", data);
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error("Error updating configuration:", error);
      return badRequestResponse(res, false, "Failed to add configuration.", error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  });
};

export const deletePropertyConfigurationAdmin = async (req, res) => {
  const { id, sid } = req.params;
  if (!id && !sid) {
      return badRequestResponse(res, false, "Missing required field: image_id");
  }

  let connection;

  try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      const selectQuery = `SELECT unit_img_url FROM tbl_property_unit_configuration WHERE id = ?`;
      const [rows] = await connection.query(selectQuery, [sid]);

      if (!rows.length) {
          return badRequestResponse(res, false, "Configuration setting not found.");
      }
      
      const imageUrl = rows[0].unit_img_url;
      if(!imageUrl) {
        return badRequestResponse(res, false, "No image found.");
      }
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const s3Key = imageUrl.replace(`https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`, "");

      const pathParts = s3Key.split("/");
      if (pathParts.length < 3) {
          
          await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }));

          const deleteQuery = `DELETE FROM tbl_property_unit_configuration WHERE id = ?`;
          await connection.query(deleteQuery, [sid]);
          await connection.commit();

          return successResponse(res, true, "Configuration deleted successfully.");
      }

      const monthFolder = pathParts[0] + "/";
      const propertyFolder = `${monthFolder}${pathParts[1]}/`;

      await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }));

      const deleteQuery = `DELETE FROM tbl_property_unit_configuration WHERE id = ?`;
      await connection.query(deleteQuery, [sid]);

      const listPropertyObjects = await s3.send(new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: propertyFolder,
      }));
      

      if (!listPropertyObjects.Contents || listPropertyObjects.Contents.length === 0) {
          await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: `${propertyFolder}placeholder.txt` }));
      }

      const listMonthObjects = await s3.send(new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: monthFolder,
      }));

      if (!listMonthObjects.Contents || listMonthObjects.Contents.length === 0) {
          await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: `${monthFolder}placeholder.txt` }));
      }

      await connection.commit();

      return successResponse(res, true, "Configuration deleted successfully.");

  } catch (error) {
      if (connection) {
          await connection.rollback();
      }
      console.error("Error deleting configuration:", error);
      return badRequestResponse(res, false, "Failed to delete configuration.", error);
  } finally {
      if (connection) {
          connection.release();
      }
  }
};

/**
 * Change property status
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const changePropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, statusText, publish_date } = req.body;

    const data = {
      status, 
      statusText,
      publish_date : publish_date ? publish_date : status === '2' ? new Date() : null
    };


    if (!status || status < 1 || status > 5) {
      return badRequestResponse(res, false, "Invalid status value. Must be between 1 and 5.");
    }

    const result = await updatePropertyStatusById(id, data);

    if (result && result.affectedRows > 0) {
      return successResponse(res, true, "Property status updated.");
    } else {
      return badRequestResponse(res, false, "Failed to update property status.");
    }
  } catch (error) {
    return badRequestResponse(res, false, "Something went wrong.", error);
  }
};


/**
 * Completed :Not Required.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getAmenties = async (req, res) => {
  try {
      
    let data = {};
      const searchName  = req.query.searchName || ""; 
      const page        = parseInt(req.query.page) || 1;
      const limit       = parseInt(req.query.limit) || 10; 
      const offset      = (page - 1) * limit;

    let searchQuery = "WHERE 1 = 1"; 

    if (searchName) {
      searchQuery += ` AND amenity_name LIKE '%${searchName}%'`;
    }

    const totalCountQuery = `SELECT COUNT(*) AS count FROM tbl_master_amenties ${searchQuery}`;
    const amentiesQuery = `SELECT * FROM tbl_master_amenties ${searchQuery} LIMIT ${limit} OFFSET ${offset}`;

    const [[totalCountResult]] = await pool.query(totalCountQuery);
    const totalCount = totalCountResult.count;
    data['totalCounts'] = totalCount;

    const [amenties] = await pool.query(amentiesQuery);
    data['amenties'] = amenties;

    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = offset + 1;
    const endIndex   = Math.min(offset + limit, totalCount);
    data['totalPages'] = totalPages;
    data['startIndex'] = startIndex;
    data['endIndex'] = endIndex;

    return successWithDataResponse(res, true, "Ameneties list", data);
  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, 'Error fetching amenties!', error);
  }
};

/**
 * Completed ###Need to upload image
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

export const postAmenties = async (req, res) => {
    const errors = amenetiesValidators(req.body);
    
    if(!req.file){
        return badRequestResponse(res, false , 'No file uploaded!');
    }

    if(errors.length > 0)
    {
        return badRequestResponse(res, false, 'Validation Message', errors)
    }
        
    try {
        const { amenity_name, status, description } = req.body;
        const data = { amenity_name, icon_url : process.env.SERVER_UPLOAD_URL + req.file.filename, status, description };
   
        const result = await createAmenties(data);
        if(result) {
            return successResponse(res, true, 'Amenties created!', result);
        }
    } catch (error) {
    //   console.error("Database Error:", error);
      return badRequestResponse(res, false, 'Failed to create amenties!', error);
    }
};

export const postFeatures = async (req, res) => {
    const errors = featureValidators(req.body);
    
    if(!req.file){
        return badRequestResponse(res, false , 'No file uploaded!');
    }

    if(errors.length > 0)
    {
        return badRequestResponse(res, false, 'Validation Message', errors)
    }
    
    try {
        const { feature_name, feature_categories, status, description } = req.body;
        const data = { feature_name, icon_url : process.env.SERVER_UPLOAD_URL + req.file.filename, feature_categories, status, description };
        const result = await createFeatures(data);
        if(result) {
            return successResponse(res, true, 'Features created!', result);
        }
    } catch (error) {
      return badRequestResponse(res, false, 'Failed to create features!', error);
    }
};

/**
 * Completed.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getFeatures = async (req, res) => {
    try {
      
        let data = {};
          const searchName  = req.query.searchName || ""; 
          const page        = parseInt(req.query.page) || 1;
          const limit       = parseInt(req.query.limit) || 10;
          const offset      = (page - 1) * limit;
    
        let searchQuery = "WHERE 1 = 1"; 
    
        if (searchName) {
          searchQuery += ` AND feature_name LIKE '%${searchName}%' AND feature_categories LIKE '%${searchName}%'`;
        }
    
        const totalCountQuery = `SELECT COUNT(*) AS count FROM tbl_master_features ${searchQuery}`;
        const featureQuery = `SELECT * FROM tbl_master_features ${searchQuery} LIMIT ${limit} OFFSET ${offset}`;
    
        const [[totalCountResult]] = await pool.query(totalCountQuery);
        const totalCount = totalCountResult.count;
        data['totalCounts'] = totalCount;
    
        const [amenties] = await pool.query(featureQuery);
        data['features'] = amenties;
    
        const totalPages = Math.ceil(totalCount / limit);
        const startIndex = offset + 1;
        const endIndex   = Math.min(offset + limit, totalCount);
        data['totalPages'] = totalPages;
        data['startIndex'] = startIndex;
        data['endIndex'] = endIndex;
    
        return successWithDataResponse(res, true, "Features list", data);
      } 
      catch (error) 
      {
        console.error(error);
        return badRequestResponse(res, false, 'Error fetching features!', error);
      }
};

export const getCategories = (req, res) => {
  const query = 'SELECT DISTINCT location_categories FROM tbl_master_nearby_locations';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Nearby location section
export const getNearbyLocationsByCategory = async (req, res) => {
    try {
    const { location_categories } = req.query;
    const data = {
      location_categories : location_categories || null
    }
    const result = await getAllPropertyNearbyCategoryAdmin(data);

    if(result) {
        return successWithDataResponse(res, true, 'Property nearby list!', result);
    }
 
  } catch (error) {
    console.error("Database Error:", error);
    return badRequestResponse(res, false, 'Failed to get nearby categories!', error);
  }
};


export const createNearbyLocationAdmin = async (req, res) => {

  try {

    const {id} = req.params;
    const errors = propertyNearbyValidator(req.body);

    if(!id) {
      return badRequestResponse(res, false, "Property id is required.")
    }

    if(id && !validator.isNumeric(id)) {
      return badRequestResponse(res, false, "Property id is not valid.")
    }

    if(errors.length > 0) {
      return badRequestResponse(res, false, "Validation Message", errors)
    }

    const { nearby_id, location_value, location_title, distance, time, latitude, longitude } = req.body;

    const data = {
      property_id : id,
      nearby_id: nearby_id || null,
      location_value : location_value || null,
      location_title : location_title || null,
      distance : distance || null,
      time: time || null,
      latitude : latitude || null,
      longitude : longitude || null
    }

    const result = await createPropertyNearbyAdminDb(data);
    if(result) {
        return successResponse(res, true, 'Property nearby created!', result);
    }
 
  } catch (error) {
    console.error("Database Error:", error);
    return badRequestResponse(res, false, 'Failed to create nearby property!', error);
  } 
};


export const updatePropertyNearbyAdmin = async (req, res) => {
  try {
    const { id, sid } = req.params;
    if(!sid || !id) {
      return badRequestResponse(res, false, "Nearby id required with query.")
    }

    const { nearby_id, location_value, location_title, distance, time, latitude, longitude } = req.body

    const data = {
      nearby_id: nearby_id || null,
      location_value : location_value || null,
      location_title : location_title || null,
      distance : distance || null,
      time: time || null,
      latitude : latitude || null,
      longitude : longitude || null
    }

    const result = await updatePropertyNearbyAdminDb(sid, data);
    if(result.affectedRows <= 0)
    {
      return badRequestResponse(res, false, 'Nearby entry not found or failed to update.')
    }
    if(result) {
        return successResponse(res, true, 'Property nearby updated!', result);
    }

  } catch (error) {
    console.error("Database Error:", error);
    return badRequestResponse(res, false, 'Failed to update nearby property!', error);
  }
};

export const deletePropertyNearbyAdmin = async (req, res) => {
    
  try {
    const { id, sid } = req.params;

    if (!id || !sid) {
      return badRequestResponse(res, false, 'id or nearby id required with request.');
    }
    
    const result = await delPropertyNearbyByIdAdminDb(sid);
    if(result.afftectedRows <= 0) {
      return badRequestResponse(res, false, 'Nearby not found or unable to delete!');
    }
    if(result) {
        return successWithDataResponse(res, true, 'Property nearby deleted!', result);
    }
 
  } catch (error) {
    console.error("Database Error:", error);
    return badRequestResponse(res, false, 'Failed to delete nearby!', error);
  }
};

export const generatePropertyNearbyAdmin = async (req, res) => {
  try {
    return successResponse(res, true, 'Property nearby generated!');

  } catch (error) {
    console.error("Database Error:", error);
    return badRequestResponse(res, false, 'Failed to generate nearby locations!', error);
  }
}