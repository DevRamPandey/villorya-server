const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  variety: String,
  itemForm: String,
  dietType: String,
  useBy: String,
  netQuantities: [
    {
      quantity: String,
      price: Number,
    },
  ],
  coupons: [
    {
      code: String,
      discount: Number,
    },
  ],
  images: [String],
  videos: [String],
  labReports: [
    {
      title: String,
      description: String,
      file: String,
    },
  ],
  aboutItem: String,
  technicalDetails: [
    { key: String, value: String },
  ],
  additionalInfo: [
    { key: String, value: String },
  ],
  ingredients: String,
  legalDisclaimer: String,
  productDescription: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
