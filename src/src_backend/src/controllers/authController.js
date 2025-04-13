import jwt from 'jsonwebtoken';
import validator from 'validator';
import axios from 'axios';
import pool from '../config/db.js';

import dotenv from 'dotenv';
dotenv.config();

import { handleOTP } from '../models/commonModel.js';
import { badRequestResponse, internalServerResponse, successResponse, successWithDataResponse } from '../utils/response.js';
import { registerUserValidator } from './validators/authValidator.js';
import { sendMailTemplate, renderEmailTemplate } from '../config/nodemailer.js';
import { formatPhoneNumber } from '../utils/commonHelper.js';

const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
const otpStore = {};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

export const sendOtpToMobile = async (req, res) => {
  const { mobile } = req.body;
 
  if (!mobile) {
  return badRequestResponse(res, "Please enter your mobile number.")
  }
 
  try {
 
  const formattedMobile = formatPhoneNumber(mobile);
 
  const otp = generateOtp();
  const expiryDate = Date.now() + OTP_EXPIRY_TIME;
  otpStore[formattedMobile] = { contact: formattedMobile, otp, expiry: expiryDate };
  const storeResult = await handleOTP(formattedMobile, otp, expiryDate, "store");

  if (!storeResult.success) {
      return internalServerResponse(res, false, "Unable to save the OTP at the moment.", storeResult.message);
  }
 
  const payload = new URLSearchParams({
  channel: 'whatsapp',
  'src.name': '8sqftwebApp', // Customize as per your app
  source: process.env.GUPSHUP_WHATSAPP_NUMBER, // Your WhatsApp number in Gupshup
  destination: formattedMobile, // Customer's phone number
  // app_id: process.env.GUPSHUP_APP_ID, // Your Gupshup app ID
  template: JSON.stringify({
  id: '3bb3fa08-6958-427e-82ea-91026982980c', // Gupshup template ID (Authentication OTP template)
  params: [otp, otp], // OTP as the parameter to replace {{1}} in the template
  }),
  });
 
  const gupshupResponse = await axios.post(
     'https://api.gupshup.io/wa/api/v1/template/msg',
      payload,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
        apikey: process.env.GUPSHUP_API_KEY,
      },
    }
  );
 
  if (gupshupResponse.data.status === 'submitted') {
    otpStore[formattedMobile] = {
        ...otpStore[formattedMobile],
        messageId: gupshupResponse.data.messageId,
        flag: "W"
    };
    return successWithDataResponse(res, true, `We've sent an OTP to your WhatsApp number.`, gupshupResponse.data)
 
  } else {

  console.error('Error from Gupshup API:', gupshupResponse.data);
  throw new Error(gupshupResponse.data.message || 'Something went wrong while sending your OTP.');
  }
  } catch (error) {
  console.error('Oops! There was an error while sending your OTP. Please try again.', error);
  return internalServerResponse(res, false, 'Sorry! An internal error prevented us from sending the OTP.', error.message);
  }
 };


export const verifyMobileOtp = async (req, res) => {
  const { mobile, otp } = req.body;
  let data = {};

  const formattedMobile = formatPhoneNumber(mobile);
  const storedOtpData = otpStore[formattedMobile];

  if (!storedOtpData) {
    return badRequestResponse(res, false, 'OTP not found or expired.');
  }

  const { otp: storedOtp, expiry } = storedOtpData;

  if (Date.now() > expiry) {
    delete otpStore[formattedMobile];
    return badRequestResponse(res, false, "Otp expired, please click on resend.")
  }

  try {
    if (parseInt(otp, 10) === storedOtp) {
      const userQuery = 'SELECT * FROM tbl_users WHERE mobile = ?';
      const [user] = await pool.query(userQuery, [mobile]);

      await handleOTP(mobile, otp, undefined, "verify"); 
      if (user.length === 0) {
        let data = {
          needToRegister: true,
          mobile,
        }
        return successWithDataResponse(res, true, "User not found, Registration required.", data)
      }

      // Check user status
      const userStatus = user[0].status;
    
      if (userStatus !== "1") {
        return badRequestResponse(res, false, "Could not login. Account is inactive or blocked, please contact admin to reactivate.")
      }

      // Generate token only if user is active (status = 1)
      const tokenData = {
        id: user[0].id,
        email: user[0]?.email,
        first_name: user[0].fname,
        last_name: user[0].lname,
        mobile: user[0]?.mobile,
      };

      const newToken = jwt.sign(tokenData, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
      });

      data['token'] = newToken;
      delete otpStore[formattedMobile];

      return successWithDataResponse(res, true, 'Login successful.', data);
    } else {
      return badRequestResponse(res, false, 'Invalid OTP.');
    }
  } catch (error) {
    console.error('Error while verifying OTP:', error);
    return internalServerResponse(
      res,
      false,
      'Failed to verify OTP due to an internal error.',
      error.message
    );
  }
};

