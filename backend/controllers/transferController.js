const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
const asyncHandler = require("express-async-handler");
const fetchSetRoiFromAdminSettings = require("../utils/settings");
dotenv.config({ path: "backend/config/config.env" });


exports.transfertouser = catchAsyncErrors(async (request, response, next) => {
    const { user_id, userto_id, amount, desc } = request.body.values;
    const checkBalanceSql = `SELECT business FROM users WHERE id = ?`;
    db.query(checkBalanceSql, [user_id], (err, result) => {
      if (err) {
        console.error("Error checking user balance:", err);
        return next(new ErrorHandler("Error during balance check!", 500));
      }
  
      if (result.length === 0) {
        return response.status(400).json({ message: "User not found" });
      }
  
      const currentBalance = result[0].business;
  
      if (currentBalance < amount) {
        return response.status(400).json({ success: false, message: "Insufficient balance" });
      }
  
      const deductBalanceSql = `UPDATE users SET business = business - ? WHERE id = ?`;
      db.query(deductBalanceSql, [amount, user_id], (err, result) => {
        if (err) {
          console.error("Error during balance deduction:", err);
          return next(new ErrorHandler("Error during entry activation!", 500));
        }
  
        if (result.affectedRows > 0) {
          const addBalanceSql = `UPDATE users SET business = business + ? WHERE id = ?`;
          db.query(addBalanceSql, [amount, userto_id], (err, result) => {
            if (err) {
              console.error("Error during balance addition:", err);
              return next(new ErrorHandler("Error during entry activation!", 500));
            }
  
            if (result.affectedRows > 0) {
              const insertTransferSql = `INSERT INTO transfer (userby_id, userto_id, amount, description) VALUES (?, ?, ?, ?)`;
              db.query(insertTransferSql, [user_id, userto_id, amount, desc], (err, result) => {
                if (err) {
                  console.error("Error logging transaction:", err);
                  return next(new ErrorHandler("Error during entry activation!", 500));
                }
  
                if (result.affectedRows > 0) {
                  response.status(200).json({ success: true, message: "Amount transferred successfully" });
                } else {
                  return response.status(400).json({ success: false, message: "Transfer could not be logged" });
                }
              });
            } else {
              return response.status(400).json({ success: false, message: "Entry could not be activated" });
            }
          });
        } else {
          return response.status(400).json({ success: false, message: "Entry could not be activated" });
        }
      });
    });
  });
  

  exports.getTransfer = catchAsyncErrors(async (request, response, next) => {
      let sql = `
      SELECT transfer.*, users.email 
      FROM transfer
      LEFT JOIN users ON transfer.userto_id = users.id;
    `;
      db.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching Deposite:", err);
        return next(new ErrorHandler("Error fetching Deposite!", 500));
      }
      if (result.length > 0) {
        return response.status(200).json({ alltransfer: result });
      } else {
        return response.status(200).json({ alltransfer: [] });
      }
    });
  });
  
  exports.getTransferById = catchAsyncErrors(async (request, response, next) => {
    const user_id = request.params.user_id;
    // Validate table_name if it comes from the request to avoid potential security risks
    // SQL query with parameterized values
    let sql = `SELECT transfer.*, users.email 
        FROM transfer 
        LEFT JOIN users ON transfer.userto_id = users.id 
        WHERE transfer.userby_id = ?`;
    db.query(sql, [user_id], (err, result) => {
      if (err) {
        console.error("Error fetching transaction:", err);
        return next(new ErrorHandler("Error fetching transaction!", 500));
      }
      if (result.length > 0) {
        return response.status(200).json({ transfer: result });
      } else {
        return response.status(200).json({ transfer: [] });
      }
    });
  });
  

  exports.transfertoFriend = catchAsyncErrors(async (request, response, next) => {
    const { userby_id, plan_id, amount, userto_id, desc } = request.body.values;

    if (userby_id==userto_id) {
      return response.status(400).json({ success: false, message: "Visit Membership Plan to topup self account" });
    }
    if(amount){
      const checkBalanceSql = `SELECT business FROM users WHERE id = ?`;
      db.query(checkBalanceSql, [userby_id], (err, result) => {
        if (err) {
          console.error("Error checking user balance:", err);
          return next(new ErrorHandler("Error during balance check!", 500));
        }
    
        if (result.length === 0) {
          return response.status(400).json({ message: "User not found" });
        }
    
        const currentBalance = result[0].business;
    
        if (currentBalance < amount) {
          return response.status(400).json({ success: false, message: "Insufficient balance" });
        }
    
        const deductBalanceSql = `UPDATE users SET business = business - ? WHERE id = ?`;
        db.query(deductBalanceSql, [amount, userby_id], (err, result) => {
          if (err) {
            console.error("Error during balance deduction:", err);
            return next(new ErrorHandler("Error during entry activation!", 500));
          }
    
          if (result.affectedRows > 0) {
            const addBalanceSql = `UPDATE users SET active_plan = active_plan + ?,plan_id=? WHERE id = ?`;
            db.query(addBalanceSql, [amount, plan_id,userto_id], (err, result) => {
              if (err) {
                console.error("Error during balance addition:", err);
                return next(new ErrorHandler("Error during entry activation!", 500));
              }
    
              if (result.affectedRows > 0) {
                const insertTransferSql = `INSERT INTO transfer (userby_id, userto_id, amount, description) VALUES (?, ?, ?, ?)`;
                db.query(insertTransferSql, [userby_id, userto_id, amount, desc], (err, result) => {
                  if (err) {
                    console.error("Error logging transaction:", err);
                    return next(new ErrorHandler("Error during entry activation!", 500));
                  }
    
                  if (result.affectedRows > 0) {
                    response.status(200).json({ success: true, message: "Amount transferred successfully" });
                  } else {
                    return response.status(400).json({ success: false, message: "Transfer could not be logged" });
                  }
                });
              } else {
                return response.status(400).json({ success: false, message: "Entry could not be activated" });
              }
            });
          } else {
            return response.status(400).json({ success: false, message: "Entry could not be activated" });
          }
        });
      });
    }
    
    else{
      const checkBalanceSql = `SELECT business FROM users WHERE id = ?`;
      db.query(checkBalanceSql, [userby_id], (err, result) => {
        if (err) {
          console.error("Error checking user balance:", err);
          return next(new ErrorHandler("Error during balance check!", 500));
        }
    
        if (result.length === 0) {
          return response.status(400).json({ message: "User not found" });
        }
    
        const currentBalance = result[0].business;
    
        if (currentBalance < 25) {
          return response.status(400).json({ success: false, message: "Insufficient balance" });
        }
    
        const deductBalanceSql = `UPDATE users SET business = business - 25 WHERE id = ?`;
        db.query(deductBalanceSql, [ userby_id], (err, result) => {
          if (err) {
            console.error("Error during balance deduction:", err);
            return next(new ErrorHandler("Error during entry activation!", 500));
          }
    
          if (result.affectedRows > 0) {

            const addBalanceSql = `UPDATE users SET entry_fees = 25,is_active="active" WHERE id = ?`;
            db.query(addBalanceSql, [userto_id], (err, result) => {
              if (err) {
                console.error("Error during balance addition:", err);
                return next(new ErrorHandler("Error during entry activation!", 500));
              }
    
              if (result.affectedRows > 0) {
                const insertTransferSql = `INSERT INTO transfer (userby_id, userto_id, amount, description) VALUES (?, ?, ?, ?)`;
                db.query(insertTransferSql, [userby_id, userto_id, 25, desc], (err, result) => {
                  if (err) {
                    console.error("Error logging transaction:", err);
                    return next(new ErrorHandler("Error during entry activation!", 500));
                  }
    
                  if (result.affectedRows > 0) {
                    response.status(200).json({ success: true, message: "Amount transferred successfully" });
                  } else {
                    return response.status(400).json({ success: false, message: "Transfer could not be logged" });
                  }
                });
              } else {
                return response.status(400).json({ success: false, message: "Entry could not be activated" });
              }
            });
          } else {
            return response.status(400).json({ success: false, message: "Entry could not be activated" });
          }
        });
      });
    }
  });
  