const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile_${req.user ? req.user._id : Date.now()}_${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'));
    cb(null, true);
  }
});

router.use(authMiddleware);

// profile
router.get('/me', userCtrl.getProfile);
router.put('/me', upload.single('profilePic'), userCtrl.updateProfile);

// addresses
router.get('/addresses', userCtrl.listAddresses);
router.post('/address', userCtrl.addAddress);
router.put('/address/:addressId', userCtrl.updateAddress);
router.delete('/address/:addressId', userCtrl.deleteAddress);

module.exports = router;
