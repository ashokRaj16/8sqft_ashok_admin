import multer from "multer";
import path from 'path';
import express from "express";
import * as propertyController from "../../controllers/propertyController.js";
import { deletePropertyConfiguration, uploadPropertyConfiguration } from "../../controllers/frontController/propertyImageController.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname).toLowerCase(); // Extract the file extension
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    }
})

const upload = multer({ 
    storage : storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB file size limit
    },
    fileFilter : (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const mimeType = allowedTypes.test(file.mimetype);
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimeType && extName) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed (jpeg, jpg, png)'));
        }
    }
})

const uploadFields = upload.fields([
    { name: 'property_images', maxCount: 5},
])

router.route('/').post( propertyController.postProperty);

router.route('/:id').get( propertyController.getAuthorizedPropertyById);

router.route('/builder').post( propertyController.postPropertyBuilder);

router.route('/configuration')
    .post( uploadPropertyConfiguration );

router.route('/configuration/:id')
    .delete( deletePropertyConfiguration );

    // Submit a new review
router.post('/review', propertyController.submitReview);

// ### edit user properties.
// ### delete user properties.
// ### get individual properties and give edit and delete option.


export default router;