const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
const asyncHandler = require("express-async-handler");
const fetchSetRoiFromAdminSettings = require("../utils/settings");

dotenv.config({ path: "backend/config/config.env" });

exports.getSettings = catchAsyncErrors(async (request, response, next) => {
  let sql = `SELECT * FROM adminsettings`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching support:", err);
      return next(new ErrorHandler("Error fetching support!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ settings: result[0] });
    } else {
      return response.status(200).json({ settings: [] });
    }
  });
});

exports.updateSettings = asyncHandler(async (req, res, next) => {
  const {level,direct,reward,register,login,withdrawal,deposite,roi,support,topup} = req.body;

  try {
    const query = `
      UPDATE adminsettings SET setlevel = ?,setdirect = ?,setreward = ?,setregister = ?,setlogin = ?,setwithdrawal = ?,setdeposite = ?,setroi = ?,setsupport = ? ,settopup = ?`;

    db.query(
      query,
      [level ? 1 : 0,direct ? 1 : 0,reward ? 1 : 0,register ? 1 : 0,login ? 1 : 0,withdrawal ? 1 : 0,deposite ? 1 : 0,roi ? 1 : 0,support ? 1 : 0,topup ? 1 : 0 ],
      (err, result) => {
        if (err) {
          console.error("Error during update:", err);
          return next(new ErrorHandler("Error during update", 500));
        }

        if (result.affectedRows > 0) {
          res.status(200).json({ success: true, message: "Update successful" });
        } else {
          return next(new ErrorHandler("Settings not found or no changes applied", 404));
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating settings',
    });
  }
});