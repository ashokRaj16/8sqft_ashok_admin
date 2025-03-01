import pool from "../../config/db.js";
import { getAllShortlistPropertyCount, getAllShortlistPropertyList } from "../../models/shortlistModel.js";
import { badRequestResponse, successResponse } from "../../utils/response.js";

/**
 * Get all intrested users by property id,
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getAllShortlistUsersByProperty = async (req, res) => {
  try {
    const { id } = req.params; // this is property_id.
    const { limit = 10, offset = 0 } = req.query;

    const countQuery = `SELECT COUNT(*) AS totalCount 
                        FROM tbl_property_shortlist 
                        WHERE JSON_CONTAINS(property_id, JSON_OBJECT('pid', ?))`;

    const [[countResult]] = await pool.query(countQuery, [parseInt(id)]);
    const totalCount = countResult.totalCount;

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
            tbl_property_shortlist tpi
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



    console.log("log", interestedUsersResult, id, limit, offset, totalCount, "count" );

    return successResponse(res, true, "Shortlist users retrieved successfully...", {
      totalCount,
      users: interestedUsersResult,
    });
  } catch (error) {
    console.error("Error in getAllShortlistUsersByProperty:", error);
    return badRequestResponse(res, false, "Failed to retrieve shortlist users.", error);
  }
};


/**
 * Get all intrested property by users id,
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getAllShortlistPropertyByUser = async (req, res) => {
  try {
    let data = {}
    const { page, limit } = req.query;
    const { id } = req.params;

    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 5;
    const offset = (pageCount - 1) * limitCount;

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

    const propertiesResult = await getAllShortlistPropertyList(baseQuery, pageCount, limitCount, sortColumn, sortOrder) 
    const totalCounts = await getAllShortlistPropertyCount(baseQuery);


    // Query to get total count of shortlisted properties for the user
    // const countQuery = `SELECT COUNT(*) AS totalCount 
    //                     FROM tbl_property_shortlist 
    //                     WHERE user_id = ?`;

    // const [[countResult]] = await pool.query(countQuery, [parseInt(id)]);
    // const totalCount = countResult.totalCount;

    // Query to get shortlisted properties with pagination
    // const interestedPropertyQuery = `SELECT 
    //     tp.id,  
    //     tp.property_title,
    //     tp.description,
    //     tp.locality,
    //     tp.property_type,
    //     tpi.user_id,
    //     tpi.property_id
    // FROM 
    //     tbl_property_shortlist tpi
    // JOIN 
    //     tbl_property tp
    // ON 
    //     JSON_CONTAINS(tpi.property_id, JSON_OBJECT('pid', tp.id))
    // WHERE 
    //     tpi.user_id = ?
    // LIMIT ? OFFSET ?`;

    // const [interestedPropertyResult] = await pool.query(interestedPropertyQuery, [
    //   parseInt(id),
    //   parseInt(limit),
    //   parseInt(offset),
    // ]);

    
    data['properties'] = propertiesResult;
    data['totalCounts'] = totalCounts;
    const totalPages = Math.ceil(totalCounts / limitCount);
    const startIndex = offset + 1;
    const endIndex   = Math.min(offset + limitCount, totalCounts);
    data['totalPages'] = totalPages;
    data['startIndex'] = startIndex;
    data['endIndex'] = endIndex;

    return successResponse(res, true, "Shortlisted properties retrieved successfully.", data);
  } catch (error) {
    console.error("Error in getAllShortlistPropertyByUser:", error);
    return badRequestResponse(res, false, "Failed to retrieve shortlisted properties.", error);
  }
};

export const removeShortlistPropertyByUser = async (req, res) => {
  try {
    const { user_id, property_id } = req.body;

    const checkQuery = `SELECT property_id FROM tbl_property_shortlist WHERE user_id = ?`;
    const [result] = await pool.query(checkQuery, [parseInt(user_id)]);

    if (result.length === 0) {
      return badRequestResponse(res, false, "No shortlisted properties found for this user.");
    }

    let existingProperties = JSON.parse(result[0].property_id);

    existingProperties = existingProperties.filter(prop => prop.pid !== parseInt(property_id));

    const updateQuery = `UPDATE tbl_property_shortlist SET property_id = ? WHERE user_id = ?`;
    await pool.query(updateQuery, [JSON.stringify(existingProperties), parseInt(user_id)]);

    return successResponse(res, true, "Property removed from shortlist successfully.");
  } catch (error) {
    console.error("Error in removeShortlistPropertyByUser:", error);
    return badRequestResponse(res, false, "Failed to remove property from shortlist.", error);
  }
};
