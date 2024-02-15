const express = require("express");
const { createCoupon, getAllCoupon, getOneCoupon, updateCoupon, deleteCoupon } = require("../controllers/couponController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares");
const router = express.Router();

router.post("/",authMiddleware, isAdmin, createCoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupon);
router.get("/:id",authMiddleware, isAdmin, getOneCoupon);
router.put("/update/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;