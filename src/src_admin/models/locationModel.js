import axios from 'axios';
import { errorHandler } from '../utils/errorHandler';
import { constant } from '../utils/constant';

export const getAllStates = async ( ) => {
    try {
        const response = await axios.get(
            `${ constant.SERVER_BASE_URL }/location/states`,
            {
              headers: {
                'x-api-key': 'A8SQFT7767',
              },
            },
          )
        return response.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}

export const getAllCities = async ( data ) => {
    try {
        // const { id } = data;
        const response = await axios.get(
            `${ constant.SERVER_BASE_URL }/location/cities`,
            {
              headers: {
                'x-api-key': 'A8SQFT7767',
              },
            },
          )
        return response.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}

export const getAllCitybyPincode = async ( data = null ) => {
    try {
        const { pincode } = data;
        const response = await axios.get(
            `${ constant.SERVER_BASE_URL }/location/citybypincode`,
            {
              headers: {
                'x-api-key': 'A8SQFT7767',
              },
            },
          )
        return response.data;
    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}
