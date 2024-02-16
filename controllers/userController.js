const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const User = require('../models/user.model');
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const Coupon = require("../models/coupon.model");
const config = require('../config/config')
const bcrypt = require('bcrypt');
const validatedMongooseId = require('../utils/validationMongoDB');
const { generateRefreshToken } = require('../config/refreshToken');
const { generateToken } = require('../config/jwt');
const { sendEmail } = require('./email/emailController');
const crypto = require("crypto");
const saltRounds = 10;

const createUser = asyncHandler(async(req, res) =>{
    const email = req.body.email;
    const fundUser = await User.findOne({email:email});
    if (!fundUser) {
        const newUser = await User.create(req.body);
        res.json(newUser)
    }else{
        throw new Error("User Already Exists");
    }
});
// const createUser = async(req, res) => {
//     try {
//         const findUser = await User.findOne({email: req.body.email});
//         bcrypt.hash(req.body.password, saltRounds, async(err, hash) => {
//             if (!findUser) {
//                 const newUser = new User({
//                     firstName:req.body.firstName,
//                     lastName:req.body.lastName,
//                     mobile: Number(req.body.mobile),
//                     email:req.body.email,
//                     password: hash,
//                 })
//                 await newUser.save()
//                 .then(() => {
//                     res.status(201).json({
//                         message:"User Create successfully",
//                         success:true,
//                         user:{
//                             name: newUser.firstName +" "+ newUser.lastName,
//                             email:newUser.email,
//                         }
//                     })
//                 }).catch((err) => {
//                     res.status(500).json({
//                         message:"User not Created",
//                         success:false,
//                         error:err
//                     })
//                 });
//             }else{
//                 res.status(400).json({
//                     message:"User Already exist",
//                     success:false,
//                 })
//             }
//         });
//     } catch (error) {
//         res.status(500).json({
//             message:"User not Create, something is wrong",
//             success:false,
//             error:error
//         })
//     }
// }

const loginUser = asyncHandler(async(req, res) =>{
    const {email, password} = req.body;
    const findUser = await User.findOne({ email:email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser._id);
        await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken:refreshToken,
            },{
                new:true
            }
        );
        res.cookie("refreshToken", refreshToken,{
            httpOnly:true,
            maxAge:72 * 60 * 60 * 1000,
        })
        res.json({
            id: findUser._id,
            firstName:findUser.firstName,
            lastName:findUser.lastName,
            mobile:findUser.mobile,
            email:findUser.email,
            token: generateToken(findUser._id)
        })
    }else{
        throw new Error("Invalid Credentials")
    }
});


// admin login 
const loginAdmin = asyncHandler(async(req, res) =>{
    const {email, password} = req.body;
    const findAdmin = await User.findOne({ email:email });
    if(findAdmin.role !== "Admin") throw new Error("Not Authorised")
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin._id);
        await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken:refreshToken,
            },{
                new:true
            }
        );
        res.cookie("refreshToken", refreshToken,{
            httpOnly:true,
            maxAge:72 * 60 * 60 * 1000,
        })
        res.json({
            id: findAdmin._id,
            firstName:findAdmin.firstName,
            lastName:findAdmin.lastName,
            mobile:findAdmin.mobile,
            email:findAdmin.email,
            token: generateToken(findAdmin._id)
        })
    }else{
        throw new Error("Invalid Credentials")
    }
})
// const loginUser = async(req, res) =>{
//     try {
//         const user = await User.findOne({email: req.body.email});
//         if (!user) {
//             return res.status(401).json({
//                 success:false,
//                 message:"User not found"
//             })
//         }
//         if (!bcrypt.compareSync(req.body.password, user.password)) {
//             return res.status(401).json({
//                 success:false,
//                 message:"Incorrect password"
//             })
//         }
//         const refreshToken = await generateRefreshToken(user._id);
//         await User.findByIdAndUpdate(user._id,{
//             refreshToken:refreshToken
//         },{
//             new:true
//         });
//         const payload = {
//             id:user._id,
//             email:user.email,
//         };
//         const token = jwt.sign(payload, config.jwt.jwt_sec, {
//             expiresIn:"2d"
//         });
//         res.cookie("refreshToken", refreshToken,{
//             httpOnly:true,
//             maxAge: 72 * 60 * 60 * 1000,
//         })
//         return res.status(200).send({
//             success:true,
//             message:"User is logged in successfully",
//             user:{
//                 id: user._id,
//                 firstName:user.firstName,
//                 lastName:user.lastName,
//                 mobile:user.mobile,
//                 email:user.email,
//                 token: "Bearer "+token,
//             }
//         })
//     } catch (error) {
//         res.status(500).json({
//             message:"User is not logged in",
//             error:error
//         })
//     }
// }

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

