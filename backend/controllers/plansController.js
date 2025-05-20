const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
const asyncHandler = require("express-async-handler");

dotenv.config({ path: "backend/config/config.env" });

exports.getListOfPlans = catchAsyncErrors(async (request, response, next) => {
  let sql = `SELECT * FROM plans`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching plan:", err);
      return next(new ErrorHandler("Error fetching plan!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ allplans: result });
    } else {
      return response.status(200).json({ allplans: [] });
    }
  });
});

exports.getPlanById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let sql = `SELECT * FROM plans where id=${id}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error during retrieval:", err);
      return next(new ErrorHandler("Error during retrieval", 500));
    }
    res.status(200).json({ success: true, singleplan: result[0] });
  });
});

exports.updatePlan = asyncHandler(async (req, res, next) => {
  const updatedFields = req.body;
  const { id } = req.params;
  const updateFieldsString = Object.keys(updatedFields)
    .map((key) => `${key}="${updatedFields[key]}"`)
    .join(", ");

  const sql = `UPDATE plans SET ${updateFieldsString} WHERE id = ${Number(
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
      next(new ErrorHandler("Plan not found or no changes applied", 404));
    }
  });
});

exports.deletePlan = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorHandler("plan number (ID) is required", 400));
  }

  const sql = `DELETE FROM plans WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error during deletion:", err);
      return next(new ErrorHandler("Error during deletion", 500));
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Deletion successful" });
    } else {
      return next(
        new ErrorHandler("plan not found or no changes applied", 404)
      );
    }
  });
});

exports.addPlan = catchAsyncErrors(async (request, response, next) => {
  const {ROI_day,ROI_overall,Sponser_bonus,description,monthly_price,name ,plan_period,type } = request.body;

    const sql = `INSERT INTO plans (ROI_day,ROI_overall,Sponser_bonus,description,monthly_price,name ,plan_period,type) VALUES (?, ?, ?, ?, ?, ?, ?,?)`;

    db.query(sql, [ROI_day,ROI_overall,Sponser_bonus,description,monthly_price,name ,plan_period,type], (err, result) => {
      if (err) {
        console.error("Error during plan creation:", err);
        return next(new ErrorHandler("Error during plan creation!", 500));
      }
      if (result.affectedRows > 0) {
        response.status(200).json({ success: true, message: "plan create successful" });
      } else {
        return response.status(400).json({ message: "plan could not be created" });
      }
    });
  } 
);

exports.addInvestLevel = catchAsyncErrors(async (request, response, next) => {
  const { 
    level_1,
    level_2,
    level_3,
    level_4,
    level_5,
    level_6,
    level_7,
    level_8,
    level_9,
    level_10,
    level_11,
    level_12,
    level_13,
    level_14,
    level_15,
    level_16,
    level_17,
    level_18,
    level_19,
    level_20  
  } = request.body;


  const sql = `INSERT INTO invest_level (
    level_1,
    level_2,
    level_3,
    level_4,
    level_5,
    level_6,
    level_7,
    level_8,
    level_9,
    level_10,
    level_11,
    level_12,
    level_13,
    level_14,
    level_15,
    level_16,
    level_17,
    level_18,
    level_19,
    level_20  
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    level_1 !== undefined ? level_1 : 0,
    level_2 !== undefined ? level_2 : 0,
    level_3 !== undefined ? level_3 : 0,
    level_4 !== undefined ? level_4 : 0,
    level_5 !== undefined ? level_5 : 0,
    level_6 !== undefined ? level_6 : 0,
    level_7 !== undefined ? level_7 : 0,
    level_8 !== undefined ? level_8 : 0,
    level_9 !== undefined ? level_9 : 0,
    level_10 !== undefined ? level_10 : 0,
    level_11 !== undefined ? level_11 :0,
    level_12 !== undefined ? level_12 :0,
    level_13 !== undefined ? level_13 :0,
    level_14 !== undefined ? level_14 :0,
    level_15 !== undefined ? level_15 :0,
    level_16 !== undefined ? level_16 :0,
    level_17 !== undefined ? level_17 :0,
    level_18 !== undefined ? level_18 :0,
    level_19 !== undefined ? level_19 :0,
    level_20 !== undefined ? level_20 :0  
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error during plan creation:", err);
      return next(new ErrorHandler("Error during plan creation!", 500));
    }
    if (result.affectedRows > 0) {
      response.status(200).json({ success: true, message: "Plan created successfully" });
    } else {
      return response.status(400).json({ message: "Plan could not be created" });
    }
  });
});