const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
const asyncHandler = require("express-async-handler");
const fetchSetRoiFromAdminSettings = require("../utils/settings");
dotenv.config({ path: "backend/config/config.env" });

exports.getListOfWithdrawalRequest = catchAsyncErrors(
  async (request, response, next) => {
    let sql = `SELECT withdrawal_request.*, users.email,users.bep20, users.trc20 FROM withdrawal_request LEFT JOIN users ON withdrawal_request.user_id = users.id;`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching withdrawal_request:", err);
        return next(
          new ErrorHandler("Error fetching withdrawal_request!", 500)
        );
      }
      if (result.length > 0) {
        return response.status(200).json({ allwithdrawal: result });
      } else {
        return response.status(200).json({ allwithdrawal: [] });
      }
    });
  }
);
exports.getListOfWithdrawalRequestById = catchAsyncErrors(
  async (request, response, next) => {
    const { user_id } = request.params;

    let sql = `SELECT withdrawal_request.*, users.email,users.email,users.bep20, users.trc20
    FROM withdrawal_request
    LEFT JOIN users ON withdrawal_request.user_id = users.id where user_id = '${user_id}'`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching withdrawal_request:", err);
        return next(
          new ErrorHandler("Error fetching withdrawal_request!", 500)
        );
      }
      if (result.length > 0) {
        return response.status(200).json({ singleWithdrawal: result });
      } else {
        return response.status(200).json({ singleWithdrawal: [] });
      }
    });
  }
);

exports.updateWithdrawalRequest = asyncHandler(async (req, res, next) => {
  const { status, amount, user_id, type } = req.body;
  const { id } = req.params;

  const updateWithdrawalSql = `UPDATE withdrawal_request SET status = ?, acceptat = NOW() WHERE id = ?`;
  db.query(updateWithdrawalSql, [status, id], (err, depositeResult) => {
    if (err) {
      console.error("Error updating user_deposite:", err);
      return next(new ErrorHandler("Error updating user_deposite", 500));
    }

    // Check if update was successful
    if (depositeResult.affectedRows === 0) {
      return next(
        new ErrorHandler("No user_deposite found or no changes applied", 404)
      );
    }

    // If status is 'complete', update the users table business column
    if (status === "decline") {
      const updateBusinessSql = `UPDATE users SET working = working + ? WHERE id = ?`;
      db.query(updateBusinessSql, [amount, user_id], (err, userResult) => {
        if (err) {
          console.error("Error updating user's business balance:", err);
          return next(
            new ErrorHandler("Error updating user's business balance", 500)
          );
        }

        // Check if update was successful
        if (userResult.affectedRows === 0) {
          return next(
            new ErrorHandler(
              "No user found or no changes applied to business balance",
              404
            )
          );
        }

        // Respond with success message
        res.status(200).json({ success: true, message: "Update successful" });
      });
    } else {
      // If status is not 'complete', respond with success message for deposite update
      res.status(200).json({
        success: true,
        message: "Update successful for withdrawal_request",
      });
    }
  });
});

