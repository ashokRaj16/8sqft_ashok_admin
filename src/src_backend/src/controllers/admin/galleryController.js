import { deleteEnquiryAdmin, getAllEnquiryCountAdmin, getAllEnquiryListAdmin } from "../../models/enquiryModel.js";
import {
  badRequestResponse,
  successWithDataResponse,
} from "../../utils/response.js";
import validator from "validator";
import { upload, s3, getAllS3Files, 
  uploadFullFileToAWS,
  startAWSUpload, 
  uploadAWSChunk, 
  completeAWSUpload, 
  abortAWSUpload,
  removeAWSObject} from "../../utils/imageUploadHelper.js";
import fs from 'fs';
import { generateDirectoryName } from "../../utils/commonHelper.js";

export const listAllImagesFromBucket = async (req, res) => {
  try {
    let data = {};
    
    const { page, limit } = req.query;

    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 10;
    const offset = (pageCount - 1) * limitCount;

    const filters = req.query;

    const allowedColumns = [
      "id",
      "type",
      "Size",
      "LastModified",
    ];
    const allowedOrders = ["ASC", "DESC"];

    const sortColumn = allowedColumns.includes(filters.sortColumn)
      ? filters.sortColumn
      : "LastModified";

    const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase())
      ? filters.sortOrder?.toUpperCase()
      : "DESC";

    const filesResult = await getAllS3Files(filters, limitCount, sortColumn, sortOrder );
    const totalCount = filesResult.length;
 

    data["images"] = filesResult;
    data["totalCounts"] = totalCount;

    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + limit, totalCount);
    data["totalPages"] = totalPages;
    data["startIndex"] = startIndex;
    data["endIndex"] = endIndex;

    return successWithDataResponse(res, true, "Image list.", data);
  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, "Error fetching images!", error);
  }
};

export const getLinkImageDetails = async (req, res) => {
  try {
    let data = {};
    
    const { page, limit } = req.query;

    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 100;
    const offset = (page - 1) * limit;

    const filters = req.query;
    let whereClauses = [];

    if (filters?.searchFilter && filters?.searchFilter.trim()) {
      const newSearchfilter = `tcd.name like '%${validator.escape(
        filters.searchFilter.trim()
      )}%' OR 
      tcd.phone like '%${validator.escape(
          filters.searchFilter.trim()
      )}%' OR
      tcd.email like '%${validator.escape(
          filters.searchFilter.trim()
      )}%'  OR
      tp.property_title like '%${validator.escape(
          filters.searchFilter.trim()
      )}%' `;
      whereClauses.push(newSearchfilter);
    } 
    whereClauses.push(`tcd.is_deleted = '0'`);
    
    let baseQuery = "";
    if (whereClauses.length > 0) {
      baseQuery = ` WHERE ` + whereClauses.join(" AND ");
    }

    const allowedColumns = [
      "id",
      "property_title",
      "name",
      "phone",
      "email",
    ];
    const allowedOrders = ["ASC", "DESC"];

    const sortColumn = allowedColumns.includes(filters.sortColumn)
      ? filters.sortColumn
      : "id";

    const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase())
      ? filters.sortOrder?.toUpperCase()
      : "DESC";
    const propertyResult = await getAllEnquiryListAdmin(
      baseQuery,
      sortColumn,
      sortOrder,
      pageCount,
      limitCount
    );

    const totalCount = await getAllEnquiryCountAdmin(baseQuery);

    data["enquiry"] = propertyResult;
    data["totalCounts"] = totalCount;

    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + limit, totalCount);
    data["totalPages"] = totalPages;
    data["startIndex"] = startIndex;
    data["endIndex"] = endIndex;

    return successWithDataResponse(res, true, "Enquiry list.", data);
  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, "Error fetching Sponsared!", error);
  }
};

export const getImageLinkDetails = async (req, res) => {
  try {
    let data = {};
    
    const { page, limit } = req.query;

    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 100;
    const offset = (page - 1) * limit;

    const filters = req.query;
    let whereClauses = [];

    if (filters?.searchFilter && filters?.searchFilter.trim()) {
      const newSearchfilter = `tcd.name like '%${validator.escape(
        filters.searchFilter.trim()
      )}%' OR 
      tcd.phone like '%${validator.escape(
          filters.searchFilter.trim()
      )}%' OR
      tcd.email like '%${validator.escape(
          filters.searchFilter.trim()
      )}%'  OR
      tp.property_title like '%${validator.escape(
          filters.searchFilter.trim()
      )}%' `;
      whereClauses.push(newSearchfilter);
    } 
    whereClauses.push(`tcd.is_deleted = '0'`);
    
    let baseQuery = "";
    if (whereClauses.length > 0) {
      baseQuery = ` WHERE ` + whereClauses.join(" AND ");
    }

    const allowedColumns = [
      "id",
      "property_title",
      "name",
      "phone",
      "email",
    ];
    const allowedOrders = ["ASC", "DESC"];

    const sortColumn = allowedColumns.includes(filters.sortColumn)
      ? filters.sortColumn
      : "id";

    const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase())
      ? filters.sortOrder?.toUpperCase()
      : "DESC";
    const propertyResult = await getAllEnquiryListAdmin(
      baseQuery,
      sortColumn,
      sortOrder,
      pageCount,
      limitCount
    );

    const totalCount = await getAllEnquiryCountAdmin(baseQuery);

    data["enquiry"] = propertyResult;
    data["totalCounts"] = totalCount;

    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + limit, totalCount);
    data["totalPages"] = totalPages;
    data["startIndex"] = startIndex;
    data["endIndex"] = endIndex;

    return successWithDataResponse(res, true, "Enquiry list.", data);
  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, "Error fetching Sponsared!", error);
  }
};

