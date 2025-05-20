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


// exports.processSelfTrade = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const { id } = req.params;
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

//     // ✅ Get plan details
//     let planDetails;
//     try {
//       planDetails = await fetchPlanById(plan_id);
//     } catch (error) {
//       return res.status(404).json({ message: "User plan not found" });
//     }



//     const roi_percentage = planDetails.ROI_overall;
//     const roiIncome = (active_plan * roi_percentage) / 100;
//     const currentDate = new Date().toISOString().split("T")[0];

    

//     // ✅ Update ROI Income
//     const { isUpdated, onAmount } = await updateUserROIIncome(
//       userId,
//       roiIncome.toFixed(2)
//     );

//     if (isUpdated) {
//       const insertQuery = `
//   INSERT INTO roi_transaction
//   (user_id, amount, type, onamount, percent, description, currency, transaction_by)
//   VALUES (?, ?, ?, ?, ?, ?, ?, ?)
// `;

//       const selfTradeNotes = [
//         "Executed a profitable trade today",
//         "Completed today's trade successfully",
//       ];

//       const randomNote =
//         selfTradeNotes[Math.floor(Math.random() * selfTradeNotes.length)];
//       const insertData = [
//         userId,
//         roiIncome.toFixed(2),
//         "Invest ROI",
//         active_plan,
//         roi_percentage,
//         `${randomNote}`,
//         "USD",
//         "self", // Or "admin" if manually triggered
//       ];

//       await new Promise((resolve, reject) => {
//         db.query(insertQuery, insertData, (err) => {
//           if (err) {
//             console.error("❌ Error inserting transaction:", err);
//             return reject(err);
//           }
//           console.log(`✅ ROI transaction recorded for user ${userId}`);
//           resolve();
//         });
//       });
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

    // Get user directly from DB
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

    const { plan_id, active_plan } = user;

    if (!plan_id || !active_plan) {
      return res
        .status(400)
        .json({ message: "User does not have an active plan" });
    }

    // Get all plans from the database sorted by price descending
    const getAllPlansQuery = `SELECT id, name, monthly_price, description, ROI_day, ROI_overall, Sponser_bonus, plan_period, max, min, compound_roi, bonus FROM plans ORDER BY monthly_price DESC`;
    const allPlans = await new Promise((resolve, reject) => {
      db.query(getAllPlansQuery, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (!allPlans || allPlans.length === 0) {
      return res.status(404).json({ message: "No plans found in the system" });
    }

    let remainingAmount = active_plan;
    const matchedPlans = [];
    
    // Find all matching plans that fit into the active_plan amount
    for (const plan of allPlans) {
      if (remainingAmount <= 0) break;
      
      if (plan.monthly_price <= remainingAmount) {
        const count = Math.floor(remainingAmount / plan.monthly_price);
        if (count > 0) {
          matchedPlans.push({
            plan,
            count,
            amount: plan.monthly_price * count
          });
          remainingAmount -= plan.monthly_price * count;
        }
      }
    }

    // If there's any remaining amount that doesn't match any plan
    if (remainingAmount > 0) {
      return res.status(400).json({ 
        message: `User's active plan amount includes $${remainingAmount} that doesn't match any available plan`,
        user_active_plan: active_plan,
        matched_plans: matchedPlans.map(p => ({
          plan_id: p.plan.id,
          name: p.plan.name,
          monthly_price: p.plan.monthly_price,
          count: p.count,
          amount: p.amount
        })),
        available_plans: allPlans.map(p => ({ 
          id: p.id, 
          name: p.name, 
          monthly_price: p.monthly_price 
        }))
      });
    }

    // Process ROI for each matched plan
    const transactionResults = [];
    let totalRoi = 0;

    for (const { plan, count, amount } of matchedPlans) {
      const roi_percentage = plan.ROI_overall;
      const roiIncome = (amount * roi_percentage) / 100;
      totalRoi += roiIncome;

      // Update ROI Income
      const { isUpdated } = await updateUserROIIncome(
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
          `ROI from ${count} x ${plan.name} ($${plan.monthly_price}) plan`,
          `Daily return from ${plan.name} investment`,
          `Completed trade for ${plan.name} plan`,
          `Processed ${count} units of ${plan.name}`
        ];

        const randomNote =
          selfTradeNotes[Math.floor(Math.random() * selfTradeNotes.length)];
        const insertData = [
          userId,
          roiIncome.toFixed(2),
          "Invest ROI",
          amount,
          roi_percentage,
          `${randomNote}`,
          "USD",
          "self",
        ];

        await new Promise((resolve, reject) => {
          db.query(insertQuery, insertData, (err) => {
            if (err) {
              console.error("❌ Error inserting transaction:", err);
              return reject(err);
            }
            console.log(`✅ ROI transaction recorded for user ${userId} for plan ${plan.name}`);
            resolve();
          });
        });

        transactionResults.push({
          plan_id: plan.id,
          plan_name: plan.name,
          unit_price: plan.monthly_price,
          units: count,
          amount: amount,
          roi_percentage: roi_percentage,
          roi_income: roiIncome.toFixed(2)
        });
      }
    }

    return res.status(200).json({
      message: "ROI income updated successfully for the user",
      user_id: userId,
      total_roi: totalRoi.toFixed(2),
      transactions: transactionResults,
      remaining_amount: remainingAmount > 0 ? remainingAmount : 0
    });
  } catch (error) {
    console.error("Error updating ROI for single user:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});
                                                             

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
