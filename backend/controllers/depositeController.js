const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
const asyncHandler = require("express-async-handler");
const fetchSetRoiFromAdminSettings = require("../utils/settings");
const path = require('path');
const fs = require('fs');
const util = require('util');

dotenv.config({ path: "backend/config/config.env" });

exports.getListOfDeposite = catchAsyncErrors(async (request, response, next) => {
  let sql = `SELECT user_deposite.*, users.email
FROM user_deposite
LEFT JOIN users ON user_deposite.user_id = users.id;
`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching deposite:", err);
      return next(new ErrorHandler("Error fetching deposite!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ alldeposite: result });
    } else {
      return response.status(200).json({ alldeposite: [] });
    }
  });
});
exports.getListOfDepositeById = catchAsyncErrors(async (request, response, next) => {
  const { user_id } = request.params;
  let sql = `SELECT user_deposite.*, users.email
FROM user_deposite
LEFT JOIN users ON user_deposite.user_id = users.id where user_id = '${user_id}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching Deposite:", err);
      return next(new ErrorHandler("Error fetching Deposite!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ singleDeposite: result });
    } else {
      return response.status(200).json({ singleDeposite: [] });
    }
  });
});

exports.updateDeposite = asyncHandler(async (req, res, next) => {
  const { status, amount, user_id } = req.body;
  const { id } = req.params;

  // Update user_deposite table
  const updateDepositeSql = `UPDATE user_deposite SET status = ?, acceptat = NOW() WHERE id = ?`;
  db.query(updateDepositeSql, [status, id], (err, depositeResult) => {
    if (err) {
      console.error("Error updating user_deposite:", err);
      return next(new ErrorHandler("Error updating user_deposite", 500));
    }
    
    // Check if update was successful
    if (depositeResult.affectedRows === 0) {
      return next(new ErrorHandler("No user_deposite found or no changes applied", 404));
    }

    // If status is 'complete', update the users table business column
    if (status === 'complete') {
      const updateBusinessSql = `UPDATE users SET business = business + ? WHERE id = ?`;
      db.query(updateBusinessSql, [amount, user_id], (err, userResult) => {
        if (err) {
          console.error("Error updating user's business balance:", err);
          return next(new ErrorHandler("Error updating user's business balance", 500));
        }

        // Check if update was successful
        if (userResult.affectedRows === 0) {
          return next(new ErrorHandler("No user found or no changes applied to business balance", 404));
        }

        // Respond with success message
        res.status(200).json({ success: true, message: "Update successful" });
      });
    } else {
      // If status is not 'complete', respond with success message for deposite update
      res.status(200).json({ success: true, message: "Update successful for user_deposite" });
    }
  });
});


exports.deleteDeposite= asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorHandler("deposite number (ID) is required", 400));
  }
  const sql = `DELETE FROM user_deposite WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error during deletion:", err);
      return next(new ErrorHandler("Error during deletion", 500));
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Deletion successful" });
    } else {
      return next(
        new ErrorHandler("user_deposite not found or no changes applied", 404)
      );
    }
  });
});

exports.addDeposite = catchAsyncErrors(async (req, res, next) => {
  let { amount, user_id ,hash,status} = req.body;

    const insertTopupSql = `INSERT INTO user_deposite (user_id, amount , currency,hash,status) VALUES (?, ?, ?,?,?)`;
    db.query(insertTopupSql, [user_id, amount,"BEB20",hash,status], (err, insertResult) => {
      if (err) {
        console.error("Error inserting into Deposite table:", err);
        return next(new ErrorHandler("Error inserting into Deposite table!", 500));
      }
      if (insertResult.affectedRows > 0) {
        const updateuserSql = `Update users set business = business + ? where id = ?`;
        db.query(updateuserSql, [amount, user_id], (err, updateResult) => {
          if (err) {
            console.error("Error inserting into Deposite table:", err);
            return next(new ErrorHandler("Error inserting into Deposite table!", 500));
          }
          if (updateResult.affectedRows > 0) {
            res.status(200).json({ success: true, message: "Deposite request sent successfully" });
          } else {
            res.status(400).json({ error: "Failed to insert into Deposite table" });
          }
        });
      } else {
        res.status(400).json({ error: "Failed to insert into Deposite table" });
      }
    });
});

exports.manualDeposit = catchAsyncErrors(async (req, res, next) => {
  try {
    // Extract parameters from request body
    const { amount, user_id, currency = 'USD', hash = null } = req.body;

    // Validate required fields
    if (!amount || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'Amount and user ID are required fields'
      });
    }

    // Validate file upload
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: 'Proof of deposit image is required'
      });
    }

    const uploadedFile = req.files.image;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(uploadedFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPEG, PNG, and PDF files are allowed'
      });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (uploadedFile.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum allowed size is 5MB'
      });
    }

    // Create a secure unique filename to prevent path traversal attacks
    const fileExtension = path.extname(uploadedFile.name).toLowerCase();
    const sanitizedUserId = user_id.toString().replace(/[^a-zA-Z0-9]/g, '');
    const uniqueFilename = `${sanitizedUserId}_${Date.now()}${fileExtension}`;
    const relativeFilePath = `/deposits/${uniqueFilename}`;

    // Set upload directory - ensure this points to the correct absolute path
    const uploadDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'deposits');

    // Create directory if it doesn't exist (with recursive option)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadPath = path.join(uploadDir, uniqueFilename);

    // Use promisify to convert the mv function to use promises
    const mvPromise = util.promisify(uploadedFile.mv.bind(uploadedFile));
    await mvPromise(uploadPath);

    // Current timestamp for createdAt
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Insert deposit record using promise-based query
    const [insertResult] = await db.promise().query(
      `INSERT INTO user_deposite (
        user_id,
        amount,
        image_name,
        currency,
        hash,
        createdAt,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        amount,
        relativeFilePath,
        currency,
        hash,
        createdAt,
        'pending' // Default status
      ]
    );

    if (insertResult.affectedRows === 0) {
      // Remove uploaded file if database insert fails
      if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath);
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to create deposit record'
      });
    }

    // Return success response with deposit details
    return res.status(201).json({
      success: true,
      message: 'Deposit request submitted successfully',
      data: {
        id: insertResult.insertId,
        user_id,
        amount,
        currency,
        status: 'pending',
        created: createdAt
      }
    });

  } catch (error) {
    console.error('Error processing deposit request:', error);
    return next(new ErrorHandler('Error processing deposit request', 500));
  }
});