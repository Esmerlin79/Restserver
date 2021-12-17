const User = require('../models/user');
const Role = require('../models/role');


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

module.exports = {
    isValidRole,
    isEmailExist,
    isUserExistById,
}