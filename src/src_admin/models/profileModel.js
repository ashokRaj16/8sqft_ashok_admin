import axios from 'axios';
import axiosInstance from '../config/axiosInstance';
import { errorHandler } from '../utils/errorHandler';
import { constant } from '../utils/constant';

export const getUserProfile = async (token) => {
    try {
        const authRefreshToken = localStorage.getItem('eightsqftrefreshtoken');
        const authToken = localStorage.getItem('eightsqfttoken');
        const result = await axios.get(`${constant.SERVER_BASE_URL}/admin/profile`, {
            headers: {
                'x-api-key': 'A8SQFT7767',
                'x-refresh-key' : authRefreshToken,
                "Authorization": `Bearer ${authToken}`,
            }
        });
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
        return result.data;
    }
    catch (error) {
        console.log(error)
        throw new Error( errorHandler(error));
    }
}

