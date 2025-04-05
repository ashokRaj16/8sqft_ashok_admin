import {
  getBlogByIdAdmin,
  getAllblogCountAdmin,
  getAllblogListAdmin,
  getAllCategoryListAdmin,
  getAllCategoryCountAdmin
} from "../../models/blogModel.js";
import { formattedDate } from "../../utils/commonHelper.js";

import {
  badRequestResponse,
  successWithDataResponse,
} from "../../utils/response.js";
import validator from "validator";

export const listBlogs = async (req, res) => {
  try {
    let data = {};
    const { page, limit } = req.query;

    const pageCount = parseInt(page) || 1;
    const limitCount = parseInt(limit) || 100;
    const offset = (pageCount - 1) * limitCount;

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

    if (filters?.cat_id) {
      whereClauses.push(` tb.cat_id = ${filters.cat_id} `);
    }

    if (filters?.id) {
      whereClauses.push(` tb.id <> ${filters.id} `);
    }

    if (filters?.tag) {
      whereClauses.push(` tb.tags like '%${filters.tag}%'`);
    }

    whereClauses.push(` tb.is_deleted = '0' `);
    whereClauses.push(` tb.status = '1' `);
    whereClauses.push(` DATE(tb.publish_date) <= CURDATE() `);

    let baseQuery = whereClauses.length > 0 ? ` WHERE ` + whereClauses.join(" AND ") : "";

    const allowedColumns = ["id", "title", "author_name", "created_at", "status"];
    const allowedOrders = ["ASC", "DESC"];

    const sortColumn = allowedColumns.includes(filters.sortColumn) ? filters.sortColumn : "tb.id";
    const sortOrder = allowedOrders.includes(filters.sortOrder?.toUpperCase()) ? filters.sortOrder?.toUpperCase() : "DESC";

    const propertyResult = await getAllblogListAdmin(baseQuery, sortColumn, sortOrder, pageCount, limitCount);
    const propertyTotalCount = await getAllblogCountAdmin(baseQuery);

    data["blogs"] = propertyResult;
    data["totalCounts"] = propertyTotalCount;

    const totalPages = Math.ceil(propertyTotalCount / limitCount);
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + limitCount, propertyTotalCount);
    data["totalPages"] = totalPages;
    data["startIndex"] = startIndex;
    data["endIndex"] = endIndex;

    // Function to format date in DD-MM-YYYY format
    const formatDate = (date) => {
      if (!date) return null;
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(new Date(date));
    };

    // Function to generate meta title and description with fallbacks
    const getMetaTitle = () => "Latest Real Estate News & Updates - 8sqft.com";
    const getMetaDescription = () => 
      "Stay updated with the latest real estate trends, property insights, and market news in Maharashtra with 8sqft.com.";

    // Construct JSON-LD schema for each blog
    let blogJsonLdArray = propertyResult.map((blog) => {
      const publishedDate = formatDate(blog.created_at) || formatDate(new Date());
      const modifiedDate = formatDate(blog.updated_at) || publishedDate;

      let imageObject = blog.banner_image
        ? {
            "@context": "https://schema.org",
            "@type": "ImageObject",
            "contentUrl": `https://8sqft.com/Blog/${blog.title_slug}`,
            "name": blog.title,
            "description": blog.short_description,
            "author": {
              "@type": "Organization",
              "name": "8sqft.com"
            },
            "datePublished": publishedDate,
            "license": "",
            "height": "1080",
            "width": "1920"
          }
        : null;

      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "description": blog.short_description,
        "datePublished": publishedDate,
        "dateModified": modifiedDate,
        "author": {
          "@type": "Person",
          "name": blog.author_name || "8sqft.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "8sqft.com",
          "logo": {
            "@type": "ImageObject",
            "contentUrl": blog.banner_image
          }
        },
        "image": imageObject,
        "url": `https://8sqft.com/Blog/${blog.title_slug}`
      };
    });

    // Add common meta and JSON-LD to response
    data["meta_title"] = getMetaTitle();
    data["meta_description"] = getMetaDescription();
    data["jsonLdSchema"] = blogJsonLdArray;

    return successWithDataResponse(res, true, "Blog list.", data);
  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, "Error fetching blog!", error);
  }
};



// export const getBlogById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const [result] = await getBlogByIdAdmin(id);
//     return successWithDataResponse(res, true, "Blog details.", result);
//   } catch (error) {
//     return badRequestResponse(res, false, "Error fetching blog.", error);
//   }
// };

export const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await getBlogByIdAdmin(id);

    if (!result) {
      return badRequestResponse(res, false, "Blog not found.", {});
    }

    const formatDate = (date) => {
      if (!date) return null;
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(new Date(date));
    };

    result.meta_title = result.meta_title || result.title;
    result.meta_description = result.meta_description || result.short_description;

    const publishedDate = formatDate(result.created_at) || formatDate(new Date());
    const modifiedDate = formatDate(result.updated_at) || publishedDate;

    let imageObject = result.banner_image
      ? {
          "@context": "https://schema.org",
          "@type": "ImageObject",
          "contentUrl": `https://8sqft.com/Blog/${result.title_slug}`,
          "name": result.meta_title,
          "description": result.meta_description,
          "author": {
            "@type": "Organization",
            "name": "8sqft.com"
          },
          "datePublished": publishedDate,
          "license": "",
          "height": "1080",
          "width": "1920"
        }
      : null;

  
    let jsonLdSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": result.meta_title,
      "description": result.meta_description,
      "datePublished": publishedDate,
      "dateModified": modifiedDate,
      "author": {
        "@type": "Person",
        "name": result.author || "8sqft.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "8sqft.com",
        "logo": {
          "@type": "ImageObject",
          "contentUrl": "https://8sqft.com/assets/logo/ForWebSiteWhite.svg"
        }
      },
      "image": imageObject,
      "url": `https://8sqft.com/Blog/${result.title_slug}`
    };

    result.jsonLdSchema = jsonLdSchema;

    return successWithDataResponse(res, true, "Blog details.", result);
  } catch (error) {
    return badRequestResponse(res, false, "Error fetching blog.", error);
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


