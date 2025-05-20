const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
const asyncHandler = require("express-async-handler");
const fetchSetRoiFromAdminSettings = require("../utils/settings");
dotenv.config({ path: "backend/config/config.env" });

exports.getListOfTopup = catchAsyncErrors(async (request, response, next) => {
  let sql = `SELECT 
    t.*,
    u1.email AS userby_email,
    u2.email AS userto_email
FROM 
    topup t
LEFT JOIN 
    users u1 ON t.userby_id = u1.id
LEFT JOIN 
    users u2 ON t.userto_id = u2.id;
`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching Topup:", err);
      return next(new ErrorHandler("Error fetching Topup!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ alltopup: result });
    } else {
      return response.status(200).json({ alltopup: [] });
    }
  });
});
exports.getListOfTopupById = catchAsyncErrors(
  async (request, response, next) => {
    const { user_id } = request.params;
    let sql = `SELECT 
    t.*,
    u2.email AS userto_email
FROM 
    topup t
LEFT JOIN 
    users u2 ON t.userto_id = u2.id where userby_id = '${user_id}'
`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching Topup:", err);
        return next(new ErrorHandler("Error fetching Topup!", 500));
      }
      if (result.length > 0) {
        return response.status(200).json({ singletopup: result });
      } else {
        return response.status(200).json({ singletopup: [] });
      }
    });
  }
);

exports.updateTopup = asyncHandler(async (req, res, next) => {
  const updatedFields = req.body;
  const { id } = req.params;
  const updateFieldsString = Object.keys(updatedFields)
    .map((key) => `${key}="${updatedFields[key]}"`)
    .join(", ");

  const sql = `UPDATE topup SET ${updateFieldsString} WHERE id = ${Number(
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
      next(new ErrorHandler("topup not found or no changes applied", 404));
    }
  });
});

exports.deleteTopup = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorHandler("Topup number (ID) is required", 400));
  }
  const sql = `DELETE FROM topup WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error during deletion:", err);
      return next(new ErrorHandler("Error during deletion", 500));
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Deletion successful" });
    } else {
      return next(
        new ErrorHandler("topup not found or no changes applied", 404)
      );
    }
  });
});

// exports.addTopup = catchAsyncErrors(async (request, response, next) => {
//   let { id, investment_amount, amount, userby_id, userto_id } = request.body;

//   const { settopup } = await fetchSetRoiFromAdminSettings();
//   if (settopup !== 1) {
//     return response.status(404).json({ message: "UseAdmin not allowed ROI" });
//   }
//   if (investment_amount) {
//     const checkBalanceSql = `SELECT active_plan,business FROM users WHERE id = ?`;
//     db.query(checkBalanceSql, [userby_id], (err, userResults) => {
//       if (err || userResults.length === 0) {
//         return response
//           .status(404)
//           .json({ message: "User not found or error occurred" });
//       }
//       const { active_plan, business } = userResults[0];
//       if (amount == active_plan) {
//         return response.status(400).json({ message: "Buy bigger plan" });
//       }
//       if (investment_amount > business || investment_amount < 0) {
//         return response
//           .status(400)
//           .json({ message: `Your balance is less (${business})` });
//       }

//       const updateUserbySql = `UPDATE users SET business = business - ? WHERE id = ?`;
//       db.query(
//         updateUserbySql,
//         [investment_amount, userby_id],
//         (err, result) => {
//           if (err || result.affectedRows === 0) {
//             return response
//               .status(400)
//               .json({ error: "Failed to update user balance" });
//           }

//           const updateUsertoSql = `UPDATE users SET business = business + ? WHERE id = ?`;
//           db.query(
//             updateUsertoSql,
//             [investment_amount, userto_id],
//             (err, updateResult) => {
//               if (err || updateResult.affectedRows === 0) {
//                 return response
//                   .status(400)
//                   .json({ error: "Failed to update recipient balance" });
//               }

//               const insertTopupSql = `INSERT INTO topup (userby_id, userto_id, amount) VALUES (?, ?, ?)`;
//               db.query(
//                 insertTopupSql,
//                 [userby_id, userto_id, investment_amount],
//                 (err, insertResult) => {
//                   if (err || insertResult.affectedRows === 0) {
//                     return response
//                       .status(400)
//                       .json({ error: "Failed to insert top-up details" });
//                   }
//                   response
//                     .status(200)
//                     .json({ message: "Top-up request sent successfully" });
//                 }
//               );
//             }
//           );
//         }
//       );
//     });
//   } else {
//     const fetchPlanSql = `SELECT Sponser_bonus FROM plans WHERE id = ?`;
//     db.query(fetchPlanSql, [id], (err, planResults) => {
//       if (err || planResults.length === 0) {
//         return response.status(404).json({ message: "Plan not found" });
//       }
//       const { Sponser_bonus } = planResults[0];
//       const checkBalanceSql = `SELECT active_plan, business FROM users WHERE id = ?`;
//       db.query(checkBalanceSql, [userby_id], (err, userResults) => {
//         if (err || userResults.length === 0) {
//           return response.status(404).json({ message: "User not found" });
//         }

