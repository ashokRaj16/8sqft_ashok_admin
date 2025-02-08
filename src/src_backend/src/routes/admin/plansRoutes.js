import express from 'express';
import {
  listPlans,
  getPlanById,
  createPlan,
  updatePlan,
  changePlanStatus,
} from '../../controllers/admin/plansController.js';

const router = express.Router();

router.route('/').get(listPlans)
                 .post(createPlan);
router.route('/:id').get(getPlanById)
                    .put(updatePlan);
router.route('/:id/status').put(changePlanStatus);

export default router;
