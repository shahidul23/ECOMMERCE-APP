const { createSlug } = require('../helpsFunction/slug');
const Product = require('../models/product.model');
const asyncHandler = require('express-async-handler');

const createProduct = asyncHandler(async(req, res) =>{
    try {
        const newProduct =Product({
            title:req.body.title,
            slug:createSlug(req.body.title),
            code:req.body.code,
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
    const {id} = req.params;
    try {
        const updatedProduct = await Product.findOneAndUpdate(id,{
            title:req.body.title,
            slug:createSlug(req.body.title),
            code:req.body.code,
            price:req.body.price,
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
})



module.exports = {createProduct, getOneProduct, getAllProducts, productUpdate, productDeleted};