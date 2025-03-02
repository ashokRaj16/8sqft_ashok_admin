// import pool from '../config/pool.js';
import pool from '../config/db.js';

export const createAmenties = async (data) => {
    try {
        const { amenity_name, icon_url, status = 1, description = '' } = data;
        const [result] = await pool.execute(
            'INSERT INTO tbl_master_amenties (amenity_name, icon_url, status, description) VALUES (?, ?, ?, ?)',
            [amenity_name, icon_url, status, description]
        );
        return { id: result.insertId, data };
    }
    catch(error) {
        // console.log(error)
        throw new Error('Unable to create entry', error);
    } 
};

export const getAllAmenties = async () => {
    const [rows] = await pool.execute('SELECT * FROM tbl_master_amenties');
    return rows;
};

// export const updateAmenties = async (id, userData) => {
//     const { fname, lname, email, mobile, phone } = userData;
//     await pool.execute(
//         'UPDATE tbl_users SET fname = ?, lname = ?, email = ?, mobile = ?, phone = ? WHERE id = ?',
//         [fname, lname, email, mobile, phone, id]
//     );
//     return { id, ...userData };
// };

// export const deleteUser = async (id) => {
//     await pool.execute('DELETE FROM tbl_users WHERE id = ?', [id]);
// };

// instead of delete upadte it chagne status to 0.
export const deleteAmenties = async (id) => {
    try{
        // await pool.execute('DELETE FROM tbl_master_amenties WHERE id = ?', [id]);
        await pool.execute('UPDATE TABLE tbl_master_amenties SET status = 0 WHERE id = ?', [id]);
    }
    catch(error) {
        console.log(error)
        throw new Error('Unable to delete entry', error);
    } 
};

export const createFeatures = async (data) => {
    try {
        const { feature_name, icon_url, feature_categories, status = 1, description = '' } = data;
        const [result] = await pool.execute(
            'INSERT INTO tbl_master_features (feature_name, icon_url, feature_categories, status, description) VALUES (?, ?, ?, ?, ?)',
            [feature_name, icon_url, feature_categories, status, description]
        );
        return { id: result.insertId, data };
    }
    catch(error) {
        // console.log(error)
        throw new Error('Unable to create entry', error.message);
    } 
};

export const getAllFeatures = async () => {
    try{
    const [rows] = await pool.execute('SELECT * FROM tbl_master_features');
    return rows;
}
catch(error) {
    // console.log(error)
    throw new Error('Unable to fetch entry', error.message);
} 
};

