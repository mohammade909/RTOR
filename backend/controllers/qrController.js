const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
const asyncHandler = require("express-async-handler");

dotenv.config({ path: "backend/config/config.env" });

exports.getQrLink = catchAsyncErrors(async (request, response, next) => {
  let sql = `SELECT * FROM qr ORDER BY id DESC LIMIT 1`; // Assuming 'id' is the primary key
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching plan:", err);
      return next(new ErrorHandler("Error fetching plan!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ qr: result[0] }); // Return the last entry
    } else {
      return response.status(200).json({ qr: null }); // Return null if no records exist
    }
  });
});

exports.deleteQrLink = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorHandler("plan number (ID) is required", 400));
  }

  const sql = `DELETE FROM qr WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error during deletion:", err);
      return next(new ErrorHandler("Error during deletion", 500));
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Deletion successful" });
    } else {
      return next(
        new ErrorHandler("link not found or no changes applied", 404)
      );
    }
  });
});
exports.addQrLink = catchAsyncErrors(async (request, response, next) => {
    const {BEB20, TRC20} = request.body.values;
      const sql = `INSERT INTO qr (BEB20,TRC20) VALUES (?,?)`;
      db.query(sql, [BEB20, TRC20], (err, result) => {
        if (err) {
          console.error("Error during qrlink creation:", err);
          return next(new ErrorHandler("Error during qrlink creation!", 500));
        }
        if (result.affectedRows > 0) {
          response.status(200).json({ success: true, message: "Payment created successfully" });
        } else {
          return response.status(400).json({ message: "Payment could not be created" });
        }
      });
    } 
  );
  