import axios from 'axios';
import axiosInstance from '../config/axiosInstance';
import { errorHandler } from '../utils/errorHandler';
import { constant } from '../utils/constant';


export const postImageStart = async (fileName = '') => {
    try {
        console.log(fileName, "name")
        if(!fileName) {
            throw new Error('FileName is required.')
        }
        const body = { fileName }
        const result = await axiosInstance.post(`/admin/gallery/start`, 
            body 
        );

        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

export const postImageChunk = async (formData = null) => {
    try {
        if(!formData) {
            throw new Error('Missing required fields.')
        }
        const authToken = localStorage.getItem('eightsqfttoken');
        const result = await axios.post(`${constant.SERVER_BASE_URL}/admin/gallery/chunk`,
            formData, {
                headers : {
                    "x-api-key": constant.X_API_KEY,
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${authToken}`,
                }
            }
        )

        // const result = await axios.post(`/admin/gallery/chunk`, 
        //     formData,
        //      { 
        //         headers: {
        //             "Content-Type" : 'multipart/form-data',
        //             "Accept" : 'application/json'
        //         }
        //      }
        // );

        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}


export const postImageComplete = async (fileName = null, uploadId, parts = {} ) => {
    try {
        if(!fileName || !uploadId || !parts ) {
            throw new Error('Missing required fields.')
        }
        const body = {
            fileName, uploadId, uploadedParts: parts
        }

        const result = await axiosInstance.post(`/admin/gallery/complete`, 
            body
        );

        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}