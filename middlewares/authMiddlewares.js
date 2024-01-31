const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require("../config/config");
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async(req, res, next) =>{
    let token;
    if (req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, config.jwt.jwt_sec);
                const user = await User.findById(decoded.id);
                req.user = user;
                next();
            }
        } catch (error) {
            throw new Error("Not Authorized token expired, Please Login");
        }
    }else{
        throw new Error("There is not token attached to header")
    }
});

const isAdmin = asyncHandler(async(req, res, next) =>{
   const {email} = req.user;
   const adminUser = await User.findOne({email: email});
   if (adminUser.rule !== "Admin") {
    throw new Error("you are not a admin")
   }else{
    next();
   }
})



module.exports = {authMiddleware, isAdmin};