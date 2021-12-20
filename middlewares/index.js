const validateFields = require('../middlewares/validate-fields');
const validateJWT = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-roles');


module.exports = {
    ...validateFields,
    ...validateJWT,
    ...validateRoles,
}