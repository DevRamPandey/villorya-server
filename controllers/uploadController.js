const admin = require("firebase-admin"); 
const fs = require("fs"); 

const serviceAccount = require("../firebaseServiceAccount.json"); 

if (!admin.apps.length) 
  { admin.initializeApp({ credential: admin.credential.cert(serviceAccount), storageBucket: process.env.FIREBASE_BUCKET, }); }
 
const bucket = admin.storage().bucket();

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const destination = `uploads/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(destination);

    // Create a write stream directly from the buffer
    const stream = file.createWriteStream({
      metadata: { contentType: req.file.mimetype },
      public: true,
    });

    stream.end(req.file.buffer);

    stream.on("finish", async () => {
      const [url] = await file.getSignedUrl({ action: "read", expires: "03-09-2491" });
      res.json({
        success: true,
        fileUrl: url,
        fileName: req.file.originalname,
      });
    });

    stream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ success: false, message: "Upload failed" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};
