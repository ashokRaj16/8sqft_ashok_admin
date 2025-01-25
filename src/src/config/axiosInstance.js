import axios from "axios";
import { constant } from "../utils/constant";

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
        config.headers = {
            ...config.headers,
            ...HTTP_HEADERS,
            "Authorization": `Bearer ${authToken}`,
        };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor (optional, for handling responses or errors globally)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
