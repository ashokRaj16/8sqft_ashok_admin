import { readRecordDb } from "../../models/commonModel.js";
import {
    getAllMemberListAdmin,
    getAllMemberCountAdmin,
    deleteMemberAdmin,
    createMemberUser,
    getMemberUsersById,
    updateUser,
    updateMemberAdmin
} from "../../models/memberModel.js";
import  { 
    getAllPropertyListAdminByMemberId,
    getAllPropertyCountAdminByMemberId
} from "../../models/propertyModels.js";

import { badRequestResponse, successWithDataResponse, successResponse } from "../../utils/response.js";
import validator from 'validator';

// List all members
export const listMembers = async (req, res) => {
    try {
        let data = {};
        const { page, limit } = req.query;

        const pageCount = parseInt(page) || 1;
        const limitCount = parseInt(limit) || 100;
        const offset = (page - 1) * limit;

        const filters = req.query;
        let whereClauses = [];

        if (filters?.searchFilter && filters?.searchFilter.trim()) {
            const newSearchfilter = `
                    tu.email like '%${validator.escape(filters.searchFilter.trim())}%' OR
                    tu.fname like '%${validator.escape(filters.searchFilter.trim())}%' OR 
                    tu.lname like '%${validator.escape(filters.searchFilter.trim())}%' OR 
                    tu.email like '%${validator.escape(filters.searchFilter.trim())}%' OR
                    tu.mobile like '%${validator.escape(filters.searchFilter.trim())}%' `
            whereClauses.push(newSearchfilter);
        }

        whereClauses.push(` tu.is_deleted = '0' `);

        let baseQuery = '';
        if (whereClauses.length > 0) {
            baseQuery = ` WHERE ` + whereClauses.join(' AND ');
        }
        
        const allowedColumns = ['id', 'fname', 'email', 'mobile', "is_verified"];
        const allowedOrders = ['ASC', 'DESC'];

        const sortColumn = allowedColumns.includes(filters.sortColumn) ? filters.sortColumn : 'id';
        const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase()) ? filters.sortOrder?.toUpperCase() : 'DESC';

        const usersResult = await getAllMemberListAdmin(baseQuery, sortColumn, sortOrder, pageCount, limitCount);
        const usersTotalCount = await getAllMemberCountAdmin(baseQuery);
        
        data['users'] = usersResult;
        data['totalCounts'] = usersTotalCount;
        const totalPages = Math.ceil(usersTotalCount / limit);
        const startIndex = offset + 1;
        const endIndex = Math.min(offset + limit, usersTotalCount);
        data['totalPages'] = totalPages;
        data['startIndex'] = startIndex;
        data['endIndex'] = endIndex;
        
        return successWithDataResponse(res, true, "User list.", data);

    } catch (error) {
        return badRequestResponse(res, false, 'Error fetching users!', error);
    }
};


export const listMembersById = async (req, res) => {
    const userId = req.params.id;
   
    if (!userId) {
        return badRequestResponse(res, false, "Id required with request.");
    }
    try {
        const [user] = await getMemberUsersById(userId);
        if(user.length === 0) {
            return badRequestResponse(res, false, 'User not found or user id wrong.')
        }
        return successWithDataResponse(res, true, 'User list successfully', user );
    } catch (error) {
        return badRequestResponse(res, false, 'Error getting user', error );
    }
};


// Add a new user 
export const addMemberUser = async (req, res) => {

    try {
        const { fname, mname, lname, email, mobile, phone } = req.body;
        const userData = { 
            fname : fname || null, 
            mname: mname || null,
            lname : lname || null, 
            email : email || null, 
            mobile : mobile || null, 
            phone : phone || null 
        }

        const whereClauses = 'email = ? OR mobile = ?'
        const userDetailsEmails = await readRecordDb('tbl_users', undefined, whereClauses, [email, mobile]);
        
        if(userDetailsEmails.length > 0) {
            return badRequestResponse(res, false, 'Email or mobile address already in use.');
        }

        const result = await createMemberUser(userData);

        return successWithDataResponse(res, false, 'User added successfully.', result);
    } catch (error) {
        return badRequestResponse(res, false, 'Error adding user.', error);
    }
};


