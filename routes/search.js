const { Router } = require('express');
const { check } = require('express-validator');

const { search, getProductsByCategory } = require('../controllers/search');
const { isCategoryExist } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares');


const router = Router();

router.get('/:collection/:term', search);

router.get(
    '/:id',
    [
        check('id', 'Is not a valid id').isMongoId(),
        check('id').custom( isCategoryExist ),
        validateFields
    ], 
    getProductsByCategory
);


module.exports = router;
