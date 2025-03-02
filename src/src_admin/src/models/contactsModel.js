import axiosInstance from '../config/axiosInstance';
import { errorHandler } from '../utils/errorHandler';

// setup loader. //done
export const getContactUs = async (offset = 0, limit = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '' ) => {
    try {
        const result = await axiosInstance.get(`admin/contact_us`, { 
            params : {
                page: offset,
                limit,
                sortColumn,
                sortOrder,
                searchFilter
            }
        });

        console.log(result.data)
        return result.data;
    }
    catch (error) {
        throw new Error( errorHandler(error) );
    }
}

export const downloadExcelContactUs = async (searchFilter = '') => {
    try {
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
    }
    catch (error) {
        throw new errorHandler(error)
    }
}

export const deleteContactUs = async (id) => {
    try {
        const result = await axiosInstance.delete(`admin/contact_us/${id}`);
        console.log(result)
        return result;
    }
    catch (error) {
        throw new Error( errorHandler(error));
    }
}

export const getContactUsById = async (id) => {
    try {
        const result = await axiosInstance.get(`/admin/contact_us/${id}`);
        
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

export const createContactUs = async (data) => {
    try {
        console.log("Sending data to API:", data); 
        const result = await axiosInstance.post(`/admin/contact_us`, { 
            ...data
        });
        return result.data;
    }
    catch (error) {
        // throw error;
        throw new Error(errorHandler(error))
    }
}
