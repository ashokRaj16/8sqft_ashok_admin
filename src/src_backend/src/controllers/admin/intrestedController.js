import pool from "../../config/db.js";
import { badRequestResponse, successResponse } from "../../utils/response.js";

/**
 * Get all intrested users by property id,
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getAllIntrestedUsersByProperty = async (req, res) => {
  try {
    const { id } = req.params; // this is property_id.
    const { limit = 10, offset = 0 } = req.query;

    // Query to get total count of interested users for the property
    const countQuery = `SELECT COUNT(*) AS totalCount 
                        FROM tbl_property_intrest 
                        WHERE JSON_CONTAINS(property_id, JSON_OBJECT('pid', ?))`;

    const [[countResult]] = await pool.query(countQuery, [parseInt(id)]);
    const totalCount = countResult.totalCount;

    // Query to get interested users with pagination
    const interestedUsersQuery = `SELECT 
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

    console.log(interestedUsersQuery, interestedUsersResult, id, limit, offset, totalCount);

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
export const getAllInterestedPropertyByUser = async (req, res) => {
  try {
    const { id } = req.params; // this is user_id.
    const { limit = 10, offset = 0 } = req.query;

    // Query to get total count of interested properties for the user
    const countQuery = `SELECT COUNT(*) AS totalCount 
                        FROM tbl_property_intrest 
                        WHERE user_id = ?`;

    const [[countResult]] = await pool.query(countQuery, [parseInt(id)]);
    const totalCount = countResult.totalCount;

    // Query to get interested properties with pagination
    const interestedPropertyQuery = `SELECT 
        tp.property_title,
        tp.description,
        tp.locality,
        tp.property_type,
        tpi.user_id,
        tpi.property_id
    FROM 
        tbl_property_intrest tpi
    JOIN 
        tbl_property tp
    ON 
        JSON_CONTAINS(tpi.property_id, JSON_OBJECT('pid', tp.id))
    WHERE 
        tpi.user_id = ?
    LIMIT ? OFFSET ?`;

    const [interestedPropertyResult] = await pool.query(interestedPropertyQuery, [
      parseInt(id),
      parseInt(limit),
      parseInt(offset),
    ]);

    return successResponse(res, true, "Interested properties retrieved successfully.", {
      totalCount,
      properties: interestedPropertyResult,
    });
  } catch (error) {
    console.error("Error in getAllInterestedPropertyByUser:", error);
    return badRequestResponse(res, false, "Failed to retrieve interested properties.", error);
  }
};