const updateAddress = asyncHandler(async(req, res) =>{
    const { _id } = req.user;
    validatedMongooseId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                address:req.body.address,
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

const updatePassword = asyncHandler(async(req,res) =>{
    const {_id} = req.user;
    const {password} = req.body;
    validatedMongooseId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const changePassword = await user.save();
        res.json(changePassword);
    }else{
        res.json(user);
    }
})
const forgotPasswordToken = asyncHandler(async(req, res) =>{
    const {email} = req.body;
    const user = await User.findOne({email})
    if (!user) {
        throw new Error("User not found with this email");
    }else{
        try {
            const token = await user.createPasswordResetToken();
            await user.save();
            const resetURL = `Hi please follow this link to reset your password. This link is valid till 10 minutes from now. <a href="http://localhost:3000/api/user/reset-password/${token}">Change password</a>`
            const data = {
                to:email,
                subject:"Forgot Password Link",
                text:"Hey User",
                htm:resetURL
            }
            sendEmail(data);
            res.json(token);
        } catch (error) {
            throw new Error(error)
        }
    }
});

const resetPassword = asyncHandler(async(req, res) =>{
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{ $gt:Date.now() },
    });
    if (!user) {
        throw new Error("The Token Expired, Please try again later");
    }else{
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        res.json(user);
    }
});

const  getWishlist = asyncHandler(async(req, res) =>{
    try {
        const {_id} = req.user;
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser)
    } catch (error) {
        throw new Error(error)
    }
});

const userCart = asyncHandler(async(req, res) =>{
    const {cart} = req.body;
    const {_id} = req.user;
    validatedMongooseId(_id);
    try {
        let products = []
        const user = await User.findById(_id);
        //user already have cart
        const alreadyExistCart = await Cart.findOne({orderBy:user._id});
        if(alreadyExistCart){
            alreadyExistCart.remove();
        }
        for(let i = 0; i<cart.length; i++ ){
            let object = {}
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color
            let getPrice = await Product.findById(cart[i]._id).select('price').exec();
            object.price = getPrice.price;
            products.push(object);
        }
        let cartTotal = 0;
        for(let i = 0; i<products.length; i++){
            cartTotal = cartTotal+products[i].price * products[i].count;
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderBy:user._id
        }).save();
        res.json(newCart);
        console.log(products, cartTotal)
    } catch (error) {
        throw new Error(error);
    }
});
const getUserCart = asyncHandler(async(req, res) =>{
    try {
        const {_id} = req.user;
        validatedMongooseId(_id);
        const cart = await Cart.findOne({orderBy:_id}).populate("products.product");
        res.json(cart);
    } catch (error) {
        throw new Error(error)
    }
});

const emptyCart = asyncHandler(async(req, res) =>{
    const {_id} = req.user;
    validatedMongooseId(_id);
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndRemove({ orderBy:user._id });
        res.json(cart);
    } catch (error) {
        throw new Error(error)
    }
});

const applyCoupon = asyncHandler(async(req, res) =>{
    const {coupon} = req.body;
    const {_id} = req.user;
    try {
        const validCoupon = await Coupon.findOne({name: coupon});
        if (validCoupon === null) {
            throw new Error("Invalid Coupon");
        }
        const user = await User.findOne({_id});
        let {cartTotal} = await Cart.findOne({
            orderBy:user._id
        }).populate("products.product");
        let totalAfterDiscount = (
            cartTotal - (cartTotal * validCoupon.discount) / 100
        ).toFixed(2);
        const adb = await Cart.findOneAndUpdate({
            orderBy:user._id
        },{
            totalAfterDiscount
        },{
            new:true
        });
        console.log(adb)
        res.json(totalAfterDiscount);
    } catch (error) {
        throw new Error(error)
    }
})

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
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    updateAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon
}