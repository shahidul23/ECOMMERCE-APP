const express = require('express');
const { createProduct, getOneProduct, getAllProducts, productUpdate, productDeleted, addToWishlist, rating, uploadImagesProduct, deleteImagesProduct } = require('../controllers/productController');
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares");
const { uploadPhoto, productItemResize } = require('../middlewares/uploadImages');
const router = express.Router();

router.post("/",authMiddleware, isAdmin, createProduct);
router.put("/wishlist",authMiddleware, isAdmin, addToWishlist);
router.get("/",authMiddleware, isAdmin, getAllProducts);
router.get("/:id",authMiddleware, isAdmin, getOneProduct );
router.put("/update/:id",authMiddleware, isAdmin, productUpdate);
router.put("/rating",authMiddleware, isAdmin, rating);
router.put("/upload-images", authMiddleware, isAdmin, uploadPhoto.array("images",10), productItemResize, uploadImagesProduct);
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImagesProduct);
router.delete("/:id",authMiddleware, isAdmin, productDeleted);



module.exports = router;