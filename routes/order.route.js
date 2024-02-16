const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares");
const { createOrder, getOrder, updateOrderStatus } = require("../controllers/orderController");
const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrder);
router.put("/update-status/:id", authMiddleware,isAdmin, updateOrderStatus);

module.exports = router;