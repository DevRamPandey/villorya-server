const path = require("path");

// Upload PDF and return URL
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ success: true, fileUrl, fileName: req.file.originalname });
};
