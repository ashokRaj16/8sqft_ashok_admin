import express from "express";
import { getAgreementsRender, getAgreementDetailsRender } from "../controllers/agreementController.js";

const router = express.Router();

router.get('/', getAgreementsRender);
router.get('/details/:id', getAgreementDetailsRender);

export default router;
