import axios from 'axios';
import axiosInstance from '../config/axiosInstance';
import { errorHandler } from '../utils/errorHandler';
import { constant } from '../utils/constant';


export const postImageStart = async (fileName = '', mimetype = '') => {
    try {
        console.log(fileName, "name")
        if(!fileName) {
            throw new Error('FileName is required.')
        }

        const body = { fileName, mimetype }
        const result = await axiosInstance.post(`/admin/gallery/start`, 
            body 
        );

        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}


const postImageChunk = async (formData = null) => {

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
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}


const MAX_RETRIES = 3;

export async function uploadChunkWithRetry(formData, partNumber = null, attempt = 1) {
    try {
        console.log(`Attempt ${attempt}: Uploading part ${partNumber}`);
        return await postImageChunk(formData);
    } catch (error) {
        console.error(`Error uploading part ${partNumber}, attempt ${attempt}:`, error.message);
        if (attempt < MAX_RETRIES) {
            return uploadChunkWithRetry(formData, partNumber, attempt + 1);
        } else {
            throw new Error(`Failed to upload part ${partNumber} after ${MAX_RETRIES} attempts`);
        }
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