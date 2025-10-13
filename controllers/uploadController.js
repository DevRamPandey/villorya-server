const admin = require("firebase-admin"); 
const fs = require("fs"); 

if (!admin.apps.length) 
  { admin.initializeApp({ credential: admin.credential.cert({
  "type": process.env.TYPE,
  "project_id": process.env.PROJECT_ID,
  "private_key_id": process.env.PRIVATE_KEY_ID,
  "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.CLIENT_EMAIL,
  "client_id": process.env.CLIENT_ID,
  "auth_uri": process.env.AUTH_URI,
  "token_uri": process.env.TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url":process.env.CLIENT_X509_CERT_URL,
  "universe_domain": process.env.UNIVERSAL_DOMAIN
  }), storageBucket: process.env.FIREBASE_BUCKET, }); }

  console.log("Firebase admin initialized");
 
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
