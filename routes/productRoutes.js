const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const uploadController = require("../controllers/uploadController");

const protect = require('../middleware/authMiddleware');
const upload = require("../middleware/uploadMiddleware");

// File upload API
router.post("/upload", protect, upload.uploadMedia.single("file"), uploadController.uploadFile);
router.post("/",protect, productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.delete("/:id",protect, productController.deleteProduct);
router.put("/:id",protect, productController.editProduct);

module.exports = router;

