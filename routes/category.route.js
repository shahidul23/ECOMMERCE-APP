const express = require("express");
const { createCategory, updateCategory, getOneCategory, getAllCategory, deleteCategory } = require("../controllers/categoryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares");
const router = express.Router();

router.post("/", authMiddleware,isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.get("/:id", authMiddleware, isAdmin, getOneCategory);
router.get("/",authMiddleware, getAllCategory);
router.delete("/:id",authMiddleware, isAdmin, deleteCategory)
module.exports = router;