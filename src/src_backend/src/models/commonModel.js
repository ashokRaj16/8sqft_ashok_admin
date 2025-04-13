import pool from '../config/db.js';
import { formattedDateTime } from '../utils/commonHelper.js';

const insertRecordsDb = async (table, data) => {
    let connection;
    try{

        connection = await pool.getConnection();

        const column = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);
        
        const query = `INSERT INTO ${table} (${column}) VALUES ${placeholders}`;

        const [result] = await connection.execute(query, values);

        return result;

    } catch(error) {
        throw new Error('Unable to create record.', error);
    }
    finally{
        if(connection) connection.release();
    }
}

const updateRecordDb = async (table, data, where) => {
    let connection;
    try{
        connection = await pool.getConnection();

        const setClause = Object.keys()
                        .map(key => `${key} => ?`)
                        .join('? ');
        const values = Object.keys(data);

        const query = `UPDATE TABLE ${table} SET ${setClause} WHERE ${where}`
        const [result] = await connection.execute(query, values);

        return result;
    } catch(error) {
        throw new Error('Unable to update record.', error);
    } finally {
        if(connection) connection.release();
    }
}


const deleteRecordDb = async (table, where) => {
    let connection;
    try{

        connection = await pool.getConnection();

        const query = `DELETE FROM ${table} WHERE ${where}`;
        const [result] = connection.execute(query);

        return result;

    } catch(error) {
        throw new Error('Unable to create record.', error);
    } finally {
        if(connection) connection.release();
    }
}

const readRecordDb = async (table, columns = ['*'], whereClause = '', whereValues = []) => {
    let connection;
    try {
        connection = await pool.getConnection();

        // Prepare the query
        const query = `SELECT ${columns.join(', ')} FROM ${table} ${whereClause ? `WHERE ${whereClause}` : ''}`;
        
        // Execute the query with values
        const [rows] = await connection.execute(query, whereValues);

        return rows;
    } catch (error) {
        console.error('Error reading record:', error.message);
        throw new Error(`Unable to read record: ${error.message}`);
    } finally {
        if (connection) connection.release();
    }
};


const handleOTP = async  (mobileOrEmail, otp, expirydate = null, action) => {
        try {
            if (!mobileOrEmail || typeof otp !== 'number' || !['store', 'verify'].includes(action)) {
                return { success: false, message: "Invalid input parameters" };
            }
    
            if (action === "store") {
                const [existing] = await pool.query(
                    "SELECT otp FROM tbl_auth_otp WHERE mobile_or_email = ?", 
                    [mobileOrEmail]
                );
                
                if (existing.length > 0) {
                    await pool.query("UPDATE tbl_auth_otp SET otp = ?, expired_at = ? WHERE mobile_or_email = ?", [otp, formattedDateTime(expirydate) || null, mobileOrEmail]);
                    return { success: true, message: "OTP updated successfully" };
                } else {
                    await pool.query("INSERT INTO tbl_auth_otp (mobile_or_email, otp, expired_at) VALUES (?, ?, ?)", [mobileOrEmail, otp, formattedDateTime(expirydate)]);
                    return { success: true, message: "OTP stored successfully" };
                }
            }
            
            if (action === "verify") {
                const [rows] = await pool.query(
                    "SELECT otp FROM tbl_auth_otp WHERE mobile_or_email = ? AND otp = ?", 
                    [mobileOrEmail, otp]
                );
                
                if (rows.length === 0) {
                    return { success: false, message: "Invalid OTP" };
                }
                
                await pool.query("UPDATE tbl_auth_otp SET otp = '', expired_at = '' WHERE mobile_or_email = ?", [mobileOrEmail]);
                return { success: true, message: "OTP verified and removed successfully" };
            }
        } catch (error) {
            console.error("OTP Error:", error);
            return { success: false, message: "Database error" };
        }
};


export { insertRecordsDb, readRecordDb, updateRecordDb, deleteRecordDb, handleOTP}