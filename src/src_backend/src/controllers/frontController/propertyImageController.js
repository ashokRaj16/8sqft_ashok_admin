import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";

import multer from "multer";
import dotenv from 'dotenv';
import path from 'path';
import fs from "fs/promises";
import { fileURLToPath } from 'url';

import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

import pool from "../../config/db.js";
import { badRequestResponse, successWithDataResponse, successResponse } from '../../utils/response.js';
import { propertyConfigurationValidator } from "../validators/propertyValidators.js";

ffmpeg.setFfmpegPath(ffmpegStatic);

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const watermarkPath = path.join(__dirname, "../../../public/images/watermark.png");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});


export const uploadPropertyImages = async (req, res) => {
  upload.array('images')(req, res, async (err) => {
      if (err) {
          console.error("Multer error:", err);
          return badRequestResponse(res, false, "Error processing uploaded files", err);
      }

      const { property_id, img_title } = req.body;
      const files = req.files;

      if (!property_id || !img_title || !files || !files.length) {
          return badRequestResponse(res, false, "Missing required fields or files");
      }

      let imageUrls = [];
      let connection;

      try {
          const updatedImages = [];
          const bucketName = process.env.AWS_S3_BUCKET_NAME;

          const currentDate = new Date();
          const monthYear = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' }).toLowerCase().replace(" ", "-"); // Example: "feb-2025"

          const monthFolder = `${monthYear}/`;
          const propertyFolder = `${monthFolder}${property_id}/`;

          async function ensureFolderExists(folderPath) {
              try {
                  await s3.send(new HeadObjectCommand({ Bucket: bucketName, Key: folderPath }));
              } catch (error) {
                  if (error.name === "NotFound") {
                      await s3.send(new PutObjectCommand({
                          Bucket: bucketName,
                          Key: `${folderPath}placeholder.txt`,
                          Body: "Folder placeholder",
                          ACL: "private",
                      }));
                  }
              }
          }

          await ensureFolderExists(monthFolder);
          await ensureFolderExists(propertyFolder);

          connection = await pool.getConnection();
          await connection.beginTransaction();

          for (const file of files) {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
              const extension = path.extname(file.originalname).toLowerCase();
              const fileName = `${img_title.toLowerCase().replace(/\s+/g, "-")}-${uniqueSuffix}${extension}`;
              const filePath = `${propertyFolder}${fileName}`;

              const params = {
                  Bucket: bucketName,
                  Key: filePath,
                  Body: file.buffer,
                  ContentType: file.mimetype,
                  ACL: "public-read",
              };

              await s3.send(new PutObjectCommand(params));
              const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`;

              const insertQuery = `INSERT INTO tbl_property_gallery 
              (property_id, img_title, image_category, file_type, image_size, property_img_url)
              VALUES (?, ?, ?, ?, ?, ?) `;

              const insertValues = [property_id, img_title, img_title, file.mimetype, file.size, imageUrl];
              const [dbResponse] = await connection.query(insertQuery, insertValues);

              imageUrls.push({ id: dbResponse.insertId, imageUrl });
              updatedImages.push(dbResponse);
          }

          await connection.commit();

          const data = { [img_title]: imageUrls };
          return successWithDataResponse(res, true, "Images uploaded successfully.", data);

      } catch (error) {
          if (connection) {
              await connection.rollback();
          }
          console.error("Error updating images:", error);
          return badRequestResponse(res, false, "Failed to upload images.", error);
      } finally {
          if (connection) {
              connection.release();
          }
      }
  });
};


export const deletePropertyImage = async (req, res) => {
  const { id } = req.params;

  if (!id) {
      return badRequestResponse(res, false, "Missing required field: image_id");
  }

  let connection;

  try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      const selectQuery = `SELECT property_img_url FROM tbl_property_gallery WHERE id = ?`;
      const [rows] = await connection.query(selectQuery, [id]);

      if (!rows.length) {
          return badRequestResponse(res, false, "Image not found");
      }

      const imageUrl = rows[0].property_img_url;
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const s3Key = imageUrl.replace(`https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`, "");

      const pathParts = s3Key.split("/");
      if (pathParts.length < 3) {
          return badRequestResponse(res, false, "Invalid image path format");
      }

      const monthFolder = pathParts[0] + "/";
      const propertyFolder = pathParts[0] + "/" + pathParts[1] + "/";

      await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }));

      const deleteQuery = `DELETE FROM tbl_property_gallery WHERE id = ?`;
      await connection.query(deleteQuery, [id]);

      const listPropertyObjects = await s3.send(new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: propertyFolder,
      }));

      if (!listPropertyObjects.Contents || listPropertyObjects.Contents.length === 0) {
          await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: propertyFolder + "placeholder.txt" }));
      }

      const listMonthObjects = await s3.send(new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: monthFolder,
      }));

      if (!listMonthObjects.Contents || listMonthObjects.Contents.length === 0) {
          await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: monthFolder + "placeholder.txt" }));
      }

      await connection.commit();

      return successResponse(res, true, "Image deleted successfully");

  } catch (error) {
      if (connection) {
          await connection.rollback();
      }
      console.error("Error deleting image:", error);
      return badRequestResponse(res, false, "Failed to delete image.", error);
  } finally {
      if (connection) {
          connection.release();
      }
  }
};

export const uploadPropertyConfiguration = async (req, res) => {
  upload.array('images') (req, res, async (err) => {
    console.log(req.file);

    if (err) {
      console.error("SQFT Multer error:", err);
      return badRequestResponse(res, false, "Error processing uploaded files.", err);
    }

    const errors = propertyConfigurationValidator(req.body);
    if(errors.length > 0)
    {
      return badRequestResponse(res, false, 'Validation Message', errors)
    }

    const {
      property_id,
      unit_name,
      carpet_area,
      length,
      width,
      width_unit,
      length_unit,
      carpet_price,
    } = req.body;

    const files = req.files;
    // console.log(files);

    let imageUrls = [];
    let connection;
    try {
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const now = new Date();

      const monthFolder = `${now.toLocaleString("default", { month: "short" }).toLowerCase()}-${now.getFullYear()}/`;
      const propertyFolder = `${monthFolder}${property_id}/`;

      async function ensureFolderExists(folderKey) {
        const listParams = { Bucket: bucketName, Prefix: folderKey, MaxKeys: 1 };
        const listObjects = await s3.send(new ListObjectsV2Command(listParams));

        if (!listObjects.Contents || listObjects.Contents.length === 0) {
          await s3.send(
            new PutObjectCommand({
              Bucket: bucketName,
              Key: `${folderKey}placeholder.txt`,
              Body: "This is a placeholder file.",
              ACL: "private",
            })
          );
        }
      }

      await ensureFolderExists(monthFolder);
      await ensureFolderExists(propertyFolder);

      connection = await pool.getConnection();
      await connection.beginTransaction();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname).toLowerCase();
        const fileName = `${unit_name ? unit_name.toLowerCase().replace(/ /g, "-") : "configuration"}-${uniqueSuffix}${extension}`;
        const fileKey = `${propertyFolder}${fileName}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read",
          })
        );

        const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

        const insertQuery = `INSERT INTO tbl_property_unit_configuration 
            (property_id, unit_name, carpet_area, length, width, width_unit, length_unit, carpet_price, unit_img_url, file_type, file_size)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const insertValues = [property_id, unit_name, carpet_area, length, width, width_unit, length_unit, carpet_price, imageUrl, file.mimetype, file.size];

        const [dbResponse] = await connection.query(insertQuery, insertValues);

        imageUrls.push({ id: dbResponse.insertId, imageUrl });
      }

      await connection.commit();

      const data = { [unit_name || "configuration"]: imageUrls };
      return successWithDataResponse(res, true, "Configuration added successfully.", data);
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error("Error updating configuration:", error);
      return badRequestResponse(res, false, "Failed to add configuration.", error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  });
};

export const deletePropertyConfiguration = async (req, res) => {
  const { id } = req.params;

  if (!id) {
      return badRequestResponse(res, false, "Missing required field: image_id");
  }

  let connection;

  try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      const selectQuery = `SELECT unit_img_url FROM tbl_property_unit_configuration WHERE id = ?`;
      const [rows] = await connection.query(selectQuery, [id]);

      if (!rows.length) {
          return badRequestResponse(res, false, "Configuration setting not found.");
      }

      const imageUrl = rows[0].unit_img_url;
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const s3Key = imageUrl.replace(`https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`, "");

      const pathParts = s3Key.split("/");
      if (pathParts.length < 3) {
          return badRequestResponse(res, false, "Invalid image path format");
      }

      const monthFolder = pathParts[0] + "/";
      const propertyFolder = `${monthFolder}${pathParts[1]}/`;

      await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }));

      const deleteQuery = `DELETE FROM tbl_property_unit_configuration WHERE id = ?`;
      await connection.query(deleteQuery, [id]);

      const listPropertyObjects = await s3.send(new PutObjectCommand({
          Bucket: bucketName,
          Prefix: propertyFolder,
      }));

      if (!listPropertyObjects.Contents || listPropertyObjects.Contents.length === 0) {
          await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: `${propertyFolder}placeholder.txt` }));
      }

      const listMonthObjects = await s3.send(new PutObjectCommand({
          Bucket: bucketName,
          Prefix: monthFolder,
      }));

      if (!listMonthObjects.Contents || listMonthObjects.Contents.length === 0) {
          await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: `${monthFolder}placeholder.txt` }));
      }

      await connection.commit();

      return successResponse(res, true, "Configuration deleted successfully.");

  } catch (error) {
      if (connection) {
          await connection.rollback();
      }
      console.error("Error deleting configuration:", error);
      return badRequestResponse(res, false, "Failed to delete configuration.", error);
  } finally {
      if (connection) {
          connection.release();
      }
  }
};

const uploadProgress = {};

export const uploadPropertyFilesWithWatermark = async (req, res) => {
  upload.array("images")(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return badRequestResponse(res, false, "Error processing uploaded files", err);
    }

    const { property_id, img_title, is_chunk, chunk_index, total_chunks } = req.body;
    const files = req.files;

    if (!property_id || !img_title || !files || !files.length) {
      return badRequestResponse(res, false, "Missing required fields or files");
    }

    let fileUrls = [];
    let connection;

    try {
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const now = new Date();

      const monthFolder = `${now.toLocaleString("default", { month: "short" }).toLowerCase()}-${now.getFullYear()}/`;
      const propertyFolder = `${monthFolder}${property_id}/`;

      async function ensureFolderExists(folderKey) {
        const listParams = { Bucket: bucketName, Prefix: folderKey, MaxKeys: 1 };
        const listObjects = await s3.send(new PutObjectCommand(listParams));

        if (!listObjects.Contents || listObjects.Contents.length === 0) {
          await s3.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: `${folderKey}placeholder.txt`,
            Body: "This is a placeholder file.",
            ACL: "private",
          }));
        }
      }

      await ensureFolderExists(monthFolder);
      await ensureFolderExists(propertyFolder);

      connection = await pool.getConnection();
      await connection.beginTransaction();

      for (let file of files) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname).toLowerCase();
        const fileName = `${img_title.toLowerCase().replace(/\s+/g, "-")}-${uniqueSuffix}${extension}`;
        const fileKey = `${propertyFolder}${fileName}`;

        let processedBuffer;

        if (file.mimetype.startsWith("image")) {
          processedBuffer = await sharp(file.buffer)
            .metadata()
            .then(({ width, height }) => {
              const maxWatermarkWidth = width * 0.3;
              const maxWatermarkHeight = height * 0.3;

              return sharp(watermarkPath)
                .resize({
                  width: Math.round(maxWatermarkWidth),
                  height: Math.round(maxWatermarkHeight),
                  fit: "inside",
                })
                .toBuffer();
            })
            .then((resizedWatermark) => {
              return sharp(file.buffer)
                .composite([{
                  input: resizedWatermark,
                  gravity: "center",
                  blend: "overlay",
                  opacity: 0.2,
                }])
                .toBuffer();
            })
            .catch((error) => {
              console.error("Error adding watermark to image:", error);
              throw new Error("Watermarking failed for image.");
            });
        } else if (file.mimetype.startsWith("video")) {
          const tempInputPath = path.join(__dirname, "../../../uploads", `${uniqueSuffix}-input${extension}`);
          const tempOutputPath = path.join(__dirname, "../../../uploads", `${uniqueSuffix}-watermarked${extension}`);
          const watermarkImagePath = path.join(__dirname, "../../../public/images/watermark.png");

          await fs.writeFile(tempInputPath, file.buffer);

          await new Promise((resolve, reject) => {
            ffmpeg(tempInputPath)
              .input(watermarkImagePath)
              .complexFilter([
                `[1:v]scale=iw*0.10:-1[watermark]`,
                `[0:v][watermark]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2`
              ])
              .outputOptions("-preset", "medium")
              .outputOptions("-crf", "23")
              .on("end", async () => {
                processedBuffer = await fs.readFile(tempOutputPath);
                await fs.unlink(tempInputPath);
                await fs.unlink(tempOutputPath);
                resolve();
              })
              .on("error", (err) => {
                console.error("FFmpeg error:", err);
                reject(err);
              })
              .save(tempOutputPath);
          });
        }

        await s3.send(new PutObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
          Body: processedBuffer,
          ContentType: file.mimetype,
          ACL: "public-read",
        }));

        const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

        const insertQuery = `INSERT INTO tbl_property_gallery (property_id, img_title, file_type, image_size, property_img_url)
          VALUES (?, ?, ?, ?, ?)`;

        const insertValues = [property_id, img_title, file.mimetype, file.size, fileUrl];
        const [dbResponse] = await connection.query(insertQuery, insertValues);

        fileUrls.push({ id: dbResponse.insertId, fileUrl });
      }

      await connection.commit();
      return successWithDataResponse(res, true, "Files uploaded successfully.", { fileUrls });
    } catch (error) {
      if (connection) await connection.rollback();
      console.error("Error updating files:", error);
      return badRequestResponse(res, false, `Failed to upload files: ${error.message}`, error);
    } finally {
      if (connection) connection.release();
    }
  });
};

export const getUploadProgress = (req, res) => {
  console.log(uploadProgress)
  console.log("test", req.headers);
  const sessionId = req.headers["session-id"];
  const progress = uploadProgress[sessionId] || 0;
  return res.json({ progress });
};
