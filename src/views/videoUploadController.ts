import express, { Request, Response} from "express";
import multer from "multer";
import fs from "fs";
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();
const app = express();
// const PORT = process.env.PORT || 5000;

// AWS S3 Client
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION!,
});

const bucketName = process.env.AWS_BUCKET_NAME!;
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Step 1: Start Multipart Upload
export const startUpload = async (req: Request, res : Response) => {
  try {
    const { fileName } = req.body;

    const command = new CreateMultipartUploadCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    const response = await s3Client.send(command);
    res.json({ uploadId: response.UploadId, fileName });
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Step 2: Upload Video Chunks
// upload.single("file")        // add this as middleware
export const uploadChunk = async (req : Request, res : Response) => {
  try {
    const { uploadId, fileName, partNumber } = req.body;
    const filePath = req.file?.path || '';
    const fileStream = fs.createReadStream(filePath);

    const command = new UploadPartCommand({
      Bucket: bucketName,
      Key: fileName,
      UploadId: uploadId,
      PartNumber: parseInt(partNumber),
      Body: fileStream,
    });

    const response = await s3Client.send(command);
    fs.unlinkSync(filePath); // Delete chunk after upload

    res.json({ ETag: response.ETag, PartNumber: partNumber });
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Step 3: Complete Upload
export const completeUpload = async (req : Request, res : Response) => {
  try {
    const { uploadId, fileName, parts } = req.body;

    const command = new CompleteMultipartUploadCommand({
      Bucket: bucketName,
      Key: fileName,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    });

    const response = await s3Client.send(command);
    res.json({ message: "Upload completed!", response });
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Step 4: Abort Upload (if needed)
export const abortUpload = async (req: Request, res: Response) => {
  try {
    const { uploadId, fileName } = req.body;

    const command = new AbortMultipartUploadCommand({
      Bucket: bucketName,
      Key: fileName,
      UploadId: uploadId,
    });

    await s3Client.send(command);
    res.json({ message: "Upload aborted!" });
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
};

