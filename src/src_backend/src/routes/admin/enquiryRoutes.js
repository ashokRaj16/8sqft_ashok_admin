import express from 'express';
import { deleteEnquiry, listEnquiry } from '../../controllers/admin/enquiryController.js';

const router = express.Router();

router.route('/').get(listEnquiry);
router.route('/:id').delete(deleteEnquiry);

export default router;
