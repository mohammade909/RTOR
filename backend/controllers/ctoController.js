const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
dotenv.config({ path: "backend/config/config.env" });

const fetchAllUsers = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, reffer_by, refferal_code, active_plan, created_at, cto FROM users WHERE cto = 'false'`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching users:", err);
        return reject(new Error("Error fetching users!"));
      }
      resolve(result);
    });
  });
};

const insertCTO = async (userId, category,paid,amount) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO cto (user_id, category,paid,amount) VALUES (?, ?, ?, ?)`;
    const params = [userId, category,paid,amount];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Error inserting CTO:", err);
        return reject(new Error("Error inserting CTO!"));
      }
      resolve(result);
    });
  });
};

const updateCTOFlag = async (userId,amount) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE users SET cto = 'true',max=3,non_working=non_working+? WHERE id = ?`;
    db.query(sql, [amount,userId], (err, result) => {
      if (err) {
        console.error("Error updating CTO flag:", err);
        return reject(new Error("Error updating CTO flag!"));
      }
      resolve(result);
    });
  });
};

const calculateDirectReferrals = (
  users,
  refferalCode,
  createdAt,
  daysLimit
) => {
  const targetDate = new Date(createdAt);
  targetDate.setDate(targetDate.getDate() + daysLimit);

  return users.filter(
    (user) =>
      user.reffer_by === refferalCode &&  // Check if the referral has the required active plan
      new Date(user.created_at) <= targetDate // Check if the referral was created within the timeframe
  );
};

exports.cto = catchAsyncErrors(async (req, res, next) => {
  try {
    const users = await fetchAllUsers(); // Fetch all users who are not CTO
    for (const user of users) {
      const referralActivePlanTotal = users.reduce((total, u) => {
        if (u.reffer_by === user.refferal_code) {
          return total + u.active_plan;
        }
        return total;
      }, 0);
      const directReferrals3Days = calculateDirectReferrals(
        users,
        user.refferal_code,
        user.created_at,
        3
      );
      const directReferrals10Days = calculateDirectReferrals(
        users,
        user.refferal_code,
        user.created_at,
        10
      );

      // Check if user qualifies for CTO
      if (
        (directReferrals3Days.length >= 1 || directReferrals10Days.length >= 1) &&
        user.active_plan >= 50 &&
        referralActivePlanTotal >= 5000
      ) {
        // User qualifies for CTO (adjust conditions as needed)
        if (directReferrals3Days.length >= 1) {
          await insertCTO(user.id, 1, "paid", 200);
        await updateCTOFlag(user.id,200);
        // 1st category CTO
        } else if (directReferrals10Days.length >= 1) {
          await insertCTO(user.id, 2, "unpaid", 0);
        await updateCTOFlag(user.id,0);
        // 2nd category CTO
        }
      }
    }

    res.json({ message: "CTO rewards calculated and updated successfully." });
  } catch (error) {
    console.error("Error in CTO calculation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.getListOfCto = catchAsyncErrors(async (request, response, next) => {
  let sql = `SELECT 
    c.*,
    u.email AS useremail,
    u.username AS username
FROM 
    cto c
LEFT JOIN 
    users u ON c.user_id = u.id
WHERE 
    c.status = 'qualified';

`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching activation_plan:", err);
      return next(new ErrorHandler("Error fetching activation_plan!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ allcto: result });
    } else {
      return response.status(200).json({ allcto: [] });
    }
  });
});
exports.getListOfCtoByid = catchAsyncErrors(async (request, response, next) => {
  const {id}=request.params
  let sql = `SELECT 
    c.*,
    u.email AS useremail,
    u.username AS username
FROM 
    cto c
LEFT JOIN 
    users u ON c.user_id = u.id
WHERE 
    c.status = 'qualified' and c.user_id=${id};

