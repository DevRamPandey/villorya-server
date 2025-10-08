const RawSupplier = require("../models/rawSupplier");

// 🧾 Get all raw suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await RawSupplier.find().sort({ createdAt: -1 });
    res.json({ success: true, data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ➕ Add new supplier
exports.addSupplier = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      website,
      productName,
      productDescription,
      note,
      status,
      minOrderValue,
      pricePerGram,
      location,
    } = req.body;

    // Basic validation
    if (
      !name ||
      !email ||
      !phone ||
      !productDescription ||
      !productName ||
      !status ||
      minOrderValue === undefined ||
      pricePerGram === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const newSupplier = new RawSupplier({
      name,
      email,
      phone,
      website,
      productName,
      productDescription,
      note,
      status,
      minOrderValue,
      pricePerGram,
      location,
    });

    await newSupplier.save();
    res.status(201).json({ success: true, data: newSupplier });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✏️ Update supplier
exports.updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await RawSupplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSupplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    res.json({ success: true, data: updatedSupplier });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ❌ Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await RawSupplier.findByIdAndDelete(req.params.id);

    if (!deletedSupplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    res.json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