//         const { active_plan, business } = userResults[0];
//         if (amount == active_plan) {
//           return response.status(400).json({ message: "Buy bigger plan" });
//         }
//         if (
//           amount > business ||
//           amount < 0 ||
//           (amount < active_plan && userby_id == userto_id)
//         ) {
//           return response
//             .status(400)
//             .json({ message: "Insufficient balance or smaller plan" });
//         }

//         const updateUserbySql = `UPDATE users SET business = business - ? WHERE id = ?`;
//         db.query(updateUserbySql, [amount, userby_id], async (err, result) => {
//           if (err || result.affectedRows === 0) {
//             return response
//               .status(400)
//               .json({ error: "Top-up request failed" });
//           }

//           const updateUsertoSql = `UPDATE users SET is_active = 'active', status='unblock', level_status='open', roi_status='open', active_plan = ?, compound_income=?, plan_id = ?, activation_date = NOW() WHERE id = ?`;
//           db.query(
//             updateUsertoSql,
//             [amount, amount, id, userto_id],
//             (err, updateResult) => {
//               if (err || updateResult.affectedRows === 0) {
//                 return response
//                   .status(400)
//                   .json({ error: "Failed to update user plan" });
//               }
//               const insertTopupSql = `INSERT INTO topup (userby_id, userto_id, amount) VALUES (?, ?, ?)`;
//               db.query(
//                 insertTopupSql,
//                 [userby_id, userto_id, amount],
//                 (err, insertResult) => {
//                   if (err || insertResult.affectedRows === 0) {
//                     return response
//                       .status(400)
//                       .json({ error: "Failed to insert top-up details" });
//                   }
//                   const checkRefferSql = `SELECT reffer_by FROM users WHERE id = ?`;
//                   db.query(checkRefferSql, [userto_id], (err, userResult) => {
//                     if (err || userResult.length === 0) {
//                       return response
//                         .status(404)
//                         .json({ message: "Referrer not found" });
//                     }
//                     const { reffer_by } = userResult[0];
//                     if (reffer_by) {
//                       distributeDirectIncome(
//                         reffer_by,
//                         amount,
//                         Sponser_bonus,
//                         userto_id,
//                         response
//                       );
//                     } else {
//                       response
//                         .status(200)
//                         .json({ message: "Top-up completed successfully" });
//                     }
//                   });
//                 }
//               );
//             }
//           );
//         });
//       });
//     });
//   }
// });
// function distributeDirectIncome(
//   reffer_by,
//   amount,
//   Sponser_bonus,
//   userto_id,
//   response
// ) {
//   const income = amount * (Sponser_bonus / 100);
//   const fetchUserDetailsSql = `SELECT id FROM users WHERE refferal_code = ? AND is_active = 'active' AND status = 'unblock'`;

//   db.query(fetchUserDetailsSql, [reffer_by], (err, userResult) => {
//     if (err || userResult.length === 0) {
//       return response.status(404).json({ message: "Referrer not eligible" });
//     }

//     const { id: affected_user_id } = userResult[0];
//     const updateDirectIncomeSql = `UPDATE users SET direct_income = direct_income + ?,non_working=non_working+?,max_amount=max_amount+? WHERE id = ?`;
//     db.query(
//       updateDirectIncomeSql,
//       [income, income, income, affected_user_id],
//       (err, directIncomeResult) => {
//         if (err || directIncomeResult.affectedRows === 0) {
//           return response
//             .status(400)
//             .json({ error: "Failed to update direct income" });
//         }

//         const insertTransactionSql = `INSERT INTO direct_transaction (user_id, amount, userby_id, percent, onamount) VALUES (?, ?, ?, ?, ?)`;
//         db.query(
//           insertTransactionSql,
//           [affected_user_id, income, userto_id, Sponser_bonus, amount],
//           (err, transactionResult) => {
//             if (err || transactionResult.affectedRows === 0) {
//               return response
//                 .status(500)
//                 .json({ error: "Error inserting direct transaction" });
//             }
//             response
//               .status(200)
//               .json({
//                 message: "Top-up and direct income distribution successful",
//               });
//           }
//         );
//       }
//     );
//   });
// }

