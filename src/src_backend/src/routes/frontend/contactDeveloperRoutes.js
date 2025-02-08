import express from "express";
import { contactDeveloper } from "../../controllers/frontController/contactDeveloperController.js";

const router = express.Router();

router.post("/", contactDeveloper);

export default router;
