import jwt from 'jsonwebtoken';

// generate Access & Refresh token.
/**
 * 
 * @param {*} payload 
 * @param {ADMIN, USER} request 
 * @param {ACCESS, REFRESH} type 
 * @returns 
 */
export const generateToken = (payload, request = "ADMIN", type = "ACCESS") => {
    let access_secret_key;
    let refresh_token_key;

    if(request === "ADMIN") {
        access_secret_key = process.env.JWT_SECRET_ACCESS_KEY_ADMIN || "8SQFT_SECRET";
        refresh_token_key = process.env.JWT_SECRET_REFRESH_KEY_ADMIN || "8SQFT_REFRESH_SECRET";
    } else {
        access_secret_key = process.env.JWT_SECRET_ACCESS_KEY || "8SQFT_SECRET";
        refresh_token_key = process.env.JWT_SECRET_REFRESH_KEY || "8SQFT_REFRESH_SECRET";
    }

    // ***After testing change to this.
    const expire_in = (type === "ACCESS") ? process.env.JWT_EXPIRY : process.env.JWT_REFRESH_EXPIRY;

    try {
        if (type === "ACCESS") {
            return jwt.sign(payload, access_secret_key, { expiresIn: expire_in });
        } else if (type === "REFRESH") {
            return jwt.sign(payload, refresh_token_key);
        } else {
            throw new Error("Invalid token type specified.");
        }
    } catch (error) {
        console.error("Error generating token:", error.message);
        throw error;
    }
}

// verify refresh token.
export const verifyRefreshToken = (token, request = "ADMIN", type = "ACCESS") => {

    const secret_key = (type === "ACCESS") ? process.env.JWT_SECRET_ACCESS_KEY || "NEXUS_SECRET_KEY" : process.env.JWT_SECRET_REFRESH_KEY || "NEXUS_REFRESH_SECRET";
    let access_secret_key;
    let refresh_token_key;

    if(request === "ADMIN") {
        access_secret_key = process.env.JWT_SECRET_ACCESS_KEY_ADMIN || "8SQFT_SECRET";
        // refresh_token_key = process.env.JWT_SECRET_REFRESH_KEY_ADMIN || "8SQFT_REFRESH_SECRET";
    } else {
        access_secret_key = process.env.JWT_SECRET_ACCESS_KEY || "8SQFT_SECRET";
        // refresh_token_key = process.env.JWT_SECRET_REFRESH_KEY || "8SQFT_REFRESH_SECRET";
    }

    try{
        let tokenDetails = jwt.verify(token, secret_key);
        return { status : true, tokenDetails : tokenDetails };
    }
    catch(err)
    {
        return { status: false, tokenDetails: err };
    }
}