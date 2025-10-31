const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
router.use(protect.protect, protect.protect);

router.get('/users', adminCtrl.listUsers);
router.post('/block/:userId', adminCtrl.blockUser);
router.post('/unblock/:userId', adminCtrl.unblockUser);

module.exports = router;
