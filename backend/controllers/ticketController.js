const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database");

exports.createTicket = catchAsyncErrors(async (req, res, next) => {
  const { subject, description, user_id } = req.body;

  if (!subject || !description || !user_id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const query = `
      INSERT INTO tickets (subject, description, user_id, priority)
      VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [subject, description, user_id,  "low"],
    (err, result) => {
      if (err) {
        console.log(err);
        
        return next(err);
      }
      res.status(201).json({
        success: true,
        message: "Ticket created successfully",
        ticket_id: result.insertId,
      });
    }
  );
});

// Add a response to a ticket
exports.addResponse = catchAsyncErrors(async (req, res, next) => {
  const { from, to, message } = req.body;
  const { ticket_id } = req.params;

  if (!ticket_id || !from || !to || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }
  const query = `
      INSERT INTO ticket_responses (ticket_id, \`from\`, \`to\`, message)
      VALUES (?, ?, ?, ?)
  `;

  db.query(query, [ticket_id, from, to, message], (err, result) => {
    if (err) {
      console.log(err);

      return next(err);
    }
    res.status(201).json({
      success: true,
      message: "Response added successfully",
      response_id: result.insertId,
    });
  });
});

// Get all responses for a ticket
exports.getTicketResponses = catchAsyncErrors(async (req, res, next) => {
  const { ticket_id } = req.params;

  if (!ticket_id) {
    return res
      .status(400)
      .json({ success: false, message: "Ticket ID is required" });
  }

  const query = `
      SELECT * FROM ticket_responses
      WHERE ticket_id = ?
      ORDER BY created_at ASC
  `;

  db.query(query, [ticket_id], (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      success: true,
      responses: results,
    });
  });
});

// Get tickets by user_id
exports.getTicketsByUser = catchAsyncErrors(async (req, res, next) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  const query = `
      SELECT 
          t.ticket_id, 
          t.subject, 
          t.description, 
          t.status, 
          t.priority, 
          t.created_at 
      FROM tickets t
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC;
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      return next(err);
    }

    const tickets = results.map((ticket) => ({
      ticket_id: ticket.ticket_id,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      created_at: ticket.created_at,
    }));

    res.status(200).json({
      success: true,
      tickets,
    });
  });
});

// Get all tickets (For Admin)
exports.getAllTickets = catchAsyncErrors(async (req, res, next) => {
  const query = `
      SELECT 
          t.ticket_id, 
          t.subject, 
          t.description, 
          t.status, 
          t.priority, 
          t.created_at, 
          u.id AS creator_id, 
          u.username AS creator_name 
      FROM tickets t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return next(err);
    }

    const tickets = results.map((ticket) => ({
      ticket_id: ticket.ticket_id,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      created_at: ticket.created_at,
      creator: {
        user_id: ticket.creator_id,
        username: ticket.creator_name,
      },
    }));

    res.status(200).json({
      success: true,
      tickets,
    });
  });
});

// Update ticket status
exports.updateTicketStatus = catchAsyncErrors(async (req, res, next) => {
  const ticket_id  = req.params.id; // Get ticket_id from URL
  const { status } = req.body; // Get new status from request body

  // Validate input
  if (!ticket_id) {
    return res
      .status(400)
      .json({ success: false, message: "Ticket ID is required." });
  }
  if (!status) {
    return res
      .status(400)
      .json({ success: false, message: "Status is required." });
  }

  // Allowed status values
  const allowedStatuses = ["open", "in-progress", "resolved", "closed"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed values are: ${allowedStatuses.join(
        ", "
      )}.`,
    });
  }

  // Update query
  const query = `
      UPDATE tickets
      SET status = ?, updated_at = NOW()
      WHERE ticket_id = ?;
  `;

  db.query(query, [status, ticket_id], (err, results) => {
    if (err) {
      return next(err);
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found." });
    }

    res.status(200).json({
      success: true,
      message: "Ticket status updated successfully.",
    });
  });
});



exports.getTicketById = catchAsyncErrors(async (req, res, next) => {
  // Log the incoming request
  console.log(`Fetching ticket with ID: ${req.params.ticket_id}`, {
    endpoint: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Validate input using express-validator (should be defined in your route)


  const { ticket_id } = req.params;


  try {
    // Query to get ticket details, user details, and responses
    const query = `
      SELECT 
          t.ticket_id,
          t.subject,
          t.description,
          t.status,
          t.priority,
          t.created_at,
          u.id AS creator_id,
          u.username AS creator_username,
          u.email AS creator_email,
          r.response_id,
          r.message,
          r.created_at AS response_created_at,
          r.from,
          r.to,
          u_from.username AS from_username,
          u_from.email AS from_email,
          u_to.username AS to_username,
          u_to.email AS to_email        
      FROM tickets t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN ticket_responses r ON r.ticket_id = t.ticket_id
      LEFT JOIN users u_from ON r.from = u_from.id
      LEFT JOIN users u_to ON r.to = u_to.id
      WHERE t.ticket_id = ?
      ORDER BY r.created_at DESC;
    `;

    // Using promise-based query instead of callback for better error handling
    const results = await new Promise((resolve, reject) => {
      db.query(query, [ticket_id], (err, results) => {
        if (err) {
          console.log('Database query failed', {
            error: err.message,
            query: query,
            ticket_id: ticket_id
          });
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    // If no ticket found
    if (!results || results.length === 0) {
       console.log('Ticket not found', { ticket_id });
      return res.status(404).json({
        success: false,
        message: `Ticket with ID ${ticket_id} not found`,
      });
    }

    // Parse the results to extract ticket and responses information
    const ticket = {
      ticket_id: results[0].ticket_id,
      subject: results[0].subject,
      description: results[0].description,
      status: results[0].status,
      priority: results[0].priority,
      created_at: results[0].created_at,
      creator: {
        user_id: results[0].creator_id,
        username: results[0].creator_username,
        email: results[0].creator_email,
      },
      responses: results
        .filter(row => row.response_id) // Only include rows with responses
        .map((row) => ({
          response_id: row.response_id,
          message: row.message,
          created_at: row.response_created_at,
          from: row.from ? {
            user_id: row.from,
            username: row.from_username,
            email: row.from_email,
          } : null,
          to: row.to ? {
            user_id: row.to,
            username: row.to_username,
            email: row.to_email,
          } : null,
        })),
    };

    // Log successful response (without sensitive data)
   console.log('Successfully fetched ticket', {
      ticket_id: ticket.ticket_id,
      response_count: ticket.responses.length
    });

    // Send the ticket details along with user and responses data
    res.status(200).json({
      success: true,
      ticket,
    });

  } catch (error) {
    // Log the full error stack
     console.log('Error in getTicketById', {
      error: error.message,
      stack: error.stack,
      ticket_id
    });
    
    // Pass error to error handling middleware
    next(error);
  }
});
