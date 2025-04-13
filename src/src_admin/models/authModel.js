import axios from 'axios';
import { errorHandler } from '../utils/errorHandler';
import { constant } from '../utils/constant';

export const login = async ( data ) => {
    try {
        const { email, password } = data;
        const response = await axios.post(
            `${ constant.SERVER_BASE_URL }/admin/login`,
            {
              email,
              password,
            },
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

export const logout = async ( data ) => {
    try {

    }
    catch (error) {
        throw new Error(errorHandler(error))
    }
}