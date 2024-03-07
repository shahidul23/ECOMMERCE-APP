const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    code:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    sold:{
        type:Number,
        default:0
    },
    images:[],
    tags:[],
    color:[],
    ratings:[
        {
            star:Number,
            comment:String,
            postedby:{ type: mongoose.Schema.Types.ObjectId, ref: "User"}
        }
    ],
    totalRating:{
        type:String,
        default:0
    }
},
{
    timestamps:true,
}
) 

module.exports = mongoose.model("product", productSchema);