const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
const asyncHandler = require("express-async-handler");

dotenv.config({ path: "backend/config/config.env" });

exports.getListOfNews = catchAsyncErrors(async (request, response, next) => {
  let sql = `SELECT * FROM news`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching news:", err);
      return next(new ErrorHandler("Error fetching news!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ allnews: result });
    } else {
      return response.status(200).json({ allnews: [] });
    }
  });
});

exports.getNewsById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let sql = `SELECT * FROM news where id=${id}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error during retrieval:", err);
      return next(new ErrorHandler("Error during retrieval", 500));
    }
    res.status(200).json({ success: true, singlenews: result[0] });
  });
});

exports.updateNews = asyncHandler(async (req, res, next) => {
  const updatedFields = req.body;
  const { id } = req.params;
  const updateFieldsString = Object.keys(updatedFields)
    .map((key) => `${key}="${updatedFields[key]}"`)
    .join(", ");

  const sql = `UPDATE news SET ${updateFieldsString} WHERE id = ${Number(
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
      next(new ErrorHandler("News not found or no changes applied", 404));
    }
  });
});

exports.deleteNews = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorHandler("news number (ID) is required", 400));
  }

  const sql = `DELETE FROM News WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error during deletion:", err);
      return next(new ErrorHandler("Error during deletion", 500));
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Deletion successful" });
    } else {
      return next(
        new ErrorHandler("news not found or no changes applied", 404)
      );
    }
  });
});

exports.addNews = catchAsyncErrors(async (request, response, next) => {
  const {title , content} = request.body;
  console.log(request.body)

    const sql = `INSERT INTO newss (title,content ) VALUES (?,?)`;

    db.query(sql, [title,content], (err, result) => {
      if (err) {
        console.error("Error during news creation:", err);
        return next(new ErrorHandler("Error during news creation!", 500));
      }
      if (result.affectedRows > 0) {
        response.status(200).json({ success: true, message: "news create successful" });
      } else {
        return response.status(400).json({ message: "news could not be created" });
      }
    });
  } 
);
