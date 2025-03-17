import pool from '../../config/db.js';
import { updateMemberProfile } from '../../models/userModel.js';
import { badRequestResponse, successResponse, successWithDataResponse } from '../../utils/response.js';

import ExcelJs from "exceljs";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit"


export const getProfile = async (req, res) => {
    const user_id = req.userId; 
    console.log("userId: ", req.userId);
    try {
        const selectQuery = `
        tu.id,
        tu.fname,
        tu.mname,
        tu.lname,
        tu.profile_picture_url,
        tu.company_name,
        tu.is_company_verified,
        tu.mobile,
        tu.is_mobile_verified,
        tu.email,
        tu.is_email_verified,
        tu.latitude,
        tu.longitude,
        tu.state_id,
        tu.city_id,
        tu.pincode,
        tu.contact_2,
        tu.address_1,
        tu.status,
        tu.is_verified,
        tu.instagram_url,
        tu.facebook_url,
        tu.youtube_url,
        tu.whatsapp_notification,
        tu.created_at,
        tu.updated_at
        `;

        const query = `SELECT ${selectQuery}
        FROM tbl_users tu WHERE id = ?`;
        let [rows] = await pool.query(query, [user_id]);
        
        if (rows.length === 0) {
            return badRequestResponse(res, false, "Profile not found.");
        }

        if(rows.length > 0) {
            const selectPropertyListCount = `SELECT count(*) as count, user_type FROM tbl_property WHERE user_id = ? GROUP BY user_type` ;
            const [propertyRows] = await pool.query(selectPropertyListCount, [user_id]);
            rows[0].isowner = propertyRows.some((i) => i.user_type === 'BUILDER' && i.count > 0);
            rows[0].isBuilder = propertyRows.some((i) => i.user_type === 'OWNER' && i.count > 0);
        }
        let data = rows[0]
        return successWithDataResponse(res, true, 'Profile list.', data);
    } catch (error) {
        return badRequestResponse(res, false, "Error fetching profile.", error);
    }
};

export const updateProfile = async (req, res) => {
    const id = req.userId;
    console.log(req.body);
    const { 
        fname, 
        lname, mname, company_name, company_web_url,
        address_1, city_id, state_id, pincode,
        instagram_url, facebook_url,
        youtube_url, whatsapp_notification
    } = req.body;

    try {
        
        const userData = {
            fname: fname || null,
            lname: lname || null,
            mname: mname || null,            
            address_1 : address_1 || null, 
            company_name : company_name || null,
            company_web_url : company_web_url || null,
            city_id : city_id || null,
            state_id : state_id || null,
            pincode: pincode || null,
            instagram_url: instagram_url || null,
            facebook_url: facebook_url || null,
            youtube_url: youtube_url || null,
            whatsapp_notification: whatsapp_notification || null
        }
        
        // console.log(userData, id)
        
        const result = await updateMemberProfile(id , userData)
        console.log(result,"update")
        if (result.affectedRows === 0) {
            return badRequestResponse(res, false, "Profile not found or no changes made.");
        }

        return successWithDataResponse(res, true, 'Profile updated successfully.', result);
    } catch (error) {
        console.error("Error updating profile:", error.message);
        return badRequestResponse(res, false, "Error updating profile", error);
    }
};

