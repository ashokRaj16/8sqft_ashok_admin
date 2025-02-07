import axiosInstance from '../config/axiosInstance';
import { errorHandler } from '../utils/errorHandler';

export const getShortlistUsersByProperty = async (id = null) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.get(`/admin/shortlist/shortlist_users/${id}`);
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}


export const getShortlistPropertyByUsers = async (id = null) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.get(`/admin/shortlist/shortlist_property/${id}`);
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}