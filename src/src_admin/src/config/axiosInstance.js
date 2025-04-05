import axios from "axios";
import { constant } from "../utils/constant";
import store  from '../../src/store';

import { logoutUser } from "../store/loginReducer";

// const authToken = localStorage.getItem('eightsqfttoken');
const HTTP_HEADERS = {
    "x-api-key": constant.X_API_KEY,
    "Content-Type": "application/json"
};

const axiosInstance = axios.create({
    baseURL: constant.SERVER_BASE_URL,
    timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem('eightsqfttoken');
        const authRefreshToken = localStorage.getItem('eightsqftrefreshtoken');
        if (!authToken) {
            console.warn("No auth token found! API may reject the request.");
        }
        
        config.headers = {
            ...config.headers,
            ...HTTP_HEADERS,
            'x-refresh-key' : authRefreshToken,
            "Authorization": `Bearer ${authToken}`,
        };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ###Add retry

// // Add a response interceptor.
axiosInstance.interceptors.response.use(
    (response) => {
        if (response.data && response.data.data.newAccessToken) {
            const newAccessToken = response.data.data.newAccessToken;

            localStorage.setItem('eightsqfttoken', newAccessToken);
            const originalRequest = response.config;
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

            console.log("New access token saved.");
            return axiosInstance(originalRequest);            
        }

        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            let response = error.response.data;
            if ( response.error.name === 'TokenExpiredError' && response.error.message === 'jwt expired') {
                localStorage.removeItem('eightsqfttoken');
                localStorage.removeItem('eightsqftrefreshtoken');
                localStorage.removeItem('userInfo');
    
                // store.dispatch(logoutUser());
                window.location.href = '/login';
                return Promise.reject(new Error('JWT expired, redirected to login.'));
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
