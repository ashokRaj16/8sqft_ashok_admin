import pool from '../config/db.js';

export const getAllPlansListAdmin = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
    try {
      const offset = (page - 1) * limit;
      const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
      const searchQuery = `SELECT * FROM  tbl_subscription_plans tsp
                  ${whereClause} ${orderQuery}
                  LIMIT ${limit} OFFSET ${offset}`;
      const [rows] = await pool.execute(searchQuery);
      return rows;
    } catch (error) {
      console.error('Error fetching all plans:', error);
      throw new Error('Unable to fetch plans.');
    }
};

export const getAllPlansCountAdmin = async ( whereClause = null ) => {
  try {

      const totalCountQuery = `SELECT 
                  COUNT(*) AS count
              FROM 
                    tbl_subscription_plans tsp
              ${whereClause}`;
    
      const [rows] = await pool.query(totalCountQuery);
      return rows[0].count;
  }
  catch(error) {
      throw new Error('Unable to fetch entry.', error);
  }
};
  
  