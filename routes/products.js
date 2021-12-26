const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT, isAdminRole } = require('../middlewares');
const { isCategoryExist, isProductExist } = require('../helpers/db-validators');
const { 
    createProduct, 
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct 
} = require('../controllers/products');

const router = Router();

router.get('/', getProducts);

router.get(
    '/:id', 
    [
        check('id', 'Is not a valid id').isMongoId(),
        check('id').custom( isProductExist ),
        validateFields
    ],
    getProductById
);

router.post(
    '/',
    [
        validateJWT,
        check('name', 'The name is required').not().isEmpty(),
        check('category', 'The category does not have a valid id').isMongoId(),
        check('category').custom( isCategoryExist ),
        validateFields
    ], 
    createProduct
);

router.put(
    '/:id',
    [
        validateJWT,
        check('id', 'Is not a valid id').isMongoId(),
        check('id').custom( isProductExist ),
        check('name', 'The name is required').not().isEmpty(),
        check('category', 'The category does not have a valid id').isMongoId(),
        check('category').custom( isCategoryExist ),
        validateFields
    ],
    updateProduct
);


router.delete(
    '/:id',
    [
        validateJWT,
        isAdminRole,
        check('id', 'Is not a valid id').isMongoId(),
        check('id').custom( isProductExist ),
        validateFields
    ],
    deleteProduct
)

module.exports = router;