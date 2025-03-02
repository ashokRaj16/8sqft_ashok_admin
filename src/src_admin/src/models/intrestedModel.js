import axiosInstance from '../config/axiosInstance';
import { errorHandler } from '../utils/errorHandler';

export const getIntrestedUsersByProperty = async (id = null, params) => {
    try {
        const { limit, page} = params;
        const result = await axiosInstance.get(`/admin/contacted/contact_users/${id}`);
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

export const getIntrestedPropertyByUsers = async (id = null, data) => {
    try {
        console.log(data)
        // const { limit = 10, page = 0 } = params;
        const params = new URLSearchParams({
            limit: data.limit,
            page: data.page
        })
        const result = await axiosInstance.get(`/admin/contacted/contact_property/${id}`, {
            params
        });
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

