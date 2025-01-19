import axios from 'axios';
import errorHandler from '../utils/errorHandler';

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
    "AUTH_TOKEN" : `A0Y749iKhAUVZLottsjocqRpyX6hbv9uS6l3MH1i3p6YQezc0ThWFJPnBwYiJKLWsw`,
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
        throw new Error( errorHandler(error) );
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
        throw new Error( errorHandler(error) );
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
        throw new Error( errorHandler(error) );
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
        throw new Error( errorHandler(error) );
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
        throw new Error( errorHandler(error) );
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
        throw new Error( errorHandler(error) );
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
        throw new Error( errorHandler(error) );
    }
}