// routes/leadRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const protect = require('../middleware/authMiddleware');

// Authenticated
router.get('/', protect, dashboardController.dashboard);

module.exports = router;
