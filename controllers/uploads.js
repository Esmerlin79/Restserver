const { response } = require("express");
const path = require("path");
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { User, Product } = require('../models');
const { uploadFile } = require('../helpers');

const uploadFiles = async (req, res = response) => {

    try {
        
        const filename = await uploadFile( req.files, undefined, 'images' );
    
        res.json({
            filename
        })

    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }

}

const updateImage = async (req, res = response) => {

    try {
        
        const { collection, id } = req.params;

        let model;

        switch ( collection ) {

            case 'users':
                model = await User.findById(id);

                if( !model ) {
                    return res.status(400).json({
                        msg: `There is no user with id ${id}`
                    })
                }

                break;

            case 'products':
                model = await Product.findById(id);

                if( !model ) {
                    return res.status(400).json({
                        msg: `There is no product with id ${id}`
                    })
                }

                break;
        
            default:
                return res.status(500).json({
                    msg: 'Not implemented yet'
                });
        }

        // clean the images if they exist
        if( model.img ) {
            const pathImg = path.join( __dirname, '../uploads', collection, model.img );
            if( fs.existsSync( pathImg ) ) {
                fs.unlinkSync( pathImg );
            }
        }

        const filename = await uploadFile( req.files, undefined, collection );
        model.img = filename;

        await model.save();

        res.json( model );

    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }
}


const showImage = async (req, res = response) => {

    try {
        
        const { collection, id } = req.params;

        let model;

        switch ( collection ) {

            case 'users':
                model = await User.findById(id);

                if( !model ) {
                    return res.status(400).json({
                        msg: `There is no user with id ${id}`
                    })
                }

                break;

            case 'products':
                model = await Product.findById(id);

                if( !model ) {
                    return res.status(400).json({
                        msg: `There is no product with id ${id}`
                    })
                }

                break;
        
            default:
                return res.status(500).json({
                    msg: 'Not implemented yet'
                });
        }

        if( model.img ) {
            const pathImg = path.join( __dirname, '../uploads', collection, model.img );
            if( fs.existsSync( pathImg ) ) {
                return res.sendFile( pathImg );
            }
        }

        const imgPlaceholder = path.join( __dirname, '../assets', 'no-image.png');

        res.sendFile( imgPlaceholder );

    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }
}

const updateImageWithCloudinary = async (req, res = response) => {

    try {
        
        const { collection, id } = req.params;

        let model;

        switch ( collection ) {

            case 'users':
                model = await User.findById(id);

                if( !model ) {
                    return res.status(400).json({
                        msg: `There is no user with id ${id}`
                    })
                }

                break;

            case 'products':
                model = await Product.findById(id);

                if( !model ) {
                    return res.status(400).json({
                        msg: `There is no product with id ${id}`
                    })
                }

                break;
        
            default:
                return res.status(500).json({
                    msg: 'Not implemented yet'
                });
        }

        if( model.img ) {
            const separateName = model.img.split('/');
            const name = separateName[ separateName.length - 1 ];
            const [ public_id ] = name.split('.');

            cloudinary.uploader.destroy( public_id );
        }

        const { tempFilePath } = req.files.file;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

        model.img = secure_url;

        await model.save();

        res.json( model );

    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }
}




module.exports = {
    uploadFiles,
    updateImage,
    showImage,
    updateImageWithCloudinary
}