import axiosInstance from "../config/axiosInstance";
import { errorHandler } from "../utils/errorHandler";

/**
 * GET : Dashboard Counter ( Users | Property | Amount | Wishlist )
 * @param {*} 
 * @returns 
 */
export const getCountInfo = async () => {
    try {
        const result = await axiosInstance.get(`/admin/dashboard`);
        return result.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}