exports.deleteWithdrawalRequest = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(
      new ErrorHandler("withdrawal_request number (ID) is required", 400)
    );
  }

  const sql = `DELETE FROM withdrawal_request WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error during deletion:", err);
      return next(new ErrorHandler("Error during deletion", 500));
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Deletion successful" });
    } else {
      return next(
        new ErrorHandler(
          "withdrawal_request not found or no changes applied",
          404
        )
      );
    }
  });
});


exports.addWithdrawalRequest = catchAsyncErrors(
  async (request, response, next) => {
    const { user_id, amount } = request.body;

    if (amount < 35) {
      return response
        .status(400)
        .json({ message: "Amount less than 35 is not allowed" });
    }
    const { setwithdrawal } = await fetchSetRoiFromAdminSettings();

    if (setwithdrawal !== 1) {
      return response.status(404).json({ message: "UseAdmin not allowed widthrwal" });
    }
    const checkBalanceSql = `SELECT working FROM users WHERE id = ?`;
    db.query(checkBalanceSql, [user_id], (err, results) => {
      if (err) {
        console.error("Error during balance check:", err);
        return next(new ErrorHandler("Error during balance check!", 500));
      }

      if (results.length === 0) {
        return response.status(404).json({ message: "User not found" });
      }

      const { working } = results[0];
      console.log(working);
      if (working < amount) {
        return response
          .status(400)
          .json({ message: "Insufficient funds in working balance" });
      }

      // Deduct the amount from non_working
      let remainingAmount = amount;
      let deductionAmount = amount * 0.10; // 10% admin charge
      let amountAfterDeduction = remainingAmount - deductionAmount;

      // Update the non_working balance
      const updatedNonWorkingBalance = working - amount;

      console.log("deduct amount", deductionAmount);
      console.log(" amount after deduct", amountAfterDeduction);
      console.log("updated working balence", updatedNonWorkingBalance);

      // Update the user's non_working balance in the database
      const updateUserSql = `
      UPDATE users 
      SET working = ? 
      WHERE id = ?
    `;

      db.query(
        updateUserSql,
        [updatedNonWorkingBalance, user_id],
        (err, updateResult) => {
          if (err) {
            console.error("Error updating working balance:", err);
            return next(
              new ErrorHandler("Error updating working balance", 500)
            );
          }

          const insertWithdrawalSql = `
          INSERT INTO withdrawal_request (user_id, amount, type, deduction) 
          VALUES (?, ?, 'working', ?)
        `;
          db.query(
            insertWithdrawalSql,
            [user_id, amountAfterDeduction, deductionAmount],
            (err, result) => {
              if (err) {
                console.error("Error during withdrawal_request creation:", err);
                return next(
                  new ErrorHandler(
                    "Error during withdrawal_request creation!",
                    500
                  )
                );
              }

              if (result.affectedRows > 0) {
                response.status(200).json({
                  success: true,
                  message: `Withdrawal request sent successfully. Admin charge of ${deductionAmount} deducted.`,
                });
              } else {
                response
                  .status(400)
                  .json({ error: "Withdrawal request could not be sent" });
              }
            }
          );
        }
      );
    });
  }
);

exports.addROIWithdrawalRequest = catchAsyncErrors(
  async (request, response, next) => {
    try {
      const { user_id, amount } = request.body;
      const { setwithdrawal } = await fetchSetRoiFromAdminSettings();

      if (setwithdrawal !== 1) {
        return response
          .status(404)
          .json({ message: "UseAdmin not allowed ROI" });
      }

      let deductionAmount = amount * 0.05;
      let amountAfterDeduction = amount - deductionAmount;

      const insertSql = `INSERT INTO withdrawal_request (user_id, amount, type , deduction) VALUES (?, ?, ?,?)`;

      db.query(
        insertSql,
        [user_id, amountAfterDeduction, "ROI", deductionAmount],
        (err, result) => {
          if (err) {
            console.error("Error during withdrawal_request insertion:", err);
            return next(
              new ErrorHandler("Error during withdrawal_request creation!", 500)
            );
          }

          if (result.affectedRows > 0) {
            const updateSql = `UPDATE users SET non_working = non_working - ? WHERE id = ?`;
            db.query(updateSql, [amount, user_id], (err, result) => {
              if (err) {
                console.error("Error during updating compound to 0:", err);
                return next(
                  new ErrorHandler(
                    "Error during withdrawal_request creation!",
                    500
                  )
                );
              }

              if (result.affectedRows > 0) {
                response.status(200).json({
                  success: true,
                  message: `Withdrawal request sent successfully`,
                });
              } else {
                console.error("Failed to update user's compound to 0");
                response
                  .status(400)
                  .json({ error: "Withdrawal request could not be sent" });
              }
            });
          } else {
            console.error("Failed to insert into withdrawal_request");
            response
              .status(400)
              .json({ error: "Withdrawal request could not be sent" });
          }
        }
      );
    } catch (error) {
      console.error("Unexpected error in withdrawalCompound:", error);
      next(error);
    }
  }
);

exports.processPrincipleWithdrawalRequest = catchAsyncErrors(
  async (request, response, next) => {
    try {
      const { user_id, amount } = request.body;

      // Check if withdrawals are allowed by admin settings
      const { setwithdrawal } = await fetchSetRoiFromAdminSettings();

      if (setwithdrawal !== 1) {
        return response
          .status(403)
          .json({
            success: false,
            message: "Withdrawals are not allowed by admin",
          });
      }

      const userInvestmentQuery = `
        SELECT activation_date FROM users 
        WHERE id = ? 
        ORDER BY activation_date ASC 
        LIMIT 1
      `;

      const investmentDate = await new Promise((resolve, reject) => {
        db.query(userInvestmentQuery, [user_id], (err, results) => {
          if (err) return reject(err);
          if (results.length === 0) return resolve(null);
          resolve(results[0].activation_date);
        });
      });

      if (!investmentDate) {
        return response.status(404).json({
          success: false,
          message: "No investment found for this user",
        });
      }

      // Calculate months since investment
      const currentDate = new Date();
      const investmentDateTime = new Date(investmentDate);

      // Calculate days difference between dates
      const daysDifference = Math.floor(
        (currentDate - investmentDateTime) / (1000 * 60 * 60 * 24)
      );

      // Calculate deduction percentage based on days
      let deductionPercentage;
      if (daysDifference <= 10) {
        deductionPercentage = 0.2; // 20% for first 30 days
      } else if (daysDifference <= 20) {
        deductionPercentage = 0.1; // 10% for 31-60 days
      } else {
        deductionPercentage = 0.0; // 5% for 61+ days
      }

      // Calculate deduction amount
      const deductionAmount = amount * deductionPercentage;

      // Calculate final amount after deduction
      const amountAfterDeduction = amount - deductionAmount;

      // Insert withdrawal request into database
      const insertSql = `INSERT INTO withdrawal_request (user_id, amount, type, deduction) VALUES (?, ?, ?, ?)`;

      db.query(
        insertSql,
        [user_id, amountAfterDeduction, "principle", deductionAmount],
        (err, result) => {
          if (err) {
            console.error("Error during withdrawal_request insertion:", err);
            return next(
              new ErrorHandler("Error during withdrawal_request creation!", 500)
            );
          }

          if (result.affectedRows > 0) {
            return response.status(200).json({
              success: true,
              message: "Withdrawal request sent successfully",
              deductionPercentage: deductionPercentage * 100 + "%",
              monthsSinceInvestment: monthsDifference,
            });
          } else {
            console.error("Failed to insert into withdrawal_request");
            return response
              .status(400)
              .json({
                success: false,
                message: "Withdrawal request could not be sent",
              });
          }
        }
      );
    } catch (error) {
      console.error(
        "Unexpected error in processPrincipleWithdrawalRequest:",
        error
      );
      return next(error);
    }
  }
);

exports.autoTransferToActive = catchAsyncErrors(
  async (request, response, next) => {
    try {
      const { id } = request.params;

      // First, get the user data to access working and no_working values
      db.query("SELECT * FROM users WHERE id = ?", [id], (err, userData) => {
        if (err) {
          console.error("Error fetching user data:", err);
          return next(new ErrorHandler("Error fetching user data!", 500));
        }

        if (!userData || userData.length === 0) {
          return response.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        const user = userData[0];
        const user_id = user.id;

        // Calculate new business value
        const newBusinessValue = (user.working || 0) + (user.no_working || 0);

        if (newBusinessValue > 0) {
          db.query(
            "UPDATE users SET business = business + ?, working = 0, non_working = 0 WHERE id = ?",
            [newBusinessValue, id],
            (updateErr, updateResult) => {
              if (updateErr) {
                console.error("Error updating user business:", updateErr);
                return next(
                  new ErrorHandler("Error updating user business!", 500)
                );
              }

              // Insert into transactions table
              const now = new Date();
              const insertTransactionSql = `
                  INSERT INTO transactions 
                  (user_id, amount, transaction_type, source, status, created_at, updated_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

              db.query(
                insertTransactionSql,
                [
                  user_id,
                  newBusinessValue,
                  "transfer",
                  "working_to_business",
                  "completed",
                  now,
                  now,
                ],
                (transErr, transResult) => {
                  if (transErr) {
                    console.error(
                      "Error during transaction insertion:",
                      transErr
                    );
                    return next(
                      new ErrorHandler(
                        "Error during transaction creation!",
                        500
                      )
                    );
                  }

                  if (transResult.affectedRows > 0) {
                    return response.status(200).json({
                      success: true,
                      message:
                        "Working balance transferred to business successfully",
                      transferredAmount: newBusinessValue,
                      updatedBusiness: user.business + newBusinessValue,
                      transaction_id: transResult.insertId,
                    });
                  } else {
                    console.error("Failed to insert transaction");
                    return response
                      .status(400)
                      .json({
                        success: false,
                        message: "Transfer could not be completed",
                      });
                  }
                }
              );
            }
          );
        } else {
          return response.status(200).json({
            success: true,
            message: "No balance to update",
          });
        }
        // Update user's business column and reset working/no_working columns
      });
    } catch (error) {
      console.error("Unexpected error in autoTransferToActive:", error);
      return next(error);
    }
  }
);

