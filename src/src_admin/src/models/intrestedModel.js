import axiosInstance from '../config/axiosInstance';
import { errorHandler } from '../utils/errorHandler';

export const getIntrestedUsersByProperty = async (id = null, data) => {
    try {
        const params = new URLSearchParams({
            limit: data?.limit || 10,
            page: data?.page || 1
        })
        const result = await axiosInstance.get(`/admin/contacted/contact_users/${id}`, {
            params
        });
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

export const getIntrestedPropertyByUsers = async (id = null, data) => {
    try {
        console.log(data)
        const params = new URLSearchParams({
            limit: data?.limit || 10,
            page: data?.page || 1
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

