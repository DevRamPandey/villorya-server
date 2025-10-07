const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const cmsSchema = new mongoose.Schema({
  brandStory: { type: String, required: true },
  termsConditions: { type: String, required: true },
  privacyPolicy: { type: String, required: true },
  faqs: { type: [faqSchema], default: [] },
  refundPolicy: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CMS', cmsSchema);
