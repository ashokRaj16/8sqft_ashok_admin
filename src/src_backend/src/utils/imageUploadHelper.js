import multer from "multer";
import { 
  S3Client, 
  ListObjectsCommand, 
  GetObjectCommand,
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand } from "@aws-sdk/client-s3";
import path from 'path'
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 100 * 1024 * 1024 },
// });

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname).toLowerCase(); // Extract the file extension
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

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const getAllS3Files = async () => {
  try {

    const parmas = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
    }
   
    const listObject = new ListObjectsCommand(parmas)
    console.log(listObject, ":::list objectsssss")

    return true;
  }catch (error) { 
    throw new Error(error)
  }
}

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const regionName = process.env.AWS_REGION;

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
    console.log(JSON.stringify(params), "uploadssss params")
    const command = new CompleteMultipartUploadCommand(params)
    console.log(command, "command")

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

export { upload, s3, getAllS3Files, startAWSUpload, uploadAWSChunk, completeAWSUpload, abortAWSUpload, uploadFullFileToAWS }