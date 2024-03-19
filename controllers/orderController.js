const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model")
const Product = require("../models/product.model");
const { v4: uuidv4 } = require('uuid');
const validatedMongooseId = require('../utils/validationMongoDB');
const asyncHandler = require('express-async-handler')


const createOrder = asyncHandler(async(req, res) =>{
    const {COD, couponApplied} = req.body;
    const { _id } = req.user;
    validatedMongooseId(_id)
    try {
        if (!COD) {
            throw new Error("Create cash order failed");
        }else{
            const user = await User.findById(_id);
            let userCart = await Cart.findOne({orderBy: user._id});
            let finalAmount = 0;
            if (couponApplied && userCart.totalAfterDiscount) {
                finalAmount = userCart.totalAfterDiscount
            }else{
                finalAmount = userCart.cartTotal
            }
            let newOrder = await new Order({
                products:userCart.products,
                paymentIntent:{
                    id:uuidv4(),
                    method:"COD",
                    amount:finalAmount,
                    status:"Cash on Delivery",
                    created:Date.now(),
                    currency:"Taka"
                },
                orderBy:user._id,
                orderStatus:"Cash on Delivery"
            }).save();
            let update = userCart.products.map((item) => {
                return{
                    updateOne:{
                        filter:{_id: item.product._id},
                        update:{$inc: {quantity: -item.count, sold:+item.count}}
                    }
                }
            });
            const updated = await Product.bulkWrite(update, {});
            res.json({message:"successfull"});
        }
    } catch (error) {
        throw new Error(error);
    }
});

const getOrder = asyncHandler(async(req, res) =>{
    const {_id} = req.user;
    validatedMongooseId(_id)
    try {
        const userOrders = await Order.findOne({orderBy:_id})
        .populate("products.product").populate("orderBy")
        .exec();
        res.json(userOrders);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllOrder = asyncHandler(async(req, res) =>{
    try {
        const allOrders = await Order.find()
        .populate("products.product").populate("orderBy")
        .exec();
        res.json(allOrders);
    } catch (error) {
        throw new Error(error);
    }
});

const updateOrderStatus = asyncHandler(async(req, res) =>{
    const { status } = req.body;
    const { id } = req.params;
    validatedMongooseId(id)
    try {
        const updateStatus = await Order.findByIdAndUpdate(id,{
            orderStatus:status,
            paymentIntent:{
                status:status
            }
        },{
            new:true
        });
        res.json(updateStatus)
    } catch (error) {
        throw new Error(error);
    }
})


module.exports = {createOrder, getOrder, updateOrderStatus,getAllOrder}