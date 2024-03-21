const { createSlug } = require('../helpsFunction/slug');
const Product = require('../models/product.model');
const User = require("../models/user.model");
const asyncHandler = require('express-async-handler');
const validatedMongooseId = require('../utils/validationMongoDB');




const createProduct = asyncHandler(async(req, res) =>{
    try {
        const newProduct =Product({
            title:req.body.title,
            slug:createSlug(req.body.title),
            code:req.body.code,
            tags: req.body.tags,
            price:req.body.price,
            description:req.body.description,
            category:req.body.category,
            brand:req.body.brand,
            quantity:req.body.quantity,
            sold:req.body.sold,
            images:req.body.images,
            color:req.body.color,
            ratings:req.body.ratings
        });
        await newProduct.save()
        .then(() => {
            res.json({
                message:"Products Create Successfully",
                success:true,
                newProduct,
            })
        }).catch((err) => {
            throw new Error(err)
        });
    } catch (error) {
        throw new Error(error)
    }
});
const getAllProducts = asyncHandler(async(req, res) =>{
    try {
        //filtering 
        const queryObj = {...req.query}
        const excludeFields = ["page", "sort", "limit", "fields"]
        excludeFields.forEach((el) =>delete queryObj[el])
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        let query = Product.find(JSON.parse(queryStr))
        
        //sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy)
        }else{
            query = query.sort("createdAt")
        }
        //limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }else{
            query = query.select("-__v")
        }
        //pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page -1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip>=productCount) throw new Error("This page dose not exist");
        }

        const Products = await query;
        res.json({
            message:"Find All Products",
            success:true,
            Products,
        })
    } catch (error) {
        throw new Error(error)
    }
})
const getOneProduct = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    validatedMongooseId(id)
    try {
        const findProduct = await Product.findById(id)
        res.json({
            message:"find a product",
            success:true,
            findProduct
        })
    } catch (error) {
        throw new Error(error)
    }
});

const productUpdate = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        const updatedProduct = await Product.findOneAndUpdate(id,{
            title:req.body.title,
            slug:createSlug(req.body.title),
            code:req.body.code,
            price:req.body.price,
            tags: req.body.tags,
            description:req.body.description,
            category:req.body.category,
            brand:req.body.brand,
            quantity:req.body.quantity,
            sold:req.body.sold,
            images:req.body.images,
            color:req.body.color,
            ratings:req.body.ratings
        },
        {
            new:true
        })
        res.json({
            message:"Product updated successfully",
            success:true,
            updatedProduct,
        });
    } catch (error) {
        throw new Error(error)
    }
});
const productDeleted =  asyncHandler(async(req, res) =>{
    const {id} = req.params;
    validatedMongooseId(id)
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        res.json({
            message:"product deleted successfully",
            success:true,
            deletedProduct
        })
    } catch (error) {
        throw new Error(error)
    }
});

const addToWishlist = asyncHandler(async(req, res) =>{
    const {_id} = req.user;
    validatedMongooseId(_id)
    const {prodId} = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id) =>id.toString() === prodId);
        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(_id,{
                $pull:{wishlist: prodId},
            },{
                new:true,
            });
            res.json(user)
        }else{
            let user = await User.findByIdAndUpdate(_id,{
                $push:{wishlist:prodId},
            },{
                new:true
            });
            res.json(user);
        }
    } catch (error) {
        throw new Error(error)
    }
})

const rating = asyncHandler(async(req, res) =>{
    const {_id} = req.user;
    const {star, prodId, comment} = req.body;
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find((userId) => userId.postedby.toString() === _id.toString());
        if (alreadyRated) {
            await Product.updateOne({
                ratings:{ $elemMatch:alreadyRated }
            },{
                $set:{"ratings.$.star":star,"ratings.$.comment":comment}
            },{
                new:true
            });
        }else{
            await Product.findByIdAndUpdate(prodId,{
                $push:{
                    ratings:{
                        star:star,
                        comment:comment,
                        postedby:_id,
                    }
                }
            },{
                new:true,
            });
        }
        const getAllRating = await Product.findById(prodId);
        let totalRating = getAllRating.ratings.length;
        let ratingSum = getAllRating.ratings.map((item) =>item.star).reduce((prev, curr)=> prev + curr, 0);
        let actualRating = Math.round(ratingSum / totalRating);
        let finalProductRating = await Product.findByIdAndUpdate(prodId,{
            totalRating: actualRating
        },{
            new:true
        });
        res.json(finalProductRating) 
    } catch (error) {
        throw new Error(error)
    }
});

module.exports = {createProduct, getOneProduct, getAllProducts,
productUpdate, productDeleted, addToWishlist, rating};