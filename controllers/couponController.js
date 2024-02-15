const Coupon = require("../models/coupon.model");
const asyncHandler = require('express-async-handler')
const User = require('../models/user.model');
const validatedMongooseId = require('../utils/validationMongoDB');


const createCoupon = asyncHandler(async(req, res) =>{
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon)
    } catch (error) {
        throw new Error(error)
    }
});
const getAllCoupon = asyncHandler(async(req, res) =>{
    try {
        const allCoupon = await Coupon.find();
        res.json(allCoupon);
    } catch (error) {
        throw new Error(error);
    }
});
const getOneCoupon = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        validatedMongooseId(id)
        const findOne = await Coupon.findById(id);
        res.json(findOne);
    } catch (error) {
        throw new Error(error)
    }
});
const updateCoupon = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        validatedMongooseId(id)
        const updateOne = await Coupon.findByIdAndUpdate(id, req.body,{new:true});
        res.json(updateOne);
    } catch (error) {
        throw new Error(error)
    }
});
const deleteCoupon = asyncHandler(async(req, res)=>{
    try {
        const {id} = req.params;
        validatedMongooseId(id)
        const deleteOne = await Coupon.findByIdAndDelete(id);
        res.json(deleteOne);
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {createCoupon, getAllCoupon, getOneCoupon, updateCoupon, deleteCoupon}