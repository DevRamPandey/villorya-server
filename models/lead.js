// models/Lead.js
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  companyName: { type: String, required: true },
  serviceInterestedIn: { type: String, required: true },
  message: { type: String, required: true },

  priority: {
    type: String,
    enum: ['hot', 'cold', 'archived'],
    default: 'cold'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in progress', 'converted', 'lost'],
    default: 'new'
  },
  reminderDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
