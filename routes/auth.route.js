const express = require('express');
const { createUser, loginUser, getUser, getOneUser } = require('../controllers/userController');
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/all-users", getUser)
router.get("/:id", getOneUser)


module.exports = router;