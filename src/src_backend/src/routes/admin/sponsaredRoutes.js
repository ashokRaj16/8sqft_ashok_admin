import express from 'express';
import {
    listSponsared,
    addSponsared,
    updateSponsared,
    deleteSponsared,
    getLastSquenceSponsaredNumber,
    updateSponsaredSequence,
    getSponsaredById,
} from '../../controllers/admin/sponsaredController.js';

const router = express.Router();

router.route('/').get(listSponsared)
                 .post(addSponsared);

router.route('/:id')
                .get(getSponsaredById)
                .delete(deleteSponsared)
                .put(updateSponsared);

router.route('/sequence').get(getLastSquenceSponsaredNumber)
router.route('/bulk/update_sequence').put(updateSponsaredSequence);

export default router;
