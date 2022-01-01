const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');


const router = Router();

router.post(
    '/login', 
    [
        check('email', 'The email is not valid').isEmail(),
        check('password', 'The password is required').not().isEmpty(),
        validateFields
    ],
    login
);

router.get('/', validateJWT, renewToken);

router.post(
    '/google', 
    [
        check('id_token', 'The id token is required').not().isEmpty(),
        validateFields
    ],
    googleSignIn
);

module.exports = router;
