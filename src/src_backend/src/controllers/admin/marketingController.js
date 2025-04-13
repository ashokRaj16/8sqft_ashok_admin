import pool from '../../config/db.js';
import axios from 'axios';
import AWS from '@aws-sdk/client-s3';

import { badRequestResponse, successResponse, successWithDataResponse } from '../../utils/response.js';
import { createMarketingAdmin, deleteMarketingByIdAdmin, deleteMarketingDetailsRowByIdAdmin, getAllMarketingCountAdmin, getAllMarketingListAdmin, getLeadsByPropertyId, getLeadsCountsByPropertyId, getMarketingByIdAdmin, getMarketingLogByIdAdmin } from '../../models/marketingModels.js';
import { formattedDate, sanitizedField, sanitizedNumber } from '../../utils/commonHelper.js';
import validator from 'validator';
import { downloadAndProcessExcel } from '../../utils/imageUploadHelper.js';
import { whatsappImageTemplateValidator, whatsappMarathiTemplateValidator } from '../validators/marketingValidator.js';

/**
 * Whasapp Property Promotion to customer (Property Details & Image)
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const sendWAPromotionWithImageMessage = async (req, res) => {

    const { full_name, mobile, email, property_id, banner_image, contacts_file } = req.body;
    const errors = whatsappImageTemplateValidator(req.body)
    
    if( errors.length > 0 ) {
      return badRequestResponse(res, false, "Missing required parameter.", errors)
    }

    try {

      const userJoin = `LEFT JOIN tbl_users tu ON tu.id = tp.user_id`;
      const galleryJoin = `LEFT JOIN tbl_property_gallery tpg ON tpg.property_id = tp.id`;

      const propertyQuery = `
        SELECT tp.id, tp.property_title, tp.title_slug, tp.locality, tp.city_name,
              tu.fname, tu.lname, tu.mobile,
              tp.property_title, tp.rent_amount, tp.city_name, tp.property_type,
              tp.status,
              MIN(tpg.property_img_url) as property_img_url
        FROM tbl_property as tp
        ${userJoin}
        ${galleryJoin}
        WHERE tp.id = ?
        AND (tpg.file_type NOT IN ('application/pdf', 'video/mp4', 'video/mkv', 'video/avi', 'video/mov'))`;

      const [properties] = await pool.query(propertyQuery, [property_id]);

      if(properties.length <= 0) {
        return badRequestResponse(res, false, "No Property found.")
      }
      let bannerImgUrl = banner_image || properties[0].property_img_url;
      
      let mobileNumbersArray = [];
      if(contacts_file) {

        const contactList = contacts_file;
        
        mobileNumbersArray = await downloadAndProcessExcel(contactList);
        
        if(mobileNumbersArray && mobileNumbersArray.length > 0) {
          const response = await sendMarketingMessages(mobileNumbersArray, properties[0], bannerImgUrl )
          if(response) {
              const data = {
                full_name: full_name || null,
                mobile: mobile || null,
                email: email || null,
                status: "1",
                status_text : "Success",
                property_id: property_id || null,
                banner_image : bannerImgUrl || null,
                contacts_file : contacts_file || null,
                total_contact : mobileNumbersArray.length || null,
                msg_send_contact : mobileNumbersArray.length || null,
                promotion_name : `Promotion-${ formattedDate( new Date())}`,
                marketing_type : 'Whatsapp',
                promotion_type : 'Property Promote',
                publish_date : new Date(),
                userId : req.userId,
              }
              const result = await createMarketingAdmin(data)
              return successResponse(res, true, 'Marketing messages sent successfully', result);

          }
          else {
            return badRequestResponse(res, false, 'Unable to sent some messages.');
          }
        }
      }

      const marketingPayload = new URLSearchParams({ 
        channel: 'whatsapp',
        'src.name': `${process.env.GUPSHUP_APP_NAME}`,
        source: process.env.GUPSHUP_WHATSAPP_NUMBER_PROMO,
        destination: `91${sanitizedNumber(mobile)}`,
        type: "template",
        template: JSON.stringify({
            id: 'f29f93ce-4fae-4019-8367-03aec1b98c86',
            params : [
              `${properties[0].property_title}`, 
              `${properties[0].locality}, ${properties[0].city_name}`,
              `/Builder/${properties[0].title_slug}`
            ]
        }),
        message : JSON.stringify({      
          type: 'image',
          image: {
            link: `${bannerImgUrl}`
          }
        }),
      });

      const gupshupResponse = await axios.post(
          'https://api.gupshup.io/wa/api/v1/template/msg',
          marketingPayload,
          {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Cache-Control': 'no-cache',
                  apikey: process.env.GUPSHUP_API_KEY,
              },
          }
      );

    console.log(gupshupResponse,  "response gup")

      if (gupshupResponse.data.status === 'submitted') {
        const data = {
          full_name: full_name || null,
          mobile: mobile || null,
          email: email || null,
          status: "1",
          status_text : "Success",
          property_id: property_id || null,
          banner_image : bannerImgUrl || null,
          contacts_file : contacts_file || null,
          total_contact : 1 || null,
          msg_send_contact : 1 || null,
          promotion_name : `Promotion-${ formattedDate( new Date())}`,
          marketing_type : 'Whatsapp',
          promotion_type : 'Property Promote',
          publish_date : new Date(),
          userId : req.userId,
        }
        const result = await createMarketingAdmin(data)
        return successResponse(res, true, 'Marketing messages sent successfully', result);
      } else {
          console.error(`Failed to send message to ${mobile}:`, gupshupResponse.data);
          return successResponse(res, true, 'Failed to sent messages.');
      }
  } catch (error) {
      console.error('Error in send Message:', error);
      return badRequestResponse(res, false, 'Failed to send marketing messages', error);
  }
};

/**
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const sendWAPromotionWithMarathiMessage = async (req, res) => {

  const { template_type, full_name, mobile, email, property_id, banner_image, contacts_file, txt_marathi, msg_mobile } = req.body;

  let errors = whatsappMarathiTemplateValidator(req.body);
  if(errors.length > 0) {
    return badRequestResponse(res, false, "Missing required parameter.", errors)
  }

  try {
    const cleanedText = txt_marathi.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    let mobileNumbersArray = [];
    if(contacts_file) {
      const contactList = contacts_file;      
      mobileNumbersArray = await downloadAndProcessExcel(contactList);
      
      if(mobileNumbersArray && mobileNumbersArray.length > 0) {
        const response = await sendMarketingMarathiMessages(mobileNumbersArray, cleanedText, msg_mobile )
        if(response) {
            const data = {
              full_name: full_name || null,
              mobile: mobile || null,
              email: email || null,
              status: "1",
              status_text : "Success",
              property_id : null,
              banner_image : null,
              contacts_file : contacts_file || null,
              txt_marathi : cleanedText || null,
              msg_mobile : msg_mobile || null,
              total_contact : mobileNumbersArray.length || null,
              msg_send_contact : mobileNumbersArray.length || null,
              promotion_name : `Promotion-${ formattedDate( new Date() )}`,
              marketing_type : 'Whatsapp',
              promotion_type : 'Property Promote Marathi',
              publish_date : new Date(),
              userId : req.userId,
            }
            const result = await createMarketingAdmin(data)
            return successResponse(res, true, 'Marketing messages sent successfully', result);
        }
        else {
          return badRequestResponse(res, false, 'Unable to sent some messages.');
        }
      }
    }
    // console.log(txt_marathi,msg_mobile, process.env.GUPSHUP_APP_NAME, process.env.GUPSHUP_WHATSAPP_NUMBER_PROMO, sanitizedNumber(mobile), process.env.GUPSHUP_API_KEY, "keys")

    const marketingPayload = new URLSearchParams({ 
      channel: 'whatsapp',
      'src.name': `${process.env.GUPSHUP_APP_NAME}`,
      source: process.env.GUPSHUP_WHATSAPP_NUMBER_PROMO,
      destination: `91${sanitizedNumber(mobile)}`,
      type: "template",
      template: JSON.stringify({
          id: '47af9f73-2f5e-4df7-9368-59638c15998a',
          params : [
            `${cleanedText}`, 
            `${msg_mobile}`,
          ]
      })
    });

    const gupshupResponse = await axios.post(
        'https://api.gupshup.io/wa/api/v1/template/msg',
        marketingPayload,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache',
                apikey: process.env.GUPSHUP_API_KEY,
            },
        }
    );

    // console.log(gupshupResponse,  "response gup")
    if (gupshupResponse.data.status === 'submitted') {
      const data = {
        full_name: full_name || null,
        mobile: mobile || null,
        email: email || null,
        status: "1",
        status_text : "Success",
        property_id: null,
        banner_image : null,
        contacts_file : contacts_file || null,
        txt_marathi : cleanedText || null,
        msg_mobile : msg_mobile || null,
        total_contact : 1 || null,
        msg_send_contact : 1 || null,
        promotion_name : `Promotion-${ formattedDate( new Date())}`,
        marketing_type : 'Whatsapp',
        promotion_type : 'Property Promote Marathi',
        publish_date : new Date(),
        userId : req.userId,
      }
      const result = await createMarketingAdmin(data)
      return successResponse(res, true, 'Marketing messages sent successfully', result);
    } else {
        console.error(`Failed to send message to ${mobile}:`, gupshupResponse.data);
        return successResponse(res, true, 'Failed to sent messages.');
    }
} catch (error) {
    console.error('Error in send Message:', error);
    return badRequestResponse(res, false, 'Failed to send marketing messages', error);
}
};

const sendMarketingMessages = async (numbersArray, properties, bannerImgUrl, batchSize = 20) => {
  try {

      const sendBatch = async (batch) => {
        const requests = batch.map(async (number) => {
            try {
                const marketingPayload = new URLSearchParams();
                marketingPayload.append("channel", "whatsapp");
                marketingPayload.append("src.name", process.env.GUPSHUP_APP_NAME);
                marketingPayload.append("source", process.env.GUPSHUP_WHATSAPP_NUMBER_PROMO);
                marketingPayload.append("destination", `91${sanitizedNumber(number)}`);
                marketingPayload.append("type", "template");
                marketingPayload.append("template", JSON.stringify({
                    id: "f29f93ce-4fae-4019-8367-03aec1b98c86",
                    params: [
                        properties.property_title,
                        `${properties.locality}, ${properties.city_name}`,
                        `/Builder/${properties.title_slug}`
                    ]
                }));
                marketingPayload.append("message", JSON.stringify({
                    type: "image",
                    image: {
                        link: bannerImgUrl
                    }
                }));

                const response = await axios.post(
                    "https://api.gupshup.io/wa/api/v1/template/msg",
                    marketingPayload,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Cache-Control": "no-cache",
                            apikey: process.env.GUPSHUP_API_KEY,
                        },
                    }
                );
                return { status: "fulfilled", value: response.data };

            } catch (error) {
                console.error(`Error sending to ${number}:`, error.response?.data || error.message);
                return { status: "rejected", reason: error.response?.data || error.message };
            }
        });

        // Send all requests in parallel
        const responses = await Promise.allSettled(requests);

      };

      for (let i = 0; i < numbersArray.length; i += batchSize) {
        const batch = numbersArray.slice(i, i + batchSize);
        await sendBatch(batch);
      }
      return true;
  } catch (error) {
      console.error("Error sending messages:", error.response?.data || error.message);
  }
};


const sendMarketingMarathiMessages = async (numbersArray, txt_marathi, msg_mobile, batchSize = 20) => {
  try {
      // console.log(txt_marathi, msg_mobile,  "message data")
      const sendBatch = async (batch) => {
        const requests = batch.map(async (number) => {
            try {
                const marketingPayload = new URLSearchParams();
                marketingPayload.append("channel", "whatsapp");
                marketingPayload.append("src.name", process.env.GUPSHUP_APP_NAME);
                marketingPayload.append("source", process.env.GUPSHUP_WHATSAPP_NUMBER_PROMO);
                marketingPayload.append("destination", `91${sanitizedNumber(number)}`);
                marketingPayload.append("type", "template");
                marketingPayload.append("template", JSON.stringify({
                    id: "47af9f73-2f5e-4df7-9368-59638c15998a",
                    params: [
                        txt_marathi,
                        `${msg_mobile}`,
                    ]
                }));

                const response = await axios.post(
                    "https://api.gupshup.io/wa/api/v1/template/msg",
                    marketingPayload,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Cache-Control": "no-cache",
                            apikey: process.env.GUPSHUP_API_KEY,
                        },
                    }
                );

                console.log( sanitizedNumber(number), response.data, "data msg")
                return { status: response.data.status, value: response.data };
            } catch (error) {
                console.error(`Error sending to ${number}:`, error.response?.data || error.message);
                return { status: "rejected", reason: error.response?.data || error.message };
            }
        });

        // Send all requests in parallel
        const responses = await Promise.allSettled(requests);
        console.log(responses, "responses")
      };

      for (let i = 0; i < numbersArray.length; i += batchSize) {
        const batch = numbersArray.slice(i, i + batchSize);
        await sendBatch(batch);
      }
      return true;
  } catch (error) {
      console.error("Error sending messages:", error.response?.data || error.message);
  }
};

/**
 * Working
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const sendWAPromotionPropertyMessage = async (req, res) => {

    const {full_name, mobile, email, property_id, contacts_file } = req.body;
    if(!full_name || !mobile || !property_id) {
      return badRequestResponse(res, false, "Missing required parameter.")
    }

  try {
      // Fetch property owner details, including WhatsApp status
      const propertyQuery = `
          SELECT tp.id, tu.fname, tu.lname, tu.mobile, tu.is_wa_number,
                 tp.property_title, tp.description, tp.rent_amount, 
                 tp.city_name, tp.property_type, tp.status 
          FROM tbl_property AS tp
          LEFT JOIN tbl_users AS tu ON tu.id = tp.user_id
          WHERE tp.id = ?`;

      const [properties] = await pool.query(propertyQuery, [property_id]);
  
      if(!properties[0].mobile) {
        return badRequestResponse(res, false, "No mobile number for selected property.")
      }
      if (!properties.length) {
          return badRequestResponse(res, false, "Property not found.");
      }

      const owner = properties[0];

      // Check if the owner's number is WhatsApp-enabled
      if (owner.is_wa_number !== "1") {
          return successResponse(res, true, "Skipping message as the number is not WhatsApp-enabled.");
      }

      // Send WhatsApp message
      const gupshupApiKey = process.env.GUPSHUP_API_KEY;
      const messagePayload = new URLSearchParams({
          channel: 'whatsapp',

          'src.name': `${process.env.GUPSHUP_APP_NAME}`,
          source: process.env.GUPSHUP_WHATSAPP_NUMBER_PROMO,
          destination: `91${properties[0].mobile}`,
          template: JSON.stringify({
              id: '62820aa7-2f74-4566-bf9f-4107269f1992',
              params: [
                  `${owner.fname} ${owner.lname}`,
                  owner.property_title,
                  full_name,
                  mobile
              ],
          }),
      });

      const gupshupResponse = await axios.post(
          'https://api.gupshup.io/wa/api/v1/template/msg',
          messagePayload,
          {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Cache-Control': 'no-cache',
                  apikey: gupshupApiKey,
              },
          }
        );
        
        if (gupshupResponse.data.status === 'submitted') {
          const data = {
            full_name: full_name || null,
            mobile: mobile || null,
            email: email || null,
            status: "1",
            status_text : "Success",
            property_id: property_id || null,
            banner_image : null,
            contacts_file : contacts_file || null,
            total_contact : 1 || null,
            msg_send_contact : 1 || null,
            promotion_name : `Promotion-${ formattedDate( new Date())}`,
            marketing_type : 'Whatsapp',
            promotion_type : 'Property',
            publish_date : new Date(),
            userId : req.userId,
          }
          const result = await createMarketingAdmin(data)              
          return successResponse(res, true, 'Marketing messages sent successfully', result);
        } else {
            console.error(`Failed to send message to ${mobile}:`, gupshupResponse.data);
            return successResponse(res, true, 'Failed to sent messages.');
        }

  } catch (error) {
      console.error('Error in sendWAPromotionPropertyMessage:', error);
      return badRequestResponse(res, false, 'Failed to send marketing message', error);
  }
};

// ### Need to access excel sheet. //done above
/**
 * send promotion using excel | upload excel Sheet to aws | send bulk whatsapp message 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

export const sendPromotionMessageUsingExcel = async (req, res) => {
  try {
      const { property_id } = req.body;

      if (!property_id) {
          return badRequestResponse(res, false, "Property ID is required");
      }

      // Fetch property details
      // const imageJoin = `LEFT JOIN tbl_property_gallery tpg ON tp.id = tpg.property_id`
      // const propertyQuery = `SELECT tp.id, tp.property_title, tp.city_name , tpg.property_img_url
      //   FROM tbl_property tp  ${imageJoin}
      //   WHERE tp.id = ?`;

      const imageJoin = `LEFT JOIN tbl_property_gallery tpg ON tp.id = tpg.property_id`;
      const propertyQuery = `
        SELECT tp.id, tp.property_title, tp.city_name, tpg.property_img_url
        FROM tbl_property tp
        ${imageJoin}
        WHERE tp.id = ?
        AND (tpg.file_type NOT IN ('application/pdf', 'video/mp4', 'video/mkv', 'video/avi', 'video/mov'))`;

      const [propertyResult] = await pool.query(propertyQuery, [property_id]);

      if (propertyResult.length === 0) {
          return badRequestResponse(res, false, "Property not found");
      }

      const property = propertyResult[0];
      
      // Fetch user IDs from tbl_property_intrest
      const interestQuery = `SELECT user_id 
        FROM 
        tbl_property_intrest WHERE 
        JSON_CONTAINS(
            property_id, 
            JSON_OBJECT('pid', ?)
        )
        `;
      const [interestResults] = await pool.query(interestQuery, [property_id]);
      if (interestResults.length === 0) {
          return badRequestResponse(res, false, "No interested users found");
        }
        
        const userIds = interestResults.map(row => row.user_id);
        
        // Fetch users' mobile numbers
        const usersQuery = `SELECT mobile FROM tbl_users WHERE id IN (?)`;
        const [users] = await pool.query(usersQuery, [userIds]);
        
        
        if (users.length === 0) {
          return badRequestResponse(res, false, "No users found to send marketing messages");
      }

      // Upload image to S3
      const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
      });

    //   const fileContent = fs.readFileSync(property.property_img_url);
    //   const fileKey = `properties/${property.id}/${Date.now()}-${path.basename(property.property_img_url)}`;
    //   const s3Params = {
        //       Bucket: process.env.S3_BUCKET_NAME,
        //       Key: fileKey,
        //       Body: fileContent,
        //       ContentType: 'image/jpeg',
        //       ACL: 'public-read',
        //   };
        
        //   const s3UploadResponse = await s3.upload(s3Params).promise();
        //   const imageUrl = s3UploadResponse.Location;
        
      // Send messages to interested users
      if(!users) {
        badRequestResponse(res, false, "No user intrested in this property.")
      }
      for (const user of users) {
          const marketingPayload = new URLSearchParams({
              channel: 'whatsapp',
              'src.name': '8sqftwebApp',
              source: process.env.GUPSHUP_WHATSAPP_NUMBER,
              destination: `${user.mobile}`,
              type: "template",
              template: JSON.stringify({
                  //   type: 'media',
                  id: 'c9ddbb6a-f9a2-4a0a-b7c7-a77e0612ef84',
                  params: [                    
                        "https://8sqft-images.s3.eu-north-1.amazonaws.com/feb-2025/137/main-image-1739424532922-873800268.png",
                        "New Property",
                        "Pune"
                    ],
                  
              }),
          });


          try {
              const gupshupResponse = await axios.post(
                  'https://api.gupshup.io/wa/api/v1/template/msg',
                  marketingPayload,
                  {
                      headers: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'Cache-Control': 'no-cache',
                          apikey: process.env.GUPSHUP_API_KEY,
                      },
                  }
              );

              if (gupshupResponse.data.status === 'submitted') {
              } else {
                  console.error(`Failed to send message to ${user.mobile}:`, gupshupResponse.data);
              }
          } catch (error) {
              console.error(`Error sending message to ${user.mobile}:`, error);
          }
      }
      // ### save marekting message here
      // Log the marketing message in tbl_property_marketing
    //   const insertMarketingQuery = `INSERT INTO tbl_property_marketing (property_id, property_name, location, image_url, sent_at) VALUES (?, ?, ?, ?, NOW())`;
    //   await pool.query(insertMarketingQuery, [
    //       property.id,
    //       property.property_title,
    //       property.city_name,
    //       imageUrl,
    //   ]);

      return successResponse(res, true, 'Marketing messages sent successfully');
  } catch (error) {
      console.error('Error in sendMessage:', error);
      return badRequestResponse(res, false, 'Failed to send marketing messages', error);
  }
};

export const listPromotionData = async (req, res) => {
    try {
    
      let data = {};
      const { page, limit } = req.query;
  
      const pageCount = parseInt(page) || 1;
      const limitCount = parseInt(limit) || 100;
      const offset = (page - 1) * limit;
  
      const filters = req.query;
      let whereClauses = [];
  
      if (filters?.searchFilter && filters?.searchFilter.trim()) {
        const newSearchfilter = `tpm.promotion_name like '%${validator.escape(
          filters.searchFilter.trim()
        )}%' OR 
        tpm.marketing_type like '%${validator.escape(
            filters.searchFilter.trim()
        )}%' OR
        tpm.promotion_type like '%${validator.escape(
            filters.searchFilter.trim()
        )}%' `;
        whereClauses.push(newSearchfilter);
      }
 
      let baseQuery = "";
      if (whereClauses.length > 0) {
        baseQuery = ` WHERE ` + whereClauses.join(" AND ");
      }
  
      const allowedColumns = [
        "id",
        "promotion_name",
        "marketing_type",
        "promotion_type",
        "created_at",
        "status",
      ];
      const allowedOrders = ["ASC", "DESC"];
  
      const sortColumn = allowedColumns.includes(filters.sortColumn)
        ? filters.sortColumn
        : "id";
  
      const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase())
        ? filters.sortOrder?.toUpperCase()
        : "DESC";

      const propertyResult = await getAllMarketingListAdmin(
        baseQuery,
        sortColumn,
        sortOrder,
        pageCount,
        limitCount
      );
      
      const propertyTotalCount = await getAllMarketingCountAdmin(baseQuery);
      data["marketing"] = propertyResult;
      data["totalCounts"] = propertyTotalCount;
  
      const totalPages = Math.ceil(propertyTotalCount / limit);
      const startIndex = offset + 1;
      const endIndex = Math.min(offset + limit, propertyTotalCount);
      data["totalPages"] = totalPages;
      data["startIndex"] = startIndex;
      data["endIndex"] = endIndex;
  
      return successWithDataResponse(res, true, "Marketing list.", data);
    } catch (error) {
      console.error(error);
      return badRequestResponse(res, false, "Error fetching Marketing data!", error);
    }
};

export const getMarketingLogById = async (req, res) => {
  const { id } = req.params;
  try {
    let data = {}
    const result = await getMarketingByIdAdmin(id);
    const resultDetails = await getMarketingLogByIdAdmin(id);
    data = result[0];
    data['marketing_log'] = resultDetails;

    return successWithDataResponse(res, true, "Marketing details", data);

  } catch (error) {
    return badRequestResponse(res, false, "Error fetching Marketings.", error);
  }
};

export const deleteMarketingById = async (req, res) => {
  const { id } = req.params;
  try {
    let data = {}
    const result = await deleteMarketingByIdAdmin(id);    
    data = result[0];
    
    return successWithDataResponse(res, true, "Marketing data removed.", data);

  } catch (error) {
    return badRequestResponse(res, false, "Error deleting Marketing.", error);
  }
};

export const deleteMarketingDetailsById = async (req, res) => {
  const { id, sid } = req.params;
  try {
    let data = {}
    const result = await deleteMarketingDetailsRowByIdAdmin(sid);
    data = result[0];
    
    return successWithDataResponse(res, true, "Marketing details removed", data);

  } catch (error) {
    return badRequestResponse(res, false, "Error deleting Marketing.", error);
  }
};


export const getMarketingLeadByPropertyId = async (req, res) => {
 
  try {
    const { id } = req.params;
    let data = {};
    let whereClause = [];
    const { limit = 10, offset = 1 } = req.query;

    whereClause.push(` tpm.promotion_type = 'Property'`)

    let baseQuery;
    if(whereClause.length > 0) {
      baseQuery = `WHERE ` + whereClause.join(' AND ');
    }

    const resultDetails = await getLeadsByPropertyId(id, baseQuery, limit, offset);
    const totalCounts = await getLeadsCountsByPropertyId(id, baseQuery, limit, offset);
    // data = result[0];

    data['marketingLead'] = resultDetails;
    data['totalCount'] = totalCounts[0].counts;
    const totalPages = Math.ceil(totalCounts[0].counts / limit);
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + limit, totalCounts[0].counts);
    data["totalPages"] = totalPages;
    data["startIndex"] = startIndex;
    data["endIndex"] = endIndex;


    return successResponse(res, true, "Leads users retrieved successfully.", data);
  } catch (error) {
    console.error("Error in fetching Leads:", error);
    return badRequestResponse(res, false, "Failed to retrieve leads users.", error);
  }
};