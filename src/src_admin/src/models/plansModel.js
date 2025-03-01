import axiosInstance from '../config/axiosInstance';
import { errorHandler } from '../utils/errorHandler';

export const createSubscriptionPlan = async (data) => {
    try {
        const result = await axiosInstance.post('/admin/plans',
            data
        );
        return result;
    }
    catch (error) {
        throw new Error(errorHandler(error));
    }
}

export const getSubscriptionPlan = async (offset = 0, limit = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '' ) => {
    try {
        const result = await axiosInstance.get(`/admin/plans`, { 
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

export const getPlansById = async (id) => {
    try {
        const result = await axiosInstance.get(`/admin/plans/${id}`);
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}