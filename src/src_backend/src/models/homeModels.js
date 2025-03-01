import pool from '../config/db.js';

// ### get city also then append it to data.
export const getSearchDropDownLocationByKey = async (searchKey = null, cityName = null, searchLimit = 10) => {
    try {
        let where = 'WHERE ';
        if (searchKey) {
            where += ` tpc.postal_name LIKE '${searchKey}%' AND tpc.status = '1'`;
        } else {
            where += ` tpc.status = '1'`;
        }
        if (cityName) {
            where += ` AND tc.city_name = '${cityName}'`
        }

        const limit = ` LIMIT ${searchLimit}`
        const join = ` left join tbl_city tc ON tc.id = tpc.city_id `;
        const query = `SELECT tpc.id, tc.city_name, tpc.postal_name, tpc.pincode FROM tbl_postal_code tpc ${join} ${where} ${limit}`;
        const [rows] = await pool.execute(query);
        return rows;
    } catch (error) {
        console.log(error)
        throw new Error('Unable to search data.', error);
    }
};

export const getRecommendationData = async (amount = null, area = null, city = null, propertyType = null, property_rent_buy = null, limit = 10) => {
    try {

        let where = 'WHERE tp.status = 2';
        if (amount) {
            where += ` AND tp.rent_amount <= ${amount}`;
        }
        if (area) {
            where += ` AND tp.land_area LIKE '%${area}%'`;
        }
        if (city) {
            where += ` AND tc.city_name = '${city}'`;
        }
        if (propertyType) {
            where += ` AND tp.property_type = '${propertyType}'`;
        }

        if (property_rent_buy) {
            where += ` AND tp.property_rent_buy = '${property_rent_buy}'`;
        }

        const queryLimit = `LIMIT ${limit}`;
        const gallery = `(SELECT tpg.property_img_url
      FROM tbl_property_gallery tpg 
      WHERE tpg.property_id = tp.id 
      LIMIT 1) AS property_img_url `;

        const joinCity = `LEFT JOIN tbl_city tc ON tc.id = tp.city_id`;
        const orderBy = `ORDER BY tp.id DESC`;

        // const joinGallery = `RIGHT JOIN tbl_property_gallery tpg ON tpg.property_id = tp.id`;
        const query = `SELECT tp.*, ${gallery} 
                     FROM tbl_property tp 
                     ${joinCity} 
                     ${where} ${orderBy}
                     ${queryLimit}`;

        //  ${joinGallery} 
        console.log('Generated Query:', query);

        const [rows] = await pool.execute(query);

        // console.log("length:", rows, rows.length,)
        // Group images under each property
        // const propertyMap = {};
        // rows.forEach(row => {
        //     const propertyId = row.id; // Use the primary key of the property
        //     if (!propertyMap[propertyId]) {
        //         // Initialize property with its first row of data
        //         propertyMap[propertyId] = {
        //             ...row,
        //             images: [] // Initialize images array
        //         };
        //     }
        //     // Add image URL to the images array if it exists
        //     if (row.property_img_url) {
        //         propertyMap[propertyId].images.push(row.property_img_url);
        //     }
        // });

        // Convert the map back to an array
        // const result = Object.values(propertyMap);

        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Unable to fetch recommendations.');
    }
};

export const getSpotlightData = async (limit = 10, categories = null) => {
    try {
        let current_date = new Date().toISOString().split('T')[0]; // '2025-02-11'
        let where = `WHERE tps.status = "1" AND DATE(tps.published_date) <= '${current_date}'`;
        
        if (categories) {
            where += ` AND categories = '${categories}'`;
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

        console.log('Generated Query:', query);

        const [rows] = await pool.execute(query);

        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Unable to fetch recommendations.');
    }
};

