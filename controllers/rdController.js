const RDEntry = require("../models/rd");

// Get all entries
exports.getAllEntries = async (req, res) => {
  try {
    const entries = await RDEntry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new entry
exports.createEntry = async (req, res) => {
  try {
    const { title, description, tags, fileName, fileUrl } = req.body;

    if (!title || !description || !fileUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Title, description, and file are required" });
    }

    const newEntry = new RDEntry({
      title,
      description,
      tags: tags ? tags.map((t) => t.trim()) : [],
      versions: [
        {
          versionNumber: 1,
          fileName,
          fileUrl,
        },
      ],
    });

    await newEntry.save();
    res.status(201).json({ success: true, data: newEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update existing entry (not versions)
exports.updateEntry = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const entry = await RDEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });

    entry.title = title || entry.title;
    entry.description = description || entry.description;
    entry.tags = tags ? tags.map((t) => t.trim()) : entry.tags;
    entry.updatedAt = new Date();

    await entry.save();
    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new version
exports.addVersion = async (req, res) => {
  try {
    const { fileName, fileUrl } = req.body;
    const entry = await RDEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });

    const newVersion = {
      versionNumber: entry.versions.length + 1,
      fileName,
      fileUrl,
    };

    entry.versions.push(newVersion);
    entry.updatedAt = new Date();

    await entry.save();
    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete entry
exports.deleteEntry = async (req, res) => {
  try {
    const entry = await RDEntry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });

    res.json({ success: true, message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
