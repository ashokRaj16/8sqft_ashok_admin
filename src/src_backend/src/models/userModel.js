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


// ## check if it required?
// export const getAllPropertyCountAdmin = async ( whereClause = null ) => {
//   try {

//       const totalCountQuery = `SELECT 
//                   COUNT(*) AS count
//               FROM 
//                   tbl_users tu 
//               ${whereClause}`;

//       // const totalCountQuery = `SELECT COUNT(*) AS count FROM tbl_property ${whereClause}`;
//       const [rows] = await pool.query(totalCountQuery);
//       console.log(rows);
//       return rows[0].count;
//   }
//   catch(error) {
//       throw new Error('Unable to fetch entry', error);
//   }
// };


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

export const updateUser = async (id, userData) => {
  const { fname, lname, email, mobile, phone } = userData;
  try {
    await pool.execute(
      'UPDATE tbl_users SET fname = ?, lname = ?, email = ?, mobile = ?, phone = ? WHERE id = ?',
      [fname, lname, email, mobile, phone, id]
    );
    return { id, ...userData };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Unable to update user.');
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
    return { result, ...userData };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Unable to update user.');
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
