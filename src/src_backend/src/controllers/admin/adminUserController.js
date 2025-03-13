import _ from 'lodash';
import pool from '../../config/db.js';
import validator from 'validator';

import { getAllUserListAdmin, getAllUserCountAdmin, createAdminUser, updateAdminUserAdmin, getUserAdminById } from '../../models/userModel.js';
import { badRequestResponse, successWithDataResponse, successResponse } from "../../utils/response.js";
import { readRecordDb } from '../../models/commonModel.js';
import { sanitizedNumber, sanitizedField, hashPassword } from '../../utils/commonHelper.js';
import { createAdminValidator, updateAdminValidator } from '../validators/userValiadtor.js';

export const listUsers = async (req, res) => {
    try {
        let data = {};
        const { page, limit } = req.query;

        const pageCount = parseInt(page) || 1;
        const limitCount = parseInt(limit) || 100;
        const offset = (page - 1) * limit;

        const filters = req.query;
        let whereClauses = [];

        if (filters?.searchFilter.trim()) {
            const newSearchfilter = `tu.email like '%${validator.escape(filters.searchFilter)}%'
                    OR
                    tu.lname like '%${validator.escape(filters.searchFilter.trim())}%' OR 
                    tu.email like '%${validator.escape(filters.searchFilter.trim())}%' OR
                    tu.mobile like '%${validator.escape(filters.searchFilter.trim())}%' `
            whereClauses.push(newSearchfilter);
        }

        whereClauses.push(` tu.is_deleted = '0' `);
        whereClauses.push(` tu.id <> ${req.userId} `);
        whereClauses.push(` tu.id <> '1' `);

        // ###check current user & super_admin not in list

        let baseQuery = '';
        if (whereClauses.length > 0) {
            baseQuery = ` WHERE ` + whereClauses.join(' AND ');
        }
        
        const allowedColumns = ['id', 'fname', 'email', 'mobile', "role_id"];
        const allowedOrders = ['ASC', 'DESC'];

        const sortColumn = allowedColumns.includes(filters.sortColumn) ? filters.sortColumn : 'id';
        const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase()) ? filters.sortOrder?.toUpperCase() : 'ASC';

        // const totalQuery = `SELECT COUNT(*) as total FROM tbl_users_admin WHERE is_deleted = '0' ${searchQuery}`;
        // const [[{ total }]] = await pool.execute(totalQuery, searchParams);

        // const userQuery = `SELECT * FROM tbl_users_admin WHERE is_deleted = '0' ${searchQuery}
        //     ORDER BY ${sanitizedSortColumn} ${sanitizedSortOrder} LIMIT ? OFFSET ? `;
            
        // const [users] = await pool.execute(userQuery, [...searchParams, parsedLimit, parsedOffset]);

        const usersResult = await getAllUserListAdmin(baseQuery, sortColumn, sortOrder, pageCount, limitCount);
        const usersTotalCount = await getAllUserCountAdmin(baseQuery);
                
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
        return badRequestResponse(res, false, "Error fetching users.", error);
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {

        console.log(id,"ssss")
        const result = await getUserAdminById(id)
        // const [user] = await pool.execute("SELECT * FROM tbl_users_admin WHERE id = ? AND is_deleted = '0'", [id]);
        if ( result.length === 0) {
            return badRequestResponse(res, false, 'Error fetching user.', error);
        }
        const data = result[0]
        
        return successResponse(res, true, 'User details.', data)
    } catch (error) {
        return badRequestResponse(res, false, 'Error fetching user.', error);
    }
};

export const addAdminUser = async (req, res) => {
    try {
        const { fname, mname, lname, email, mobile, phone, password, role_id } = req.body;
        const validationErrors = createAdminValidator(req.body)
        if(validationErrors.length > 0) {
            return badRequestResponse(res, false, validationErrors)
        }

        const userData = { 
            fname : fname ? sanitizedField(fname, true, 'CAPITALIZE') : null, 
            mname: mname ? sanitizedField(mname, true, 'CAPITALIZE') : null,
            lname : lname ? sanitizedField(lname, true, 'CAPITALIZE') : null, 
            email : email ? sanitizedField(email, true, 'LOWERCASE') : null, 
            mobile : mobile && sanitizedNumber(mobile,  { min: 10 }) || null, 
            password_hash: password && await hashPassword(password) || null,
            phone : phone && sanitizedNumber(phone) || null,
            role_id : role_id || null,
            added_by : req.userId || null }
            
            // console.log(userData)

            const whereClauses = 'email = ? OR mobile = ?'
            const userDetailsEmails = await readRecordDb('tbl_users_admin', undefined, whereClauses, [userData.email, userData.mobile]);
            
            if(userDetailsEmails.length > 0) {
                return badRequestResponse(res, false, 'Email or mobile address already in use.');
            }
            const result = await createAdminUser(userData);
        return successWithDataResponse(res, false, 'User added successfully.', result);
    } catch (error) {
        console.log(error)
        return badRequestResponse(res, false, 'Error adding user', error);
    }
};

export const updateAdminUser = async (req, res) => {
    const { id } = req.params;
    
    console.log(req.body, "boddddyyyy");
    if(!id) {
        return badRequestResponse(res, false, "Id required with request.")
    }
    
    const {
        fname, mname, lname, email, mobile, phone, proof_number, proof_type,
        state_id, city_id, pincode, address_1, role_id, password, status
    } = req.body;

    try {
        const data = {
            fname : fname || null, 
            mname : mname || null, 
            lname: lname || null, 
            email :email || null, 
            mobile : mobile || null, 
            phone : phone || null, 
            proof_number : proof_number || null, 
            proof_type : proof_type ||null,
            state_id : state_id || null, 
            city_id : city_id || null, 
            pincode: pincode || null, 
            address : address_1 || null, 
            role_id : role_id || null,
            password_hash :  password || null,
            status: status || null
        }

        const whereClauses = '( email = ? OR mobile = ?) && id <> ?'
        const userDetails = await readRecordDb('tbl_users_admin', undefined, whereClauses, [data.email, data.mobile, id]);
        if( userDetails.length > 0 ) {
            return badRequestResponse(res, false, 'Email or mobile address already in use with other account.');
        }
        
        const result = await updateAdminUserAdmin(id, data) 
       
        if (result.affectedRows === 0) {
            return badRequestResponse(res, false, 'User not found or not updatedr.', error);
        }
        return successResponse(res, true, 'User updated successfully' )
    } catch (error) {
        return badRequestResponse(res, false, 'Error updating user.', error);
    }
};

export const changeUserStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const [result] = await pool.execute(
            "UPDATE tbl_users_admin SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_deleted = '0'",
            [status, id]
        );

        if (result.affectedRows === 0) {
            return badRequestResponse(res, false, 'User not found or status not updated.', error);
        }
        return successResponse(res, true, 'User status updated successfully')
    } catch (error) {
        return badRequestResponse(res, false, 'Error updating user status.', error);
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.execute(
            "UPDATE tbl_users_admin SET is_deleted = '1', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return badRequestResponse(res, false, 'User not found or not deleted.', error);
        }
        return successResponse(res, true, 'User deleted successfully')
    } catch (error) {
        return badRequestResponse(res, false, 'Error deleting user.', error);
    }
};
