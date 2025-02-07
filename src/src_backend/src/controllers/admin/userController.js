import { readRecordDb } from "../../models/commonModel.js";
import {
    getAllMemberListAdmin,
    getAllMemberCountAdmin,
    deleteMemberAdmin,
    createMemberUser,
    getMemberUsersById,
    updateUser
} from "../../models/memberModel.js";

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

        // console.log("Listing users")
        // const users = await UserModel.getAllUsers();
        // res.status(200).json(users);
    } catch (error) {
        return badRequestResponse(res, false, 'Error fetching users!', error);
    }
};


export const listUsersById = async (req, res) => {
    const userId = req.params.id;
    console.log(req.params);
    if (!userId) {
        return badRequestResponse(res, false, "Id required with request.");
    }
    try {
        const [user] = await getMemberUsersById(userId);
        console.log("User Data", user)
        return successWithDataResponse(res, true, 'User list successfully', user );
    } catch (error) {
        return badRequestResponse(res, false, 'Error getting user', error );
    }
};


// Add a new user
export const addMemberUser = async (req, res) => {
    console.log("body",req.body);
    try {
        const { fname, mname, lname, email, mobile, phone } = req.body;
        const userData = { 
            fname : fname || null, 
            mname: mname || null,
            lname : lname || null, 
            email : email || null, 
            mobile : mobile || null, 
            phone : phone || null }

            const whereClauses = 'email = ? OR mobile = ?'
            const userDetailsEmails = await readRecordDb('tbl_users', undefined, whereClauses, [email, mobile]);
            
            if(userDetailsEmails.length > 0) {
                return badRequestResponse(res, false, 'Email or mobile address already in use.');
            }

        const result = await createMemberUser(userData);
        // const result = {}

        return successWithDataResponse(res, false, 'User added successfully.', result);
    } catch (error) {
        return badRequestResponse(res, false, 'Error adding user.', error);
    }
};


// Edit a user
export const editUser = async (req, res) => {
    const userId = req.params.id;
    const { fname, lname, email, mobile, phone } = req.body;
    try {
        const updatedUser = await updateUser(userId, { fname, lname, email, mobile, phone });
        res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};


// Delete a user
export const deleteUser = async (req, res) => {
    const userId = req.params.id;
    console.log(userId);
    try {
        const result = await deleteMemberAdmin(userId);

        return successWithDataResponse(res, true, 'User deleted successfully', result);
    } catch (error) {
        return badRequestResponse(res, false, 'Error deleting user', error );
    }
};
