const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");

exports.salary = catchAsyncErrors(async (req, res, next) => {
  try {
    // If userId is provided, process only that user, otherwise process all active users

    const [usersToProcess] = await db
      .promise()
      .query(
        `SELECT id, username, is_active, active_plan, refferal_code, reward_level, salary, reffer_by, plan_id, reward, max_amount FROM users WHERE is_active = 'active'`
      );

    const processedUsers = [];
    const skippedUsers = [];

    // Process each user
    for (const user of usersToProcess) {
     
      // Check if user has been updated today already
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

      const [lastTransaction] = await db
        .promise()
        .query(
          "SELECT * FROM salary_transactions WHERE user_id = ? AND DATE(transaction_date) = ?",
          [user.id, today]
        );

      // Skip if user already has a transaction today
      if (lastTransaction.length > 0) {
        skippedUsers.push({
          id: user.id,
          username: user.username,
          reason: "Already processed today",
        });
        continue;
      }

      // 1. Calculate direct children (users who have this user's referral code as their reffer_by)
      const [directReferrals] = await db
        .promise()
        .query(
          `SELECT COUNT(*) as directCount FROM users WHERE reffer_by = ? AND active_plan > 0`,
          [user.refferal_code]
        );

      if (user.id == 11) {
          console.log(directReferrals);
        }
      const directCount = directReferrals[0].directCount;

      // 2. Find the appropriate salary row based on number of directs
      const [salaryRow] = await db
        .promise()
        .query(
          "SELECT id, amount, duration, directs FROM salary WHERE directs <= ? ORDER BY directs DESC LIMIT 1",
          [directCount]
        );

      // Skip if no matching salary level found
      if (salaryRow.length === 0) {
        skippedUsers.push({
          id: user.id,
          username: user.username,
          reason: "No matching salary tier",
        });
        continue;
      }

      const salaryId = salaryRow[0].id;
      const salaryAmount = salaryRow[0].amount;
      const salaryDuration = parseInt(salaryRow[0].duration, 10); // Ensure it's an integer
      const salaryDirects = parseInt(salaryRow[0].directs, 10);

      // Get the user's current/previous salary record to compare directs
      const [currentSalaryRecord] = await db.promise().query(
        `SELECT us.*, s.directs 
         FROM user_salary us
         JOIN salary s ON us.salary_id = s.id
         WHERE us.user_id = ? 
         ORDER BY us.assigned_date DESC LIMIT 1`,
        [user.id]
      );

      // Check if the new directs threshold is higher than the previous one
      if (currentSalaryRecord.length > 0) {
        const currentDirects = parseInt(currentSalaryRecord[0].directs, 10);

        if (salaryDirects <= currentDirects) {
          skippedUsers.push({
            id: user.id,
            username: user.username,
            reason: "New direct count not higher than previous",
            current: currentDirects,
            new: salaryDirects,
          });
          continue;
        }
      }

      // Calculate max limit based on user's plan
      // Get the user's plan limit

      const limitPlan = parseFloat(user.active_plan);
      const multiPlier = 5;
      const maxLimit = multiPlier * limitPlan;

      // Calculate final salary amount based on max limit
      let finalSalaryAmount = salaryAmount;
      const userMaxAmount = parseFloat(user.max_amount) || 0;

      if (userMaxAmount + salaryAmount > maxLimit) {
        finalSalaryAmount = maxLimit - userMaxAmount; // Cap the salary
        console.log(
          `Salary capped for User ID ${user.id}. Original: ${salaryAmount}, Final: ${finalSalaryAmount}`
        );

        // If no salary can be added, skip this user
        if (finalSalaryAmount <= 0) {
          skippedUsers.push({
            id: user.id,
            username: user.username,
            reason: "User has reached maximum reward limit",
            maxLimit: maxLimit,
            currentAmount: userMaxAmount,
          });
          continue;
        }
      }

      // 3. Check if user already has an entry in user_salary table
      const [existingSalary] = await db
        .promise()
        .query(
          "SELECT * FROM user_salary WHERE user_id = ? AND salary_id = ?",
          [user.id, salaryId]
        );

      const currentDate = new Date();
      const formattedDate = currentDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      // Calculate remaining days (reduce by 1 if updating)
      let remainingDays = salaryDuration;
      if (existingSalary.length > 0) {
        remainingDays = parseInt(existingSalary[0].remaining, 10) - 1;
        if (remainingDays < 0) remainingDays = 0;
      }

      // If user already has this salary level, update the existing entry
      if (existingSalary.length > 0) {
        await db
          .promise()
          .query(
            "UPDATE user_salary SET duration = ?, remaining = ?, assigned_date = ? WHERE user_id = ? AND salary_id = ?",
            [salaryDuration, remainingDays-1, formattedDate, user.id, salaryId]
          );
      } else {
        // Create a new user_salary entry
        await db
          .promise()
          .query(
            "INSERT INTO user_salary (user_id, salary_id, duration, remaining, assigned_date) VALUES (?, ?, ?, ?, ?)",
            [user.id, salaryId, salaryDuration, remainingDays-1, formattedDate]
          );
      }

      await db.promise().query(
        `UPDATE users
         SET 
           salary = salary + ?,
           max_amount = max_amount + ?,
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
         WHERE id = ? AND status = 'unblock'`,
        [
          finalSalaryAmount,
          finalSalaryAmount,
          finalSalaryAmount,
          maxLimit,
          finalSalaryAmount,
          maxLimit,
          finalSalaryAmount,
          maxLimit,
          user.id,
        ]
      );

      // 5. Add entry to salary_transaction table
      await db
        .promise()
        .query(
          "INSERT INTO salary_transactions (salary_id, user_id, transaction_date, paid_amount, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)",
          [
            salaryId,
            user.id,
            formattedDate,
            finalSalaryAmount,
            `Salary assigned based on ${directCount} direct referrals`,
            formattedDate,
          ]
        );

      processedUsers.push({
        id: user.id,
        username: user.username,
        direct_count: directCount,
        salary_amount: finalSalaryAmount,
        duration_days: salaryDuration,
        remaining_days: remainingDays,
        max_limit: maxLimit,
        current_max_amount: userMaxAmount + finalSalaryAmount,
      });
    }

    res.json({
      success: true,
      message: "Salary process completed",
      processed: processedUsers.length,
      skipped: skippedUsers.length,
      processed_users: processedUsers,
      skipped_users: skippedUsers,
    });
  } catch (error) {
    console.error("Error in salary calculation:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Controller to get salary statistics for a user
exports.getUserSalaryStats = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Get user details
    const [user] = await db.query(
      "SELECT id, username, refferal_code, salary FROM users WHERE id = ?",
      [userId]
    );

    if (user.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Get direct referrals count
    const [directReferrals] = await db.query(
      "SELECT COUNT(*) as directCount FROM users WHERE reffer_by = ? AND is_active = 1",
      [user[0].refferal_code]
    );

    // Get current salary details
    const [currentSalary] = await db.query(
      `SELECT us.*, s.amount, s.directs 
       FROM user_salary us
       JOIN salary s ON us.salary_id = s.id
       WHERE us.user_id = ?
       ORDER BY us.assigned_date DESC LIMIT 1`,
      [userId]
    );

    // Get transaction history
    const [transactions] = await db.query(
      `SELECT st.*, s.amount, s.directs
       FROM salary_transaction st
       JOIN salary s ON st.salary_id = s.id
       WHERE st.user_id = ?
       ORDER BY st.transaction_date DESC`,
      [userId]
    );

    res.json({
      success: true,
      user: {
        id: user[0].id,
        username: user[0].username,
        current_salary: user[0].salary,
      },
      stats: {
        direct_referrals: directReferrals[0].directCount,
        current_salary_plan:
          currentSalary.length > 0
            ? {
                amount: currentSalary[0].amount,
                required_directs: currentSalary[0].directs,
                duration: parseInt(currentSalary[0].duration, 10),
                remaining_days: parseInt(currentSalary[0].remaining, 10),
                assigned_date: currentSalary[0].assigned_date,
              }
            : null,
        transaction_history: transactions,
      },
    });
  } catch (error) {
    console.error("Error fetching salary stats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Controller to decrease remaining days and handle expired salaries
exports.processDailySalary = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get all active salary assignments
    const [activeSalaries] = await db
      .promise()
      .query("SELECT * FROM user_salary WHERE remaining > 0");

    const processed = [];
    const expired = [];

    for (const salary of activeSalaries) {
      // Decrease remaining days by 1
      const newRemaining = parseInt(salary.remaining, 10) - 1;

      // Update remaining days
      await db
        .promise()
        .query(
          "UPDATE user_salary SET remaining = ? WHERE user_salary_id = ?",
          [newRemaining, salary.user_salary_id]
        );

      // If remaining reaches 0, mark as expired and reset user's salary
      if (newRemaining <= 0) {
        await db
          .promise()
          .query("UPDATE users SET salary = 0 WHERE id = ?", [salary.user_id]);

        expired.push({
          user_id: salary.user_id,
          salary_id: salary.salary_id,
        });
      } else {
        processed.push({
          user_id: salary.user_id,
          salary_id: salary.salary_id,
          remaining_days: newRemaining,
        });
      }
    }

    res.json({
      success: true,
      message: "Daily salary processing completed",
      processed_count: processed.length,
      expired_count: expired.length,
      processed: processed,
      expired: expired,
    });
  } catch (error) {
    console.error("Error in daily salary processing:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Controller to get user_salary entries with filtering and pagination
exports.getUserSalaries = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get query parameters for filtering
    const {
      user_id,
      salary_id,
      date_from,
      date_to,
      min_duration,
      max_duration,
      min_remaining,
      max_remaining,
      page = 1,
      limit = 10,
      sort_by = "assigned_date",
      sort_order = "DESC",
    } = req.query;


    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build query conditions
    let conditions = [];
    let params = [];

    // Add filters if provided
    if (user_id) {
      conditions.push("us.user_id = ?");
      params.push(user_id);
    }

    if (salary_id) {
      conditions.push("us.salary_id = ?");
      params.push(salary_id);
    }

    if (date_from) {
      conditions.push("us.assigned_date >= ?");
      params.push(date_from);
    }

    if (date_to) {
      conditions.push("us.assigned_date <= ?");
      params.push(date_to);
    }

    if (min_duration) {
      conditions.push("us.duration >= ?");
      params.push(min_duration);
    }

    if (max_duration) {
      conditions.push("us.duration <= ?");
      params.push(max_duration);
    }

    if (min_remaining) {
      conditions.push("us.remaining >= ?");
      params.push(min_remaining);
    }

    if (max_remaining) {
      conditions.push("us.remaining <= ?");
      params.push(max_remaining);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Validate sort column to prevent SQL injection
    const validSortColumns = [
      "id",
      "user_id",
      "salary_id",
      "duration",
      "remaining",
      "assigned_date",
    ];
    const validSortOrders = ["ASC", "DESC"];

    const sanitizedSortBy = validSortColumns.includes(sort_by)
      ? sort_by
      : "assigned_date";
    const sanitizedSortOrder = validSortOrders.includes(
      sort_order.toUpperCase()
    )
      ? sort_order.toUpperCase()
      : "DESC";

    // Get total count for pagination
    const [countResult] = await db
      .promise()
      .query(
        `SELECT COUNT(*) as total FROM user_salary us ${whereClause}`,
        params
      );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Execute main query
    const [userSalaries] = await db.promise().query(
      `SELECT 
         us.*,
         u.username,
         s.amount as salary_amount,
         s.directs as required_directs
       FROM 
         user_salary us
       LEFT JOIN 
         users u ON us.user_id = u.id
       LEFT JOIN 
         salary s ON us.salary_id = s.id
       ${whereClause}
       ORDER BY us.${sanitizedSortBy} ${sanitizedSortOrder}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      success: true,
      total,
      total_pages: totalPages,
      current_page: parseInt(page),
      per_page: parseInt(limit),
      data: userSalaries,
    });
  } catch (error) {
    console.error("Error fetching user salaries:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Controller to get salary_transactions with filtering and pagination
exports.getSalaryTransactions = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get query parameters for filtering
    const {
      user_id,
      salary_id,
      date_from,
      date_to,
      min_amount,
      max_amount,
      page = 1,
      limit = 10,
      sort_by = "transaction_date",
      sort_order = "DESC",
    } = req.query;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build query conditions
    let conditions = [];
    let params = [];

    // Add filters if provided
    if (user_id) {
      conditions.push("st.user_id = ?");
      params.push(user_id);
    }

    if (salary_id) {
      conditions.push("st.salary_id = ?");
      params.push(salary_id);
    }

    if (date_from) {
      conditions.push("st.transaction_date >= ?");
      params.push(date_from);
    }

    if (date_to) {
      conditions.push("st.transaction_date <= ?");
      params.push(date_to);
    }

    if (min_amount) {
      conditions.push("st.paid_amount >= ?");
      params.push(min_amount);
    }

    if (max_amount) {
      conditions.push("st.paid_amount <= ?");
      params.push(max_amount);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Validate sort column to prevent SQL injection
    const validSortColumns = [
      "id",
      "user_id",
      "salary_id",
      "transaction_date",
      "paid_amount",
      "created_at",
    ];
    const validSortOrders = ["ASC", "DESC"];

    const sanitizedSortBy = validSortColumns.includes(sort_by)
      ? sort_by
      : "transaction_date";
    const sanitizedSortOrder = validSortOrders.includes(
      sort_order.toUpperCase()
    )
      ? sort_order.toUpperCase()
      : "DESC";

    // Get total count for pagination
    const [countResult] = await db
      .promise()
      .query(
        `SELECT COUNT(*) as total FROM salary_transactions st ${whereClause}`,
        params
      );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Execute main query
    const [transactions] = await db.promise().query(
      `SELECT 
         st.*,
         u.username,
         s.amount as salary_amount,
         s.directs as required_directs
       FROM 
         salary_transactions st
       LEFT JOIN 
         users u ON st.user_id = u.id
       LEFT JOIN 
         salary s ON st.salary_id = s.id
       ${whereClause}
       ORDER BY st.${sanitizedSortBy} ${sanitizedSortOrder}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      success: true,
      total,
      total_pages: totalPages,
      current_page: parseInt(page),
      per_page: parseInt(limit),
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching salary transactions:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Controller to get a user's salary history
exports.getUserSalaryHistory = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Get user details
    const [user] = await db
      .promise()
      .query(
        "SELECT id, username, refferal_code, salary, max_amount, reward_level FROM users WHERE id = ?",
        [userId]
      );

    if (user.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Get user's current salary entry
    const [currentSalary] = await db.promise().query(
      `SELECT 
         us.*,
         s.amount,
         s.directs
       FROM 
         user_salary us
       JOIN 
         salary s ON us.salary_id = s.id
       WHERE 
         us.user_id = ?
       ORDER BY 
         us.assigned_date DESC
       LIMIT 1`,
      [userId]
    );

    // Get direct referrals count
    const [directReferrals] = await db
      .promise()
      .query(
        "SELECT COUNT(*) as directCount FROM users WHERE reffer_by = ? AND is_active = 1",
        [user[0].refferal_code]
      );

    // Get user's salary transaction history
    const [transactionHistory] = await db.promise().query(
      `SELECT 
         st.*,
         s.directs
       FROM 
         salary_transactions st
       JOIN 
         salary s ON st.salary_id = s.id
       WHERE 
         st.user_id = ?
       ORDER BY 
         st.transaction_date DESC
       LIMIT 20`,
      [userId]
    );

    // Calculate stats
    const [stats] = await db.promise().query(
      `SELECT 
         COUNT(*) as total_transactions,
         SUM(paid_amount) as total_received,
         MAX(paid_amount) as highest_payment,
         AVG(paid_amount) as average_payment
       FROM 
         salary_transactions
       WHERE 
         user_id = ?`,
      [userId]
    );

    res.json({
      success: true,
      user: user[0],
      direct_referrals: directReferrals[0].directCount,
      current_salary: currentSalary.length > 0 ? currentSalary[0] : null,
      stats: stats[0],
      transaction_history: transactionHistory,
    });
  } catch (error) {
    console.error("Error fetching user salary history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Controller to get detailed stats for all salary tiers
exports.getSalaryTierStats = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get basic stats for each salary tier
    const [salaryTiers] = await db.promise().query(
      `SELECT 
         s.id,
         s.directs,
         s.amount,
         s.duration,
         COUNT(DISTINCT us.user_id) as active_users,
         COUNT(DISTINCT st.id) as transaction_count,
         SUM(st.paid_amount) as total_paid
       FROM 
         salary s
       LEFT JOIN 
         user_salary us ON s.id = us.salary_id AND us.remaining > 0
       LEFT JOIN 
         salary_transactions st ON s.id = st.salary_id
       GROUP BY 
         s.id, s.directs, s.amount, s.duration
       ORDER BY 
         s.directs DESC`
    );

    // Get monthly distribution for each tier
    const [monthlyStats] = await db.promise().query(
      `SELECT 
         s.id as salary_id,
         s.directs,
         DATE_FORMAT(st.transaction_date, '%Y-%m') as month,
         COUNT(st.id) as transaction_count,
         SUM(st.paid_amount) as total_amount
       FROM 
         salary s
       JOIN 
         salary_transactions st ON s.id = st.salary_id
       WHERE 
         st.transaction_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY 
         s.id, s.directs, month
       ORDER BY 
         month DESC, s.directs DESC`
    );

    // Process monthly data into a format easier to use in frontend
    const processedMonthlyData = {};

    monthlyStats.forEach((item) => {
      if (!processedMonthlyData[item.month]) {
        processedMonthlyData[item.month] = [];
      }

      processedMonthlyData[item.month].push({
        salary_id: item.salary_id,
        directs: item.directs,
        transaction_count: item.transaction_count,
        total_amount: item.total_amount,
      });
    });

    res.json({
      success: true,
      salary_tiers: salaryTiers,
      monthly_distribution: processedMonthlyData,
    });
  } catch (error) {
    console.error("Error fetching salary tier stats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Controller to get admin dashboard summary
exports.getAdminSalaryDashboard = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get summary statistics
    const [summary] = await db.promise().query(
      `SELECT 
         (SELECT COUNT(*) FROM users WHERE is_active = 1) as active_users,
         (SELECT COUNT(*) FROM user_salary WHERE remaining > 0) as active_salaries,
         (SELECT SUM(paid_amount) FROM salary_transactions) as total_paid,
         (SELECT SUM(paid_amount) FROM salary_transactions 
          WHERE transaction_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as paid_last_30_days,
         (SELECT COUNT(DISTINCT user_id) FROM salary_transactions) as users_received_salary,
         (SELECT AVG(amount) FROM salary) as avg_salary_amount`
    );

    // Today's activity
    const today = new Date().toISOString().slice(0, 10);
    const [todayActivity] = await db.promise().query(
      `SELECT 
         (SELECT COUNT(*) FROM salary_transactions WHERE DATE(transaction_date) = ?) as today_transactions,
         (SELECT SUM(paid_amount) FROM salary_transactions WHERE DATE(transaction_date) = ?) as today_amount,
         (SELECT COUNT(*) FROM user_salary WHERE DATE(assigned_date) = ?) as today_new_salaries`,
      [today, today, today]
    );

    // Get recent transactions
    const [recentTransactions] = await db.promise().query(
      `SELECT 
         st.*,
         u.username,
         s.directs
       FROM 
         salary_transactions st
       JOIN 
         users u ON st.user_id = u.id
       JOIN 
         salary s ON st.salary_id = s.id
       ORDER BY 
         st.transaction_date DESC
       LIMIT 10`
    );

    // Get salary by tier chart data
    const [salaryByTier] = await db.promise().query(
      `SELECT 
         s.id,
         s.directs,
         s.amount,
         COUNT(st.id) as transaction_count,
         SUM(st.paid_amount) as total_amount
       FROM 
         salary s
       LEFT JOIN 
         salary_transactions st ON s.id = st.salary_id
       GROUP BY 
         s.id, s.directs, s.amount
       ORDER BY 
         s.directs ASC`
    );

    // Get daily transactions for chart (last 30 days)
    const [dailyTransactions] = await db.promise().query(
      `SELECT 
         DATE(transaction_date) as date,
         COUNT(*) as transaction_count,
         SUM(paid_amount) as total_amount
       FROM 
         salary_transactions
       WHERE 
         transaction_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY 
         DATE(transaction_date)
       ORDER BY 
         date ASC`
    );

    res.json({
      success: true,
      summary: summary[0],
      today: todayActivity[0],
      recent_transactions: recentTransactions,
      charts: {
        salary_by_tier: salaryByTier,
        daily_transactions: dailyTransactions,
      },
    });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
// Controller to get today's salary statistics for admin
exports.getTodaySalaryStats = catchAsyncErrors(async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

    // Get total transactions and amount distributed today
    const [todayTransactions] = await db.promise().query(
      `SELECT 
         COUNT(*) as transaction_count,
         SUM(paid_amount) as total_amount
       FROM 
         salary_transactions
       WHERE 
         DATE(transaction_date) = ?`,
      [today]
    );

    // Get count by salary tiers
    const [salaryTierStats] = await db.promise().query(
      `SELECT 
         s.id as salary_id,
         s.directs,
         s.amount,
         COUNT(st.id) as transaction_count,
         SUM(st.paid_amount) as total_amount
       FROM 
         salary_transactions st
       JOIN 
         salary s ON st.salary_id = s.id  
       WHERE 
         DATE(st.transaction_date) = ?
       GROUP BY 
         s.id, s.directs, s.amount
       ORDER BY 
         s.directs DESC`,
      [today]
    );

    // Get active user salaries distribution
    const [activeSalaryStats] = await db.promise().query(
      `SELECT 
         COUNT(*) as total_active,
         SUM(CASE WHEN remaining > 0 THEN 1 ELSE 0 END) as active_count,
         SUM(CASE WHEN remaining = 0 THEN 1 ELSE 0 END) as expired_count,
         AVG(remaining) as avg_remaining_days
       FROM 
         user_salary`
    );

    // Get top users by salary amount today
    const [topUsers] = await db.promise().query(
      `SELECT 
         u.id as user_id,
         u.username,
         u.refferal_code,
         COUNT(st.id) as transaction_count,
         SUM(st.paid_amount) as total_amount
       FROM 
         salary_transactions st
       JOIN 
         users u ON st.user_id = u.id
       WHERE 
         DATE(st.transaction_date) = ?
       GROUP BY 
         u.id, u.username, u.refferal_code
       ORDER BY 
         total_amount DESC
       LIMIT 10`,
      [today]
    );

    // Get new salary assignments today
    const [newAssignments] = await db.promise().query(
      `SELECT 
         COUNT(*) as new_assignments
       FROM 
         user_salary
       WHERE 
         DATE(assigned_date) = ?`,
      [today]
    );

    res.json({
      success: true,
      date: today,
      summary: {
        transaction_count: todayTransactions[0].transaction_count,
        total_amount: todayTransactions[0].total_amount || 0,
        new_salary_assignments: newAssignments[0].new_assignments,
      },
      salary_tiers: salaryTierStats,
      active_salaries: activeSalaryStats[0],
      top_users: topUsers,
    });
  } catch (error) {
    console.error("Error fetching today's salary stats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