// Properties section
export const getInterestedUsers = async (req, res) => {
    try {
      const user_id = req.userId;
      const { limit = 10, offset = 0 } = req.query;

      const getPropertyQuery = 'SELECT property_title as title, id as property_id FROM tbl_property WHERE user_id = ?';
      const [properties] = await pool.query(getPropertyQuery, [user_id]);

      if (properties.length === 0) {
        return successResponse(res, true, 'No properties found for the user.', []);
      }
  
      console.log(properties)
  
      const propertyIds = properties.map(property => property.property_id);
      const propertyIdsJson = JSON.stringify(propertyIds);
  
      // Query to get interested users for the user's properties
      const interestedUsersQuery = `
        SELECT user_id, property_id 
        FROM tbl_property_intrest 
        WHERE JSON_CONTAINS(pid, ?) 
        LIMIT ? OFFSET ?`;
      const [interestedUsersResult] = await pool.query(interestedUsersQuery, [propertyIdsJson, parseInt(limit), parseInt(offset)]);
  
      if (interestedUsersResult.length === 0) {
        return successResponse(res, true, 'No users are interested in these properties.', []);
      }
  
      const userIds = [...new Set(interestedUsersResult.map(row => row.user_id))];
  
      // Query to get details of interested users
      const userDetailsQuery = `
        SELECT id, fname, lname, email, mobile 
        FROM tbl_users 
        WHERE id IN (?)`;
      const [userDetailsResult] = await pool.query(userDetailsQuery, [userIds]);
  
      if (userDetailsResult.length === 0) {
        return successResponse(res, true, 'No user details found for the interested users.', []);
      }
  
      // Map user details with their interested properties
      const userDetailsWithProperties = userDetailsResult.map(user => {
        const userInterests = interestedUsersResult.filter(interest => interest.user_id === user.id);
        const properties = userInterests.map(interest => {
          const propertyIdsArray = JSON.parse(interest.property_id || '[]');
          return propertyIdsArray.filter(id => propertyIds.includes(id));
        }).flat();
  
        return {
          ...user,
          properties,
        };
      });
  
      return successResponse(res, true, 'Interested users retrieved successfully.', userDetailsWithProperties);
    } catch (error) {
      console.error('Error in getInterestedUsers:', error);
      return badRequestResponse(res, false, 'Failed to retrieve interested users.', error);
    }
};

export const getListedProperties = async (req, res) => {
try {
    const userId = req.userId;
    const { limit, page = 1 } = req.query;
    const pageCount         = page && parseInt(page) || 1;
    const limitCount        = limit && parseInt(limit) || 10;
    const offset          = (pageCount - 1) * limitCount;

    let data = {}
    
    const ImageJoin = `
    LEFT JOIN (
        SELECT tpg.*
        FROM tbl_property_gallery tpg
        WHERE tpg.id = (
            SELECT MIN(id) FROM tbl_property_gallery WHERE property_id = tpg.property_id AND status = '1'
        )
    ) tpg ON tpg.property_id = tp.id
    `;

    const limitQuery = `LIMIT ${limitCount} OFFSET ${offset}`;
    const countQuery = `(
                SELECT COUNT(*)
                FROM tbl_property_intrest tps
                WHERE JSON_CONTAINS(
                    tps.property_id,
                    JSON_OBJECT('pid', tp.id)
                )
            ) AS contactedCount,
            (
             SELECT COUNT(*)
                FROM tbl_marketing_details tmd
                LEFT JOIN tbl_property_marketing tpm
                ON tpm.id = tmd.pm_id
                WHERE 
                    tpm.property_id = tp.id
            ) AS leadCount,
            (
                SELECT COUNT(*)
                FROM tbl_property_shortlist tps
                WHERE JSON_CONTAINS(
                    tps.property_id,
                    JSON_OBJECT('pid', tp.id)
                )
            ) AS shortlistedCount`;
    const propertyQuery = `SELECT tp.*, tpg.property_img_url, tpg.image_category, tpg.file_type,
        ${countQuery}
    FROM tbl_property tp 
    ${ImageJoin} WHERE tp.user_id = ? AND tp.is_deleted = '0' ORDER BY tp.id DESC ${limitQuery}`;

    const [propertyResult] = await pool.query(propertyQuery, [userId]);
    
    if (propertyResult.length === 0) {
    return successResponse(res, true, 'No property listed.', []);
    }
    
    const propertyCountQuery = `SELECT count(*) as count
    FROM tbl_property tp 
    WHERE tp.user_id = ? AND tp.is_deleted = '0'`;

    const [propertyTotalCount] = await pool.query(propertyCountQuery, [userId]);
    data['property'] = propertyResult;
    data['totalCounts'] = propertyTotalCount[0].count;
    console.log(propertyTotalCount)

    const totalPages = Math.ceil(propertyTotalCount[0].count / limitCount);
    const startIndex = offset + 1;
    const endIndex   = Math.min(offset + limitCount, propertyTotalCount[0].count);
    data['totalPages'] = totalPages;
    data['startIndex'] = startIndex;
    data['endIndex'] = endIndex;

    return successResponse(res, true, 'Properties retrieved successfully.', data);

} catch (error) {
    console.error('Error in getShortlistedProperties:', error);
    return badRequestResponse(res, false, 'Failed to retrieve shortlisted properties.', error);
}
};

