import express from "express";
import * as propertyRequestController from "../../controllers/frontController/propertyReportController.js"

const router = express.Router();

router.post('/', propertyRequestController.createPropertyRequest);

export default router;