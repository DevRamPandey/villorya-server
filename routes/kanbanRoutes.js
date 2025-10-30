const express = require("express");
const router = express.Router();
const kanbanController = require("../controllers/kanbanController");
const {protect} = require("../middleware/authMiddleware"); 

router.get("/", protect, kanbanController.getAllTickets);
router.post("/", protect, kanbanController.createTicket);
router.put("/:id", protect, kanbanController.updateTicket);
router.delete("/:id", protect, kanbanController.deleteTicket);

module.exports = router;
