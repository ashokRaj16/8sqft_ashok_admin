import {
  createBlogAdmin,
  deleteBlogAdmin,
  getBlogByIdAdmin,
  updateBlogAdmin,
  getAllblogCountAdmin,
  getAllblogListAdmin,
  createCategoryAdmin,
  getAllCategoryListAdmin,
  getAllCategoryCountAdmin,
  deleteCategoryAdmin,
  updateCategoryAdmin,
} from "../../models/blogModel.js";
import { formattedDate, sanitizedField } from "../../utils/commonHelper.js";
import {
  badRequestResponse,
  successWithDataResponse,
} from "../../utils/response.js";
import validator from "validator";
import slugify from "slugify";


export const listBlogs = async (req, res) => {
  try {
    let data = {};
    const { page, limit } = req.query;

    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 100;
    const offset = (page - 1) * limit;

    const filters = req.query;
    let whereClauses = [];

    if (filters?.searchFilter && filters?.searchFilter.trim()) {
      const newSearchfilter = `tb.title like '%${validator.escape(
        filters.searchFilter.trim()
      )}%' OR 
      tb.author_name like '%${validator.escape(
        filters.searchFilter.trim()
      )}%' OR
      tb.short_description like '%${validator.escape(
        filters.searchFilter.trim()
      )}%' OR
      tbc.title like '%${validator.escape(
        filters.searchFilter.trim()
      )}%'
      `;
      whereClauses.push(newSearchfilter);
    }


    whereClauses.push(` tb.is_deleted = '0' `);

    let baseQuery = "";
    if (whereClauses.length > 0) {
      baseQuery = ` WHERE ` + whereClauses.join(" AND ");
    }
    console.log(baseQuery,"baseee")
    const allowedColumns = [
      "id",
      "title",
      "author_name",
      "	created_at",
      "status",
    ];
    const allowedOrders = ["ASC", "DESC"];

    const sortColumn = allowedColumns.includes(filters.sortColumn)
      ? filters.sortColumn
      : "tb.id";

    const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase())
      ? filters.sortOrder?.toUpperCase()
      : "DESC";

    console.log(filters, sortColumn, sortOrder);
    const propertyResult = await getAllblogListAdmin(
      baseQuery,
      sortColumn,
      sortOrder,
      pageCount,
      limitCount
    );
    const propertyTotalCount = await getAllblogCountAdmin(baseQuery);

    data["blogs"] = propertyResult;
    data["totalCounts"] = propertyTotalCount;

    const totalPages = Math.ceil(propertyTotalCount / limit);
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + limit, propertyTotalCount);
    data["totalPages"] = totalPages;
    data["startIndex"] = startIndex;
    data["endIndex"] = endIndex;

    return successWithDataResponse(res, true, "Blog list.", data);
  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, "Error fetching blog!", error);
  }
};

export const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    // const [blog] = await pool.execute("SELECT * FROM tbl_blogs WHERE id = ?", [id]);
    // res.status(200).json({ success: true, data: blog[0] });
    const [result] = await getBlogByIdAdmin(id);
    return successWithDataResponse(res, true, "Blog details.", result);
  } catch (error) {
    return badRequestResponse(res, false, "Error fetching blog.", error);
  }
};

// Add a new blog
export const addBlog = async (req, res) => {
  const {
    title,
    description,
    short_description,
    banner_image,
    banner_size,
    banner_type,
    banner_video,
    youtube_url,
    cat_id,
    tags,
    comment_enabled,
    author_name,
    meta_title,
    meta_description,
    meta_keyword,
    publish_date,
  } = req.body;

  //console.log(req.body, "bodyyyyy");
  
  try {
    const data = {
      title: title && sanitizedField( title, true, 'CAPITALIZE', {replaceMultipleSpaces: true}) || null,
      description: description && sanitizedField(description, true) || null,
      short_description: short_description && sanitizedField(short_description, true) || null,
      banner_image: banner_image || null,
      banner_size : banner_size || null,
      banner_type : banner_type || null,
      banner_video: banner_video || null,
      youtube_url : youtube_url || null,
      cat_id: cat_id || 0,
      tags: tags || null,
      comment_enabled: comment_enabled || null,
      author_name: author_name || null,
      meta_title: meta_title || title || null,
      meta_description: meta_description || null,
      meta_keyword: meta_keyword || null,
      publish_date : publish_date || null,
      user_id: req.userId,
    };

    const result = await createBlogAdmin(data);

    if (result && result.insertId) {
      const titleSlug = slugify(sanitizedTitle, {
        lower: true,
        strict: true,
        replacement: "-",
      });

      const finalSlug = `${titleSlug}-${result.insertId}`;

      // Update the blog entry with the generated slug
      await updateBlogSlug(result.insertId, finalSlug);
    }


    return successWithDataResponse(
      res,
      true,
      "Blog added successfully.",
      result
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error creating blog.", error);
  }
};

export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    short_description,
    banner_image,
    banner_video,
    youtube_url,
    cat_id,
    tags,
    comment_enabled,
    author_name,
    meta_title,
    meta_description,
    meta_keyword,
    publish_date
  } = req.body;

  try {


      const sanitizedTitle = title
      ? sanitizedField(title, true, "CAPITALIZE", { replaceMultipleSpaces: true })
      : null;

      // Generate new slug if title is updated
      const titleSlug = sanitizedTitle
      ? `${slugify(sanitizedTitle, { lower: true, strict: true })}-${id}`
      : null;

    const data = {
      title: title || null,
      description: description || null,
      short_description: short_description || null,
      banner_image: banner_image || null,
      banner_video: banner_video || null,
      youtube_url : youtube_url || null,
      cat_id: cat_id || 0,
      tags: tags || null,
      comment_enabled: comment_enabled || null,
      author_name: author_name || null,
      meta_title: meta_title || title || null,
      meta_description: meta_description || null,
      meta_keyword: meta_keyword || null,
      publish_date : publish_date || null,
      title_slug: titleSlug || null,
      added_by: req.userId,
    };

    const result = await updateBlogAdmin(id, data);

    if (result.affectedRows === 0) {
      return badRequestResponse(res, false, "Blog not found or not updated.");
    }

    return successWithDataResponse(
      res,
      true,
      "Blog updated successfully.",
      result
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error updating blog.", error);
  }
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    // const [result] = await pool.execute(
    //     "DELETE FROM tbl_blogs WHERE id = ?",
    //     [id]
    // );
    const [result] = await deleteBlogAdmin(id);
    if (result.affectedRows === 0) {
      return badRequestResponse(res, false, "Blog not found or not deleted.");
    }

    return successWithDataResponse(
      res,
      true,
      "Blog deleted successfully.",
      result
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error deleting blog.", error);
  }
};