exports.updateROIWithdrawalRequest = asyncHandler(async (req, res, next) => {
  const { status, amount, user_id, type } = req.body;
  const { id } = req.params;

  const updateWithdrawalSql = `UPDATE withdrawal_request SET status = ?, acceptat = NOW() WHERE id = ?`;
  db.query(updateWithdrawalSql, [status, id], (err, depositeResult) => {
    if (err) {
      console.error("Error updating user_deposite:", err);
      return next(new ErrorHandler("Error updating user_deposite", 500));
    }

    // Check if update was successful
    if (depositeResult.affectedRows === 0) {
      return next(
        new ErrorHandler("No user_deposite found or no changes applied", 404)
      );
    }

    // If status is 'complete', update the users table business column
    if (status === "decline") {
      const updateBusinessSql = `UPDATE users SET working = working + ? WHERE id = ?`;
      db.query(updateBusinessSql, [amount, user_id], (err, userResult) => {
        if (err) {
          console.error("Error updating user's business balance:", err);
          return next(
            new ErrorHandler("Error updating user's business balance", 500)
          );
        }

        // Check if update was successful
        if (userResult.affectedRows === 0) {
          return next(
            new ErrorHandler(
              "No user found or no changes applied to business balance",
              404
            )
          );
        }

        // Respond with success message
        res.status(200).json({ success: true, message: "Update successful" });
      });
    } else {
      // If status is not 'complete', respond with success message for deposite update
      res.status(200).json({
        success: true,
        message: "Update successful for withdrawal_request",
      });
    }
  });
});

