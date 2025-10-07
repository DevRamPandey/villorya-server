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

    // Validate fields
    if (!brandStory || !termsConditions || !privacyPolicy || !faqs || !refundPolicy) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    let cms = await CMS.findOne();
    if (!cms) {
      cms = new CMS(req.body);
    } else {
      cms.brandStory = brandStory;
      cms.termsConditions = termsConditions;
      cms.privacyPolicy = privacyPolicy;
      cms.faqs = faqs;
      cms.refundPolicy = refundPolicy;
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
