const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/packageSupplierController');
const protect = require('../middleware/authMiddleware');

// Authenticated
router.get("/",protect, dashboardController.getAllSuppliers);
router.post("/",protect, dashboardController.addSupplier);
router.put("/:id",protect, dashboardController.updateSupplier);
router.delete("/:id",protect, dashboardController.deleteSupplier);

module.exports = router;
