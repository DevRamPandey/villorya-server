const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.use(authMiddleware, adminOnly);

router.get('/users', adminCtrl.listUsers);
router.post('/block/:userId', adminCtrl.blockUser);
router.post('/unblock/:userId', adminCtrl.unblockUser);

module.exports = router;
