
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
export const getAllMarketingListAdmin = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
    try {
        const offset = (page - 1) * limit;
        const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
        const searchQuery = `SELECT * FROM  tbl_property_marketing tpm
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

export const getAllMarketingCountAdmin = async ( whereClause = null ) => {
    try {

        const totalCountQuery = `SELECT 
                    COUNT(*) AS count
                FROM 
                    tbl_property_marketing tpm
                ${whereClause}`;
        
        const [rows] = await pool.query(totalCountQuery);
        console.log(rows);
        return rows[0].count;
    }
    catch(error) {
        throw new Error('Unable to fetch entry', error);
    }
};

export const getMarketingByIdAdmin = async (id) => {

    try {
        const propertyJoin = `LEFT JOIN tbl_property tp ON tp.id = tpm.property_id`
        const searchQuery = `SELECT tpm.*, tp.property_title, tp.city_name
            FROM tbl_property_marketing tpm
            ${propertyJoin}
            where tpm.id = ?`
        const [rows] = await pool.execute(searchQuery, [id]);
        return rows;

    } catch (error) {
        console.error('Error fetching marketing:', error);
        throw new Error('Unable to fetch marketing.');
    }
};

export const getMarketingLogByIdAdmin = async (id) => {

    try {

        const searchQuery = `SELECT tmd.*
            FROM tbl_marketing_details tmd
            where tmd.pm_id = ?`
        const [rows] = await pool.execute(searchQuery, [id]);

        console.log(rows)
        return rows;

    } catch (error) {
        console.error('Error fetching marketing log:', error);
        throw new Error('Unable to fetch marketing log.');
    }
};


export const deleteMarketingByIdAdmin = async (id) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const query = `DELETE FROM tbl_property_marketing 
            where id = ?`
        await connection.execute(query, [id]);

        const query2 = `DELETE FROM tbl_marketing_details 
            where pm_id = ?`
        const [rows2] = await connection.execute(query2, [id]);

        await connection.commit()
        return rows2;

    } catch (error) {
        console.error('Error fetching marketing log:', error);
        await connection.rollback()
        throw new Error('Unable to fetch marketing log.');
    }
};

export const deleteMarketingDetailsRowByIdAdmin = async (id) => {
    try {
        const query2 = `DELETE FROM tbl_marketing_details 
            where id = ?`
        const [rows2] = await pool.execute(query2, [id]);

        return rows2;
    } catch (error) {
        console.error('Error deleting marketing log:', error);
        throw new Error('Unable to deleting marketing log.');
    }
};

export const createMarketingAdmin = async (data) => {
    const connection = await pool.getConnection();
    try {
        const {
            full_name,
            mobile,
            email,
            status,
            status_text,
            property_id,
            banner_image,
            promotion_name,
            marketing_type,
            promotion_type,
            publish_date,
            userId,
        } = data
        
        await connection.beginTransaction();
        const marketingMasterData = [
            property_id, banner_image, promotion_name, marketing_type, promotion_type, publish_date, userId, 
        ]
        const query = `INSERT INTO tbl_property_marketing (
            property_id,
            banner_image,
            promotion_name,
            marketing_type,
            promotion_type,
            publish_date,
            added_by
        ) VALUES (?, ?, ?, ?, ? ,?, ?)`
        const [result] = await connection.execute(query, marketingMasterData);
        console.log(result);
        const marketingDetailData = [ result.insertId, full_name, mobile, email, banner_image, status, status_text ]
        console.log(marketingDetailData, "details:::")
        const query2 = `INSERT INTO tbl_marketing_details 
            ( pm_id, full_name, mobile, email, banner_image, status, status_text ) 
            VALUES 
            ( ?, ?, ?, ?, ?, ?, ? )
         `
        const [rows] = await connection.execute(query2, marketingDetailData);
        await connection.commit()
        return {insertId: result.insertId, ...data};
    } catch (error) {
        console.error('Error create marketing log:', error);
        await connection.rollback()
        throw new Error('Unable to create marketing log.');
    }
};