exports.updatePrincipleWithdrawalRequest = asyncHandler(
  async (req, res, next) => {
    const { status, amount, user_id, type } = req.body;
    const { id } = req.params;

    const updateWithdrawalSql = `UPDATE withdrawal_request SET status = ?, acceptat = NOW() WHERE id = ?`;
    db.query(updateWithdrawalSql, [status, id], (err, withdrawalResult) => {
      if (err) {
        console.error("Error updating withdrawal_request:", err);
        return next(new ErrorHandler("Error updating withdrawal request", 500));
      }

      if (withdrawalResult.affectedRows === 0) {
        return next(
          new ErrorHandler(
            "No withdrawal request found or no changes applied",
            404
          )
        );
      }

      // If withdrawal is completed, reset user plan data
      if (status === "complete") {
        const updateUserSql = `
        UPDATE users 
        SET 
          plan_id = 0,
          compound_income = 0,
          active_plan = 0,
          roi_day = 0,
          roi_status = 'close',
          level_status = 'close',
          new_plan = 0
        WHERE id = ?
      `;

        db.query(updateUserSql, [user_id], (err, userResult) => {
          if (err) {
            console.error("Error updating user's plan info:", err);
            return next(
              new ErrorHandler("Error updating user's plan info", 500)
            );
          }

          if (userResult.affectedRows === 0) {
            return next(
              new ErrorHandler("User not found or update failed", 404)
            );
          }

          return res.status(200).json({
            success: true,
            message: "Withdrawal completed and user updated successfully",
          });
        });
      } else {
        // Just updated the withdrawal status
        return res.status(200).json({
          success: true,
          message: "Withdrawal status updated successfully",
        });
      }
    });
  }
);

