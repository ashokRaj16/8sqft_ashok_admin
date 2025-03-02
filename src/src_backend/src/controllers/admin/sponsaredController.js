
import { createSponsaredAdmin, deleteSponsaredAdmin, getAllSponsaredCountAdmin, getAllSponsaredListAdmin, getLastSponsaredSequenceAdmin, 
  updateSponsaredAdmin, updateMultipleSponsaredAdmin } from "../../models/sponsaredModel.js";
import {
  badRequestResponse,
  successWithDataResponse,
} from "../../utils/response.js";
import validator from "validator";

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

// Add a new blog
export const addSponsared = async (req, res) => {
  const {
    property_id, categories, banner_id, sequence_no, published_date
  } = req.body;

  try {
    const data = {
      property_id: property_id || null, 
      categories: categories || null, 
      banner_id : banner_id || null,
      sequence_no:sequence_no || null, 
      published_date : published_date || null, 
      userid : req.userId
    };

    const result = await createSponsaredAdmin(data);
    return successWithDataResponse(
      res,
      true,
      "Sponsared added successfully.",
      result
    );
  } catch (error) {
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
      "Sponsared deleted successfully.",
      result
    );

  } catch (error) {
    return badRequestResponse(res, false, "Error deleting Sponsared.", error);
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