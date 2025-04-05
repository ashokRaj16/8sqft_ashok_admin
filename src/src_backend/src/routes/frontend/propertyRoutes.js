import express from "express";
import * as propertyController from "../../controllers/propertyController.js";

const router = express.Router();

router.route('/list_properties')
    .get(propertyController.getAllProperty);
    
router.route('/view_count/:id')
    .put(propertyController.updatePropertyViewCount);           //### check postmon

router.route('/:id')
    .get(propertyController.getPropertyById);
    
// List reviews for a specific property
router.get('/reviews/:id', propertyController.getReviewsByPropertyId);

export default router;
