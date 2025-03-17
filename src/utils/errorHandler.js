
export const errorHandler = (error = null) => {

    if (error.response) {
        const { status, data } = error.response;

        if (status === 400 && data.status === false && Array.isArray(data.error)) {
            // Handle validation errors
            const validationErrors = data.error
                .map(err => `${err.field}: ${err.message}`)
                .join("; ");
            console.error("Validation Errors:", validationErrors);
            // throw new Error(`Validation Error: ${validationErrors}`);
            return `Validation Error: ${validationErrors}`;
        } else if (status === 400) {
            console.error("Bad Request:", data.message || "Invalid request.");
            return `Bad Request: ${data.message || "An error occurred."}`;
            throw new Error(`Bad Request: ${data.message || "An error occurred."}`);
        } else if (status === 401) {
            console.error("Unauthorized:", data.message || "Authentication required.");
            return `Unauthorized: ${data.message || "Please log in."}`;
            throw new Error(`Unauthorized: ${data.message || "Please log in."}`);
        } else if (status === 403) {
            console.error("Forbidden:", data.message || "Access denied.");
            return `Forbidden: ${data.message || "You do not have permission."}`;
            throw new Error(`Forbidden: ${data.message || "You do not have permission."}`);
        } else if (status === 404) {
            console.error("Not Found:", data.message || "Resource not found.");
            return `Not Found: ${data.message || "The requested resource is missing."}`;
            throw new Error(`Not Found: ${data.message || "The requested resource is missing."}`);
        } else if (status >= 500) {
            console.error("Server Error:", data.message || "Internal server error.");
            return `Server Error: ${data.message || "Please try again later."}`;
            throw new Error(`Server Error: ${data.message || "Please try again later."}`);
        } else {
            console.error(`Unhandled Error (${status}):`, data.message || "Unknown error.");
            return `Error (${status}): ${data.message || "Something went wrong."}`;
            throw new Error(`Error (${status}): ${data.message || "Something went wrong."}`);
        }
    } else if (error.request) {
        console.error("Network Error:", error.request);
        // throw new Error("Network Error: Unable to reach the server. Please check your connection.");
        return "Network Error: Unable to reach the server. Please check your connection.";
    } else {
        console.error("Error:", error.message);
        // throw new Error(`Unexpected Error: ${error.message}`);
        return `Unexpected Error: ${error.message}`;
    }
}