/**
 * Property post: Step 1
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const createProperty = async (data) => {
        
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
                
        const propertyData = [
            data.user_id,
            data.step_id,
            data.property_type,
            data.company_name,
            data.property_rent_buy,
            data.user_type,
            data.ip_address,
            data.user_agent,
            data.host_name
        ]
            console.log("data::::",data);

        const [resultProperty] = await connection.query(
            `INSERT INTO tbl_property 
                ( user_id, form_step_id, property_type, 
                  company_name, property_rent_buy, user_type,
                  ip_address, user_agent, host_name ) 
             VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? )`,
            propertyData
        );

        console.log(resultProperty);

        await connection.commit();
        return { id: resultProperty.insertId, data };
    }
    catch(error) {
        console.log(error)
        await connection.rollback();
        throw new Error('Unable to create entry', error);
    } 
};

/**
 * Property post: Step 2
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const updateProperty = async (id, data) => {
    try{
        const propertyData = [
            data.step_id,
            data.landmark,
            data.locality,
            data.city_id,
            data.city_name,
            data.state_id,
            data.state_name,
            data.full_address,
            data.latitude,
            data.longitude,
            data.pincode,
            data.property_title,
            data.building_name,
            data.property_variety,
            data.property_variety_type,
            data.door_facing,
            data.land_area,
            data.land_area_unit,
            data.builtup_area,
            data.builtup_area_unit,
            data.rent_amount,
            data.rent_is_nogotiable,
            data.deposite_amount,
            data.deposite_is_negotiable,
            data.expected_amount,
            data.exected_amount_sqft,
            data.monthly_maintenance,
            data.ownership_type,
            data.dimension_length,
            data.dimension_width,
            data.width_facing_road,
            data.bed_rooms,
            data.washrooms,
            data.balcony,
            data.unit_number,
            data.floor_number,
            data.total_floors,
            data.property_floors,
            data.is_wings,
            data.total_wing,
            data.wing_name,
            data.property_availibility_type,
            data.preferred_tenent,
            data.property_age,
            data.is_maintenance,
            data.availability_date,
            data.availability_duration,
            id
        ]
        // console.log("Data: ",id ,propertyData);
        

        const result = await pool.execute(
            `UPDATE tbl_property 
            SET 
                form_step_id = ?, landmark = ?, locality = ?, city_id =?, city_name = ?,
                state_id = ?, state_name =? , full_address = ?, latitude = ?, longitude = ?, pincode = ?,
                property_title = ? , building_name = ?, 
                property_variety = ?, property_variety_type =?, door_facing = ?, land_area = ?, 
                land_area_unit = ?, builtup_area =?, builtup_area_unit = ?, rent_amount =?, 
                rent_is_nogotiable = ?, deposite_amount = ?, deposite_is_negotiable = ?, 
                expected_amount = ?,
                exected_amount_sqft =? ,
                monthly_maintenance = ?,
                ownership_type = ?,
                dimension_length = ?,
                dimension_width = ? ,
                width_facing_road = ?, bed_rooms = ?, washrooms= ?, balcony = ?, unit_number = ?, floor_number = ?, 
                total_floors = ?, property_floors = ?, is_wings = ?, total_wing =?, 
                wing_name = ?, property_availibility_type = ?, preferred_tenent = ?, 
                property_age = ?, is_maintenance =?, availability_date = ?,
                availability_duration = ?
            WHERE id = ?`,
           propertyData
        );
        // return { id, ...data };
        return { affectedRows : result[0].affectedRows, propertyDetails: data };
    }
    catch(error) {
        console.log(error);
        throw new Error('Unable to update entry.', error);
    }
};

/**
 * Property post: Step 2 Builder
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const updatePropertyBuilder = async (id, data) => {

    try{
        const propertyData = [
            data.step_id,
            data.landmark,
            data.locality,
            data.city_id,
            data.city_name,
            data.state_id,
            data.state_name,
            data.full_address,
            data.contact_no,
            data.latitude,
            data.longitude,
            data.pincode,
            data.property_title,
            data.building_name,
            data.property_type,
            data.property_variety,
            data.property_current_status,
            data.possession_date,
            data.is_rera_number,
            data.rera_number,
            data.total_towers,
            data.total_units,
            data.total_floors,
            data.builtup_area,
            data.builtup_area_unit,
            data.width_facing_road,
            data.project_area,
            data.project_area_unit,
            data.per_sqft_amount,
            data.property_age,            
            id
        ]
        console.log("length: ", data.length, propertyData.length)
        const result = await pool.execute(
            `UPDATE tbl_property 
            SET 
                form_step_id = ?, landmark = ?, locality = ?, city_id =?, city_name = ?,
                state_id = ?, state_name =?, full_address = ?, 
                contact_no = ?, latitude = ?, longitude = ?, pincode = ?,
                property_title = ? , building_name = ?, 
                property_type =?, 
                property_variety = ?, 
                property_current_status = ?, possession_date = ?, 
                is_rera_number = ?, rera_number =?, total_towers = ?, 
                total_units =?, 
                total_floors = ?, builtup_area = ?, builtup_area_unit = ?, 
                width_facing_road = ?,
                project_area = ?, project_area_unit = ?,
                per_sqft_amount = ?,
                property_age =? 
            WHERE id = ?`,
           propertyData
        );
        
        return { affectedRows : result[0].affectedRows, propertyDetails: data };
    }
    catch(error) {
        console.log(error);
        throw new Error('Unable to update entry.', error);
    }
};

/**
 * Property post: Step 3
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const updatePropertyAmeneties = async (id, data) => {
    
    try{
        // console.log(data)

        const result = await pool.execute(
            `UPDATE tbl_property SET 
                form_step_id = ?,
                furnishing_status= ?,
                parking = ?,
                water_supply = ?,
                washroom_type = ?,
                granted_security = ?,
                pet_allowed = ?,
                non_veg_allowed =?,
                drink_allowed = ?,
                smoke_allowed = ?,
                pg_rules = ?,
                sewage_connection = ?,
                electricity_connection = ?,
                other_amenities = ?,
                description = ?
                WHERE id = ? `,
            [ 
                data.step_id, 
                data.furnishing_status,
                data.parking,
                data.water_supply,
                data.washroom_type,
                data.granted_security,
                data.pet_allowed,
                data.non_veg_allowed,
                data.drink_allowed,
                data.smoke_allowed,
                data.pg_rules,
                data.sewage_connection,
                data.electricity_connection,
                data.other_amenities,
                data.description,
                id
            ]
        );
        return { affectedRows : result[0].affectedRows, ameneties: data };
    }
    catch(error) {
        throw new Error('Unable to update entry.', error);
    }
};

/**
 * Property post: Step 4
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const updatePropertySteps = async (id, data) => {

    try {
        // Section: uploads images 
        const result = await pool.execute(
            `UPDATE tbl_property SET 
                form_step_id = ?
                WHERE id = ? `,
            [ 
                data.step_id, 
                id
            ]
        );

        return { affectedRows : result[0].affectedRows, step_id: data.step_id };
    }
    catch(error) {
        throw new Error('Unable to update entry', error);
    }
};

/**
 * Property post: Step 5
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const updatePropertyFinal = async (id, data) => {

    try {
        // Section: uploads images 
        const result = await pool.execute(
            `UPDATE tbl_property SET 
                form_step_id = ?,
                form_status = ?
                WHERE id = ? `,
            [ 
                data.step_id, 
                data.form_status,
                id
            ]
        );
    return { affectedRows : result[0].affectedRows, step_id: data.step_id };
    }
    catch(error) {
        throw new Error('Unable to update entry', error);
    }
};

// Only update status to isdeleted.
export const delPropertyById = async (id) => {
    try{        
        const response = await pool.execute(`
            UPDATE tbl_property SET is_deleted = '1' WHERE id = ?`, [id]);

        console.log(response);
        return { id: id, afftectedRows: response.affectedRows };
    } catch(error) {
        throw new Error('Unable to update entry', error);
    }
};

/**
 *  List all property to front end: 
 * @returns 
 * 
 */