exports.addReTopup = catchAsyncErrors(async (request, response, next) => {
  let { id, investment_amount, amount, userby_id } = request.body;
  const { settopup } = await fetchSetRoiFromAdminSettings();

  if (settopup !== 1) {
    return response.status(404).json({ message: "UseAdmin not allowed ROI" });
  }

  if (investment_amount) {
    const checkBalanceSql = `SELECT business , active_plan FROM users WHERE id = ?`;
    db.query(checkBalanceSql, [userby_id], (err, userResults) => {
      if (err) {
        console.error("Error during balance check:", err);
        return next(new ErrorHandler("Error during balance check!", 500));
      }
      if (userResults.length === 0) {
        return response.status(404).json({ message: "User not found" });
      }

      const { business, active_plan } = userResults[0];

      if (investment_amount > business || investment_amount < 0) {
        return response
          .status(400)
          .json({ message: `Your balance is less (${business})` });
      }

      // Deduct the amount from the userby_id's business balance
      const updateUserbySql = `UPDATE users SET business = business - ?, active_plan = active_plan + ?, is_active="active" activation_date = NOW() WHERE id = ?`;
      db.query(
        updateUserbySql,
        [investment_amount, investment_amount, userby_id],
        (err, result) => {
          if (err) {
            console.error("Error during balance update:", err);
            return next(new ErrorHandler("Error during balance update!", 500));
          }
          if (result.affectedRows > 0) {
            // Add the amount to the userto_id's business balance
            const insertTopupSql = `INSERT INTO topup (userby_id, userto_id, amount) VALUES (?, ?, ?)`;
            db.query(
              insertTopupSql,
              [userby_id, userby_id, investment_amount],
              (err, insertResult) => {
                if (err) {
                  console.error("Error inserting top-up details:", err);
                  return next(
                    new ErrorHandler("Error inserting top-up details!", 500)
                  );
                }
                if (insertResult.affectedRows > 0) {
                  return response
                    .status(200)
                    .json({ message: "Top-up request sent successfully" });
                } else {
                  return response
                    .status(400)
                    .json({ error: "Failed to insert top-up details" });
                }
              }
            );
          } else {
            return response
              .status(400)
              .json({ error: "Failed to update userby's business balance" });
          }
        }
      );
    });
  } else {
    const fetchPlanSql = `SELECT  Sponser_bonus FROM plans WHERE id = ?`;
    db.query(fetchPlanSql, [id], (err, planResults) => {
      if (err) {
        console.error("Error during plan fetch:", err);
        return next(new ErrorHandler("Error during plan fetch!", 500));
      }
      if (planResults.length === 0) {
        return response.status(404).json({ message: "Plan not found" });
      }

      const { Sponser_bonus } = planResults[0];
      const monthly_price = amount;
      // const direct_amount = monthly_price * (Sponser_bonus / 100);
      const checkBalanceSql = `SELECT business ,active_plan FROM users WHERE id = ?`;
      db.query(checkBalanceSql, [userby_id], (err, userResults) => {
        if (err) {
          console.error("Error during balance check:", err);
          return next(new ErrorHandler("Error during balance check!", 500));
        }
        if (userResults.length === 0) {
          return response.status(404).json({ message: "User not found" });
        }

        const { business, active_plan } = userResults[0];
        if (monthly_price > business || monthly_price < 0) {
          return response
            .status(400)
            .json({ message: `Your balance is less (${business})` });
        }

        if (monthly_price <= active_plan) {
          return response.status(400).json({ message: `Activate Bigger Plan` });
        }
        // Deduct the amount from the userby_id's business balance
        const updateUserbySql = `UPDATE users SET business = business - ?, is_active = "active", compound_income = compound_income + ?,  active_plan = active_plan + ?, plan_id = ?, activation_date = NOW() WHERE id = ?`;
        db.query(
          updateUserbySql,
          [monthly_price,monthly_price, monthly_price, id, userby_id],
          (err, result) => {
            if (err) {
              console.error("Error during top-up creation:", err);
              return next(
                new ErrorHandler("Error during top-up creation!", 500)
              );
            }
            if (result.affectedRows > 0) {
              const insertTopupSql = `INSERT INTO topup (userby_id, userto_id, amount) VALUES (?, ?, ?)`;
              db.query(
                insertTopupSql,
                [userby_id, userby_id, monthly_price],
                (err, insertResult) => {
                  if (err) {
                    console.error("Error inserting top-up details:", err);
                    return next(
                      new ErrorHandler("Error inserting top-up details:", 500)
                    );
                  }
                  if (insertResult.affectedRows > 0) {
                    const checkRefferSql = `SELECT reffer_by FROM users WHERE id = ?`;
                    db.query(checkRefferSql, [userby_id], (err, userResult) => {
                      if (err) {
                        console.error("Error during balance check:", err);
                        return next(
                          new ErrorHandler("Error during balance check!", 500)
                        );
                      }
                      if (userResult.length === 0) {
                        return response
                          .status(404)
                          .json({ message: "User not found" });
                      }
                      return response
                        .status(200)
                        .json({ message: "topup succesfully" });
                      // const { reffer_by } = userResult[0];
                      // const updateDirectIncomeSql = `UPDATE users SET direct_income = direct_income + ? WHERE refferal_code = ?`;
                      // db.query(
                      //   updateDirectIncomeSql,
                      //   [direct_amount, reffer_by],
                      //   (err, directIncomeResult) => {
                      //     if (err) {
                      //       console.error("Error updating direct income:", err);
                      //       return next(
                      //         new ErrorHandler(
                      //           "Error updating direct income:",
                      //           500
                      //         )
                      //       );
                      //     }
                      //     if (directIncomeResult.affectedRows > 0) {
                      //       return response.status(200).json({
                      //         success: true,
                      //         message:
                      //           "Top-up request sent successfully",
                      //       });
                      //     } else {
                      //       return response.status(400).json({
                      //         error: "Failed to update direct income",
                      //       });
                      //     }
                      //   }
                      // );
                    });
                  } else {
                    return response
                      .status(400)
                      .json({ error: "Failed to insert top-up details" });
                  }
                }
              );
            } else {
              return response
                .status(400)
                .json({ error: "Top-up request could not be sent" });
            }
          }
        );
      });
    });
  }
});

