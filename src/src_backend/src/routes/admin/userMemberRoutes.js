import express from "express";

import {
    listMembers, 
    addMemberUser,
    listUsersById,
    editUser,
    deleteUser,
    listPropertiesByMemberId
} from "../../controllers/admin/userController.js";
// import * as authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
// router.use(authMiddleware.loggedIn); 

// User management CRUD
router.get('/', listMembers);
router.post('/', addMemberUser);

router.get('/:id', listUsersById);
router.put('/:id', editUser);
router.delete('/:id', deleteUser);

router.get('/:id/properties', listPropertiesByMemberId);

export default router;
