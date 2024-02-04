const express = require('express');
const { createUser, loginUser, getUser, getOneUser, deleteUser, updatedUser, blockUser, UnblockUser, handleRefreshToken, logout } = require('../controllers/userController');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddlewares');
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout)
router.put("/edit-user",authMiddleware, updatedUser)
router.get("/all-users",authMiddleware,isAdmin, getUser)
router.get("/:id",authMiddleware, isAdmin ,getOneUser)

router.delete("/:id", deleteUser)
router.put("/block-user/:id",authMiddleware, isAdmin , blockUser)
router.put("/unblock-user/:id",authMiddleware, isAdmin ,UnblockUser)



module.exports = router;