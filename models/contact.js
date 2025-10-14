const mongoose = require('mongoose');


const contactSchema = new mongoose.Schema(
{
name: { type: String, required: true, trim: true, maxlength: 100 },
email: { type: String, required: true, trim: true },
message: { type: String, required: true, trim: true, maxlength: 2000 },
status: {
type: String,
enum: ['received', 'pending', 'done'],
default: 'received',
},
movedToPendingAt: { type: Date },
completedAt: { type: Date },
adminComment: { type: String, trim: true, maxlength: 2000 },
},
{ timestamps: true }
);


module.exports = mongoose.model('Contact', contactSchema);