import express from "express";

import { verifyAdminToken } from "../Middleware/authMiddleware.js";
import * as adminController from '../controllers/admin/adminController.js';

import propertyRoutes from './admin/propertyRoutes.js';
import userMemberRoutes from './admin/userMemberRoutes.js';
import adminUsersRoutes from "./admin/userAdminRoutes.js";
import plansRoutes from "../routes/admin/plansRoutes.js";
import contactedRoutes from "../routes/admin/contactedRoutes.js";
import shortlistRoutes from "../routes/admin/shortlistedRoutes.js";

import mesageMarketing from "../routes/admin/marketingRoutes.js";
import blogRoutes from "../routes/admin/blogRoutes.js";
import categoryRoutes from "../routes/admin/categoryRoutes.js";
import registerPlanRoutes from '../routes/admin/registerPlansRoutes.js';
import contactUsRoutes from '../routes/admin/contactUsRoutes.js';
import sponsaredRoutes from '../routes/admin/sponsaredRoutes.js';

import enquiryRoutes from '../routes/admin/enquiryRoutes.js';

const router = express.Router();

router.post('/login', adminController.adminLogin);
// router.post('/forgot-password', adminController.forgotPassword);

router.use(verifyAdminToken); 
router.post('/logout', adminController.logout);
router.get('/admin_roles', adminController.getAdminRoles);
router.get('/dashboard', adminController.dashboard);

router.use('/members', userMemberRoutes);
router.use('/marketing', mesageMarketing);
router.use('/users', adminUsersRoutes);

router.use('/plans', plansRoutes);
router.use('/register_plans', registerPlanRoutes );

router.use('/contacted', contactedRoutes)
router.use('/shortlist', shortlistRoutes)

// blogs
router.use('/blog', blogRoutes)
router.use('/category', categoryRoutes)
router.use('/contact_us', contactUsRoutes)

// ### update with get id by params             // done
router.use('/property', propertyRoutes );
router.use('/promotion', sponsaredRoutes );
router.use('/enquiry', enquiryRoutes );

router.route('/profile')
        .get(adminController.getProfile)
        .put(adminController.updateProfile);
router.put('/password', adminController.changePassword);

export default router;
