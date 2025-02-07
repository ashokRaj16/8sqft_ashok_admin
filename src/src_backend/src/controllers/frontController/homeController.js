import pool from '../../config/db.js';
import axios from 'axios';

import { renderEmailTemplate } from '../../config/nodemailer.js';
import { sendMailTemplate } from '../../config/nodemailer.js';

import { getSearchDropDownLocationByKey, getRecommendationData } from '../../models/homeModels.js';
import { badRequestResponse, successResponse, successWithDataResponse } from '../../utils/response.js';

export const getSearchDropDownLocations = async (req, res) => {
  try {
    const { searchKeyword, city, searchLimit } = req.query;
    console.log(req.query)
    const result = await getSearchDropDownLocationByKey(searchKeyword, city, searchLimit);

    console.log(result);
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
  console.log(savedBrokerageQuery)
  const [[userCountResult], [propertyCountResult], [savedBrokerageResult]] = await Promise.all([
    pool.query(userCountQuery),
    pool.query(propertyCountQuery),
    pool.query(savedBrokerageQuery),
  ]);

  const userCount = userCountResult[0]?.userCount || 0;
  const propertyCount = propertyCountResult[0]?.propertyCount || 0;
  const totalSavedBrokerage = savedBrokerageResult[0]?.totalSavedBrokerage || 0;

  const data =
    { 
      userCount,
      propertyCount ,
      totalSavedBrokerage 
    };

    successWithDataResponse(res, true, "Comman info fetched successfully", data);
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
    const { amount, area, city_name, property_type, property_rent_buy, limit = 10 } = req.query;

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


export const contactSendMail = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.userId;

    if (!propertyId) {
      return badRequestResponse(res, false, "Property ID is required");
    }
    
    const userQuery = 'SELECT fname, lname, email, mobile FROM tbl_users WHERE id = ?';
    const [userResult] = await pool.query(userQuery, [userId]);
    console.log("User result:", userId, userResult);

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
      
      console.log("Owner details:",ownerResult);
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
        console.log('Email sent successfully');
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

    const userQuery = 'SELECT fname, lname, email, mobile FROM tbl_users WHERE id = ?';
    const [userResult] = await pool.query(userQuery, [userId]);
    console.log("User results:", userId, propertyId, userResult);

    if (userResult.length === 0) {
      return badRequestResponse(res, false, "User not found");
    }

    const user = userResult[0];

    const ownerQuery = `SELECT users.fname, users.lname, users.email, users.mobile, properties.user_id, properties.id,
      properties.property_title, properties.description, properties.rent_amount, properties.city_name, properties.property_type,
      properties.status 
      FROM tbl_property as properties 
      INNER JOIN tbl_users as users ON properties.user_id = users.id
      WHERE properties.id = ?`;

    const [ownerResult] = await pool.query(ownerQuery, [propertyId]);
    
    if ( ownerResult.length === 0 ) {
      return badRequestResponse(res, false, "Property owner not found");
    }
    
    console.log("Owner result:", userId, ownerResult, ownerResult );
    const owner = ownerResult[0];

    const gupshupApiKey = process.env.GUPSHUP_API_KEY;
    console.log(gupshupApiKey, process.env.GUPSHUP_SOURCE_NUMBER);

    
    const userPayload = new URLSearchParams({
      channel: 'whatsapp',
      'src.name': '8sqftwebApp',
      source: process.env.GUPSHUP_WHATSAPP_NUMBER,
      destination: `91${userResult[0].mobile}`,
      template: JSON.stringify({
        id: '94e50d82-a0ff-4c19-87b3-5b8504348b94',
        params: [
          userResult[0].fname, 
          ownerResult[0].property_title,
          ownerResult[0].fname,
          ownerResult[0].mobile
        ],
      }),
    });

    const ownerPayload = new URLSearchParams({
      channel: 'whatsapp',
      'src.name': '8sqftwebApp', 
      source: process.env.GUPSHUP_WHATSAPP_NUMBER,
      destination: 91 +""+ ownerResult[0].mobile ,
      template: JSON.stringify({
        id: '840ffd0d-aca8-4cb2-8ae8-36a863f27ecb',
        params: [
          ownerResult[0].fname,
          ownerResult[0].property_title, 
          userResult[0].fname,
          userResult[0].mobile
        ], 
      }),
    });

    const gupshupResponse = await axios.post(
      'https://api.gupshup.io/wa/api/v1/template/msg',
      userPayload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
          apikey: process.env.GUPSHUP_API_KEY, 
        },
      }
    );
          
    const gupshupOwnerResponse = await axios.post(
      'https://api.gupshup.io/wa/api/v1/template/msg',
      ownerPayload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
          apikey: process.env.GUPSHUP_API_KEY,
        },
      }
    );

    if (gupshupOwnerResponse.data.status === 'submitted' && gupshupResponse.data.status === "submitted") {

        const checkInterestQuery = 'SELECT * FROM tbl_property_intrest WHERE user_id = ?';
        const [interestResult] = await pool.query(checkInterestQuery, [userId]);

        const currentDate = new Date().toISOString().split('T')[0];

        if (interestResult.length > 0) {
          let existingPropertyIds = JSON.parse(interestResult[0].property_id || '[]');

          const propertyExists = existingPropertyIds.some(item => item.pid === propertyId);
          console.log("tested contactsss : ", propertyExists, existingPropertyIds);

          if (!propertyExists) {
            existingPropertyIds.push({ pid: propertyId, date: currentDate });

            const updatedPropertyIds = JSON.stringify(existingPropertyIds);

            const updateInterestQuery = 'UPDATE tbl_property_intrest SET property_id = ? WHERE user_id = ?';
            await pool.query(updateInterestQuery, [updatedPropertyIds, userId]);
          }

        }
        else {
            let propertyIds = { pid: propertyId, date: currentDate };
            const updatedPropertyIds = JSON.stringify( [ propertyIds ] );
            const createInterestQuery = 'insert into tbl_property_intrest (user_id, property_id) values (?, ?)';
            const result = await pool.query(createInterestQuery, [ userId, updatedPropertyIds]);
            console.log('resultss:', result)
        }

      return successResponse(res, true, 'Contact details exchanged via WhatsApp using templates.', gupshupOwnerResponse.data);

    } else {
      console.error('Error from Gupshup API:', gupshupOwnerResponse.data);
      throw new Error(gupshupOwnerResponse.data.message || 'Failed to share contact.');
    }

  } catch (error) {
    console.error('Error in contactSendWhatsApp:');
    return badRequestResponse(res, false, 'Failed to exchange contact details via WhatsApp', error);
  }
};

