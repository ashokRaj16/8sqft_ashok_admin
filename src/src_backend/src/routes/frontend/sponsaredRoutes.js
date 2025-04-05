import express from "express";
const router = express.Router();
import { getSponsaredList, getSponsaredHeroBannerList, getSponsaredBuilderStoryList, getSponsaredBuilderStoryById, getSponsaredPropertyById } from "../../controllers/frontController/sponsaredController.js";

router.get('/', getSponsaredList );
router.get('/hero_banner', getSponsaredHeroBannerList );
router.get('/story_user', getSponsaredBuilderStoryList );

router.get('/hero_banner/:id', getSponsaredPropertyById );
router.get('/story_user/:id',  getSponsaredBuilderStoryById );

export default router;