export const getShortlistedProperties = async (req, res) => {
try {
    const userId = req.userId;
    let data = {}
    const { limit, page = 1 } = req.query;
    const pageCount         = parseInt(page) || 1;
    const limitCount        = parseInt(limit) || 10;
    const offset          = (pageCount - 1) * limitCount;

    if (!userId) {
        return badRequestResponse(res, false, 'User ID is required');
    }
 
    const wishlistQuery = `SELECT property_id FROM tbl_property_shortlist WHERE user_id = ?`;
    const [wishlistResult] = await pool.query(wishlistQuery, [userId]);
    
    if (wishlistResult.length === 0) {
    return successResponse(res, true, 'No shortlisted properties found.', []);
    }
    
    console.log("result ",JSON.parse(wishlistResult[0].property_id))
    const propertyIds = JSON.parse(wishlistResult[0].property_id).map(row => row.pid);

    const ImageJoin = `
    LEFT JOIN (
        SELECT tpg.*
        FROM tbl_property_gallery tpg
        WHERE tpg.id = (
        SELECT MIN(id) FROM tbl_property_gallery WHERE property_id = tpg.property_id AND status = '1'
        )
    ) tpg ON tpg.property_id = tp.id
    `;
    const limitQuery = ` LIMIT ${limitCount} OFFSET ${offset}`;

    const propertyDetailsQuery = `SELECT tp.*, tpg.property_img_url, tpg.image_category, tpg.file_type
    FROM tbl_property tp 
    ${ImageJoin} WHERE tp.id IN (?) ORDER BY tp.id DESC ${ limitQuery }`;
    console.log(propertyDetailsQuery, "query::")
    const [propertyDetailsResult] = await pool.query(propertyDetailsQuery, [propertyIds]);
    
    const propertyCountQuery = `SELECT count(*) as count
    FROM tbl_property tp 
    WHERE tp.id IN (?) ORDER BY tp.id DESC`;

    const [propertyTotalCount] = await pool.query(propertyCountQuery, [propertyIds]);
    data['property'] = propertyDetailsResult;
    data['totalCounts'] = propertyTotalCount[0].count;
    console.log(propertyTotalCount)

    const totalPages = Math.ceil(propertyTotalCount[0].count / limitCount);
    const startIndex = offset + 1;
    const endIndex   = Math.min(offset + limitCount, propertyTotalCount[0].count);
    data['totalPages'] = totalPages;
    data['startIndex'] = startIndex;
    data['endIndex'] = endIndex;

    if (propertyDetailsResult.length === 0) {
        return successResponse(res, true, 'No property details found for the shortlisted properties.', []);
    }

    return successResponse(res, true, 'Shortlisted properties retrieved successfully.', data);

} catch (error) {
    console.error('Error in getShortlistedProperties:', error);
    return badRequestResponse(res, false, 'Failed to retrieve shortlisted properties.', error);
}
};

