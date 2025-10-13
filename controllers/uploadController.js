const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("../firebaseServiceAccount.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_BUCKET,
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

exports.uploadFile = async (req, res) => {
  if (!req.file.path) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  try {
    console.log(req.file.path);
    // Upload to firebase
    const filePath = req.file.path;
    const destination = `uploads/${Date.now()}_${req.file.originalname}`;

    // Upload to Firebase Storage
    await bucket.upload(filePath, {
      destination,
      public: true,
      metadata: { contentType: req.file.mimetype },
    });

    // Get public URL
    const file = bucket.file(destination);
    const [url] = await file.getSignedUrl({
      action: "read"
    });

    // Remove local temp file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      fileUrl: url,
      fileName: req.file.originalname,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "upload failed" });
  }
};