export const getAllPropertyList = async (whereClause = null, page = 1, limit = 10, sortColumn = 'id',  sortOrder = 'asc' ) => {
    try {

        console.log('where: ', whereClause);
        const offset = (page - 1) * limit;

        // ### update sql query for where clause.
        // ### get ameneties and send to user. and attach to this rows.
        //#region 
        // const gallary = `(SELECT tpg.property_img_url
        //         FROM tbl_property_gallery tpg 
        //         WHERE tpg.property_id = tp.id 
        //         AND tpg.file_type <> 'application/pdf'
        //         AND tpg.status = '1'
        //         ORDER BY tpg.id ASC
        //         LIMIT 1) AS property_img_url `;

        // const userDetails = `(SELECT tu.email
        //         FROM tbl_users tu
        //         WHERE tu.id = tp.user_id 
        //         LIMIT 1) AS user_email `;

        // const configDim = `(SELECT
        //         CASE
        //         WHEN (SELECT COUNT(DISTINCT tpuc.length) FROM tbl_property_unit_configuration tpuc WHERE tp.id = tpuc.property_id) = 1
        //         AND (SELECT COUNT(DISTINCT tpuc.width) FROM tbl_property_unit_configuration tpuc WHERE tp.id = tpuc.property_id) = 1
        //         AND (SELECT COUNT(DISTINCT tpuc.width_unit) FROM tbl_property_unit_configuration tpuc WHERE tp.id = tpuc.property_id) = 1
        //         THEN (SELECT CONCAT(MIN(tpuc.length), " x ", MIN(tpuc.width), " ", MIN(tpuc.width_unit))
        //         FROM tbl_property_unit_configuration tpuc WHERE tp.id = tpuc.property_id)
        //         ELSE (SELECT CONCAT(tpuc.length, " x ", tpuc.width, " ", tpuc.width_unit)
        //         FROM tbl_property_unit_configuration tpuc
        //         WHERE tp.id = tpuc.property_id
        //         ORDER BY tpuc.carpet_price ASC
        //         LIMIT 1)
        //         END) AS config_dimenssion`;
            
                
        // const configCarpetPrice = `(SELECT tpuc.carpet_price
        //         FROM tbl_property_unit_configuration tpuc
        //         WHERE tp.id = tpuc.property_id 
        //         ORDER BY tpuc.carpet_price ASC
        //         LIMIT 1) AS config_carpet_price `;

        //          // Min-Max Carpet Area
        // const carpetAreaRange = `(SELECT 
        //          CASE 
        //              WHEN MIN(tpuc.carpet_area) = MAX(tpuc.carpet_area) 
        //              THEN MIN(tpuc.carpet_area)
        //              ELSE CONCAT(MIN(tpuc.carpet_area), ' - ', MAX(tpuc.carpet_area)) 
        //          END
        //       FROM tbl_property_unit_configuration tpuc 
        //       WHERE tp.id = tpuc.property_id) AS carpet_area_range`;
             

        // // Fetching only BHK types (1-5 BHK)
        // const bhkTypes = `(SELECT 
        //             CASE 
        //                 WHEN COUNT(DISTINCT CASE WHEN tpuc.unit_name REGEXP '^[1-5] BHK$' THEN tpuc.unit_name END) > 3 
        //                 THEN CONCAT(MIN(CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED)), '-', 
        //                             MAX(CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED)), ' BHK')
        //                 ELSE CONCAT(GROUP_CONCAT(DISTINCT CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED) 
        //                                         ORDER BY CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED) ASC SEPARATOR ','), ' BHK')
        //             END 
        //             FROM tbl_property_unit_configuration tpuc
        //             WHERE tp.id = tpuc.property_id AND tpuc.unit_name REGEXP '^[1-5] BHK$') AS bhk_types`;

        // // Fetching only Studio, 1RK, and Other types
        // const otherUnitTypes = `(SELECT GROUP_CONCAT(DISTINCT tpuc.unit_name ORDER BY tpuc.unit_name ASC SEPARATOR ', ') 
        //     FROM tbl_property_unit_configuration tpuc
        //     WHERE tp.id = tpuc.property_id AND tpuc.unit_name IN ('Studio', '1 RK', 'Other')) AS other_unit_types`;


        // const limitQuery = ` LIMIT ${limit} OFFSET ${offset}`;
        // const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
        // // const query = `SELECT tp.*, ${gallery}, ${configDim}, ${configCarpetPrice}, ${carpetAreaRange}, ${bhkTypes}, ${otherUnitTypes}, tps.id as tps_id 

        // const searchQuery = `SELECT tp.*, ${gallary}, ${userDetails}, 
        // ${configCarpetPrice}, 
        // ${configDim}, 
        // ${carpetAreaRange}, 
        // ${bhkTypes}, 
        // ${otherUnitTypes}
        //     FROM tbl_property tp 
        //     ${whereClause} 
        //     ${orderQuery} ${limitQuery} `;
            
        //#endregion
        const searchQuery = `SELECT 
            tp.*, 
            tpg.property_img_url, 
            tu.email AS user_email,
            MIN(tpuc.carpet_price) AS config_carpet_price,
            CASE
                WHEN COUNT(DISTINCT tpuc.length) = 1 
                AND COUNT(DISTINCT tpuc.width) = 1 
                AND COUNT(DISTINCT tpuc.width_unit) = 1 
                THEN CONCAT(MIN(tpuc.length), ' x ', MIN(tpuc.width), ' ', MIN(tpuc.width_unit))
                ELSE CONCAT(tpuc.length, ' x ', tpuc.width, ' ', tpuc.width_unit)
            END AS config_dimenssion,
            CASE 
                WHEN MIN(tpuc.carpet_area) = MAX(tpuc.carpet_area) 
                THEN MIN(tpuc.carpet_area)
                ELSE CONCAT(MIN(tpuc.carpet_area), ' - ', MAX(tpuc.carpet_area)) 
            END AS carpet_area_range,
            CASE 
                WHEN COUNT(DISTINCT CASE WHEN tpuc.unit_name REGEXP '^[1-5] BHK$' THEN tpuc.unit_name END) > 3 
                THEN CONCAT(MIN(CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED)), '-', 
                            MAX(CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED)), ' BHK')
                ELSE GROUP_CONCAT(DISTINCT CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED) 
                                ORDER BY CAST(SUBSTRING_INDEX(tpuc.unit_name, ' BHK', 1) AS UNSIGNED) ASC SEPARATOR ',')
            END AS bhk_types,
            GROUP_CONCAT(DISTINCT CASE 
                WHEN tpuc.unit_name IN ('Studio', '1 RK', 'Other') THEN tpuc.unit_name 
                ELSE NULL 
            END ORDER BY tpuc.unit_name ASC SEPARATOR ', ') AS other_unit_types
        FROM 
            tbl_property tp
        LEFT JOIN 
            tbl_property_gallery tpg ON tpg.property_id = tp.id 
            AND tpg.file_type <> 'application/pdf'
            AND tpg.status = '1'
        LEFT JOIN 
            tbl_users tu ON tu.id = tp.user_id
        LEFT JOIN 
            tbl_property_unit_configuration tpuc ON tpuc.property_id = tp.id
            ${whereClause}
        GROUP BY 
            tp.id
        ORDER BY 
            ${sortColumn} ${sortOrder}
        LIMIT 
            ${limit} OFFSET ${offset};
        `
        const [rows] = await pool.execute(searchQuery);  
        // console.log(rows);
        return rows;
    }
    catch(error) {
        console.log(error);
        throw new Error('Unable to fetch entry.', error);
    }
};


