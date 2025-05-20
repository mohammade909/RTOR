const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
const asyncHandler = require("express-async-handler");


exports.getListOfUsers = catchAsyncErrors(async (request, response, next) => {
  let sql = `SELECT * FROM users`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching users:", err);
      return next(new ErrorHandler("Error fetching users!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ allusers: result });
    } else {
      return response.status(404).json({ allusers: [] });
    }
  });
});

exports.getListOfNonUsers = asyncHandler(async (req, res, next) => {
  const sql = `
    SELECT u.email, u.id , u.username,u.fullname, r.title, r.amount,r.created_at
    FROM users u
    LEFT JOIN rewardnoti r ON u.id = r.userId
    WHERE NOT EXISTS (
        SELECT 1 FROM users c WHERE c.reffer_by = u.refferal_code
    )
    AND u.created_at <= NOW() - INTERVAL 10 DAY;
  `;

  try {
    const [result] = await db.promise().query(sql);
    
    if (result.length > 0) {
      return res.status(200).json({ allnonusers: result });
    } else {
      return res.status(404).json({ allnonusers: [] });
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    next(new ErrorHandler("Error fetching users!", 500));
  }
});

exports.getUsersById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let sql = `SELECT * FROM users where id=${id}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error during retrieval:", err);
      return next(new ErrorHandler("Error during retrieval", 500));
    }
    res.status(200).json({ success: true, singleuser: result[0] });
  });
});
exports.getUsersByEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.query;
  let sql = `SELECT * FROM users where email='${email}' OR refferal_code='${email}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error during retrieval:", err);
      return next(new ErrorHandler("Error during retrieval", 500));
    }
    res.status(200).json({ success: true, emailuser: result[0] });
  });
});
exports.updateUser = asyncHandler(async (req, res, next) => {
  const updatedFields = req.body;
  const { id } = req.params;
  const updateFieldsString = Object.keys(updatedFields)
    .map((key) => `${key}="${updatedFields[key]}"`)
    .join(", ");

  const sql = `UPDATE users SET ${updateFieldsString} WHERE id = ${Number(
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
      next(new ErrorHandler("User not found or no changes applied", 404));
    }
  });
});

exports.sendReward = asyncHandler(async (req, res, next) => {
  const { userId, title, amount } = req.body;

  try {
    // Check if a reward notification already exists for the user
    const checksql = "SELECT * FROM rewardnoti WHERE userId = ?";
    const [existingReward] = await db.promise().query(checksql, [userId]);

    if (existingReward.length > 0) {
      // If a reward notification exists, update it
      const updateSql = "UPDATE rewardnoti SET title = ?, amount = ? WHERE userId = ?";
      await db.promise().query(updateSql, [title, amount, userId]);
      return res.status(200).json({ success: true, message: "Notification updated successfully" });
    } else {
      // If no notification exists, insert a new one
      const insertSql = "INSERT INTO rewardnoti (userId, title, amount) VALUES (?, ?, ?)";
      await db.promise().query(insertSql, [userId, title, amount]);
      return res.status(200).json({ success: true, message: "Notification created successfully" });
    }

  } catch (err) {
    console.error("Database error:", err);
    next(err);
  }
});
exports.getDefaulterReward = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    let sql = `SELECT * FROM rewardnoti where userId=${id}`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error during retrieval:", err);
        return next(new ErrorHandler("Error during retrieval", 500));
      }
      res.status(200).json({ success: true, userrewardnotification: result[0] });
    });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorHandler("user number (ID) is required", 400));
  }

  const sql = `DELETE FROM users WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error during deletion:", err);
      return next(new ErrorHandler("Error during deletion", 500));
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Deletion successful" });
    } else {
      return next(
        new ErrorHandler("USer not found or no changes applied", 404)
      );
    }
  });
});

exports.getrewardList = catchAsyncErrors(async (request, response, next) => {
  console.log("chekkkk");
  let sql = `SELECT reward,reward_level,email,username FROM users where reward_level > 0 ;`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching users:", err);
      return next(new ErrorHandler("Error fetching users!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ allrewards: result });
    } else {
      return response.status(200).json({ allrewards: [] });
    }
  });
});
