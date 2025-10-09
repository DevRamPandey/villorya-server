const KanbanTicket = require("../models/kanbanTicket");

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await KanbanTicket.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create a new ticket
exports.createTicket = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      externalLink,
      assignedTo,
      startDate,
      dueDate,
      status,
    } = req.body;

    if (!title || !assignedTo || !startDate || !dueDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const ticket = new KanbanTicket({
      title,
      description,
      category,
      priority,
      externalLink,
      assignedTo,
      startDate,
      dueDate,
      status,
    });

    await ticket.save();
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update a ticket
exports.updateTicket = async (req, res) => {
  try {
    const updated = await KanbanTicket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ success: false, message: "Ticket not found" });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a ticket
exports.deleteTicket = async (req, res) => {
  try {
    const deleted = await KanbanTicket.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Ticket not found" });

    res.json({ success: true, message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