export const getAllPropertyCount = async ( whereClause = null, ) => {
    try {

        const totalCountQuery = `SELECT COUNT(*) AS count FROM tbl_property tp ${whereClause}`;
        const [rows] = await pool.query(totalCountQuery);
        return rows[0].count;
    }
    catch(error) {
        throw new Error('Unable to fetch entry', error);
    }
};


export const getPropertyListById = async (id) => {
    try {
    // console.log('Property ID:', id);
    // lead count

    // Optimized query 
    const query = `SELECT 
            tp.*,           
            tu.fname, 
            tu.lname,
            tu.email,
            tu.mobile,
            (COUNT(DISTINCT tps_intrest.id)  +
            COUNT(DISTINCT tmd.id)) AS intrestedCount,
            COUNT(DISTINCT tps_shortlist.id) AS shortlistedCount
        FROM tbl_property AS tp
        JOIN tbl_users AS tu 
            ON tu.id = tp.user_id
        LEFT JOIN tbl_property_intrest tps_intrest 
            ON JSON_CONTAINS(tps_intrest.property_id, JSON_OBJECT('pid', tp.id))
        LEFT JOIN tbl_property_marketing tpm 
            ON tpm.property_id = tp.id
        LEFT JOIN tbl_marketing_details tmd 
            ON tmd.pm_id = tpm.id
        LEFT JOIN tbl_property_shortlist tps_shortlist 
            ON JSON_CONTAINS(tps_shortlist.property_id, JSON_OBJECT('pid', tp.id))
        WHERE tp.id = ? 
            AND tp.status = '2'
        GROUP BY tp.id `;

        const [rows] = await pool.execute(query, [id])

        // const [rows] = await pool.execute(
    //     `SELECT 
    //       tp.*,           
    //       tu.fname, 
    //       tu.lname,
    //       tu.email,
    //       tu.mobile,
    //        (
    //             SELECT COUNT(*)
    //             FROM tbl_property_intrest tps
    //             WHERE JSON_CONTAINS(
    //                 tps.property_id,
    //                 JSON_OBJECT('pid', tp.id)
    //             )
    //         ) AS intrestedCount,
    //         (
    //          SELECT COUNT(*)
    //             FROM tbl_marketing_details tmd
    //             LEFT JOIN tbl_property_marketing tpm
    //             ON tpm.id = tmd.pm_id
    //             WHERE 
    //                 tpm.property_id = tp.id
    //         ) AS leadCount,
    //         (
    //             SELECT COUNT(*)
    //             FROM tbl_property_shortlist tps
    //             WHERE JSON_CONTAINS(
    //                 tps.property_id,
    //                 JSON_OBJECT('pid', tp.id)
    //             )
    //         ) AS shortlistedCount
    //     FROM tbl_property AS tp
    //     JOIN tbl_users AS tu 
    //       ON tu.id = tp.user_id
    //     WHERE tp.id = ? 
    //       AND tp.status = '2'
    //     `,
    //     [id]
    //   );

      return rows;
    } catch (error) {
      console.error('Error fetching property by ID:', error.message);
      throw new Error('Unable to fetch entry.');
    }
};

