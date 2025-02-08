import express from 'express';

import { 
  changeRegisterPlanStatus,
  createRegisterPlan,
  getRegisterPlanById,
  listRegisterPlans, 
}
from '../../controllers/admin/registerPlansController.js'

const router = express.Router();

router.route('/').get(listRegisterPlans)
                 .post(createRegisterPlan);
router.route('/:id').get(getRegisterPlanById);

router.route('/:id/status').put(changeRegisterPlanStatus);


export default router;
