const { request, response } = require('express');
const { validationResult } = require('express-validator');

const validateFields = (req = request, res = response, next) => {

    const validationsErrors = validationResult(req);

    if( !validationsErrors.isEmpty() ) {
        return res.status(400).json({
            errors: validationsErrors.mapped(),
        })
    }

    next();
}

module.exports = {
    validateFields,
}