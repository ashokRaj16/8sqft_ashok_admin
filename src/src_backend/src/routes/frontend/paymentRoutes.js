import express from "express";
import { createPayment, paymentResponse } from "../../controllers/frontController/payCashfreeController.js";
const router = express.Router();

router.post("/create", createPayment);
router.get("/response", paymentResponse);

export default router;