/**
 * taking count from tbl_count_propeties
 * @param {*} id 
 * @returns 
 */
export const getPropertyCountById = async (id) => {
    try {
      const [rows] = await pool.execute(
        `SELECT tcp.*
            FROM  tbl_count_properties AS tcp
            WHERE tcp.property_id = ? 
        `,
        [id]
      );
      return rows;
    } catch (error) {
      console.error('Error fetching property by ID:', error.message);
      throw new Error('Unable to fetch entry.');
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

/**
 * Property single list. (Property List | Image list)
 * @param {*} id 
 * @returns 
 */
export const getPropertyDetailsByIdAndUser = async (id, userId) => {
    try {
        console.log('Property ID:', id, 'User ID:', userId);

        const [rows] = await pool.execute(
            `SELECT  tp.*, tu.fname, tu.lname 
            FROM tbl_property AS tp
            JOIN tbl_users AS tu ON tu.id = tp.user_id 
            WHERE tp.id = ? AND tp.user_id = ?`, 
            [id, userId]
        );

        return rows;
    } catch (error) {
        console.error('Error fetching property and user details:', error.message);
        throw new Error('Unable to fetch entry.');
    }
};


export const getPropertyImagesById = async (id) => {
    try{
        // console.log(id);
        const [rows] = await pool.execute(
            `SELECT * FROM tbl_property_gallery
            WHERE property_id = ?`, [ id ]);
            
            // console.log(rows);
        return rows;
    }
    catch(error) {
        throw new Error('Unable to fetch entry.', error);
    }
};


export const getPropertyConfigurationById = async (id) => {
    try {
      const [rows] = await pool.execute(
        `SELECT * 
         FROM tbl_property_unit_configuration 
         WHERE property_id = ? `,
         [id]
        );
          
    //   console.log(rows);
      return rows;
    } catch (error) {
      console.error('Error fetching property configuration:', error);
      throw new Error('Unable to fetch property configuration.');
    }
};


export const getPropertyFaqById = async (id) => {
    try {
      const [rows] = await pool.execute( `SELECT * FROM tbl_property_faq WHERE property_id = ? `, [id] );

      return rows;
    } catch (error) {
      console.error('Error fetching property FAQs:', error);
      throw new Error('Unable to fetch property FAQs.');
    }
};

export const getPropertyNearbyById = async (id) => {
    try {
    
      const masterCategoryJoin = ` LEFT JOIN tbl_master_nearby_locations tmnl
        ON tpnl.nearby_id = tmnl.id`;
      const fetchQuery = `SELECT tpnl.*, tmnl.locations_name, tmnl.location_categories, tmnl.icon_url
                FROM tbl_property_nearby_locations tpnl
                ${masterCategoryJoin}
                WHERE tpnl.property_id = ? `;
      const [rows] = await pool.execute( fetchQuery, [id] );

      return rows;
    } catch (error) {
      console.error('Error fetching property FAQs:', error);
      throw new Error('Unable to fetch property FAQs.');
    }
};


// Not using.
export const getPropertyAmenetiesById = async (id) => {
    try{
        const [rows] = await pool.execute(
            `SELECT * FROM tbl_property_ameneties
            WHERE property_id = ? AND img_title NOT IN ( 'property_images', 'society_images', 'society_flooring_plans', 'society_flooring_plans' )`, [ id ]);

        return rows;
    } 
    catch(error) {        
        throw new Error('Unable to fetch entry.', error);
    }
};


// List Property admin:
export const getAllPropertyListAdmin = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
    try {
        console.log('where: ',whereClause);
        const offset = (page - 1) * limit;
        
        const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
        const searchQuery = `SELECT 
                    tp.id, 
                    tp.user_id, 
                    tp.property_title, 
                    tp.user_type,
                    tp.property_type,
                    tp.property_rent_buy,
                    tp.locality, 
                    tp.city_name, 
                    tp.city_id, 
                    tp.state_name, 
                    tp.state_id, 
                    tp.status,
                    tp.publish_date,
                    tu.email AS user_email, 
                    tu.mobile AS user_mobile
                FROM 
                    tbl_property tp
                JOIN 
                    tbl_users tu 
                ON 
                    tp.user_id = tu.id
                ${whereClause} ${orderQuery}
                LIMIT ${limit} OFFSET ${offset}`;

        const [rows] = await pool.execute(searchQuery);
        console.log(rows);
        return rows;        
    }
    catch(error) {
        throw new Error('Unable to fetch entry.', error);
    }
};


export const getAllPropertyCountAdmin = async ( whereClause = null ) => {
    try {

        const totalCountQuery = `SELECT 
                    COUNT(*) AS count
                FROM 
                    tbl_property tp
                JOIN 
                    tbl_users tu 
                ON 
                    tp.user_id = tu.id
                ${whereClause}`;

        // const totalCountQuery = `SELECT COUNT(*) AS count FROM tbl_property ${whereClause}`;
        const [rows] = await pool.query(totalCountQuery);
        console.log(rows);
        return rows[0].count;
    }
    catch(error) {
        throw new Error('Unable to fetch entry', error);
    }
};

/**
 * Property single list. (Property List | Ameneties | Image list | Configuration)
 * @param {*} id 
 * @returns 
 */
export const getPropertyListAdminById = async (id) => {
    try{
        console.log(id);
        const [rows] = await pool.execute(
            `SELECT * FROM tbl_property
            WHERE id = ? AND is_deleted = '0'`, [ id ]);

        console.log(rows,"rowsss");

        return rows;
    }    
    catch(error) {
        throw new Error('Unable to fetch entry.', error);
    }
};

// List Property admin:
export const getAllPropertyListAdminByMemberId = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
    try {
        console.log('where: ',whereClause);
        const offset = (page - 1) * limit;
        
        const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
        const searchQuery = `SELECT 
                    tp.id, 
                    tp.user_id, 
                    tp.property_title, 
                    tp.user_type,
                    tp.property_type,
                    tp.property_rent_buy,
                    tp.locality, 
                    tp.city_name, 
                    tp.city_id, 
                    tp.state_name, 
                    tp.state_id, 
                    tp.status,
                    tp.publish_date
                FROM 
                    tbl_property tp
                ${whereClause} ${orderQuery}
                LIMIT ${limit} OFFSET ${offset}`;

        const [rows] = await pool.execute(searchQuery);  
        console.log(rows)
        return rows;        
    }
    catch(error) {
        throw new Error('Unable to fetch entry.', error);
    }
};


