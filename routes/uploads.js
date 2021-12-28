const { Router } = require('express');
const { check } = require('express-validator');

const { collectionsAllowed } = require('../helpers');
const { validateFields, validateFile } = require('../middlewares');
const { 
    uploadFiles, 
    updateImage, 
    showImage,
    updateImageWithCloudinary 
} = require('../controllers/uploads');

const router = Router();

router.post(
    '/', 
    [ 
        validateFile, 
    ], 
    uploadFiles
);

router.put(
    '/:collection/:id', 
    [
        validateFile,
        check('id', 'Is not a valid id').isMongoId(),
        check('collection').custom( c => collectionsAllowed( c, ['users', 'products'] ) ),
        validateFields
    ],
    // updateImage
    updateImageWithCloudinary
);

router.get(
    '/:collection/:id', 
    [
        check('id', 'Is not a valid id').isMongoId(),
        check('collection').custom( c => collectionsAllowed( c, ['users', 'products'] ) ),
        validateFields
    ],
    showImage
);




module.exports = router;