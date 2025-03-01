import { errorHandler } from '../utils/errorHandler';
import axiosInstance from '../config/axiosInstance';

export const getPropertyEnquiryList = async (offset = 1, limit = 10, sortOrder = 'asc', sortColumn = '', searchFilter = '', stepTerm = '', activeStep = '' ) => {
    try {
        console.log(offset)
        const result = await axiosInstance.get(`/admin/enquiry`, { 
            params : {
                page: offset,
                limit,
                sortColumn,
                sortOrder,
                searchFilter
            },
        });
        return result.data;
    }
    catch (error) {
        throw new errorHandler(error)
    }
}

export const deletePropertyEnquiry = async (id) => {
    try {
        const result = await axiosInstance.delete(`/admin/enquiry/${id}`);
        return result;
    }
    catch (error) {
        throw new Error(error)
    }
}
