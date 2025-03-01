
import express from 'express';
import { getAllContactedUsersByProperty, getAllContactedPropertyByUser } from '../../controllers/admin/contactedController.js';
const router = express.Router();

router.get('/contact_users/:id', getAllContactedUsersByProperty);
router.get('/contact_property/:id', getAllContactedPropertyByUser );

export default router;
