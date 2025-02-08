import express from "express";
import { getAgreements, getAgreementDetails, createAgreement} from "../../controllers/agreementController.js";

const router = express.Router();

router.route('/')
        .post( createAgreement )
        .get( getAgreements );

router.get('/:id', getAgreementDetails );

export default router;