exports.entryActivate = catchAsyncErrors(async (request, response, next) => {
  const { id, userby_id } = request.body;
  if (userby_id) {
    const checkBalanceSql = `SELECT business FROM users WHERE id=${userby_id}`;
    db.query(checkBalanceSql, (err, result) => {
      if (err) {
        console.error("Error checking user balance:", err);
        return next(new ErrorHandler("Error during balance check!", 500));
      }

      if (result.length === 0) {
        return response.status(400).json({ message: "User not found" });
      }

      const currentBalance = result[0].business;

      if (currentBalance < 10) {
        return response
          .status(400)
          .json({ success: false, message: "Insufficient balance" });
      }

      const updateSql = `UPDATE users SET entry_fees = 10, status = 'unblock', level_status = 'open', 
               roi_status = 'open', is_active="active", status="unblock" WHERE id=${id}`;
      db.query(updateSql, (err, result) => {
        if (err) {
          console.error("Error during entry activation:", err);
          return next(new ErrorHandler("Error during entry activation!", 500));
        }

        if (result.affectedRows > 0) {
          const updateSql = `UPDATE users SET business = business- 20 WHERE id=${userby_id}`;
          db.query(updateSql, (err, result) => {
            if (err) {
              console.error("Error during entry activation:", err);
              return next(
                new ErrorHandler("Error during entry activation!", 500)
              );
            }

            if (result.affectedRows > 0) {
              response.status(200).json({
                success: true,
                message: "Entry activated successfully",
              });
            } else {
              return response.status(400).json({
                success: false,
                message: "Entry could not be activated",
              });
            }
          });
        } else {
          return response
            .status(400)
            .json({ success: false, message: "Entry could not be activated" });
        }
      });
    });
  } else {
    const checkBalanceSql = `SELECT business, entry_fees FROM users WHERE id=${id}`;

    db.query(checkBalanceSql, async (err, result) => {
      if (err) {
        console.error("Error checking user balance:", err);
        return next(new ErrorHandler("Error during balance check!", 500));
      }
      
      if (result.length === 0) {
        return response.status(400).json({ message: "User not found" });
      }
      
      const currentBalance = result[0].business;
      const entryFees = result[0].entry_fees;
      
      if (currentBalance < 10) {
        return response
          .status(400)
          .json({ success: false, message: "Insufficient balance" });
      }
      
      if (entryFees != 0) {
        return response
          .status(400)
          .json({ success: false, message: "Entry already active" });
      }
      
      const updateSql = `UPDATE users SET 
        entry_fees = 10, 
        business = business - 10, 
        status = 'unblock', 
        level_status = 'open',
        roi_status = 'open', 
        is_active = 'active',
        max = 4,
        status = 'unblock' 
        WHERE id = ${id}`;
      
      try {
        const updateResult = await db.promise().query(updateSql);
        
        if (updateResult[0].affectedRows > 0) {
          // Insert record into topup table
          // await db.promise().query(
          //   `INSERT INTO topup (userby_id, userto_id, amount, note) VALUES (?, ?, ?, ?)`,
          //   [id, id, 100, "Trade bonus from the admin"]
          // );
          
          return response
            .status(200)
            .json({ success: true, message: "Entry activated successfully" });
        } else {
          return response
            .status(400)
            .json({ success: false, message: "Entry could not be activated" });
        }
      } catch (error) {
        console.error("Error during entry activation:", error);
        return next(new ErrorHandler("Error during entry activation!", 500));
      }
    });
  }
});

