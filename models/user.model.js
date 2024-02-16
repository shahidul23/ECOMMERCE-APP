const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require('crypto');
// Declare the Schema of the Mongo model
// var userSchema = new mongoose.Schema({
//     firstName:{
//         type:String,
//         required:true
//     },
//     lastName:{
//         type:String,
//         required:true
//     },
//     mobile:{
//         type:Number,
//         required:true,
//         unique:true,
//     },
//     email:{
//         type:String,
//         required:true,
//         unique:true,
//     },
//     password:{
//         type:String,
//         required:true,
//     },
//     rule:{
//         type:String,
//         default:"user"
//     },
//     isBlocked:{
//         type:Boolean,
//         default:false
//     },
//     cart:{
//         type:Array,
//         default: []
//     },
//     address:[{type: mongoose.Schema.ObjectId, ref: "Address"}],
//     wishlist:[{type: mongoose.Schema.ObjectId, ref: "Product"}],
//     refreshToken:{
//         type:String,
//     },
//     passwordChangedAt: Date,
//     passwordResetToken: String,
//     passwordResetExpires: Date,
// },{
//     timestamps:true
// });

// userSchema.pre("save", async (next) =>{
//     if (!this.isModified("password")) {
//         next();
//     }
//     const salt = await bcrypt.genSaltSync(10);
//     this.password = await bcrypt.hash(this.password, salt)
//     next()
// })
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    mobile: {
        type: String, // Mobile number is typically stored as string due to potential leading zeroes
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /\d{11}/.test(v); // Ensure that the mobile number is 10 digits long
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Ensure emails are stored in lowercase for consistency
        validate: {
            validator: function(v) {
                return /\S+@\S+\.\S+/.test(v); // Basic email format validation
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Restrict role values to 'user' or 'admin'
        default: 'user'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'product',
        default: [] 
    },
    address: {
        type: String,
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],
    refreshToken: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true
});
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (error) {
        return next(error);
    }
});
// userSchema.methods.isPasswordMatched = async (enteredPassword) =>{
//     return await bcrypt.compare(enteredPassword, this.password)
// }
userSchema.methods.isPasswordMatched = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
// userSchema.methods.createPasswordResetToken  = async function() {
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     this.passwordResetToken = crypto
//         .createHash("sha256")
//         .update(resetToken)
//         .digest("hex");
//     this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
//     return resetToken;
// }
userSchema.methods.createPasswordResetToken = async function() {
    try {
        const resetToken = crypto.randomBytes(32).toString("hex");
        this.passwordResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        return resetToken;
        
    } catch (error) {
        throw new Error('Failed to create password reset token');
    }
}
//Export the model
module.exports = mongoose.model("User", userSchema);