export const getAllPropertyCountAdminByMemberId = async ( whereClause = null ) => {
    try {

        const totalCountQuery = `SELECT 
                    COUNT(*) AS count
                FROM 
                    tbl_property tp
                ${whereClause}`;

        // const totalCountQuery = `SELECT COUNT(*) AS count FROM tbl_property ${whereClause}`;
        const [rows] = await pool.query(totalCountQuery);
        console.log(rows);
        return rows[0].count;
    }
    catch(error) {
        throw new Error('Unable to fetch entry', error);
    }
};


/**
 * Update Property Admin : Features (Basic Details)
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const updatePropertyFeaturesDb = async (id, data) => {

    console.log("Properities: ",data);
    try{
        // const { 
        //     property_description,
        //     landmark ,
        //     locality,
        //     city_id,
        //     city_name,
        //     state_id,
        //     state_name,
        //     pincode,
        //     on_rent_buy,
        //     property_type,
        //     property_sub_variant,
        //     flat_type,
        //     area,
        //     area_type,
        //     bed_rooms,
        //     bath_rooms,
        //     property_floors,
        //     total_floors,
        //     balcony,
        //     is_wings,
        //     wings_count,
        //     rent,
        //     rent_is_nogotiable,
        //     deposite,
        //     deposite_is_negotiable,
        //     availability_date,
        //     property_age
        // } = data.property;
        
        // await pool.execute(
        //     `UPDATE tbl_property SET 
        //     property_description = ?,
        //     landmark = ?,
        //     locality = ?,
        //     city_id = ?,
        //     city_name = ?,
        //     state_id = ?,
        //     state_name = ?,
        //     pincode = ?,
        //     on_rent_buy = ?,
        //     property_type = ?,
        //     property_sub_variant = ?,
        //     flat_type = ?,
        //     area = ?,
        //     area_type = ?,
        //     bed_rooms = ?,
        //     bath_rooms = ?,
        //     property_floors = ?,
        //     total_floors = ?,
        //     balcony = ?,
        //     is_wings = ?,
        //     wings_count = ?,
        //     rent = ?,
        //     rent_is_nogotiable = ?,
        //     deposite = ?,
        //     deposite_is_negotiable = ?,
        //     availability_date = ?,
        //     property_age = ?
        //     WHERE id = ?`,
        //     [   property_description, 
        //         landmark,
        //         locality,
        //         city_id,
        //         city_name,
        //         state_id,
        //         state_name,
        //         pincode,
        //         on_rent_buy,
        //         property_type,
        //         property_sub_variant,
        //         flat_type,
        //         area,
        //         area_type,
        //         bed_rooms,
        //         bath_rooms,
        //         property_floors,
        //         total_floors,
        //         balcony,
        //         is_wings,
        //         wings_count,
        //         rent,
        //         rent_is_nogotiable,
        //         deposite,
        //         deposite_is_negotiable,
        //         availability_date,
        //         property_age, 
        //         id
        //     ]
        // );
        // return { id, ...data.property };

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
            UPDATE tbl_property 
            SET 
            ${queryField.join(', ') }
            WHERE id = ?`;

    const [result] = await pool.execute(query, queryParams);
    return { affectedRows: result.affectedRows, ...data };

    }
    catch(error) {
        console.log(error);
        throw new Error('Unable to update entry.', error);
    }
};

/**
 * Update Proeprty Admin : Ameneties
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const updatePropertyAmenetiesAdminDb = async (id, data) => {

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
            UPDATE tbl_property 
            SET 
            ${queryField.join(', ') }
            WHERE id = ?`;

    const [result] = await pool.execute(query, queryParams);
    return { affectedRows: result.affectedRows, ...data };

    }
    catch(error) {
        throw new Error('Unable to update entry', error);
    }
};


/**
 * Update Images Admin : Step: 1
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const updatePropertyImagesAdminDb = async (id, data) => {

    try {

        let queryField = [];
        let queryParams = [];

        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined && value !== null) {
                queryField.push(`${key} = ?`);
                queryParams.push(value);
            } 
        }queryParams.push(id);

        const query = `
                UPDATE tbl_property_gallery 
                SET 
                ${queryField.join(', ') }
                WHERE id = ?`;

        const [result] = await pool.execute(query, queryParams);
        return { affectedRows: result.affectedRows, ...data };

    }
    catch(error) {
        console.log(error)
        throw new Error('Unable to update entry', error);
    }
};

export const updatePropertyConfigurationAdminDb = async (id, data) => {

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
                UPDATE tbl_property_unit_configuration 
                SET 
                ${queryField.join(', ') }
                WHERE id = ?`;

        const [result] = await pool.execute(query, queryParams);
        return { affectedRows: result.affectedRows, ...data };

    }
    catch(error) {
        console.log(error)
        throw new Error('Unable to update entry', error);
    }
};

export const createPropertyFandQAdminDb = async (data) => {
        
    try {
                        
        const propertyData = [
            data.property_id,
            data.faq_question,
            data.faq_answer
        ]
        console.log("data::::",data);

        const [result] = await pool.query(
            `INSERT INTO tbl_property_faq 
                ( property_id, faq_question, faq_answer ) 
             VALUES ( ?, ?, ? )`,
            propertyData
        );

        console.log(result);

        return { id: result.insertId, ...data };
    }
    catch(error) {
        console.log(error)
        throw new Error('Unable to create entry', error);
    } 
};

export const delPropertyFandqByIdAdminDb = async (id) => {
    try{
        
        const response = await pool.execute(`delete from tbl_property_faq WHERE id = ?`, [id]);

        console.log(response);
        return { id: id, afftectedRows: response.affectedRows };
    } catch(error) {
        throw new Error('Unable to update entry', error);
    }
};

/**
 * Update Proeprty Admin : Document Images
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const updatePropertyFandqAdminDb = async (id, data) => {

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
                UPDATE tbl_property_faq 
                SET 
                ${queryField.join(', ') }
                WHERE id = ?`;

        const [result] = await pool.execute(query, queryParams);
        return { affectedRows: result.affectedRows, ...data };

    }
    catch(error) {
        console.log(error)
        throw new Error('Unable to update entry', error);
    }
};


/**
 * Nearby section
 * @param {*} data 
 * @returns 
 */
