import pool from '../config/db.js';

export const getAllRegisterPlansListAdmin = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
    try {
      const offset = (page - 1) * limit;
      const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
      const userJoin = ` LEFT JOIN tbl_users tu ON tpt.user_id = tu.id`;
      const planJoin = ` LEFT JOIN tbl_subscription_plans tsp ON tpt.plan_id = tsp.id`;
      const searchQuery = `SELECT tpt.id as sub_id, tu.id as user_id, tsp.id as plan_id, tu.fname, tu.lname, tu.mobile, tsp.plan_title, tsp.plan_names, tsp.user_type, tpt.order_id, tpt.order_amount, tpt.payment_status, tpt.payment_mode, tpt.created_at FROM tbl_payment_transaction tpt
                  ${userJoin} ${planJoin}
                  ${whereClause} ${orderQuery}
                  LIMIT ${limit} OFFSET ${offset}`;
      const [rows] = await pool.execute(searchQuery);
      return rows;
    } catch (error) {
      console.error('Error fetching all plans:', error);
      throw new Error('Unable to fetch plans.');
    }
};


export const getAllRegisterPlansCountAdmin = async ( whereClause = null ) => {
  try {

      const totalCountQuery = `SELECT 
                  COUNT(*) AS count
              FROM 
                  tbl_payment_transaction tpt
              ${whereClause}`;
    
      const [rows] = await pool.query(totalCountQuery);
      return rows[0].count;
  }
  catch(error) {
      throw new Error('Unable to fetch entry.', error);
  }
};


export const getRegisterPlansById = async (id) => {
  
  try {
    const userJoin = ` LEFT JOIN tbl_users tu ON tpt.user_id = tu.id`;
    const planJoin = ` LEFT JOIN tbl_subscription_plans tsp ON tpt.plan_id = tsp.id`;
    const searchQuery = `SELECT 
        tpt.id as id, tu.id as user_id, tsp.id as plan_id, 
        tu.fname, tu.mname, tu.lname, tu.mobile, tu.email, tu.address_1 as address,
        tsp.plan_title, tsp.plan_names, tsp.user_type, tsp.property_category, tsp.plan_rent_sale,
        tpt.order_id, tpt.order_amount, tpt.currency, tpt.razorpay_payment_id, tpt.razorpay_order_id, tpt.payment_status, tpt.payment_mode, tpt.plan_start_date, tpt.plan_end_date, tpt.user_agent, tpt.host_name, tpt.ip_address, tpt.created_at
        FROM tbl_payment_transaction tpt
        ${userJoin} ${planJoin}
        WHERE tpt.id = ?`;

    const [rows] = await pool.execute(searchQuery, [id]);
    return rows;

  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Unable to fetch user.');
  }
};