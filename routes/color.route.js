const express = require('express');
const { createColor, getAllColor, getOneColor, updateColor, deleteColor } = require('../controllers/colorController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlewares');
const router = express.Router();


router.post("/", createColor);
router.get("/", getAllColor);
router.get("/:id", getOneColor);
router.put("/:id", updateColor);
router.delete("/:id", deleteColor);

module.exports = router;