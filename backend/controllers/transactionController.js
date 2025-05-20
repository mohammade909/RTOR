const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
const asyncHandler = require("express-async-handler");
dotenv.config({ path: "backend/config/config.env" });

exports.getTransaction = catchAsyncErrors(async (request, response, next) => {
  const { table_name } = request.body;
  let sql = `
    SELECT ${table_name}.*, users.email 
    FROM ${table_name} 
    LEFT JOIN users ON ${table_name}.user_id = users.id;
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching Deposite:", err);
      return next(new ErrorHandler("Error fetching Deposite!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ alltransaction: result });
    } else {
      return response.status(200).json({ alltransaction: [] });
    }
  });
});

exports.getTransactionById = catchAsyncErrors(
  async (request, response, next) => {
    const user_id = request.params.user_id;
    const table_name = request.body.table_name;
    // Validate table_name if it comes from the request to avoid potential security risks
    // SQL query with parameterized values
    let sql;

    if (
      table_name == "direct_transaction" ||
      table_name == "invest_level_transaction"
    ) {
      sql = `SELECT ??.*, users.email 
             FROM ?? 
             LEFT JOIN users ON ??.userby_id = users.id 
             WHERE ??.user_id = ?`;
    } else if (
      table_name == "roi_transaction" ||
      table_name == "salary_transaction" ||
      table_name == "reward_transaction" ||
      table_name == "salary_transaction"
    ) {
      sql = `SELECT ??.*, users.email 
      FROM ?? 
      LEFT JOIN users ON ??.user_id = users.id 
      WHERE ??.user_id = ?`;
    } else if (table_name == "cto_transaction") {
      sql = `SELECT 
              c.*,
              u.email AS useremail,
              u.username AS username
          FROM 
              cto_transaction c
          LEFT JOIN 
              users u ON c.user_id = u.id
          WHERE c.user_id=${user_id}`;
    } else {
      sql = `SELECT ??.*, users.email 
      FROM ?? 
      LEFT JOIN users ON ??.user_id = users.id 
      WHERE users.id = ?`;
    }

    // Execute the query safely with parameterized inputs
    db.query(
      sql,
      [table_name, table_name, table_name, table_name, user_id],
      (err, result) => {
        if (err) {
          console.error("Error fetching transaction:", err);
          return next(new ErrorHandler("Error fetching transaction!", 500));
        }
        if (result.length > 0) {
          return response.status(200).json({ transaction: result });
        } else {
          return response.status(200).json({ transaction: [] });
        }
      }
    );
  }
);


exports.createTransaction = (
  user_id,
  amount,
  transaction_type,
  source,
  status = "pending"
) => {
  return new Promise((resolve, reject) => {
    const query = `
            INSERT INTO transactions (user_id, amount, transaction_type, source, status)
            VALUES (?, ?, ?, ?, ?)
        `;

    db.query(
      query,
      [user_id, amount, transaction_type, source, status],
      (err, result) => {
        if (err) {
          return reject({ message: "Database error", error: err });
        }
        resolve({
          message: "Transaction created successfully",
          transaction_id: result.insertId,
        });
      }
    );
  });
};

// ✅ 1️⃣ Create a new transaction
exports.createTransactionService = catchAsyncErrors(async (req, res) => {
  const { user_id, amount, transaction_type, source, status } = req.body;

  if (!user_id || !amount || !transaction_type || !source) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await createTransaction(
      user_id,
      amount,
      transaction_type,
      source,
      status
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ✅ 2️⃣ Get all transactions (pagination, filters, search)
exports.getTransactions = catchAsyncErrors(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    transaction_type,
    source,
    status,
    search,
  } = req.query;
  const offset = (page - 1) * limit;

  let query = `
        SELECT t.*, u.username, u.email 
        FROM transactions t
        JOIN users u ON t.user_id = u.id
    `;

  let conditions = [];
  if (transaction_type)
    conditions.push(`t.transaction_type = '${transaction_type}'`);
  if (source) conditions.push(`t.source = '${source}'`);
  if (status) conditions.push(`t.status = '${status}'`);
  if (search)
    conditions.push(
      `u.username LIKE '%${search}%' OR u.email LIKE '%${search}%'`
    );

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += ` ORDER BY t.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    let countQuery = "SELECT COUNT(*) AS count FROM transactions";
    if (conditions.length > 0)
      countQuery += " WHERE " + conditions.join(" AND ");

    db.query(countQuery, (countErr, countResults) => {
      if (countErr) {
        return res
          .status(500)
          .json({ message: "Database error", error: countErr });
      }

      const totalCount = countResults[0].count;
      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        transactions: results,
        totalPages,
        currentPage: parseInt(page, 10),
      });
    });
  });
});

