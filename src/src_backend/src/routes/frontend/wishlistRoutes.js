import express from "express";
const router = express.Router();
import * as wishlistController from "../../controllers/frontController/wishlistController.js";

router.post('/', wishlistController.addToWishlist);
router.delete('/:id', wishlistController.removeShortlistPropertyByUser);

export default router;