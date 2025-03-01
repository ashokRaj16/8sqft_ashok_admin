import express from "express";
import { requestOtp , verifyOtp } from "../../controllers/frontController/aadhaarController.js";

const router = express.Router();

router.post('/request_otp', requestOtp);
router.post('/verify_otp', verifyOtp);

export default router;