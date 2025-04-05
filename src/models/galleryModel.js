import axios from 'axios';
// import axiosInstance from '../config/axiosInstance';
// import { constant } from '../utils/constant';
import { errorHandler } from '../utils/errorHandler.js';

const SERVER_BASE_URL = 'http://localhost:5000/api/v1'
const accesskey = "A8SQFT7767"; // Replace with your actual static token
const authToken = "A8SQFT7767010222"; // Replace with your actual static token


export const postImageStart = async (fileName = '') => {
    try {
        console.log(fileName, "name")
        if(!fileName) {
            throw new Error('FileName is required.')
        }
        const body = { fileName }
        const result = await axios.post(`${SERVER_BASE_URL}/admin/gallery/start`, 
        body , {
            headers: {
                "x-api-key" : accesskey,
                "Content-Type" : 'application/json',
                "Authorization": `Bearer ${authToken}`,
            }
        }
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
        const result = await axios.post(`${SERVER_BASE_URL}/admin/gallery/chunk`,
            formData, {
                headers : {
                    "x-api-key": accesskey,
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

        const result = await axios.post(`${SERVER_BASE_URL}/admin/gallery/complete`, 
            body,
            {
                headers: {
                    "x-api-key" : accesskey,
                    "Content-Type" : 'application/json',
                    "Authorization": `Bearer ${authToken}`,
                } }
        );

        return result.data;
    }
    catch (error) {
       throw new errorHandler(error);
    }
}