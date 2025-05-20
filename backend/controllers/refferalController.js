
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
const asyncHandler = require("express-async-handler");
const fetchSetRoiFromAdminSettings = require("../utils/settings");

const mysql = require("mysql2/promise");

// Create a pool connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "rtor",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

exports.getReferralTree = catchAsyncErrors(async (request, response, next) => {
  const { referral_code } = request.params;

  const fetchReferralTree = async (referralCode) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id,username,is_active,active_plan,created_at,email,status FROM users WHERE reffer_by = ?`;
      db.query(sql, [referralCode], async (err, result) => {
        if (err) {
          console.error(
            `Error fetching tree for referral code ${referralCode}:`,
            err
          );
          return reject(new ErrorHandler("Error fetching tree!", 500));
        }
        const tree = [];
        for (const user of result) {
          tree.push({ ...user });
        }
        resolve(tree);
      });
    });
  };

  try {
    const referralTree = await fetchReferralTree(referral_code);
    if (referralTree.length > 0) {
      response.status(200).json({ referralTree: referralTree });
    } else {
      response.status(200).json({ referralTree: [] });
    }
  } catch (error) {
    console.error("Error fetching tree:", error);
    next(new ErrorHandler("Error fetching tree!", 500));
  }
});

exports.getFullReferralTree = catchAsyncErrors(
  async (request, response, next) => {
    const { referral_code } = request.params;

    const fetchReferralTree = async (referralCode) => {
      return new Promise((resolve, reject) => {
        const sql = `SELECT id, username, is_active, created_at,active_plan, email, status, refferal_code FROM users WHERE reffer_by = ?`;
        db.query(sql, [referralCode], async (err, result) => {
          if (err) {
            console.error(
              `Error fetching full tree for referral code ${referralCode}:`,
              err
            );
            return reject(new ErrorHandler("Error fetching tree!", 500));
          }
          const tree = [];
          for (const user of result) {
            const userTree = await fetchReferralTree(user.refferal_code);
            tree.push({ ...user, referrals: userTree });
          }
          resolve(tree);
        });
      });
    };

    try {
      const referralTree = await fetchReferralTree(referral_code);
      if (referralTree.length > 0) {
        response.status(200).json({ treeData: referralTree });
      } else {
        response.status(200).json({ treeData: [] });
      }
    } catch (error) {
      console.error("Error fetching full referral tree:", error);
      next(new ErrorHandler("Error fetching tree!", 500));
    }
  }
);

const fetchAllUsers = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, is_active, status, roi_day, refferal_code, reffer_by,level_status FROM users;`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching all users:", err);
        return reject(new Error("Error fetching users!"));
      }
      resolve(result);
    });
  });
};

const batchInsertTransactions = async (transactions) => {
  if (transactions.length === 0) return;

  try {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Create placeholders for the WHERE IN clause - each row needs 6 parameters
      const checkPlaceholders = transactions
        .map(() => "(?, ?, ?, ?, ?, ?)")
        .join(", ");

      // Flatten the array of parameters
      const checkValues = transactions.flatMap((t) => [
        t.userId,
        t.userby_id,
        t.type,
        t.amount,
        t.onamount,
        t.percent,
      ]);

      // Query to find existing transactions today
      const checkQuery = `
        SELECT user_id, userby_id, type, amount, onamount, percent
        FROM invest_level_transaction
        WHERE DATE(createdAt) = DATE(NOW())
        AND (user_id, userby_id, type, amount, onamount, percent) IN (${checkPlaceholders})
      `;

      const [existingTransactions] = await connection.query(
        checkQuery,
        checkValues
      );

      // Create a Set of existing transaction keys for fast lookup
      const existingSet = new Set();
      existingTransactions.forEach((tx) => {
        const key = `${tx.user_id}-${tx.userby_id}-${tx.type}-${tx.amount}-${tx.onamount}-${tx.percent}`;
        existingSet.add(key);
      });

      // Filter out transactions that already exist
      const newTransactions = transactions.filter((t) => {
        const key = `${t.userId}-${t.userby_id}-${t.type}-${t.amount}-${t.onamount}-${t.percent}`;
        return !existingSet.has(key);
      });

      console.log(
        `Found ${existingTransactions.length} existing transactions, proceeding with ${newTransactions.length} new transactions`
      );

      // If there are no new transactions, just return
      if (newTransactions.length === 0) {
        await connection.commit();
        return { affectedRows: 0, message: "No new transactions to insert" };
      }

      // Prepare the INSERT query for new transactions
      const insertPlaceholders = newTransactions
        .map(() => "(?, ?, ?, ?, ?, ?, NOW())")
        .join(", ");
      const insertValues = newTransactions.flatMap((t) => [
        t.userId,
        t.userby_id,
        t.type,
        t.amount,
        t.onamount,
        t.percent,
      ]);

      const insertQuery = `
        INSERT INTO invest_level_transaction 
        (user_id, userby_id, type, amount, onamount, percent, createdAt)
        VALUES ${insertPlaceholders}
      `;

      const [result] = await connection.query(insertQuery, insertValues);
      await connection.commit();

      console.log(
        `Batch insert complete. ${result.affectedRows} rows inserted.`
      );
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error in batch insert:", error);
    throw new Error("Error in batch insert transactions");
  }
};


