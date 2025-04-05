import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const encodedAuth = Buffer.from(`${process.env.AADHAR_API_KEY}:${process.env.AADHAR_SECRETE_KEY}`).toString("base64");


const BASE_URL = "https://ippocloud.com/api/v1/uidai/aadhaar-authentication";

async function initiateTransaction() {
    try {

        const response = await axios.get(`${BASE_URL}/initiate-transaction`, {
            headers: {
                "Authorization": `Basic ${encodedAuth}`,
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Transaction API Error:", error.response?.data || error.message);
        throw new Error("Error initiating transaction: " + JSON.stringify(error.response?.data || error.message));
    }
}


export const requestOtp = async (req, res) => {
    try {
        const { aadhaarNumber } = req.body;
        const transaction = await initiateTransaction();
      
        const data = {
            transaction_id: transaction.transaction_id,
            aadhaar_number: aadhaarNumber,
            captcha_value: "dummyCaptcha",
        };
        const response = await axios.post(`${BASE_URL}/request-otp`, data, {
            headers: {
                "Authorization" : `Basic ${encodedAuth}`,
                "Content-Type": "application/json",
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error requesting OTP: " + error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { transaction_id, otp_value } = req.body;
        const data = { transaction_id, otp_value };
        const response = await axios.post(`${BASE_URL}/verify-otp`, data, {
            headers: {
                "Authorization" : `Basic ${encodedAuth}`, 
                "Content-Type": "application/json",
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error verifying OTP: " + error.message });
    }
};
