const multer = require("multer");

const storage = multer.memoryStorage(); // store file in memory
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files allowed"));
  },
});

module.exports = upload;