`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching activation_plan:", err);
      return next(new ErrorHandler("Error fetching activation_plan!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ singlecto: result[0] });
    } else {
      return response.status(200).json({ singlecto: [] });
    }
  });
});
exports.CtoMonthlyTransaction = catchAsyncErrors(async (request, response, next) => {
  const {id}=request.params
  let sql = `SELECT 
    c.*,
    u.email AS useremail,
    u.username AS username
FROM 
    cto_transaction c
LEFT JOIN 
    users u ON c.user_id = u.id
WHERE c.user_id=${id};

`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching activation_plan:", err);
      return next(new ErrorHandler("Error fetching activation_plan!", 500));
    }
    if (result.length > 0) {
      return response.status(200).json({ singlectotransaction: result });
    } else {
      return response.status(200).json({ singlectotransaction: [] });
    }
  });
});

exports.deletecto = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  console.log(id)
  if (!id) {
    return next(
      new ErrorHandler("cto number (ID) is required", 400)
    );
  }

  const sql = `UPDATE cto set status="disqualify" WHERE id = ?`;

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
          "cto not found or no changes applied",
          404
        )
      );
    }
  });
});

exports.payCto = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body)
    let {id,amount,gift} = req.body;
      const insertTopupSql = `UPDATE cto set monthly_amount =? `;
      db.query(insertTopupSql, [amount], (err, insertResult) => {
        if (err) {
          console.log("Error inserting into cto table:", err);
          return next(new ErrorHandler("Error inserting into cto table!", 500));
        }
        if (insertResult.affectedRows > 0) {
          res.status(200).json({ success: true, message: "Paid successfully" });
        } else {
          console.log(err)
          res.status(400).json({ error: "Failed to insert into cto table" });
        }
    });
  });
exports.payCtoMonthly = catchAsyncErrors(async (req, res, next) => {
    try {
      // Fetch all qualified CTOs with user details
      const selectCtoSql = `
        SELECT c.user_id, c.monthly_amount, u.non_working, u.active_plan
        FROM cto c
        JOIN users u ON c.user_id = u.id
        WHERE c.status = 'qualified'
      `;
  
      db.query(selectCtoSql, async (err, ctoResults) => {
        if (err) {
          console.error("Error fetching CTO data:", err);
          return next(new ErrorHandler("Error fetching CTO data!", 500));
        }
  
        if (ctoResults.length === 0) {
          return res.status(400).json({ error: "No qualified CTOs found" });
        }
  
        // Filter out users whose `non_working >= 3 * active_plan`
        const eligibleUsers = ctoResults.filter(user => user.non_working < 3 * user.active_plan);
  
        if (eligibleUsers.length === 0) {
          return res.status(400).json({ error: "No eligible users for CTO payment" });
        }
  
        // Prepare data for bulk insertion into cto_transaction
        const transactionValues = eligibleUsers.map(user => [user.user_id, user.monthly_amount]);
  
        // Insert into cto_transaction table
        const ctoTransactionSql = `INSERT INTO cto_transaction (user_id, amount) VALUES ?`;
        db.query(ctoTransactionSql, [transactionValues], async (err, transactionResult) => {
          if (err) {
            console.error("Error inserting into cto_transaction table:", err);
            return next(new ErrorHandler("Error inserting into cto_transaction table!", 500));
          }
  
          // Update `now_working` for eligible users
          const updateUsersSql = `
            UPDATE users u
            JOIN cto c ON u.id = c.user_id
            SET u.non_working = u.non_working + c.monthly_amount
            WHERE c.status = 'qualified' AND u.non_working < 3 * u.active_plan
          `;
  
          db.query(updateUsersSql, (err, updateResult) => {
            if (err) {
              console.error("Error updating users table:", err);
              return next(new ErrorHandler("Error updating users table!", 500));
            }
  
            // res.status(200).json({ success: true, message: "CTO payments processed and users updated successfully" });
          });
        });
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return next(new ErrorHandler("Something went wrong!", 500));
    }
  });
  
