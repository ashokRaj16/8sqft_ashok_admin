import pool from '../config/db.js';

export const getAllContactUsListAdmin = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
    try {
      const offset = (page - 1) * limit;
      const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
      const searchQuery = `SELECT * FROM  tbl_contact_us tcu
                  ${whereClause} ${orderQuery}
                  LIMIT ${limit} OFFSET ${offset}`;
  
                  console.log(searchQuery)
      const [rows] = await pool.execute(searchQuery);
      return rows;
    } catch (error) {
      console.error('Error fetching all data:', error);
      throw new Error('Unable to fetch data.');
    }
};

export const getAllContactUsCountAdmin = async ( whereClause = null ) => {
  try {
      const totalCountQuery = `SELECT 
                  COUNT(*) AS count
              FROM 
                  tbl_contact_us tcu
              ${whereClause}`;
    
      const [rows] = await pool.query(totalCountQuery);
      console.log(rows);
      return rows[0].count;
  }
  catch(error) {
      throw new Error('Unable to fetch entry.', error);
  }
};


export const updateContactUsAdmin = async (id, contactusData) => {

  try {
      console.log("models", contactusData);
      
      let queryField = [];
      let queryParams = [];
  
      for (const [key, value] of Object.entries(contactusData)) {
          if (value !== undefined && value !== null) {
              queryField.push(`${key} = ?`);
              queryParams.push(value);
          } 
      }
      queryParams.push(id);
  
      const query = `
              UPDATE tbl_contact_us 
              SET 
              ${queryField.join(', ') }
              WHERE id = ?`;
  
      const [result] = await pool.execute(query, queryParams);
      return { affectedRows: result.affectedRows, ...blogData };
  } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Unable to update user.');
  }
};

export const deleteContactUsAdmin = async (id) => {
    try {
        const [result] = await pool.execute(`delete from tbl_contact_us where id = ?`, [id]);
        return result;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw new Error('Unable to delete data.');
    }
};

export const getContactUsByIdAdmin = async (id) => {

    try {
        const [rows] = await pool.execute('SELECT * FROM tbl_contact_us where id = ?', [id]);
        console.log(rows)
        return rows;

    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Unable to fetch data.');
    }
};