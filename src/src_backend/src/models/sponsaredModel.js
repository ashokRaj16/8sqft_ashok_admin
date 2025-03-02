
import pool from '../config/db.js';

/**
 * Blogs
 * @param {*} whereClause 
 * @param {*} sortColumn 
 * @param {*} sortOrder 
 * @param {*} page 
 * @param {*} limit 
 * @returns 
 */
export const getAllSponsaredListAdmin = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
    try {
        console.log(whereClause, "where cls")
        const offset = (page - 1) * limit;
        const propertyJoin = `LEFT JOIN tbl_property tp ON tps.property_id = tp.id`
        const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
        const searchQuery = `SELECT 
                    tp.*, tps.id as tps_id, tps.categories, tps.sequence_no, tps.published_date sp_publish_date, tps.status as sponsared_status, tps.created_at as added_date FROM tbl_property_sponsared tps
                    ${propertyJoin}
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

export const getAllSponsaredCountAdmin = async ( whereClause = null ) => {
    try {

        const propertyJoin = `LEFT JOIN tbl_property tp ON tps.property_id = tp.id`
        const totalCountQuery = `SELECT 
                    COUNT(*) AS count
                FROM 
                    tbl_property_sponsared tps
                ${propertyJoin}
                ${whereClause} `;
        
        const [rows] = await pool.query(totalCountQuery);
        console.log(rows);
        return rows[0].count;
    }
    catch(error) {
        throw new Error('Unable to fetch entry', error);
    }
};


export const createSponsaredAdmin = async (data) => {

    const { property_id, categories,  banner_id, sequence_no, published_date, userid } = data;

    try {
      const inserQuery = `INSERT INTO tbl_property_sponsared 
        (property_id, categories, banner_id, sequence_no, published_date, added_by) 
        VALUES 
        (?, ?, ?, ?, ?, ?)`;
      const paramsData = [property_id, categories, banner_id, sequence_no, published_date, userid ];

      const [result] = await pool.execute( inserQuery, paramsData );
  
      console.log(result)
      return { insertId : result.insertId, affectedRows: result.affectedRows, ...data };

    } catch (error) {
      console.error('Error creating data:', error);
      throw new Error('Unable to create data.', error);
    }
};

export const updateSponsaredAdmin = async (id, blogData) => {

try {
    console.log("models", blogData);
    
    let queryField = [];
    let queryParams = [];

    for (const [key, value] of Object.entries(blogData)) {
        if (value !== undefined && value !== null) {
            queryField.push(`${key} = ?`);
            queryParams.push(value);
        } 
    }
    queryParams.push(id);

    const query = `
            UPDATE tbl_property_sponsared 
            SET 
            ${queryField.join(', ') }
            WHERE id = ?`;

    const [result] = await pool.execute(query, queryParams);
    return { affectedRows: result.affectedRows, ...blogData };
} catch (error) {
    console.error('Error updating data:', error);
    throw new Error('Unable to update data.');
}
};

export const updateMultipleSponsaredAdmin = async (data) => {

    let connection = await pool.getConnection();
    try {
        console.log("models", data);
        
        // let queryField = [];
        // let queryParams = [];
    
        // for (const [key, value] of Object.entries(data)) {
        //     if (value !== undefined && value !== null) {
        //         queryField.push(`${key} = ?`);
        //         queryParams.push(value);
        //     } 
        // }
        // queryParams.push(id);
    
        // const query = `
        //         UPDATE tbl_property_sponsared 
        //         SET 
        //         ${queryField.join(', ') }
        //         WHERE id = ?`;
        
        const query = `
            UPDATE tbl_property_sponsared 
            SET sequence_no = CASE id 
                ${data.map(({ id, sequence_no }) => `WHEN ${id} THEN ${sequence_no}`).join(" ")}
            END
            WHERE id IN (${data.map(({ id }) => id).join(",")})
        `;

        const [result] = await connection.execute(query);
        await connection.commit();
        console.log(result)
        return { affectedRows: result.affectedRows, data };
    } catch (error) {
        connection.rollback()
        console.error('Error updating data:', error);
        throw new Error('Unable to update data.');
    }
    };

export const deleteSponsaredAdmin = async (id) => {
    try {
        const deleteQuery =`DELETE FROM tbl_property_sponsared where id = ?`
        console.log(deleteQuery, id)
        const result = await pool.execute(deleteQuery, [id]);
        return result;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw new Error('Unable to delete data.');
    }
};

export const getLastSponsaredSequenceAdmin = async (categories = null ) => {
    try {
        let whereClauses = [], baseQuery = '';
        if (categories) {
            whereClauses.push(`tps.categories = '${categories}'`)
        }
        if (whereClauses.length > 0) {
            baseQuery = ` WHERE ` + whereClauses.join(' AND ');
        }
        const searchQuery = `SELECT max(tps.sequence_no) as last_sequence_no
                    FROM tbl_property_sponsared tps 
                    ${baseQuery}`;

        const [rows] = await pool.execute(searchQuery);
        return rows;
    } catch (error) {
        console.error('Error fetching all data:', error);
        throw new Error('Unable to fetch data.');
    }
};