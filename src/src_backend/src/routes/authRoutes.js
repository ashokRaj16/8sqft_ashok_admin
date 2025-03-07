
import express from "express";
import { sendOtpToMobile_test, sendOtpToMobile, verifyMobileOtp, sendOtpToEmail, verifyEmailOtp, resendOtpToEmail, registerUser, resendOtpToMobile, sendTextMessage} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp-wa-test", sendOtpToMobile_test);
router.post("/send-otp-wa", sendOtpToMobile);
router.post("/verify-otp-wa", verifyMobileOtp);
router.post("/resend-otp-wa", resendOtpToMobile);

router.post("/send-otp-email", sendOtpToEmail);
router.post("/verify-otp-email", verifyEmailOtp);
router.post("/resend-otp-email", resendOtpToEmail);
router.post("/register-user", registerUser);

router.post("/send-text-message", sendTextMessage);

export default router;

