const jwt = require("jsonwebtoken");
const config = require("../config/config")

const generateToken = (id) =>{
    return jwt.sign({id}, config.jwt.jwt_sec, {expiresIn:"2d"});
}

module.exports = {generateToken};