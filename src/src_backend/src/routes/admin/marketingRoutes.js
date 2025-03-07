import express from 'express';
import { 
    listPromotionData,
    sendWAPromotionPropertyMessage,
    sendWAPromotionWithImageMessage,
    deleteMarketingById,
    deleteMarketingDetailsById,
    getMarketingLogById} from '../../controllers/admin/marketingController.js';
import { getAllProperty } from '../../controllers/admin/propertyController.js';

const router = express.Router();

// router.route('/').post( sendPromotionMessage );
router.route('/marketing_wa').post( sendWAPromotionPropertyMessage );
router.route('/marketing_wa_image').post( sendWAPromotionWithImageMessage );

router.route('/').get( listPromotionData );
router.route('/:id').get( getMarketingLogById ).delete(deleteMarketingById)
router.route('/:id/list/:sid').delete(deleteMarketingDetailsById);

// ### update it add to property page and limit 10 and query param property_name and ...
router.route('/property_list').get( getAllProperty );

export default router;