// Upload Image in chunk.
export const postImageUploadStart = async (req, res) => {
  const { fileName, mimetype } = req.body;
  if(!fileName || !mimetype) {
    return badRequestResponse(res, false, "Missing required params.");
  }
  try {

    const updateFileName = generateDirectoryName(fileName);

    const response = await startAWSUpload(updateFileName, mimetype)
    
    const data = { uploadId : response.UploadId, fileName: updateFileName }
    return successWithDataResponse(
      res,
      true,
      "File uploading started.",
      data
    );
  } catch (error) {
    console.log(error, "error")
    return badRequestResponse(res, false, "Error file start uploading.", error);
  }
};

export const postImageUploadChunk = async (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return badRequestResponse(res, false, "Error processing uploaded file.", err);
    }

    const file = req.file;
    if (!file) {
      return badRequestResponse(res, false, "No file received.");
    }

    const { fileName, uploadId, partNumber } = req.body;
    const filePath = file.path;
    const mimetype = file.mimetype;
    try {
      
      const fileContent = fs.readFileSync(filePath);
      if (fileContent.length === 0) {
        console.error(`⚠️ File is empty: ${file.originalname}`);
        return badRequestResponse(res, false, "Failed to add configuration.");
      }

      // Upload whole image section...
      if (!uploadId || !partNumber) {
        const updateFileName = generateDirectoryName(fileName);
        const response = await uploadFullFileToAWS(updateFileName, mimetype, fs.createReadStream(filePath));
        fs.unlinkSync(filePath);
        return successWithDataResponse(res, true, "Full file uploaded successfully.", response);
      }
      const fileStream = fs.createReadStream(filePath);
      const response = await uploadAWSChunk(fileName, fileStream, uploadId, parseInt(partNumber));

      fs.unlinkSync(filePath); 

      return successWithDataResponse(res, true, "File part uploaded successfully.", {
        ETag: response.ETag,
        PartNumber: partNumber,
      });

    } catch (error) {
      console.error("Upload error:", error);
      return badRequestResponse(res, false, "Error uploading file.", error);
    }
  });
};

export const postImageUploadComplete = async (req, res) => {
  const { uploadId, fileName, uploadedParts } = req.body;

  try {
    // const updateFileName = generateDirectoryName(fileName);
    if(!fileName || !uploadId || !uploadedParts ) {
      return badRequestResponse(res, false, "Missing required fields.")
    }
    
    const response = await completeAWSUpload(fileName, uploadId, uploadedParts);

    const data = {
      ...response,
      Location : decodeURIComponent(response.Location)
    };
    
    return successWithDataResponse(
      res,
      true,
      "File uploading completed.",
      data
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error file complete uploading.", error);
  }
};

export const postImageUploadAbort = async (req, res) => {
  const { uploadId, fileName } = req.body;

  if(!fileName || !uploadId) {
    return badRequestResponse(res, false, "Missing required fields.")
  }

  try {
    const updateFileName = generateDirectoryName(fileName);    
    const response = await abortAWSUpload(updateFileName, uploadId);
     const data = response;
    return successWithDataResponse(
      res,
      true,
      "File uploading aborted.",
      data
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error file aborting uploading.", error);
  }
}

// remove Images
export const deleteFileFromGallery = async (req, res) => {
  const { file } = req.body;
  if(!file) {
    return badRequestResponse(res, false, "Missing required fields.");
  }
  try {
    const response = await removeAWSObject(file.Key);
    if (!response) {
      return badRequestResponse(res, false, "Image not found or not deleted.");
    }

    return successWithDataResponse(
      res,
      true,
      "Image deleted successfully.",
      response
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error deleting data.", error);
  }
};

export const deleteMultiImage = async (req, res) => {
  const { data } = req.body;

  try {
    const [result] = await deleteEnquiryAdmin(data);
    if (result.affectedRows === 0) {
      return badRequestResponse(res, false, "Images not found or not deleted.");
    }

    return successWithDataResponse(
      res,
      true,
      "Images deleted successfully.",
      result
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error deleting data.", error);
  }
};

export const changeImageProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await deleteEnquiryAdmin(id);
    if (result.affectedRows === 0) {
      return badRequestResponse(res, false, "Enquiry not found or not deleted.");
    }

    return successWithDataResponse(
      res,
      true,
      "Enquiry deleted successfully.",
      result
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error deleting data.", error);
  }
};

