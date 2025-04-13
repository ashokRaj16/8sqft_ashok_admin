import express from "express";
import { getHomeCountInfo, getSearchDropDownLocations, contact_us, getRecommendations, getSpotlight } from '../../controllers/frontController/homeController.js';
import { getClients } from "../../controllers/admin/brandsController.js";

const router = express.Router();

router.get('/search_dropdown', getSearchDropDownLocations);
router.get('/recommendations', getRecommendations);
// router.get('/spotlight', getSpotlight);

router.get('/count_info', getHomeCountInfo);
router.get('/brands', getClients);

router.post('/contact_us', contact_us);

export default router;