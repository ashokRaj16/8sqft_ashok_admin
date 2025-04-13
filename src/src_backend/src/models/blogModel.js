import pool from '../config/db.js';

/**
 * Blogs
 * @param {*} whereClause 
 * @param {*} sortColumn 
 * @param {*} sortOrder 
 * @param {*} page 
 * @param {*} limit 
 * @returns 
 */
export const getAllblogListAdmin = async (whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
    try {
        const offset = (page - 1) * limit;
        const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
        const categoryJoin = `LEFT JOIN tbl_blog_category tbc ON tb.cat_id = tbc.id`
        const searchQuery = `SELECT tb.*, tbc.title as category_title
                    FROM  tbl_blogs tb
                    ${ categoryJoin}
                    ${whereClause} ${orderQuery}
                    LIMIT ${limit} OFFSET ${offset}`;

        const [rows] = await pool.execute(searchQuery);
        return rows;
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw new Error('Unable to fetch users.');
    }
};

export const getAllblogCountAdmin = async ( whereClause = null ) => {
    try {
        const categoryJoin = `LEFT JOIN tbl_blog_category tbc ON tb.cat_id = tbc.id`
        const totalCountQuery = `SELECT 
                    COUNT(*) AS count
                FROM 
                    tbl_blogs tb
                ${categoryJoin}
                ${whereClause}`;
        
        const [rows] = await pool.query(totalCountQuery);
        return rows[0].count;
    }
    catch(error) {
        throw new Error('Unable to fetch entry', error);
    }
};

export const createBlogAdmin = async (data) => {

    const { title, description, short_description, banner_image, banner_video, youtube_url, cat_id,
        tags, comment_enabled, author_name, meta_title, meta_description,
        meta_keyword, publish_date, user_id } = data;

    try {
      const inserQuery = `INSERT INTO tbl_blogs 
        (title, description, short_description, banner_image, 
        banner_size, banner_type, banner_video, youtube_url,
        cat_id, tags, comment_enabled, author_name, meta_title, 
        meta_description, meta_keyword, publish_date, added_by) 
        VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
      const paramsData = [title, description, short_description, banner_image, 
        banner_size, banner_type, banner_video, youtube_url, 
        cat_id, tags, comment_enabled, author_name, meta_title, 
        meta_description, meta_keyword, publish_date, user_id ];

      const [result] = await pool.execute( inserQuery, paramsData );
  
      return { insertId : result.insertId, affectedRows: result.affectedRows, ...data };

    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Unable to create user.', error);
    }
};

export const updateBlogAdmin = async (id, blogData) => {

try {
    
    let queryField = [];
    let queryParams = [];

    for (const [key, value] of Object.entries(blogData)) {
        if (value !== undefined && value !== null) {
            queryField.push(`${key} = ?`);
            queryParams.push(value);
        } 
    }
    queryParams.push(id);

    const query = `
            UPDATE tbl_blogs 
            SET 
            ${queryField.join(', ') }
            WHERE id = ?`;

    const [result] = await pool.execute(query, queryParams);
    return { affectedRows: result.affectedRows, ...blogData };
} catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Unable to update user.');
}
};

export const deleteBlogAdmin = async (id) => {
    try {
        const result = await pool.execute(`update tbl_blogs set is_deleted = '1' WHERE id = ?`, [id]);
        return result;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Unable to delete user.');
    }
};

export const getBlogByIdAdmin = async (id) => {

    try {
        const categoryJoin = `LEFT JOIN tbl_blog_category tbc ON tb.cat_id = tbc.id`
        const query = `SELECT tb.*, tbc.title as category_title
            FROM tbl_blogs tb
            ${categoryJoin}
            WHERE tb.id = ?`;
        
        const [rows] = await pool.execute(query, [id]);

        return rows;

    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Unable to fetch user.');
    }
};


/**
 * Blog category
 * @param {*} data 
 * @returns 
 */
export const getAllCategoryListAdmin = async ( whereClause = null, sortColumn = "id", sortOrder = "ASC", page = 1, limit = 10 ) => {
    try {
        const offset = (page - 1) * limit;
        const orderQuery = ` ORDER BY ${sortColumn} ${sortOrder}`;
        const categoryJoin = `LEFT JOIN tbl_blog_category tbi ON tbi.id = tbc.parent_cat_id`
        const searchQuery = `SELECT tbc.*, tbi.title as parent_cat_title
                FROM tbl_blog_category tbc
                ${categoryJoin}
                ${whereClause} ${orderQuery}
                LIMIT ${limit} OFFSET ${offset}`;

        const [rows] = await pool.execute(searchQuery);
        return rows;
    } catch (error) {
        console.error('Error fetching all category:', error);
        throw new Error('Unable to fetch category.');
    }
};

export const getAllCategoryCountAdmin = async ( whereClause = null ) => {
    try {

        const totalCountQuery = `SELECT 
                    COUNT(*) AS count
                FROM 
                    tbl_blog_category tbc
                ${whereClause}`;
        
        const [rows] = await pool.query(totalCountQuery);

        return rows[0].count;
    }
    catch(error) {
        throw new Error('Unable to fetch entry', error);
    }
};


export const createCategoryAdmin = async (data) => {

    const { title, description, cat_icon, cat_banner, parent_cat_id } = data;

    try {
      const inserQuery = `INSERT INTO tbl_blog_category 
        ( title, description, cat_icon, cat_banner, parent_cat_id ) 
        VALUES 
        (?, ?, ?, ?, ?)`;
      const paramsData = [ title, description, cat_icon, cat_banner, parent_cat_id ];

      const [result] = await pool.execute( inserQuery, paramsData );

      return { result, ...data };

    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Unable to create category.', error);
    }
};

export const updateCategoryAdmin = async (id, blogData) => {

try {
    
    let queryField = [];
    let queryParams = [];

    for (const [key, value] of Object.entries(blogData)) {
        if (value !== undefined && value !== null) {
            queryField.push(`${key} = ?`);
            queryParams.push(value);
        } 
    }
    queryParams.push(id);

    const query = `
            UPDATE tbl_blog_category 
            SET 
            ${queryField.join(', ') }
            WHERE id = ?`;

    const [result] = await pool.execute(query, queryParams);
    return { result, ...blogData };
} catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Unable to update category.');
}
};

export const deleteCategoryAdmin = async (id) => {
    try {
        const result = await pool.execute(`update tbl_blog_category set is_deleted = '1' WHERE id = ?`, [id]);
        return result;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw new Error('Unable to delete category.');
    }
};

export const updateBlogSlug = async (blogId, titleSlug) => {
    try {
      const query = "UPDATE blogs SET title_slug = ? WHERE id = ?";
      await db.execute(query, [titleSlug, blogId]);
      return true;
    } catch (error) {
      console.error("Error updating blog slug:", error);
      throw error;
    }
  };