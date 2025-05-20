const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const ErrorHandler = require("../utils/errorHandler");
const dotenv = require("dotenv");
const db = require("../config/database");
const fetchSetRoiFromAdminSettings = require("../utils/settings");
dotenv.config({ path: "backend/config/config.env" });

const fetchUsers = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, plan_id, active_plan,is_active,roi_status, compound_income, total_team,business,refferal_code,reffer_by,direct_income,roi_income, level_month,reward,activation_date FROM users WHERE is_active = 'active'`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching users:", err);
        return reject(new ErrorHandler("Error fetching users!", 500));
      }
      resolve(result);
    });
  });
};


const fetchPlanById = async (planId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT ROI_overall FROM plans WHERE id = ?`;
    db.query(sql, [planId], (err, result) => {
      if (err) {
        console.error(`Error fetching plan details for plan ${planId}:`, err);
        return reject(new ErrorHandler("Error fetching plan details!", 500));
      }
      if (result.length === 0) {
        console.warn(`Plan with ID ${planId} not found`);
        return reject(new ErrorHandler("Plan not found!", 404));
      }
      resolve(result[0]);
    });
  });
};

const updateUserROIIncome = async (userId, roiIncome) => {
  console.log(`[ROI Update] Starting update for User ID: ${userId} with ROI income: ${roiIncome}`);
  
  return new Promise((resolve, reject) => {
    const fetchUserSql = `SELECT max_amount, compound_income, active_plan FROM users WHERE id = ? AND roi_status = 'open'`;
    console.log(`[ROI Update] Fetching user details with query: ${fetchUserSql.replace('?', userId)}`);
    
    db.query(fetchUserSql, [userId], (err, userResult) => {
      if (err) {
        console.error(`[ROI Update] ERROR: Fetching user details for User ID ${userId} failed:`, err);
        return reject(new Error("Error fetching user details!"));
      }
      
      if (userResult.length === 0) {
        console.log(`[ROI Update] No eligible user found with ID: ${userId} or ROI status is not 'open'`);
        return resolve(false);
      }
      
      const { max_amount, active_plan, compound_income } = userResult[0];
      const maxLimit = 5 * active_plan;
      
      console.log(`[ROI Update] User Details: 
        - User ID: ${userId}
        - Current max_amount: ${max_amount}
        - Active plan: ${active_plan}
        - Max limit (5 × active_plan): ${maxLimit}
        - Requested ROI income: ${roiIncome}`);
      
      let finalROIIncome = roiIncome;
      
      if (Number(max_amount) + Number(roiIncome) > Number(maxLimit)) {
        finalROIIncome = maxLimit - max_amount; // Cap the ROI income to fit within the limit
        console.log(`[ROI Update] ROI income capped from ${roiIncome} to ${finalROIIncome} to fit within max limit`);
      }
      
      console.log(`[ROI Update] Final ROI income to be added: ${finalROIIncome}`);
      console.log(`[ROI Update] New max_amount will be: ${Number(max_amount) + Number(finalROIIncome)}`);
      
      const willBeBlocked = (Number(max_amount) + Number(finalROIIncome)) >= Number(maxLimit);
      console.log(`[ROI Update] User account will ${willBeBlocked ? 'be' : 'not be'} blocked after this update`);
      
      let sql = `
        UPDATE users 
        SET 
          roi_income = roi_income + ?,
          max_amount = max_amount + ?,
          non_working = non_working + ?,
          compound_income = compound_income + ?,
          roi_day = ?,
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
                        END,
          active_plan = CASE
                        WHEN max_amount + ? >= ? THEN 0
                        ELSE active_plan
                      END
        WHERE id = ? AND roi_status = 'open'
      `;
      
      console.log(`[ROI Update] Executing update query with parameters:
        - finalROIIncome: ${finalROIIncome}
        - maxLimit: ${maxLimit}
        - userId: ${userId}`);
      
      db.query(
        sql,
        [
          finalROIIncome, // ROI income
          finalROIIncome, // Max amount
          finalROIIncome, // non working
          finalROIIncome, // compound
          finalROIIncome, // ROI day
          finalROIIncome,
          maxLimit, // For status condition
          finalROIIncome,
          maxLimit, // For ROI status condition
          finalROIIncome,
          maxLimit, // For level status condition
          finalROIIncome,
          maxLimit, // For active plan reset condition
          userId,
        ],
        (err, result) => {
          if (err) {
            console.error(`[ROI Update] ERROR: Updating ROI income for User ID ${userId} failed:`, err);
            return reject(new Error("Error updating ROI income!"));
          }
          
          console.log(`[ROI Update] Success! Update completed for User ID: ${userId}
            - Affected rows: ${result.affectedRows}
            - Added ROI amount: ${finalROIIncome}
            - Active plan amount: ${parseFloat(active_plan)}
            - New max_amount: ${Number(max_amount) + Number(finalROIIncome)}/${maxLimit}`);
          
          resolve({
            isUpdated: result.affectedRows > 0,
            onAmount: parseFloat(active_plan),
            amount: finalROIIncome,
            newMaxAmount: Number(max_amount) + Number(finalROIIncome),
            maxLimit: maxLimit
          });
        }
      );
    });
  });
};

