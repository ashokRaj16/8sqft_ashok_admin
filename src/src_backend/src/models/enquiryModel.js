
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
export const getAllEnquiryListAdmin = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
    try {
        const offset = (page - 1) * limit;
        const propertyJoin = `LEFT JOIN tbl_property tp ON tcd.property_id = tp.id`
        const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
        const searchQuery = `SELECT 
                    tp.property_title, tcd.*
                    FROM tbl_contact_developer tcd
                    ${propertyJoin}
                    ${whereClause} ${orderQuery}
                    LIMIT ${limit} OFFSET ${offset}`;

        const [rows] = await pool.execute(searchQuery);
        return rows;
    } catch (error) {
        console.error('Error fetching all data:', error);
        throw new Error('Unable to fetch data.');
    }
};

export const getAllEnquiryCountAdmin = async ( whereClause = null ) => {
    try {

        const propertyJoin = `LEFT JOIN tbl_property tp ON tcd.property_id = tp.id`
        const totalCountQuery = `SELECT 
                    COUNT(*) AS count
                FROM 
                    tbl_contact_developer tcd
                ${propertyJoin}
                ${whereClause} `;
        
        const [rows] = await pool.query(totalCountQuery);
     
        return rows[0].count;
    }
    catch(error) {
        throw new Error('Unable to fetch entry', error);
    }
};

export const updateEnquiryAdmin = async (id, blogData) => {

try {
    
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
            UPDATE tbl_contact_developer 
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

export const deleteEnquiryAdmin = async (id) => {
    try {
        const deleteQuery =`
            UPDATE tbl_contact_developer SET is_deleted = '1' where id = ?
            `
        const result = await pool.execute(deleteQuery, [id]);
        return result;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw new Error('Unable to delete data.');
    }
};
