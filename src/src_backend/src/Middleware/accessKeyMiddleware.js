// import { badRequestResponse } from '../..//utils/response';
import { badRequestResponse } from "../utils/response.js";

const accessKeyMiddleware = (req, res, next) => {    
    const validAccessKey = process.env.ACCESS_KEY || 'A8SQFT7767';    
    const accessKey = req.headers['x-api-key'] || req.query.accessKey || req.body.accessKey;

    if (!accessKey) {
        return badRequestResponse(res, false, 'Access key is missing.');
    }

    if (accessKey !== validAccessKey) {
        return badRequestResponse(res, false, 'Invalid access key.');        
    }

    next();
};

export { accessKeyMiddleware }