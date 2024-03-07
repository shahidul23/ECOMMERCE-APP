const express = require('express');
const { createEnquiry, getAllEnquiry, getOneEnquiry, deleteEnquiry } = require('../controllers/enquiryController');
const router = express.Router();

router.post("/", createEnquiry);
router.get("/", getAllEnquiry);
router.get("/:id", getOneEnquiry);
router.delete("/:id", deleteEnquiry);

module.exports = router;