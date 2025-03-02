import express from 'express';
import { getAllShortlistPropertyByUser, getAllShortlistUsersByProperty, removeShortlistPropertyByUser } from '../../controllers/admin/shortlistController.js';

const router = express.Router();

router.get('/shortlist_users/:id', getAllShortlistUsersByProperty );
router.get('/shortlist_property/:id', getAllShortlistPropertyByUser );

// ### move in frontend. keep here also
// router.delete("/shortlist_remove", removeShortlistPropertyByUser);

export default router;
