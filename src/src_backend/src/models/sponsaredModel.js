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
        
        const offset = (page - 1) * limit;
        const propertyJoin = `LEFT JOIN tbl_property tp ON tps.property_id = tp.id`
        const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
        const searchQuery = `SELECT 
                    tp.*, tps.id as tps_id, tps.categories, tps.sequence_no, tps.published_date sp_publish_date, tps.status as sponsared_status, tps.created_at as added_date FROM tbl_property_sponsared tps
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
        return rows[0].count;
    }
    catch(error) {
        throw new Error('Unable to fetch entry', error);
    }
};

export const createSponsaredAdmin = async (data) => {

    let connection;
    const { 
        property_id, categories, is_dedicated,
        sponsared_title, sponsared_description, spotlight_slug,
        user_id, user_logo_url, user_short_description, 
        total_site_visits, total_bookings, direct_site_visits, total_revenue,
        background_img_url, theme_color,
        sequence_no, published_date,
        meta_title, meta_description,
        addedby } = data;
        
    try {

        connection = await pool.getConnection();
        const inserQuery = `INSERT INTO tbl_property_sponsared 
            (   
                property_id, categories, is_dedicated,
                sponsared_title, sponsared_description, spotlight_slug,
                user_id, user_logo_url, user_short_description, 
                background_img_url, theme_color
                total_site_visits, total_bookings, direct_site_visits, total_revenue,
                sequence_no, published_date, 
                meta_title, meta_description,
                added_by ) 
            VALUES 
            (?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?)`;

      const paramsData = [ 
        property_id, categories, is_dedicated, sponsared_title, sponsared_description, spotlight_slug,
        user_id, user_logo_url, user_short_description, 
        background_img_url, theme_color,
        total_site_visits, 
        total_bookings, direct_site_visits, total_revenue,
        sequence_no, published_date,
        meta_title, meta_description,
        addedby ];        
        
      const [result] = await connection.execute( inserQuery, paramsData );
      
      if(data.sponsared_gallery && (data.categories === 'HOME BANNER' || data.categories === 'PROPERTY DETAILS BANNER' || data.categories === 'PROPERTY LIST BANNER')) {

        const galleryParamsData = [ 
            result.insertId,
            data.sponsared_gallery?.title, 
            data.sponsared_gallery?.description,
            data.sponsared_gallery?.img_categories,
            data.sponsared_gallery?.img_url,
            data.sponsared_gallery?.file_type,
            data.sponsared_gallery?.file_size
        ];

        await connection.execute(
          `INSERT INTO tbl_sponsared_gallery 
            ( sp_id, img_title, img_description, img_categories,
            img_url, file_type, file_size ) 
            VALUES 
            (?, ?, ?, ?, ?, ?)`,
            galleryParamsData
        );
      }

      if (data.sponsared_gallery_list && data.sponsared_gallery_list.length > 0 && data.categories === 'BUILDER SPOTLIGHT') {
        const insertPromises = data.sponsared_gallery_list.map((element) => {
          const galleryParamsData2 = [
            result.insertId,
            element?.img_title || null,
            element?.img_description || null,
            categories || null,
            element?.img_url || null,
            element?.file_type || null,
            element?.file_size || null,
          ];
      
          return connection.execute(
            `INSERT INTO tbl_sponsared_gallery 
              (sp_id, img_title, img_description, img_categories,
              img_url, file_type, file_size) 
              VALUES (?, ?, ?, ?, ?, ?)`,
            galleryParamsData2
          );
        });
      
        await Promise.all(insertPromises);
      }

      await connection.commit()
      return { insertId : result.insertId, affectedRows: result.affectedRows, ...data };

    } catch (error) {
      await connection.rollback();
      console.error('Error creating data:', error);
      throw new Error('Unable to create data.', error);
    }
    finally{
        await connection.release();
    }
};

export const updateSponsaredAdmin = async (id, blogData) => {

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
        
        const query = `
            UPDATE tbl_property_sponsared 
            SET sequence_no = CASE id 
                ${data.map(({ id, sequence_no }) => `WHEN ${id} THEN ${sequence_no}`).join(" ")}
            END
            WHERE id IN (${data.map(({ id }) => id).join(",")})
        `;

        const [result] = await connection.execute(query);
        await connection.commit();
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

// Spotlight frontend endpoints
export const getSpotlightData = async (limit = 10, categories = "SPOTLIGHT") => {
    try {
        let current_date = new Date().toISOString().split('T')[0];
        let where = `WHERE tps.status = "1" AND DATE(tps.published_date) <= '${current_date}'`;
        
        if (categories) {
            where += ` AND tps.categories = '${categories}'`;
        }

        const queryLimit = `LIMIT ${limit}`;

        const gallery = `(SELECT tpg.property_img_url
                        FROM tbl_property_gallery tpg 
                        WHERE tpg.property_id = tp.id 
                        LIMIT 1) AS property_img_url`;

         const configDim = `(SELECT
                CASE
                WHEN (SELECT COUNT(DISTINCT tpuc.length) FROM tbl_property_unit_configuration tpuc WHERE tp.id = tpuc.property_id) = 1
                AND (SELECT COUNT(DISTINCT tpuc.width) FROM tbl_property_unit_configuration tpuc WHERE tp.id = tpuc.property_id) = 1
                AND (SELECT COUNT(DISTINCT tpuc.width_unit) FROM tbl_property_unit_configuration tpuc WHERE tp.id = tpuc.property_id) = 1
                THEN (SELECT CONCAT(MIN(tpuc.length), " x ", MIN(tpuc.width), " ", MIN(tpuc.width_unit))
                FROM tbl_property_unit_configuration tpuc WHERE tp.id = tpuc.property_id)
                ELSE (SELECT CONCAT(tpuc.length, " x ", tpuc.width, " ", tpuc.width_unit)
                FROM tbl_property_unit_configuration tpuc
                WHERE tp.id = tpuc.property_id
                ORDER BY tpuc.carpet_price ASC
                LIMIT 1)
                END) AS config_dimenssion`;

        const configCarpetPrice = `(SELECT tpuc.carpet_price
                                    FROM tbl_property_unit_configuration tpuc
                                    WHERE tp.id = tpuc.property_id 
                                    ORDER BY tpuc.carpet_price ASC
                                    LIMIT 1) AS config_carpet_price`;

        // Min-Max Carpet Area
        const carpetAreaRange = `(SELECT 
            CASE 
                WHEN MIN(tpuc.carpet_area) = MAX(tpuc.carpet_area) 
                THEN MIN(tpuc.carpet_area)
                ELSE CONCAT(MIN(tpuc.carpet_area), ' - ', MAX(tpuc.carpet_area)) 
            END
            FROM tbl_property_unit_configuration tpuc 
            WHERE tp.id = tpuc.property_id) AS carpet_area_range`;

        // Fetching only BHK types (1-5 BHK)
        const bhkTypes = `(SELECT 
                            CASE 
                                WHEN COUNT(DISTINCT CASE WHEN tpuc.unit_name REGEXP '^[1-5] BHK$' THEN tpuc.unit_name END) > 3 
                                THEN CONCAT(MIN(CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED)), '-', 
                                            MAX(CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED)), ' BHK')
                                ELSE CONCAT(GROUP_CONCAT(DISTINCT CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED) 
                                                        ORDER BY CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED) ASC SEPARATOR ','), ' BHK')
                            END 
                        FROM tbl_property_unit_configuration tpuc
                        WHERE tp.id = tpuc.property_id AND tpuc.unit_name REGEXP '^[1-5] BHK$') AS bhk_types`;

        // Fetching only Studio, 1RK, and Other types
        const otherUnitTypes = `(SELECT GROUP_CONCAT(DISTINCT tpuc.unit_name ORDER BY tpuc.unit_name ASC SEPARATOR ', ') 
                                 FROM tbl_property_unit_configuration tpuc
                                 WHERE tp.id = tpuc.property_id AND tpuc.unit_name IN ('Studio', '1 RK', 'Other')) AS other_unit_types`;

        const joinProperty = `LEFT JOIN tbl_property tp ON tp.id = tps.property_id`;
        const orderBy = `ORDER BY tps.sequence_no ASC`;

        const query = `SELECT tp.*, ${gallery}, ${configDim}, ${configCarpetPrice}, ${carpetAreaRange}, ${bhkTypes}, ${otherUnitTypes}, tps.id as tps_id 
                       FROM tbl_property_sponsared tps 
                       ${joinProperty} 
                       ${where} ${orderBy} 
                       ${queryLimit}`;

        const [rows] = await pool.execute(query);

        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Unable to fetch spotlight.');
    }
};

export const getSpotlightHeroBannerData = async (limit = 10, categories = "HOME BANNER") => {
    try {
        let current_date = new Date().toISOString().split('T')[0];
        let where = `WHERE tps.status = "1" AND DATE(tps.published_date) <= '${current_date}'`;
        
        if (categories) {
            where += ` AND tps.categories = '${categories}'`;
        }

        where += ` AND tsg.img_categories = 'BANNER' `;
        const queryLimit = `LIMIT ${limit}`;
        const orderBy = `ORDER BY tps.sequence_no ASC`;
        const joinProperty = `LEFT JOIN tbl_property tp ON tp.id = tps.property_id`;
        const joinGallery = `LEFT JOIN tbl_sponsared_gallery tsg ON tsg.sp_id = tps.id`;
        const query = `SELECT tps.id as sp_id, tp.id as p_id, tps.is_dedicated, tps.spotlight_slug, tps.theme_color_dark, tps.categories, tsg.img_url, tsg.file_type, tps.published_date, tp.property_title, tp.company_name, tp.per_sqft_amount, tp.landmark, tp.city_name, tp.title_slug
                       FROM tbl_property_sponsared tps 
                       ${joinProperty}
                       ${joinGallery}
                       ${where} ${orderBy} 
                       ${queryLimit}`;

        const [rows] = await pool.execute(query);

        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Unable to fetch spotlights.');
    }
};

export const getSpotlightStoryData = async (limit = 10) => {
    try {
        let current_date = new Date().toISOString().split('T')[0];
        let where = `WHERE tps.status = "1" AND DATE(tps.published_date) <= '${current_date}' AND categories = 'BUILDER SPOTLIGHT'`;
        

        const queryLimit = `LIMIT ${limit}`;
        const orderBy = `ORDER BY tps.sequence_no ASC`;
        const joinUsers = `LEFT JOIN tbl_users tu ON tu.id = tps.user_id`;
        const query = `SELECT tps.id, tps.is_dedicated, tps.spotlight_slug, tps.theme_color_dark, tps.categories, tps.published_date, tps.total_site_visits, tps.total_bookings, tps.direct_site_visits, tps.total_revenue, tps.background_img_url, tps.user_logo_url,
                        tu.fname, tu.mname, tu.lname, tu.company_name, tu.profile_picture_url
                       FROM tbl_property_sponsared tps 
                       ${joinUsers}
                       ${where} ${orderBy} 
                       ${queryLimit}`;

        const [rows] = await pool.execute(query);

        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Unable to fetch spotlights.');
    }
};

export const getPropertyCountByIds = async (ids) => {
    try {
        if(!ids.length) {
            return [];
        }
        const [rows] = await pool.execute(
            `SELECT tcp.*
                FROM  tbl_count_properties AS tcp
                WHERE tcp.property_id in (${ids.map(() => '?').join(',')})
            `,
            ids
        );
        return rows;
    } catch (error) {
        console.error('Error fetching property by ID:', error.message);
        throw new Error('Unable to fetch entry.');
    }
};


export const getPropertyDetailsById = async (id) => {
    try {
        let current_date = new Date().toISOString().split('T')[0];
        let where = `WHERE tps.status = "1" AND DATE(tps.published_date) <= '${current_date}' AND tps.categories = 'HOME BANNER'`;
        where += ` AND tp.id = ${id}`
        

        const configDim = `(SELECT
                CASE
                WHEN (SELECT COUNT(DISTINCT tpuc.length) FROM tbl_property_unit_configuration tpuc WHERE tp.id = tpuc.property_id) = 1
                AND (SELECT COUNT(DISTINCT tpuc.width) FROM tbl_property_unit_configuration tpuc WHERE tp.id = tpuc.property_id) = 1
                AND (SELECT COUNT(DISTINCT tpuc.width_unit) FROM tbl_property_unit_configuration tpuc WHERE tp.id = tpuc.property_id) = 1
                THEN (SELECT CONCAT(MIN(tpuc.length), " x ", MIN(tpuc.width), " ", MIN(tpuc.width_unit))
                FROM tbl_property_unit_configuration tpuc WHERE tp.id = tpuc.property_id)
                ELSE (SELECT CONCAT(tpuc.length, " x ", tpuc.width, " ", tpuc.width_unit)
                FROM tbl_property_unit_configuration tpuc
                WHERE tp.id = tpuc.property_id
                ORDER BY tpuc.carpet_price ASC
                LIMIT 1)
                END) AS config_dimenssion`;

        const configCarpetPrice = `(SELECT tpuc.carpet_price
                FROM tbl_property_unit_configuration tpuc
                WHERE tp.id = tpuc.property_id 
                ORDER BY tpuc.carpet_price ASC
                LIMIT 1) AS config_carpet_price`;

        // Min-Max Carpet Area
        const carpetAreaRange = `(SELECT 
                CASE 
                    WHEN MIN(tpuc.carpet_area) = MAX(tpuc.carpet_area) 
                    THEN MIN(tpuc.carpet_area)
                    ELSE CONCAT(MIN(tpuc.carpet_area), ' - ', MAX(tpuc.carpet_area)) 
                END
                FROM tbl_property_unit_configuration tpuc 
                WHERE tp.id = tpuc.property_id) AS carpet_area_range`;

        // Fetching only BHK types (1-5 BHK)
        const bhkTypes = `(SELECT 
                    CASE 
                        WHEN COUNT(DISTINCT CASE WHEN tpuc.unit_name REGEXP '^[1-5] BHK$' THEN tpuc.unit_name END) > 3 
                        THEN CONCAT(MIN(CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED)), '-', 
                                    MAX(CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED)), ' BHK')
                        ELSE CONCAT(GROUP_CONCAT(DISTINCT CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED) 
                                                ORDER BY CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED) ASC SEPARATOR ','), ' BHK')
                    END 
                FROM tbl_property_unit_configuration tpuc
                WHERE tp.id = tpuc.property_id AND tpuc.unit_name REGEXP '^[1-5] BHK$') AS bhk_types`;

        // Fetching only Studio, 1RK, and Other types
        const otherUnitTypes = `(SELECT GROUP_CONCAT(DISTINCT tpuc.unit_name ORDER BY tpuc.unit_name ASC SEPARATOR ', ') 
                         FROM tbl_property_unit_configuration tpuc
                         WHERE tp.id = tpuc.property_id AND tpuc.unit_name IN ('Studio', '1 RK', 'Other')) AS other_unit_types`;

        // const joinProperty = `LEFT JOIN tbl_property tp ON tp.id = tps.property_id`;
        const joinSponsared = `LEFT JOIN tbl_property_sponsared tps ON tp.id = tps.property_id`;

        const query = `SELECT tp.*, tps.id as tps_id,
                        tps.key_features, tps.background_img_url, tps.theme_color_dark, tps.theme_color_light, tps.theme_color_gradient, tps.sequence_no, tps.published_date,
                        ${configDim}, ${configCarpetPrice}, ${carpetAreaRange}, ${bhkTypes}, ${otherUnitTypes}
                       FROM tbl_property tp
                       ${joinSponsared} 
                       ${where}`;

        const [[rows]] = await pool.execute(query);

        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Unable to fetch spotlight property.');
    }
};


export const getPropertyContructionPhaseById = async (propertyId) => {
    try {
        const [rows] = await pool.execute(
            `SELECT tpc.*
            FROM tbl_property_construction tpc
            WHERE tpc.property_id = ?`,
            [propertyId]
        );
        
        // Transform the data into the required structure
        return rows;
        
        } catch (error) {
            console.error('Error fetching data:', error);
            throw new Error('Error fetching data', error);
        }
};


export const getSponsaredImagesById = async (id) => {
    try {
        console.log(id, "tps iddd")
        const [rows] = await pool.execute(
            `SELECT tsg.*
                FROM tbl_sponsared_gallery tsg
                WHERE tsg.sp_id = ?
                ORDER BY img_categories
             `, 
            [id]
        );
        console.log(rows, "row ssss sss ss s")
        return rows;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to fetch entry.', error);
    }
};


// user Story Details
export const getBuilderDetailsById = async (id) => {
    try {
        let current_date = new Date().toISOString().split('T')[0];
        let where = `WHERE tps.status = "1" AND DATE(tps.published_date) <= '${current_date}' AND tps.categories = 'BUILDER SPOTLIGHT'`;
        where += ` AND tu.id = ${id}`
        
        const joinSponsared = `LEFT JOIN tbl_property_sponsared tps ON tu.id = tps.user_id`;

        const query = `SELECT tu.*, tps.id as tps_id,
                        tps.is_dedicated, tps.sponsared_title, tps.sponsared_description, tps.spotlight_slug, tps.user_logo_url, tps.user_short_description, 
                        tps.total_site_visits, tps.total_bookings, tps.total_bookings, tps.direct_site_visits, tps.total_revenue, tps.background_img_url, 
                        tps.categories,
                        tps.background_img_url, tps.theme_color_dark, tps.theme_color_light, tps.theme_color_gradient, tps.sequence_no, tps.published_date
                       FROM tbl_users tu
                       ${joinSponsared} 
                       ${where}`;

        console.log('Generated Query:', query);

        const [[rows]] = await pool.execute(query);

        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Unable to fetch story.');
    }
};