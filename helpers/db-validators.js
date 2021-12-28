const User = require('../models/user');
const Role = require('../models/role');
const Category = require('../models/category');
const Product = require('../models/product');


const isValidRole = async (role = '') => {
    const isRolExist = await Role.findOne({ role });
    if( !isRolExist ) throw new Error(`The role ${role} does not exist in the database`);
}

const isEmailExist = async ( email = '' ) => {
    const emailExist = await User.findOne({ email });
    if( emailExist ) throw new Error(`The email ${email} is already registered`);
}

const isUserExistById = async ( id ) => {
    const userExist = await User.findById(id);
    if( !userExist ) throw new Error(`There is no user with id ${id}`);
}

const isCategoryExist = async ( id ) => {
    const categoryExist = await Category.findById(id);
    if( !categoryExist ) throw new Error(`There is no category with id ${id}`);
}

const isProductExist = async ( id ) => {
    const productExist = await Product.findById(id);
    if( !productExist ) throw new Error(`There is no product with id ${id}`);
}

// validate allowed collections
const collectionsAllowed = ( collection = '', collections = [] ) => {
    const isInclude = collections.includes( collection ); 
    if( !isInclude ) throw new Error(`${collection} collection is not allowed, ${collections}`);

    return true;
}

module.exports = {
    isValidRole,
    isEmailExist,
    isUserExistById,
    isCategoryExist,
    isProductExist,
    collectionsAllowed
}