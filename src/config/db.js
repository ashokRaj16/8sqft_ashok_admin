import axios from "axios";


const token = localStorage.getItem('authToken');

export const axiosInstance = axios.create({
    baseURL: 'https://api.test.com',
    headers: {
        'x-api-key' : 'A8SQFT7767',
    }
})


// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Dynamically fetch the token
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);