import pool from '../../config/db.js';
import axios from 'axios';

import { renderEmailTemplate } from '../../config/nodemailer.js';
import { sendMailTemplate } from '../../config/nodemailer.js';

import { getSearchDropDownLocationByKey, getRecommendationData, getSpotlightData } from '../../models/homeModels.js';
import { badRequestResponse, successResponse, successWithDataResponse } from '../../utils/response.js';
import { getPropertyCountByIds } from '../../models/propertyModels.js';
import { formatPhoneNumber } from '../../utils/commonHelper.js';

export const getSearchDropDownLocations = async (req, res) => {
  try {
    const { searchKeyword, city, searchLimit } = req.query;

    const result = await getSearchDropDownLocationByKey(searchKeyword, city, searchLimit);


    if(result) {
      return successWithDataResponse( res, true, "Search list.", result);
    }
  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, "Error fetching locations.", error)
  }
};

export const getAgreementDetails = async (req, res) => {
    const { id } = req.params;
    try {
      const query  = "SELECT * FROM tbl_rent_agreement_enquiry WHERE id = ?";
      const [rows] = await pool.query(query, [id]);
      if (rows.length === 0) {
        return res.status(404).send("Agreement not found");
      }
      res.render("agreementDetails", { agreementDetails: rows[0] });
    } catch (error) {
      console.error("Database Error:", error);
      res.status(500).send("Failed to fetch agreement details");
    }
};

