const mongoose = require('mongoose'); 

var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default:0
    },
    isLiked:{
        type:Boolean,
        default:false
    },
    isDisliked:{
        type:Boolean,
        default:false
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    ],
    disliked:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    image:{
        type:String,
        default:"https://media.istockphoto.com/id/1387141965/photo/happy-black-woman-using-digital-tablet-and-having-coffee-break.webp?b=1&s=170667a&w=0&k=20&c=QmgLjoiZxx0Vy8mQrZ9vTF-tzZ0Ri7ETywn7-3-xf7k="
    },
    author:{
        type:String,
        default:"Admin"
    }
},
{
    toJSON:{
        virtuals: true,
    },
    toObject:{
        virtuals: true,
    },
    timestamps:true,
});


module.exports = mongoose.model('Blog', blogSchema);