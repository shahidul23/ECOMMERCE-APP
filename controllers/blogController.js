const Blog = require("../models/blog.model");
const asyncHandler = require('express-async-handler')
const User = require('../models/user.model');
const validatedMongooseId = require('../utils/validationMongoDB');

const createBlog = asyncHandler(async(req, res) =>{
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error)
    }
})
const updateBlogs = asyncHandler(async(req, res) =>{
    try {
        const { id } = req.params;
        validatedMongooseId(id);
        const updateBlog = await Blog.findByIdAndUpdate(id,req.body,{
            new:true
        });
        res.json(updateBlog)
    } catch (error) {
        throw new Error(error)
    }
});

const getOneBlogs = asyncHandler(async(req, res) =>{
    try {
        const { id } = req.params;
        validatedMongooseId(id);
        await Blog.findByIdAndUpdate(id,{
            $inc:{numViews:1}
        },{
            new:true
        });
        const findOne = await Blog.findById(id).populate("likes").populate("disliked");
        res.json(findOne)
    } catch (error) {
        throw new Error(error)
    }
});
const getAllBlogs = asyncHandler(async(req, res) => {
    try {
        const getBlogs =await Blog.find();
        res.json(getBlogs)
    } catch (error) {
        throw new Error(error)
    }
});

const deleteBlog = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params;
        validatedMongooseId(id);
        const deleteOne = await Blog.findByIdAndDelete(id)
        res.json(deleteOne);
    } catch (error) {
        throw new Error(error)
    }
});

const likeBlogs = asyncHandler(async(req, res) =>{
    try {
        const blogId = req.body.blogId;
        validatedMongooseId(blogId);
        const blog = await Blog.findById(blogId);
        const loginUserId = req.user._id;
        const isLiked = blog.isLiked;

        const alreadyDisLiked = blog.disliked.find((userId) => userId.toString() === loginUserId.toString());
        if(alreadyDisLiked){
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $pull: {disliked: loginUserId},
                isDisliked:false
            },{
                new:true
            });
            res.json(blog)
        }
        if (isLiked) {
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $pull: {likes: loginUserId},
                isLiked:false
            },{
                new:true
            });
            res.json(blog)
        }else{
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $push: {likes: loginUserId},
                isLiked:true
            },{
                new:true
            });
            res.json(blog)
        }
    } catch (error) {
        throw new Error(error)
    }
});

const dislikesTheBlog = asyncHandler(async(req, res) =>{
    try {
        const blogId = req.body.blogId;
        validatedMongooseId(blogId)
        const blog = await Blog.findById(blogId);
        const loginUserId = req.user._id;
        const isDisliked = blog.isDisliked;

        const alreadyLiked = blog.likes.find((userId) => userId.toString() === loginUserId.toString());
        if (alreadyLiked) {
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $pull: {likes: loginUserId},
                isLiked:false
            },{
                new:true
            });
            res.json(blog);
        }
        if(isDisliked) {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: {disliked: loginUserId},
                isDisliked: false
            },{
                new:true
            });
            res.json(blog)
        }else{
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $push: {disliked: loginUserId},
                isDisliked:true
            },{
                new:true
            });
            res.json(blog)
        }
    } catch (error) {
        throw new Error(error)
    }
});
const uploadImagesBlog = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        validatedMongooseId(id);
        const uploder = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files =req.files;
        for(const file  of files){
            const {path} = file;
            const newPath = await uploder(path);
            urls.push(newPath);
            fs.unlinkSync(path)
        }
        const findBlog = await Blog.findByIdAndUpdate(id,{
            images:urls.map((file) =>{
                return file
            }),
        },{
            new:true
        });
        res.json(findBlog)
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = { createBlog , updateBlogs, getOneBlogs, getAllBlogs, deleteBlog, likeBlogs, dislikesTheBlog, uploadImagesBlog }