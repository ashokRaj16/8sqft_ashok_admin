
import { readRecordDb } from "../../models/commonModel.js";
import { addGalleryImages } from "../../models/galleryModel.js";
import { createSponsaredAdmin, deleteSponsaredAdmin, getAllSponsaredCountAdmin, getAllSponsaredListAdmin, getLastSponsaredSequenceAdmin, 
  updateSponsaredAdmin, updateMultipleSponsaredAdmin, 
  getSponsaredDetailsById,
  getPropertyContructionPhaseById,
  getSponsaredImagesById} from "../../models/sponsaredModel.js";
import {
  badRequestResponse,
  successWithDataResponse,
} from "../../utils/response.js";
import validator from "validator";
import { generateSponsaredSlug } from "../../utils/slugHelper.js";

//  need work
//  ### add image feature for home page banner. 
//  ### 

export const listSponsared = async (req, res) => {
  try {
    let data = {};
    
    const { page, limit } = req.query;

    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 100;
    const offset = (page - 1) * limit;

    const filters = req.query;
    let whereClauses = [];

    console.log("Filters::", filters)

    if (filters?.searchFilter && filters?.searchFilter.trim()) {
      const newSearchfilter = `tp.property_title like '%${validator.escape(
        filters.searchFilter.trim()
      )}%' OR 
      tp.city_name like '%${validator.escape(
          filters.searchFilter.trim()
      )}%' OR
      tp.locality like '%${validator.escape(
          filters.searchFilter.trim()
      )}%' `;
      whereClauses.push(newSearchfilter);
    } 

    if (filters?.categories && filters?.categories.trim()) {      
      whereClauses.push(` tps.categories = '${filters.categories}' `);
    } 

    let baseQuery = "";
    if (whereClauses.length > 0) {
      baseQuery = ` WHERE ` + whereClauses.join(" AND ");
    }

    const allowedColumns = [
      "id",
      "property_title",
      "city_name",
      "sequence_no",
      "status",
    ];
    const allowedOrders = ["ASC", "DESC"];

    const sortColumn = allowedColumns.includes(filters.sortColumn)
      ? filters.sortColumn
      : "id";

    const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase())
      ? filters.sortOrder?.toUpperCase()
      : "DESC";

    console.log(filters, sortColumn, sortOrder);
    const propertyResult = await getAllSponsaredListAdmin(
      baseQuery,
      sortColumn,
      sortOrder,
      pageCount,
      limitCount
    );

    const propertyTotalCount = await getAllSponsaredCountAdmin(baseQuery);

    data["sponsared"] = propertyResult;
    data["totalCounts"] = propertyTotalCount;

    const totalPages = Math.ceil(propertyTotalCount / limit);
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + limit, propertyTotalCount);
    data["totalPages"] = totalPages;
    data["startIndex"] = startIndex;
    data["endIndex"] = endIndex;

    return successWithDataResponse(res, true, "Sponsared list.", data);
  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, "Error fetching Sponsared!", error);
  }
};

export const getSponsaredById = async (req, res) => {
  try {

    const id = req.params.id;
    const sponsaredResult = await getSponsaredDetailsById(id);
    const data = sponsaredResult;
    if(sponsaredResult) {
      if(sponsaredResult.property_id) {
        data.construction = await getPropertyContructionPhaseById(sponsaredResult.property_id);
      }
      data.gallery = await getSponsaredImagesById(id);
    }
    
    return successWithDataResponse(res, true, "Sponsared details.", data);
  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, "Error fetching Sponsared!", error);
  }
};

