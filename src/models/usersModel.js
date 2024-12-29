import axios from 'axios';

const SERVER_BASE_URL = 'https://api.8sqft.com/api/v1';
const HTTP_HEADERS = {
    // "x-api-key" :  `${process.env.X_API_KEY}`,
    // "Authorization" : `Bearer ${process.env.BEARER_TOKEN}`
    "x-api-key" :  `${'process.env.X_API_KEY'}`,
    "Authorization" : `Bearer ${'process.env.BEARER_TOKEN'}`,
    "Content-Type" : "application/json"
}

// ###setup loader.

export const getAdminUser = async (offset = 0, per_page = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '' ) => {
    try {
        // call to api to get listed user(async request.) & return data
        const result = await axios.get(`${SERVER_BASE_URL}/admin-users`, { 
            params : {
                offset,
                per_page,
                sortColumn,
                sortOrder,
                searchFilter
            },
            headers: HTTP_HEADERS
        });
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

export const downloadExcelAdminUser = async (searchFilter = '') => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axios.get(`${SERVER_BASE_URL}/export-admin`, { 
            params: { 
                searchFilter
            },
            responseType : 'blob',
            headers: HTTP_HEADERS
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

export const deleteAdminUser = async () => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axios.delete(`${SERVER_BASE_URL}/admin-users/${id}`, { 
            headers: HTTP_HEADERS
        });
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

export const getAdminUserById = async (id) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axios.get(`${SERVER_BASE_URL}/admin-users/${id}`, { 
            headers: HTTP_HEADERS
        });
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

export const createAdminUser = async (data) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axios.post(`${SERVER_BASE_URL}/admin-users`, { 
            data: JSON.stringify(data),
            headers: HTTP_HEADERS
        });
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

export const getAdminRoles = async () => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axios.get(`${SERVER_BASE_URL}/admin-roles/`, { 
            headers: HTTP_HEADERS
        });
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