const express = require('express');
const { createUser, loginUser, getUser, getOneUser, deleteUser,
    updatedUser, blockUser, UnblockUser, handleRefreshToken, logout,
    updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, updateAddress, userCart, getUserCart, emptyCart, applyCoupon } = require('../controllers/userController');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddlewares');
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin)
router.get("/refresh", authMiddleware,handleRefreshToken);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword)
router.get("/logout",authMiddleware, logout);
router.put("/password",authMiddleware,updatePassword)
router.put("/edit-user",authMiddleware, updatedUser)
router.get("/all-users",authMiddleware,isAdmin, getUser)
router.get("/user/:id",authMiddleware, isAdmin ,getOneUser)
router.delete("/delete-user/:id", deleteUser)
router.put("/block-user/:id",authMiddleware, isAdmin , blockUser)
router.put("/unblock-user/:id",authMiddleware, isAdmin ,UnblockUser);
router.get("/wsihlist", authMiddleware, isAdmin, getWishlist);
router.put("/address", authMiddleware, updateAddress);
router.post("/cart", authMiddleware, userCart);
router.get("/cart", authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);



module.exports = router;