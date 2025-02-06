import axios from 'axios';
import axiosInstance from '../config/axiosInstance';
import { errorHandler } from '../utils/errorHandler';
import { constant } from '../utils/constant';

export const getUserProfile = async (token) => {
    try {
        const result = await axios.get(`${constant.SERVER_BASE_URL}/admin/profile`, {
            headers: {
                'x-api-key': 'A8SQFT7767',
                'Authorization' : `Bearer ${token}`
            }
        });
        // console.log(result);
        return result;
    }
    catch (error) {
        throw new Error( errorHandler(error));
    }
}

export const updateUserProfile = async (data) => {
    try {
        const result = await axiosInstance.put(`/admin/profile`,
            data
        );
        // console.log(result.data);
        return result.data;
    }
    catch (error) {
        throw new Error( errorHandler(error));
    }
}

export const updateUserPassword = async (data) => {
    try {
        const result = await axiosInstance.put(`/admin/password`,
            data
        );
        console.log(result.data);
        return result.data;
    }
    catch (error) {
        console.log(error)
        throw new Error( errorHandler(error));
    }
}

