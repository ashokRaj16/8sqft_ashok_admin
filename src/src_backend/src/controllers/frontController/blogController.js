import {
  getBlogByIdAdmin,
  getAllblogCountAdmin,
  getAllblogListAdmin,
  getAllCategoryListAdmin,
  getAllCategoryCountAdmin
} from "../../models/blogModel.js";
import { formattedDate } from "../../utils/commonHelper.js";

import {
  badRequestResponse,
  successWithDataResponse,
} from "../../utils/response.js";
import validator from "validator";

export const listBlogs = async (req, res) => {
  try {
    let data = {};
    const { page, limit } = req.query;

    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 100;
    const offset = (pageCount - 1) * limitCount;

    const filters = req.query;
    let whereClauses = [];

    if (filters?.searchFilter && filters?.searchFilter.trim()) {
      const newSearchfilter = `tb.title like '%${validator.escape(
        filters.searchFilter.trim()
      )}%' OR 
      tb.author_name like '%${validator.escape(
        filters.searchFilter.trim()
      )}%' OR
      tb.short_description like '%${validator.escape(
        filters.searchFilter.trim()
      )}%' OR
      tbc.title like '%${validator.escape(
        filters.searchFilter.trim()
      )}%'
      `;
      whereClauses.push(newSearchfilter);
    }

    if(filters?.cat_id) {
      whereClauses.push(` tb.cat_id = ${filters.cat_id} `);
    }

    if(filters?.id) {
      whereClauses.push(` tb.id <> ${filters.id} `);
    }

    if(filters?.tag) {
      console.log('tagsss', filters.tag)
      whereClauses.push(` tb.tags like '%${filters.tag}%'`);
    }

    whereClauses.push(` tb.is_deleted = '0' `);
    whereClauses.push(` tb.status = '1' `);
    whereClauses.push(` DATE(tb.publish_date) <= CURDATE() `);

    let baseQuery = "";

    if (whereClauses.length > 0) {
      baseQuery = ` WHERE ` + whereClauses.join(" AND ");
    }
 
    const allowedColumns = [
      "id",
      "title",
      "author_name",
      "created_at",
      "status",
    ];
    const allowedOrders = ["ASC", "DESC"];

    const sortColumn = allowedColumns.includes(filters.sortColumn)
      ? filters.sortColumn
      : "tb.id";

    const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase())
      ? filters.sortOrder?.toUpperCase()
      : "DESC";

    console.log(filters, sortColumn, sortOrder);
    const propertyResult = await getAllblogListAdmin(
      baseQuery,
      sortColumn,
      sortOrder,
      pageCount,
      limitCount
    );
    
    const propertyTotalCount = await getAllblogCountAdmin(baseQuery);

    data["blogs"] = propertyResult;
    data["totalCounts"] = propertyTotalCount;

    const totalPages = Math.ceil(propertyTotalCount / limitCount);
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + limitCount, propertyTotalCount);
    data["totalPages"] = totalPages;
    data["startIndex"] = startIndex;
    data["endIndex"] = endIndex;

    return successWithDataResponse(res, true, "Blog list.", data);
  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, "Error fetching blog!", error);
  }
};

export const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await getBlogByIdAdmin(id);
    return successWithDataResponse(res, true, "Blog details.", result);
  } catch (error) {
    return badRequestResponse(res, false, "Error fetching blog.", error);
  }
};


export const listCategory = async (req, res) => {
  try {
    let data = {};
    const { page, limit } = req.query;

    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 100;
    const offset = (page - 1) * limit;

    const filters = req.query;
    let whereClauses = [];

    if (filters?.searchFilter && filters?.searchFilter.trim()) {
      const newSearchfilter = `tbc.title like '%${validator.escape(
        filters.searchFilter.trim()
      )}%'`;
      whereClauses.push(newSearchfilter);
    }

    whereClauses.push(` tbc.is_deleted = '0' `);

    let baseQuery = "";
    if (whereClauses.length > 0) {
      baseQuery = ` WHERE ` + whereClauses.join(" AND ");
    }

    const allowedColumns = ["id", "title", "status"];
    const allowedOrders = ["ASC", "DESC"];

    const sortColumn = allowedColumns.includes(filters.sortColumn)
      ? filters.sortColumn
      : "tbc.id";

    const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase())
      ? filters.sortOrder?.toUpperCase()
      : "ASC";

    console.log(filters, sortColumn, sortOrder);
    const propertyResult = await getAllCategoryListAdmin(
      baseQuery,
      sortColumn,
      sortOrder,
      pageCount,
      limitCount
    );
    const propertyTotalCount = await getAllCategoryCountAdmin(baseQuery);

    data["category"] = propertyResult;
    data["totalCounts"] = propertyTotalCount;

    const totalPages = Math.ceil(propertyTotalCount / limit);
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + limit, propertyTotalCount);
    data["totalPages"] = totalPages;
    data["startIndex"] = startIndex;
    data["endIndex"] = endIndex;

    return successWithDataResponse(res, true, "Blog Category list.", data);
  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, "Error fetching category!", error);
  }
};