exports.debitAmount = asyncHandler(async (req, res, next) => {
  const { id, amount, action, wallet_type } = req.body.updatedData;
  if (!id || !amount || !action) {
    return res.status(400).json({
      success: false,
      error: `Fields required`,
    });
  }
  if (action === "debit" && wallet_type === "business") {
    const checkBalanceSql = `SELECT business FROM users WHERE id = ?`;
    db.query(checkBalanceSql, [id], (err, results) => {
      if (err) {
        console.error("Error during balance check:", err);
        return next(new ErrorHandler("Error during balance check!", 500));
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const { business } = results[0];

      let remainingAmount = amount;
      let updatedBusiness = business;

      if (remainingAmount > 0 && updatedBusiness > 0) {
        const deduction = Math.min(remainingAmount, updatedBusiness);
        updatedBusiness -= deduction;
        remainingAmount -= deduction;
      }

      // Fix: Remove trailing comma after business value
      const updateUserSql = `
        UPDATE users 
        SET business = ?
        WHERE id = ?
      `;

      db.query(updateUserSql, [updatedBusiness, id], (err, updateResult) => {
        if (err) {
          console.error("Error updating user balance columns:", err);
          return next(
            new ErrorHandler("Error updating user balance columns", 500)
          );
        }

        // Record the transaction
        const transactionSql = `
            INSERT INTO withdrawal_request (user_id, amount, type, status, acceptat) 
            VALUES (?, ?, 'business', 'TRN-ADM002', NOW())
          `;

        db.query(transactionSql, [id, amount], (err, result) => {
          if (err) {
            console.error("Error during transaction update:", err);
            return next(
              new ErrorHandler("Error during transaction update", 500)
            );
          }

          if (result.affectedRows > 0) {
            res.status(200).json({
              success: true,
              message: `${action} successful`,
            });
          } else {
            next(
              new ErrorHandler(`${action} not found or no changes applied`, 404)
            );
          }
        });
      });
    });
  } else if (action === "debit" && wallet_type === "working") {
    let deductionAmount = amount * 0.05;
    let amountAfterDeduction = amount - deductionAmount;

    const insertSql = `INSERT INTO withdrawal_request (user_id, amount, type, deduction, status, acceptat) VALUES (?, ?, ?, ?, 'TRN-ADM002', NOW())`;

    db.query(
      insertSql,
      [id, amountAfterDeduction, "ROI", deductionAmount],
      (err, result) => {
        if (err) {
          console.error("Error during withdrawal_request insertion:", err);
          return next(
            new ErrorHandler("Error during withdrawal_request creation!", 500)
          );
        }

        if (result.affectedRows > 0) {
          const updateSql = `UPDATE users SET roi_income = roi_income - ?, working = working - ?,  compound_income = compound_income - ? WHERE id = ?`;
          db.query(updateSql, [amount, amount, amount, id], (err, result) => {
            if (err) {
              console.error("Error during updating ROI income:", err);
              return next(
                new ErrorHandler(
                  "Error during withdrawal_request creation!",
                  500
                )
              );
            }

            if (result.affectedRows > 0) {
              res.status(200).json({
                success: true,
                message: `Withdrawal sent successfully`,
              });
            } else {
              console.error("Failed to update user's ROI income");
              res.status(400).json({ error: "Withdrawal could not be sent" });
            }
          });
        } else {
          console.error("Failed to insert into withdrawal_request");
          res.status(400).json({ error: "Withdrawal could not be sent" });
        }
      }
    );
  } else if (action === "debit" && wallet_type === "profit") {
    let deductionAmount = amount * 0.05;
    let amountAfterDeduction = amount - deductionAmount;

    // Step 1: Fetch current income components
    const getUserIncomeSql = `
      SELECT level_month, direct_income, salary, reward 
      FROM users
      WHERE id = ?
    `;

    db.query(getUserIncomeSql, [id], (err, userResults) => {
      if (err || userResults.length === 0) {
        console.error("Error fetching user income details:", err);
        return next(new ErrorHandler("User income fetch error", 500));
      }

      const user = userResults[0];
      let remainingAmount = amount;

      let updateStatements = [];
      let updateParams = [];

      // Deduct from level_month
      if (user.level_month >= remainingAmount) {
        updateStatements.push("level_month = level_month - ?");
        updateParams.push(remainingAmount);
        remainingAmount = 0;
      } else {
        updateStatements.push("level_month = 0");
        updateParams.push(user.level_month);
        remainingAmount -= user.level_month;
      }

      // Deduct from direct_income
      if (remainingAmount > 0) {
        if (user.direct_income >= remainingAmount) {
          updateStatements.push("direct_income = direct_income - ?");
          updateParams.push(remainingAmount);
          remainingAmount = 0;
        } else {
          updateStatements.push("direct_income = 0");
          updateParams.push(user.direct_income);
          remainingAmount -= user.direct_income;
        }
      }

      // Deduct from salary
      if (remainingAmount > 0) {
        if (user.salary >= remainingAmount) {
          updateStatements.push("salary = salary - ?");
          updateParams.push(remainingAmount);
          remainingAmount = 0;
        } else {
          updateStatements.push("salary = 0");
          updateParams.push(user.salary);
          remainingAmount -= user.salary;
        }
      }

      // Deduct from reward
      if (remainingAmount > 0) {
        if (user.reward >= remainingAmount) {
          updateStatements.push("reward = reward - ?");
          updateParams.push(remainingAmount);
          remainingAmount = 0;
        } else {
          return next(
            new ErrorHandler("Insufficient balance in profit sources", 400)
          );
        }
      }

      // Step 2: Insert withdrawal request
      const insertSql = `
        INSERT INTO withdrawal_request 
        (user_id, amount, type, deduction, status, acceptat)
        VALUES (?, ?, ?, ?, 'TRN-ADM002', NOW())
      `;

      db.query(
        insertSql,
        [id, amountAfterDeduction, "Profit", deductionAmount],
        (err, result) => {
          if (err) {
            console.error("Error during withdrawal_request insertion:", err);
            return next(
              new ErrorHandler("Error during withdrawal_request creation!", 500)
            );
          }

          if (result.affectedRows > 0) {
            // Step 3: Update user income columns
            const updateSql = `
              UPDATE users
              SET ${updateStatements.join(", ")}
              WHERE id = ?
            `;

            db.query(updateSql, [...updateParams, id], (err, result) => {
              if (err) {
                console.error("Error updating user's income components:", err);
                return next(
                  new ErrorHandler("Error during income deduction!", 500)
                );
              }

              return res.status(200).json({
                success: true,
                message: "Withdrawal sent and income updated successfully",
              });
            });
          } else {
            return res
              .status(400)
              .json({ error: "Failed to insert withdrawal request" });
          }
        }
      );
    });
  } else {
    const sql = `UPDATE users SET business = business + ? WHERE id = ?`;
    const transactionSql = `INSERT INTO user_deposite (user_id, amount, status, acceptat) VALUES (?, ?, 'TRN-ADM002', NOW())`;

    db.query(sql, [amount, id], (err, result) => {
      if (err) {
        console.error("Error during update:", err);
        return next(new ErrorHandler("Error during update", 500));
      }

      if (result?.affectedRows > 0) {
        db.query(transactionSql, [id, amount], (err, result) => {
          if (err) {
            console.error("Error during transaction update:", err);
            return next(
              new ErrorHandler("Error during transaction update", 500)
            );
          }

          if (result?.affectedRows > 0) {
            res
              .status(200)
              .json({ success: true, message: `${action} successful` });
          } else {
            next(
              new ErrorHandler(`${action} not found or no changes applied`, 404)
            );
          }
        });
      } else {
        next(
          new ErrorHandler(`${action} not found or no changes applied`, 404)
        );
      }
    });
  }
});
