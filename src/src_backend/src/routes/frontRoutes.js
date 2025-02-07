import express from "express";

import userPropertyRountes from '..//routes/frontend/userPropertyRountes.js';
import propertyRoutes from '../routes/frontend/propertyRoutes.js';
import aadharAuthRoutes from "../routes/frontend/aadharRoutes.js";
import razorPay from "../routes/frontend/razorpayRoutes.js";
import paymentRoutes from "../routes/frontend/paymentRoutes.js";

import shortList from "../routes/frontend/wishlistRoutes.js";
import propertyReport from '../routes/frontend/propertyReportRoute.js';

// done
import homeRoutes from '../routes/frontend/homeRoutes.js';
import contactDeveloper from "../routes/frontend/contactDeveloperRoutes.js";
import planRoutes from '../routes/frontend/plansRoutes.js';
import profileRoutes from '../routes/frontend/profileRoutes.js';
import agreementRoutes from '../routes/frontend/agreementsRoutes.js';


import { verifyClientToken } from "../Middleware/authMiddleware.js";
import { assignSessionId } from "../Middleware/session.js";

import { contactSendMail, contactSendWhatsApp } from '../controllers/frontController/homeController.js';
import { uploadPropertyImages, deletePropertyImage, uploadPropertyFilesWithWatermark, getUploadProgress } from "../controllers/frontController/propertyImageController.js";


const router = express.Router();
router.use('/', homeRoutes)
router.use('/contact_developer', contactDeveloper);

router.use('/property', propertyRoutes);
router.use('/plans', planRoutes);


// Proptected routes.
router.use(verifyClientToken);
router.use('/kyc/', aadharAuthRoutes);          // done
router.use('/agreements', agreementRoutes);       //  check

// ## make it proper.

router.use('/post_property', userPropertyRountes);  //done
router.use('/property_images_watermark', assignSessionId, uploadPropertyFilesWithWatermark);    //# shift it to property images
router.get("/upload-progress", assignSessionId, getUploadProgress);                             //# shift it to property images


router.use('/property_images', uploadPropertyImages);
router.delete('/unlink_property_images/:id', deletePropertyImage);                              //# shift it to property images


router.use('/payments/cfee/', paymentRoutes);   // done
router.use('/payments/rpay/', razorPay);        // done

// list property
router.use('/shortlist', shortList);                // done
router.use('/property_report', propertyReport);     // done

// done
router.use('/profile', profileRoutes);

// ## check
router.post('/send_contact_mail', contactSendMail);
router.post('/send_contact_msg', contactSendWhatsApp);

export default router;