const { request, response } = require("express");

const isAdminRole = (req = request, res = response, next) => {
    
    if( !req.user ) {
        return res.status(500).json({
            msg: 'The role should not be verified without validating token'
        })
    }
    const { role, name } = req.user;

    if( role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${name} does not have the permissions to perform this function`
        })
    }

    next();
}

const hasRole = ( ...roles ) => {
    return (req = request, res = response, next) => {

        if( !req.user ) {
            return res.status(500).json({
                msg: 'The role should not be verified without validating token'
            })
        }

        if( !roles.includes(req.user.role) ) {
            return res.status(401).json({
                msg: `The service requires one of these roles ${roles}`
            })
        }
        

        next();
    }
}

module.exports = {
    isAdminRole,
    hasRole
}