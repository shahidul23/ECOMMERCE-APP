const express = require('express');
const { createUser, loginUser, getUser, getOneUser, deleteUser, updatedUser } = require('../controllers/userController');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddlewares');
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/:id", updatedUser)
router.get("/all-users", getUser)
router.get("/:id",authMiddleware, isAdmin ,getOneUser)
router.delete("/:id", deleteUser)



module.exports = router;