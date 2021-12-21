const { request, response } = require("express");
const bcrypt = require('bcrypt');

const User = require('../models/user');
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerifyToken } = require("../helpers/google-verify");


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

const googleSignIn = async (req = request, res = response) => {

   try {
        const { id_token } = req.body;

        const { name, picture: img, email } = await googleVerifyToken( id_token );

        let user = await User.findOne({ email });

        if( !user ) {

            const userData = {
                name,
                email,
                password: 'authenticated by google',
                img,
                google: true,
            }

            user = new User( userData );
            await user.save();
        }

        // if the user on database is denied
        if( !user.status ) {
            return res.status(401).json({
                msg: 'User`s is blocked'
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
            msg: 'Google token is not valid'
        })
   }
}

module.exports = {
    login,
    googleSignIn,
}