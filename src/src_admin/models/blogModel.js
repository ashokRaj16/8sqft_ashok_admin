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
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}

export const getBlogById = async (id) => {
    try {
        const result = await axiosInstance.get(`admin/blog/${id}`);
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}

export const createBlog = async (data) => {
    try {
        const result = await axiosInstance.post(`/admin/blog`, { 
            ...data
        });
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}

export const deleteBlog = async (id) => {
    try {
        const result = await axiosInstance.delete(`admin/blog/${id}`);
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

        const result = await axiosInstance.post(`/front/property_images`, { 
            formData
        });
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}