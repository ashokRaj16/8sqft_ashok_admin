
import jwt from "jsonwebtoken";
import { badRequestResponse, internalServerResponse, successWithDataResponse, unauthorizedResponse } from "../utils/response.js";
import { generateToken, verifyToken } from '../utils/tokenHelper.js';
import { constant } from '../config/constant.js'
// dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;

const verifyClientToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return badRequestResponse(res, false, "Access denied. No token provided.");
    } 

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded?.id;
        req.userEmail = decoded?.email;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return unauthorizedResponse(res, false, "Token has expired.");
        }
        return unauthorizedResponse(res, false, "Failed to authenticate token.", error);
    }
};

const verifyAdminToken = (req, res, next) => {
    let data = {}
    const token = req.headers.authorization?.split(' ')[1];
    const refreshToken = req.headers['x-refresh-key'] || '';
    try {
        if (!token) {
            if (!refreshToken) {
                return badRequestResponse(res, false, "Access denied. No token provided.");
            }
    
            // If access token is missing but refresh token exists, try to generate a new one
            const refreshTokenVerified = verifyToken(refreshToken, constant.USER_TYPE.ADMIN, constant.TOKEN_TYPE.REFRESH);
    
            if (!refreshTokenVerified.status) {
                // return unauthorizedResponse(res, false, "Invalid refresh token. Please log in again.");
                return unauthorizedResponse(res, false, "Invalid refresh Token please try login again.", refreshTokenVerified.error);
            }
    
            // Generate a new access token
            const tokenData = {
                id: refreshTokenVerified.tokenDetails.id,
                email: refreshTokenVerified.tokenDetails.email,
                role: refreshTokenVerified.tokenDetails.role_id,
                role_name: refreshTokenVerified.tokenDetails.role_name
            };
            const newAccessToken = generateToken(tokenData, constant.USER_TYPE.ADMIN, constant.TOKEN_TYPE.ACCESS);
    
            // Set new access token as cookie
            data['newAccessToken'] = newAccessToken;
            return successWithDataResponse(res, true, "New Access Token issued.", data );
        }
        // const decoded = jwt.verify(token, JWT_SECRET_ADMIN);
        const tokenVerified = verifyToken(token, constant.USER_TYPE.ADMIN, constant.TOKEN_TYPE.ACCESS)
      
        if(tokenVerified.status ) {
            const decoded = tokenVerified.tokenDetails;
            req.userId = decoded.id;
            req.userEmail = decoded.email;
            req.roleId = decoded.role;
            next();
        }

        if(tokenVerified.error?.name === 'TokenExpiredError') {
            if (!refreshToken) {
                return badRequestResponse(res, false, "Invalid refresh Token please try login again.");
            } 

            const refreshTokenVerified = verifyToken(refreshToken, constant.USER_TYPE.ADMIN, constant.TOKEN_TYPE.REFRESH)
            if(!refreshTokenVerified.status) {
                return unauthorizedResponse(res, false, "Invalid refresh Token please try login again.", refreshTokenVerified.error);
            }
            const tokenData = { id: refreshTokenVerified.tokenDetails.id, email: refreshTokenVerified.tokenDetails.email, role: refreshTokenVerified.tokenDetails.role_id, role_name: refreshTokenVerified.tokenDetails.role_name };
            const newAccessToken = generateToken(tokenData, constant.USER_TYPE.ADMIN, constant.TOKEN_TYPE.ACCESS)

            data['newAccessToken'] = newAccessToken;
            return successWithDataResponse(res, true, "New Access Token issued.", data );
        }

    } catch (error) {
        console.log(error)
        if (error.name === 'TokenExpiredError') {
            return unauthorizedResponse(res, false, "Token has expired.");
        }
        return unauthorizedResponse(res, false, "Invalid token.", error);
    }
};

export { verifyClientToken, verifyAdminToken };