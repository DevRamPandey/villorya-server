const express = require('express');
const router = express.Router();
const { getCMSContent, updateCMSContent } = require('../controllers/cmsController');
const protect = require('../middleware/authMiddleware');


router.get('/', protect, getCMSContent);

router.put('/', protect, updateCMSContent);

module.exports = router;
