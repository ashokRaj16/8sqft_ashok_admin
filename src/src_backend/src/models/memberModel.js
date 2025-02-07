import pool from '../config/db.js';

export const getAllMemberListAdmin = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
  try {
    const offset = (page - 1) * limit;
    const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
    const searchQuery = `SELECT * FROM  tbl_users tu
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

export const getAllMemberCountAdmin = async ( whereClause = null ) => {
  try {

      const totalCountQuery = `SELECT 
                  COUNT(*) AS count
              FROM 
                   tbl_users tu 
              ${whereClause}`;
    
      const [rows] = await pool.query(totalCountQuery);
      console.log(rows);
      return rows[0].count;
  }
  catch(error) {
      throw new Error('Unable to fetch entry', error);
  }
};

export const getMemberUsersById = async (id) => {
  
  try {
    const [rows] = await pool.execute('SELECT * FROM tbl_users where id = ?', [id]);
    console.log(rows)
    return rows;

  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Unable to fetch user.');
  }
};

export const createMemberUser = async (data) => {
  console.log("data: ", data)
  const { fname, mname, lname, email, mobile, phone } = data;
  try {
    const [result] = await pool.execute(
      `INSERT INTO tbl_users 
        (fname, mname, lname, email, mobile, contact_2) 
        VALUES 
        (?, ?, ?,  ?, ?, ?)`,
      [fname, mname, lname, email, mobile, phone]
    );
    console.log(result)
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