// Add a new sponsared property
export const addSponsared = async (req, res) => {
  const {
      sponsared_title, sponsared_description,
      user_name, user_id, user_logo_url, user_short_description, 
      total_site_visits, total_bookings, direct_site_visits, total_revenue,
      background_img_url, theme_color,
      property_id, property_title, categories, is_dedicated,
      meta_title, meta_description,
      sponsared_gallery,
      sponsared_gallery_list,
      sequence_no, published_date
  } = req.body;

  try {
    let updatedSponsaredGallery;
    
    if(sponsared_gallery) {
      updatedSponsaredGallery = {
        title : sponsared_gallery && sponsared_gallery?.title || null,
        description : sponsared_gallery && sponsared_gallery?.description || null,
        img_categories : categories || null,
        img_url : sponsared_gallery && sponsared_gallery?.img_url || null,
        file_type : sponsared_gallery && sponsared_gallery?.file_type || null,
        file_size : sponsared_gallery && sponsared_gallery?.file_size || null
      }
    }
      
    // const whereCond = `property_id = ? AND categories = ?` 
    // const whereVal = [property_id, categories]
    // const result1 = await readRecordDb('tbl_property_sponsared', ['id'], whereCond, whereVal)
    
    // if(result1.length > 0) {
    //   return badRequestResponse(res, false, "Property already added for sponsared.")
    // }

    let data = {
      property_id: property_id || null, 
      categories: categories || null, 
      sequence_no: sequence_no || null, 
      published_date : published_date || null, 
      is_dedicated :  is_dedicated || null, 

      // dedicated builder
      sponsared_title : sponsared_title || null,
      sponsared_description : sponsared_description || null, 
      spotlight_slug : null,
 
      user_id : user_id || null,
      user_logo_url : user_logo_url || null, 
      user_short_description : user_short_description || null, 
      total_site_visits :total_site_visits || null, 
      total_bookings : total_bookings || null, 
      direct_site_visits : direct_site_visits || null, 
      total_revenue : total_revenue || null,
      background_img_url : background_img_url || null,
      theme_color : theme_color || null,
      meta_title : meta_title || null, 
      meta_description : meta_description || null, 
      sponsared_gallery : updatedSponsaredGallery || null,
      sponsared_gallery_list : sponsared_gallery_list || null,
      addedby : req.userId
    };

    const result = await createSponsaredAdmin(data);
    console.log(result);

    if(result.affectedRows > 0) {

        let data = {
          spotlight_slug : generateSponsaredSlug( 
          categories === 'BUILDER SPOTLIGHT' ? user_name : property_title, 
          categories,
          categories === 'BUILDER SPOTLIGHT' ? user_id : property_id )
        }
        await updateSponsaredAdmin(result.insertId, data);
      
        return successWithDataResponse(
          res,
          true,
          "Sponsared added successfully.",
          result
        );
    }
    return badRequestResponse(res, false, "Unable create sponsared.");
  } catch (error) {
    console.log(error, "errr")
    return badRequestResponse(res, false, "Error creating Sponsared.", error);
  }
};

export const updateSponsared = async (req, res) => {
  const { id } = req.params;
  const {
    property_id, categories, sequence_no, published_date, status
  } = req.body;

  try {
    
    const data = {
      property_id: property_id || null, 
      categories : categories || null, 
      sequence_no : sequence_no || null, 
      published_date : published_date || null,  
      status : status || null
    };

    const result = await updateSponsaredAdmin(id, data);

    if (result.affectedRows === 0) {
      return badRequestResponse(res, false, "Sponsared` not found or not updated.");
    }

    return successWithDataResponse(
      res,
      true,
      "Sponsared updated successfully.",
      result
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error updating Sponsared.", error);
  }
};

export const deleteSponsared = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await deleteSponsaredAdmin(id);
    console.log(id, result)
    if (result.affectedRows === 0) {
      return badRequestResponse(res, false, "Sponsared not found or not deleted.");
    }

    return successWithDataResponse(
      res,
      true,
      "Sponsared deleted successfully.",
      result
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error deleting Sponsared.", error);
  }
};

export const getLastSquenceSponsaredNumber = async (req, res) => {
  const { categories } = req.query;
  console.log('log', categories)
  try {

    const [result] = await getLastSponsaredSequenceAdmin(categories);
    console.log(categories, result)
    if (!result.last_sequence_no) {
      result.last_sequence_no = 0
    }

    return successWithDataResponse(
      res,
      true,
      "sponsared id retrived successfully.",
      result
    );

  } catch (error) {
    return badRequestResponse(res, false, "Error getting sponsared.", error);
  }
};

export const updateSponsaredSequence = async (req, res) => {
  
  const {
    data
  } = req.body;
  if(!data) {
    return badRequestResponse(res, false, "No data or missing required data.")
  }
  try {
    
    if(!Array.isArray(data) || data.length === 0) {
      return badRequestResponse(res, false, "Invalid request format");
    }

    const result = await updateMultipleSponsaredAdmin( data );

    return successWithDataResponse(
      res,
      true,
      "Sponsared updated successfully.", result
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error updating Sponsared.", error);
  }
};