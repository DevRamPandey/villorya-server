// controllers/leadController.js
const Lead = require('../models/lead');
const resend = require('../utils/resendClient');

// 1. Public Contact Us
exports.contactUs = async (req, res) => {
  try {
    const { fullName, email, companyName, serviceInterestedIn,message } = req.body;
    const lead = await Lead.create({ fullName, email, companyName, serviceInterestedIn ,message});
    try{
      console.log("Sending email")
      // Email to User
      await resend.emails.send({
        from: 'Support Students Credit<enquiry@enquiry.wonkrudigital.com>',
        to: email,
        subject: 'Thank you for contacting us!',
        html: `<p>Hi ${fullName},</p>
              <p>Thank you for reaching out to us. We’ve received your inquiry and will respond shortly.</p>
              <p>Best regards,<br>Your Company</p>`
      });

      // Email to Admin
      await resend.emails.send({
        from: 'Notifier <enquiry@enquiry.wonkrudigital.com>',
        to: 'berlin@wonkrudigital.com',
        subject: 'New Contact Inquiry Received',
        html: `<p>You have a new inquiry:</p>
              <ul>
                <li><strong>Name:</strong> ${fullName}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Company:</strong> ${companyName}</li>
                <li><strong>Service Interested In:</strong> ${serviceInterestedIn}</li>
                <li><strong>Message:</strong> ${message}</li>
              </ul>`
      });
    }catch(ex){
      console.log(ex);
    }
    res.status(201).json({success:true, message: 'Inquiry created successfully.', data:lead });
  } catch (err) {
    res.status(500).json({ message: 'Error creating lead', error: err.message });
  }
};

// 2. Get All Leads
exports.getAllLeads = async (req, res) => {
  const leads = await Lead.find();
  res.json({
    success:true, message: 'Leads fetched successfully.',
    data:leads});
};

// 3. Get Priority Leads
exports.getPriorityLeads = async (req, res) => {
  const leads = await Lead.find({ priority: 'hot' });
  res.json({success:true, message: 'Leads fetched successfully.',
    data:leads});
};

// 4. Get Converted Leads
exports.getConvertedLeads = async (req, res) => {
  const leads = await Lead.find({ status: 'converted' });
  res.json({success:true, message: 'Leads fetched successfully.',
    data:leads});
};

// 5. Get Archived Leads
exports.getArchivedLeads = async (req, res) => {
  const leads = await Lead.find({ priority: 'archived' });
  res.json({success:true, message: 'Leads fetched successfully.',
    data:leads});
};

// 6. Update Lead Priority
exports.updatePriority = async (req, res) => {
  const { id } = req.params;
  const { priority } = req.body;
  const lead = await Lead.findByIdAndUpdate(id, { priority }, { new: true });
  res.json({success:true, message: 'Lead updated successfully.',
    data:lead});
};

// 7. Update Lead Status
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
  res.json({success:true, message: 'Lead updated successfully.',
    data:lead});
};

// 8. Set Reminder Date
exports.setReminder = async (req, res) => {
  const { id } = req.params;
  const { reminderDate } = req.body;
  const lead = await Lead.findByIdAndUpdate(id, { reminderDate }, { new: true });
  res.json({success:true, message: 'Lead updated successfully.',
    data:lead});
};

// 9. Delete Lead
exports.deleteLead = async (req, res) => {
  const { id } = req.params;
  await Lead.findByIdAndDelete(id);
  res.json({ message: 'Lead deleted successfully' });
};
