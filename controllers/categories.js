const { response } = require("express");
const { Category } = require("../models");


const getCategories = async (req, res = response) => {

    try {
        const { limit = 5, from = 0 } = req.query;
        const filter = { status: true };

        const [ total, categories ] = await Promise.all([
            Category.countDocuments(filter),
            Category.find(filter)
                .limit(Number(limit))
                .skip(Number(from))
                .populate('user', 'name')
        ])

        res.json({
            total,
            categories
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const getCategoryById = async (req, res = response) => {

    try {

        const { id } = req.params;

        const category = await Category.findById(id).populate('user', 'name');
        
        if( !category.status ) {
            return res.status(400).json({
                msg: `There is no category with id ${id}`
            })
        }

        res.json(category);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const createCategory = async (req, res = response) => {

    try {
        const name = req.body.name.toUpperCase();

        const isCategoryExist = await Category.findOne({ name });

        if( isCategoryExist ) {
            res.status(400).json({
                msg: `The ${ name } category already exists`
            })
        }

        const data = {
            name, 
            user: req.user._id
        }

        const category = new Category( data );

        await category.save();

        res.status(201).json( category );

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const updateCategory = async (req, res = response) => {
    try {

        const { id } = req.params;

        const name = req.body.name.toUpperCase();
        const user = req.user._id;

        const isCategoryExist = await Category.findOne({ name });

        if( isCategoryExist ) {
            return res.status(400).json({
                msg: `The ${ name } category already exists`
            })
        }

        const  category = await Category.findByIdAndUpdate(id, { name, user, }, { new: true });
        
        res.json( category );
        
    } catch (error) {
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const deleteCategory = async (req, res = response) => {

    try {

        const { id } = req.params;

        const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

        res.json( category );

    } catch (error) {
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}


module.exports = {
    getCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}