export const getContectedProperties = async (req, res) => {
try {
    const userId = req.userId;
    let data = {}
    const { limit, page = 1 } = req.query;
    const pageCount         = parseInt(page) || 1;
    const limitCount        = parseInt(limit) || 10;
    const offset          = (pageCount - 1) * limitCount;

    const contactedQuery = 'SELECT property_id FROM tbl_property_intrest WHERE user_id = ?';
    const [ContactedResult] = await pool.query(contactedQuery, [userId]);
    
    if (ContactedResult.length === 0) {
    return successResponse(res, true, 'No Contacted properties found.', []);
    }
    
    console.log("result ",JSON.parse(ContactedResult[0].property_id))
    const propertyIds = JSON.parse(ContactedResult[0].property_id).map(row => row.pid);

    console.log(propertyIds)
    const ImageJoin = `
    LEFT JOIN (
        SELECT tpg.*
        FROM tbl_property_gallery tpg
        WHERE tpg.id = (
            SELECT MIN(id) FROM tbl_property_gallery WHERE property_id = tpg.property_id AND status = '1'
        )
    ) tpg ON tpg.property_id = tp.id
    `;
    const limitQuery = ` LIMIT ${limitCount} OFFSET ${offset}`;
    const propertyDetailsQuery = `SELECT tp.*, tpg.property_img_url, tpg.image_category, tpg.file_type
    FROM tbl_property tp 
    ${ImageJoin} WHERE tp.id IN (?) ORDER BY tp.id DESC ${limitQuery}`;
    const [propertyDetailsResult] = await pool.query(propertyDetailsQuery, [propertyIds]);

    const propertyCountQuery = `SELECT count(*) as count
    FROM tbl_property tp 
    WHERE tp.id IN (?) ORDER BY tp.id DESC`;

    const [propertyTotalCount] = await pool.query(propertyCountQuery, [propertyIds]);
    data['property'] = propertyDetailsResult;
    data['totalCounts'] = propertyTotalCount[0].count;
    console.log(propertyTotalCount)

    const totalPages = Math.ceil(propertyTotalCount[0].count / limitCount);
    const startIndex = offset + 1;
    const endIndex   = Math.min(offset + limitCount, propertyTotalCount[0].count);
    data['totalPages'] = totalPages;
    data['startIndex'] = startIndex;
    data['endIndex'] = endIndex;

    if (propertyDetailsResult.length === 0) {
        return successResponse(res, true, 'No property details found for the contacted properties.', []);
    }

    return successResponse(res, true, 'Contacted properties retrieved successfully.', data);

} catch (error) {
    console.error('Error:', error);
    return badRequestResponse(res, false, 'Failed to retrieve contacted properties.', error);
}
};

