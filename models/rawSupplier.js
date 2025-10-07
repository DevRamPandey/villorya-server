const mongoose = require("mongoose");

const rawSupplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    productDescription: { type: String, required: true },
    note: { type: String },
    status: { type: String, enum: ["active", "inactive", "pending"], default: "active" },
    minOrderValue: { type: Number, required: true },
    pricePerGram: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RawSupplier", rawSupplierSchema);
