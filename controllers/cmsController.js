const CMS = require('../models/cms'); // Mongoose model for CMS

// Get CMS content
const getCMSContent = async (req, res) => {
  try {
    let cms = await CMS.findOne();
    if (!cms) {
      // If no content exists, create default
      cms = new CMS({
        brandStory: '',
        termsConditions: '',
        privacyPolicy: '',
        faqs: [],
        refundPolicy: '',
      });
      await cms.save();
    }
    res.json({ success: true, data: cms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update CMS content
const updateCMSContent = async (req, res) => {
  try {
    const { brandStory, termsConditions, privacyPolicy, faqs, refundPolicy } = req.body;

    // Check if at least one field is provided
    if (!brandStory && !termsConditions && !privacyPolicy && !faqs && !refundPolicy) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one field is required to update CMS content' 
      });
    }

    let cms = await CMS.findOne();
    if (!cms) {
      // Create new CMS document with only the provided fields
      cms = new CMS(req.body);
    } else {
      // Update only the fields that are provided
      if (brandStory !== undefined) cms.brandStory = brandStory;
      if (termsConditions !== undefined) cms.termsConditions = termsConditions;
      if (privacyPolicy !== undefined) cms.privacyPolicy = privacyPolicy;
      if (faqs !== undefined) cms.faqs = faqs;
      if (refundPolicy !== undefined) cms.refundPolicy = refundPolicy;
    }

    await cms.save();
    res.json({ success: true, data: cms, message: 'CMS content updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCMSContent,
  updateCMSContent,
};
