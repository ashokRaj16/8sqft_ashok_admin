import jwt from 'jsonwebtoken';
import { constant } from '../config/constant.js';

// generate Access & Refresh token.
/**
 * 
 * @param {*} payload 
 * @param {ADMIN, USER} request 
 * @param {ACCESS, REFRESH} type 
 * @returns 
 */
export const generateToken = (payload, request = constant.USER_TYPE.ADMIN, type = constant.TOKEN_TYPE.ACCESS) => {
    let access_secret_key;
    let refresh_token_key;

    if(request === constant.USER_TYPE.ADMIN) {
        access_secret_key = process.env.JWT_SECRET_ACCESS_KEY_ADMIN || "8SQFT_SECRET";
        refresh_token_key = process.env.JWT_SECRET_REFRESH_KEY_ADMIN || "8SQFT_REFRESH_SECRET";
    } else {
        access_secret_key = process.env.JWT_SECRET_ACCESS_KEY || "8SQFT_SECRET";
        refresh_token_key = process.env.JWT_SECRET_REFRESH_KEY || "8SQFT_REFRESH_SECRET";
    }
    
    // ***After testing change to this.
    const expire_in = (type === constant.TOKEN_TYPE.ACCESS) 
        ? process.env.JWT_EXPIRY || "1h" 
        : process.env.JWT_REFRESH_EXPIRY || "7d";


    try {
        if (type === constant.TOKEN_TYPE.ACCESS ) {
            return jwt.sign(payload, access_secret_key, { expiresIn: expire_in });
        } else if (type === constant.TOKEN_TYPE.REFRESH) {
            return jwt.sign(payload, refresh_token_key, { expiresIn: expire_in });
        } else {
            throw new Error("Invalid token type specified.");
        }
    } catch (error) {
        console.error("Error generating token:", error.message);
        throw error;
    }
}

// verify refresh token.
export const verifyToken = (token, request = constant.USER_TYPE.ADMIN, type = constant.TOKEN_TYPE.ACCESS) => {
    
    let access_secret_key;
    let refresh_token_key;

    if(request === constant.USER_TYPE.ADMIN) {
        if(type === constant.TOKEN_TYPE.ACCESS) {
            access_secret_key = process.env.JWT_SECRET_ACCESS_KEY_ADMIN || "8SQFT_SECRET";
        } else {
            refresh_token_key = process.env.JWT_SECRET_REFRESH_KEY_ADMIN || "8SQFT_REFRESH_SECRET";
        }
    } else {
        if(type === constant.TOKEN_TYPE.ACCESS) {
            access_secret_key = process.env.JWT_SECRET_ACCESS_KEY || "8SQFT_SECRET";
        } else {
            refresh_token_key = process.env.JWT_SECRET_REFRESH_KEY || "8SQFT_REFRESH_SECRET";
        }
    }

    try{


        let tokenDetails = jwt.verify(token, type === constant.TOKEN_TYPE.ACCESS ? access_secret_key : refresh_token_key );
        
        return { status : true, tokenDetails : tokenDetails };
    }
    catch(error)
    {
        console.log(error, "ver errorssss")

        return { status: false, error };
    }
}