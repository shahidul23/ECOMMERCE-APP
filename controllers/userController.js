const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const User = require('../models/user.model');
const config = require('../config/config')
const bcrypt = require('bcrypt');
const validatedMongooseId = require('../utils/validationMongoDB');
const { generateRefreshToken } = require('../config/refreshToken');
const saltRounds = 10;

const createUser = async(req, res) => {
    try {
        const findUser = await User.findOne({email: req.body.email});
        bcrypt.hash(req.body.password, saltRounds, async(err, hash) => {
            if (!findUser) {
                const newUser = new User({
                    firstName:req.body.firstName,
                    lastName:req.body.lastName,
                    mobile: Number(req.body.mobile),
                    email:req.body.email,
                    password: hash,
                })
                await newUser.save()
                .then(() => {
                    res.status(201).json({
                        message:"User Create successfully",
                        success:true,
                        user:{
                            name: newUser.firstName +" "+ newUser.lastName,
                            email:newUser.email,
                        }
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message:"User not Created",
                        success:false,
                        error:err
                    })
                });
            }else{
                res.status(400).json({
                    message:"User Already exist",
                    success:false,
                })
            }
        });
    } catch (error) {
        res.status(500).json({
            message:"User not Create, something is wrong",
            success:false,
            error:error
        })
    }
}

const loginUser = async(req, res) =>{
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(401).json({
                success:false,
                message:"User not found"
            })
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                success:false,
                message:"Incorrect password"
            })
        }
        const refreshToken = await generateRefreshToken(user._id);
        await User.findByIdAndUpdate(user._id,{
            refreshToken:refreshToken
        },{
            new:true
        });
        const payload = {
            id:user._id,
            email:user.email,
        };
        const token = jwt.sign(payload, config.jwt.jwt_sec, {
            expiresIn:"2d"
        });
        res.cookie("refreshToken", refreshToken,{
            httpOnly:true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        return res.status(200).send({
            success:true,
            message:"User is logged in successfully",
            user:{
                id: user._id,
                firstName:user.firstName,
                lastName:user.lastName,
                mobile:user.mobile,
                email:user.email,
                token: "Bearer "+token,
            }
        })
    } catch (error) {
        res.status(500).json({
            message:"User is not logged in",
            error:error
        })
    }
}

const handleRefreshToken = asyncHandler(async(req, res) =>{
    const cookie = req.cookies;
    if (!cookie.refreshToken) throw new Error("No Refresh Token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken: refreshToken});
    if(!user) throw new Error("No Refresh token preset in db or not matched");
    jwt.verify(refreshToken, config.jwt.jwt_sec, (err, decoded) =>{
        if (err || user.id !== decoded.id ) {
            throw new Error("There is something wrong with refresh token");    
        }
        const payload = {
            id:user._id,
            email:user.email,
        };
        const assessToken = jwt.sign(payload, config.jwt.jwt_sec, {
            expiresIn:"2d"
        });
        res.json({
            AccessToken:"Bearer "+assessToken
        });
    });

});

const updatedUser = asyncHandler(async(req, res) =>{
    const { _id } = req.user;
    validatedMongooseId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email,
                mobile:Number(req.body.mobile),
            },
            {
                new:true,
            }
        );
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
})

const getUser = async(req, res) =>{
    try {
        const getAllUsers = await User.find();
        res.json({
            message:"get all User successfully",
            success:true,
            getAllUsers
        })
    } catch (error) {
        res.json({
            message:"not get users",
            success:false,
            error:error
        })
    }
}
const getOneUser = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    validatedMongooseId(id);
    try {
        const getUser = await User.findById(id);
        res.status(201).json({
            message:"Find a user successfully",
            success:true,
            Users:{
                id:getUser._id,
                firstName:getUser.firstName,
                lastName:getUser.lastName,
                mobile:getUser.mobile,
                email:getUser.email,
                rule:getUser.rule
            }
        })
    } catch (error) {
        throw new Error(error)
    }
});

const deleteUser = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    validatedMongooseId(id);
    try {
        const deleteaUser = await User.findByIdAndDelete(id)
        res.json({
            message:"User delete Successfully",
            success:true,
            Users:{
                id:deleteaUser._id,
                firstName:deleteaUser.firstName,
                lastName:deleteaUser.lastName,
                mobile:deleteaUser.mobile,
                email:deleteaUser.email,
                onCreate:deleteaUser.onCreate
            }
        })
    } catch (error) {
        throw new Error(error)
    } 
})

const blockUser = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    try {
        await User.findByIdAndUpdate(id,{
            isBlocked:true,
        },{
            new:true
        })
        .then(() =>{
            res.json({
                message:"User is blocked",
            })
        })
        .catch((err) =>{
            res.json({
                Error: err
            })
        })
        
    } catch (error) {
        throw new Error(error)
    }
})

const UnblockUser = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    try {
        await User.findByIdAndUpdate(id,{
            isBlocked:false,
        },{
            new:true
        })
        .then(() =>{
            res.json({
                message:"User unblocked",
            })
        })
        .catch((err) =>{
            res.json({
                Error:err
            })
        })
        
    } catch (error) {
        throw new Error(error)
    }
})

const logout =asyncHandler(async(req, res) =>{
    const cookie = req.cookies;
    if (!cookie.refreshToken) throw new Error("No Refresh Token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken: refreshToken});
    if(!user){
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true
        });
        return res.status(204);
    }
    await User.findOneAndUpdate(refreshToken,{
        refreshToken:"",
    });
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true
    });
    res.sendStatus(204);
});
module.exports = {
    createUser, 
    loginUser, 
    getUser, 
    getOneUser, 
    deleteUser, 
    updatedUser, 
    blockUser, 
    UnblockUser,
    handleRefreshToken,
    logout
}