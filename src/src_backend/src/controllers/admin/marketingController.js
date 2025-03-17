import pool from '../../config/db.js';
import axios from 'axios';
import AWS from '@aws-sdk/client-s3';

import { badRequestResponse, successResponse, successWithDataResponse } from '../../utils/response.js';
import { createMarketingAdmin, deleteMarketingByIdAdmin, deleteMarketingDetailsRowByIdAdmin, getAllMarketingCountAdmin, getAllMarketingListAdmin, getMarketingByIdAdmin, getMarketingLogByIdAdmin } from '../../models/marketingModels.js';
import { formattedDate, sanitizedNumber } from '../../utils/commonHelper.js';
import validator from 'validator';


/**
 * Need test
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const sendWAPromotionWithImageMessage = async (req, res) => {
    const { full_name, mobile, email, property_id, banner_image } = req.body;
    if( !full_name || !mobile || !property_id ) {
      return badRequestResponse(res, false, "Missing required parameter.")
    }

    try {
      const userJoin = `LEFT JOIN tbl_users tu ON tu.id = tp.user_id`;
      const galleryJoin = `LEFT JOIN tbl_property_gallery tpg ON tpg.property_id = tp.id`;

      const propertyQuery = `SELECT tp.id, tp.property_title, tp.title_slug, tp.locality, tp.city_name,
          tu.fname, tu.lname, tu.mobile,
          tp.property_title, tp.rent_amount, tp.city_name, tp.property_type,
          tp.status ,
          MIN(tpg.property_img_url) as property_img_url
          FROM tbl_property as tp
          ${userJoin}
          ${galleryJoin}
          WHERE tp.id = ?
        `;

      const [properties] = await pool.query(propertyQuery, [property_id]);

      let bannerImgUrl = banner_image || properties[0].property_img_url;
      //#region working
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

      if (gupshupResponse.data.status === 'submitted') {
        const data = {
          full_name: full_name || null,
          mobile: mobile || null,
          email: email || null,
          status: "1",
          status_text : "Success",
          property_id: property_id || null,
          banner_image : bannerImgUrl || null,
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
}

/**
 * Working
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const sendWAPromotionPropertyMessage = async (req, res) => {

    const {full_name, mobile, email, property_id } = req.body;
    if(!full_name || !mobile || !property_id) {
      return badRequestResponse(res, false, "Missing required parameter.")
    }

    try {
      const userJoin = `LEFT JOIN tbl_users tu ON tu.id = tp.user_id`
      const propertyQuery = `SELECT tp.id,
        tu.fname, tu.lname, tu.mobile,
        tp.property_title, tp.description, tp.rent_amount, tp.city_name, tp.property_type,
        tp.status 
        FROM tbl_property as tp
        ${userJoin}
        WHERE tp.id = ?`;

      const [properties] = await pool.query(propertyQuery, [property_id]);

      const gupshupApiKey = process.env.GUPSHUP_API_KEY;
  
      if(!properties[0].mobile) {
        return badRequestResponse(res, false, "No mobile number for selected property.")
      }
        const messagePayload = new URLSearchParams({
          channel: 'whatsapp',
          'src.name': `${process.env.GUPSHUP_APP_NAME}`,
          source: process.env.GUPSHUP_WHATSAPP_NUMBER_PROMO,
          destination: `91${properties[0].mobile}`,
          template: JSON.stringify({
            id: '840ffd0d-aca8-4cb2-8ae8-36a863f27ecb',
            params: [
              `${properties[0].fname} ${properties[0].lname}`, 
              properties[0].property_title,
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
      console.error('Error in sendMessage:', error);
      return badRequestResponse(res, false, 'Failed to send marketing messages', error);
  }
};

// ### Need to access excel sheet.
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
      const imageJoin = `LEFT JOIN tbl_property_gallery tpg ON tp.id = tpg.property_id`
      const propertyQuery = `SELECT tp.id, tp.property_title, tp.city_name , tpg.property_img_url
        FROM tbl_property tp  ${imageJoin}
        WHERE tp.id = ?`;
      const [propertyResult] = await pool.query(propertyQuery, [property_id]);

      if (propertyResult.length === 0) {
          return badRequestResponse(res, false, "Property not found");
      }

      const property = propertyResult[0];

      console.log("property", property)
      
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
                    // {
                    //   "type": "media",
                    //   "url": "https://8sqft-images.s3.eu-north-1.amazonaws.com/feb-2025/137/main-image-1739424532922-873800268.png",
                    // },
                    // "id": "c9ddbb6a-f9a2-4a0a-b7c7-a77e0612ef84",
                    // "params": [
                    //   {
                    //     "type": "media",
                    //     "url": property.property_img_url,
                    //   },
                    //   {
                    //     "type": "text",
                    //     "text": "Property Title"
                    //   },
                    //   {
                    //     "type": "text",
                    //     "text": "City Name"
                    //   }
                    // ]
                  
                // id: '3bb3fa08-6958-427e-82ea-91026982980c',  // Gupshup template ID (Authentication OTP template)
                // params: [456123, 123456],  // OTP as the parameter to replace {{1}} in the template
            //     buttons: JSON.stringify([ 
            //       { 
            //           type: "visit_website", 
            //           text: "Visit Website", 
            //           url: "https://www.8sqft.com/" 
            //       }, 
            //       {   type: "call_phone_number", 
            //           text: "Contact Us", 
            //           phone_number: "+917030000031" 
            //       } 
            //   ])
              }),
          });


        console.log("result::: ", marketingPayload )

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

              console.log("response:::", gupshupResponse.data)
              if (gupshupResponse.data.status === 'submitted') {
                  console.log(`Message sent to ${user.mobile}`);
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
  
      console.log(filters, sortColumn, sortOrder);
      const propertyResult = await getAllMarketingListAdmin(
        baseQuery,
        sortColumn,
        sortOrder,
        pageCount,
        limitCount
      );
      
      const propertyTotalCount = await getAllMarketingCountAdmin(baseQuery);
      console.log(propertyResult,"result")
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
    return badRequestResponse(res, false, "Error fetching Marketing.", error);
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