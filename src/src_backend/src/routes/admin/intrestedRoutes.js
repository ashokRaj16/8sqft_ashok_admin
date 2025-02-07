
import express from 'express';
// import blogController from "../../controllers/admin/blogController.js";
import { getAllIntrestedUsersByProperty, getAllInterestedPropertyByUser } from '../../controllers/admin/intrestedController.js';
const router = express.Router();

router.get('/intrest_users/:id', getAllIntrestedUsersByProperty);

router.get('/intrest_property/:id', getAllInterestedPropertyByUser );

export default router;
