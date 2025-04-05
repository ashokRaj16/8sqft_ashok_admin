import pool from '../config/db.js';

export const getAllStates = async () => {
    try{
        const [rows] = await pool.execute(`SELECT * FROM tbl_state WHERE status = '1'`);
        return rows;
    }
    catch(error) {
        throw new Error('Unable to fetch entry', error.message);
    } 
};

export const getAllCitiesByState = async () => {
    try{

        const query = `SELECT * FROM tbl_city WHERE status = '1'`;
       
        const [rows] = await pool.execute(query);
        return rows;
    }
    catch(error) {
        throw new Error('Unable to fetch entry.', error);
    } 
};

// ### use join to get states and cities.
export const getDetailsByPostalCode = async (postalcode = null) => {
    try{
        let searchQuery = "";
        if(postalcode) {
            searchQuery += ` WHERE pincode = ${postalcode} AND status = '1'`;
        }
        else {
            searchQuery += " status = '1'"
        }
        const query = `SELECT * FROM tbl_postal_code ${searchQuery}`;
        
        const [rows] = await pool.execute(query, [postalcode]);
        return rows;
    }
    catch(error) {
        throw new Error('Unable to fetch entry.', error);
    } 
};

// use these for update states and delete state (just change status)
export const updateStates = async (id, data) => {
    const { city_name, state_id, status } = data;
    await pool.execute(
        'UPDATE tbl_city SET city_name = ?, state_id = ?, status = ? WHERE id = ?',
        [city_name, state_id, status, id]
    );
    return { id, ...userData };
};

// ### Change state instead of directly deleting states/cities.
export const deleteCity = async (id) => {
    try {
        const result =await pool.execute('DELETE FROM tbl_city WHERE id = ?', [id]);
        return result;
    }
    catch(error) {
        throw new Error('Unable to fetch entry.', error);
    } 
};

export const deleteState = async (id) => {
    try{
        const result = await pool.execute('DELETE FROM tbl_state WHERE id = ?', [id]);
        return result;
    }
    catch(error) {
        throw new Error('Unable to fetch entry.', error);
    }
};
