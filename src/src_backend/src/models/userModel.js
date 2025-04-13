import pool from '../config/db.js';


export const getAllUserListAdmin = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
  try {
    const offset = (page - 1) * limit;
    const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
    const roleJoin = `LEFT JOIN tbl_user_roles tur ON tur.id = tu.role_id`
    const searchQuery = `SELECT tu.*, tur.role_name FROM tbl_users_admin tu
                ${roleJoin}
                ${whereClause} ${orderQuery}
                LIMIT ${limit} OFFSET ${offset}`;
                
    const [rows] = await pool.execute(searchQuery);
    return rows;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('Unable to fetch users.');
  }
};

export const getAllUserCountAdmin = async ( whereClause = null ) => {
  try {

      const totalCountQuery = `SELECT 
                  COUNT(*) AS count
              FROM 
                   tbl_users_admin tu 
              ${whereClause}`;
    
      const [rows] = await pool.query(totalCountQuery);
      return rows[0].count;
  }
  catch(error) {
      throw new Error('Unable to fetch entry', error);
  }
};

// *** required.
export const getUsersById = async (id) => {
  
  try {
    const searchQuery = `SELECT tu.fname, tu.mname, tu.lname, tu.mobile, tu.email, tu.city_name, tu.state_name, tu.is_verified, tu.company_name, tu.company_web_url 
        FROM tbl_users tu 
        WHERE tu.id = ?`
    const [rows] = await pool.execute(searchQuery, [id]);
    return rows;

  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Unable to fetch user.');
  }
};

export const getUserAdminById = async (id) => {
  
  try {
    const roleJoin = `LEFT JOIN tbl_user_roles tur ON tur.id = tua.id`;
    // const searchQuery = `SELECT tu.*, tur.role_name FROM 
    //       tbl_users tu 
    //       ${roleJoin}
    //       where tu.id = ?`
    let selectedColumn = ` tua.id, tua.fname, tua.mname, tua.lname, 
      tua.mobile, tua.pan, tua.email, tua.address, tua.city_id, 
      tua.img_url, tua.created_at, tua.phone, tua.pincode, 
      tua.proof_number, tua.proof_type, tua.role_id, tua.state_id, tua.state_name, tua.status,
      tur.role_name`;

    let query = `SELECT ${selectedColumn} FROM tbl_users_admin tua
              ${roleJoin}
              WHERE tua.id = ?`
    const [rows] = await pool.execute(query, [id]); 
    return rows;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Unable to fetch user.');
  }
};

export const createAdminUser = async (data) => {
  const { fname, mname, lname, email, password_hash, mobile, phone, role_id, added_by } = data;

  try {
    const inserQuery = `INSERT INTO tbl_users_admin 
      (fname, mname, lname, email, mobile, phone, password_hash, role_id, added_by) 
      VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const paramsData = [fname, mname, lname, email, mobile, phone, password_hash, role_id, added_by];
    const [result] = await pool.execute( inserQuery, paramsData );

    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Unable to create user.', error);
  }
};

export const updateAdminUserAdmin = async (id, userData) => {
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
      UPDATE tbl_users_admin 
      SET 
      ${queryField.join(', ') }
      WHERE id = ?`;

    const [result] = await pool.execute(query, queryParams);
    return { affectedRows: result.affectedRows, ...userData };
  } catch (error) {
    console.error('Error updating admin user:', error);
    throw new Error('Unable to update admin user.');
  }
};

export const updateMemberProfile = async (id, userData) => {
  // const { fname, lname, mname, mobile, email, company_name, profile_picture_url, address_1, city_id, state_id, pincode } = userData;
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
    console.error('Error updating member:', error);
    throw new Error('Unable to update member.');
  }
};

export const deleteUserAdmin = async (id) => {
  try {
    await pool.execute('DELETE FROM tbl_users WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Unable to delete user.');
  }
};
