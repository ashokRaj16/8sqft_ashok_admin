import axiosInstance from '../config/axiosInstance';
import { errorHandler } from '../utils/errorHandler';

export const createMarketing = async (data) => {
    try {
        const result = await axiosInstance.post('/admin/promotion',
            data
        );
        return result;
    }
    catch (error) {
        throw new Error(errorHandler(error));
    }
}

export const createMarketingTemp = async (data) => {
    try {
        const result = await axiosInstance.post('/admin/marketing/marketing_temp',
            data
        );
        return result;
    }
    catch (error) {
        throw new Error(errorHandler(error));
    }
}

export const getMarketing = async (offset = 0, limit = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '' ) => {
    try {
        const result = await axiosInstance.get(`/admin/marketing`, { 
            params : {
                page: offset,
                limit,
                sortColumn,
                sortOrder,
                searchFilter
            },
        });
        console.log(result.data)
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error));
    }
}

export const getMarketingDetailsById = async (id) => {
    try {
        const result = await axiosInstance.get(`/admin/marketing/${id}` );
        console.log(result.data)
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error));
    }
}

export const updateMarketing = async (id, data) => {
    try {
        console.log("data : ", data)
        const result = await axiosInstance.put(`/admin/marketing/${id}`, 
            data
        );
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}

export const deleteMarketingById = async (id) => {
    try {        
        const result = await axiosInstance.delete(`/admin/marketing/${id}`);
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}

export const deleteMarketingDetailsById = async (id, sid) => {
    try {        
        const result = await axiosInstance.delete(`/admin/marketing/${id}/list/${sid}`);
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}