import pool from '../config/db.js';

export const getAllGalleryImagesAdmin = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
  try {
    const offset = (page - 1) * limit;
    const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
    const searchQuery = `SELECT * FROM  tbl_property_gallery tpg
                ${whereClause} ${orderQuery}
                LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await pool.execute(searchQuery);
    return rows;
  } catch (error) {
    console.error('Error fetching all data:', error);
    throw new Error('Unable to fetch data.');
  }
};

export const getAllGalleryImageCountAdmin = async ( whereClause = null ) => {
  try {

      const totalCountQuery = `SELECT 
                  COUNT(*) AS count
              FROM 
                   tbl_property_gallery tpg
              ${whereClause}`;
    
      const [rows] = await pool.query(totalCountQuery);
  
      return rows[0].count;
  }
  catch(error) {
      throw new Error('Unable to fetch entry', error);
  }
};

export const getGalleryImageDetailsById = async (id) => {
  
  try {
    const [rows] = await pool.execute('SELECT * FROM tbl_property_gallery where id = ?', [id]);

    return rows;

  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Unable to fetch data.');
  }
};

// Insert into tbl_proeprty_gallery Images
export const addGalleryImages = async (data) => {
  
  const { property_id, property_img_url, img_title, 
    image_category, file_type, image_size, img_description} = data;
  try {
    const queryParams = [
        property_id || null, 
        property_img_url || null, img_title || null,  
        image_category || null, 
        file_type || null, 
        image_size || null, 
        img_description || null]
    const [result] = await pool.execute(
      `INSERT INTO tbl_property_gallery 
        (property_id, property_img_url, img_title, 
        image_category, file_type, image_size, img_description ) 
        VALUES 
        (?, ?, ?,  ?, ?, ?, ?)`,
      queryParams
    );

    return { id: result.insertId, result };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Unable to create user.', error);
  }
};

export const updateGalleryImages = async (id, userData) => {
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
            UPDATE tbl_property_gallery 
            SET 
            ${queryField.join(', ') }
            WHERE id = ?`;

    const [result] = await pool.execute(query, queryParams);
    return { result, ...userData };
  } catch (error) {
    console.error('Error updating data:', error);
    throw new Error('Unable to update data.');
  }
};

export const deleteGalleryImagesAdmin = async (id) => {
  try {
    const [result] = await pool.execute(
      'UPDATE tbl_property_gallery SET is_deleted = ? WHERE id = ?',
      ["1", id]
    );
    return result;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Unable to delete user.');
  }
};
