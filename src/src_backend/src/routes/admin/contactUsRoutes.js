import express from 'express';
import {
  listContactUs,
  getContactUsById,
  createContactUs,
  updateContact,
  changeContactUStatus,
  deleteContact
} from '../../controllers/admin/contactsController.js';

const router = express.Router();

router.route('/').get(listContactUs)
                 .post(createContactUs);
router.route('/:id').get(getContactUsById)
                    .put(updateContact)
                    .delete(deleteContact);
router.route('/:id/status').put(changeContactUStatus);

export default router;
