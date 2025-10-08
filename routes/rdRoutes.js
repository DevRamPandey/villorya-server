const express = require("express");
const router = express.Router();
const rdController = require("../controllers/rdController");
const uploadController = require("../controllers/uploadController");

const protect = require('../middleware/authMiddleware');
const upload = require("../middleware/uploadMiddleware");
// Multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + path.extname(file.originalname)),
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === "application/pdf") cb(null, true);
//     else cb(new Error("Only PDF files allowed"));
//   },
// });

// R&D APIs
router.get("/", protect,rdController.getAllEntries);
router.post("/", protect,rdController.createEntry);
router.put("/:id", protect,rdController.updateEntry);
router.delete("/:id", protect,rdController.deleteEntry);
router.post("/:id/version", protect,rdController.addVersion);

// File upload API
router.post("/upload", protect, upload.single("file"), uploadController.uploadFile);


module.exports = router;
