import jwt from 'jsonwebtoken';
import validator from 'validator';
import axios from 'axios';

import pool from '../config/db.js';

import dotenv from 'dotenv';

dotenv.config();

import { badRequestResponse, internalServerResponse, successResponse, successWithDataResponse } from '../utils/response.js';
import { registerUserValidator } from './validators/authValidator.js';
import { sendMailTemplate, renderEmailTemplate } from '../config/nodemailer.js';

const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
const otpStore = {};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

const formatPhoneNumber = (mobile) => {
  if (typeof mobile !== 'string') {
    mobile = String(mobile);
  }
  return mobile.replace(/\D/g, '');
};


export const sendOtpToMobile = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return badRequestResponse(res, "Mobile number is required.")
  }

  try {

    const formattedMobile = formatPhoneNumber(mobile);
    console.log(`Formatted mobile number: ${formattedMobile}`);

    const otp = generateOtp();
    otpStore[formattedMobile] = { otp, expiry: Date.now() + OTP_EXPIRY_TIME };
    console.log(`Generated OTP: ${otp}`);
    console.log(`Stored OTP with expiry: ${JSON.stringify(otpStore[formattedMobile])}`);

    const payload = new URLSearchParams({
      channel: 'whatsapp',
      'src.name': '8sqftwebApp',  // Customize as per your app
      source: process.env.GUPSHUP_WHATSAPP_NUMBER,  // Your WhatsApp number in Gupshup
      destination: formattedMobile,  // Customer's phone number
      // app_id: process.env.GUPSHUP_APP_ID,  // Your Gupshup app ID
      template: JSON.stringify({
        id: '3bb3fa08-6958-427e-82ea-91026982980c',  // Gupshup template ID (Authentication OTP template)
        params: [otp, otp],  // OTP as the parameter to replace {{1}} in the template
      }),
    });

    console.log(`Final payload (URL-encoded): ${payload}`);

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

    console.log('Gupshup API Response:', gupshupResponse);

    if (gupshupResponse.data.status === 'submitted') {

      return successWithDataResponse(res, true, 'OTP sent to WhatsApp.', gupshupResponse.data)

    } else {
      console.error('Error from Gupshup API:', gupshupResponse.data);
      throw new Error(gupshupResponse.data.message || 'Failed to send OTP');
    }
  } catch (error) {
    console.error('Error while sending OTP:', error);
    return internalServerResponse(res, false, 'Failed to send OTP due to an internal error..', error.message);
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
    return res.status(400).json({ message: 'OTP expired' });
  }

  try {
    if (parseInt(otp, 10) === storedOtp) {

      const userQuery = 'SELECT * FROM tbl_users WHERE mobile = ?';
      const [user] = await pool.query(userQuery, [mobile]);

      console.log(user[0]);
      if (user.length === 0) {
        return res.status(200).json({
          status: true,
          message: 'User not found, please register.',
          needToRegister: true,
          mobile,
        });
      }
      else {

        const tokenData = { id: user[0].id, mobile, first_name: user[0].fname, last_name: user[0].lname, mobile: user[0].mobile };
        const newToken = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
        console.log(newToken, tokenData)
        data['token'] = newToken;
        delete otpStore[formattedMobile];
        return successWithDataResponse(res, true, 'Login successful.', data);
      }
    } else {
      return badRequestResponse(res, false, 'Invalid OTP.');
    }
  }
  catch (error) {
    console.error('Error while verify OTP:', error);
    return internalServerResponse(res, false, 'Failed to verify OTP due to an internal error.', error.message);
  }

};

export const sendOtpToEmail = async (req, res) => {
  const { email } = req.body;
  console.log(email)
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Please enter email in valid format.' });
  }

  try {
    const otp = generateOtp();
    otpStore[email] = { otp, expiry: Date.now() + OTP_EXPIRY_TIME };
    let data ={};

    const mailOptions = {
      from: `"8Sqft Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Login OTP',
      text: `Your login OTP is: ${otp}`,
    };
    const templateData = await renderEmailTemplate('templates/otpVerification', { name: email, otp: otp, validity: '5' })
    await sendMailTemplate(mailOptions.to, mailOptions.subject, '', templateData)

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
  console.log(email, otp)

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

      console.log(user[0]);
      if (user.length === 0) {
        return res.status(200).json({
          status: true,
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
    return internalServerResponse(res, false, 'Error checking user in database.');
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

    // if (storedOtpData) {
    //   const { expiry } = storedOtpData;
    //   if (Date.now() < expiry) {
    //     return res.status(200).json({
    //       message: 'OTP is still valid, please check your email.',
    //     });
    //   }
    // }

    const otp = generateOtp();
    otpStore[email] = { otp, expiry: Date.now() + OTP_EXPIRY_TIME };

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

export const registerUser = async (req, res) => {
  const { email, first_name, last_name, mobile } = req.body;
  const data = {}
  const errors = registerUserValidator(req.body);
  if (errors.length > 0) {
    return badRequestResponse(res, false, 'Validation message', errors);
  }

  try {
    const userCheckQuery = 'SELECT * FROM tbl_users WHERE email = ?';
    const [user] = await pool.query(userCheckQuery, [email]);

    // console.log(user)
    if (user.length > 0) {
      // return res.status(400).json({ message: 'User already exists' });
      return badRequestResponse(res, false, 'User already exists.')
    }

    const insertQuery = `
      INSERT INTO tbl_users (email, fname, lname, mobile)
      VALUES (?, ?, ?, ?)`;
    const newUser = await pool.query(insertQuery, [email, first_name, last_name, mobile]);
    console.log(newUser);

    const tokenData = { id: newUser[0].insertId, email, first_name, last_name, mobile };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
    data['token'] = token;

    return successWithDataResponse(res, true, 'Registration successful', data);

  } catch (error) {
    console.error('Error registering user:', error);
    return badRequestResponse(res, false, 'Failed to register user', error)
  }
};


export const resendOtpToMobile = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return badRequestResponse(res, "Mobile number is required.");
  }

  try {
    const formattedMobile = formatPhoneNumber(mobile);
    console.log(`Formatted mobile number: ${formattedMobile}`);

    const existingOtp = otpStore[formattedMobile];
    if (existingOtp && Date.now() < existingOtp.expiry) {
      return badRequestResponse(
        res,
        `An OTP was already sent. Please wait before requesting another OTP.`
      );
    }

    const otp = generateOtp();
    otpStore[formattedMobile] = { otp, expiry: Date.now() + OTP_EXPIRY_TIME };
    console.log(`Generated OTP: ${otp}`);
    console.log(`Stored OTP with expiry: ${JSON.stringify(otpStore[formattedMobile])}`);

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

    console.log(`Final payload (URL-encoded): ${payload}`);

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

    console.log('Gupshup API Response:', gupshupResponse);

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