const processTransaction = async (req, res, next) => {
  const { userby_id, userto_id, amount } = req.body;

  try {
    // Fetch user balance
    const [userByResult] = await db
      .promise()
      .query(`SELECT business FROM users WHERE id = ?`, [userby_id]);

    if (userByResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userByBalance = userByResult[0].business;

    if (amount > userByBalance || amount <= 0) {
      return res
        .status(400)
        .json({ message: `Your balance is insufficient (${userByBalance})` });
    }

    // Deduct amount from userby_id
    await db
      .promise()
      .query(`UPDATE users SET business = business - ? WHERE id = ?`, [
        amount,
        userby_id,
      ]);

    // Activate user and set entry fee
    await db.promise().query(
      `UPDATE users SET is_active='active', status = 'unblock', level_status = 'open', 
               roi_status = 'open',  entry_fees = ? WHERE id = ?`,
      [amount, userto_id]
    );

    // Insert into topup table
    await db
      .promise()
      .query(
        `INSERT INTO topup (userby_id, userto_id, amount) VALUES (?, ?, ?)`,
        [userby_id, userto_id, amount]
      );

    return res.status(200).json({ message: "Entry bot fee paid successfully" });
  } catch (err) {
    console.error("Transaction Error:", err);
    return next(new ErrorHandler("Error processing transaction!", 500));
  }
};

exports.addTopup = catchAsyncErrors(async (request, response, next) => {
  let { id, investment_amount, amount } = request.body;

  try {
    const { settopup } = await fetchSetRoiFromAdminSettings();
    if (settopup !== 1) {
      return response
        .status(404)
        .json({ message: "Admin has not allowed ROI" });
    }

    // Check if the plan is entry bot
    if (id === 4) {
      await processTransaction(request, response, next);
    } else if (investment_amount) {
      await processReTopup(request, response, next);
    } else {
      await processTopup(request, response, next);
    }
  } catch (err) {
    console.error("Error in addTopup:", err);
    return next(new ErrorHandler("Error processing top-up request!", 500));
  }
});

const processTopup = async (req, res, next) => {
  const { userby_id, userto_id, amount, id } = req.body;

  try {
    console.log("Received request:", req.body);

    // Fetch plan details
    // const [planResults] = await db
    //   .promise()
    //   .query(`SELECT Sponser_bonus, name FROM plans WHERE id = ?`, [id]);

    // if (planResults.length === 0) {
    //   console.error("Plan not found for ID:", id);
    //   return res.status(404).json({ message: "Plan not found" });
    // }

    // const { Sponser_bonus, name } = planResults[0];
    const monthly_price = amount;

    // Fetch user balance and active plan
    const [userResults] = await db
      .promise()
      .query(`SELECT active_plan, business FROM users WHERE id = ?`, [
        userby_id,
      ]);

    if (userResults.length === 0) {
      console.error("User not found:", userby_id);
      return res.status(404).json({ message: "User not found" });
    }

    const { active_plan, business } = userResults[0];

    // Fix condition check: monthly_price > business OR monthly_price < 0 AND userby_id === userto_id
    if (
      monthly_price > business ||
      (monthly_price < 0 && userby_id === userto_id)
    ) {
      console.error("Insufficient balance:", business);
      return res
        .status(400)
        .json({ message: `Your balance is less (${business})` });
    }

    // Fix condition to use strict equality comparison
    if (monthly_price < active_plan && userby_id === userto_id) {
      console.error("User needs to buy a bigger plan:", active_plan);
      return res
        .status(400)
        .json({ message: "Buy a bigger plan than the active one" });
    }

    // Using separate queries with error handling instead of transactions
    // Deduct amount from userby_id
    const [updateUserByResult] = await db
      .promise()
      .query(`UPDATE users SET business = business - ? WHERE id = ?`, [
        monthly_price,
        userby_id,
      ]);

    if (updateUserByResult.affectedRows === 0) {
      console.error("Failed to deduct amount for user:", userby_id);
      return res
        .status(400)
        .json({ error: "Top-up request could not be sent" });
    }

    console.log("Amount deducted successfully from user:", userby_id);

    // Update userto_id with the new plan
    const [updateUserToResult] = await db.promise().query(
      `UPDATE users 
         SET is_active = "active", status = 'unblock', level_status = 'open', 
             roi_status = 'open', active_plan = active_plan + ?, limit_plan = limit_plan + ?, 
             new_plan = ?,  plan_id = ?, activation_date = NOW() 
         WHERE id = ?`,
      [amount, amount, amount, id, userto_id]
    );

    if (updateUserToResult.affectedRows === 0) {
      console.error("Failed to update userto:", userto_id);
      // In case of failure, attempt to revert the deduction
      await db
        .promise()
        .query(`UPDATE users SET business = business + ? WHERE id = ?`, [
          monthly_price,
          userby_id,
        ]);
      return res
        .status(400)
        .json({ error: "Failed to update userto's business balance" });
    }

    console.log("Userto updated successfully:", userto_id);

    // Insert topup details
    const [insertTopupResult] = await db
      .promise()
      .query(
        `INSERT INTO topup (userby_id, userto_id, amount) VALUES (?, ?, ?)`,
        [userby_id, userto_id, monthly_price]
      );

    if (insertTopupResult.affectedRows === 0) {
      console.error("Failed to insert top-up details");
      // Attempt to revert changes
      await db
        .promise()
        .query(`UPDATE users SET business = business + ? WHERE id = ?`, [
          monthly_price,
          userby_id,
        ]);
      return res.status(400).json({ error: "Failed to insert top-up details" });
    }

    console.log("Top-up inserted successfully:", insertTopupResult.insertId);

    // Fetch the referrer
    const [userReferrerResult] = await db
      .promise()
      .query(`SELECT reffer_by FROM users WHERE id = ?`, [userto_id]);

    if (userReferrerResult.length === 0) {
      console.error("User referrer not found for:", userto_id);
      return res.status(404).json({ message: "User referrer not found" });
    }

    const { reffer_by } = userReferrerResult[0];

    console.log("Referrer found:", reffer_by);

    // Start distributing direct income - but don't let it send responses
    try {
      await distributeDirectIncome(
        reffer_by,
        amount,
        0.5,
        monthly_price,
        1,
        userto_id
      );
      return res.status(200).json({ message: "Top-up successful" });
    } catch (error) {
      console.error("Error in distribution:", error);
      return res.status(500).json({ error: "Error in income distribution" });
    }
  } catch (err) {
    console.error("Error processing top-up:", err);
    return next(new ErrorHandler("Error processing top-up!", 500));
  }
};

const processReTopup = async (req, res, next) => {
  const { userby_id, userto_id, investment_amount, id } = req.body;

  try {
    console.log("Received request:", req.body);

    // Fetch plan details
    // const [planResults] = await db
    //   .promise()
    //   .query(`SELECT Sponser_bonus, name FROM plans WHERE id = ?`, [id]);

    // if (planResults.length === 0) {
    //   console.error("Plan not found for ID:", id);
    //   return res.status(404).json({ message: "Plan not found" });
    // }

    // const { Sponser_bonus, name } = planResults[0];
    const monthly_price = investment_amount;

    // Fetch user balance and active plan
    const [userResults] = await db
      .promise()
      .query(`SELECT active_plan, business FROM users WHERE id = ?`, [
        userby_id,
      ]);

    if (userResults.length === 0) {
      console.error("User not found:", userby_id);
      return res.status(404).json({ message: "User not found" });
    }

    const { active_plan, business } = userResults[0];

    // Fix condition check: monthly_price > business OR monthly_price < 0 AND userby_id === userto_id
    if (
      monthly_price > business ||
      (monthly_price < 0 && userby_id === userto_id)
    ) {
      console.error("Insufficient balance:", business);
      return res
        .status(400)
        .json({ error: `Your balance is less (${business})` });
    }

    // Fix condition to use strict equality comparison
    if (monthly_price < active_plan && userby_id === userto_id) {
      console.error("User needs to buy a bigger plan:", active_plan);
      return res
        .status(400)
        .json({ error: "Buy a bigger plan than the active one" });
    }

    // Using separate queries with error handling instead of transactions
    // Deduct amount from userby_id
    const [updateUserByResult] = await db
      .promise()
      .query(`UPDATE users SET business = business - ? WHERE id = ?`, [
        monthly_price,
        userby_id,
      ]);

    if (updateUserByResult.affectedRows === 0) {
      console.error("Failed to deduct amount for user:", userby_id);
      return res
        .status(400)
        .json({ error: "Top-up request could not be sent" });
    }

    console.log("Amount deducted successfully from user:", userby_id);

    // Update userto_id with the new plan
    const [updateUserToResult] = await db.promise().query(
      `UPDATE users 
         SET is_active = "active", status = 'unblock', level_status = 'open', 
             roi_status = 'open', active_plan = active_plan + ?, limit_plan = limit_plan + ?, 
             new_plan = ?, plan_id = ?,   activation_date = NOW() 
         WHERE id = ?`,
      [
        monthly_price,
        monthly_price,
        monthly_price,
        id,
        userto_id,
      ]
    );

    if (updateUserToResult.affectedRows === 0) {
      console.error("Failed to update userto:", userto_id);
      // In case of failure, attempt to revert the deduction
      await db
        .promise()
        .query(`UPDATE users SET business = business + ? WHERE id = ?`, [
          monthly_price,
          userby_id,
        ]);
      return res
        .status(400)
        .json({ error: "Failed to update userto's business balance" });
    }

    console.log("Userto updated successfully:", userto_id);

    // Insert topup details
    const [insertTopupResult] = await db
      .promise()
      .query(
        `INSERT INTO topup (userby_id, userto_id, amount) VALUES (?, ?, ?)`,
        [userby_id, userto_id, monthly_price]
      );

    if (insertTopupResult.affectedRows === 0) {
      console.error("Failed to insert top-up details");
      // Attempt to revert changes
      await db
        .promise()
        .query(`UPDATE users SET business = business + ? WHERE id = ?`, [
          monthly_price,
          userby_id,
        ]);
      return res.status(400).json({ error: "Failed to insert top-up details" });
    }

    console.log("Top-up inserted successfully:", insertTopupResult.insertId);

    // Fetch the referrer
    // const [userReferrerResult] = await db
    //   .promise()
    //   .query(`SELECT reffer_by FROM users WHERE id = ?`, [userto_id]);

    // if (userReferrerResult.length === 0) {
    //   console.error("User referrer not found for:", userto_id);
    //   return res.status(404).json({ message: "User referrer not found" });
    // }

    // const { reffer_by } = userReferrerResult[0];

    // console.log("Referrer found:", reffer_by);

    // Start distributing direct income - but don't let it send responses
    // try {
    //   await distributeDirectIncome(
    //     reffer_by,
    //     investment_amount,
    //     Sponser_bonus,
    //     monthly_price,
    //     1,
    //     userto_id
    //   );
    //   return res.status(200).json({ message: "Top-up successful" });
    // } catch (error) {
    //   console.error("Error in distribution:", error);
    //   return res.status(500).json({ error: "Error in income distribution" });
    // }

    return res.status(200).json({ message: "Top-up successful" });
  } catch (err) {
    console.error("Error processing top-up:", err);
    return next(new ErrorHandler("Error processing top-up!", 500));
  }
};

const processCompound = async (req, res, next) => {
  const { userby_id, userto_id, amount, id } = req.body;

  try {
    console.log("Received request:", req.body);

    // Fetch plan details
    const [planResults] = await db
      .promise()
      .query(`SELECT Sponser_bonus, name FROM plans WHERE id = ?`, [id]);

    if (planResults.length === 0) {
      console.error("Plan not found for ID:", id);
      return res.status(404).json({ message: "Plan not found" });
    }

    const { Sponser_bonus, name } = planResults[0];
    const monthly_price = amount;

    // Fetch user balance and active plan
    const [userResults] = await db
      .promise()
      .query(`SELECT active_plan, business FROM users WHERE id = ?`, [
        userby_id,
      ]);

    if (userResults.length === 0) {
      console.error("User not found:", userby_id);
      return res.status(404).json({ message: "User not found" });
    }

    const { active_plan, business } = userResults[0];

    // Fix condition check: monthly_price > business OR monthly_price < 0 AND userby_id === userto_id
    if (
      monthly_price > business ||
      (monthly_price < 0 && userby_id === userto_id)
    ) {
      console.error("Insufficient balance:", business);
      return res
        .status(400)
        .json({ message: `Your balance is less (${business})` });
    }

    // Fix condition to use strict equality comparison
    if (monthly_price < active_plan && userby_id === userto_id) {
      console.error("User needs to buy a bigger plan:", active_plan);
      return res
        .status(400)
        .json({ message: "Buy a bigger plan than the active one" });
    }

    // Using separate queries with error handling instead of transactions
    // Deduct amount from userby_id
    const [updateUserByResult] = await db
      .promise()
      .query(`UPDATE users SET business = business - ? WHERE id = ?`, [
        monthly_price,
        userby_id,
      ]);

    if (updateUserByResult.affectedRows === 0) {
      console.error("Failed to deduct amount for user:", userby_id);
      return res
        .status(400)
        .json({ error: "Top-up request could not be sent" });
    }

    console.log("Amount deducted successfully from user:", userby_id);

    // Update userto_id with the new plan
    const [updateUserToResult] = await db.promise().query(
      `UPDATE users 
         SET is_active = "active", status = 'unblock', level_status = 'open', 
             roi_status = 'open', active_plan = ?, limit_plan = limit_plan + ?, 
             new_plan = ?, plan_id = ?, compound = compound + ?,  activation_date = NOW() 
         WHERE id = ?`,
      [
        monthly_price,
        monthly_price,
        monthly_price,
        id,
        monthly_price,
        userto_id,
      ]
    );

    if (updateUserToResult.affectedRows === 0) {
      console.error("Failed to update userto:", userto_id);
      // In case of failure, attempt to revert the deduction
      await db
        .promise()
        .query(`UPDATE users SET business = business + ? WHERE id = ?`, [
          monthly_price,
          userby_id,
        ]);
      return res
        .status(400)
        .json({ error: "Failed to update userto's business balance" });
    }

    console.log("Userto updated successfully:", userto_id);

    // Insert topup details
    const [insertTopupResult] = await db
      .promise()
      .query(
        `INSERT INTO topup (userby_id, userto_id, amount) VALUES (?, ?, ?)`,
        [userby_id, userto_id, monthly_price]
      );

    if (insertTopupResult.affectedRows === 0) {
      console.error("Failed to insert top-up details");
      // Attempt to revert changes
      await db
        .promise()
        .query(`UPDATE users SET business = business + ? WHERE id = ?`, [
          monthly_price,
          userby_id,
        ]);
      return res.status(400).json({ error: "Failed to insert top-up details" });
    }

    console.log("Top-up inserted successfully:", insertTopupResult.insertId);

    // Fetch the referrer
    // const [userReferrerResult] = await db
    //   .promise()
    //   .query(`SELECT reffer_by FROM users WHERE id = ?`, [userto_id]);

    // if (userReferrerResult.length === 0) {
    //   console.error("User referrer not found for:", userto_id);
    //   return res.status(404).json({ message: "User referrer not found" });
    // }

    // const { reffer_by } = userReferrerResult[0];

    // console.log("Referrer found:", reffer_by);

    // Start distributing direct income - but don't let it send responses
    // try {
    //   await distributeDirectIncome(
    //     reffer_by,
    //     investment_amount,
    //     Sponser_bonus,
    //     monthly_price,
    //     1,
    //     userto_id
    //   );
    //   return res.status(200).json({ message: "Top-up successful" });
    // } catch (error) {
    //   console.error("Error in distribution:", error);
    //   return res.status(500).json({ error: "Error in income distribution" });
    // }

    return res.status(200).json({ message: "Top-up successful" });
  } catch (err) {
    console.error("Error processing top-up:", err);
    return next(new ErrorHandler("Error processing top-up!", 500));
  }
};

// Convert distributeDirectIncome to use promises instead of callbacks
function distributeDirectIncome(
  reffer_by,
  amount,
  Sponser_bonus,
  monthly_price,
  level,
  userto_id
) {
  return new Promise((resolve, reject) => {
    if (level > 1 || !reffer_by) {
      return resolve(); // Simply resolve when done, don't send a response
    }

    let income;
    let percentage;
    switch (level) {
      case 1:
        income = amount * 0.05;
        percentage =  0.5; // 5%
        break;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        income = amount * 0.005; // 0.25%
        percentage = 0.5;
        break;
      default:
        return resolve(); // Should never reach here
    }

    // Step 1: Fetch user details for validation and calculation
    const fetchUserDetailsSql = `SELECT id, max_amount, active_plan, direct_income FROM users WHERE refferal_code = ? AND is_active = 'active' AND status = 'unblock'`;

    db.query(fetchUserDetailsSql, [reffer_by], (err, userResult) => {
      if (err) {
        console.error("Error fetching user details:", err);
        return reject(err);
      }

      if (userResult.length > 0) {
        const {
          id: affected_user_id,
          max_amount,
          active_plan,
          direct_income,
        } = userResult[0];
        const maxLimit = 3 * active_plan;
        let finalIncome = income;

        // Adjust finalIncome to ensure max_amount does not exceed maxLimit
        if (max_amount + income > maxLimit) {
          finalIncome = maxLimit - max_amount; // Cap the income to reach exactly maxLimit
        }

        if (finalIncome > 0) {
          const updateDirectIncomeSql = `
            UPDATE users
            SET direct_income = direct_income + ?,
                max_amount = max_amount + ?,
                working = working + ?,
                status = CASE
                          WHEN max_amount + ? >= ? THEN 'block'
                          ELSE status
                        END,
                roi_status = CASE
                              WHEN max_amount + ? >= ? THEN 'close'
                              ELSE roi_status
                            END,
                level_status = CASE
                                WHEN max_amount + ? >= ? THEN 'close'
                                ELSE level_status
                              END
            WHERE refferal_code = ? AND is_active = 'active' AND status = 'unblock'
          `;

          db.query(
            updateDirectIncomeSql,
            [
              finalIncome, // Direct income
              finalIncome, // Direct income
              finalIncome, // Max amount
              finalIncome,
              maxLimit, // For status condition
              finalIncome,
              maxLimit, // For ROI status condition
              finalIncome,
              maxLimit, // For level status condition
              reffer_by,
            ],
            (err, directIncomeResult) => {
              if (err) {
                console.error("Error updating direct income:", err);
                return reject(err);
              }

              if (directIncomeResult.affectedRows > 0) {
                // Insert direct transaction
                const insertTransactionSql = `
                  INSERT INTO direct_transaction (user_id, amount, userby_id, percent, onamount)
                  VALUES (?, ?, ?, ?, ?)
                `;
                db.query(
                  insertTransactionSql,
                  [
                    affected_user_id,
                    finalIncome,
                    userto_id,
                    percentage,
                    monthly_price,
                  ],
                  (err, transactionResult) => {
                    if (err) {
                      console.error("Error inserting direct transaction:", err);
                      return reject(err);
                    }

                    if (transactionResult.affectedRows > 0) {
                      // Fetch next referrer for recursion
                      const fetchRefferBySql = `SELECT reffer_by FROM users WHERE refferal_code = ?`;
                      db.query(
                        fetchRefferBySql,
                        [reffer_by],
                        (err, refferByResult) => {
                          if (err) {
                            console.error("Error fetching referrer:", err);
                            return reject(err);
                          }

                          if (refferByResult.length > 0) {
                            const nextRefferBy = refferByResult[0].reffer_by;
                            distributeDirectIncome(
                              nextRefferBy,
                              amount,
                              Sponser_bonus,
                              monthly_price,
                              level + 1,
                              userto_id
                            )
                              .then(resolve)
                              .catch(reject);
                          } else {
                            resolve();
                          }
                        }
                      );
                    } else {
                      reject(new Error("Failed to insert direct transaction"));
                    }
                  }
                );
              } else {
                reject(new Error("Failed to update direct income"));
              }
            }
          );
        } else {
          console.log("Max limit reached, no additional income added");
          resolve();
        }
      } else {
        console.log("User not found or not eligible");
        resolve(); // Just resolve and continue, don't send a response
      }
    });
  });
}
