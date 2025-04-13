import pool from '../config/db.js';

export const getAllMemberListAdmin = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
  try {
    const offset = (page - 1) * limit;
    const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
    const searchQuery = `SELECT * FROM  tbl_users tu
                ${whereClause} ${orderQuery}
                LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await pool.execute(searchQuery);
    return rows;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('Unable to fetch users.');
  }
};

export const getAllMemberCountAdmin = async ( whereClause = null ) => {
  try {

      const totalCountQuery = `SELECT 
                  COUNT(*) AS count
              FROM 
                   tbl_users tu 
              ${whereClause}`;
    
      const [rows] = await pool.query(totalCountQuery);
    
      return rows[0].count;
  }
  catch(error) {
      throw new Error('Unable to fetch entry', error);
  }
};

export const getMemberUsersById = async (id) => {
  
  try {
    const query = `SELECT * FROM tbl_users where id = ? AND is_deleted = '0'`
    
    const [rows] = await pool.execute(query, [id]);
    return rows;

  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Unable to fetch user.');
  }
};

export const createMemberUser = async (data) => {

  const { fname, mname, lname, email, mobile, phone } = data;
  try {
    const [result] = await pool.execute(
      `INSERT INTO tbl_users 
        (fname, mname, lname, email, mobile, contact_2) 
        VALUES 
        (?, ?, ?,  ?, ?, ?)`,
      [fname, mname, lname, email, mobile, phone]
    );

    return { id: result.insertId, result };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Unable to create user.', error);
  }
};

export const updateUser = async (id, userData) => {
  const { fname, lname, email, mobile, phone } = userData;
  try {
    await pool.execute(
      'UPDATE tbl_users_admin SET fname = ?, lname = ?, email = ?, mobile = ?, phone = ? WHERE id = ?',
      [fname, lname, email, mobile, phone, id]
    );
    return { id, ...userData };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Unable to update user.');
  }
};

export const updateMemberAdmin = async (id, userData) => {
  try {
    
    let queryField = [];
    let queryParams = [];

    for (const [key, value] of Object.entries(userData)) {
      if (value !== undefined && value !== null) {
        queryField.push(`${key} = ?`);
        queryParams.push(value);
      } 
    }
    queryParams.push(id);

    const query = `
            UPDATE tbl_users 
            SET 
            ${queryField.join(', ') }
            WHERE id = ?`;

    const [result] = await pool.execute(query, queryParams);
    return { affectedRows: result.affectedRows, ...userData };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Unable to update user.');
  }
};

export const deleteMemberAdmin = async (id) => {
  try {
    const [result] = await pool.execute(
      'UPDATE tbl_users SET is_deleted = ? WHERE id = ?',
      ["1", id]
    );
    return result;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Unable to delete user.');
  }
};
