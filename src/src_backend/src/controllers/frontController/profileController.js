import pool from '../../config/db.js';
import { updateMemberProfile } from '../../models/userModel.js';
import { badRequestResponse, successResponse, successWithDataResponse } from '../../utils/response.js';


export const getProfile = async (req, res) => {
    const user_id = req.userId; 
    console.log("userId: ", req.userId);
    try {
        const query = `SELECT * FROM tbl_users WHERE id = ?`;
        const [rows] = await pool.query(query, [user_id]);
        console.log(rows);
        if (rows.length === 0) {
            return badRequestResponse(res, false, "Profile not found.");
        }
        return successWithDataResponse(res, true, 'Profile list.', rows[0]);
    } catch (error) {
        return badRequestResponse(res, false, "Error fetching profile.", error);
    }
  };
  
  export const updateProfile = async (req, res) => {
    const id = req.userId;
    console.log(req.body);
    const { fname, lname, mname, mobile, email, company_name, profile_picture_url, address_1, city_id, state_id, pincode } = req.body;

    try {
        
        const userData = {
            fname: fname || null,
            lname: lname || null,
            mname: mname || null,
            mobile : mobile || null,
            email : email || null,
            address_1 : address_1 || null, 
            company_name : company_name || null,
            city_id : city_id || null,
            state_id : state_id || null,
            pincode: pincode || null
        }
        // console.log(userData, id)
        
        const result = await updateMemberProfile(id , userData)
        if (result.affectedRows === 0) {
            return badRequestResponse(res, false, "Profile not found or no changes made");
        }

        return successResponse(res, true, 'Profile updated successfully');
    } catch (error) {
        console.error("Error updating profile:", error.message);
        return badRequestResponse(res, false, "Error updating profile", error);
    }
};

