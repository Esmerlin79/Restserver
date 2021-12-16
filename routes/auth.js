const { Router } = require('express');
const { getUsers } = require('../controllers/auth');

const router = Router();

router.get('/', getUsers);


module.exports = router