const countTimedReferrals = async (
  referralCode,
  activationDate,
  minActivePlan
) => {
  console.log(
    `[REFERRAL] Counting timed referrals for code ${referralCode}, activation date: ${activationDate}, min plan: ${minActivePlan}`
  );

  return new Promise((resolve, reject) => {
    // This query counts referrals within 2 days and 5 days of the user's own activation
    const sql = `
      SELECT 
        SUM(CASE WHEN DATE(created_at) BETWEEN DATE(?) AND DATE_ADD(DATE(?), INTERVAL 2 DAY) THEN 1 ELSE 0 END) as within2Days,
        SUM(CASE WHEN DATE(created_at) BETWEEN DATE(?) AND DATE_ADD(DATE(?), INTERVAL 5 DAY) THEN 1 ELSE 0 END) as within5Days,
        COUNT(*) as totalReferrals
      FROM users
      WHERE reffer_by = ?
      AND active_plan >= ?
      AND is_active = 'active'
      AND DATE(activation_date) > '2025-02-06'
    `;

    db.query(
      sql,
      [
        activationDate,
        activationDate,
        activationDate,
        activationDate,
        referralCode,
        minActivePlan,
      ],
      (err, result) => {
        if (err) {
          console.error(
            `[REFERRAL] Error counting timed referrals for ${referralCode}:`,
            err
          );
          return reject(
            new ErrorHandler("Error counting timed referrals!", 500)
          );
        }

        // Get detailed referrals for debugging
        const detailSql = `
          SELECT id, created_at, active_plan, activation_date
          FROM users
          WHERE reffer_by = ?
          AND active_plan >= ?
          AND is_active = 'active'
          AND DATE(activation_date) > '2025-02-06'
          ORDER BY created_at ASC
        `;

        db.query(
          detailSql,
          [referralCode, minActivePlan],
          (detailErr, detailResult) => {
            if (detailErr) {
              console.error(
                `[REFERRAL] Error fetching detailed referrals for ${referralCode}:`,
                detailErr
              );
            } else {
              // Log detailed referral information
              console.log(
                `[REFERRAL] Found ${detailResult.length} total referrals for ${referralCode}`
              );

              if (detailResult.length > 0) {
                console.log(`[REFERRAL] Referral details for ${referralCode}:`);
                detailResult.forEach((ref, index) => {
                  const createdDate = new Date(ref.created_at);
                  const activationDate = new Date(ref.activation_date);
                  const timeDiff =
                    (createdDate - activationDate) / (1000 * 60 * 60 * 24);

                  console.log(
                    `[REFERRAL] Referral #${index + 1}: User ID ${
                      ref.id
                    }, Plan: ${ref.active_plan}, Created: ${
                      ref.created_at
                    }, Days after activation: ${timeDiff.toFixed(1)}`
                  );
                });
              }
            }

            const counts = {
              within2Days: result[0].within2Days || 0,
              within5Days: result[0].within5Days || 0,
              totalReferrals: result[0].totalReferrals || 0,
            };

            console.log(
              `[REFERRAL] Summary for ${referralCode}: ${counts.within2Days} referrals within 2 days, ${counts.within5Days} referrals within 5 days, ${counts.totalReferrals} total referrals`
            );
            resolve(counts);
          }
        );
      }
    );
  });
};

