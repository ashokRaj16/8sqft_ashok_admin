import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import pool from "../../config/db.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { badRequestResponse, successResponse } from "../../utils/response.js";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (filePath) => {
  try {
    const fileStream = fs.createReadStream(filePath);
    const fileName = path.basename(filePath);

    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `clients/${fileName}`,
      Body: fileStream,
      ACL: "public-read",
      ContentType: "image/jpeg",
    };

    const command = new PutObjectCommand(s3Params);
    await s3.send(command);

    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/clients/${fileName}`;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error("Failed to upload image to S3");
  }
};

const deleteFromS3 = async (fileUrl) => {
  try {
    const key = fileUrl.split(".com/")[1];

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);
  } catch (error) {
    console.error("S3 Delete Error:", error);
  }
};

export const getClients = async (req, res) => {
    try {
      const [clients] = await pool.query("SELECT * FROM tbl_clients_info");
      
      return successResponse(res, true, "Clients retrieved successfully", clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      return badRequestResponse(res, false, "Failed to retrieve clients", error);
    }
};

export const getClientById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const [client] = await pool.query("SELECT * FROM tbl_clients_info WHERE id = ?", [id]);
  
      if (client.length === 0) {
        return badRequestResponse(res, false, "Client not found");
      }
  
      return successResponse(res, true, "Client retrieved successfully", client[0]);
    } catch (error) {
      console.error("Error fetching client:", error);
      return badRequestResponse(res, false, "Failed to retrieve client", error);
    }
};

export const changeClientStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      if (status !== "active" && status !== "inactive") {
        return badRequestResponse(res, false, "Invalid status value. Must be 'active' or 'inactive'.");
      }
  
      const [result] = await pool.query(
        "UPDATE tbl_clients_info SET status = ?, updated_at = NOW() WHERE id = ?",
        [status, id]
      );
  
      if (result.affectedRows === 0) {
        return badRequestResponse(res, false, "Client not found or no changes made");
      }
  
      return successResponse(res, true, "Client status updated successfully");
    } catch (error) {
      console.error("Error updating client status:", error);
      return badRequestResponse(res, false, "Failed to update client status", error);
    }
  };
  

export const createClient = async (req, res) => {
  try {
    const { client_name, status } = req.body;
    if (!client_name) return badRequestResponse(res, false, "Client name is required");

    let client_logo = null;
    if (req.file) {
      client_logo = await uploadToS3(req.file.path);
    }

    const [result] = await pool.query(
      "INSERT INTO tbl_clients_info (client_name, client_logo, status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [client_name, client_logo, status]
    );

    return successResponse(res, true, "Client added successfully", { clientId: result.insertId, client_logo });
  } catch (error) {
    return badRequestResponse(res, false, "Failed to add client", error);
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { client_name } = req.body;

    if (!client_name) return badRequestResponse(res, false, "Client name is required");

    const [clientResult] = await pool.query("SELECT client_logo FROM tbl_clients_info WHERE id = ?", [id]);
    if (clientResult.length === 0) return badRequestResponse(res, false, "Client not found");

    let client_logo = clientResult[0].client_logo;

    if (req.file) {
      const newImageUrl = await uploadToS3(req.file.path);

      if (client_logo) {
        await deleteFromS3(client_logo);
      }

      client_logo = newImageUrl;
    }

    const [updateResult] = await pool.query(
      "UPDATE tbl_clients_info SET client_name = ?, client_logo = ?, updated_at = NOW() WHERE id = ?",
      [client_name, client_logo, id]
    );

    if (updateResult.affectedRows === 0) {
      return badRequestResponse(res, false, "Client not found or no changes made");
    }

    return successResponse(res, true, "Client updated successfully", { client_logo });
  } catch (error) {
    return badRequestResponse(res, false, "Failed to update client", error);
  }
};
