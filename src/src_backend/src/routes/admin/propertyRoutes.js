import multer from "multer";
import path from 'path';
import express from "express";

import * as propertyController from '../../controllers/admin/propertyController.js';
import { 
    updatePropertyFeaturesAdmin, 
    updatePropertyAmenetiesAdmin, 
    updatePropertyImages,
    uploadPropertyImagesAdmin,
    deletePropertyImageAdmin,    
    uploadPropertyConfigurationAdmin,
    updatePropertyConfiguration,
    deletePropertyConfigurationAdmin,
    createPropertyFandqAdmin,    
    deletePropertyFandqAdmin,
    updatePropertyFandqAdmin,
    getCategories,    
    getNearbyLocationsByCategory,
    createNearbyLocationAdmin,
    updatePropertyNearbyAdmin,
    deletePropertyNearbyAdmin,
    generatePropertyNearbyAdmin
} from '../../controllers/admin/propertyController.js';  

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
        fileSize: 50 * 1024 * 1024, // 5 MB file size limit
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
    { name: 'property_videos', maxCount: 1},
    { name: 'society_videos', maxCount: 1},
    { name: 'property_images', maxCount: 25},
    { name: 'society_images', maxCount: 25},
    { name: 'property_flooring_plans', maxCount: 25},
    { name: 'society_flooring_plans', maxCount: 25},
    { name: 'verification_document', maxCount: 1},
    { name: 'addhar_card', maxCount: 1},
    { name: 'pan_card', maxCount: 1},
])

const uploadPropertyImages = upload.fields([
    { name: 'property_videos', maxCount: 1},
    { name: 'society_videos', maxCount: 1},
    { name: 'property_images', maxCount: 25},
    { name: 'society_images', maxCount: 25},
    { name: 'property_flooring_plans', maxCount: 25},
    { name: 'society_flooring_plans', maxCount: 25},
])

const uploadPropertyDocuments = upload.fields([
    { name: 'verification_document', maxCount: 1},
    { name: 'addhar_card', maxCount: 1},
    { name: 'pan_card', maxCount: 1},
])

router.route('/')
    .get(propertyController.getAllProperty);
    

// ###property updates. //need work
router.route('/:id/features').put( updatePropertyFeaturesAdmin );
router.route('/:id/ameneties').put( updatePropertyAmenetiesAdmin );

router.route('/:id/image/:sid')
    .put( updatePropertyImages )
    .delete( deletePropertyImageAdmin );

router.route('/:id/configuration/:sid')
    .put( updatePropertyConfiguration )
    .delete( deletePropertyConfigurationAdmin );

//use create 
router.route('/:id/image/')
    .post( uploadPropertyImagesAdmin );
router.route('/:id/configuration')
    .post( uploadPropertyConfigurationAdmin );

router.route('/:id/fandq/:sid')
    .put( updatePropertyFandqAdmin )
    .delete( deletePropertyFandqAdmin );


router.route('/:id/fandq')
    .post( createPropertyFandqAdmin );

// ### need work nearby
router.route('/:id/nearby/:sid')
    .put( updatePropertyNearbyAdmin )
    .delete( deletePropertyNearbyAdmin );

router.route('/:id/nearby')
    .post( createNearbyLocationAdmin)
    .get( generatePropertyNearbyAdmin);

router.get('/:id/nearby_categories', getNearbyLocationsByCategory);

// Property Status 
router.put('/:id/status', propertyController.changePropertyStatus);

router.route('/')
    .post(uploadFields, propertyController.postProperty);
    
router.route('/:id')
        .get(propertyController.getPropertyById)
        .delete(propertyController.deletePropertyById);


export default router;
