import pool from "../../config/db.js";
import { badRequestResponse, successResponse } from '../../utils/response.js';

export const addToWishlist = async (req, res) => {
    const { propertyId } = req.body;
    const userId = req.userId;

    if (!userId || !propertyId) {
        return badRequestResponse(res, false, "Property id are required with request.");
    }

    try {
        
        const checkInterestQuery = 'SELECT * FROM tbl_property_shortlist WHERE user_id = ?';
        const [interestResult] = await pool.query(checkInterestQuery, [userId]);

        const currentDate = new Date().toISOString().split('T')[0];

        if (interestResult.length > 0) {
          let existingPropertyIds = JSON.parse(interestResult[0].property_id || '[]');

          const propertyExists = existingPropertyIds.some(item => item.pid === propertyId);
          console.log("tested contactsss : ", propertyExists, existingPropertyIds);

          if (!propertyExists) {
            existingPropertyIds.push({ pid: propertyId, date: currentDate });

            const updatedPropertyIds = JSON.stringify(existingPropertyIds);

            const updateInterestQuery = 'UPDATE tbl_property_shortlist SET property_id = ? WHERE user_id = ?';
            await pool.query(updateInterestQuery, [updatedPropertyIds, userId]);
          }

        }
        else {
            let propertyIds = { pid: propertyId, date: currentDate };
            const updatedPropertyIds = JSON.stringify( [ propertyIds ] );
            console.log("intrested: ", propertyIds, updatedPropertyIds)
            const createInterestQuery = 'insert into tbl_property_shortlist (user_id, property_id) values (?, ?)';
            const result = await pool.query(createInterestQuery, [ userId, updatedPropertyIds]);
            console.log('resultss:', result)
        }

        // const query = `INSERT INTO tbl_property_shortlist (user_id, property_id) VALUES (?, ?)`;
        // await pool.execute(query, [userId, propertyId]);

        return successResponse(res, true, 'Property added to wishlist successfully.');
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return badRequestResponse(res, false, "An error occurred while adding to the wishlist.", error);
    }
};