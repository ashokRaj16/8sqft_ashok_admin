import { deleteEnquiryAdmin, getAllEnquiryCountAdmin, getAllEnquiryListAdmin } from "../../models/enquiryModel.js";
import {
  badRequestResponse,
  successWithDataResponse,
} from "../../utils/response.js";
import validator from "validator";
import { upload, s3, getAllS3Files, 
  startAWSUpload, 
  uploadAWSChunk, 
  completeAWSUpload, 
  abortAWSUpload} from "../../utils/imageUploadHelper.js";
import fs from 'fs';

export const listAllImagesFromBucket = async (req, res) => {
  try {
    let data = {};
    
    const { page, limit } = req.query;

    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 10;
    const offset = (pageCount - 1) * limitCount;

    const filters = req.query;
    let whereClauses = [];

    if (filters?.searchFilter && filters?.searchFilter.trim()) {
      const newSearchfilter = `img_name like '%${validator.escape(
        filters.searchFilter.trim()
      )}%'`;

      whereClauses.push(newSearchfilter);
    }

    const allowedColumns = [
      "id",
      "type",
      "date",
    ];
    const allowedOrders = ["ASC", "DESC"];

    const sortColumn = allowedColumns.includes(filters.sortColumn)
      ? filters.sortColumn
      : "id";

    const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase())
      ? filters.sortOrder?.toUpperCase()
      : "DESC";


    console.log(filters, sortColumn, sortOrder);
    const propertyResult = await getAllS3Files();

    // const propertyResult = await getAllS3Files(
    //   baseQuery,
    //   sortColumn,
    //   sortOrder,
    //   pageCount,
    //   limitCount
    // );

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

    console.log(filters, sortColumn, sortOrder);
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

    console.log(filters, sortColumn, sortOrder);
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
  const { fileName } = req.body;
  if(!fileName) {
    return badRequestResponse(res, false, "File Name is required.")
  }
  try {
    const response = await startAWSUpload(fileName)
    console.log(response, "start response")
    
    const data = { uploadId : response.UploadId, fileName}
    return successWithDataResponse(
      res,
      true,
      "File uploading started.",
      data
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error file start uploading.", error);
  }
};

export const postImageUploadChunk = (req, res) => {
  
  upload.single('file') (req, res, async (err) => {
    console.log(req.file, "bodyyyy.");
    if (err) {
      console.error("SQFT Multer error:", err);
      return badRequestResponse(res, false, "Error processing uploaded files.", err);
    }

    const { fileName, uploadId, partNumber } = req.body;
    
    if(!fileName || !uploadId || !partNumber) {
      return badRequestResponse(res, false, "Missing required fields.")
    }
    try {
      const filePath = req.file?.path || '';
      
      if (!fs.existsSync(filePath)) {
        return badRequestResponse(res, false, "Uploaded file not found.");
      }
      
      const fileStream = fs.createReadStream(filePath);
      const response = await uploadAWSChunk( fileName, fileStream, uploadId, parseInt(partNumber));
      console.log(fileStream,  ":::responsessss")
      // fs.unlinkSync(filePath);
      const data = {
        Etag : response.ETag, PartNumber : partNumber
      }
      return successWithDataResponse(
        res,
        true,
        "File part uploading...",
        data
      );
    } catch (error) {
      return badRequestResponse(res, false, "Error file chunk uploading.", error);
    }

  })
};


export const postImageUploadComplete = async (req, res) => {
  const { uploadId, fileName, uploadedParts } = req.body;

  try {
    if(!fileName || !uploadId || !uploadedParts ) {
      return badRequestResponse(res, false, "Missing required fields.")
    }
    
    console.log(uploadId, fileName, uploadedParts, "upload complete")
    const response = await completeAWSUpload(fileName, uploadId, uploadedParts);
    console.log(response , "upload complete")
    const data = response;
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
    const response = await abortAWSUpload(fileName, uploadId);
     console.log(response , "upload abort")
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
export const deleteImage = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await deleteEnquiryAdmin(id);
    console.log(id, result)
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

export const deleteMultiImage = async (req, res) => {
  const { data } = req.body;

  try {
    const [result] = await deleteEnquiryAdmin(data);
    console.log(id, result)
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
    console.log(id, result)
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