const adjustROIByReferralCount = async (userId, planDetails) => {
  console.log(
    `[ROI-ADJUST] Adjusting ROI for User ID ${userId} with plan ROI: ${planDetails.ROI_overall}%`
  );

  try {
    const fetchUserSql = `SELECT refferal_code, created_at, active_plan, activation_date FROM users WHERE id = ?`;
    const user = await new Promise((resolve, reject) => {
      db.query(fetchUserSql, [userId], (err, result) => {
        if (err) {
          console.error(
            `[ROI-ADJUST] Error fetching user details for User ID ${userId}:`,
            err
          );
          return reject(new ErrorHandler("Error fetching user details!", 500));
        }
        if (result.length === 0) {
          console.log(`[ROI-ADJUST] User ID ${userId} not found`);
          return reject(new ErrorHandler("User not found!", 404));
        }
        resolve(result[0]);
      });
    });

    console.log(
      `[ROI-ADJUST] User ${userId} details: Referral code: ${user.refferal_code}, Activation date: ${user.activation_date}, Active plan: ${user.active_plan}`
    );

    // Get the referral count
    const referralCounts = await countTimedReferrals(
      user.refferal_code,
      user.activation_date,
      user.active_plan
    );

    let roi_percentage = planDetails.ROI_overall;
    let adjustmentReason = "No adjustment - base ROI";

    // Calculate ROI boost based on referral performance
    if (referralCounts.within5Days >= 5) {
      // Add 25 percentage points to the ROI for 5+ referrals within 5 days
      const originalRoi = roi_percentage;
      roi_percentage = roi_percentage + 0.25; // Add 0.25 percentage points (25 basis points)
      adjustmentReason = `ROI boosted by adding 0.25% (${originalRoi}% → ${roi_percentage}%) for ${referralCounts.within5Days} referrals within 5 days`;
    } else if (referralCounts.within2Days > 2) {
      // Add 25 percentage points to the ROI for 2+ referrals within 2 days
      const originalRoi = roi_percentage;
      roi_percentage = roi_percentage + 0.25; // Add 0.25 percentage points (25 basis points)
      adjustmentReason = `ROI boosted by adding 0.25% (${originalRoi}% → ${roi_percentage}%) for ${referralCounts.within2Days} referrals within 2 days`;
    } else {
      // Check if user has exactly 2 referrals but they're not within the time window
      if (referralCounts.totalReferrals === 2) {
        console.log(
          `[ROI-ADJUST] ATTENTION: User ${userId} has exactly 2 referrals but didn't get ROI boost. They may not be within the 2-day window.`
        );
      }
    }
    console.log(
      `[ROI-ADJUST] Final ROI for User ${userId}: ${roi_percentage}% - ${adjustmentReason}`
    );
    return roi_percentage;
  } catch (error) {
    console.error(
      `[ROI-ADJUST] Error adjusting ROI for User ID ${userId}:`,
      error
    );
    // Return default ROI in case of error
    return planDetails.ROI_overall;
  }
};


exports.updateROIIncomeForUsers = catchAsyncErrors(
  async (request, response, next) => {
    console.log("[ROI] Starting ROI income update process");
    const results = {
      total: 0,
      updated: 0,
      skipped: 0,
      skipped_reasons: {
        time_restriction: 0,
        invalid_amount: 0,
        inactive_plan: 0,
        max_limit_reached: 0,
        admin_not_allowed: 0,
        invalid_plan: 0,
        no_affect: 0,
      },
      total_roi_distributed: 0,
    };

    try {
      const { setroi } = await fetchSetRoiFromAdminSettings();
      if (setroi !== 1) {
        console.log("[ROI] Admin has not allowed ROI distribution");
        results.skipped_reasons.admin_not_allowed = "all";
        return response.status(200).json({
          success: false,
          message: "Admin has not allowed ROI distribution",
          results,
        });
      }

      const users = await fetchUsers();
      console.log(`[ROI] Processing ${users.length} users for ROI updates`);
      results.total = users.length;

      for (const user of users) {
        const { id, plan_id, active_plan } = user;
        results.total++;

        if (!plan_id) {
          console.log(`[ROI] User ${id} does not have a valid plan_id`);
          results.skipped++;
          results.skipped_reasons.invalid_plan++;
          continue;
        }

        let planDetails;
        try {
          planDetails = await fetchPlanById(plan_id);
        } catch (error) {
          console.log(
            `[ROI] Plan for user ${id} with plan_id ${plan_id} not found`
          );
          results.skipped++;
          results.skipped_reasons.invalid_plan++;
          continue;
        }

        // const roi_per = await adjustROIByReferralCount(id, planDetails);
        const roi_per = planDetails.ROI_overall
        const roiIncome = (active_plan * roi_per) / 100;

        console.log(
          `[ROI] Calculated ROI for User ID ${id}: ${roiIncome.toFixed(
            2
          )} (${roi_per}% of ${active_plan})`
        );

        try {
          const updateResult = await updateUserROIIncome(
            id,
            parseFloat(roiIncome.toFixed(2))
          );

          if (!updateResult.isUpdated) {
            console.log(`[ROI] Skipped User ID ${id}: ${updateResult.reason}`);
            results.skipped++;
            results.skipped_reasons[updateResult.reason] =
              (results.skipped_reasons[updateResult.reason] || 0) + 1;
            continue;
          }

          // Only insert transaction record if user was actually updated
          const transactionQuery = `INSERT INTO roi_transaction (user_id, type, amount, onamount, percent) VALUES (?, ?, ?, ?, ?)`;
          const transactionData = [
            id,
            "Invest ROI",
            updateResult.amount,
            updateResult.onAmount,
            roi_per,
          ];

          await new Promise((resolve, reject) => {
            db.query(transactionQuery, transactionData, (error) => {
              if (error) {
                console.error(
                  `[ROI] Error inserting transaction for user ${id}:`,
                  error
                );
                return reject(
                  new ErrorHandler("Error inserting transaction!", 500)
                );
              }
              console.log(
                `[ROI] Transaction recorded for User ID ${id}: ${updateResult.amount}`
              );
              resolve();
            });
          });

          results.updated++;
          results.total_roi_distributed += parseFloat(updateResult.amount);

          if (updateResult.max_reached) {
            console.log(`[ROI] User ID ${id} has reached maximum ROI limit`);
          }
        } catch (error) {
          console.error(`[ROI] Error processing User ID ${id}:`, error);
        }
      }

      console.log(
        `[ROI] ROI update process completed. Updated: ${results.updated}, Skipped: ${results.skipped}, Total ROI: ${results.total_roi_distributed}`
      );
      response.status(200).json({
        success: true,
        message: "ROI incomes updated successfully",
        results,
      });
    } catch (error) {
      console.error("[ROI] Critical error updating ROI incomes:", error);
      results.error = error.message;
      response.status(500).json({
        success: false,
        message: "Error updating ROI incomes",
        results,
      });
    }
  }
);


