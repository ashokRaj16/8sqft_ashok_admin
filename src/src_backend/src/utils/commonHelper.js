import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import path from "path";
import _ from 'lodash';

// Add days to given days, require days.
export const addDate = (days, date = new Date) => {
    let result = new Date(date);
    result.setDate(date.getDate() + days)
    return result;
}

// return formatted date eg. "01-01-2023"
export function formattedDate(d = new Date) {
    return [d.getDate(), d.getMonth()+1, d.getFullYear()]
        .map(n => n < 10 ? `0${n}` : `${n}`).join('-');
}

export function formattedDateTime(timestamp = Date.now()) {
    const d = new Date(timestamp);
    
    const datePart = [ d.getFullYear(), d.getMonth() + 1, d.getDate(),]
        .map(n => n < 10 ? `0${n}` : `${n}`).join('-');
    
    const timePart = [d.getHours(), d.getMinutes(), d.getSeconds()]
        .map(n => n < 10 ? `0${n}` : `${n}`).join(':');

    return `${datePart} ${timePart}`;
}
export const generateSecretToken = () => {
    let secretRefresh = randomBytes(16).toString("hex");
    return secretRefresh;
}

export const hashPassword = (password) => {
    let hashPassword = password;
    if(!password) {
        throw new Error('Password required')        
    }
    hashPassword = bcrypt.hash(password, 10)
    return hashPassword
}
/**
 * Sanitizes a given field based on trimming, case conversion, and additional sanitization options.
 *
 * @param {string|null} fieldName - The input field value.
 * @param {boolean} [trimField=false] - Whether to trim spaces from the field.
 * @param {'UPPERCASE' | 'LOWERCASE' | 'CAPITALIZE'} [caseType] - The type of case transformation.
 * @param {Object} [options] - Additional sanitization options.
 * @param {boolean} [options.removeSpecialChars=false] - Removes special characters (except spaces & alphanumeric).
 * @param {boolean} [options.replaceMultipleSpaces=true] - Replaces multiple spaces with a single space.
 * @param {boolean} [options.removeNumbers=false] - Removes numeric values from the field.
 * @returns {string|null} - The sanitized field value.
 */
export const sanitizedField = (fieldName = null, trimField = false, caseType, options = {}) => {
    if (!fieldName || typeof fieldName !== "string") {
        return fieldName; 
    }

    let newField = fieldName;

    // Trim
    if (trimField) {
        newField = _.trim(newField);
    }

    // Remove special characters if enabled
    if (options.removeSpecialChars) {
        newField = newField.replace(/[^\w\s]/gi, "");
    }

    // Replace multiple spaces with a single space
    if (options.replaceMultipleSpaces !== false) {
        newField = newField.replace(/\s+/g, " ");
    }

    // Remove numbers if enabled
    if (options.removeNumbers) {
        newField = newField.replace(/\d+/g, "");
    }

    // Case transformation 
    switch (caseType) {
        case "UPPERCASE":
            newField = _.toUpper(newField);
            break;
        case "LOWERCASE":
            newField = _.toLower(newField);
            break;
        case "CAPITALIZE":
            newField = _.startCase(_.toLower(newField));
            break;
        default:
            break;
    }

    return newField;
};


/**
 * Sanitizes a given number by removing non-numeric characters and applying formatting.
 *
 * @param {string|number|null} value - The input number.
 * @param {Object} [options] - Formatting options.
 * @param {boolean} [options.allowNegative=true] - Whether to allow negative numbers.
 * @param {boolean} [options.allowDecimal=true] - Whether to allow decimal points.
 * @param {number|null} [options.min=null] - Minimum value allowed.
 * @param {number|null} [options.max=null] - Maximum value allowed.
 * @param {number|null} [options.decimalPlaces=null] - Number of decimal places to format to.
 * @returns {number|null} - Sanitized number or null if invalid.
 */
export const sanitizedNumber = (value, options = {}) => {
    if (value === null || value === undefined) return null;

    let stringValue = String(value).trim(); // Convert to string and trim spaces

    // Define the regex pattern based on options
    let regexPattern = options.allowDecimal
        ? /[^0-9.-]/g // Allow numbers, decimals, and negatives
        : /[^0-9-]/g; // Allow only whole numbers with negatives

    stringValue = stringValue.replace(regexPattern, ""); // Remove invalid characters

    // Ensure only one negative sign at the start
    if (stringValue.includes("-")) {
        stringValue = stringValue.replace(/-/g, ""); // Remove all dashes
        stringValue = `-${stringValue}`; // Keep only the first one
    }

    // Ensure only one decimal point
    if (options.allowDecimal && stringValue.includes(".")) {
        const parts = stringValue.split(".");
        stringValue = `${parts[0]}.${parts.slice(1).join("")}`; // Keep only the first decimal
    }

    let num = parseFloat(stringValue); // Convert to a number

    // If number is NaN, return null
    if (isNaN(num)) return null;

    // Apply min/max limits
    if (options.min !== null && num < options.min) num = options.min;
    if (options.max !== null && num > options.max) num = options.max;

    // Format to specific decimal places
    if (options.decimalPlaces !== null && !isNaN(options.decimalPlaces)) {
        num = parseFloat(num.toFixed(options.decimalPlaces));
    }

    return num;
};


/**
 * Batch sanitizes an object’s fields based on a configuration.
 *
 * @param {Object} data - The input object.
 * @param {Object} config - The sanitization rules for each field.
 * @returns {Object} - The sanitized object.
 */
export const sanitizeObjectFields = (data, config) => {
    if (!data || typeof data !== "object") return data;

    return Object.keys(data).reduce((acc, key) => {
        const { trim = false, caseType = null } = config[key] || {};
        acc[key] = sanitizedField(data[key], trim, caseType);
        return acc;
    }, {});
};


// usage Example
// const data = { name: "  john doe ", email: "TEST@8SQFT.COM" };
// const config = {
//     name: { trim: true, caseType: "CAPITALIZE" },
//     email: { trim: true, caseType: "LOWERCASE" }
// };

// const sanitizedData = sanitizeObjectFields(data, config);
// // Output: { name: "John Doe", email: "test@example.com" }

/**
 * 
 * @param {string} fileName 
 * @returns 
 */
export const generateDirectoryName = (fileName) => {
    if(!fileName) {
        return;
    }

    const currentDate = new Date();
    const month = currentDate.toLocaleString('en-US', { month: 'short' }).toLowerCase();
    const year = currentDate.getFullYear();
    const folderName = `${month}-${year}`;

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(fileName).toLowerCase();
    const updateFileName = `${folderName}/${uniqueSuffix}${extension}`;
    
    // const updateFileName = `${folderName}/${fileName}`;
    return updateFileName;
}


export const formatPhoneNumber = (mobile) => {
    if (typeof mobile !== 'string') {
      mobile = String(mobile);
    }
    return mobile.replace(/\D/g, '');
  };