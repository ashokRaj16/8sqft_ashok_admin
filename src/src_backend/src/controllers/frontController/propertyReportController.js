import pool from "../../config/db.js";
import { badRequestResponse, successResponse } from '../../utils/response.js';

export const createPropertyRequest = async (req, res) => {
    const { property_id, request_type, request_reason } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!property_id || !request_type || !request_reason) {
        return badRequestResponse(res, false, "property_id, request_type, and request_reason are required.");
    }

    try {
       
        const user_id    = req.userId;
        const user_agent = req.headers['user-agent'];
        const user_host  = req.headers['host'];
        const user_ip    = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';

        const query = `INSERT INTO tbl_property_request (user_id, property_id, request_type, request_reason, user_agent, user_host, user_ip)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        await pool.execute(query, [user_id, property_id, request_type, request_reason, user_agent, user_host, user_ip]);

        return successResponse(res, true, 'Property report added.');
    } catch (error) {
        console.error('Error creating property report.', error);
        return badRequestResponse(res, false, "An error occurred while creating the property report.");
    }
};