exports.processSelfTrade = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    // Check ROI status from admin settings
    const { setroi } = await fetchSetRoiFromAdminSettings();
    if (setroi !== 1) {
      return res.status(403).json({ message: "Admin has disabled ROI" });
    }

    // ✅ Get user directly from DB
    const userQuery = `SELECT * FROM users WHERE id = ?`;
    const user = await new Promise((resolve, reject) => {
      db.query(userQuery, [userId], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);
        resolve(results[0]);
      });
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { plan_id, active_plan, compound_income } = user;

    if (!plan_id || !active_plan) {
      return res
        .status(400)
        .json({ message: "User does not have an active plan" });
    }

    // ✅ Get plan details
    let planDetails;
    try {
      planDetails = await fetchPlanById(plan_id);
    } catch (error) {
      return res.status(404).json({ message: "User plan not found" });
    }

    const roi_percentage = planDetails.ROI_overall;
    const roiIncome = (active_plan * roi_percentage) / 100;
    const currentDate = new Date().toISOString().split("T")[0];

    // ✅ Check if today's transaction already exists
    // const checkQuery = `
    //     SELECT COUNT(*) AS count FROM roi_transaction
    //     WHERE user_id = ? AND DATE(createdAt) = ?
    //   `;

    // const transactionExists = await new Promise((resolve, reject) => {
    //   db.query(checkQuery, [userId, currentDate], (err, results) => {
    //     if (err) return reject(err);
    //     resolve(results[0].count > 0);
    //   });
    // });

    // if (transactionExists) {
    //   return res
    //     .status(409)
    //     .json({ message: "ROI already processed for today" });
    // }

    // ✅ Update ROI Income
    const { isUpdated, onAmount } = await updateUserROIIncome(
      userId,
      roiIncome.toFixed(2)
    );

    if (isUpdated) {
      const insertQuery = `
  INSERT INTO roi_transaction
  (user_id, amount, type, onamount, percent, description, currency, transaction_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

      const selfTradeNotes = [
        "Executed a profitable trade today",
        "Completed today's trade successfully",
      ];

      const randomNote =
        selfTradeNotes[Math.floor(Math.random() * selfTradeNotes.length)];
      const insertData = [
        userId,
        roiIncome.toFixed(2),
        "Invest ROI",
        active_plan,
        roi_percentage,
        `${randomNote}`,
        "USD",
        "self", // Or "admin" if manually triggered
      ];

      await new Promise((resolve, reject) => {
        db.query(insertQuery, insertData, (err) => {
          if (err) {
            console.error("❌ Error inserting transaction:", err);
            return reject(err);
          }
          console.log(`✅ ROI transaction recorded for user ${userId}`);
          resolve();
        });
      });

      // ✅ Check transaction count and update active_plan and compound_income if needed
      // const transactionCountQuery = `
      //   SELECT COUNT(*) AS count FROM roi_transaction 
      //   WHERE user_id = ?
      // `;

      // const transactionCount = await new Promise((resolve, reject) => {
      //   db.query(transactionCountQuery, [userId], (err, results) => {
      //     if (err) return reject(err);
      //     resolve(results[0].count);
      //   });
      // });

      // If transaction count is 10 and active_plan > 100, subtract 100 from active_plan and compound_income
      // If transaction count is 10 and active_plan > 100, subtract 100 from active_plan and compound_income
  //     if (transactionCount === 10 && active_plan >= 100) {
  //       const updateUserQuery = `
  //   UPDATE users
  //   SET active_plan = active_plan - 100,
  //       compound_income = compound_income - 100
  //   WHERE id = ?
  // `;

  //       await db
  //         .promise()
  //         .query(
  //           `INSERT INTO topup (userby_id, userto_id, amount, note) VALUES (?, ?, ?, ?)`,
  //           [id, id, 100, "Trade bonus deducted"]
  //         );

  //       await new Promise((resolve, reject) => {
  //         db.query(updateUserQuery, [userId], (err, results) => {
  //           if (err) {
  //             console.error("❌ Error updating user plan and income:", err);
  //             return reject(err);
  //           }
  //           console.log(
  //             `✅ Updated active_plan and compound_income for user ${userId}`
  //           );
  //           resolve();
  //         });
  //       });

  //       if (plan_id === 4) {
  //         const updatePlanQuery = `
  //     UPDATE users
  //     SET plan_id = 0,
  //         roi_status = 'close',
  //         level_status = 'close',
  //         roi_day = 0,
  //         roi_income = 0
  //     WHERE id = ?
  //   `;

  //         await new Promise((resolve, reject) => {
  //           db.query(updatePlanQuery, [userId], (err, results) => {
  //             if (err) {
  //               console.error(
  //                 "❌ Error updating plan details for plan_id=4:",
  //                 err
  //               );
  //               return reject(err);
  //             }
  //             console.log(
  //               `✅ Reset plan details for user ${userId} with plan_id=4`
  //             );
  //             resolve();
  //           });
  //         });
  //       }
  //     }
    }

    return res.status(200).json({
      message: "ROI income updated successfully for the user",
      user_id: userId,
      roi: roiIncome.toFixed(2),
    });
  } catch (error) {
    console.error("Error updating ROI for single user:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});


// exports.processSelfTrade = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { pair } = req.query;
//     const userId = parseInt(id);

//     if (isNaN(userId)) {
//       return res.status(400).json({ message: "Invalid User ID" });
//     }

//     // Check ROI status from admin settings
//     const { setroi } = await fetchSetRoiFromAdminSettings();
//     if (setroi !== 1) {
//       return res.status(403).json({ message: "Admin has disabled ROI" });
//     }

//     // ✅ Get user directly from DB
//     const userQuery = `SELECT * FROM users WHERE id = ?`;
//     const user = await new Promise((resolve, reject) => {
//       db.query(userQuery, [userId], (err, results) => {
//         if (err) return reject(err);
//         if (results.length === 0) return resolve(null);
//         resolve(results[0]);
//       });
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const { plan_id, active_plan } = user;

//     if (!plan_id || !active_plan) {
//       return res
//         .status(400)
//         .json({ message: "User does not have an active plan" });
//     }

//     let planDetails;
//     try {
//       planDetails = await fetchPlanById(plan_id);
//     } catch (error) {
//       return res.status(404).json({ message: "User plan not found" });
//     }

//     const roi_per = await adjustROIByReferralCount(id, planDetails);
//     const roiIncome = (active_plan * roi_per) / 100;

//     // Generate a random factor between 2 and 6
//     const factor = Math.floor(Math.random() * 5) + 2; // Random number between 2-6

//     // Calculate the split amount (rounded to 2 decimal places)
//     const splitAmount = parseFloat((roiIncome / factor).toFixed(2));

//     // Calculate the remaining amount for the last transaction to ensure exact total
//     let remainingAmount = parseFloat(
//       (roiIncome - splitAmount * (factor - 1)).toFixed(2)
//     );

//     // Possible transaction notes
//     const selfTradeNotes = [
//       "Executed a profitable trade today",
//       "Completed today's trade successfully",
//       "Market position yielded returns",
//       "Successful trading cycle completed",
//       "Trade execution finalized with profit",
//       "Market strategy delivered gains",
//     ];

//     const { isUpdated, onAmount } = await updateUserROIIncome(
//       userId,
//       roiIncome.toFixed(2)
//     );

//     if (isUpdated) {
//       const insertQuery = `
//         INSERT INTO roi_transaction
//         (user_id, amount, type, onamount, percent, description, status, currency, transaction_by, pair)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;

//       // Create multiple transactions based on the factor
//       for (let i = 0; i < factor; i++) {
//         // Use the splitAmount for all transactions except the last one
//         const transactionAmount =
//           i === factor - 1 ? remainingAmount : splitAmount;

//         // Get a random note for each transaction
//         const randomNote =
//           selfTradeNotes[Math.floor(Math.random() * selfTradeNotes.length)];

//         const insertData = [
//           userId,
//           transactionAmount.toFixed(2),
//           "Invest ROI",
//           onAmount,
//           roi_per,
//           `${randomNote}`,
//           "completed",
//           "USDT",
//           "self",
//           pair, // Or "admin" if manually triggered
//         ];

//         await new Promise((resolve, reject) => {
//           db.query(insertQuery, insertData, (err) => {
//             if (err) {
//               console.error(
//                 `❌ Error inserting transaction ${i + 1}/${factor}:`,
//                 err
//               );
//               return reject(err);
//             }
//             console.log(
//               `✅ ROI transaction ${
//                 i + 1
//               }/${factor} recorded for user ${userId} with amount ${transactionAmount.toFixed(
//                 2
//               )}`
//             );
//             resolve();
//           });
//         });
//       }

//       // Get user's activation date to check for plan_id 4 special condition
//       // const userInfoQuery = `
//       //     SELECT activation_date FROM users
//       //     WHERE id = ?
//       //   `;

//       // const userInfo = await new Promise((resolve, reject) => {
//       //   db.query(userInfoQuery, [userId], (err, results) => {
//       //     if (err) return reject(err);
//       //     if (results.length === 0) return resolve({ activation_date: null });
//       //     resolve({
//       //       activation_date: results[0].activation_date,
//       //     });
//       //   });
//       // });

//       // Calculate days since activation
//       // const activationDate = userInfo.activation_date
//       //   ? new Date(userInfo.activation_date)
//       //   : null;
//       // const currentDate = new Date();
//       // const daysSinceActivation = activationDate
//       //   ? Math.floor((currentDate - activationDate) / (1000 * 60 * 60 * 24))
//       //   : 0;

//       // If transaction count is 10 and active_plan > 100, subtract 100 from active_plan and compound_income
//       // if (daysSinceActivation >= 10 && active_plan >= 100) {
//       //   const updateUserQuery = `
//       //     UPDATE users
//       //     SET active_plan = active_plan - 100
//       //     WHERE id = ?
//       //   `;

//       //   await db
//       //     .promise()
//       //     .query(
//       //       `INSERT INTO topup (userby_id, userto_id, amount, note) VALUES (?, ?, ?, ?)`,
//       //       [id, id, 100, "Trade bonus deducted"]
//       //     );

//       //   await new Promise((resolve, reject) => {
//       //     db.query(updateUserQuery, [userId], (err, results) => {
//       //       if (err) {
//       //         console.error("❌ Error updating user plan and income:", err);
//       //         return reject(err);
//       //       }
//       //       console.log(
//       //         `✅ Updated active_plan and compound_income for user ${userId}`
//       //       );
//       //       resolve();
//       //     });
//       //   });

//       //   // If plan_id is 4 AND at least 10 days have passed since activation, reset plan details
//       //   if (plan_id === 4 && daysSinceActivation >= 10) {
//       //     const updatePlanQuery = `
//       //       UPDATE users
//       //       SET plan_id = 0,
//       //           roi_status = 'close',
//       //           level_status = 'close',
//       //           active_plan = 0,
//       //           roi_day = 0,
//       //           roi_income = 0
//       //       WHERE id = ?
//       //     `;

//       //     await new Promise((resolve, reject) => {
//       //       db.query(updatePlanQuery, [userId], (err, results) => {
//       //         if (err) {
//       //           console.error(
//       //             "❌ Error updating plan details for plan_id=4:",
//       //             err
//       //           );
//       //           return reject(err);
//       //         }
//       //         console.log(
//       //           `✅ Reset plan details for user ${userId} with plan_id=4`
//       //         );
//       //         resolve();
//       //       });
//       //     });
//       //   }
//       // }
//     }

//     return res.status(200).json({
//       message: "ROI income updated successfully for the user",
//       user_id: userId,
//       roi: roiIncome.toFixed(2),
//     });
//   } catch (error) {
//     console.error("Error updating ROI for single user:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal Server Error", error: error.message });
//   }
// });




// exports.processSelfTrade = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { pair } = req.query;
//     const userId = parseInt(id);

//     if (isNaN(userId)) {
//       return res.status(400).json({ message: "Invalid User ID" });
//     }

//     // Check ROI status from admin settings
//     const { setroi } = await fetchSetRoiFromAdminSettings();
//     if (setroi !== 1) {
//       return res.status(403).json({ message: "Admin has disabled ROI" });
//     }

//     // ✅ Get user directly from DB
//     const userQuery = `SELECT * FROM users WHERE id = ?`;
//     const user = await new Promise((resolve, reject) => {
//       db.query(userQuery, [userId], (err, results) => {
//         if (err) return reject(err);
//         if (results.length === 0) return resolve(null);
//         resolve(results[0]);
//       });
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const { plan_id, active_plan } = user;

//     if (!plan_id || active_plan == 0) {
//       return res
//         .status(400)
//         .json({ message: "User does not have an active plan" });
//     }

//     let planDetails;
//     try {
//       planDetails = await fetchPlanById(plan_id);
//     } catch (error) {
//       return res.status(404).json({ message: "User plan not found" });
//     }

//     const roi_per = await adjustROIByReferralCount(id, planDetails);
//     const roiIncome = (active_plan * roi_per) / 100;

//     // Generate a random factor between 2 and 6
//     const factor = Math.floor(Math.random() * 5) + 2; // Random number between 2-6

//     // Calculate the split amount (rounded to 2 decimal places)
//     const splitAmount = parseFloat((roiIncome / factor).toFixed(2));

//     // Calculate the remaining amount for the last transaction to ensure exact total
//     let remainingAmount = parseFloat(
//       (roiIncome - splitAmount * (factor - 1)).toFixed(2)
//     );

//     // Possible transaction notes
//     const creditTradeNotes = [
//       "Executed a profitable trade today",
//       "Completed today's trade successfully",
//       "Market position yielded returns",
//       "Successful trading cycle completed",
//       "Trade execution finalized with profit",
//       "Market strategy delivered gains",
//     ];

//     const debitTradeNotes = [
//       "Trade fees deduction",
//       "Platform service charge",
//       "Transaction processing fee",
//       "Network fee for trade execution",
//       "Trade maintenance fee",
//       "Market access fee",
//     ];

//     const { isUpdated, onAmount } = await updateUserROIIncome(
//       userId,
//       roiIncome.toFixed(2)
//     );

//     if (isUpdated) {
//       const insertQuery = `
//         INSERT INTO roi_transaction
//         (user_id, amount, type, onamount, percent, description, tr_type, currency, transaction_by, pair)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;

//       // Create transaction data for both credit and debit transactions
//       const transactions = [];
      
//       // Prepare credit transactions
//       for (let i = 0; i < factor; i++) {
//         // Use the splitAmount for all transactions except the last one
//         const transactionAmount =
//           i === factor - 1 ? remainingAmount : splitAmount;

//         // Get a random note for each transaction
//         const randomNote =
//           creditTradeNotes[Math.floor(Math.random() * creditTradeNotes.length)];

//         transactions.push({
//           type: "credit",
//           amount: transactionAmount.toFixed(2),
//           transactionType: "Invest ROI",
//           description: randomNote,
//           index: i,
//           total: factor
//         });
//       }

//       // Add 1 to 3 debit transactions
//       const debitCount = Math.floor(Math.random() * 3) + 1; // Random number between 1-3
//       const totalDebitAmount = parseFloat((roiIncome * 0.05).toFixed(2)); // 5% of ROI as fees
//       const debitSplitAmount = parseFloat((totalDebitAmount / debitCount).toFixed(2));
      
//       // Calculate the remaining debit amount for the last transaction to ensure exact total
//       let remainingDebitAmount = parseFloat(
//         (totalDebitAmount - debitSplitAmount * (debitCount - 1)).toFixed(2)
//       );

//       for (let i = 0; i < debitCount; i++) {
//         // Use the debitSplitAmount for all transactions except the last one
//         const debitAmount =
//           i === debitCount - 1 ? remainingDebitAmount : debitSplitAmount;

//         // Get a random note for debit transaction
//         const randomDebitNote =
//           debitTradeNotes[Math.floor(Math.random() * debitTradeNotes.length)];

//         transactions.push({
//           type: "debit",
//           amount: debitAmount.toFixed(2),
//           transactionType: "Fee Deduction",
//           description: randomDebitNote,
//           index: i,
//           total: debitCount
//         });
//       }

//       // Shuffle the transactions array to mix credit and debit transactions
//       for (let i = transactions.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [transactions[i], transactions[j]] = [transactions[j], transactions[i]];
//       }

//       // Insert all transactions in the shuffled order
//       for (const transaction of transactions) {
//         const insertData = [
//           userId,
//           transaction.amount,
//           transaction.transactionType,
//           onAmount,
//           roi_per,
//           transaction.description,
//           transaction.type, // credit or debit
//           "USDT",
//           "self",
//           pair,
//         ];

//         await new Promise((resolve, reject) => {
//           db.query(insertQuery, insertData, (err) => {
//             if (err) {
//               console.error(
//                 `❌ Error inserting ${transaction.type} transaction ${transaction.index + 1}/${transaction.total}:`,
//                 err
//               );
//               return reject(err);
//             }
//             console.log(
//               `✅ ROI ${transaction.type} transaction ${
//                 transaction.index + 1
//               }/${transaction.total} recorded for user ${userId} with amount ${transaction.amount}`
//             );
//             resolve();
//           });
//         });
//       }

//       // Get user's activation date to check for plan_id 4 special condition
//       const userInfoQuery = `
//           SELECT activation_date FROM users
//           WHERE id = ?
//         `;

//       const userInfo = await new Promise((resolve, reject) => {
//         db.query(userInfoQuery, [userId], (err, results) => {
//           if (err) return reject(err);
//           if (results.length === 0) return resolve({ activation_date: null });
//           resolve({
//             activation_date: results[0].activation_date,
//           });
//         });
//       });

//       // Calculate days since activation
//       const activationDate = userInfo.activation_date
//         ? new Date(userInfo.activation_date)
//         : null;
//       const currentDate = new Date();
//       const daysSinceActivation = activationDate
//         ? Math.floor((currentDate - activationDate) / (1000 * 60 * 60 * 24))
//         : 0;

//       // If transaction count is 10 and active_plan > 100, subtract 100 from active_plan and compound_income
//       if (daysSinceActivation >= 10 && active_plan >= 100) {
//         const updateUserQuery = `
//           UPDATE users
//           SET active_plan = active_plan - 100
//           WHERE id = ?
//         `;

//         await db
//           .promise()
//           .query(
//             `INSERT INTO topup (userby_id, userto_id, amount, note) VALUES (?, ?, ?, ?)`,
//             [id, id, 100, "Trade bonus deducted"]
//           );

//         await new Promise((resolve, reject) => {
//           db.query(updateUserQuery, [userId], (err, results) => {
//             if (err) {
//               console.error("❌ Error updating user plan and income:", err);
//               return reject(err);
//             }
//             console.log(
//               `✅ Updated active_plan and compound_income for user ${userId}`
//             );
//             resolve();
//           });
//         });

//         // If plan_id is 4 AND at least 10 days have passed since activation, reset plan details
//         if (plan_id === 4 && daysSinceActivation >= 10) {
//           const updatePlanQuery = `
//             UPDATE users
//             SET plan_id = 0,
//                 roi_status = 'close',
//                 level_status = 'close',
//                 active_plan = 0,
//                 roi_day = 0,
//                 roi_income = 0
//             WHERE id = ?
//           `;

//           await new Promise((resolve, reject) => {
//             db.query(updatePlanQuery, [userId], (err, results) => {
//               if (err) {
//                 console.error(
//                   "❌ Error updating plan details for plan_id=4:",
//                   err
//                 );
//                 return reject(err);
//               }
//               console.log(
//                 `✅ Reset plan details for user ${userId} with plan_id=4`
//               );
//               resolve();
//             });
//           });
//         }
//       }
//     }

//     return res.status(200).json({
//       message: "ROI income updated successfully for the user",
//       user_id: userId,
//       roi: roiIncome.toFixed(2),
//     });
//   } catch (error) {
//     console.error("Error updating ROI for single user:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal Server Error", error: error.message });
//   }
// });

exports.getLatestRoiDate = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const query = `
    SELECT createdAt 
    FROM roi_transaction
    WHERE user_id = ? 
    ORDER BY createdAt DESC 
    LIMIT 1
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Database query error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No ROI transactions found for this user." });
    }

    return res.status(200).json({ latestRoiDate: results[0].createdAt });
  });
});
