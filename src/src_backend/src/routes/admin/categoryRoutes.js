import express from 'express';
import { listCategory, addCategory, updateCategory, deleteCategory } from "../../controllers/admin/blogController.js";

const router = express.Router();

router.route('/')
    .get(listCategory)
    .post(addCategory);

router.route('/:id')
    .put(updateCategory)
    .delete(deleteCategory);

// ### add in frontend
// router.route('/:id/blog')
//     .put(getBlogByCategory)

export default router;