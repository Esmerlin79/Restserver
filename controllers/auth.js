const { request, response } = require("express");
const bcrypt = require('bcrypt');

const User = require('../models/user');
const { generateJWT } = require("../helpers/generate-jwt");


const login = async (req = request, res = response) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if( !user ) {
            return res.status(400).json({
                msg: 'User / Password are not valid'
            })
        }

        if( !user.status ) {
            return res.status(400).json({
                msg: 'User / Password are not valid'
            })
        }

        const isValidPassword = bcrypt.compareSync( password, user.password );
        if( !isValidPassword ) {
            return res.status(400).json({
                msg: 'User / Password are not valid'
            })
        }

        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

module.exports = {
    login,
}