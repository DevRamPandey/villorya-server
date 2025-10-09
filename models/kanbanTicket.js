const mongoose = require("mongoose");

const kanbanTicketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    externalLink: { type: String },
    assignedTo: { type: String, required: true },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["todo", "in-progress", "uat", "qa", "done"],
      default: "todo",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KanbanTicket", kanbanTicketSchema);
