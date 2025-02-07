import axiosInstance from '../config/axiosInstance';
import { constant } from '../utils/constant';
import { errorHandler } from '../utils/errorHandler';

// setup loader. //done
export const getAdminUser = async (offset = 0, limit = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '' ) => {
    try {
        // call to api to get listed user(async request.) & return data
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
        // throw error;
        throw new Error( errorHandler(error) );
    }
}

export const downloadExcelAdminUser = async (searchFilter = '') => {
    try {
        // call to api to get listed single user(async request.) & return data
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
        if (error.response) {
            const { status, data } = error.response;

            if (status === 400 && data.status === false && Array.isArray(data.error)) {
                // Handle validation errors
                const validationErrors = data.error
                    .map(err => `${err.field}: ${err.message}`)
                    .join("; ");
                console.error("Validation Errors:", validationErrors);
                throw new Error(`Validation Error: ${validationErrors}`);
            } else if (status === 400 || status === 401 || status === 403 || status === 404) {
                console.error("Bad Request:", data.message || "Invalid request.");
                throw new Error(`Bad Request: ${data.message || "An error occurred."}`);
            }
        } else if (error.request) {
            console.error("Network Error:", error.request);
            throw new Error("Network Error: Unable to reach the server. Please check your connection.");
        } else {
            console.error("Error:", error.message);
            throw new Error(`Unexpected Error: ${error.message}`);
        }
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
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.get(`/admin/users/${id}`);
        // console.log("models:::: ",result)
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

export const createAdminUser = async (data) => {
    try {
        // call to api to get listed single user(async request.) & return data
        console.log("Sending data to API:", data); 
        const result = await axiosInstance.post(`/admin/users`, { 
            ...data
        });
        return result.data;
    }
    catch (error) {
        // throw error;
        throw new Error(errorHandler(error))
    }
}

export const getAdminRoles = async () => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.get(`/admin/admin_roles/`);
        return result.data;
    }
    catch (error) {
        // throw error;
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
        console.log(result)
        return result.data;
    }
    catch (error) {
        // throw error;
        throw new Error(errorHandler(error))
    }
}

export const getMemberUserById = async (id) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.get(`admin/members/${id}`);
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}

export const createMemberUser = async (data) => {
    try {
        // call to api to get listed single user(async request.) & return data
        console.log("Sending data to API:", data); 
        const result = await axiosInstance.post(`/admin/members`, { 
            ...data
        });
        console.log(result)
        return result.data;
    }
    catch (error) {
        // throw error;
        console.log(error)
        throw new Error(errorHandler(error))
    }
}

export const deleteMemberUser = async (id) => {
    try {
        const result = await axiosInstance.delete(`admin/members/${id}`);
        console.log(result)
        return result;
    }
    catch (error) {
        throw new Error( errorHandler(error));
    }
}