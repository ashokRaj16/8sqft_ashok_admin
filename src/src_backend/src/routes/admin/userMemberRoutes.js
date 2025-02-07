import express from "express";

import * as userController from "../../controllers/admin/userController.js";
// import * as authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
// router.use(authMiddleware.loggedIn); 

// User management CRUD
router.get('/', userController.listMembers);
router.post('/', userController.addMemberUser);

router.get('/:id', userController.listUsersById);
router.put('/:id', userController.editUser);
router.delete('/:id', userController.deleteUser);

export default router;
