const express = require('express');
const { uploadImagesProduct, deleteImagesProduct } = require('../controllers/upload');
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares");
const { uploadPhoto, productItemResize } = require('../middlewares/uploadImages');
const router = express.Router();

router.post("/", authMiddleware, isAdmin, uploadPhoto.array("images",10), productItemResize, uploadImagesProduct);
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImagesProduct);


module.exports = router;