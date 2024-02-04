const jwt = require('jsonwebtoken');
const config = require("../config/config")

const generateRefreshToken = (id) =>{
    return jwt.sign({id}, config.jwt.jwt_sec, {expiresIn:"3d"});
};

module.exports = {generateRefreshToken}