const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const protect = require('../middleware/authMiddleware');


router.post('/create', contactController.createContact);

router.get('/', protect, contactController.getAllContacts);
router.get('/:id', protect, contactController.getContact);
router.patch('/:id/move-to-pending', protect, contactController.moveToPending);
router.post('/:id/complete', protect, contactController.completeTicket);
router.delete('/:id', protect, contactController.deleteContact);

module.exports = router;
