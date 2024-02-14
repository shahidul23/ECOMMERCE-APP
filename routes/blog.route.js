const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares");
const { createBlog, updateBlogs, getOneBlogs, getAllBlogs, deleteBlog, likeBlogs, dislikesTheBlog } = require("../controllers/blogController");
const router = express.Router();

router.post("/",authMiddleware, isAdmin, createBlog);
router.put("/likes", authMiddleware, isAdmin, likeBlogs);
router.put("/dislikes",authMiddleware, isAdmin, dislikesTheBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlogs);
router.get("/:id", authMiddleware, isAdmin, getOneBlogs);
router.get("/", authMiddleware, isAdmin, getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);


module.exports = router;