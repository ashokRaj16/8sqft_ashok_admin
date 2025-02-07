import express from "express";
import { capturePayment, createPayment, verifySignature } from '../../controllers/frontController/payRazorpayController.js'

const router = express.Router();

router.post("/create", createPayment);
router.post("/:paymentId/capture", capturePayment);

router.post("/response", verifySignature);

export default router;
 