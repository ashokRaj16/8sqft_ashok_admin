import axiosInstance from '../config/axiosInstance';
import { errorHandler } from '../utils/errorHandler';

export const getIntrestedUsersByProperty = async (id = null) => {
    try {
        const result = await axiosInstance.get(`/admin/intrested/intrest_users/${id}`);
        // console.log("models: ",id, result);
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

export const getIntrestedPropertyByUsers = async (id =null) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.get(`/admin/intrested/intrest_property/${id}`);
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}
