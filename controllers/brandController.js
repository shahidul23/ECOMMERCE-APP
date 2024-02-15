const Brand = require("../models/brand.model");
const {createSlug} = require("../helpsFunction/slug");
const asyncHandler = require("express-async-handler");
const validatedMongooseId = require('../utils/validationMongoDB');

const createBrand = asyncHandler(async(req, res) =>{
    try {
        const newBrand = Brand({
            title:req.body.title,
            slug:createSlug(req.body.title)
        });
        await newBrand.save();
        res.json(newBrand)
    } catch (error) {
        throw new Error(error)
    }
});
const updateBrand = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        const update = await Brand.findByIdAndUpdate(id,{
            title:req.body.title,
            slug:createSlug(req.body.title),
        },{
            new:true,
        });
        res.json(update)
    } catch (error) {
        throw new Error(error)
    }
});
const getOneBrand = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        const findBrand = await Brand.findById(id);
        res.json(findBrand);
    } catch (error) {
        throw new Error(error);
    }
});
const getAllBrand = asyncHandler(async(req, res) =>{
    try {
        const findAll = await Brand.find();
        res.json(findAll);
    } catch (error) {
        throw new Error(error);
    }
});
const deleteBrand = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        const deleteItem = await Brand.findByIdAndDelete(id);
        res.json(deleteItem)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createBrand, updateBrand, getOneBrand, getAllBrand, deleteBrand }