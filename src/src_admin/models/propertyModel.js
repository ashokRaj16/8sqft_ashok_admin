import axios from 'axios';
import { constant } from '../utils/constant';
import { errorHandler } from '../utils/errorHandler';
import axiosInstance from '../config/axiosInstance';

export const getPropertyList = async (offset = 1, limit = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '', stepTerm = '' ) => {
    try {
        console.log(offset)
        const result = await axiosInstance.get(`/admin/property`, { 
            params : {
                page: offset,
                limit,
                sortColumn,
                sortOrder,
                searchFilter,
                stepTerm
            },
        });
        return result.data;
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
            } else if (status === 400) {
                console.error("Bad Request:", data.message || "Invalid request.");
                   throw new Error(`Bad Request: ${data.message || "An error occurred."}`);
            } else if (status === 401) {
                console.error("Unauthorized:", data.message || "Authentication required.");
                throw new Error(`Unauthorized: ${data.message || "Please log in."}`);
            } else if (status === 403) {
                console.error("Forbidden:", data.message || "Access denied.");
                throw new Error(`Forbidden: ${data.message || "You do not have permission."}`);
            } else if (status === 404) {
                console.error("Not Found:", data.message || "Resource not found.");
                throw new Error(`Not Found: ${data.message || "The requested resource is missing."}`);
            } else if (status >= 500) {
                console.error("Server Error:", data.message || "Internal server error.");
                throw new Error(`Server Error: ${data.message || "Please try again later."}`);
            } else {
                console.error(`Unhandled Error (${status}):`, data.message || "Unknown error.");
                throw new Error(`Error (${status}): ${data.message || "Something went wrong."}`);
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

export const getPropertyById = async (id = null) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.get(`/admin/property/${id}`);
        return result.data;
    }
    catch (error) {
        // throw error;
        throw new Error(error)
    }
}

export const deleteProperty = async (id) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.delete(`/admin/property/${id}`);
        return result;
    }
    catch (error) {
        // throw error;
        throw new Error(error)
    }
}

export const updateStatusProperty = async (id, data) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.put(`/admin/property/${id}/status`, 
            data
        );
        return result;
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

export const sendPropertyMails = async (id, data) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.post(`/admin/property/${id}/send_mails`, 
            data
        );
        return result;
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

export const getIntrestedUsersByPropertyId = async (id = null) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.get(`/admin/property/${id}`);
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

export const getShortlistedUsersByPropertyId = async (id = null) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.get(`/admin/property/${id}`);
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

export const updatePropertyDetails = async (id, data) => {
    try {
        console.log(data)
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.put(`/admin/property/${id}/features`, 
            data
        );
        return result.data;
    }
    catch (error) {
        // throw error;
        throw new errorHandler(error)
    }
}

export const updatePropertyAmeneties = async (id, data) => {
    try {
        console.log(data)
        const result = await axiosInstance.put(`/admin/property/${id}/ameneties`, 
            data
        );
        return result.data;
    }
    catch (error) {
        // throw error;
        throw new errorHandler(error)
    }
}

export const createPropertyFandQ = async (id, data) => {
    try {
        console.log(data)
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.post(`/admin/property/${id}/fandq`, 
            data
        );
        return result.data;
    }
    catch (error) {
        // throw error;
        throw new errorHandler(error)
    }
}

export const updatePropertyFandQ = async (id, sid, data) => {
    try {
        console.log(data)
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.put(`/admin/property/${id}/fandq/${sid}`, 
            data
        );
        return result.data;
    }
    catch (error) {
        // throw error;
        throw new errorHandler(error)
    }
}

export const deletePropertyFandQ = async (id, sid) => {
    try {
        
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.delete(`/admin/property/${id}/fandq/${sid}`);
        return result.data;
    }
    catch (error) {
        // throw error;
        throw new errorHandler(error)
    }
}



export const createPropertyConfiguration = async (id, data) => {
    try {
        for (let [key, value] of data.entries()) {
            console.log(`Key: ${key}, Value:`, value);
        }
        
        const authToken = localStorage.getItem('eightsqfttoken');
        const result = await axios.post(`${constant.SERVER_BASE_URL}/admin/property/${id}/configuration`,
            data, {
                headers : {
                    "x-api-key": constant.X_API_KEY,
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${authToken}`,
                }
            }
        )

        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}

export const updatePropertyConfiguration = async (id, sid, data) => {
    try {
        console.log(data)
        const result = await axiosInstance.put(`/admin/property/${id}/configuration/${sid}`, 
            data
        );
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}

export const deletePropertyConfiguration = async (id, sid) => {
    try {
        console.log(id, sid)
        const result = await axiosInstance.delete(`/admin/property/${id}/configuration/${sid}`);
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}