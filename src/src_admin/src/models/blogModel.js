import axiosInstance from "../config/axiosInstance";
import { errorHandler } from "../utils/errorHandler";
/**
 * GET :Member User
 * @param {*} offset 
 * @param {*} per_page 
 * @param {*} sortOrder 
 * @param {*} sortColumn 
 * @param {*} searchFilter 
 * @returns 
 */
export const getBlog = async (offset = 0, limit = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '' ) => {
    try {
        const result = await axiosInstance.get(`/admin/blog`, { 
            params : {
                page: offset,
                limit,
                sortColumn,
                sortOrder,
                searchFilter
            }
        });
        console.log(result)
        return result.data;
    }
    catch (error) {
        // throw error;
        throw new Error(errorHandler(error))
    }
}

export const getBlogById = async (id) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.get(`admin/blog/${id}`);
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}

export const createBlog = async (data) => {
    try {
        // call to api to get listed single user(async request.) & return data
        console.log("Sending data to API:", data); 
        const result = await axiosInstance.post(`/admin/blog`, { 
            ...data
        });
        console.log(result)
        return result.data;
    }
    catch (error) {
        // throw error;
        console.log(error)
        throw new Error(errorHandler(error))
    }
}

export const deleteBlog = async (id) => {
    try {
        const result = await axiosInstance.delete(`admin/blog/${id}`);
        console.log(result)
        return result;
    }
    catch (error) {
        throw new Error( errorHandler(error));
    }
}

export const uploadBlogImage = async (data) => {
    try {
        
        const formData = new FormData()
        formData.append('images', data)

        console.log("Sending data to API:", data); 
        const result = await axiosInstance.post(`/front/property_images`, { 
            formData
        });
        console.log(result)
        return result.data;
    }
    catch (error) {
        console.log(error)
        throw new Error(errorHandler(error))
    }
}