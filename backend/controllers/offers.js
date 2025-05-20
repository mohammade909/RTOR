const db = require("../config/database");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const moment = require("moment-timezone");
exports.createOffer = async (req, res) => {
  try {
    const createOfferWithTransaction = () => {
      return new Promise((resolve, reject) => {
        db.beginTransaction(async (err) => {
          if (err) {
            return reject(err);
          }

          try {
            const {
              title,
              description,
              business_val,
              reward,
              start_date,
              end_date,
              status,
              users,
              user_ids,
              planId,

              user_plan_val,
            } = req.body;

            // Convert dates to Indian Standard Time (IST)
            const startDateIST = moment(start_date)
              .tz("Asia/Kolkata")
              .format("YYYY-MM-DD HH:mm:ss");
            const endDateIST = moment(end_date)
              .tz("Asia/Kolkata")
              .format("YYYY-MM-DD HH:mm:ss");

            // Insert the offer into the `offers` table
            const offerSql =
              "INSERT INTO offers (title, description, business_val, reward, start_date, end_date, status, users, plan, user_plan_val) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";

            db.query(
              offerSql,
              [
                title,
                description,
                business_val,
                reward,
                startDateIST,
                endDateIST,
                status,
                users,
                planId,
                user_plan_val,
              ],
              (err, offerResult) => {
                if (err) {
                  return db.rollback(() => {
                    reject(err);
                  });
                }

                const offerId = offerResult.insertId;

                // If `users` is false and `user_ids` is provided, assign the offer to each user
                if (!users && user_ids && user_ids.length > 0) {
                  const assignSql =
                    "INSERT INTO user_reward (offer_id, user_id) VALUES ?";
                  const userValues = user_ids.map((userId) => [
                    offerId,
                    userId,
                  ]);

                  db.query(assignSql, [userValues], (err) => {
                    if (err) {
                      return db.rollback(() => {
                        reject(err);
                      });
                    }

                    // Commit the transaction
                    db.commit((err) => {
                      if (err) {
                        return db.rollback(() => {
                          reject(err);
                        });
                      }
                      resolve(offerId);
                    });
                  });
                } else {
                  // Commit the transaction if no user assignments
                  db.commit((err) => {
                    if (err) {
                      return db.rollback(() => {
                        reject(err);
                      });
                    }
                    resolve(offerId);
                  });
                }
              }
            );
          } catch (error) {
            db.rollback(() => {
              reject(error);
            });
          }
        });
      });
    };

    // Execute the transaction
    const offerId = await createOfferWithTransaction();

    res.status(201).json({
      message: "Offer created successfully",
      offerId,
    });
  } catch (error) {
    console.error("Offer creation error:", error);
    res.status(500).json({
      error: "Failed to create offer",
      details: error.message,
    });
  }
};
// Update an offer
exports.updateOffer = async (req, res) => {
  try {
    const { offer_id } = req.params;
    const updates = req.body; // Only update fields that are provided

    if (!offer_id || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    // Construct dynamic SQL query
    const fields = Object.keys(updates)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(updates);
    values.push(offer_id); // Append offer_id for WHERE condition

    const sql = `UPDATE offers SET ${fields} WHERE offer_id = ?`;
    console.log(sql);
    await db.promise().query(sql, values);

    res.status(200).json({ message: "Offer updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Delete an offer
exports.deleteOffer = async (req, res) => {
  try {
    const { offer_id } = req.params;
    const sql = "DELETE FROM offers WHERE offer_id=?";
    await db.promise().query(sql, [offer_id]);
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRewardsByUserId = catchAsyncErrors(async (req, res) => {
  try {
    const userId = req.params.user_id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const sql = `
      SELECT DISTINCT o.* FROM offers o
      WHERE o.users = true
      UNION
      SELECT o.* FROM offers o
      INNER JOIN user_reward ur ON o.offer_id = ur.offer_id
      WHERE o.users = false AND ur.user_id = ?
    `;

    const [offers] = await db.promise().query(sql, [userId]);
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

exports.getReferredUsers = catchAsyncErrors(async (req, res) => {
  try {
    const { userId, startDate, endDate, userPlanVal } = req.params;
    console.log(req.params);
    if (!userId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required parameters" });
    }
    // Get referral code and active plan of the user
    const [userResult] = await db
      .promise()
      .execute("SELECT refferal_code, active_plan FROM users WHERE id = ?", [
        userId,
      ]);

    // Check if the user exists
    if (!userResult || userResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { refferal_code } = userResult[0];

    // Ensure referral code and active plan are not null or undefined
    if (!refferal_code) {
      return res
        .status(400)
        .json({ message: "User does not have a referral code or active plan" });
    }

    // Get all users referred by this user with the same active plan within the date range
    const [referredUsers] = await db.promise().execute(
      `SELECT active_plan, reffer_by, refferal_code, created_at FROM users 
       WHERE reffer_by = ? 
       AND active_plan = ? 
       AND created_at BETWEEN ? AND ?`,
      [refferal_code, userPlanVal, startDate, endDate]
    );

    res.status(200).json(referredUsers);
  } catch (error) {
    console.error("Error fetching referred users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all offers where users = TRUE
exports.getAllOffersWithUsers = catchAsyncErrors(async (req, res) => {
  try {
    // Destructure query parameters with defaults
    const {
      page = 1,
      limit = 10,
      search = "",
      offer_id,
      title,
      description,
      business_val,
      reward,
      start_date,
      end_date,
      status,
      users,
      plan,
      user_plan_val,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = req.query;

    // Prepare base query
    let baseQuery = `
      SELECT * FROM offers 
      WHERE 1=1
    `;
    const queryParams = [];

    // Add filters
    if (offer_id) {
      baseQuery += ` AND offer_id = ?`;
      queryParams.push(offer_id);
    }
    if (title) {
      baseQuery += ` AND title LIKE ?`;
      queryParams.push(`%${title}%`);
    }
    if (description) {
      baseQuery += ` AND description LIKE ?`;
      queryParams.push(`%${description}%`);
    }
    if (business_val) {
      baseQuery += ` AND business_val = ?`;
      queryParams.push(business_val);
    }
    if (reward) {
      baseQuery += ` AND reward = ?`;
      queryParams.push(reward);
    }
    if (start_date) {
      baseQuery += ` AND start_date >= ?`;
      queryParams.push(start_date);
    }
    if (end_date) {
      baseQuery += ` AND end_date <= ?`;
      queryParams.push(end_date);
    }
    if (status) {
      baseQuery += ` AND status = ?`;
      queryParams.push(status);
    }
    if (users) {
      baseQuery += ` AND users = ?`;
      queryParams.push(users);
    }
    if (plan) {
      baseQuery += ` AND plan = ?`;
      queryParams.push(plan);
    }
    if (user_plan_val) {
      baseQuery += ` AND user_plan_val = ?`;
      queryParams.push(user_plan_val);
    }

    // Global search across multiple fields
    if (search) {
      baseQuery += ` AND (
        title LIKE ? OR 
        description LIKE ? OR 
        business_val LIKE ? OR 
        reward LIKE ? OR 
        status LIKE ? OR 
        plan LIKE ?
      )`;
      const searchParam = `%${search}%`;
      queryParams.push(
        searchParam,
        searchParam,
        searchParam,
        searchParam,
        searchParam,
        searchParam
      );
    }

    // Add sorting
    baseQuery += ` ORDER BY ${sortBy} ${sortOrder}`;

    // Pagination
    const offset = (page - 1) * limit;
    baseQuery += ` LIMIT ? OFFSET ?`;
    queryParams.push(Number(limit), Number(offset));

    // Count total matching records for pagination
    const countQuery = baseQuery.replace(
      /SELECT \*/,
      "SELECT COUNT(*) AS total"
    );
    const countQueryWithoutLimit = countQuery.replace(/LIMIT \? OFFSET \?/, "");

    // Execute queries
    const [offers] = await db.promise().query(baseQuery, queryParams);
    const [countResult] = await db
      .promise()
      .query(countQueryWithoutLimit, queryParams.slice(0, -2));

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Respond with paginated results
    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages,
      offers,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
});

exports.getOfferById = catchAsyncErrors(async (req, res) => {
  const { offer_id } = req.params;

  try {
    // First, get the offer details
    const offerSql = "SELECT * FROM offers WHERE offer_id = ?";
    const [offers] = await db.promise().query(offerSql, [offer_id]);

    if (offers.length === 0) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const offer = offers[0];

    // Check if users are stored in another table (users column is 0)
    if (offer.users === 0) {
      // Get associated users from user_rewards table with user details
      const usersSql = `
        SELECT ur.id, ur.offer_id, ur.user_id, ur.assigned_at, ur.status, 
               u.email, u.username 
        FROM user_reward ur
        JOIN users u ON ur.user_id = u.id
        WHERE ur.offer_id = ?
      `;

      const [associatedUsers] = await db.promise().query(usersSql, [offer_id]);

      // Add the associated users to the offer object
      offer.associatedUsers = associatedUsers;
    }

    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const updateOfferStatus = async (user_id, offer_id) => {
  try {
    if (!user_id || !offer_id) {
      return res
        .status(400)
        .json({ error: "User ID and Offer ID are required" });
    }

    const updateSql =
      "UPDATE user_reward SET status = 'complete' WHERE user_id = ? AND offer_id = ?";

    db.query(updateSql, [user_id, offer_id], (err, result) => {
      if (err) {
        console.error("Error updating offer status:", err);
        return res.status(500).json({ error: "Failed to update offer status" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "No matching record found" });
      }

      res.status(200).json({ message: "Offer status updated successfully" });
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.mineOffer = catchAsyncErrors(async (req, res) => {
  const { offer_id, user_id } = req.body;
  try {
    // Fetch user details including referral code and active plan
    const [userResult] = await db
      .promise()
      .query(
        `SELECT refferal_code, active_plan FROM users WHERE id =${user_id} `
      );

    if (userResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { refferal_code } = userResult[0];

    // Fetch offer details
    const [offerResult] = await db
      .promise()
      .query(
        "SELECT start_date, end_date, business_val,user_plan_val, reward FROM offers WHERE offer_id = ?",
        [offer_id]
      );

    if (offerResult.length === 0) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const { start_date, end_date, business_val, reward, user_plan_val } =
      offerResult[0];

    // Fetch all users who joined using this referral code within the offer period
    const [referredUsers] = await db.promise().query(
      `SELECT SUM(active_plan) as total_active_plan
         FROM users 
         WHERE reffer_by = ? 
         AND created_at BETWEEN ? AND ? 
         AND active_plan = ?`,
      [refferal_code, start_date, end_date, user_plan_val]
    );

    const total_active_plan = referredUsers[0].total_active_plan || 0;

    // Check if total active plan meets business value requirement
    if (total_active_plan >= business_val) {
      await db.promise().query(
        `INSERT INTO reward_transaction (user_id, offer_id, amount, createdAt) 
         VALUES (?, ?, ?, NOW())`,
        [user_id, offer_id, reward]
      );

      // Update user's reward_amount
      await db.promise().query(
        `UPDATE users 
         SET reward = reward + ? 
         WHERE id = ?`,
        [reward, user_id]
      );
      await updateOfferStatus(user_id, offer_id);
      return res.status(200).json({
        success: true,
        message: "Offer conditions met. Reward added to user.",
        reward,
        total_active_plan,
      });
    } else {
      return res.status(400).json({
        message: "Offer conditions not met",
        required_business_value: business_val,
        total_active_plan,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
