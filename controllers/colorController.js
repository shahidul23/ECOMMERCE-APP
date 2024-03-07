const Color = require("../models/colorModel");
const {createSlug} = require("../helpsFunction/slug");
const asyncHandler = require("express-async-handler");
const validatedMongooseId = require('../utils/validationMongoDB');

const createColor = asyncHandler(async(req, res) =>{
    try {
        const newColor = Color({
            title: req.body.title,
            slug:createSlug(req.body.title)
        })
        await newColor.save()
        res.json(newColor)
    } catch (error) {
        throw new Error(error)
    }
});
const getAllColor = asyncHandler(async(req, res) =>{
    try {
        const findColor = await Color.find();
        res.json(findColor);
    } catch (error) {
        throw new Error(error)
    }
});
const getOneColor = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    validatedMongooseId(id)
    try {
        const findColor = await Color.findById(id);
        res.json(findColor)
    } catch (error) {
        throw new Error(error)
    }
});
const  updateColor = asyncHandler(async (req,res) =>{
    const {id} = req.params;
    validatedMongooseId(id);
    try {
        const colorUp = await Color.findByIdAndUpdate(id,{
            title:req.body.title,
            slug:createSlug(req.body.title)
        },{
            new:true,
        });
        res.json(colorUp)
    } catch (error) {
        throw new Error(error)
    }
});
const deleteColor = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    validatedMongooseId(id);
    try {
        const  removeColor = await Color.findByIdAndDelete(id);
        res.json(removeColor);
    } catch (error) {
        throw new Error(error);
    }
})


module.exports = { createColor,getAllColor, getOneColor, updateColor, deleteColor  }