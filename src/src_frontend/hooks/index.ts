import axiosOriginal from "axios";
import axiosRetry from "axios-retry";


const axios = axiosOriginal.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.8sqft.com",
  timeout: 60000,
});

// Default token for the x-api-token header
const accesskey = "A8SQFT7767"; // Replace with your actual static token

// Add request interceptor to include the x-api-token header
axios.interceptors.request.use(
  (config) => {
    config.headers["x-api-key"] = accesskey;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Configure axios-retry
axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000, // Exponential backoff for retries
  retryCondition: (error) => {
    if (error.code === "ECONNABORTED") {
      return true; // Retry for timeout errors
    }
    if (error.response) {
      return error.response.status >= 500; // Retry for server errors (5xx)
    }
    return false; // Do not retry for other cases
  },
});

// Add response interceptor to handle errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out. Please try again.");
    } else if (error.response) {
      // console.error(`Error status: ${error.response.status}`);
    } else {
      console.error("Network error or no response received.");
    }
    return Promise.reject(error);
  }
);

export default axios;