// Edit a user // check if is working
export const editUser = async (req, res) => {
    const userId = req.params.id;
    const { fname, lname, email, mobile, phone } = req.body;
    try {
        const updatedUser = await updateUser(userId, { fname, lname, email, mobile, phone });
        res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating member', error });
    }
};

export const editMemeberAdmin = async (req, res) => {
    const { id } = req.params;
    const { 
        fname, 
        mname,
        lname, 
        email, 
        mobile, 
        address_1,
        phone,
        profile_picture_url,
        city_id,
        city_name,
        state_id,
        state_name,
        instagram_url,
        facebook_url,
        youtube_url,
        whatsapp_notification,
        status
      } = req.body;
    try {
        const data = {
            fname : fname || null, 
            mname : mname || null,
            lname : lname || null, 
            email : email || null, 
            mobile : mobile || null, 
            phone : phone || null,
            address_1 : address_1 || null,
            profile_picture_url : profile_picture_url || null,
            city_id : city_id || null,
            city_name : city_name || null,
            state_id : state_id || null,
            state_name : state_name || null,
            instagram_url : instagram_url || null,
            facebook_url : facebook_url || null,
            youtube_url : youtube_url || null,
            whatsapp_notification : whatsapp_notification || null,
            status : status || null
        }
        const whereClauses = '( email = ? OR mobile = ?) && id <> ?'
        const userDetails = await readRecordDb('tbl_users', undefined, whereClauses, [data.email, data.mobile, id]);
        if( userDetails.length > 0 ) {
            return badRequestResponse(res, false, 'Email or mobile address already in use with other account.');
        }
        const result = await updateMemberAdmin(id, data)
        if(result.affectedRows === 0) {
            return badRequestResponse(res, false, "Unable to update user.")
        }
        
        return successWithDataResponse(res, true, 'User updated successfully', result);
    } catch (error) {
        return badRequestResponse(res, false, "Error updating member." , error.message)
    }
};

// Delete a user
export const removeMemberAdmin = async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await deleteMemberAdmin(userId);

        return successWithDataResponse(res, true, 'User deleted successfully', result);
    } catch (error) {
        return badRequestResponse(res, false, 'Error deleting user', error );
    }
};


// properties by user section.

// List all properties members
export const listPropertiesByMemberId = async (req, res) => {
    try {
        let data = {};
        const { page, limit } = req.query;
        const { id } = req.params;

        const pageCount = parseInt(page) || 1;
        const limitCount = parseInt(limit) || 5;
        const offset = (pageCount - 1) * limitCount;

        const filters = req.query;
        let whereClauses = [];

        whereClauses.push(` tp.is_deleted = '0' `);
        whereClauses.push(` tp.user_id = '${id}' `);

        let baseQuery = '';
        if (whereClauses.length > 0) {
            baseQuery = ` WHERE ` + whereClauses.join(' AND ');
        }
        
        const allowedColumns = ['id', 'property_title', 'city_name', 'property_type', "user_type"];
        const allowedOrders = ['ASC', 'DESC'];
      
        const sortColumn = allowedColumns.includes(filters.sortColumn) ? filters.sortColumn : 'id';
        const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase()) ? filters.sortOrder?.toUpperCase() : 'DESC';

        const propertiesResult = await getAllPropertyListAdminByMemberId(baseQuery, sortColumn, sortOrder, pageCount, limitCount);
        const totalCount = await getAllPropertyCountAdminByMemberId(baseQuery);

        data['properties'] = propertiesResult;
        data['totalCounts'] = totalCount;
        const totalPages = Math.ceil(totalCount / limitCount);
        const startIndex = offset + 1;
        const endIndex = Math.min(offset + limitCount, totalCount);
        data['totalPages'] = totalPages;
        data['startIndex'] = startIndex;
        data['endIndex'] = endIndex;
        
        return successWithDataResponse(res, true, "properties list.", data);

    } catch (error) {
        return badRequestResponse(res, false, 'Error fetching properties!', error);
    }
};