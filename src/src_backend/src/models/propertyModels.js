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
        throw new Error('Unable to create entry', error);
    } 
};

export const getAllAmenties = async () => {
    const [rows] = await pool.execute('SELECT * FROM tbl_master_amenties');
    return rows;
};

export const deleteAmenties = async (id) => {
    try{
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
        throw new Error('Unable to create entry', error.message);
    } 
};

export const getAllFeatures = async () => {
    try{
    const [rows] = await pool.execute('SELECT * FROM tbl_master_features');
    return rows;
}
catch(error) {
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

        const [resultProperty] = await connection.query(
            `INSERT INTO tbl_property 
                ( user_id, form_step_id, property_type, 
                  company_name, property_rent_buy, user_type,
                  ip_address, user_agent, host_name ) 
             VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? )`,
            propertyData
        );

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
        const offset = (page - 1) * limit;

        const searchQuery = `SELECT 
            tp.id,
            tp.user_id,
            tp.form_step_id,
            tp.form_status,
            tp.user_type,
            tp.contact_no,
            tp.property_title,
            tp.title_slug,
            tp.company_name,
            tp.description,
            tp.short_description,
            tp.full_address,
            tp.building_name,
            tp.landmark,
            tp.locality,
            tp.city_id,
            tp.state_id,
            tp.city_name,
            tp.state_name,
            tp.pincode,
            tp.latitude,
            tp.longitude,
            tp.land_area,
            tp.land_area_unit,
            tp.property_availibility_type,
            tp.is_maintenance,
            tp.property_variety_type,
            tp.builtup_area,
            tp.builtup_area_unit,
            tp.rent_amount,
            tp.deposite_amount,
            tp.property_type,
            tp.bed_rooms,
            tp.washrooms,
            tp.floor_number,
            tp.total_floors,
            tp.property_floors,
            tp.balcony,
            tp.is_wings,
            tp.unit_number,
            tp.total_wing,
            tp.wing_name,
            tp.property_variety,
            tp.property_rent_buy,
            tp.rent_is_nogotiable,
            tp.deposite_is_negotiable,
            tp.availability_date,
            tp.availability_duration,
            tp.property_age,
            tp.furnishing_status,
            tp.parking,
            tp.water_supply,
            tp.washroom_type,
            tp.granted_security,
            tp.other_amenities,
            tp.door_facing,
            tp.preferred_tenent,
            tp.pet_allowed,
            tp.non_veg_allowed,
            tp.expected_amount,
            tp.drink_allowed,
            tp.smoke_allowed,
            tp.pg_rules,
            tp.exected_amount_sqft,
            tp.per_sqft_amount,
            tp.monthly_maintenance,
            tp.ownership_type,
            tp.dimension_length,
            tp.dimension_width,
            tp.width_facing_road,
            tp.sewage_connection,
            tp.electricity_connection,
            tp.rera_number,
            tp.is_rera_number,
            tp.property_current_status,
            tp.possession_status,
            tp.possession_date,
            tp.total_towers,
            tp.total_units,
            tp.project_area,
            tp.project_area_unit,
            tp.unique_view_count,
            tp.ip_address,
            tp.user_agent,
            tp.host_name,
            tp.status,
            tp.status_text,
            tp.is_deleted,
            tp.added_by,
            tp.updated_by,
            tp.publish_date,
            tp.created_at,
            tp.updated_at,
            MIN(tpg.property_img_url) AS property_img_url, 
            tu.email AS user_email,
            MIN(tpuc.carpet_price) AS config_carpet_price,
            
            
            CASE 
                WHEN COUNT(DISTINCT tpuc.length) = 1 
                AND COUNT(DISTINCT tpuc.width) = 1 
                AND COUNT(DISTINCT tpuc.width_unit) = 1 
                THEN CONCAT(MIN(tpuc.length), ' x ', MIN(tpuc.width), ' ', MIN(tpuc.width_unit))
                ELSE GROUP_CONCAT(DISTINCT CONCAT(tpuc.length, ' x ', tpuc.width, ' ', tpuc.width_unit) SEPARATOR ', ')
            END AS config_dimension,

            
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
            AND tpg.file_type NOT IN ('application/pdf', 'video/mp4', 'video/mkv', 'video/avi')
            AND tpg.status = '1'
        LEFT JOIN 
            tbl_users tu ON tu.id = tp.user_id
        LEFT JOIN 
            tbl_property_unit_configuration tpuc ON tpuc.property_id = tp.id
        ${whereClause}
        GROUP BY 
            tp.id, tu.email
        ORDER BY 
            ${sortColumn} ${sortOrder}
        LIMIT 
            ${limit} OFFSET ${offset}`;

        const [rows] = await pool.execute(searchQuery);  
        return rows;
    }
    catch(error) {
        throw new Error('Unable to fetch entry.', error);
    }
};


