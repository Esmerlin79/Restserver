const { response, request } = require("express");
const bcrypt = require('bcrypt');

const User = require('../models/user');


const getUsers = async (req = request, res = response) => {
    
    try {
        const { limit = 5, from = 0 } = req.query;
        const filter = { status: true }

        const [ total, users ] = await Promise.all([ 
            User.countDocuments(filter), 
            User.find(filter)
                .skip(Number(from))
                .limit(Number(limit))
        ])

        res.json({
            total,
            users
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const createUser = async (req = request, res = response) => {

    try {
        const { name, email, password, role } = req.body;
        const user = new User({ name, email, password, role });

        //Encrypt password
        const passwordSalt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, passwordSalt );

        // save record
        await user.save();

        res.json({
            user,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const updateUser = async (req = request, res = response) => {

    try {
        const { id } = req.params;
        const { _id, password, google, email, ...rest } = req.body;

        if( password ) {
            const passwordSalt = bcrypt.genSaltSync();
            rest.password = bcrypt.hashSync( password, passwordSalt );
        }

        const user = await User.findByIdAndUpdate( id, rest );

        res.json({
            name: rest.name,
            email: user.email,
            role: rest.role,
            status: user.status,
            google: user.google,
            uid: id
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const deleteUser = async (req = request, res = response) => {

    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { status: false });
    user.status = false;

    res.json( user )
}



module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}