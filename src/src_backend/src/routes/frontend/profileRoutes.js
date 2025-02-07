import express from 'express';
import { getProfile, updateProfile} from "../../controllers/frontController/profileController.js";
import { getInterestedUsers , getShortlistedProperties, getPaymentLogs } from '../../controllers/frontController/homeController.js';
const router = express.Router();

router.route('/')
        .get(getProfile)
        .put(updateProfile);

// user dashboard
router.get('/interested_users', getInterestedUsers);
router.get('/shortlisted_properties', getShortlistedProperties);
router.get('/payment_history', getPaymentLogs);

export default router;