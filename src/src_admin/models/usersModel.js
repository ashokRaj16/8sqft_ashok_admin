import axiosInstance from '../config/axiosInstance';
import { constant } from '../utils/constant';
import { errorHandler } from '../utils/errorHandler';

// setup loader. //done
export const getAdminUser = async (offset = 0, limit = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '' ) => {
    try {
        const result = await axiosInstance.get(`admin/users`, { 
            params : {
                page: offset,
                limit,
                sortColumn,
                sortOrder,
                searchFilter
            }
        });
        console.log(result.data)
        return result.data;
    }
    catch (error) {
        throw new Error( errorHandler(error) );
    }
}

export const downloadExcelAdminUser = async (searchFilter = '') => {
    try {
        const result = await axiosInstance.get(`/export-admin`, { 
            params: { 
                searchFilter
            },
            responseType : 'blob',
        });

        // need exceljs package
        const blob = new Blob(data.body, { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });

        const url = window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.download = "User-Excel.xlsx";
        anchor.href = url;
        anchor.click();

        // return result;
    }
    catch (error) {
        // throw error;
       throw new Error(errorHandler(error));
    }
}

export const deleteAdminUser = async (id) => {
    try {
        const result = await axiosInstance.delete(`admin/users/${id}`);
        console.log(result)
        return result;
    }
    catch (error) {
        throw new Error( errorHandler(error));
    }
}

export const getAdminUserById = async (id) => {
    try {
        const result = await axiosInstance.get(`/admin/users/${id}`);
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

export const createAdminUser = async (data) => {
    try {
        const result = await axiosInstance.post(`/admin/users`, { 
            ...data
        });
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}

export const updateAdminUser = async (id, data) => {
    try {
        console.log(data, 'modallll')
        const result = await axiosInstance.put(`/admin/users/${id}`, { 
            ...data
        });
        return result.data;
    }
    catch (error) {
        console.log(error)
        throw new Error(errorHandler(error))
    }
}

export const getAdminRoles = async () => {
    try {
        const result = await axiosInstance.get(`/admin/admin_roles/`);
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}

/**
 * GET :Member User
 * @param {*} offset 
 * @param {*} per_page 
 * @param {*} sortOrder 
 * @param {*} sortColumn 
 * @param {*} searchFilter 
 * @returns 
 */
export const getMemberUser = async (offset = 0, limit = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '' ) => {
    try {
        const result = await axiosInstance.get(`/admin/members`, { 
            params : {
                page: offset,
                limit,
                sortColumn,
                sortOrder,
                searchFilter
            }
        });
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}

export const getMemberUserById = async (id) => {
    try {
        const result = await axiosInstance.get(`admin/members/${id}`);
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}

export const createMemberUser = async (data) => {
    try {
        const result = await axiosInstance.post(`/admin/members`, { 
            ...data
        });

        return result.data;
    }
    catch (error) {
        console.log(error)
        throw new Error(errorHandler(error))
    }
}

export const updateMemberUser = async (id, data) => {
    try {
        const result = await axiosInstance.put(`/admin/members/${id}`, { 
            ...data
        });

        return result.data;
    }
    catch (error) {
        console.log(error)
        throw new Error(errorHandler(error))
    }
}

export const deleteMemberUser = async (id) => {
    try {
        const result = await axiosInstance.delete(`admin/members/${id}`);
        return result;
    }
    catch (error) {
        throw new Error( errorHandler(error));
    }
}

export const getListedPropertyByMember = async (id = null, data) => {
    try {
        const params = new URLSearchParams({
            limit: data.limit,
            page: data.page
        })
        const result = await axiosInstance.get(`/admin/members/${id}/properties/`, {
            params
        });
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}