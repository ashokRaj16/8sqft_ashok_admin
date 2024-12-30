import axios from 'axios';

// const SERVER_BASE_URL = 'https://api.8sqft.com/api/v1';
const SERVER_BASE_URL = 'https://www.kidzalaya.com/test/kidzalaya_api/';

// const HTTP_HEADERS = {
//     // "x-api-key" :  `${process.env.X_API_KEY}`,
//     // "Authorization" : `Bearer ${process.env.BEARER_TOKEN}`
//     "x-api-key" :  `${'process.env.X_API_KEY'}`,
//     "Authorization" : `Bearer ${'process.env.BEARER_TOKEN'}`,
//     "Content-Type" : "application/json"
// }

const HTTP_HEADERS = {
    // "x-api-key" :  `${process.env.X_API_KEY}`,
    // "Authorization" : `Bearer ${process.env.BEARER_TOKEN}`
    "AUTH_KEY" :  `ABCA2343214`,
    "AUTH_TOKEN" : `lXodlDLrz1iDsSiSBTDKnvkphGK+lLGnOyeZGxTOsacS2uviM0WpdqA4yALnAZAr0`,
    "Content-Type" : "application/json",
    "USER_ID" : 2
}

// ###setup loader.
/**
 * 
 * @param {*} offset : means page number
 * @param {*} per_page : per page count
 * @param {*} sortOrder : 'asc | desc
 * @param {*} sortColumn : sort column name
 * @param {*} searchFilter : searchBox value
 * @returns 
 */
export const getAdminUser = async (offset = 0, per_page = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '' ) => {
    try {
        // call to api to get listed user(async request.) & return data
        const result = await axios.get(`${SERVER_BASE_URL}/adminApi/book`, { 
            params : {
                offset,
                per_page,
                sortColumn,
                sortOrder,
                searchFilter
            },
            headers: HTTP_HEADERS
        });
        console.log(result.data);
        // const result = {
        //     users: [
        //         { id: 1, email: "Raj@gmail.com", fname: 'Raj', lname: "Kumar", role_name: 'SUPER ADMIN' },
        //         { id: 2, email: "Raj@gmail.com", fname: 'Ashok', lname: "Ambore", role_name: 'HEAD' },
        //         { id: 3, email: "Raj@gmail.com", fname: 'Deepak', lname: "Wagholi", role_name: 'HEAD' },
        //         { id: 4, email: "Raj@gmail.com", fname: 'Kuldeep', lname: "Jadhav", role_name: 'ADMIN'},
        //         { id: 1, email: "Raj@gmail.com", fname: 'Raj', lname: "Kumar", role_name: 'SUPER ADMIN' },
        //         { id: 2, email: "Raj@gmail.com", fname: 'Ashok', lname: "Ambore", role_name: 'HEAD' },
        //         { id: 3, email: "Raj@gmail.com", fname: 'Deepak', lname: "Wagholi", role_name: 'HEAD' },
        //         { id: 4, email: "Raj@gmail.com", fname: 'Kuldeep', lname: "Jadhav", role_name: 'ADMIN'}
        //     ],
        
        // offset: 5
        // per_page: "5"
        // total_count: 281
        // total_pages: 57
        // }
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

export const deleteAdminUser = async (id) => {
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

export const deleteMultipleAdminUsers = async (ids = []) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axios.delete(`${SERVER_BASE_URL}/admin-users`, { 
            data: ids,
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