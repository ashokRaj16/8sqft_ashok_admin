import axiosInstance from "../config/axiosInstance";

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
        console.log(result)
        return result.data;
    }
    catch (error) {
        // throw error;
        throw new Error(errorHandler(error))
    }
}

export const getBlogCategoryById = async (id) => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.get(`admin/category/${id}`);
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}

export const createBlogCategory = async (data) => {
    try {
        // call to api to get listed single user(async request.) & return data
        console.log("Sending data to API:", data); 
        const result = await axiosInstance.post(`/admin/category`, { 
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

export const deleteBlogCategory = async (id) => {
    try {
        const result = await axiosInstance.delete(`admin/category/${id}`);
        console.log(result)
        return result;
    }
    catch (error) {
        throw new Error( errorHandler(error));
    }
}