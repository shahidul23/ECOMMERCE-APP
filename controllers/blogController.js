const Blog = require("../models/blog.model");
const asyncHandler = require('express-async-handler')
const User = require('../models/user.model');
const validatedMongooseId = require('../utils/validationMongoDB');

const createBlog = asyncHandler(async(req, res) =>{
    try {
        const newBlog = await Blog.create(req.body);
        res.json({
            success:true,
            newBlog
        });
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createBlog }