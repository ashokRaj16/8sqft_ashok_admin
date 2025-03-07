import { deleteEnquiryAdmin, getAllEnquiryCountAdmin, getAllEnquiryListAdmin } from "../../models/enquiryModel.js";
import {
  badRequestResponse,
  successWithDataResponse,
} from "../../utils/response.js";
import validator from "validator";

  //  need work
  //  ### add image feature for home page banner. 
  //  ### 

export const listEnquiry = async (req, res) => {
  try {
    let data = {};
    
    const { page, limit } = req.query;

    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 10;
    const offset = (pageCount - 1) * limitCount;

    const filters = req.query;
    let whereClauses = [];

    if (filters?.searchFilter && filters?.searchFilter.trim()) {
      const newSearchfilter = `tcd.name like '%${validator.escape(
        filters.searchFilter.trim()
      )}%' OR 
      tcd.phone like '%${validator.escape(
          filters.searchFilter.trim()
      )}%' OR
      tcd.email like '%${validator.escape(
          filters.searchFilter.trim()
      )}%'  OR
      tp.property_title like '%${validator.escape(
          filters.searchFilter.trim()
      )}%' `;
      whereClauses.push(newSearchfilter);
    } 
    whereClauses.push(`tcd.is_deleted = '0'`);
    
    let baseQuery = "";
    if (whereClauses.length > 0) {
      baseQuery = ` WHERE ` + whereClauses.join(" AND ");
    }

    const allowedColumns = [
      "id",
      "property_title",
      "name",
      "phone",
      "email",
    ];
    const allowedOrders = ["ASC", "DESC"];

    const sortColumn = allowedColumns.includes(filters.sortColumn)
      ? filters.sortColumn
      : "id";

    const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase())
      ? filters.sortOrder?.toUpperCase()
      : "DESC";

    console.log(filters, sortColumn, sortOrder);
    const propertyResult = await getAllEnquiryListAdmin(
      baseQuery,
      sortColumn,
      sortOrder,
      pageCount,
      limitCount
    );

    const totalCount = await getAllEnquiryCountAdmin(baseQuery);

    data["enquiry"] = propertyResult;
    data["totalCounts"] = totalCount;

    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + limit, totalCount);
    data["totalPages"] = totalPages;
    data["startIndex"] = startIndex;
    data["endIndex"] = endIndex;

    return successWithDataResponse(res, true, "Enquiry list.", data);
  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, "Error fetching Sponsared!", error);
  }
};

export const deleteEnquiry = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await deleteEnquiryAdmin(id);
    console.log(id, result)
    if (result.affectedRows === 0) {
      return badRequestResponse(res, false, "Enquiry not found or not deleted.");
    }

    return successWithDataResponse(
      res,
      true,
      "Enquiry deleted successfully.",
      result
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error deleting data.", error);
  }
};
