
import express from "express";
import * as locationController from '../controllers/common/locationController.js';

const router = express.Router();

router.get('/states', locationController.getStates);
router.get('/cities', locationController.getCitiesByState);
router.get('/citybypincode', locationController.getLocationsByPincodes);

export default router;
