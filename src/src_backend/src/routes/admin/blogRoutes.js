import express from 'express';
import { listBlogs, getBlogById, updateBlog, addBlog, deleteBlog } from "../../controllers/admin/blogController.js";

const router = express.Router();

router.route('/')
    .get(listBlogs)
    .post(addBlog);

router.route('/:id')
    .get(getBlogById)
    .put(updateBlog)
    .delete(deleteBlog);

export default router;
