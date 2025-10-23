// Save as: controllers/contactController.js
const Contact = require("../models/contact");
const { validationResult } = require("express-validator");
const { contactUsEmail } = require("../utils/emailTemplate");
const nodemailer = require("nodemailer");
// Helper to throw validation errors in a consistent format
function handleValidationErrors(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Validation failed");
    err.status = 422;
    err.details = errors.array();
    throw err;
  }
}

exports.createContact = async (req, res, next) => {
  try {
    handleValidationErrors(req);

    const { name, email, message } = req.body;

    const contact = await Contact.create({ name, email, message });

    try{
     await sendContactResponseEmail(email,name,contact.id,Date.now().toLocaleString());
    }catch(ex){
      console.log(ex);
    }

    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

const sendContactResponseEmail = async (toEmail,userName,ticketId,date) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your SMTP provider
    auth: {
      user: 'villoryaorganics@gmail.com',
      pass: 'pehs usdg ohnn saum',
    },
  });

  const htmlTemplate = contactUsEmail(userName,ticketId,date);

  await transporter.sendMail({
    from: `"Villorya" villoryaorganics@gmail.com`,
    to: toEmail,
    subject: "We've received your message — Villorya",
    html: htmlTemplate,
  });
};

exports.getAllContacts = async (req, res, next) => {
  try {
    // Optional filtering by status
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const contacts = await Contact.find(filter).sort("-createdAt"); // sort by newest first

    res.json({
      success: true,
      data: contacts,
      meta: { total: contacts.length },
    });
  } catch (err) {
    next(err);
  }
};


exports.getContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
      const e = new Error("Contact not found");
      e.status = 404;
      throw e;
    }
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

exports.moveToPending = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
      const e = new Error("Contact not found");
      e.status = 404;
      throw e;
    }
    if (contact.status !== "received") {
      const e = new Error(
        'Only tickets with status "received" can be moved to pending'
      );
      e.status = 400;
      throw e;
    }

    contact.status = "pending";
    contact.movedToPendingAt = new Date();
    await contact.save();

    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

exports.completeTicket = async (req, res, next) => {
  try {
    handleValidationErrors(req);

    const { id } = req.params;
    const { adminComment } = req.body;

    const contact = await Contact.findById(id);
    if (!contact) {
      const e = new Error("Contact not found");
      e.status = 404;
      throw e;
    }
    if (contact.status !== "pending") {
      const e = new Error("Only pending tickets can be completed");
      e.status = 400;
      throw e;
    }

    contact.status = "done";
    contact.adminComment = adminComment;
    contact.completedAt = new Date();
    await contact.save();

    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      const e = new Error("Contact not found");
      e.status = 404;
      throw e;
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};
