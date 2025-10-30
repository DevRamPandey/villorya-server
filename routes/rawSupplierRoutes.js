const express = require("express");
const router = express.Router();
const rawSupplierController = require("../controllers/rawSupplierController");
const {protect} = require('../middleware/authMiddleware');

router.get("/", protect,rawSupplierController.getAllSuppliers);
router.post("/", protect,rawSupplierController.addSupplier);
router.put("/:id", protect,rawSupplierController.updateSupplier);
router.delete("/:id", protect,rawSupplierController.deleteSupplier);

module.exports = router;
