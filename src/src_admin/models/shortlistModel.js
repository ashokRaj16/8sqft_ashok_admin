import { date } from 'yup';
import axiosInstance from '../config/axiosInstance';
import { errorHandler } from '../utils/errorHandler';

export const getShortlistUsersByProperty = async (id = null) => {
    try {
        const result = await axiosInstance.get(`/admin/shortlist/shortlist_users/${id}`);
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

export const getShortlistPropertyByUsers = async (id = null, data) => {
    try {
        const params = new URLSearchParams({
            limit: data.limit,
            page: data.page
        })
        const result = await axiosInstance.get(`/admin/shortlist/shortlist_property/${id}`, {
            params
        });
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}