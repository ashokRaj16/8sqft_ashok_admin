import express from 'express';
import { getProfile, updateProfile} from "../../controllers/frontController/profileController.js";
import { verifyEmail, verifyMobile, sendOtpToMobile, sendOtpToEmail } from '../../controllers/authController.js';
import { getInterestedUsers, 
        getShortlistedProperties, 
        getPaymentPlanTransaction, 
        getPaymentHistoryLogs, 
        getContectedProperties, 
        getListedProperties,
        getShortlistUsersByProperty,
        getContactedUsersByProperty } from '../../controllers/frontController/profileController.js';

const router = express.Router();

router.route('/')
        .get(getProfile)
        .put(updateProfile);

// user dashboard
router.get('/interested_users', getInterestedUsers);

router.get('/shortlisted_properties', getShortlistedProperties);
router.get('/contacted_properties', getContectedProperties);
router.get('/listed_properties', getListedProperties);

router.get('/payment_history', getPaymentHistoryLogs);
router.get('/plan_history', getPaymentPlanTransaction);

router.get('/shortlisted_users/:id', getShortlistUsersByProperty);
router.get('/contacted_users/:id', getContactedUsersByProperty);

// whatsapp verification
router.post('/send_otp_mobile', sendOtpToMobile);
router.post('/verify_wa', verifyMobile);

// email verification
router.post('/send_otp_email', sendOtpToEmail);
router.post('/verify_mail', verifyEmail);

export default router;