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



// export const getRecommendationData = async (amount = null, area = null, city = null, propertyType = null, limit = 10) => {
//   try {
//       let where = 'WHERE tp.status = 2';

//       if (amount) {
//           where += ` AND tp.rent <= ${amount}`;
//       }
//       if (area) {
//           where += ` AND tp.area LIKE '%${area}%'`;
//       }
//       if (city) {
//           where += ` AND tc.city_name = '${city}'`;
//       }
//       if (propertyType) {
//           where += ` AND tp.property_type = '${propertyType}'`;
//       }

//       const queryLimit = `LIMIT ${limit}`;
//       const joinCity = `LEFT JOIN tbl_city tc ON tc.id = tp.city_id`;
//       const joinGallery = `LEFT JOIN tbl_property_gallery tpg ON tpg.property_id = tp.id`; // Join tbl_property_gallery
//       const query = `SELECT tp.*, tpg.image_path FROM tbl_property tp ${joinCity} ${joinGallery} ${where} ${queryLimit}`;

//       console.log('Generated Query:', query);

//       const [rows] = await pool.execute(query);
//       return rows;
//   } catch (error) {
//       console.error('Database Error:', error);
//       throw new Error('Unable to fetch recommendations.');
//   }
// };

