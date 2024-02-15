const express = require("express");
const { createCategory, updateCategory, getOneCategory, getAllCategory, deleteCategory } = require("../controllers/blogCategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares");
const { uploadPhoto, blogsItemResize } = require("../middlewares/uploadImages");
const { uploadImagesBlog } = require("../controllers/blogController");
const router = express.Router();

router.post("/", authMiddleware,isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.get("/:id", authMiddleware, isAdmin, getOneCategory);
router.get("/", authMiddleware, isAdmin, getAllCategory);
router.delete("/:id",authMiddleware, isAdmin, deleteCategory);
router.put("/upload-images/:id", authMiddleware, isAdmin, uploadPhoto.array("images",2), blogsItemResize, uploadImagesBlog);
module.exports = router;