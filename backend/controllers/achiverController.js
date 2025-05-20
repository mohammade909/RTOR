const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
const fs = require('fs');
const path = require('path');
dotenv.config({ path: "backend/config/config.env" });
const asyncHandler = require("express-async-handler");

exports.getListOfAchivers = catchAsyncErrors(async (request, response, next) => {
  let sql = `SELECT * FROM achivers;
`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching achivers:", err);
      return next(new ErrorHandler("Error fetching achivers!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ allachivers: result });
    } else {
      return response.status(200).json({ allachivers: [] });
    }
  });
});

exports.addAchivers = catchAsyncErrors(async (req, res, next) => {
  let {username ,description} = req.body;
  console.log(req.body)
  if (!req.files || !req.files.image) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  let uploadedFile = req.files.image;
  const uniqueFilename = `${username}_${Date.now()}_${uploadedFile.name}`;
  const uploadDir = path.join(__dirname, '..', '..', 'finrain.info','uploads','achivers');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const uploadPath = path.join(uploadDir, uniqueFilename);
  uploadedFile.mv(uploadPath, function(err) {
    if (err) {
      console.error("Error during file upload:", err);
      return next(new ErrorHandler("Error during file upload", 500));
    }
    const insertTopupSql = `INSERT INTO achivers (username, description, image) VALUES (?, ?, ?)`;
    db.query(insertTopupSql, [username, description, uniqueFilename], (err, insertResult) => {
      if (err) {
        console.error("Error inserting into achivers table:", err);
        return next(new ErrorHandler("Error inserting into achivers table!", 500));
      }
      if (insertResult.affectedRows > 0) {
        res.status(200).json({ success: true, message: "achivers request sent successfully" });
      } else {
        console.log(err)
        res.status(400).json({ error: "Failed to insert into achivers table" });
      }
    });
  });
});
exports.deleteAchivers= asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorHandler("achivers number (ID) is required", 400));
    }
    const sql = `DELETE FROM achivers WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error during deletion:", err);
        return next(new ErrorHandler("Error during deletion", 500));
      }
      if (result.affectedRows > 0) {
        res.status(200).json({ success: true, message: "Deletion successful" });
      } else {
        return next(
          new ErrorHandler("achivers not found or no changes applied", 404)
        );
      }
    });
  });