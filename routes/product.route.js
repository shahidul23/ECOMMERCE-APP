const express = require('express');
const { createProduct, getOneProduct, getAllProducts, productUpdate, productDeleted, addToWishlist, rating } = require('../controllers/productController');
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares");
const router = express.Router();

router.post("/",authMiddleware, isAdmin, createProduct);
router.put("/wishlist",authMiddleware, isAdmin, addToWishlist);
router.get("/",authMiddleware, getAllProducts);
router.get("/:id",authMiddleware, isAdmin, getOneProduct );
router.put("/update/:id",authMiddleware, isAdmin, productUpdate);
router.put("/rating",authMiddleware, isAdmin, rating);
router.delete("/:id",authMiddleware, isAdmin, productDeleted);

module.exports = router;