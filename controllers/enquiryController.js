const Enquiry = require("../models/enq.model");
const asyncHandler = require("express-async-handler");
const validatedMongooseId = require('../utils/validationMongoDB');

const createEnquiry = asyncHandler(async(req, res) =>{
    try {
        const newEnq = await Enquiry.create(req.body);
        res.json(newEnq);
    } catch (error) {
        throw new Error(error)
    }
});
const getOneEnquiry = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    validatedMongooseId(id);
    try {
        const findOne = await Enquiry.findById(id);
        res.json(findOne);
    } catch (error) {
        throw new Error(error);
    }
})
const getAllEnquiry = asyncHandler(async(req, res) =>{
    try {
        const findAll = await Enquiry.find();
        res.json(findAll);
    } catch (error) {
        throw new Error(error)
    }
});
const deleteEnquiry = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    try {
        const deleted = await Enquiry.findByIdAndDelete(id)
        res.json(deleted)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createEnquiry, getOneEnquiry, getAllEnquiry, deleteEnquiry }