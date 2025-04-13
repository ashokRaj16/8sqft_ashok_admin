import pool from '../config/db.js';

export const findByEmail = async (email) => {
  try {
      const [rows] = await pool.execute(
          `SELECT tua.*, tur.role_name 
           FROM tbl_users_admin tua
           JOIN tbl_user_roles tur ON tua.role_id = tur.id
           WHERE tua.email = ?`, 
          [email]
      );

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

  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Unable to update user.');
  }
};

export const updatePassword = async (id, password) => {
  try {
    const result = await pool.execute('UPDATE tbl_users_admin SET password_hash = ? WHERE id = ?', [password, id]);
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

export const getPropertyCount = async () => {
  try {
    const [rows] = await pool.execute(`SELECT COUNT(*) AS total FROM tbl_property WHERE is_deleted = '0'`);
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

export const getUserCountByMonth = async () => {
  try {
    const [results] = await pool.execute(`
      SELECT 
          YEAR(created_at) AS year,
          MONTH(created_at) AS month,
          COUNT(*) AS count
      FROM tbl_users
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY YEAR(created_at), MONTH(created_at)
      ORDER BY YEAR(created_at), MONTH(created_at);
  `);


  // return formattedResult;
   // Get the current date
   const now = new Date();
   const allMonths = [];
 
   // Generate last 12 months
   for (let i = 6; i >= 0; i--) {
       const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
       const year = date.getFullYear();
       const month = date.getMonth() + 1; // 0-based, so add 1
       const monthName = date.toLocaleString('en-US', { month: 'long' });
       const key = `${monthName} ${year}`;
 
       // Find the matching result or set to 0
       const match = results.find(item => item.year === year && item.month === month);
       allMonths.push({ [key]: match ? match.count : 0 });
   }
 
   // Convert array to object for the final output
   const formattedResult = Object.assign({}, ...allMonths);
  
   return formattedResult;
  } catch (error) {
    console.error('Error fetching user count:', error);
    throw new Error('Unable to fetch user count.');
  }

};

export const getPropertyCountByMonth = async () => {
  try {
    const [results] = await pool.execute(`
      SELECT 
          YEAR(created_at) AS year,
          MONTH(created_at) AS month,
          COUNT(*) AS count
      FROM tbl_property
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY YEAR(created_at), MONTH(created_at)
      ORDER BY YEAR(created_at), MONTH(created_at);
  `);

  // Get the current date
  const now = new Date();
  const allMonths = [];

  // Generate last 12 months
  for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 0-based, so add 1
      const monthName = date.toLocaleString('en-US', { month: 'long' });
      const key = `${monthName} ${year}`;

      // Find the matching result or set to 0
      const match = results.find(item => item.year === year && item.month === month);
      allMonths.push({ [key]: match ? match.count : 0 });
  }

  // Convert array to object for the final output
  const formattedResult = Object.assign({}, ...allMonths);

  return formattedResult;
  } catch (error) {
    console.error('Error fetching user count:', error);
    throw new Error('Unable to fetch user count.');
  }

};

  
