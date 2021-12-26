const { response } = require("express");

const { Product } = require('../models');


const getProducts = async (req, res = response) => {

    try {
        const { limit = 5, from = 0 } = req.query;
        const filter = { status: true };

        const [ total, products ] = await Promise.all([
            Product.countDocuments(filter),
            Product.find(filter)
                    .skip(from)
                    .limit(limit)
                    .populate('category', 'name')
                    .populate('user', 'name')
        ])

        res.json({
            total,
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const getProductById = async (req, res = response) => {

    try {
        const { id } = req.params;

        const product = await Product.findById(id)
                                     .populate('category', 'name')
                                     .populate('user', 'name')

        if( !product.status ) {
            return res.status(400).json({
                msg: `There is no product with id ${id}`
            })
        }

        res.json(product);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const createProduct = async (req, res = response) => {

   try {
        const { status, user, ...productBody } = req.body;
        productBody.user = req.user._id;

        const isProductExist = await Product.findOne({ name: productBody.name });

        if( isProductExist ) {
            return res.status(400).json({
                msg: `The ${ productBody.name } product already exists`
            })
        }

        productBody.name = productBody.name.toUpperCase();

        const product = new Product( productBody );
        await product.save();

        res.json( product );

   } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
   }
}

const updateProduct = async (req, res = response) => {

    try {

        const { id } = req.params;
        const { status, user, ...productBody } = req.body;

        productBody.user = req.user._id;
        productBody.name && (productBody.name = productBody.name.toUpperCase());
        
        const product = await Product.findByIdAndUpdate(id, productBody, { new: true });

        res.json( product );

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const deleteProduct = async (req, res = response) => {

   try {
       const { id } = req.params;
       
       const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

        res.json( product );

   } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
   }
}


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
}