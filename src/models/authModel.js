import axios from 'axios';

const SERVER_BASE_URL = 'https://api.8sqft.com/api/v1/admin';
const HEADER = {
    "x-api-key" : "A8SQFT7767",
}

export const login = async ( data ) => {
    try {
        const userDetails = { name: 'Ashok', email: 'ashok@gmail.com', roleName: 'ADMIN' }
        // const result = await axios.post(`${SERVER_BASE_URL}/login`, { 
        //     ...data,
        //     },
        //     {

        //         headers: {
        //             ...HEADER
        //         }
        //     }
        // );
        // return result.data;
        // console.log(userDetails);
        return userDetails;
    }
    catch (error) {
        throw error;
    }
}

export const updateUserProfile = async ( data ) => {
    try {

        // console.log();
        // const userDetails = { name: 'Ashok', email: 'ashok@gmail.com', roleName: 'ADMIN' }
        const result = await axiosInstance.put(`/admin/profile`, { 
            ...data
        });
        console.log(result);
        return result.data;
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
