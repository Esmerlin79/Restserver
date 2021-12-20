const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, isAdminRole, hasRole } = require('../middlewares');
const { isValidRole, isEmailExist, isUserExistById } = require('../helpers/db-validators');
const { 
    getUsers,
    createUser, 
    updateUser,
    deleteUser,
} = require('../controllers/users');


const router = Router();

router.get('/', getUsers);

router.post(
    '/', 
    [
        check('name', 'The name is required').not().isEmpty(),
        check('email', 'The email is not valid').isEmail(),
        check('email').custom( isEmailExist ),
        check('password', 'The password must have more than 6 characters').isLength({ min: 6 }),
        // check('role', 'The role is not valid').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('role').custom( isValidRole ),
        validateFields,
    ],
    createUser
);

router.put(
    '/:id', 
    [
        check('id', 'Is not a valid id').isMongoId(),
        check('id').custom( isUserExistById ),
        check('role').custom( isValidRole ),
        validateFields
    ],
    updateUser
);

router.delete(
    '/:id', 
    [
        validateJWT,
        // isAdminRole,
        hasRole('ADMIN_ROLE', 'USER_ROLE'),
        check('id', 'Is not a valid id').isMongoId(),
        check('id').custom( isUserExistById ),
        validateFields
    ],
    deleteUser
);

module.exports = router