export const createPropertyNearbyAdminDb = async (data) => {
    try {

        const propertyData = [
            data.property_id,
            data.nearby_id,
            data.location_title,
            data.location_value, 
            data.distance, 
            data.time, 
            data.longitude, 
            data.latitude
        ]
        console.log("data::::",data);

        const [result] = await pool.query(
            `INSERT INTO tbl_property_nearby_locations 
                ( property_id, nearby_id, location_title, 
                 location_value, distance, time, 
                 longitude, latitude ) 
             VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )`,
            propertyData
        );

        // console.log(result);

        return { id: result.insertId, ...data };
    }
    catch(error) {
        console.log(error)
        throw new Error('Unable to create entry', error);
    } 
};

export const delPropertyNearbyByIdAdminDb = async (id) => {
    try{
        
        const [response] = await pool.execute(`delete from tbl_property_nearby_locations WHERE id = ?`, [id]);

        console.log(response);
        return { id: id, afftectedRows: response.affectedRows };
    } catch(error) {
        throw new Error('Unable to update entry', error);
    }
};

/**
 * Update Proeprty Admin : Nearby 
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const updatePropertyNearbyAdminDb = async (id, data) => {

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
                UPDATE tbl_property_nearby_locations 
                SET 
                ${queryField.join(', ') }
                WHERE id = ?`;

        const [result] = await pool.execute(query, queryParams);
        return { affectedRows: result.affectedRows, ...data };

    }
    catch(error) {
        console.log(error)
        throw new Error('Unable to update entry', error);
    }
};

/**
 * Property All Nearby Category.
 * @param {*} id 
 * @returns 
 */