export const getAllPropertyCount = async ( whereClause = null, ) => {
    try {
        const unitJoin = `LEFT JOIN tbl_property_unit_configuration tpuc ON tpuc.property_id = tp.id`
        const totalCountQuery = `SELECT COUNT(*) AS count 
            FROM tbl_property tp 
            ${unitJoin}
            ${whereClause}`;
        const [rows] = await pool.query(totalCountQuery);
        return rows[0].count;
    }
    catch(error) {
        throw new Error('Unable to fetch entry', error);
    }
};


export const getPropertyListById = async (id) => {
    try {

    // Optimized query 
    const query = `SELECT 
            tp.*,           
            tu.fname, 
            tu.lname,
            tu.email,
            tu.mobile,
            tu.company_web_url,
            tu.instagram_url,
            tu.facebook_url,
            tu.youtube_url,
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
    try {
        const [rows] = await pool.execute(
            `SELECT *
            FROM tbl_property_gallery
            WHERE property_id = ?
            ORDER BY 
            (LOWER(img_title) = 'main image') DESC,
            (LOWER(img_title) = 'Default') ASC, 
            img_title
             `, 
            [id]
        );

        return rows;
    } catch (error) {
        console.log(error)
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
        const offset = (page - 1) * limit;
        
        const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
        const searchQuery = `SELECT 
                    tp.id, 
                    tp.user_id, 
                    tp.property_title, 
                    tp.title_slug, 
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

        const [rows] = await pool.query(totalCountQuery);
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
        const [rows] = await pool.execute(
            `SELECT * FROM tbl_property
            WHERE id = ? AND is_deleted = '0'`, [ id ]);

        return rows;
    }    
    catch(error) {
        throw new Error('Unable to fetch entry.', error);
    }
};

// List Property admin:
export const getAllPropertyListAdminByMemberId = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
    try {
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
    let connection;
    try{
        let queryField = [];
        let queryParams = [];
        connection = await pool.getConnection();
        await connection.beginTransaction();
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

        const [result] = await connection.execute(query, queryParams);
        await connection.commit();
        return { affectedRows: result.affectedRows, ...data };
    }
    catch(error) {
        console.log(error);
        await connection.rollback();
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

        const [result] = await pool.query(
            `INSERT INTO tbl_property_faq 
                ( property_id, faq_question, faq_answer ) 
             VALUES ( ?, ?, ? )`,
            propertyData
        );


        return { id: result.insertId, ...data };
    }
    catch(error) {
        throw new Error('Unable to create entry', error);
    } 
};

