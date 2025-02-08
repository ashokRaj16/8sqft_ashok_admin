
import jwt from "jsonwebtoken";
import { badRequestResponse, internalServerResponse, unauthorizedResponse } from "../utils/response.js";
// import dotenv from 'dotenv';
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
        console.log(error)
        if (error.name === 'TokenExpiredError') {
            return unauthorizedResponse(res, false, "Token has expired.");
        }
        return unauthorizedResponse(res, false, "Failed to authenticate token.", error);
    }
};

const verifyAdminToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return badRequestResponse(res, false, "Access denied. No token provided.");
    } 

    try {
        const decoded = jwt.verify(token, JWT_SECRET_ADMIN);

        console.log(decoded);
        
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        req.roleId = decoded.role;
        next();
    } catch (error) {
        console.log(error)
        if (error.name === 'TokenExpiredError') {
            return unauthorizedResponse(res, false, "Token has expired.");
        }
        return unauthorizedResponse(res, false, "Invalid token.", error);
    }
};

export { verifyClientToken, verifyAdminToken };