export const getAllPropertyNearbyCategoryAdmin = async (id) => {
    try{
        console.log(id);
        const [rows] = await pool.execute(
            `SELECT * FROM tbl_master_nearby_locations
            WHERE status = '1'`);

        return rows;
    }    
    catch(error) {
        throw new Error('Unable to fetch entry.', error);
    }
};


/**
 * Property: not required
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const updatePropertyDescription = async (id, data) => {
    
    try{
        // console.log("Property: ", data.property)
        const { 
            property_description
        } = data.property;

        await pool.execute(
            `UPDATE tbl_property SET 
            property_description = ?
            WHERE id = ?`,
            [ 
                property_description,
                id
            ]
        );
        return { id, ...data.property };
    }
    catch(error) {
        throw new Error('Unable to update entry.', error);
    }
};

/**
 * Property: Step 5 old NR
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const updatePropertyGallery = async (id, data) => {
    
    try {
        // Section: uploads images 
        const updatedGallery = data.gallery.map((image) => {
            return {property_id : id, ...image}
        });
        
        await pool.beginTransaction();
        for (const gallery of updatedGallery) {
            await pool.execute(
                `INSERT INTO tbl_property_gallery 
                    (property_id, img_title, property_img_url, img_type) 
                VALUES (?, ?, ?, ?)`,
                [id, gallery.img_title, gallery.property_img_url, gallery.img_type]
            );
        }

    // updatedGallery.map( async (gallery) =>  {
    //     await pool.execute(
    //         `INSERT INTO tbl_property_gallery 
    //             (property_id, img_title, property_img_url, img_type  ) 
    //         VALUES (?, ?, ?, ?)`,
    //         [id, gallery.img_title, gallery.property_img_url, gallery.img_type ]
    //     );
    // });
        await pool.commit();
        return { id, ...data.amenties };
    }
    catch(error) {
        await pool.rollback();
        throw new Error('Unable to update entry', error);
    }
};


/**
 * Property update: Status 
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
export const updatePropertyStatusById = async (id, data) => {
    try {
        console.log("status:::", id, data)
      const [response] = await pool.execute(
        `UPDATE tbl_property SET status = ?, status_text = ?, publish_date = ? WHERE id = ?`, 
        [data.status, data.statusText, data.publish_date, id]
      );
  
      console.log(response);
      return { id: id, affectedRows: response.affectedRows };
    } catch (error) {
      throw new Error('Unable to update entry', error);
    }
};


export const updatePropertySlug = async (id, title_slug) => {
    try {
        console.log(title_slug, id)
        const updateQuery = `UPDATE tbl_property SET title_slug = ? WHERE id = ?`;
        await pool.execute(updateQuery, [title_slug, id])      

    } catch (error) {
        throw new Error('Unable to update entry', error);
    }
};
