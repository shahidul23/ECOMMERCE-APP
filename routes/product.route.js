const express = require('express');
const { createProduct, getOneProduct, getAllProducts, productUpdate, productDeleted } = require('../controllers/productController');
const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getOneProduct );
router.put("/:id", productUpdate);
router.delete("/:id", productDeleted)

module.exports = router;