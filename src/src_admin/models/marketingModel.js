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

export const createMarketingWAOwner = async (data) => {
    try {
        const result = await axiosInstance.post('/admin/marketing/marketing_wa',
            data
        );
        return result;
    }
    catch (error) {
        throw new Error(errorHandler(error));
    }
}

export const createMarketingWAImageLead = async (data) => {
    try {
        const result = await axiosInstance.post('/admin/marketing/marketing_wa_image',
            data
        );
        return result;
    }
    catch (error) {
        throw new Error(errorHandler(error));
    }
}

export const createMarketingWAMarathiLead = async (data) => {
    try {
        const result = await axiosInstance.post('/admin/marketing/marketing_wa_marathi',
            data
        );
        console.log(result, "marathi log")
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
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error));
    }
}

export const getMarketingDetailsById = async (id) => {
    try {
        const result = await axiosInstance.get(`/admin/marketing/${id}` );
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error));
    }
}

export const updateMarketing = async (id, data) => {
    try {
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

export const getLeadUsersbyPropertyId = async (id) => {
    try {
        const result = await axiosInstance.get(`/admin/marketing/property/${id}` );
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error));
    }
}