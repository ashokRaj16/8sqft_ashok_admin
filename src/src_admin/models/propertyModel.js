import axios from 'axios';
import { constant } from '../utils/constant';
import axiosInstance from '../config/axiosInstance';
// update  
// const authToken = localStorage.getItem('eightsqfttoken');
// const HTTP_HEADERS = {
//     "x-api-key" :  constant.X_API_KEY,
//     "Authorization" : `Bearer ${authToken}`,
//     "Content-Type" : "application/json"
// }

const listProperties = async () => {
    try {
        
    }
    catch (error) {

    }
}

export const getPropertyList = async (offset = 1, limit = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '' ) => {
    try {
        // call to api to get listed user(async request.) & return data
        console.log(offset)
        const result = await axiosInstance.get(`/admin/property`, { 
            params : {
                page: offset,
                limit,
                sortColumn,
                sortOrder,
                searchFilter
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


export const deleteProperty = async (id) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.delete(`/admin/property/${id}`);
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
