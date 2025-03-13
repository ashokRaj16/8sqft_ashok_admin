import express from "express";

import {
    listMembers, 
    addMemberUser,
    listPropertiesByMemberId,
    editMemeberAdmin,
    listMembersById,
    removeMemberAdmin
} from "../../controllers/admin/userController.js";

const router = express.Router();

// User management CRUD
router.get('/', listMembers);
router.post('/', addMemberUser);

router.get('/:id', listMembersById);
router.put('/:id', editMemeberAdmin);
router.delete('/:id', removeMemberAdmin);

router.get('/:id/properties', listPropertiesByMemberId);

export default router;
