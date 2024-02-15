const express = require('express');
const { createProduct, getOneProduct, getAllProducts, productUpdate, productDeleted, addToWishlist, rating, uploadImagesProduct } = require('../controllers/productController');
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares");
const { uploadPhoto, productItemResize } = require('../middlewares/uploadImages');
const router = express.Router();

router.post("/",authMiddleware, isAdmin, createProduct);
router.put("/wishlist",authMiddleware, isAdmin, addToWishlist);
router.get("/",authMiddleware, isAdmin, getAllProducts);
router.get("/:id",authMiddleware, isAdmin, getOneProduct );
router.put("/update/:id",authMiddleware, isAdmin, productUpdate);
router.put("/rating",authMiddleware, isAdmin, rating);
router.put("/upload-images/:id", authMiddleware, isAdmin, uploadPhoto.array("images",10), productItemResize, uploadImagesProduct);
router.delete("/:id",authMiddleware, isAdmin, productDeleted);



module.exports = router;