import express from 'express';
import { listAllImagesFromBucket, deleteImage, deleteMultiImage, getLinkImageDetails, changeImageProperty, postImageUploadStart, postImageUploadChunk, postImageUploadComplete, postImageUploadAbort } from '../../controllers/admin/galleryController.js';
const router = express.Router();

router.route('/start').post(postImageUploadStart);
router.route('/chunk').post(postImageUploadChunk);
router.route('/complete').post(postImageUploadComplete);
router.route('/abort').post(postImageUploadAbort);


router.route('/').get(listAllImagesFromBucket);
router.route('/:id')
            .delete(deleteImage)
            .put(changeImageProperty);

export default router;