/**
 * Mobile verification for dashboard profile : 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const verifyMobile = async (req, res) => {
  const { mobile, otp } = req.body;
  let userId = req.userId;

  if (!mobile) {
    return badRequestResponse(res, false, 'Please enter mobile number.');
  }

  if (!otp) {
    return badRequestResponse(res, false, 'Please enter OTP.');
  }

  const formattedMobile = formatPhoneNumber(mobile);
  const storedOtpData = otpStore[formattedMobile];

  if (!storedOtpData) {
    return badRequestResponse(res, false, 'OTP not found or expired.');
  }

  const { otp: storedOtp, expiry } = storedOtpData;

  if (Date.now() > expiry) {
    delete otpStore[formattedMobile];
    return res.status(400).json({ message: 'OTP expired' });
  }

  try {
    if (parseInt(otp, 10) === storedOtp) {

      const updateUserQuery = `UPDATE tbl_users SET is_mobile_verified = '1' WHERE mobile = ?`;
      await pool.query(updateUserQuery, [mobile]);

     const [user] = await pool.query(
        'SELECT mobile, is_mobile_verified FROM tbl_users WHERE id = ?',
        [userId]
      );

      if (user.length === 0) {
        return badRequestResponse(res, false, 'User not found.');
      }

      const existingMobile = user[0].mobile;
      const isVerified = user[0].is_mobile_verified;
      let updateQuery;
      let queryParams;
      
      if (existingMobile && existingMobile !== mobile) {
        updateQuery = `UPDATE tbl_users SET mobile = ?, is_mobile_verified = '1' WHERE id = ?`;
        queryParams = [mobile, userId];
      }


      if (existingMobile && !isVerified) {
       updateQuery = `UPDATE tbl_users SET is_mobile_verified = '1' WHERE id = ?`;
        queryParams = [userId];
      } else if (!existingMobile) {
        updateQuery = `UPDATE tbl_users SET is_mobile_verified = '1' WHERE id = ?`;
        queryParams =  [userId];
      } else {
        return badRequestResponse(res, false, 'Mobile number is already verified.');
      }

      await pool.query(updateQuery, queryParams);

      await handleOTP(mobile, otp, undefined, "verify"); 

      return res.status(200).json({
        status: true,
        message: 'Mobile Verified Successfully',
        mobile,
      });
    } else {
      return badRequestResponse(res, false, 'Invalid OTP.');
    }
  } catch (error) {
    console.error('Error while verifying OTP:', error);
    return internalServerResponse(res, false, 'Failed to verify OTP due to an internal error.', error.message);
  }
};

export const sendOtpToEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Please enter email in valid format.' });
  }

  try {
    const otp = generateOtp();
    const expiryDate = Date.now() + OTP_EXPIRY_TIME;
    otpStore[email] = { contact: email, otp, expiry: expiryDate };
    let data ={};

    const storeResult = await handleOTP(email, otp, expiryDate, "store"); 

    if (!storeResult.success) {
      return internalServerResponse(res, false, "Failed to store OTP.", storeResult.message);
    }

    const mailOptions = {
      from: `"8Sqft Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Login OTP',
      text: `Your login OTP is: ${otp}`,
    };

    const templateData = await renderEmailTemplate('templates/otpVerification', { name: email, otp: otp, validity: '5' })
    await sendMailTemplate(mailOptions.to, mailOptions.subject, '', templateData)
    otpStore[email] = {
      ...otpStore[email],
      flag: "E"
    };

    data['ismail'] = true;
    return successWithDataResponse(res, true, 'OTP sent to email.', data);

  } catch (error) {
    console.error('Error while sending OTP:', error);
    return badRequestResponse(res, false, 'Failed to send OTP.', error);
  }
};

export const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;
  const data = {}

  if (!email) {
    return badRequestResponse(res, false, 'Please enter email.');
  }

  if (!otp) {
    return badRequestResponse(res, false, 'Please enter otp.');
  }

  if (email && !validator.isEmail(email)) {
    return badRequestResponse(res, false, 'Please enter valid email.');
  }

  const storedOtpData = otpStore[email];
  if (!storedOtpData) {
    return badRequestResponse(res, false, 'OTP not found or expired');
  }

  const { otp: storedOtp, expiry } = storedOtpData;

  if (Date.now() > expiry) {
    delete otpStore[email];
    return badRequestResponse(res, false, 'OTP expired.');
  }

  try {
    if (parseInt(otp, 10) === storedOtp) {
      const userQuery = 'SELECT * FROM tbl_users WHERE email = ?';
      const [user] = await pool.query(userQuery, [email]);

      await handleOTP(email, otp, undefined, "verify"); 

      if (user.length === 0) {
        return res.status(200).json({
          status: true,
          flag: 'E',
          message: 'User not found, please register.',
          needToRegister: true,
          email,
        });

      } else {
        const tokenData = { id: user[0].id, email, first_name: user[0].fname, last_name: user[0].lname, mobile: user[0].mobile };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
        data['token'] = token;
        return successWithDataResponse(res, true, 'Login successful', data);
      }
    } else {
      return badRequestResponse(res, false, 'Invalid OTP.');
    }
  } catch (error) {
    console.error('Database error:', error);
    return internalServerResponse(res, false, 'An error occurred while checking the user in the database.');
  }
};


/**
 * email verification for dashboard profile
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  const userId = req.userId;

  if (!email) {
    return badRequestResponse(res, false, 'Please enter email.');
  }

  if (!otp) {
    return badRequestResponse(res, false, 'Please enter OTP.');
  }

  if (!validator.isEmail(email)) {
    return badRequestResponse(res, false, 'Please enter a valid email.');
  }

  const storedOtpData = otpStore[email];
  if (!storedOtpData) {
    return badRequestResponse(res, false, 'OTP not found or expired.');
  }

  const { otp: storedOtp, expiry } = storedOtpData;

  if (Date.now() > expiry) {
    delete otpStore[email];
    return badRequestResponse(res, false, 'OTP expired.');
  }

  try {
    if (parseInt(otp, 10) === storedOtp) {
      // Fetch user details along with status
      const [user] = await pool.query(
        'SELECT email, is_email_verified, status FROM tbl_users WHERE id = ?',
        [userId]
      );

      if (user.length === 0) {
        return badRequestResponse(res, false, 'User not found.');
      }

      const userStatus = user[0].status;

      // Check if user is active (status = 1)
      if (userStatus !== 1) {
        return res.status(403).json({
          status: false,
          message: `Could not verify email. User status: ${userStatus}`,
        });
      }

      const existingEmail = user[0].email;
      const isVerified = user[0].is_email_verified;
      let updateQuery;
      let queryParams;

      if (existingEmail && existingEmail !== email) {
        updateQuery = `UPDATE tbl_users SET email = ?, is_email_verified = '1' WHERE id = ?`;
        queryParams = [email, userId];
      } else if (!isVerified) {
        updateQuery = `UPDATE tbl_users SET is_email_verified = '1' WHERE id = ?`;
        queryParams = [userId];
      } else {
        return badRequestResponse(res, false, 'Email is already verified.');
      }

      await pool.query(updateQuery, queryParams);

      await handleOTP(email, otp, "verify"); 

      return res.status(200).json({
        status: true,
        message: 'Email Verified Successfully',
        email,
      });
    } else {
      return badRequestResponse(res, false, 'Invalid OTP.');
    }
  } catch (error) {
    console.error('Error while verifying email:', error);
    return internalServerResponse(
      res,
      false,
      'Failed to verify email due to an internal error.',
      error.message
    );
  }
};

export const resendOtpToEmail = async (req, res) => {
  const { email } = req.body;
  let data = {};
  if (!email) {
    return badRequestResponse(res, false, 'Email is required.');
  }

  if (email && !validator.isEmail(email)) {
    return badRequestResponse(res, false, 'Please enter valid email.');
  }

  try {
    const storedOtpData = otpStore[email];


    const otp = generateOtp();
    otpStore[email] = { otp, expiry: Date.now() + OTP_EXPIRY_TIME };

    await handleOTP(email, otp, "store"); 

    await transporter.sendMail({
      from: `"8Sqft Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your New Login OTP',
      text: `Your new login OTP is: ${otp}`,
    });
    data['ismail'] = true;

    return successWithDataResponse(res, true, 'OTP resent to email.', data);
  } catch (error) {
    console.error('Error while resending OTP:', error);
    return badRequestResponse(res, false, 'Failed to resend OTP.');
  }
};

export const resendOtpToMobile = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return badRequestResponse(res, "Mobile number is required.");
  }

  try {
    const formattedMobile = formatPhoneNumber(mobile);

    const existingOtp = otpStore[formattedMobile];
    if (existingOtp && Date.now() < existingOtp.expiry) {
      return badRequestResponse(
        res,
        `An OTP was already sent. Please wait before requesting another OTP.`
      );
    }

    const otp = generateOtp();
    const expiryDate = Date.now() + OTP_EXPIRY_TIME;
    otpStore[formattedMobile] = { otp, expiry: expiryDate };

    await handleOTP(mobile, otp, expiryDate, "store"); 

    const payload = new URLSearchParams({
      channel: 'whatsapp',
      'src.name': '8sqftwebApp', 
      source: process.env.GUPSHUP_WHATSAPP_NUMBER,
      destination: formattedMobile, 
      template: JSON.stringify({
        id: '3bb3fa08-6958-427e-82ea-91026982980c',
        params: [otp, otp],
      }),
    });

    const gupshupResponse = await axios.post(
      'https://api.gupshup.io/wa/api/v1/template/msg',
      payload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
          apikey: process.env.GUPSHUP_API_KEY,
        },
      }
    );

    if (gupshupResponse.data.status === 'submitted') {
      return successWithDataResponse(res, true, 'OTP resent to WhatsApp.', gupshupResponse.data);
    } else {
      console.error('Error from Gupshup API:', gupshupResponse.data);
      throw new Error(gupshupResponse.data.message || 'Failed to resend OTP');
    }
  } catch (error) {
    console.error('Error while resending OTP:', error);
    return internalServerResponse(res, false, 'Failed to resend OTP due to an internal error.', error.message);
  }
};

export const registerUser = async (req, res) => {
  const { email, first_name, last_name, mobile, flag } = req.body;
  const data = {};
  const errors = registerUserValidator(req.body);

  if (errors.length > 0) {
    return badRequestResponse(res, false, "Validation message", errors);
  }

  try {
    let users;
    if (email || mobile) {
      const userCheckQuery = "SELECT * FROM tbl_users WHERE email = ? OR mobile = ?";
      const [results] = await pool.query(userCheckQuery, [email || null, mobile || null]);
      users = results;
    }

    if (users.length > 0) {
      return badRequestResponse(res, false, "User already exists.");
    }
    const storeData = otpStore[email || mobile] || {};

    const is_email_verified = storeData?.flag === "E" ? "1" : "0";
    const is_mobile_verified = (storeData?.flag === "M" || storeData?.flag === "W" ) ? "1" : "0";
    const is_wa_number = storeData?.flag === "W" ? "1" : "0";

    const insertQuery = `
      INSERT INTO tbl_users (email, fname, lname, mobile, is_email_verified, is_mobile_verified, is_wa_number)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const newUser = await pool.query(insertQuery, [
      email || null,
      first_name || null,
      last_name || null,
      mobile || null,
      is_email_verified,
      is_mobile_verified,
      is_wa_number, 
    ]);

    const tokenData = {
      id: newUser[0].insertId,
      email: email || null,
      first_name,
      last_name,
      mobile: mobile || null,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
    data["token"] = token;
    delete otpStore[email || mobile];

    return successWithDataResponse(res, true, "Registration successful", data);
  } catch (error) {
    console.error("Error registering user:", error);
    return badRequestResponse(res, false, "Failed to register user", error);
  }
};

export const messageCallback = (req, res) => {
  const { app, timestamp, version, type, payload } = req.body;
  const { id, gsId, type: eventType, destination, payload: eventPayload } = payload;
  switch (eventType) {
      case "enqueued":
          break;
      case "failed":
            const storeData = Object.entries(otpStore);
            
            // Find the key where messageId matches gsId
            let keyDestination = storeData.find(([key, value]) => value.messageId === gsId);

            if (keyDestination) {
                const [key, value] = keyDestination;
                otpStore[key] = { 
                  ...otpStore[key], 
                  flag: "M"
              };

                if (otpStore[key]?.contact) {
                    sendTextMessage(otpStore[key].contact);
                }
            } else {
            }
          break;
      default:
  }

  res.status(200).json({ success: true, message: "Webhook received" });
};

export const sendTextMessage = async (mobile = '') => {
    try {
        if (!mobile) {
            throw new Error("Mobile number is required.");
        }

        const formattedMobile = formatPhoneNumber(mobile);

        const otp = generateOtp();
        const expiryDate = Date.now() + OTP_EXPIRY_TIME
        otpStore[formattedMobile] = { 
          ...otpStore[formattedMobile],
          otp, expiry: expiryDate };

        await handleOTP(formattedMobile, otp, expiryDate, "store"); 

        const API_URL = 'https://www.textguru.in/api/v22.0/';
        const USERNAME = process.env.TEXTGURU_USERNAME;
        const PASSWORD = process.env.TEXTGURU_PASSWORD;
        const SOURCE = 'ETSQFT';
        const DLTTEMPID = `${process.env.TEXTGURU_TEMPID}`;

        const MESSAGE = `Your OTP for verification is: ${otp}, Please use this OTP to complete your login/authentication on www.8sqft.com`;
        const apiEndpoint = `${API_URL}?username=${USERNAME}&password=${PASSWORD}&source=${SOURCE}&dmobile=${formattedMobile}&dlttempid=${DLTTEMPID}&message=${encodeURIComponent(MESSAGE)}`;
   
        const response = await axios.get(apiEndpoint);

        if (response.status === 200 ) {
          const responseData = response.data;
            if (responseData.includes('MsgID')) {
                return 'Message sent successFully';
            } else {
                return 'Message sent successFully'
            }
        } else {
            return 'Error from TextGuru API'
        }
    } catch (error) {
        return { success: false, message: "Failed to send OTP.", error: error.message };
    }
};

export const messageCallbackForPromo = (req, res) => {

  const { app, timestamp, version, type, payload } = req.body;
  const { id, gsId, type: eventType, destination, payload: eventPayload } = payload;
  console.log("returned Response ----", req.body);

  switch (eventType) {
      case "enqueued":
          break;
      case "failed":
          break;
      default:
  }

  res.status(200).json({ success: true, message: "Webhook Promo received" });
};