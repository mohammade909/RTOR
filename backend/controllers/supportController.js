const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
const asyncHandler = require("express-async-handler");
const fetchSetRoiFromAdminSettings = require("../utils/settings");

dotenv.config({ path: "backend/config/config.env" });

exports.getListOfSupport = catchAsyncErrors(async (request, response, next) => {
  let sql = `SELECT support.*, users.email FROM support LEFT JOIN users ON support.user_id = users.id;`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching support:", err);
      return next(new ErrorHandler("Error fetching support!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ allsupport: result });
    } else {
      return response.status(200).json({ allsupport: [] });
    }
  });
});
exports.getListOfsingleSupport = catchAsyncErrors(async (request, response, next) => {
  const {user_id} = request.params;
  let sql = `SELECT * FROM support where user_id=${user_id}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching support:", err);
      return next(new ErrorHandler("Error fetching support!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ singlesupport: result });
    } else {
      return response.status(200).json({ singlesupport: [] });
    }
  });
});

exports.updateSupport = asyncHandler(async (req, res, next) => {
  const updatedFields = req.body;
  const { id } = req.params;
  const updateFieldsString = Object.keys(updatedFields)
    .map((key) => `${key}="${updatedFields[key]}"`)
    .join(", ");

  const sql = `UPDATE support SET ${updateFieldsString} WHERE id = ${Number(
    id
  )};`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error during update:", err);
      next(new ErrorHandler("Error during update", 500));
    }

    if (result?.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Update successful" });
    } else {
      next(new ErrorHandler("support not found or no changes applied", 404));
    }
  });
});

exports.deleteSupport = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorHandler("support number (ID) is required", 400));
  }

  const sql = `DELETE FROM support WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error during deletion:", err);
      return next(new ErrorHandler("Error during deletion", 500));
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Deletion successful" });
    } else {
      return next(
        new ErrorHandler("support not found or no changes applied", 404)
      );
    }
  });
});

exports.addSupport= catchAsyncErrors(async (request, response, next) => {
  const {user_id,email,title,message} = request.body;
  const {setsupport} = await fetchSetRoiFromAdminSettings();
    
  if (setsupport !== 1) {
    return response.status(404).json({ message: "Admin not allowed support" });
  }
    const sql = `INSERT INTO support (user_id,email,title,message) VALUES (?,?,?,?)`;

    db.query(sql, [user_id,email,title,message], (err, result) => {
      if (err) {
        console.error("Error during support creation:", err);
        return next(new ErrorHandler("Error during support creation!", 500));
      }
      if (result.affectedRows > 0) {
        response.status(200).json({ success: true, message: "Message sent successful" });
      } else {
        return response.status(200).json({ message: "Message could not be sent" });
      }
    });
  } 
);
