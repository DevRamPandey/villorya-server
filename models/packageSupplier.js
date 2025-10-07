const mongoose = require('mongoose');

const packageSupplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    productDescription: { type: String, required: true },
    note: { type: String },

    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },

    minOrderValue: { type: Number, default: 0 },
    pricePerUnit: { type: Number, default: 0 },

    minOrderWeight: { type: Number, default: 0 }, 
    pricePerKg: { type: Number, default: 0 },
    location: { type: String, default: "" }, 
    website: { type: String, default: "" }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('PackageSupplier', packageSupplierSchema);