/**
 * Contacted users by property
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getShortlistUsersByProperty = async (req, res) => {
    try {
        const { id } = req.params; // this is property_id.
        let data ={}
        const { limit, page} = req.query;
        const pageCount         = page && parseInt(page) || 1;
        const limitCount        = limit && parseInt(limit) || 10;
        const offset          = (pageCount - 1) * limitCount;
  
      const countQuery = `SELECT COUNT(*) AS count 
                          FROM  tbl_property_intrest tpi
                            JOIN 
                                tbl_users tu
                            ON 
                                tpi.user_id = tu.id
                            WHERE 
                            JSON_CONTAINS(
                                tpi.property_id,
                            JSON_OBJECT('pid', ?))`;
  
      const [countResult] = await pool.query(countQuery, [parseInt(id)]);
    //   const totalCount = countResult.totalCount;
  
        const limitQuery = `LIMIT ${limitCount} OFFSET ${offset}`;
        const interestedUsersQuery = `SELECT 
                tu.id,
                tu.fname,
                tu.mname,
                tu.lname,
                tu.email,
                tu.mobile,
                tu.address_1,
                tpi.user_id
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
            ${limitQuery}`;
          
        const [interestedUsersResult] = await pool.query(interestedUsersQuery, [
            parseInt(id),
            parseInt(limitCount),
            parseInt(offset),
        ]);

        data['users'] = interestedUsersResult;
        data['totalCounts'] = countResult[0].count;

        const totalPages = Math.ceil(countResult[0].count / limitCount);
        const startIndex = offset + 1;
        const endIndex   = Math.min(offset + limitCount, countResult[0].count);
        data['totalPages'] = totalPages;
        data['startIndex'] = startIndex;
        data['endIndex'] = endIndex;

      console.log("log", interestedUsersResult, id, limit, offset,  "count" );
  
      return successResponse(res, true, "Shortlist users retrieved successfully...", 
        data
      );
    } catch (error) {
      console.error("Error in getAllShortlistUsersByProperty:", error);
      return badRequestResponse(res, false, "Failed to retrieve shortlist users.", error);
    }
  };
  
export const getContactedUsersByProperty = async (req, res) => {
    try {
        const { id } = req.params; // this is property_id.
        let data ={}
        const { limit, page} = req.query;
        const pageCount         = page && parseInt(page) || 1;
        const limitCount        = limit && parseInt(limit) || 10;
        const offset          = (pageCount - 1) * limitCount;
  
      const countQuery = `SELECT COUNT(*) AS count 
                          FROM  tbl_property_shortlist tpi
                            JOIN 
                                tbl_users tu
                            ON 
                                tpi.user_id = tu.id
                            WHERE 
                            JSON_CONTAINS(
                                tpi.property_id,
                            JSON_OBJECT('pid', ?))`;
  
      const [countResult] = await pool.query(countQuery, [parseInt(id)]);
    //   const totalCount = countResult.totalCount;
  
      const limitQuery = `LIMIT ${limitCount} OFFSET ${offset}`;
      const interestedUsersQuery = `SELECT 
              tu.id,
              tu.fname,
              tu.mname,
              tu.lname,
              tu.email,
              tu.mobile,
              tu.address_1,
              tpi.user_id,
              tu.created_at
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
          ${limitQuery}`;
  
      const [interestedUsersResult] = await pool.query(interestedUsersQuery, [
        parseInt(id),
        parseInt(limitCount),
        parseInt(offset),
      ]);

       // console.log(limitQuery)
            
       const leadUsersQuery = `SELECT 
            tmd.id,
            tmd.full_name,
            tmd.mobile,
            tmd.email,
            tmd.status,
            tmd.created_at
        FROM 
            tbl_marketing_details tmd
        JOIN 
            tbl_property_marketing tpm
        ON 
            tpm.id = tmd.pm_id
        WHERE 
            tpm.property_id = ?
        ${limitQuery}`;

        const [leadUsersResult] = await pool.query(leadUsersQuery, [
        parseInt(id),
        parseInt(limitCount),
        parseInt(offset),
        ]);

        const tranformedLeads = leadUsersResult.map((i) => (
            {
                id: i.id,
                fname: i.full_name,
                mname: null,
                lname: null,
                mobile: i.mobile || null,
                email : i.email || null,
                address_1 : null,
                user_id: null,
                created_at : i.created_at || null
            }
        ))
        interestedUsersResult.push(...tranformedLeads);
        console.log(leadUsersResult, interestedUsersResult, "details:::");
    //   console.log("limit:::",limitQuery, countResult)
        data['users'] = interestedUsersResult;
        data['totalCounts'] = countResult[0].count;

        const totalPages = Math.ceil(countResult[0].count / limitCount);
        const startIndex = offset + 1;
        const endIndex   = Math.min(offset + limitCount, countResult[0].count);
        data['totalPages'] = totalPages;
        data['startIndex'] = startIndex;
        data['endIndex'] = endIndex;

        return successResponse(res, true, "Shortlist users retrieved successfully...", data );
    } catch (error) {
      console.error("Error in getAllShortlistUsersByProperty:", error);
      return badRequestResponse(res, false, "Failed to retrieve shortlist users.", error);
    }
};

/**
 * Payment 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getPaymentHistoryLogs = async (req, res) => {
try {
    const userId = req.userId;
    let data = {}
    const { limit, page = 1 } = req.query;
    const pageCount         = parseInt(page) || 1;
    const limitCount        = parseInt(limit) || 10;
    const offset          = (pageCount - 1) * limitCount;

    if (!userId) {
        return badRequestResponse(res, false, 'User ID is required');
    }

    const limitQuery = ` LIMIT ${limitCount} OFFSET ${offset}`;
    const planJoin = ` LEFT JOIN tbl_subscription_plans tsp ON tph.plan_id = tsp.id `
    const paymentLogsQuery = `SELECT tph.user_id, tph.plan_id, tph.order_id, tph.order_amount,
    tph.payment_status, tph.created_at, tsp.*
    FROM tbl_payment_history tph 
    ${planJoin}
    WHERE tph.user_id = ? ORDER BY tph.created_at DESC ${limitQuery}`;
    const [paymentLogsResult] = await pool.query(paymentLogsQuery, [userId]);

    const countQuery = `SELECT count(*) as count
    FROM tbl_payment_history tph 
    WHERE tph.user_id = ?`;

    const [totalCount] = await pool.query(countQuery, [userId]);

    data['payments'] = paymentLogsResult;
    data['totalCounts'] = totalCount[0].count;
    // console.log(totalCount)

    const totalPages = Math.ceil(totalCount[0].count / limitCount);
    const startIndex = offset + 1;
    const endIndex   = Math.min(offset + limitCount, totalCount[0].count);
    data['totalPages'] = totalPages;
    data['startIndex'] = startIndex;
    data['endIndex'] = endIndex;

    if (paymentLogsResult.length === 0) {
        return successResponse(res, true, 'No payment logs found.', []);
    }

    return successResponse(res, true, 'Payment logs retrieved successfully.', data);

} catch (error) {
    console.error('Error in getPaymentLogs:', error);
    return badRequestResponse(res, false, 'Failed to retrieve payment logs.', error);
}
};

export const getPaymentPlanTransaction = async (req, res) => {
    try {
        const userId = req.userId;
        let data = {}
        const { limit, page = 1 } = req.query;
        const pageCount         = parseInt(page) || 1;
        const limitCount        = parseInt(limit) || 10;
        const offset          = (pageCount - 1) * limitCount;
        
        const limitQuery = ` LIMIT ${limitCount} OFFSET ${offset}`;
        const planJoin = ` LEFT JOIN tbl_subscription_plans tsp ON tpt.plan_id = tsp.id `

        // const selectOption = `tpt.user_id, tpt.plan_id, tpt.order_id, tpt.order_amount, 
        // tpt.plan_start_date, tpt.plan_end_date,
        // tpt.payment_status, tpt.created_at as added_date, tsp.*`;
        const paymentLogsQuery = `SELECT tpt.*, tsp.*
        FROM tbl_payment_transaction tpt
        ${planJoin}
        WHERE tpt.user_id = ? ORDER BY tpt.created_at DESC ${limitQuery}`;
        const [paymentLogsResult] = await pool.query(paymentLogsQuery, [userId]);
    
        const countQuery = `SELECT count(*) as count
        FROM tbl_payment_transaction tpt
        WHERE tpt.user_id = ?`;
    
        const [totalCount] = await pool.query(countQuery, [userId]);
    
        data['payments'] = paymentLogsResult;
        data['totalCounts'] = totalCount[0].count;
        // console.log(totalCount)
    
        const totalPages = Math.ceil(totalCount[0].count / limitCount);
        const startIndex = offset + 1;
        const endIndex   = Math.min(offset + limitCount, totalCount[0].count);
        data['totalPages'] = totalPages;
        data['startIndex'] = startIndex;
        data['endIndex'] = endIndex;
    
        if (paymentLogsResult.length === 0) {
            return successResponse(res, true, 'No payment logs found.', []);
        }
    
        return successResponse(res, true, 'Payment logs retrieved successfully.', data);
    
    } catch (error) {
        console.error('Error in getPaymentLogs:', error);
        return badRequestResponse(res, false, 'Failed to retrieve payment logs.', error);
    }
};


export const sendOTPWhatsapp = (req, res) => {
    try{

    }
    catch(error) {
        return badRequestResponse(res, false, "bad request.", error)
    }
}

export const verifyOTPWhatsapp = (req, res) => {
    try{

    }
    catch(error) {
        return badRequestResponse(res, false, "bad request.", error)
    }
}


export const sendOTPMail = (req, res) => {
    try{

        // send otp here
    }
    catch(error) {
        return badRequestResponse(res, false, "bad request.", error)
    }
}

export const verifyOTPMail = (req, res) => {
    try{

        // check otp here

        // and update status here in tbl_user

    }
    catch(error) {
        return badRequestResponse(res, false, "bad request.", error)
    }
}

// Excel contect user by property
export const downloadContactedUsersExcel = async (req, res) => {
    try {
        const { id } = req.params; // this is property_id.
        let data = {};
        const { limit, page } = req.query;
        const pageCount = page ? parseInt(page) : 1;
        const limitCount = limit ? parseInt(limit) : 10;
        const offset = (pageCount - 1) * limitCount;

        const countQuery = `SELECT COUNT(*) AS count 
                            FROM  tbl_property_shortlist tpi
                            JOIN tbl_users tu ON tpi.user_id = tu.id
                            WHERE JSON_CONTAINS(tpi.property_id, JSON_OBJECT('pid', ?))`;

        const [countResult] = await pool.query(countQuery, [parseInt(id)]);

        const limitQuery = `LIMIT ${limitCount} OFFSET ${offset}`;
        const interestedUsersQuery = `SELECT 
                tu.id, tu.fname, tu.mname, tu.lname, tu.email, 
                tu.mobile, tu.address_1, tpi.user_id, tu.created_at
            FROM tbl_property_shortlist tpi
            JOIN tbl_users tu ON tpi.user_id = tu.id
            WHERE JSON_CONTAINS(tpi.property_id, JSON_OBJECT('pid', ?))
            ${limitQuery}`;

        const [interestedUsersResult] = await pool.query(interestedUsersQuery, [parseInt(id)]);

        const leadUsersQuery = `SELECT 
                tmd.id, tmd.full_name, tmd.mobile, tmd.email, 
                tmd.status, tmd.created_at
            FROM tbl_marketing_details tmd
            JOIN tbl_property_marketing tpm ON tpm.id = tmd.pm_id
            WHERE tpm.property_id = ?
            ${limitQuery}`;

        const [leadUsersResult] = await pool.query(leadUsersQuery, [parseInt(id)]);

        const transformedLeads = leadUsersResult.map((i) => ({
            id: i.id,
            fname: i.full_name,
            mname: null,
            lname: null,
            mobile: i.mobile || null,
            email: i.email || null,
            address_1: null,
            user_id: null,
            created_at: i.created_at || null,
        }));

        const finalData = [...interestedUsersResult, ...transformedLeads];

        // Create an Excel file
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Contacted Users");

        // Define columns
        worksheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "First Name", key: "fname", width: 15 },
            { header: "Middle Name", key: "mname", width: 15 },
            { header: "Last Name", key: "lname", width: 15 },
            { header: "Email", key: "email", width: 25 },
            { header: "Mobile", key: "mobile", width: 15 },
            { header: "Address", key: "address_1", width: 25 },
            { header: "User ID", key: "user_id", width: 10 },
            { header: "Created At", key: "created_at", width: 20 }
        ];

        // Add data to worksheet
        worksheet.addRows(finalData);

        // Set response headers for file download
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=contacted_users_${id}.xlsx`
        );

        // Write the workbook to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Error in downloadContactedUsersExcel:", error);
        return badRequestResponse(res, false, "Failed to download excel.", error);
    }
};

// PDF contect user by property
export const downloadContactedUsersPDF = async (req, res) => {
    try {
        const { id } = req.params; // this is property_id.
        let data = {};
        const { limit, page } = req.query;
        const pageCount = page ? parseInt(page) : 1;
        const limitCount = limit ? parseInt(limit) : 10;
        const offset = (pageCount - 1) * limitCount;

        const countQuery = `SELECT COUNT(*) AS count 
                            FROM  tbl_property_shortlist tpi
                            JOIN tbl_users tu ON tpi.user_id = tu.id
                            WHERE JSON_CONTAINS(tpi.property_id, JSON_OBJECT('pid', ?))`;

        const [countResult] = await pool.query(countQuery, [parseInt(id)]);

        const limitQuery = `LIMIT ${limitCount} OFFSET ${offset}`;
        const interestedUsersQuery = `SELECT 
                tu.id, tu.fname, tu.mname, tu.lname, tu.email, 
                tu.mobile, tu.address_1, tpi.user_id, tu.created_at
            FROM tbl_property_shortlist tpi
            JOIN tbl_users tu ON tpi.user_id = tu.id
            WHERE JSON_CONTAINS(tpi.property_id, JSON_OBJECT('pid', ?))
            ${limitQuery}`;

        const [interestedUsersResult] = await pool.query(interestedUsersQuery, [parseInt(id)]);

        const leadUsersQuery = `SELECT 
                tmd.id, tmd.full_name, tmd.mobile, tmd.email, 
                tmd.status, tmd.created_at
            FROM tbl_marketing_details tmd
            JOIN tbl_property_marketing tpm ON tpm.id = tmd.pm_id
            WHERE tpm.property_id = ?
            ${limitQuery}`;

        const [leadUsersResult] = await pool.query(leadUsersQuery, [parseInt(id)]);

        const transformedLeads = leadUsersResult.map((i) => ({
            id: i.id,
            fname: i.full_name,
            mname: null,
            lname: null,
            mobile: i.mobile || null,
            email: i.email || null,
            address_1: null,
            user_id: null,
            created_at: i.created_at || null,
        }));

        const finalData = [...interestedUsersResult, ...transformedLeads];

        // Create a new PDF document
        const doc = new PDFDocument({ margin: 30, size: "A4" });

        // Set response headers for file download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=contacted_users_${id}.pdf`
        );

        doc.pipe(res); // Pipe the document to the response

        // Title
        doc.fontSize(18).text("Contacted Users List", { align: "center" });
        doc.moveDown(1);

        // Table Headers
        doc
            .fontSize(12)
            .text("ID", 50, doc.y, { width: 50, bold: true })
            .text("First Name", 100, doc.y, { width: 100, bold: true })
            .text("Last Name", 200, doc.y, { width: 100, bold: true })
            .text("Email", 300, doc.y, { width: 150, bold: true })
            .text("Mobile", 450, doc.y, { width: 100, bold: true });
        doc.moveDown(0.5);
        doc.strokeColor("#000").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);

        // Add Users to PDF
        finalData.forEach((user) => {
            doc
                .fontSize(10)
                .text(user.id, 50, doc.y, { width: 50 })
                .text(user.fname || "", 100, doc.y, { width: 100 })
                .text(user.lname || "", 200, doc.y, { width: 100 })
                .text(user.email || "", 300, doc.y, { width: 150 })
                .text(user.mobile || "", 450, doc.y, { width: 100 });
            doc.moveDown(0.5);
        });

        doc.end();
    } catch (error) {
        console.error("Error in downloadContactedUsersPDF:", error);
        return badRequestResponse(res, false, "Failed to download PDF.", error);
    }
};
