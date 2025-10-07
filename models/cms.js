const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: false },
  answer: { type: String, required: false },
});

const cmsSchema = new mongoose.Schema({
  brandStory: { type: String, required: false },
  termsConditions: { type: String, required: false },
  privacyPolicy: { type: String, required: false },
  faqs: { type: [faqSchema], default: [] },
  refundPolicy: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('CMS', cmsSchema);
