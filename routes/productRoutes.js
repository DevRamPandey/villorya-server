const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const uploadController = require("../controllers/uploadController");

const protect = require('../middleware/authMiddleware');
const upload = require("../middleware/uploadMiddleware");

// File upload API
router.post("/upload", protect, upload.uploadMedia.single("file"), uploadController.uploadFile);


module.exports = router;
