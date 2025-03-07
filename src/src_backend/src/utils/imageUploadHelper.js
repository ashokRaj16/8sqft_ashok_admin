import multer from "multer";
import { 
  S3Client, 
  ListObjectsCommand, 
  GetObjectCommand,
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
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  const allowedExtensions = /\.(jpeg|jpg|png)$/i;

  const isMimeTypeValid = allowedTypes.includes(file.mimetype);
  console.log(file)
  const isExtensionValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

  if (isMimeTypeValid && isExtensionValid) {
      cb(null, true);
  } else {
      cb(new Error("Only images are allowed (jpeg, jpg, png)"));
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
        fileSize: 5 * 1024 * 1024, 
    },
    fileFilter :  fileFilterFunc
    // (req, file, cb) => {
    //     const allowedTypes = /jpeg|jpg|png/;
    //     const mimeType = allowedTypes.test(file.mimetype);
    //     const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    //     if (mimeType && extName) {
    //         return cb(null, true);
    //     } else {
    //         cb( new Error('Only images are allowed (jpeg, jpg, png)'));
    //     }
    // }
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

const startAWSUpload = async (fileName) => {
  if(!fileName) {
    throw new Error('Filename is required.')
  }
  try {
    
    const params = { 
      Bucket : bucketName,
      Key: fileName
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

const completeAWSUpload = async (fileName, uploadId, uploadedParts ) => {
  try {
    const params = {
      Bucket : bucketName,
      Key : fileName,
      UploadId : uploadId,
      MultipartUpload : { Parts: uploadedParts }
    }
    console.log(params, "params")
    const command = new CompleteMultipartUploadCommand(params)
    console.log(command, "params")

    const response = await s3.send(command);
    return response;
  }
  catch(error) {
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

export { upload, s3, getAllS3Files, startAWSUpload, uploadAWSChunk, completeAWSUpload, abortAWSUpload }