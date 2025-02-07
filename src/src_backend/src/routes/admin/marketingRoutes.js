import express from 'express';
import { sendMessage } from '../../controllers/admin/marketingController.js';

const router = express.Router();

router.route('/').post(sendMessage);

export default router;

