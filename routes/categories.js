const { Router  } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT, isAdminRole } = require('../middlewares');
const { isCategoryExist } = require('../helpers/db-validators');
const { 
    getCategories, 
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categories');

const router = Router();


router.get('/', getCategories);

router.get(
    '/:id',
    [
        check('id', 'Is not a valid id').isMongoId(),
        check('id').custom( isCategoryExist ),
        validateFields,

    ], 
    getCategoryById
);

router.post(
    '/', 
    [
        validateJWT,
        check('name', 'The name is required').not().isEmpty(),
        validateFields
    ],
    createCategory
);

router.put(
    '/:id',
    [
        validateJWT,
        check('id', 'Is not a valid id').isMongoId(),
        check('id').custom( isCategoryExist ),
        check('name', 'The name is required').not().isEmpty(),
        validateFields
    ], 
    updateCategory
);

router.delete(
    '/:id', 
    [
        validateJWT,
        isAdminRole,
        check('id', 'Is not a valid id').isMongoId(),
        check('id').custom( isCategoryExist ),
        validateFields
    ],
    deleteCategory
);



module.exports = router;