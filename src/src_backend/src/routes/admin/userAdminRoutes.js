import express from 'express';
import * as adminUserController from '../../controllers/admin/adminUserController.js';
import * as adminController from '../../controllers/admin/adminController.js';
import { getAllContacts, getContactById} from "../../controllers/frontController/homeController.js";

const router = express.Router();

router.get('/', adminUserController.listUsers);
router.get('/:id', adminUserController.getUserById);
router.post('/', adminUserController.addAdminUser);
router.put('/:id', adminUserController.updateUser);
router.patch('/:id/status', adminUserController.changeUserStatus);
router.delete('/:id', adminUserController.deleteUser);

// ### need to check.
router.post('/contact', getAllContacts);
router.post('/contact/:id', getContactById);

// ### move to seperate file.
router.get('/interested_users', adminController.getAllInterestedUsers);
router.get('/shortlisted_properties', adminController.getAllShortlistedProperties);
router.get('/unique_views', adminController.getUniqueViews);
router.get('/user_property_data/:id', adminController.getUserPropertyData);


export default router;
