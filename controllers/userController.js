const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createUser = async(req, res) => {
    try {
        const userfind = await User.findOne({email: req.body.email});
        bcrypt.hash(req.body.password, saltRounds, async(err, hash) => {
            if (!userfind) {
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
            message:"Usre not Create, something is wtong",
            success:false,
            error:error
        })
    }
}

module.exports = {createUser}