import pool from '../config/db.js';


export const getAllUserListAdmin = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
  try {
    const offset = (page - 1) * limit;
    const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
    const searchQuery = `SELECT * FROM  tbl_users_admin tu
                ${whereClause} ${orderQuery}
                LIMIT ${limit} OFFSET ${offset}`;

                console.log(searchQuery)
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
      console.log(rows);
      return rows[0].count;
  }
  catch(error) {
      throw new Error('Unable to fetch entry', error);
  }
};

// *** check NR
export const getUsersById = async (id) => {
  
  try {
    const [rows] = await pool.execute('SELECT * FROM tbl_users where id = ?', [id]);
    console.log(rows)
    return rows;

  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Unable to fetch user.');
  }
};

export const getUserAdminById = async (id) => {
  
  try {
    let selectedColumn = ` id, fname, mname, lname, 
      mobile, pan, email, address, city_id, 
      img_url, created_at, phone, pincode, 
      proof_number, proof_type, role_id, state_id, state_name, status`;

    let query = `SELECT ${selectedColumn} FROM tbl_users_admin where id = ?`
    console.log(query, "wwwww")
    const [rows] = await pool.execute(query, [id]);
  
    return rows;

  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Unable to fetch user.');
  }
};

export const createAdminUser = async (data) => {
  const { fname, mname, lname, email, password_hash, mobile, phone, role_id, added_by } = data;
  // console.log(data)
  try {
    const inserQuery = `INSERT INTO tbl_users_admin 
      (fname, mname, lname, email, mobile, phone, password_hash, role_id, added_by) 
      VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const paramsData = [fname, mname, lname, email, mobile, phone, password_hash, role_id, added_by];
    const [result] = await pool.execute( inserQuery, paramsData );

    console.log(result)
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Unable to create user.', error);
  }
};

export const updateAdminUserAdmin = async (id, userData) => {
  try {
    console.log("models",userData);
    
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
    console.log("models",userData);
    
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
