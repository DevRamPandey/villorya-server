// routes/leadRoutes.js
const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadsController');
const protect = require('../middleware/authMiddleware');
const validateRequest = require('../utils/validateRequest');
const { contactUsValidator } = require('../validations/leadValidation');

// Public
router.post('/contact-us',validateRequest(contactUsValidator), leadController.contactUs);

// Authenticated
router.get('/', protect, leadController.getAllLeads);
router.get('/priority', protect, leadController.getPriorityLeads);
router.get('/converted', protect, leadController.getConvertedLeads);
router.get('/archived', protect, leadController.getArchivedLeads);

router.patch('/:id/priority', protect, leadController.updatePriority);
router.patch('/:id/status', protect, leadController.updateStatus);
router.patch('/:id/reminder', protect, leadController.setReminder);

router.delete('/:id', protect, leadController.deleteLead);

module.exports = router;
