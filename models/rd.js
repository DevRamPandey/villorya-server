const mongoose = require("mongoose");

const rdVersionSchema = new mongoose.Schema({
  versionNumber: { type: Number, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const rdSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    versions: [rdVersionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("rd", rdSchema);
