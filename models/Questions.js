const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['packageSuppliers', 'rawSuppliers', 'packageFAQs', 'rawFAQs'],
    required: true,
  },
  question: { type: String, required: true },
  answers: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
