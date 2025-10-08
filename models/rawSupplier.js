const mongoose = require("mongoose");

const rawSupplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: false, trim: true },
    phone: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    productName: { type: String, required: false, trim: true },
    location: { type: String, trim: true }, 
    productDescription: { type: String, required: false },
    note: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },
    minOrderValue: { type: Number, required: false },
    pricePerGram: { type: Number, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RawSupplier", rawSupplierSchema);
