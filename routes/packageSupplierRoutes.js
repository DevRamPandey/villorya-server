import express from "express";
import {
  getAllSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/packageSupplierController";
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// All routes are protected


router.get("/",protect, getAllSuppliers);
router.post("/",protect, addSupplier);
router.put("/:id",protect, updateSupplier);
router.delete("/:id",protect, deleteSupplier);

export default router;