export const getInterestedUsers = async (req, res) => {
  try {
    const user_id = req.userId;
    const { limit = 10, offset = 0 } = req.query;

    // Query to get properties owned by the user
    const getPropertyQuery = 'SELECT property_title as title, id as property_id FROM tbl_property WHERE user_id = ?';
    const [properties] = await pool.query(getPropertyQuery, [user_id]);

    if (properties.length === 0) {
      return successResponse(res, true, 'No properties found for the user.', []);
    }

    const propertyIds = properties.map(property => property.property_id);
    const propertyIdsJson = JSON.stringify(propertyIds);

    // Query to get interested users for the user's properties
    const interestedUsersQuery = `
      SELECT user_id, property_id 
      FROM tbl_property_intrest 
      WHERE JSON_CONTAINS(property_id, ?) 
      LIMIT ? OFFSET ?`;
    const [interestedUsersResult] = await pool.query(interestedUsersQuery, [propertyIdsJson, parseInt(limit), parseInt(offset)]);

    if (interestedUsersResult.length === 0) {
      return successResponse(res, true, 'No users are interested in these properties.', []);
    }

    const userIds = [...new Set(interestedUsersResult.map(row => row.user_id))];

    // Query to get details of interested users
    const userDetailsQuery = `
      SELECT id, fname, lname, email, mobile 
      FROM tbl_users 
      WHERE id IN (?)`;
    const [userDetailsResult] = await pool.query(userDetailsQuery, [userIds]);

    if (userDetailsResult.length === 0) {
      return successResponse(res, true, 'No user details found for the interested users.', []);
    }

    // Map user details with their interested properties
    const userDetailsWithProperties = userDetailsResult.map(user => {
      const userInterests = interestedUsersResult.filter(interest => interest.user_id === user.id);
      const properties = userInterests.map(interest => {
        const propertyIdsArray = JSON.parse(interest.property_id || '[]');
        return propertyIdsArray.filter(id => propertyIds.includes(id));
      }).flat();

      return {
        ...user,
        properties,
      };
    });

    return successResponse(res, true, 'Interested users retrieved successfully.', userDetailsWithProperties);
  } catch (error) {
    console.error('Error in getInterestedUsers:', error);
    return badRequestResponse(res, false, 'Failed to retrieve interested users.', error);
  }
};

export const getShortlistedProperties = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return badRequestResponse(res, false, 'User ID is required');
    }

    const wishlistQuery = 'SELECT property_id FROM tbl_property_shortlist WHERE user_id = ?';
    const [wishlistResult] = await pool.query(wishlistQuery, [userId]);

    if (wishlistResult.length === 0) {
      return successResponse(res, true, 'No shortlisted properties found.', []);
    }

    const propertyIds = wishlistResult.map(row => row.property_id);

    const propertyDetailsQuery = `SELECT id, property_title, description, rent_amount, city_name, property_type, status 
      FROM tbl_property WHERE id IN (?)`;
    const [propertyDetailsResult] = await pool.query(propertyDetailsQuery, [propertyIds]);

    if (propertyDetailsResult.length === 0) {
      return successResponse(res, true, 'No property details found for the shortlisted properties.', []);
    }

    return successResponse(res, true, 'Shortlisted properties retrieved successfully.', propertyDetailsResult);

  } catch (error) {
    console.error('Error in getShortlistedProperties:', error);
    return badRequestResponse(res, false, 'Failed to retrieve shortlisted properties.', error);
  }
};

export const getPaymentLogs = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return badRequestResponse(res, false, 'User ID is required');
    }

    const paymentLogsQuery = `SELECT user_id, plan_id, order_id, order_amount, customer_email, customer_phone, payment_status, created_at
      FROM tbl_payment_history WHERE user_id = ? ORDER BY created_at DESC`;
    const [paymentLogsResult] = await pool.query(paymentLogsQuery, [userId]);

    if (paymentLogsResult.length === 0) {
      return successResponse(res, true, 'No payment logs found.', []);
    }

    return successResponse(res, true, 'Payment logs retrieved successfully.', paymentLogsResult);

  } catch (error) {
    console.error('Error in getPaymentLogs:', error);
    return badRequestResponse(res, false, 'Failed to retrieve payment logs.', error);
  }
};