exports.getRewardTransactions = catchAsyncErrors(async (req, res) => {
  console.log("hello");
  const {
    page = 1,
    limit = 10,
    amount,
    search,
    status,
  } = req.query;
  
  const currentPage = parseInt(page, 10);
  const perPage = parseInt(limit, 10);
  const offset = (currentPage - 1) * perPage;

  let query = `
    SELECT t.*, u.username, u.email 
    FROM reward_transaction t
    JOIN users u ON t.user_id = u.id
  `;

  let conditions = [];

  if (amount) conditions.push(`t.amount = '${amount}'`);
  if (status) conditions.push(`t.status = '${status}'`);
  if (search)
    conditions.push(
      `(u.username LIKE '%${search}%' OR u.email LIKE '%${search}%')`
    );

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += ` ORDER BY t.createdAt DESC LIMIT ${perPage} OFFSET ${offset}`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing transactions query:', err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    let countQuery = "SELECT COUNT(*) AS count FROM reward_transaction t JOIN users u ON t.user_id = u.id";
    if (conditions.length > 0)
      countQuery += " WHERE " + conditions.join(" AND ");

    db.query(countQuery, (countErr, countResults) => {
      if (countErr) {
        console.error('Error executing count query:', countErr);
        return res
          .status(500)
          .json({ message: "Database error", error: countErr });
      }

      const totalCount = countResults[0].count;
      const lastPage = Math.ceil(totalCount / perPage);
      const from = totalCount > 0 ? offset + 1 : 0;
      const to = Math.min(offset + perPage, totalCount);

      res.status(200).json({
        transactions: results,
        pagination: {
          total: totalCount,
          per_page: perPage,
          current_page: currentPage,
          last_page: lastPage,
          from: from,
          to: to
        }
      });
    });
  });
});

// ✅ 3️⃣ Get transactions for a specific user (pagination, filters, search)
exports.getUserTransactions = catchAsyncErrors(async (req, res) => {
  const { user_id } = req.params;
  const {
    page = 1,
    limit = 10,
    transaction_type,
    source,
    status,
    search,
  } = req.query;
  const offset = (page - 1) * limit;

  let query = `
        SELECT * FROM transactions WHERE user_id = ?
    `;

  let conditions = [];
  if (transaction_type)
    conditions.push(`transaction_type = '${transaction_type}'`);
  if (source) conditions.push(`source = '${source}'`);
  if (status) conditions.push(`status = '${status}'`);
  if (search)
    conditions.push(
      `transaction_id LIKE '%${search}%' OR amount LIKE '%${search}%'`
    );

  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ");
  }

  query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    let countQuery = `SELECT COUNT(*) AS count FROM transactions WHERE user_id = ?`;
    if (conditions.length > 0) countQuery += " AND " + conditions.join(" AND ");

    db.query(countQuery, [user_id], (countErr, countResults) => {
      if (countErr) {
        return res
          .status(500)
          .json({ message: "Database error", error: countErr });
      }

      const totalCount = countResults[0].count;
      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        transactions: results,
        totalPages,
        currentPage: parseInt(page, 10),
      });
    });
  });
});

// ✅ 4️⃣ Get user details with all transactions
exports.getUserDetailsWithTransactions = catchAsyncErrors(async (req, res) => {
  const { user_id } = req.params;

  const userQuery = "SELECT * FROM users WHERE user_id = ?";
  db.query(userQuery, [user_id], (err, userResult) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (userResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const transactionQuery =
      "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC";
    db.query(transactionQuery, [user_id], (transErr, transactions) => {
      if (transErr) {
        return res
          .status(500)
          .json({ message: "Database error", error: transErr });
      }

      res.status(200).json({
        user: userResult[0],
        transactions,
      });
    });
  });
});

// ✅ 5️⃣ Update Transaction Status
exports.updateTransactionStatus = catchAsyncErrors(async (req, res) => {
  const { transaction_id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  const query = `
      UPDATE transactions 
      SET status = ? 
      WHERE transaction_id = ?
  `;

  db.query(query, [status, transaction_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res
      .status(200)
      .json({ message: "Transaction status updated successfully" });
  });
});

exports.checkTodayROITransaction = catchAsyncErrors(async (req, res, next) => {
  const { user_id } = req.params;

  const query = `
    SELECT * FROM transactions
    WHERE user_id = ?
      AND source = 'roi_income'
      AND DATE(created_at) = CURDATE()
    LIMIT 1
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database error", error: err });
    }


    if (results.length > 0) {
      return res.status(200).json({ found: true, success: true });
    } else {
      return res.status(200).json({ found: false, success: false });
    }
  });
});
exports.checkExistingTransactionBySource = catchAsyncErrors(
  async (req, res, next) => {
    const { user_id } = req.params;
    const { source } = req.body;

    const query = `
      SELECT * FROM transactions
      WHERE user_id = ? AND source = ?
      LIMIT 1
    `;

    db.query(query, [user_id, source], (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
          error: err,
        });
      }
       
      if (results.length > 0) {
        return res.status(200).json({ found: true, success: true });
      } else {
        return res.status(200).json({ found: false, success: true });
      }
    });
  }
);

exports.getTransactionSummaryBySource = catchAsyncErrors(
  async (req, res, next) => {
    const { month } = req.query;

    let whereClause = "";
    let params = [];

    if (month) {
      whereClause += 'WHERE DATE_FORMAT(created_at, "%Y-%m") = ?';
      params.push(month);
    }

    const query = `
    SELECT source, SUM(amount) AS total_amount
    FROM transactions
    ${whereClause}
    GROUP BY source
  `;

    db.query(query, params, (err, results) => {
      if (err) return next(err);

      res.status(200).json({
        success: true,
        data: results,
      });
    });
  }
);
