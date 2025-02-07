import pool from "../../config/db.js"; 

import { getAllContactUsCountAdmin, getAllContactUsListAdmin, deleteContactUsAdmin, updateContactUsAdmin, getContactUsByIdAdmin } from "../../models/contactUsModel.js";
import { badRequestResponse, successResponse, successWithDataResponse } from '../../utils/response.js';

export const listContactUs = async (req, res) => {
  try {
    let data = {};
    const { page, limit } = req.query;

    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 100;
    const offset = (page - 1) * limit;

    const filters = req.query;
    let whereClauses = [];

    if (filters?.searchFilter && filters?.searchFilter.trim()) {
        const newSearchfilter = `tcu.full_name like '%${filters.searchFilter.trim()}%' OR
                tcu.email like '%${filters.searchFilter.trim()}%' OR 
                tcu.phone like '%${filters.searchFilter.trim()}%'
                `
        whereClauses.push(newSearchfilter);
    }

    let baseQuery = '';
    if (whereClauses.length > 0) {
        baseQuery = ` WHERE ` + whereClauses.join(' AND ');
    }

    console.log("Request body: ", whereClauses);
    
    
    const allowedColumns = ['id', 'full_name', 'email', 'phone'];
    const allowedOrders = ['ASC', 'DESC'];

    const sortColumn = allowedColumns.includes(filters.sortColumn) ? filters.sortColumn : 'id';
    const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase()) ? filters.sortOrder?.toUpperCase() : 'DESC';

    const usersResult = await getAllContactUsListAdmin(baseQuery, sortColumn, sortOrder, pageCount, limitCount);
    const usersTotalCount = await getAllContactUsCountAdmin(baseQuery);

    data['contacts'] = usersResult;
    data['totalCounts'] = usersTotalCount;
    const totalPages = Math.ceil(usersTotalCount / limit);
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + limit, usersTotalCount);
    data['totalPages'] = totalPages;
    data['startIndex'] = startIndex;
    data['endIndex'] = endIndex;

    return successWithDataResponse(res, true, "contact list.", data);
  } catch (error) {
      return badRequestResponse(res, false, "Error fetching contact.", error);
  }
};

export const getContactUsById = async (req, res) => {
  const { id } = req.params;
  try {

    const [result] = await getContactUsByIdAdmin(id);

    if (!result) {
      return badRequestResponse(res, false, "contact not found.");
    }
    return successResponse(res, true, 'contact fatched successfully.', result);
  } catch (error) {
    return badRequestResponse(res, false, "Failed to fetch the contact", error);
  }
};

export const createContactUs = async (req, res) => {
  const {
    plan_title,
    property_category,
    user_type,
    plan_names,
    plan_rent_sale,
    duration_days,
    leads_counts,
    contact_whatsapp_notification,
    promotion_on_web,
    promotion_on_meta,
    paid_promotion_on_sqft,
    paid_video_promotion,
    ind_sponsored_ads,
    agreement,
    assign_rm,
    plan_amount,
    plan_discounted_amount,
    plan_gst_per,
  } = req.body;

  console.log(req.body);
  try {
    const query = `
      INSERT INTO tbl_subscription_plans (
        plan_title, property_category, user_type, plan_names, plan_rent_sale, duration_days, leads_counts,
        contact_whatsapp_notification, promotion_on_web, promotion_on_meta, paid_promotion_on_sqft,
        paid_video_promotion, ind_sponsored_ads, agreement, assign_rm, plan_amount,
        plan_discounted_amount, plan_gst_per
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      plan_title, property_category, user_type, plan_names, plan_rent_sale, duration_days, leads_counts,
      contact_whatsapp_notification, promotion_on_web, promotion_on_meta, paid_promotion_on_sqft,
      paid_video_promotion, ind_sponsored_ads, agreement, assign_rm, plan_amount,
      plan_discounted_amount, plan_gst_per
    ];
    const result = await pool.query(query, values);

    return successWithDataResponse(res, false, result[0]);
  } catch (error) {
    console.log(error)
    return badRequestResponse(res, false, "Failed to create plan", error);
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone, message } = req.body;

  try {
    const data = {
      full_name: full_name || null,
      email: email || null,
      phone: phone || null,
      message: message || null,
    };
    
    const result = await updateContactUsAdmin(id, data);
    if (result.result.affectedRows === 0) {
     return badRequestResponse(res, false, "Plan not found");
    }

    return successWithDataResponse(res, true, 'Plan Updated Succesfully.', result);

  } catch (error) {
   return badRequestResponse(res, false, "Failed to update plan", error);
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  
    try {

    const result = await deleteContactUsAdmin(id);
    console.log(result)
    if (result.affectedRows === 0) {
      return badRequestResponse(res, false, "Contact Us details not found.");
    }
    return successWithDataResponse(res, true, 'Contact Us deleted Succesfully.', result);
  } catch (error) {
   return badRequestResponse(res, false, "Failed to delete Contact Us.", error);
  }
};

export const changeContactUStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const query = `UPDATE tbl_subscription_plans SET plan_status = ? WHERE id = ?`;
    const result = await pool.query(query, [status, id]);
    if (result.rows.length === 0) {
      return badRequestResponse(res, false, "Plan not found");
    }
    return successResponse(res, true, 'Status Updated Succesfully.',result.rows[0]);
  } catch (error) {
    return badRequestResponse(res, false, "Failed to update status", error);
  }
};