const fetchInvestmentPlan = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM invest_level`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching investment plan:", err);
        return reject(new Error("Error fetching investment plan!"));
      }
      resolve(result); // Assuming only one row is fetched
    });
  });
};

const calculateCommissionForUser = async (user, investPlan) => {
  if (user.is_active !== "active") {
    return 0; // If the user is inactive, return 0 commission
  }

  let totalCommission = 0;

  // Level percentages for each level (up to level 20)
  const levelPercentages = [
    investPlan.level_1,
    investPlan.level_2,
    investPlan.level_3,
    investPlan.level_4,
    investPlan.level_5,
    investPlan.level_6,
    investPlan.level_7,
    investPlan.level_8,
    investPlan.level_9,
    investPlan.level_10,
    investPlan.level_11,
    investPlan.level_12,
    investPlan.level_13,
    investPlan.level_14,
    investPlan.level_15,
    investPlan.level_16,
    investPlan.level_17,
    investPlan.level_18,
    investPlan.level_19,
    investPlan.level_20,
  ];

  const directChildrenCount = user.referrals.filter(
    (ref) => ref.is_active === "active"
  ).length;

  let maxLevel;
  if (directChildrenCount >= 11) {
    maxLevel = 20;
  } else {
    maxLevel = Math.min(directChildrenCount * 1, 20);
  }

  // Create a batch array to collect transactions
  const transactionBatch = [];
  const BATCH_SIZE = 500; // Adjust based on your needs

  const queue = [];
  queue.push(...user.referrals.map((child) => ({ referral: child, level: 1 })));

  while (queue.length > 0) {
    const { referral, level } = queue.shift();
    if (referral.is_active === "active" && level <= maxLevel) {
      const commission =
        (referral.level_status === "close" ||
        referral.status === "block" ||
        referral.is_active === "inactive"
          ? 0
          : referral.roi_day || 0) *
        (levelPercentages[level - 1] / 100);

      totalCommission += commission;

      // Skip zero amount transactions
      if (commission > 0) {
        transactionBatch.push({
          userId: user.id,
          userby_id: referral.id,
          type: `invest Level ${level}`,
          amount: commission,
          onamount: referral.roi_day,
          percent: levelPercentages[level - 1],
        });
      }

      // Process batch if it reaches the batch size
      if (transactionBatch.length >= BATCH_SIZE) {
        await batchInsertTransactions(transactionBatch);
        transactionBatch.length = 0; // Clear the array
      }

      if (referral.referrals && level < levelPercentages.length) {
        queue.push(
          ...referral.referrals.map((child) => ({
            referral: child,
            level: level + 1,
          }))
        );
      }
    }
  }

  // Process any remaining transactions
  if (transactionBatch.length > 0) {
    await batchInsertTransactions(transactionBatch);
  }

  return totalCommission;
};

const updateUserCommission = async (userId, newCommission) => {
  return new Promise((resolve, reject) => {
    if (isNaN(newCommission)) {
      console.error(
        `Invalid commission value for user ${userId}:`,
        newCommission
      );
      return reject(new Error("Invalid commission value!"));
    }

    // Fetch user details for calculations
    const fetchUserSql = `SELECT max_amount, active_plan FROM users WHERE id = ? AND status = 'unblock'`;

    db.query(fetchUserSql, [userId], (err, userResult) => {
      if (err) {
        console.error(
          `Error fetching user details for User ID ${userId}:`,
          err
        );
        return reject(new Error("Error fetching user details!"));
      }

      if (userResult.length === 0) {
        return resolve(null); // No user found or user is blocked
      }

      const { max_amount, active_plan } = userResult[0];
      const maxLimit = 5 * active_plan;
      let finalCommission = newCommission;

      // Check if adding the commission exceeds the max limit
      if (max_amount + newCommission > maxLimit) {
        finalCommission = maxLimit - max_amount; // Cap the commission to fit within the limit
      }

      const sqlUpdate = `
          UPDATE users 
          SET 
            level_day =  ?, 
            max_amount = max_amount + ?, 
            level_month = level_month + ?,
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
          WHERE id = ? AND status = 'unblock'
        `;

      db.query(
        sqlUpdate,
        [
          finalCommission, // Investment level income
          finalCommission, // Investment level income
          finalCommission, // Max amount
          finalCommission, // Investment month
          finalCommission,
          maxLimit, // For status condition
          finalCommission,
          maxLimit, // For ROI status condition
          finalCommission,
          maxLimit, // For level status condition
          userId,
        ],
        (err) => {
          if (err) {
            console.error(
              `Error updating user commission for user ${userId}:`,
              err
            );
            return reject(new Error("Error updating user commission!"));
          }
          resolve();
        }
      );
    });
  });
};

const calculateCommissionForAllUsers = async (request, response, next) => {
  try {
    const users = await fetchAllUsers();
    const userMap = new Map();
    const processedUsers = new Set(); // Track processed users by ID
    const processingUsers = new Set(); // Track users currently being processed
    const Plan = await fetchInvestmentPlan();
    const investPlan = Plan[0];
    const compoundPlan = Plan[1];

    // Initialize referrals array for each user
    users.forEach((user) => {
      user.referrals = [];
      userMap.set(user.refferal_code, user);
    });

    // Build referral tree
    users.forEach((user) => {
      const parent = userMap.get(user.reffer_by);
      if (parent) {
        parent.referrals.push(user);
      } else if (user.reffer_by && user.reffer_by.trim() !== "") {
        console.warn(
          `User ${user.id} has an invalid reffer_by code: ${user.reffer_by}`
        );
      }
    });

    // Helper function to process a single user with double-processing prevention
    const processUser = async (user) => {
      // Return immediately if already processed or currently processing
      if (processedUsers.has(user.id) || processingUsers.has(user.id)) {
        return;
      }

      // Mark as currently processing
      processingUsers.add(user.id);

      try {
        console.log(`Processing user ${user.id}`);
        const data = await calculateCommissionForUser(
          user,
          investPlan,
          compoundPlan
        );
        console.log(data);
        await updateUserCommission(user.id, data);

        // Mark as fully processed
        processedUsers.add(user.id);
        console.log(`Successfully processed user ${user.id}`);
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
      } finally {
        // Remove from processing set regardless of success/failure
        processingUsers.delete(user.id);
      }
    };

    // Process users starting from root nodes
    const rootUsers = users.filter(
      (user) => !user.reffer_by || user.reffer_by.trim() === ""
    );
    //  console.log(users)
    // Create a processing queue with breadth-first traversal
    const processQueue = async () => {
      const queue = [...users];

      while (queue.length > 0) {
        const user = queue.shift();

        // Skip already processed users
        if (processedUsers.has(user.id)) {
          continue;
        }

        // Process this user
        await processUser(user);

        // Add unprocessed children to the queue
        for (const referral of user.referrals) {
          if (
            !processedUsers.has(referral.id) &&
            !processingUsers.has(referral.id)
          ) {
            queue.push(referral);
          }
        }
      }
    };

    await processQueue();

    response.status(200).json({
      message: `All commissions calculated and updated successfully. Processed ${processedUsers.size} users.`,
      processedCount: processedUsers.size,
    });
  } catch (error) {
    console.error("Error calculating commissions:", error);
    response.status(500).json({
      message: "Error calculating commissions",
      error: error.message,
    });
  }
};

exports.calculateCommissionForAllUsers = calculateCommissionForAllUsers;
