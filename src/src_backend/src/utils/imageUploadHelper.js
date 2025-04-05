import multer from "multer";
import { 
  S3Client, 
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand, 
  ListObjectsV2Command, 
  DeleteObjectsCommand
} from "@aws-sdk/client-s3";
  
import axios from 'axios';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url';
import { sanitizedField } from "./commonHelper.js";
// import path from 'path';

const fileFilterFunc = (req, file, cb) => {

  if(req.body.uploadId) {
    cb(null, true);
    return;
  }

  const allowedTypes = [
    "image/jpeg", "image/jpg", "image/png", 
    "application/pdf", "application/msword",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
    "application/vnd.ms-excel", 
    "video/mp4", "video/webm", 
    "audio/wav"
  ];

  const allowedExtensions = /\.(jpeg|jpg|png|pdf|doc|docx|xls|xlsx|mp4|webm|wav)$/i;

  const isMimeTypeValid = allowedTypes.includes(file.mimetype);
  const isExtensionValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

  if (isMimeTypeValid && isExtensionValid) {
      cb(null, true);
  } else {
      cb(new Error("Only files allowed with extension (jpeg, jpg, png, pdf, mp4, xlsx, wav, doc)"));
  }
};

// *** permant storage at server.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    }
})

const upload = multer({ 
    storage : storage,
    limits: {
        fileSize: 10 * 1024 * 1024, 
    },
    fileFilter :  fileFilterFunc
})

const uploadTempFile = multer({ 
  storage : multer.memoryStorage(),
  limits: {
      fileSize: 10 * 1024 * 1024, 
  },
  fileFilter :  fileFilterFunc
})

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const regionName = process.env.AWS_REGION;



const getAllS3Files = async (filters = null, limit = 10, sortColumn, sortOrder ) => {
  try {
    let allFiles = [];

    let params = {
      Bucket: bucketName,
      MaxKeys: limit,
      Delimiter: "", 
    }
   
    if (filters?.name) {
      const searchName = sanitizedField(filters.name,  true, "LOWERCASE");
    }

    // if (filters?.delimiter) {
    //   params.Delimiter = filters.delimiter
    // }

    if (filters?.prefix) {
      params.Prefix = filters.prefix
    }
    const command = new ListObjectsV2Command(params);

    const response = await s3.send(command);
    allFiles = response.Contents || [];

    allFiles.sort((a, b) => {
      if (sortColumn === "LastModified") {
        return sortOrder === "DESC"
          ? new Date(b.LastModified) - new Date(a.LastModified)
          : new Date(a.LastModified) - new Date(b.LastModified);
      }

      if (sortColumn === "Size") {
        return sortOrder === "DESC" ? b.Size - a.Size : a.Size - b.Size;
      }

      if (sortColumn === "type") {
        const extA = a.Key.split('.').pop().toLowerCase();
        const extB = b.Key.split('.').pop().toLowerCase();
        return sortOrder === "DESC" ? extB.localeCompare(extA) : extA.localeCompare(extB);
      }

      return 0;
    });
    
    const signedFiles = allFiles.map((file) => ({
      Key: file.Key,
      Type: file.Key.split('.').pop().toLowerCase(),
      Size: file.Size,
      LastModified : file.LastModified,
      Url: `https://${bucketName}.s3.${regionName}.amazonaws.com/${file.Key}`
    })) 

    return signedFiles;
  }catch (error) { 
    throw new Error(error)
  }
}

const getS3FilesByName = async (keyName = null) => {
  try {

    const parmas = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key : keyName
    }
   
    const listObject = new ListObjectsV2Command(parmas)

    return true;
  }catch (error) { 
    throw new Error(error)
  }
}

const startAWSUpload = async (fileName, mimetype) => {
  if(!fileName) {
    throw new Error('Filename is required.')
  }
  try {
    
    const params = { 
      Bucket : bucketName,
      Key: fileName,
      ContentType: mimetype,
      ACL: "public-read"
    }
    const command = new CreateMultipartUploadCommand(params)
    const response = await s3.send(command);
    return response
  }
  catch(error) {
    throw new Error(error);
  }
}

