import axios from 'axios';
import { constant } from '../utils/constant';
import { errorHandler } from '../utils/errorHandler';
import axiosInstance from '../config/axiosInstance';

export const getPropertyList = async (offset = 1, limit = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '', stepTerm = '', activeStep = '' ) => {
    try {
        console.log(offset)
        const result = await axiosInstance.get(`/admin/property`, { 
            params : {
                page: offset,
                limit,
                sortColumn,
                sortOrder,
                searchFilter,
                stepTerm,
                activeStep
            },
        });
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}

export const getPropertyById = async (id = null) => {
    try {
        const result = await axiosInstance.get(`/admin/property/${id}`);
        return result.data;
    }
    catch (error) {
        throw new Error(error)
    }
}

export const deleteProperty = async (id) => {
    try {
        const result = await axiosInstance.delete(`/admin/property/${id}`);
        return result;
    }
    catch (error) {
        throw new Error(error)
    }
}

export const updateStatusProperty = async (id, data) => {
    try {
        const result = await axiosInstance.put(`/admin/property/${id}/status`, 
            data
        );
        return result;
    }
    catch (error) {
       throw new errorHandler(error)
    }
}

export const sendPropertyMails = async (id, data) => {
    try {
        const result = await axiosInstance.post(`/admin/property/${id}/send_mails`, 
            data
        );
        return result;
    }
    catch (error) {
        throw new errorHandler(error)        
    }
}

export const getIntrestedUsersByPropertyId = async (id = null) => {
    try {
        const result = await axiosInstance.get(`/admin/property/${id}`);
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

export const getShortlistedUsersByPropertyId = async (id = null) => {
    try {
        const result = await axiosInstance.get(`/admin/property/${id}`);
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

export const updatePropertyDetails = async (id, data) => {
    try {        
        const result = await axiosInstance.put(`/admin/property/${id}/features`, 
            data
        );
        return result.data;
    }
    catch (error) {
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
        throw new errorHandler(error)
    }
}

// F&q model
export const createPropertyFandQ = async (id, data) => {
    try {
        const result = await axiosInstance.post(`/admin/property/${id}/fandq`, 
            data
        );
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}

export const updatePropertyFandQ = async (id, sid, data) => {
    try {
        const result = await axiosInstance.put(`/admin/property/${id}/fandq/${sid}`, 
            data
        );
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}

export const deletePropertyFandQ = async (id, sid) => {
    try {
        const result = await axiosInstance.delete(`/admin/property/${id}/fandq/${sid}`);
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}


// Nearby model
export const createPropertyNearby = async (id, data) => {
    try {
        const result = await axiosInstance.post(`/admin/property/${id}/nearby`, 
            data
        );
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}

export const updatePropertyNearby = async (id, sid, data) => {
    try {
        const result = await axiosInstance.put(`/admin/property/${id}/nearby/${sid}`, 
            data
        );
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}

export const deletePropertyNearby = async (id, sid) => {
    try {        
        const result = await axiosInstance.delete(`/admin/property/${id}/nearby/${sid}`);
        return result.data;
    }
    catch (error) {
        
        throw new errorHandler(error)
    }
}

export const getPropertyNearbyAllCategory = async (id) => {
    try {
        const result = await axiosInstance.get(`/admin/property/${id}/nearby_categories`);
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

// Config model
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
        const result = await axiosInstance.delete(`/admin/property/${id}/configuration/${sid}`);
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}

// Image model
export const createPropertyImage = async (id, data) => {
    try {
        for (let [key, value] of data.entries()) {
            console.log(`Key: ${key}, Value:`, value);
        }
        
        const authToken = localStorage.getItem('eightsqfttoken');
        const result = await axios.post(`${constant.SERVER_BASE_URL}/admin/property/${id}/image`,
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

export const updatePropertyImage = async (id, sid, data) => {
    try {
        const result = await axiosInstance.put(`/admin/property/${id}/image/${sid}`, 
            data
        );
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}

export const deletePropertyImage = async (id, sid) => {
    try {
        const result = await axiosInstance.delete(`/admin/property/${id}/image/${sid}`);
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}


// Search Property
// export const getPropertyListByName = async (offset = 1, limit = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '', stepTerm = '' ) => {
//     try {
//         console.log(stepTerm)
//         const result = await axiosInstance.get(`/admin/property`, { 
//             params : {
//                 page: offset,
//                 limit,
//                 sortColumn,
//                 sortOrder,
//                 searchFilter,
//                 stepTerm
//             },
//         });
//         return result.data;
//     }
//     catch (error) {
//         throw new errorHandler(error)
//     }
// }