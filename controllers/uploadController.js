const cloudinary = require("../config/cloudinary");

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto", // supports PDF, images, etc.
      folder: "rd-files",    // optional folder
    });

    // result.url or result.secure_url
    res.json({
      success: true,
      fileUrl: result.secure_url,
      fileName: req.file.originalname,
      cloudinaryId: result.public_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Cloudinary upload failed" });
  }
};