export const delPropertyFandqByIdAdminDb = async (id) => {
    try{
        
        const response = await pool.execute(`delete from tbl_property_faq WHERE id = ?`, [id]);

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

        const [result] = await pool.query(
            `INSERT INTO tbl_property_nearby_locations 
                ( property_id, nearby_id, location_title, 
                 location_value, distance, time, 
                 longitude, latitude ) 
             VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )`,
            propertyData
        );


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
    let connection;
    try {
        // Section: uploads images 
        connection = await pool.getConnection();
        const updatedGallery = data.gallery.map((image) => {
            return {property_id : id, ...image}
        });
        
        await connection.beginTransaction();
        for (const gallery of updatedGallery) {
            await connection.execute(
                `INSERT INTO tbl_property_gallery 
                    (property_id, img_title, property_img_url, img_type) 
                VALUES (?, ?, ?, ?)`,
                [id, gallery.img_title, gallery.property_img_url, gallery.img_type]
            );
        }

        await connection.commit();
        return { id, ...data.amenties };
    }
    catch(error) {
        await connection.rollback();
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
      const [response] = await pool.execute(
        `UPDATE tbl_property SET status = ?, status_text = ?, publish_date = ? WHERE id = ?`, 
        [data.status, data.statusText, data.publish_date, id]
      );
      return { id: id, affectedRows: response.affectedRows };
    } catch (error) {
      throw new Error('Unable to update entry', error);
    }
};


export const updatePropertySlug = async (id, title_slug) => {
    try {
        const updateQuery = `UPDATE tbl_property SET title_slug = ? WHERE id = ?`;
        await pool.execute(updateQuery, [title_slug, id])      

    } catch (error) {
        throw new Error('Unable to update entry', error);
    }
};


export const getPropertyNearbyLocationsById = async (propertyId) => {
    try {
        const [rows] = await pool.execute(
            `SELECT
            m.location_categories,
            m.locations_name,
            m.icon_url,
            CONCAT('[', GROUP_CONCAT(
                JSON_OBJECT(
                    'id', p.id,
                    'location_title', p.location_title,
                    'distance', p.distance,
                    'time_to_reach', p.time,
                    'latitude', CAST(p.latitude AS CHAR),
                    'longitude', CAST(p.longitude AS CHAR)
                ) ORDER BY p.id SEPARATOR ','), ']') AS locations
            FROM tbl_property_nearby_locations p
            JOIN tbl_master_nearby_locations m ON p.nearby_id = m.id
            WHERE p.property_id = ?
            GROUP BY m.location_categories, m.locations_name, m.icon_url`,
            [propertyId]
        );
        
        // Transform the data into the required structure
        const groupedData = {};
        
        rows.forEach(row => {
        const { location_categories, locations_name, icon_url, locations } = row;
        const parsedLocations = JSON.parse(locations);
        
        if (!groupedData[location_categories]) {
            groupedData[location_categories] = { location_categories };
        }
        
        if (!groupedData[location_categories][locations_name]) {
            groupedData[location_categories][locations_name] = { icon_url, locations: [] };
        }
        
        groupedData[location_categories][locations_name].locations = parsedLocations;
        });
        
        return Object.values(groupedData).map(category => {
            const { location_categories, ...locations } = category;
            return { location_categories, ...locations };
        });
        
        } catch (error) {
            console.error('Error fetching nearby locations:', error);
            throw new Error('Error fetching nearby locations', error);
        }
};

export const insertGeneratedNearbyLocationsData = async (property_id, locations) => {
    try {
        let values = [];
        let placeholders = [];

        for(let loc of locations) {
            const {
                location_title,
                location_value,
                address,
                latitude,
                longitude,
                distance,
                time,
                nearby_id,
              } = loc;

            values.push(
                property_id,
                location_title || '',
                location_value ? location_value : location_title || '',
                address || '',
                nearby_id || '',
                latitude || null,
                longitude || null,
                distance || '',
                time || ''
              );
            placeholders.push(`(?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        }

        const insertQuery = `INSERT INTO
                 tbl_property_nearby_locations 
                 (property_id, location_title, location_value, address, nearby_id, latitude, longitude, distance, time)
                 VALUES
                    ${placeholders.join(', ')}
            `;
        const [result] = await pool.execute(insertQuery, values)
        console.log( result, "test result")
        return { affectedRows : result.affectedRows, values }
    } catch (error) {
        console.log(error, "logging")
        throw new Error('Unable to insert entry', error);
    }
}