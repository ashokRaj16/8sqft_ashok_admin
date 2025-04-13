
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

import * as AdminModel from "../../models/adminModel.js"
import { loginValidator } from "../validators/loginValidator.js";
import { badRequestResponse, successResponse, successWithDataResponse, unauthorizedResponse } from "../../utils/response.js";
import { generateToken } from '../../utils/tokenHelper.js';
import { constant } from '../../config/constant.js';

// import { cookie }
// dotenv.config();

// Admin Login
export const adminLogin = async (req, res) => {
    try {
        const data = {}
        const errors = loginValidator(req.body);
        if(errors.length > 0)
        {
            return badRequestResponse(res, false, "Validation Message", errors);
        }

        const { email, password } = req.body;
        const admin = await AdminModel.findByEmail(email);
        
        if (!admin) {
            return badRequestResponse(res, false, "User not found. Pleas enter valid user id or password.")
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
        if (!isPasswordValid) {
            return unauthorizedResponse(res, false, 'Please enter valid password.' );
        }

        const userData = { id: admin.id, email: admin.email, role: admin.role_id, role_name: admin.role_name };

        const accessToken = generateToken( userData, constant.USER_TYPE.ADMIN, constant.TOKEN_TYPE.ACCESS )
        const refreshToken = generateToken( userData, constant.USER_TYPE.ADMIN, constant.TOKEN_TYPE.REFRESH )

        data['sqftAccessToken'] = accessToken;
        data['sqftRefreshToken'] = refreshToken;
        return successResponse(res, true, 'Login successful.', data)

    } catch (error) {
      console.log(error, "error")
        return badRequestResponse(res, false, 'Error logging in.', error);
    }
};

// Logout
export const logout = (req, res) => {
    try{
        return successResponse(res, true, 'Logout successful.')
    } catch (error) {
        return badRequestResponse(res, false, 'Error logout.', error);
    }
};

/**
 * Get: Profile
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getProfile = async (req, res) => {
    const adminId = req.userId;
    try {
        const admin = await AdminModel.findById(adminId);
        if (!admin) return res.status(404).json({ message: 'Profile not found' });
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

/**
 * Update : Profile
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const updateProfile = async (req, res) => {
    const adminId = req.userId;
    const { fname, lname, mname, mobile, phone, email, address, pan, pincode, city_id, city_name, state_id, state_name } = req.body;
    try {
      const userObject = { 
          fname : fname || null, 
          mname : mname || null, 
          lname : lname || null, 
          mobile : mobile || null, 
          email : email || null,
          phone : phone || null, 
          address : address || null, 
          pan : pan || null, 
          pincode : pincode || null, 
          city_id : city_id || null, 
          city_name : city_name || null, 
          state_id : state_id || null, 
          state_name : state_name || null }
        const updatedAdmin = await AdminModel.update(adminId, userObject);

        return successWithDataResponse(res, false, 'Profile updated successfully', updatedAdmin );
    } catch (error) {
        return badRequestResponse(res, false, 'Error updating profile', error );
    }
};


/**
 * Change Password
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const changePassword = async (req, res) => {
    const id = req.userId;
    const { oldPassword, newPassword } = req.body;
    try {
        const admin = await AdminModel.findById(id);
        if (!admin) {
          return badRequestResponse(res, false, 'Admin not found.' );
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, admin.password_hash);
        if (!isPasswordValid) {
          return badRequestResponse( res, false, 'Old password is incorrect.' );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await AdminModel.updatePassword(id, hashedPassword);

        return successWithDataResponse(res, false, 'Password changed successfully.', result );
    } catch (error) {
      return badRequestResponse(res, false, 'Error changing password', error );
    }
};


//Dashboard
export const dashboard = async (req, res) => {
    let data = {}
  let userId= req.userId

  try {
      const userCount = await AdminModel.getUserCount();
      const propertyCount = await AdminModel.getPropertyCount();
      const adminDetails = await AdminModel.findById(userId);

      // Fetch month-wise user and property counts
      const userCountByMonth = await AdminModel.getUserCountByMonth();
      const propertyCountByMonth = await AdminModel.getPropertyCountByMonth();

        data['total_users'] = userCount;
        data['total_property'] = propertyCount;
        data['adminDetails'] = adminDetails;
        data['userCountByMonth'] = userCountByMonth;
        data['propertyCountByMonth'] = propertyCountByMonth;

        return successWithDataResponse(res, true, "Site count info",data)
    
    
  } catch (error) {
     return badRequestResponse(res, false, 'Error fetching dashboard data', error)
  }
};



export const getAdminRoles = async (req, res) => {
    try {
        const roleId = req.roleId;
        const adminRoles = await AdminModel.getRoleMaster(roleId);

        if (!adminRoles) {
            return badRequestResponse(res, false, 'Role not found', error)
        }
        return successWithDataResponse(res, true, 'Admin Roles', adminRoles);
    } catch (error) {
        return badRequestResponse(res, false, 'Error fetching Roles', error)
    }
};

export const getAllInterestedUsers = async (req, res) => {
    try {
      // Query to get all records from tbl_property_intrest
      const interestedUsersQuery = `
        SELECT 
          pi.user_id, 
          pi.property_id, 
          u.fname, 
          u.lname, 
          p.property_title, 
          p.description, 
          p.rent_amount, 
          p.city_name, 
          p.property_type, 
          p.status 
        FROM tbl_property_intrest pi
        JOIN tbl_users u ON pi.user_id = u.id
        JOIN tbl_property p ON JSON_CONTAINS(pi.property_id, CAST(p.id AS JSON))`;
  
      const [interestedUsersResult] = await pool.query(interestedUsersQuery);
  
      if (interestedUsersResult.length === 0) {
        return successResponse(res, true, 'No interested users found.', []);
      }
  
      return successResponse(res, true, 'Interested users retrieved successfully.', interestedUsersResult);
    } catch (error) {
      console.error('Error in getAllInterestedUsers:', error);
      return badRequestResponse(res, false, 'Failed to retrieve interested users.', error);
    }
};

  
export const getAllShortlistedProperties = async (req, res) => {
  try {
    // Query to get all records from tbl_property_wishlist
    const shortlistedPropertiesQuery = `
      SELECT 
        pw.user_id, 
        pw.property_id, 
        u.fname, 
        u.lname, 
        p.property_title, 
        p.description, 
        p.rent_amount, 
        p.city_name, 
        p.property_type, 
        p.status 
      FROM tbl_property_shortlist pw
      JOIN tbl_users u ON pw.user_id = u.id
      JOIN tbl_property p ON pw.property_id = p.id`;

    const [shortlistedPropertiesResult] = await pool.query(shortlistedPropertiesQuery);

    if (shortlistedPropertiesResult.length === 0) {
      return successResponse(res, true, 'No shortlisted properties found.', []);
    }

    return successResponse(res, true, 'Shortlisted properties retrieved successfully.', shortlistedPropertiesResult);
  } catch (error) {
    console.error('Error in getAllShortlistedProperties:', error);
    return badRequestResponse(res, false, 'Failed to retrieve shortlisted properties.', error);
  }
};

export const getUniqueViews = async (req, res) => {
  try {
    const query = `SELECT uv.id AS view_id, CONCAT(u.fname, ' ', u.lname) AS username, u.mobile, u.email, 
        p.property_title AS property_name, uv.status, uv.created_at, FROM tbl_unique_views uv
        JOIN tbl_users u ON uv.user_id = u.id JOIN tbl_property p ON uv.property_id = p.id`;

    const [results] = await pool.query(query);

    if (results.length === 0) {
      return successResponse(res, true, 'No unique views found.', []);
    }

    return successResponse(res, true, 'Unique views retrieved successfully.', results);
  } catch (error) {
    console.error('Error in getUniqueViews:', error);
    return badRequestResponse(res, false, 'Failed to retrieve unique views.', error);
  }
};

export const getUserPropertyData = async (req, res) => {
  try {
    const userId = req.params.user_id; 

    if (!userId) {
      return badRequestResponse(res, false, 'User ID is required.');
    }

    const userQuery = `SELECT id, fname, lname, email, mobile  FROM tbl_users WHERE id = ?`;
    const [userResult] = await pool.query(userQuery, [userId]);

    if (userResult.length === 0) {
      return successResponse(res, true, 'User not found.', {});
    }

    const user = userResult[0];

    const propertyQuery = `SELECT id AS property_id, property_title, description, rent_amount, city_name,
      property_type, status FROM tbl_property  WHERE user_id = ?`;

    const [propertyResult] = await pool.query(propertyQuery, [userId]);

    const interestedQuery = `SELECT pi.property_id, p.property_title, p.rent_amount, p.city_name
      FROM tbl_property_intrest pi JOIN tbl_property p ON JSON_CONTAINS(pi.property_id, JSON_ARRAY(p.id))
      WHERE pi.user_id = ?`;

    const [interestedResult] = await pool.query(interestedQuery, [userId]);

    const shortlistedQuery = `SELECT pw.property_id, p.property_title, p.rent_amount, p.city_name
      FROM tbl_property_shortlist pw JOIN tbl_property p ON pw.property_id = p.id WHERE pw.user_id = ?`;

    const [shortlistedResult] = await pool.query(shortlistedQuery, [userId]);

    const uniqueViewsQuery = `SELECT uv.property_id, p.property_title, p.rent_amount, p.city_name
      FROM tbl_unique_views uv JOIN tbl_property p ON uv.property_id = p.id WHERE uv.user_id = ?`;

    const [uniqueViewsResult] = await pool.query(uniqueViewsQuery, [userId]);

    const responseData = {
      user: {
        id: user.id,
        name: `${user.fname} ${user.lname}`,
        email: user.email,
        mobile: user.mobile,
      },
      properties: propertyResult,
      data: {
        interested: interestedResult,
        shortlisted: shortlistedResult,
        unique_views: uniqueViewsResult,
      },
    };

    return successResponse(res, true, 'Data retrieved successfully.', responseData);
  } catch (error) {
    console.error('Error in getUserPropertyData:', error);
    return badRequestResponse(res, false, 'Failed to retrieve data.', error);
  }
};


