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
        const findProduct = await Product.find();
        res.json({
            message:"Find All Products",
            success:true,
            findProduct,
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