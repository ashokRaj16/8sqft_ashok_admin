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
export const getBlogCategory = async (offset = 0, limit = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '' ) => {
    try {
        const result = await axiosInstance.get(`/admin/category`, { 
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

export const getBlogCategoryById = async (id) => {
    try {
        const result = await axiosInstance.get(`admin/category/${id}`);
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}

export const createBlogCategory = async (data) => {
    try {

        const result = await axiosInstance.post(`/admin/category`, { 
            ...data
        });
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}

export const deleteBlogCategory = async (id) => {
    try {
        const result = await axiosInstance.delete(`admin/category/${id}`);
        return result;
    }
    catch (error) {
        throw new Error( errorHandler(error));
    }
}