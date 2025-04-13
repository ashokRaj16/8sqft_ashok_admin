import axiosInstance from '../config/axiosInstance';
import { errorHandler } from '../utils/errorHandler';

export const createPromotionProperty = async (data) => {
    try {
        const result = await axiosInstance.post('/admin/promotion',
            data
        );
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error));
    }
}

export const getPromotionProperty = async (offset = 0, limit = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '', categories ='' ) => {
    try {
        const result = await axiosInstance.get(`/admin/promotion`, { 
            params : {
                page: offset,
                limit,
                sortColumn,
                sortOrder,
                searchFilter,
                categories,
            },
        });
        console.log(result.data)
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error));
    }
}

export const getSponsaredById = async (id) => {
    try {
        const result = await axiosInstance.get(`/admin/promotion/${id}`);
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

export const updatePromotionProperty = async (id, data) => {
    try {
        console.log(data)
        const result = await axiosInstance.put(`/admin/promotion/${id}`, 
            data
        );
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}

export const deletePromotionPropertyById = async (id) => {
    try {
        
        const result = await axiosInstance.delete(`/admin/promotion/${id}`);
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}

export const getPromotionSequenceByCategories = async (categories = null) => {
    try {
        const result = await axiosInstance.get(`/admin/promotion/sequence`, { 
            params : {
                categories,
            },
        });
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error));
    }
}

export const updateMultipleSequenceInPromotion = async (data) => {
    try {
        const result = await axiosInstance.put(`/admin/promotion/bulk/update_sequence`, { 
            data,
        });
        
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error));
    }
}
