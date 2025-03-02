import pool from "../../config/db.js";
import { getAllContactedPropertyCount, getAllContactedPropertyList } from "../../models/contactedModel.js";
import { badRequestResponse, successResponse } from "../../utils/response.js";

/**
 * Get all intrested users by property id,
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getAllContactedUsersByProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    // Query to get total count of interested users for the property
    const countQuery = `SELECT COUNT(*) AS totalCount 
                        FROM tbl_property_intrest 
                        WHERE JSON_CONTAINS(property_id, JSON_OBJECT('pid', ?))`;

    const [[countResult]] = await pool.query(countQuery, [parseInt(id)]);
    const totalCount = countResult.totalCount;

    // Query to get interested users with pagination
    const interestedUsersQuery = `SELECT 
            tu.id,
            tu.fname,
            tu.mname,
            tu.lname,
            tu.email,
            tu.mobile,
            tpi.user_id,
            tpi.property_id
        FROM 
            tbl_property_intrest tpi
        JOIN 
            tbl_users tu
        ON 
            tpi.user_id = tu.id
        WHERE 
            JSON_CONTAINS(
                tpi.property_id,
                JSON_OBJECT('pid', ?)
            )
        LIMIT ? OFFSET ?`;

    const [interestedUsersResult] = await pool.query(interestedUsersQuery, [
      parseInt(id),
      parseInt(limit),
      parseInt(offset),
    ]);

    console.log("intrested:::", interestedUsersResult, id, limit, offset, totalCount);

    return successResponse(res, true, "Interested users retrieved successfully...", {
      totalCount,
      users: interestedUsersResult,
    });

  } catch (error) {
    console.error("Error in getAllIntrestedUsersByProperty:", error);
    return badRequestResponse(res, false, "Failed to retrieve interested users.", error);
  }
};

/**
 * Get all intrested property by users id,
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getAllContactedPropertyByUser = async (req, res) => {
  try {
    let data = {}
    const { page, limit } = req.query;
    const { id } = req.params;

    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 5;
    const offset = (page - 1) * limit;

    const filters = req.query;
    let whereClauses = [];

    whereClauses.push(` tp.is_deleted = '0' `);
    whereClauses.push(` tpi.user_id = '${id}' `);

    let baseQuery = '';
    if (whereClauses.length > 0) {
        baseQuery = ` WHERE ` + whereClauses.join(' AND ');
    }
    const allowedColumns = ['id', '	created_at'];
    const allowedOrders = ['ASC', 'DESC'];

    const sortColumn = allowedColumns.includes(filters?.sortColumn) ? filters.sortColumn : 'id';
    const sortOrder = allowedOrders.includes(filters?.sortOrder?.toUpperCase()) ? filters.sortOrder?.toUpperCase() : 'DESC';

    const propertiesResult = await getAllContactedPropertyList(baseQuery, pageCount, limitCount, sortColumn, sortOrder) 
    const totalCounts = await getAllContactedPropertyCount(baseQuery);
    
    data['properties'] = propertiesResult;
    data['totalCounts'] = totalCounts;
    const totalPages = Math.ceil(totalCounts / limit);
    const startIndex = offset + 1;
    const endIndex   = Math.min(offset + limit, totalCounts);
    data['totalPages'] = totalPages;
    data['startIndex'] = startIndex;
    data['endIndex'] = endIndex;

    return successResponse(res, true, "Interested properties retrieved successfully.", data);
  } catch (error) {
    console.error("Error in getAllInterestedPropertyByUser:", error);
    return badRequestResponse(res, false, "Failed to retrieve interested properties.", error);
  }
};


