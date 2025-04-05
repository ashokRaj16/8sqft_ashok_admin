import pool from "../../config/db.js"; 
import { getAllPlansCountAdmin, getAllPlansListAdmin } from "../../models/plansModel.js";
import { badRequestResponse, successResponse, successWithDataResponse } from '../../utils/response.js';

export const listPlans = async (req, res) => {
  try {
    let data = {};
    const { page, limit } = req.query;

    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 100;
    const offset = (page - 1) * limit;

    const filters = req.query;
    let whereClauses = [];

    if (filters?.searchFilter && filters?.searchFilter.trim()) {
        const newSearchfilter = `tsp.plan_title like '%${filters.searchFilter.trim()}%'
                OR
                tsp.user_type like '%${filters.searchFilter.trim()}%' OR 
                tsp.property_category like '%${filters.searchFilter.trim()}%'
                `
        whereClauses.push(newSearchfilter);
    }

    let baseQuery = '';
    if (whereClauses.length > 0) {
        baseQuery = ` WHERE ` + whereClauses.join(' AND ');
    }
    
    
    const allowedColumns = ['id', 'plan_title', 'property_category', 'user_type', "plan_amount", "plan_discounted_amount"];
    const allowedOrders = ['ASC', 'DESC'];

    const sortColumn = allowedColumns.includes(filters.sortColumn) ? filters.sortColumn : 'id';
    const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase()) ? filters.sortOrder?.toUpperCase() : 'ASC';

    const usersResult = await getAllPlansListAdmin(baseQuery, sortColumn, sortOrder, pageCount, limitCount);
    const usersTotalCount = await getAllPlansCountAdmin(baseQuery);

    data['plans'] = usersResult;
    data['totalCounts'] = usersTotalCount;
    const totalPages = Math.ceil(usersTotalCount / limit);
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + limit, usersTotalCount);
    data['totalPages'] = totalPages;
    data['startIndex'] = startIndex;
    data['endIndex'] = endIndex;

    return successWithDataResponse(res, true, "plans list.", data);
} catch (error) {
    return badRequestResponse(res, false, "Error fetching plans.", error);
}
};

export const getPlanById = async (req, res) => {
  const { id } = req.params;
  try {

    const [result] = await pool.query('SELECT * FROM tbl_subscription_plans WHERE id = ?', [id]);
    if (result.length === 0) {
      return badRequestResponse(res, false, "Plan not found.");
    }
    return successResponse(res, true, 'plan fatched successfully.',result[0]);
  } catch (error) {
    return badRequestResponse(res, false, "Failed to fetch the plan", error);
  }
};

export const createPlan = async (req, res) => {
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
    return badRequestResponse(res, false, "Failed to create plan", error);
  }
};

export const updatePlan = async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const updates = Object.keys(fields)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');
  const values = [...Object.values(fields), id];

  try {
    const query = `UPDATE tbl_subscription_plans SET ${updates} WHERE id = $${values.length} `;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
     return badRequestResponse(res, false, "Plan not found");
    }
    return successResponse(res, true, 'Plan Updated Succesfully.',result.rows[0]);
  } catch (error) {
   return badRequestResponse(res, false, "Failed to update plan", error);
  }
};

export const changePlanStatus = async (req, res) => {
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
