const BlogCategory = require("../models/blogCat.model");
const asyncHandler = require("express-async-handler");
const validatedMongooseId = require('../utils/validationMongoDB');
const { createSlug } = require('../helpsFunction/slug');

const createCategory = asyncHandler(async(req, res) =>{
    try {
        const newCategory = BlogCategory({
            title:req.body.title,
            slug:createSlug(req.body.title)
        })
        await newCategory.save();
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
});
const updateCategory = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        validatedMongooseId(id)
        const updateCat =await BlogCategory.findByIdAndUpdate(id,{
            title:req.body.title,
            slug:createSlug(req.body.title)
        },{
            new:true
        });
        res.json(updateCat)
    } catch (error) {
        throw new Error(error)
    }
});

const getOneCategory = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        const fundCategory = await BlogCategory.findById(id);
        res.json(fundCategory);
    } catch (error) {
        throw new Error(Error);
    }
})
const getAllCategory = asyncHandler(async(req, res) =>{
    try {
        const allCategory = await BlogCategory.find();
        res.json(allCategory)
    } catch (error) {
        throw new Error(error)
    }
});
const deleteCategory = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        const deleteCat = await BlogCategory.findByIdAndDelete(id);
        res.json(deleteCat)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {createCategory, updateCategory, getOneCategory, getAllCategory, deleteCategory}