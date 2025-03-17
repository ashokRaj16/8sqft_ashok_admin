import axiosInstance from '../config/axiosInstance';
import { errorHandler } from '../utils/errorHandler';

export const createSubscriptionPlan = async (data) => {
    try {
        const result = await axiosInstance.post('/admin/subscriptions',
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
        const result = await axiosInstance.get(`/admin/subscriptions`, { 
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
