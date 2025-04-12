import axiosInstance from '../config/axiosInstance';
import { constant } from '../utils/constant';
import { errorHandler } from '../utils/errorHandler';

export const getRegisterPlans = async (offset = 0, limit = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '' ) => {
    try {
        const result = await axiosInstance.get(`admin/register_plans`, { 
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
        // throw error;
        throw new Error( errorHandler(error) );
    }
}

export const downloadExcelRegisterPlans = async (searchFilter = '') => {
    try {
        // call to api to get listed single user(async request.) & return data
        const result = await axiosInstance.get(`/export-admin`, { 
            params: { 
                searchFilter
            },
            responseType : 'blob',
        });

        // need exceljs package
        const blob = new Blob(data.body, { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });

        const url = window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.download = "User-Excel.xlsx";
        anchor.href = url;
        anchor.click();

        // return result;
    }
    catch (error) {
        throw new errorHandler(error);
    }
}

export const deleteRegisterPlans = async (id) => {
    try {
        const result = await axiosInstance.delete(`admin/register_plans/${id}`);
        return result;
    }
    catch (error) {
        throw new Error( errorHandler(error));
    }
}

export const getRegisterPlansById = async (id) => {
    try {
        const result = await axiosInstance.get(`/admin/register_plans/${id}`);
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

export const createRegisterPlans = async (data) => {
    try {
        console.log("Sending data to API:", data); 
        const result = await axiosInstance.post(`/admin/register_plans`, { 
            ...data
        });
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}

export const getSubscriptions = async () => {
    try {
        const result = await axiosInstance.get(`/admin/admin_roles/`);
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}