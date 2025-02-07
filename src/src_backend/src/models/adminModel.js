import pool from '../config/db.js';

// export const getAllMemberListAdmin = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
//   try {
//     console.log('where: ',whereClause);
//     const offset = (page - 1) * limit;
//     const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
//     const searchQuery = `SELECT * FROM  tbl_users_admin tu
//                 ${whereClause} ${orderQuery}
//                 LIMIT ${limit} OFFSET ${offset}`;

//     const [rows] = await pool.execute(searchQuery);
//     return rows;
//   } catch (error) {
//     console.error('Error fetching all users:', error);
//     throw new Error('Unable to fetch users.');
//   }
// };


// export const getAllMemberCountAdmin = async ( whereClause = null ) => {
//   try {

//       const totalCountQuery = `SELECT 
//                   COUNT(*) AS count
//               FROM 
//                    tbl_users_admin tu 
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


export const findByEmail = async (email) => {
  try {
      const [rows] = await pool.execute(
          `SELECT tua.*, tur.role_name 
           FROM tbl_users_admin tua
           JOIN tbl_user_roles tur ON tua.role_id = tur.id
           WHERE tua.email = ?`, 
          [email]
      );
      console.log(rows);
      return rows[0];
  } catch (error) {
      throw new Error('Unable to fetch entry.', error);
  }
};

export const findById = async (id) => {
  try {
    const roleJoin = ` LEFT JOIN tbl_user_roles tur 
    ON tur.id = tua.role_id `
    const selectField = `tua.id, tua.fname, tua.mname, tua.lname, tua.email, tua.mobile, tua.phone, 
    tua.state_id,
    tua.state_name,
    tua.city_id,
    tua.city_name,
    tua.pincode,
    tua.address,
    tua.pan,
    tua.img_url,
    tua.role_id, 
    tur.role_name`
    const searchQuery = 
    `SELECT ${selectField}
    FROM tbl_users_admin tua
    ${roleJoin}
     WHERE tua.id = ?`

    const [rows] = await pool.execute( searchQuery, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw new Error('Unable to find user by ID.');
  }
};

export const update = async (id, data) => {
    console.log("model:", data)
  try {
        
    let queryField = [];
    let queryParams = [];

    for (const [key, value] of Object.entries(data)) {
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
    return { result, ...data };

    // await pool.execute(
    //   `UPDATE tbl_users_admin 
    //   SET fname = ?, mname = ?, lname = ?, mobile = ?, phone = ?,
    //   email = ?,
    //    address = ?, pan = ?, pincode = ?, 
    //    city_id = ?, city_name = ?, state_id = ?, state_name = ?
    //   WHERE id = ?`,
    //   [ fname, 
    //     mname, 
    //     lname, 
    //     mobile, 
    //     phone, 
    //     email,
    //     address, 
    //     pan, 
    //     pincode, 
    //     city_id, 
    //     city_name, 
    //     state_id, 
    //     state_name, id]
    // );
    // return { id, ...data };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Unable to update user.');
  }
};

export const updatePassword = async (id, password) => {
  try {
    const result = await pool.execute('UPDATE tbl_users_admin SET password_hash = ? WHERE id = ?', [password, id]);
    console.log(result)
    return result;
  } catch (error) {
    console.error('Error updating password:', error);
    throw new Error('Unable to update password.');
  }
};

export const getUserCount = async () => {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) AS total FROM tbl_users');
    return rows[0].total;
  } catch (error) {
    console.error('Error fetching user count:', error);
    throw new Error('Unable to fetch user count.');
  }
};

export const getRoleMaster = async (id) => {
  try {
    // ###check if user role is != super_admin then give other user role else give all. 
    const searchQuery = `SELECT * FROM tbl_user_roles where id <> ?`
    const [rows] = await pool.execute(searchQuery, [1]);
    
    return rows; 
  } catch (error) {
    console.error('Error fetching roles from models:', error);
    throw new Error('Unable to fetch roles.');
  }
};
  
