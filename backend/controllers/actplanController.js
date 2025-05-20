const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
const asyncHandler = require("express-async-handler");

dotenv.config({ path: "backend/config/config.env" });

exports.getListOfActPlans = catchAsyncErrors(
  async (request, response, next) => {
    let sql = `SELECT * FROM activation_plan`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching activation_plan:", err);
        return next(new ErrorHandler("Error fetching activation_plan!", 500));
      }
      if (result.length > 0) {
        return response.status(200).json({ allactplans: result });
      } else {
        return response.status(404).json({ allactplans: [] });
      }
    });
  }
);

exports.getActPlanById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let sql = `SELECT * FROM activation_plan where id=${id}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error during retrieval:", err);
      return next(new ErrorHandler("Error during retrieval", 500));
    }
    res.status(200).json({ success: true, singleactplan: result[0] });
  });
});

exports.updateActPlan = asyncHandler(async (req, res, next) => {
  const updatedFields = req.body;
  const { id } = req.params;
  const updateFieldsString = Object.keys(updatedFields)
    .map((key) => `${key}="${updatedFields[key]}"`)
    .join(", ");

  const sql = `UPDATE activation_plan SET ${updateFieldsString} WHERE id = ${Number(
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
      next(
        new ErrorHandler("activation_plan not found or no changes applied", 404)
      );
    }
  });
});

exports.deleteActPlan = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(
      new ErrorHandler("activation_plan number (ID) is required", 400)
    );
  }

  const sql = `DELETE FROM activation_plan WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error during deletion:", err);
      return next(new ErrorHandler("Error during deletion", 500));
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Deletion successful" });
    } else {
      return next(
        new ErrorHandler("activation_plan not found or no changes applied", 404)
      );
    }
  });
});

exports.addActPlan = catchAsyncErrors(async (request, response, next) => {
  const {
    ROI_day,
    ROI_overall,
    Sponser_bonus,
    description,
    monthly_price,
    name,
    plan_period,
    yearly_discount,
  } = request.body;
  const sql = `INSERT INTO activation_plan (ROI_day,ROI_overall,Sponser_bonus,description,monthly_price,name ,plan_period ) VALUES (?,?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      ROI_day,
      ROI_overall,
      Sponser_bonus,
      description,
      monthly_price,
      name,
      plan_period,
    ],
    (err, result) => {
      if (err) {
        console.error("Error during activation_plan creation:", err);
        return next(
          new ErrorHandler("Error during activation_plan creation!", 500)
        );
      }
      if (result.affectedRows > 0) {
        response
          .status(200)
          .json({
            success: true,
            message: "activation_plan create successful",
          });
      } else {
        return response
          .status(400)
          .json({ message: "activation_plan could not be created" });
      }
    }
  );
});
