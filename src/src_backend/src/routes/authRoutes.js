
import express from "express";
import { sendOtpToMobile, verifyMobileOtp, sendOtpToEmail, verifyEmailOtp, resendOtpToEmail, registerUser, resendOtpToMobile} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp-wa", sendOtpToMobile);
router.post("/verify-otp-wa", verifyMobileOtp);
router.post("/resend-otp-wa", resendOtpToMobile);

router.post("/send-otp-email", sendOtpToEmail);
router.post("/verify-otp-email", verifyEmailOtp);
router.post("/resend-otp-email", resendOtpToEmail);
router.post("/register-user", registerUser);

export default router;

