const express = require("express");
const { createBrand, updateBrand, getOneBrand, getAllBrand, deleteBrand } = require("../controllers/brandController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares");
const router = express.Router();


router.post("/",authMiddleware,isAdmin, createBrand);
router.put("/:id",authMiddleware,isAdmin, updateBrand);
router.get("/:id",authMiddleware, isAdmin, getOneBrand);
router.get("/",authMiddleware, isAdmin, getAllBrand);
router.delete("/:id",authMiddleware, isAdmin, deleteBrand);

module.exports = router