const uploadAWSChunk = async (fileName, fileStream, uploadId, partNumber) => {
  if(!fileName || !partNumber || !fileStream) {
    throw new Error('Required field missing.')
  }
  try {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      UploadId : uploadId,
      PartNumber: partNumber,
      Body: fileStream
    }
    const command = new UploadPartCommand(params);
    const response = await s3.send(command);
    return response;
  }
  catch(error) {
    throw new Error(error);
  }
}

const uploadFullFileToAWS = async (fileName, mimetype, fileStream) => {
  if(!fileName || !fileStream) {
    throw new Error('Required field missing.')
  }
  try {

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileStream,
      ContentType: mimetype,
      ACL: "public-read",
    }
    
    const command = new PutObjectCommand(params);
    const response = await s3.send(command);
    const s3Url = `https://${bucketName}.s3.${regionName}.amazonaws.com/${fileName}`;
    return {
      Location: s3Url,
      Key: fileName,
      Bucket: bucketName,
      ETag: response.ETag
    };
  }
  catch(error) {
    throw new Error(error);
  }
}

const completeAWSUpload = async (fileName, uploadId, uploadedParts ) => {
  try {
    const formattedParts = uploadedParts.map(part => ({
      ETag: part.ETag.replace(/"/g, ""), // Ensure no extra quotes
      PartNumber: Number(part.partNumber) // Ensure PartNumber is a number
    }));
    const params = {
      Bucket : bucketName,
      Key : fileName,
      UploadId : uploadId,      
      MultipartUpload : { Parts: formattedParts }
    }
    const command = new CompleteMultipartUploadCommand(params)

    const response = await s3.send(command);
    return response;
  }
  catch(error) {
    console.log(error, "s3 error");
    throw new Error(error);
  }
}

const abortAWSUpload = async ( fileName, uploadId ) => {
  try {
    const params = {
      Bucket : bucketName,
      Key : fileName,
      UploadId : uploadId
    }
    const command = new AbortMultipartUploadCommand(params)
    const response = await s3.send(command);
    return response;
  }
  catch(error) {
    throw new Error(error);
  }
}

const removeAWSObject = async ( file ) => {
  try {
    const params = {
      Bucket : bucketName,
      Key : file
    }
    const command = new DeleteObjectCommand(params)
    const response = await s3.send(command);
    return response;
  }
  catch(error) {
    throw new Error(error);
  }
}

const s3ExcelUrl = 'https://8sqft-images.s3.eu-north-1.amazonaws.com/test_marketing_excel.xlsx';
const downloadAndProcessExcel = async (url) => {
  
  try {
    // Step 1: Download the Excel file
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer' // Get the file as a buffer
    });
    
        // Step 2: Save the file locally (Optional for debugging)
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.join(__dirname, 'temp.xlsx');
        fs.writeFileSync(filePath, response.data);

        // Step 3: Read the Excel file using ExcelJS
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(response.data);

        // Step 4: Get the first sheet
        const worksheet = workbook.worksheets[0];

        // Step 5: Extract mobile numbers from the 2nd column
        const mobileNumbers = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header row
                const mobile = row.getCell(2).value; // 2nd column (Mobile)
                if (mobile && typeof mobile === 'string' && mobile.trim() !== '') {
                    mobileNumbers.push(mobile.trim());
                } else if (mobile && typeof mobile === 'number') {
                    mobileNumbers.push(mobile.toString()); // Convert number to string
                }
            }
        });

        return mobileNumbers;
    } catch (error) {
        console.error('Error processing Excel file:', error.message);
        throw new Error(error);
    }
};

export { upload, uploadTempFile, s3, getAllS3Files, startAWSUpload, uploadAWSChunk, completeAWSUpload, abortAWSUpload, uploadFullFileToAWS, removeAWSObject, downloadAndProcessExcel }