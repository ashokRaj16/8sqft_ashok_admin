
class ValidationError extends Error {
    constructor(message){
        super(message);
        this.name = "ValidationError"
    }
}

class NetworkError extends Error {
    constructor(message) {
        super(message)
        this.name = "NetworkError"
    }
}

class ServerError extends Error {
    constructor(message) {
        super(message);
        this.name ="ServerError"
    }
}

function logError (error) {
    console.log(error)
}

export function errorHandler(error) { 
    if (error.response) { 
        const { status, data } = error.response; 
        console.log(status, data);
        if (status === 400 && data.status === false && Array.isArray(data.error)) { 
            // Handle validation errors 
            const validationErrors = data.error .map(err => `${err.field}: ${err.message}`) .join("; "); 
            logError(new ValidationError(validationErrors)); 
            return new ValidationError(`Validation: ${validationErrors}`);
        } 
        else if (status === 400) { 
            logError(new Error(`Bad Request: ${data.message || "Invalid request."}`)); 
            return new Error(`${data.message || "An error occurred."}`);
            throw new Error(`${data.message || "The request was invalid. Please check your input and try again."}`); 
        } else if (status === 401) { 
            logError(new Error(`Unauthorized: ${data.message || "Authentication required."}`)); 
            return new Error(`Unauthorized: ${data.message || "Please log in."}`);
            throw new Error(`${data.message || "You are not authorized to perform this action. Please log in and try again."}`); 
        } else if (status === 403) { 
            logError(new Error(`Forbidden: ${data.message || "Access denied."}`)); 
            return new Error(`${data.message || "You do not have permission."}`);
            throw new Error(`${data.message || "You do not have permission to access this resource."}`); 
        } else if (status === 404) { 
            logError(new Error(`Not Found: ${data.message || "Resource not found."}`)); 
            return new Error(`Not Found: ${data.message || "The requested resource is missing."}`);
            throw new Error(`${data.message || "The requested resource is missing."}`); 
        } else if (status >= 500) { 
            logError(new ServerError(`Server Error: ${data.message || "Internal server error."}`)); 
            return new ServerError(`Server Error: ${data.message || "Please try again later."}`);
            throw new ServerError(` ${data.message || "An internal server error occurred. Please try again later."}`); 
        } else { 
            logError(new Error(`Unhandled Error (${status}): ${data.message || "Unknown error."}`)); 
            throw new Error(`(${status}): ${data.message || "An unknown error occurred. Please try again."}`); 
            return `Error (${status}): ${data.message || "Something went wrong."}`;
        } 
    } else if (error.request) { 
        logError(new NetworkError("Network Error: Unable to reach the server. Please check your connection.")); 
        return new NetworkError("Network Error: Unable to reach the server. Please check your connection.");
        throw new NetworkError("Network Error: Unable to reach the server. Please check your connection."); 
    } else { 
        logError(new Error(`Unexpected Error: ${error.message}`)); 
        return new Error(`Unexpected Error: ${error.message}`);
        throw new Error(`An unexpected error occurred. Please try again.`); 
    } 
}