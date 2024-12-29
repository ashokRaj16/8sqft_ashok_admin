import axios from 'axios';

const SERVER_BASE_URL = '';
const HEADER = {
    "x-api-key" : "",
    "Authorization" : "Bearer "
}

export const login = async ( data ) => {
    try {
        const userDetails = { name: 'Ashok', email: 'ashok@gmail.com', roleName: 'ADMIN' }
        // console.log(userDetails);
        return userDetails;
    }
    catch (error) {
        throw error;
    }
}

export const logout = async ( data ) => {
    try {

    }
    catch (error) {
        throw error;
    }
}
