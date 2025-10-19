const multer = require("multer");

const storage = multer.memoryStorage(); // store file in memory
const uploadPdf = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files allowed"));
  },
});

// Allowed MIME types for images and videos
const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/jpg",
  "image/svg+xml",

  // Videos
  "video/mp4",
  "video/mpeg",
  "video/quicktime", // .mov
  "video/webm",
  "video/ogg",
];

const uploadMedia = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // limit to 50MB per file
  },
});

module.exports = {uploadMedia,uploadPdf};