
import express from 'express';
import { getAllShortlistPropertyByUser, getAllShortlistUsersByProperty } from '../../controllers/admin/shortlistController.js';

const router = express.Router();

router.get('/shortlist_users/:id', getAllShortlistUsersByProperty );
router.get('/shortlist_property/:id', getAllShortlistPropertyByUser );

export default router;
