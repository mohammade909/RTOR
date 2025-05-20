// routes/ticketRoutes.js
const express = require("express");
const {
  createTicket,
  getAllTickets,
  getTicketResponses,
  updateTicketStatus,
  getTicketsByUser,
  addResponse,
  getTicketById
} = require("../controllers/ticketController");

const router = express.Router();

router.post("/", createTicket);
router.get("/", getAllTickets);

// Route to add a response to a ticket
router.post("/:ticket_id/responses", addResponse);

// Route to get all responses for a ticket
router.get("/:ticket_id/responses", getTicketResponses);

// Route to get a single ticket by ID (including responses)
router.get("/:user_id", getTicketsByUser);
router.get("/single/:ticket_id", getTicketById);

// Route to update a ticket's status
router.put("/:id/status", updateTicketStatus);

module.exports = router;
