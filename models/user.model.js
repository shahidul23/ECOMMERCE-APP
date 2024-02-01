const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    rule:{
        type:String,
        default:"user"
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    cart:{
        type:Array,
        default: []
    },
    address:[{type: mongoose.Schema.ObjectId, ref: "Address"}],
    wishlist:[{type: mongoose.Schema.ObjectId, ref: "Product"}],
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('User', userSchema);