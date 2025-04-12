import axios from 'axios';
import axiosInstance from '../config/axiosInstance';
import { errorHandler } from '../utils/errorHandler';
import { constant } from '../utils/constant';

export const listAllImage = async (filters = '', prefix = '', limit = 10, sortColumn = "LastModified", sortOrder = "DESC") => {
      try {

        const params = new URLSearchParams({
            limit: limit || 10,
            filters,
            prefix,
            sortColumn,
            sortOrder
        })
        const result = await axiosInstance.get(`/admin/gallery`, {
            params
        });
        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}

export const deleteImageFromGallery = async (file) => {
    try {        
        const result = await axiosInstance.post(`admin/gallery/delete`, {
            file
        });
        return result;
    }
    catch (error) {
        throw new Error( errorHandler(error));
    }
}

/**
 * Upload files uin 3 steps (Start | Chunk | Complete)
 * @param {*} fileName 
 * @param {*} mimetype 
 * @returns 
 */
export const postImageStart = async (fileName = '', mimetype = '') => {
    try {
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
        const authRefreshToken = localStorage.getItem('eightsqftrefreshtoken');
        const result = await axios.post(`${constant.SERVER_BASE_URL}/admin/gallery/chunk`,
            formData, {
                headers : {
                    "x-api-key": constant.X_API_KEY,
                    'x-refresh-key' : authRefreshToken,
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
        // console.log(`Attempt ${attempt}: Uploading part ${partNumber}`);
        return await postImageChunk(formData);
    } catch (error) {
        // console.error(`Error uploading part ${partNumber}, attempt ${attempt}:`, error.message);
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