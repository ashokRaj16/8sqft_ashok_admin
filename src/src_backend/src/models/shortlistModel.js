import pool from '../config/db.js';

export const getAllShortlistPropertyList = async (whereClause = null, page = 1, limit = 10, sortColumn = 'id',  sortOrder = 'asc' ) => {
    try {
        const offset = (page - 1) * limit;

        const limitQuery = ` LIMIT ${limit} OFFSET ${offset}`;
        const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;

        const propertyJoin = `JOIN tbl_property tp ON 
        JSON_CONTAINS(tpi.property_id, JSON_OBJECT('pid', tp.id))`

        const searchQuery = `SELECT tp.id,
            tp.property_title,
            tp.description,
            tp.locality,
            tp.property_type,
            tpi.user_id,
            tpi.property_id
        FROM tbl_property_shortlist tpi 
        ${propertyJoin}
        ${whereClause} ${orderQuery} ${limitQuery} `;

        const [rows] = await pool.execute(searchQuery);
        return rows;
    }
    catch(error) {
        console.log(error);
        throw new Error('Unable to fetch entry.', error);
    }
};


export const getAllShortlistPropertyCount = async ( whereClause = null, ) => {
    try {
        const propertyJoin = `JOIN tbl_property tp ON 
        JSON_CONTAINS(tpi.property_id, JSON_OBJECT('pid', tp.id))`

        const totalCountQuery = `SELECT COUNT(*) AS count 
        FROM tbl_property_shortlist tpi 
        ${propertyJoin} ${whereClause}`;
        const [rows] = await pool.query(totalCountQuery);
        return rows[0].count;
    }
    catch(error) {
        throw new Error('Unable to fetch entry', error);
    }
};