const express = require("express");
const router = express.Router();
const rdController = require("../controllers/rdController");
const uploadController = require("../controllers/uploadController");

const protect = require('../middleware/authMiddleware');
const upload = require("../middleware/uploadMiddleware");


// R&D APIs
router.get("/", protect,rdController.getAllEntries);
router.post("/", protect,rdController.createEntry);
router.put("/:id", protect,rdController.updateEntry);
router.delete("/:id", protect,rdController.deleteEntry);
router.post("/:id/version", protect,rdController.addVersion);

// File upload API
router.post("/upload", protect, upload.single("file"), uploadController.uploadFile);


module.exports = router;
