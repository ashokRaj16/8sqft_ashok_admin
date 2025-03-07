import express from 'express';
import { listBlogs, getBlogById, listCategory } from "../../controllers/frontController/blogController.js";

const router = express.Router();

router.route('/category')
    .get(listCategory);
    
router.route('/')
    .get(listBlogs);

router.route('/:id')
    .get(getBlogById);



export default router;