export const listCategory = async (req, res) => {
  try {
    let data = {};
    const { page, limit } = req.query;

    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 100;
    const offset = (page - 1) * limit;

    const filters = req.query;
    let whereClauses = [];

    if (filters?.searchFilter && filters?.searchFilter.trim()) {
      const newSearchfilter = `tbc.title like '%${validator.escape(
        filters.searchFilter.trim()
      )}%'`;
      whereClauses.push(newSearchfilter);
    }

    whereClauses.push(` tbc.is_deleted = '0' `);

    let baseQuery = "";
    if (whereClauses.length > 0) {
      baseQuery = ` WHERE ` + whereClauses.join(" AND ");
    }

    const allowedColumns = ["id", "title", "status"];
    const allowedOrders = ["ASC", "DESC"];

    const sortColumn = allowedColumns.includes(filters.sortColumn)
      ? filters.sortColumn
      : "tbc.id";

    const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase())
      ? filters.sortOrder?.toUpperCase()
      : "ASC";

    console.log(filters, sortColumn, sortOrder);
    const propertyResult = await getAllCategoryListAdmin(
      baseQuery,
      sortColumn,
      sortOrder,
      pageCount,
      limitCount
    );
    const propertyTotalCount = await getAllCategoryCountAdmin(baseQuery);

    data["category"] = propertyResult;
    data["totalCounts"] = propertyTotalCount;

    const totalPages = Math.ceil(propertyTotalCount / limit);
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + limit, propertyTotalCount);
    data["totalPages"] = totalPages;
    data["startIndex"] = startIndex;
    data["endIndex"] = endIndex;

    return successWithDataResponse(res, true, "Blog Category list.", data);
  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, "Error fetching category!", error);
  }
};

// Add a new blog
export const addCategory = async (req, res) => {
  const { title, description, cat_icon, cat_banner, parent_cat_id } = req.body;

  try {
      console.log("data::", req.body)
    const data = {
      title: title || null,
      description: description || null,
      cat_icon: cat_icon || null,
      cat_banner: cat_banner || null,
      parent_cat_id : parent_cat_id || null
    };
    const result = await createCategoryAdmin(data);
    return successWithDataResponse(
      res,
      true,
      "Blog category added successfully.",
      result
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error creating category.", error);
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { title, description, cat_icon, cat_banner } = req.body;

  try {
    const data = {
      title: title || null,
      description: description || null,
      cat_icon: cat_icon || null,
      cat_banner: cat_banner || null,
    };
    console.log("data::", req.body)

    const result = await updateCategoryAdmin(id, data);

    if (result.result.affectedRows === 0) {
      return badRequestResponse(
        res,
        false,
        "Cagetory not found or not updated."
      );
    }

    return successWithDataResponse(
      res,
      true,
      "Cagetory updated successfully.",
      result
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error updating cagetory.", error);
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await deleteCategoryAdmin(id);
    if (result.affectedRows === 0) {
      return badRequestResponse(
        res,
        false,
        "Cagetory not found or not deleted."
      );
    }

    return successWithDataResponse(
      res,
      true,
      "Cagetory deleted successfully.",
      result
    );
  } catch (error) {
    return badRequestResponse(res, false, "Error deleting cagetory.", error);
  }
};
