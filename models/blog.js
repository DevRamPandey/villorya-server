const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  featureImageUrl: { type: String, required: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  minutesOfRead: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },

  // Analytics fields
  views: [{
    timestamp: { type: Date, default: Date.now },
    ipAddress: String
  }],
  likes: [{
    timestamp: { type: Date, default: Date.now },
    userId: String
  }],
  shares: [{
    timestamp: { type: Date, default: Date.now },
    platform: String
  }],

  // Audit fields
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Auto timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

blogSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Blog', blogSchema);