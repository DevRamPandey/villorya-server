const PackageSupplier=require('../models/packageSupplier');

// Helper: Validate supplier fields
const validateSupplierFields = (data) => {
  const { name, email, phone, productDescription, status, minOrderValue, pricePerUnit } = data;
  if (!name || !name.trim()) return "Name is required";
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return "Valid email is required";
  if (!phone || !/^\+?\d{7,15}$/.test(phone)) return "Valid phone number is required";
  if (!productDescription || !productDescription.trim()) return "Product description is required";
  if (!["active", "inactive", "pending"].includes(status)) return "Status must be active, inactive or pending";
  if (minOrderValue < 0) return "Min order value cannot be negative";
  if (pricePerUnit < 0) return "Price per unit cannot be negative";
  return null;
};

// Get all package suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await PackageSupplier.find().sort({ createdAt: -1 });
    res.json({ success: true, data: suppliers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch suppliers" });
  }
};

// Add new supplier
exports.addSupplier = async (req, res) => {
  try {
    const validationError = validateSupplierFields(req.body);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    const newSupplier = new PackageSupplier(req.body);
    await newSupplier.save();
    res.status(201).json({ success: true, data: newSupplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add supplier" });
  }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
  try {
    const validationError = validateSupplierFields(req.body);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    const updatedSupplier = await PackageSupplier.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedSupplier)
      return res.status(404).json({ success: false, message: "Supplier not found" });

    res.json({ success: true, data: updatedSupplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update supplier" });
  }
};


// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await PackageSupplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier)
      return res.status(404).json({ success: false, message: "Supplier not found" });

    res.json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete supplier" });
  }
};