export const getHomeCountInfo = async (req, res) => {
  try {
    const userCountQuery = "SELECT COUNT(*) AS userCount FROM tbl_users";
    const propertyCountQuery = "SELECT COUNT(*) AS propertyCount FROM tbl_property";
    const savedBrokerageQuery = `
      SELECT 
        SUM(
          CASE 
            WHEN property_rent_buy = 'RENT' THEN rent_amount
            ELSE 0
          END
        ) AS totalSavedBrokerage
      FROM tbl_property
    `;
    
    const [[userCountResult], [propertyCountResult], [savedBrokerageResult]] = await Promise.all([
      pool.query(userCountQuery),
      pool.query(propertyCountQuery),
      pool.query(savedBrokerageQuery),
    ]);

    const userCount = userCountResult[0]?.userCount || 0;
    const propertyCount = propertyCountResult[0]?.propertyCount || 0;
    let totalSavedBrokerage = savedBrokerageResult[0]?.totalSavedBrokerage || 0;

    // Alternate totalSavedBrokerage value
    totalSavedBrokerage = totalSavedBrokerage % 2 === 0 ? totalSavedBrokerage + 5000 : totalSavedBrokerage - 5000;

    // Calculate brokerageSavedStatic
    const now = new Date();
    const baseDate = new Date(2025, 0, 1);
    const daysElapsed = Math.floor((now.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    const brokerageSavedStatic = daysElapsed * 100000;

    // Construct the data object
    const data = {
      totalSavedBrokerage : brokerageSavedStatic || 0,
      userCount: userCount + 100000 || 0,
      propertyCount: propertyCount || 0,
      // brokerageSavedStatic, // Update new counter in data state
    };

    successWithDataResponse(res, true, "Common info fetched successfully", data);
  } catch (error) {
    console.error("Database Error:", error);
    return badRequestResponse(res, false, "Failed to fetch data");
  }
};


export const contact_us = async (req, res) => {
  try {
    const { full_name, email, phone, message } = req.body;

    const user_host = req.headers.host || null;
    const user_agent = req.headers['user-agent'] || null;
    const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;

    const query = `
      INSERT INTO tbl_contact_us (full_name, email, phone, message, user_host, user_agent, ip_address) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [ result ] = await pool.query(query, [full_name, email, phone, message, user_host, user_agent, ip_address]);

    if (!result || result.affectedRows === 0) {
      return badRequestResponse(res, false, "Failed to submit contact us form", 'Insert failed');
    }
     const data = {id : result.insertId }; 
    successWithDataResponse(res, true, "Contact us form submitted successfully!", data);
  } catch (error) {
    console.error('Database Error:', error);
      return badRequestResponse(res, false, "Failed to submit contact us form", error);
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const query = `SELECT * FROM tbl_contact_us ORDER BY id DESC`;
    const [results] = await pool.query(query);

    if (!results || results.length === 0) {
      return badRequestResponse(res, false, "No contact records found", "No data");
    }

    successWithDataResponse(res, true, "Contact records fetched successfully!", results);
  } catch (error) {
    console.error("Database Error:", error);
    return badRequestResponse(res, false, "Failed to fetch contact records", error);
  }
};

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return badRequestResponse(res, false, "Contact ID is required", "Invalid input");
    }

    const query = `SELECT * FROM tbl_contact_us WHERE id = ?`;
    const [results] = await pool.query(query, [id]);

    if (!results || results.length === 0) {
      return badRequestResponse(res, false, `No contact found with ID: ${id}`, "Not found");
    }

    successWithDataResponse(res, true, "Contact record fetched successfully!", results[0]);
  } catch (error) {
    console.error("Database Error:", error);
    return badRequestResponse(res, false, "Failed to fetch contact record", error);
  }
};

/**
 * get recommendation 
 * @param {amount, area, city_name, property_type} req 
 * @param {*} res 
 * @returns 
 */
export const getRecommendations = async (req, res) => {
  try {
    const { amount, area, city_name, property_type, property_rent_buy, limit } = req.query;

    const recommendations = await getRecommendationData(amount, area, city_name, property_type, property_rent_buy, limit);

    if (!recommendations || recommendations.length === 0) {
      return badRequestResponse(res, false, "No recommendations found for the given criteria.");
    }
    return successResponse(res, true, 'Recommended properties retrieved successfully.', recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return badRequestResponse(res, false, "Error fetching recommendations", error);
  }
};

export const getSpotlight = async (req, res) => {
  try {
    const { categories, limit } = req.query;

    let spotlights = await getSpotlightData(limit, categories);
    let ids = spotlights.map((i)=> `${i.id}`)
    let resultCountProperty = await getPropertyCountByIds(ids);

    let newSpotlight = spotlights.map((item) => {
      let findProperty = resultCountProperty.find((i) => i.property_id === item.id);
      if (findProperty) {
        return {
          ...item,
          unique_view_count:
            (item.unique_view_count || 0) +
            (findProperty?.views || 0)
        };
      }
      return item;
    });

    
    if (!spotlights || spotlights.length === 0) {
      return badRequestResponse(res, false, "No spolight found for the given criteria.");
    }
    return successResponse(res, true, 'Spotlight properties retrieved successfully.', newSpotlight);
  } catch (error) {
    console.error('Error fetching spotlight:', error);
    return badRequestResponse(res, false, "Error fetching spotlights.", error);
  }
};

export const contactSendMail = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.userId;

    if (!propertyId) {
      return badRequestResponse(res, false, "Property ID is required");
    }
    
    const userQuery = 'SELECT fname, lname, email, mobile FROM tbl_users WHERE id = ?';
    const [userResult] = await pool.query(userQuery, [userId]);


    if (userResult.length === 0) {
      return badRequestResponse(res, false, "User not found");
    }

    // const userEmail = userResult[0].email;

    const ownerQuery = `SELECT users.fname, users.lname, users.email, users.mobile, properties.user_id, properties.id,
      properties.property_title, properties.description, properties.rent_amount, properties.city_name, properties.property_type,
      properties.status 
      FROM tbl_property as properties 
      INNER JOIN tbl_users as users ON properties.user_id = users.id
      WHERE properties.id = ?`;
    const [ownerResult] = await pool.query(ownerQuery, [propertyId]);
      
   
    if (ownerResult.length === 0) {
          return badRequestResponse(res, false, "Property owner not found");
    }

    // const { name: ownerName, email: ownerEmail, phone: ownerPhone } = ownerResult[0];

    const mailOptions = {
      from: `"8Sqft Team" <${process.env.SMTP_USER}>`, 
      to: 'ashokambore1@8sqft.com',
      subject: 'Property Contact Shared',
      text: `Here is contact details`, 
    };
    
    const mailParams = { cusName : userResult[0].fname, onwerName : ownerResult[0].fname, email: ownerResult[0].email,  phone : ownerResult[0].mobile, propertyName: ownerResult[0].property_title, address: ownerResult[0].city_name }
    const templateTenantData = await renderEmailTemplate('templates/contactShareTenant', mailParams)
    // const mailOwnerParams = { onwerName : 'kolte Patil', cusName : "Ashok",  email: "ashokambore16@gmail.com",  phone : "7767944781", propertyName: "123", address: 'Nashik Road' }
    const mailOwnerParams = { onwerName : ownerResult[0].fname, cusName : userResult[0].fname, email: ownerResult[0].email,  phone : ownerResult[0].mobile, propertyName: ownerResult[0].property_title, address: ownerResult[0].city_name }
    const templateOwnerData = await renderEmailTemplate('templates/contactShareOwner', mailOwnerParams)

    setImmediate(async () => { 
      try {
        if(userResult[0].email && ownerResult[0].email) {
          await sendMailTemplate(userResult[0].email, mailOptions.subject, '', templateTenantData);
          await sendMailTemplate(ownerResult[0].email, mailOptions.subject, '', templateOwnerData);
        }
 
      } catch (error) {
        console.error('Error sending email:', error);
      }
    });

    return successResponse(res, true, 'Contact details shared via email.');

  } catch (error) {
    console.error('Error in viewContact:', error);
    return badRequestResponse(res, false, "Error fetching properties.", error);
    
  }
};

export const contactSendWhatsApp = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.userId;

    if (!propertyId) {
      return badRequestResponse(res, false, "Property Id is required");
    }

    const userQuery = 'SELECT fname, lname, email, mobile, is_wa_number FROM tbl_users WHERE id = ?';
    const [userResult] = await pool.query(userQuery, [userId]);

    if (userResult.length === 0) {
      return badRequestResponse(res, false, "User not found");
    }

    const user = userResult[0];

    const ownerQuery = `
      SELECT users.fname, users.lname, users.email, users.mobile, users.is_wa_number, 
      properties.user_id, properties.id, properties.property_title, properties.description, 
      properties.rent_amount, properties.city_name, properties.property_type, properties.status
      FROM tbl_property as properties 
      INNER JOIN tbl_users as users ON properties.user_id = users.id
      WHERE properties.id = ?`;

    const [ownerResult] = await pool.query(ownerQuery, [propertyId]);

    if (ownerResult.length === 0) {
      return badRequestResponse(res, false, "Property owner not found");
    }

    const owner = ownerResult[0];
   
    let userResponse, ownerResponse;
    const gupshupApiKey = process.env.GUPSHUP_API_KEY;

    if(user.is_wa_number === "1") {
      const userPayload = new URLSearchParams({
        channel: 'whatsapp',
        'src.name': 'pramoton8sqft',
        source: process.env.GUPSHUP_WHATSAPP_NUMBER_PROMO,
        destination: `91${user.mobile}`,
        template: JSON.stringify({
          id: 'f2a6532e-6b32-483b-b8d7-7e801afed7d0',
          params: [user.fname, owner.property_title, owner.fname, owner.mobile],
        }),
      });

      userResponse = await axios.post(
        'https://api.gupshup.io/wa/api/v1/template/msg',
        userPayload,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
            apikey: gupshupApiKey,
          },
        }
      );
    }
    if(owner.is_wa_number === "1") {
       const ownerPayload = new URLSearchParams({
        channel: 'whatsapp',
        'src.name': 'pramoton8sqft',
        source: process.env.GUPSHUP_WHATSAPP_NUMBER_PROMO,
        destination: `91${owner.mobile}`,
        template: JSON.stringify({
          id: '62820aa7-2f74-4566-bf9f-4107269f1992',
          params: [owner.fname, owner.property_title, user.fname, user.mobile],
        }),
      });

      ownerResponse = await axios.post(
        'https://api.gupshup.io/wa/api/v1/template/msg',
        ownerPayload,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
            apikey: gupshupApiKey,
          },
        }
      );
    }
    if(user.is_wa_number === "0") {
      userResponse = await sendCustomerMessage(user.mobile, user.fname, owner.property_title, owner.fname, owner.mobile);
    }
    if(owner.is_wa_number === "0") {
      ownerResponse = await sendBuilderMessage(owner.mobile, owner.fname, user.fname, owner.property_title, user.mobile);
    }


    if ((ownerResponse.data?.status === 'submitted' || userResponse.data?.status === "submitted") || (ownerResponse.status === 200 || userResponse.status === 200)) {
      await handleInterestTracking(userId, propertyId);
      return successResponse(res, true, 'Contact details exchanged via Whatsapp/SMS.');
    }
    return badRequestResponse(res, false, 'Unable to exchanged contacts.');

  } catch (error) {
    console.error('Error in contactSendWhatsApp:', error);
    return badRequestResponse(res, false, 'Failed to exchange contact details via WhatsApp/SMS', error);
  }
};

const handleInterestTracking = async (userId, propertyId) => {
  const checkInterestQuery = 'SELECT * FROM tbl_property_intrest WHERE user_id = ?';
  const [interestResult] = await pool.query(checkInterestQuery, [userId]);

  const currentDate = new Date().toISOString().split('T')[0];

  if (interestResult.length > 0) {
    let existingPropertyIds = JSON.parse(interestResult[0].property_id || '[]');
    const propertyExists = existingPropertyIds.some(item => item.pid === propertyId);

    if (!propertyExists) {
      existingPropertyIds.push({ pid: propertyId, date: currentDate });
      const updatedPropertyIds = JSON.stringify(existingPropertyIds);

      const updateInterestQuery = 'UPDATE tbl_property_intrest SET property_id = ? WHERE user_id = ?';
      await pool.query(updateInterestQuery, [updatedPropertyIds, userId]);
    }

  } else {
    let propertyIds = { pid: propertyId, date: currentDate };
    const updatedPropertyIds = JSON.stringify([propertyIds]);
    const createInterestQuery = 'INSERT INTO tbl_property_intrest (user_id, property_id) VALUES (?, ?)';
    await pool.query(createInterestQuery, [userId, updatedPropertyIds]);
  }
};


export const sendCustomerMessage = async (mobile = '', name = '', property = '', owner = '', contact = '') => {
  try {
      if (!mobile) {
          throw new Error("Mobile number is required.");
      }

      const formattedMobile = formatPhoneNumber(mobile);

      const API_URL = 'https://www.textguru.in/api/v22.0/';
      const USERNAME = process.env.TEXTGURU_USERNAME;
      const PASSWORD = process.env.TEXTGURU_PASSWORD;
      const SOURCE = 'ETSQFT';
      const DLTTEMPID = `${process.env.TEXTGURU_CUSTOMER_TEMPID}`;

      const MESSAGE = `Hello ${name}, Thank you for your interest in the property ${property}. The owner of this property is ${owner} and you can contact them at ${contact}. Team 8sqft.com`;
      const apiEndpoint = `${API_URL}?username=${USERNAME}&password=${PASSWORD}&source=${SOURCE}&dmobile=${formattedMobile}&dlttempid=${DLTTEMPID}&message=${encodeURIComponent(MESSAGE)}`;
 
      const response = await axios.get(apiEndpoint);

      if (response.status === 200) {
          const responseData = response.data;
          if (responseData.includes('MsgID')) {
            return { "MsgID": response.data, status : response.status, statusText : response.statusText };
          } else {
            return { "MsgID": null, status : 400, statusText : 'Not Found' };
          }
      } else {
          throw new Error('Error from TextGuru API');
      }
  } catch (error) {
      throw new Error('Error from TextGuru API: ' + error);
  }
};


export const sendBuilderMessage = async (mobile = '', ownerName = '', customerName = '', property = '', customerContact = '') => {
  try {
      if (!mobile) {
          throw new Error("Mobile number is required.");
      }

      const formattedMobile = formatPhoneNumber(mobile);

      const API_URL = 'https://www.textguru.in/api/v22.0/';
      const USERNAME = process.env.TEXTGURU_USERNAME;
      const PASSWORD = process.env.TEXTGURU_PASSWORD;
      const SOURCE = 'ETSQFT';
      const DLTTEMPID = `${process.env.TEXTGURU_BUILDER_TEMPID}`;

      const MESSAGE = `Hello ${ownerName}, ${customerName} is interested in your property ${property}. You can contact them at ${customerContact}. Team 8sqft.com`;
      const apiEndpoint = `${API_URL}?username=${USERNAME}&password=${PASSWORD}&source=${SOURCE}&dmobile=${formattedMobile}&dlttempid=${DLTTEMPID}&message=${encodeURIComponent(MESSAGE)}`;
 
      const response = await axios.get(apiEndpoint);

      if (response.status === 200) {
          const responseData = response.data;
          if (responseData.includes('MsgID')) {
            return { "MsgID": response.data, status : response.status, statusText : response.statusText };
          } else {
            return { "MsgID": null, status : 400, statusText : 'Not Found' };
          }
      } else {
          throw new Error('Error from TextGuru API');
      }
  } catch (error) {
      throw new Error('Error from TextGuru API: ' + error);
  }
};
