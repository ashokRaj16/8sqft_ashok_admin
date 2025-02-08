import pool from "../../config/db.js"; 
import { badRequestResponse, successResponse, successWithDataResponse } from '../../utils/response.js';

export const getAllPlans = async (req, res) => {
  try {
    
    const [result] = await pool.query('SELECT * FROM tbl_subscription_plans');
    console.log("result: ", result);
    return successResponse(res, true, 'All Plan Fatched Succesfully.',result);
  } catch (error) {
   return badRequestResponse(res, false, "Failed to fetch subscription plans", error);
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