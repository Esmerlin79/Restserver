const { response, request } = require("express");

const getUsers = (req = request, res = response) => {
    
    res.json({
        msg: 'getApi'
    });
}




module.exports = {
    getUsers,
}