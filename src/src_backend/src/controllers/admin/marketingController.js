import pool from '../../config/db.js';
import axios from 'axios';
import AWS from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

import { badRequestResponse, successResponse } from '../../utils/response.js';


export const sendMessage = async (req, res) => {
    try {
      const { propertyId } = req.body;
  
      if (!propertyId) {
        return badRequestResponse(res, false, "Property ID is required");
      }
  
      const propertyQuery = `SELECT properties.id, properties.property_title, properties.city_name, properties.image_path 
        FROM tbl_property as properties WHERE properties.id = ?`;
  
      const [propertyResult] = await pool.query(propertyQuery, [propertyId]);
  
      if (propertyResult.length === 0) {
        return badRequestResponse(res, false, "Property not found");
      }
  
      const property = propertyResult[0];
  
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      });
  
      const fileContent = fs.readFileSync(property.image_path);
      const fileKey = `properties/${property.id}/${Date.now()}-${path.basename(property.image_path)}`;
      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
        Body: fileContent,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
      };
  
      const s3UploadResponse = await s3.upload(s3Params).promise();
      const imageUrl = s3UploadResponse.Location;
  
      const usersQuery = `SELECT mobile FROM tbl_users`;
      const [users] = await pool.query(usersQuery);
  
      if (users.length === 0) {
        return badRequestResponse(res, false, "No users found to send marketing messages");
      }
  
      for (const user of users) {
        const marketingPayload = new URLSearchParams({
          channel: 'whatsapp',
          'src.name': '8sqftwebApp',
          source: process.env.GUPSHUP_WHATSAPP_NUMBER,
          destination: `91${user.mobile}`,
          template: JSON.stringify({
            id: 'c9ddbb6a-f9a2-4a0a-b7c7-a77e0612ef84',
            params: [
              imageUrl,                 //Image URL
              property.property_title, //Property Title
              property.city_name       //Location
            ],
          }),
        });
  
        try {
          const gupshupResponse = await axios.post('https://api.gupshup.io/wa/api/v1/template/msg',
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
            console.log(`Message sent to ${user.mobile}`);
          } else {
            console.error(`Failed to send message to ${user.mobile}:`, gupshupResponse.data);
          }
        } catch (error) {
          console.error(`Error sending message to ${user.mobile}:`, error);
        }
      }
  
      const insertMarketingQuery = 'INSERT INTO tbl_property_marketing (property_id, property_name, location, image_url, sent_at) VALUES (?, ?, ?, ?, NOW())';
      await pool.query(insertMarketingQuery, [
        property.id,
        property.property_title,
        property.city_name,
        imageUrl,
      ]);
  
      return successResponse(res, true, 'Marketing messages sent successfully');
    } catch (error) {
      console.error('Error in sendMarketingMessage:', error);
      return badRequestResponse(res, false, 'Failed to send marketing messages', error);
    }
  };