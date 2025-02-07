import express from "express";
import multer from "multer";
import { getClients, getClientById, createClient, updateClient, changeClientStatus } from "../controllers/admin/brandsController.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.get("/", getClients);
router.get("/:id", getClientById);
router.post("/", upload.single("client_logo"), createClient);
router.put("/:id", upload.single("client_logo"), updateClient);
router.patch("/:id/status", changeClientStatus);

export default router;
