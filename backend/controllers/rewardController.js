const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
dotenv.config({ path: "backend/config/config.env" });

// Fetch all users from the database
const fetchAllUsers = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, username, is_active,limit_plan, active_plan, refferal_code, reward_level, reffer_by, plan_id, reward,  activation_date FROM users`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching users:", err);
        return reject(new Error("Error fetching users!"));
      }
      resolve(result);
    });
  });
};

// Fetch a single user by ID
const fetchUserById = async (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, username, is_active, limit_plan, active_plan, refferal_code, reward_level, reffer_by, plan_id, reward, activation_date FROM users WHERE id = ?`;

    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error(`Error fetching user ${userId}:`, err);
        return reject(new Error(`Error fetching user ${userId}!`));
      }

      if (!result || result.length === 0) {
        return reject(new Error(`User with ID ${userId} not found`));
      }

      resolve(result[0]);
    });
  });
};
const fetchUserWithReferrals = async (userId) => {
  try {
    // First get the main user
    const mainUser = await fetchUserById(userId);

    // Then get all users to find referrals
    return new Promise((resolve, reject) => {
      const sql = `SELECT id, username, is_active, limit_plan, active_plan, refferal_code, reward_level, reffer_by, plan_id, reward, activation_date FROM users`;

      db.query(sql, (err, allUsers) => {
        if (err) {
          console.error("Error fetching users:", err);
          return reject(new Error("Error fetching users!"));
        }

        // Filter users that are in the referral tree of our main user
        const userWithReferrals = buildReferralTreeForUser(mainUser, allUsers);
        resolve(userWithReferrals);
      });
    });
  } catch (error) {
    throw error;
  }
};
function buildReferralTreeForUser(user, allUsers) {
  // Create map of all users for quick lookup
  const userMap = new Map();
  allUsers.forEach((u) => {
    u.referrals = [];
    userMap.set(u.refferal_code, u);
  });

  // Connect referrals in the tree
  allUsers.forEach((u) => {
    const parent = userMap.get(u.reffer_by);
    if (parent) {
      parent.referrals.push(u);
    }
  });

  // Get the user with all their referrals attached
  const userWithReferrals = userMap.get(user.refferal_code);

  // If user doesn't have any referrals yet, still return the user
  if (!userWithReferrals) {
    user.referrals = [];
    return user;
  }

  return userWithReferrals;
}

const calculateRewardsForSingleUser = async (userId) => {
  try {
    // Fetch the specific user by ID
    const user = await fetchUserWithReferrals(userId);

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    // Process only this user's rewards
    try {
      // Fetch active, incomplete rewards for the user
      const [activeRewardRows] = await db.promise().query(
        `SELECT * FROM user_rewards 
           WHERE is_active = 1 
           AND is_completed = 0 
           AND user_id = ?`,
        [user.id]
      );

      // If no active, incomplete rewards found, return early
      if (!activeRewardRows || activeRewardRows.length === 0) {
        console.log(`No active, incomplete rewards found for user ${user.id}.`);
        return {
          userId: user.id,
          status: "no_active_rewards",
          message: "No active, incomplete rewards found",
        };
      }

      const {
        id: activeRewardId,
        reward_amount,
        threshold,
        start_date,
        end_date,
        reward_level,
      } = activeRewardRows[0];

      const currentDate = new Date();

      const isRewardExpire = isRewardPeriodExpired(end_date, user.id);

      // Check if reward period has finished
      if (isRewardExpire) {
        // Renew reward period for next 30 days
        const newStartDate = new Date(currentDate);
        const newEndDate = new Date(currentDate);
        newEndDate.setDate(newStartDate.getDate() + 30);

        await db.promise().query(
          `UPDATE user_rewards 
              SET start_date = ?, 
                  end_date = ?
              WHERE id = ?`,
          [newStartDate, newEndDate, activeRewardId]
        );

        // Filter referrals based on the new period
        const filteredReferrals = user.referrals.filter((referral) => {
          const referralActivatedAt = new Date(referral.activation_date);
          return (
            referralActivatedAt >= newStartDate &&
            referralActivatedAt <= newEndDate
          );
        });

        // Calculate business by leg for the new period
        const businessByLeg = calculateBusinessForLegs(filteredReferrals || []);

        // Sort legs by business volume (descending)
        const sortedLegs = Object.entries(businessByLeg)
          .map(([legId, totalBusiness]) => ({
            legId: parseInt(legId),
            totalBusiness,
          }))
          .sort((a, b) => b.totalBusiness - a.totalBusiness);

        const topLeg = sortedLegs.length > 0 ? sortedLegs[0] : { legId: 0, totalBusiness: 0 };

     

        // Calculate the sum of all other legs (third leg)
        const otherLegsTotalBusiness = sortedLegs
        .slice(1)
        .reduce((acc, leg) => acc + leg.totalBusiness, 0);

        // Final three legs structure: top two legs + combined third leg
        const finalLegs = [
          topLeg,
          { legId: "Other", totalBusiness: otherLegsTotalBusiness },
        ];
  

        // Calculate total business from all legs
        const totalBusiness = Object.values(businessByLeg).reduce(
          (acc, value) => acc + value,
          0
        );

        const required50A = (threshold * 50) / 100;
        const required50B = (threshold * 50) / 100;
        // Check if threshold is met
        if (totalBusiness >= threshold) {
       
          // Check leg business distribution
          if (
            finalLegs[0].totalBusiness >= required50A &&
            finalLegs[1].totalBusiness >= required50B
          ) {
            console.log("satisfy the condition");

            // Update user reward
            await updateRewardForUser(user.id, reward_amount);
            return {
              userId: user.id,
              status: "reward_updated",
              message: "Reward updated successfully",
              totalBusiness,
              threshold,
              legs: finalLegs,
            };
          } else {
            console.log(
              `Threshold met, but leg distribution not satisfied for user ${user.id}`
            );
            return {
              userId: user.id,
              status: "distribution_not_met",
              message: "Threshold met, but leg distribution not satisfied",
              totalBusiness,
              threshold,
              legs: finalLegs,
              legDistribution: { firstLeg:finalLegs[0].totalBusiness, secondLeg:finalLegs[1].totalBusiness},
              required: { required50A, required50B,},
            };
          }
        } else {
          console.log(
            `Threshold not met for user ${user.id}. Current: ${totalBusiness}, Required: ${threshold}`
          );
          return {
            userId: user.id,
            status: "threshold_not_met",
            message: "Threshold not met",
            totalBusiness,
            threshold,
            legs: finalLegs,
          };
        }
      } else {
        // Reward period is still active, process as before
        const filteredReferrals = user.referrals.filter((referral) => {
          const referralActivatedAt = new Date(referral.activation_date);
          return (
            referralActivatedAt >= new Date(start_date) &&
            referralActivatedAt <= new Date(end_date)
          );
        });

        // Rest of the existing logic for processing active reward period
        const businessByLeg = calculateBusinessForLegs(filteredReferrals || []);

        // Sort legs by business volume (descending)
        const sortedLegs = Object.entries(businessByLeg)
          .map(([legId, totalBusiness]) => ({
            legId: parseInt(legId),
            totalBusiness,
          }))
          .sort((a, b) => b.totalBusiness - a.totalBusiness);

          const topLeg = sortedLegs.length > 0 ? sortedLegs[0] : { legId: 0, totalBusiness: 0 };

          // Calculate the sum of all other legs (combined as one leg)
          const otherLegsTotalBusiness = sortedLegs
            .slice(1)
            .reduce((acc, leg) => acc + leg.totalBusiness, 0);
    
          // Final two legs structure: top leg + combined other legs
          const finalLegs = [
            topLeg,
            { legId: "Other", totalBusiness: otherLegsTotalBusiness },
          ];
    

        // Calculate total business from all legs
        const totalBusiness = Object.values(businessByLeg).reduce(
          (acc, value) => acc + value,
          0
        );

        const required50A = (threshold * 50) / 100;
        const required50B = (threshold * 50) / 100;

        // Check if threshold is met
        if (totalBusiness >= threshold) {
            // Check leg business distribution
          if (
            finalLegs[0].totalBusiness >= required50A &&
            finalLegs[1].totalBusiness >= required50B
          ) {
            await updateRewardForUser(user.id, reward_amount);
            return {
              userId: user.id,
              status: "reward_updated",
              message: "Reward updated successfully",
              totalBusiness,
              threshold,
              legs: finalLegs,
            };
          } else {
            console.log(
              `Threshold met, but leg distribution not satisfied for user ${user.id}`
            );
            return {
              userId: user.id,
              status: "distribution_not_met",
              message: "Threshold met, but leg distribution not satisfied",
              totalBusiness,
              threshold,
              legs: finalLegs,
              legDistribution: { firstLeg:finalLegs[0].totalBusiness, secondLeg:finalLegs[1].totalBusiness},
              required: { required50A, required50B,},
            };
          }
        } else {
          console.log(
            `Threshold not met for user ${user.id}. Current: ${totalBusiness}, Required: ${threshold}`
          );
          return {
            userId: user.id,
            status: "threshold_not_met",
            message: "Threshold not met",
            totalBusiness,
            threshold,
            legs: finalLegs,
          };
        }
      }
    } catch (error) {
      console.error(`Error processing rewards for user ${user.id}:`, error);
      return {
        userId: user.id,
        status: "error",
        message: `Error processing rewards: ${error.message}`,
      };
    }
  } catch (error) {
    console.error(`Error fetching or processing user ${userId}:`, error);
    throw error;
  }
};

// const calculateRewardsForSingleUser = async (userId) => {
//   try {
//     // Fetch the specific user by ID
//     const user = await fetchUserWithReferrals(userId);

//     if (!user) {
//       throw new Error(`User with ID ${userId} not found`);
//     }

//     // Fetch active, incomplete rewards for the user
//     const [activeRewardRows] = await db.promise().query(
//       `SELECT * FROM user_rewards 
//        WHERE is_active = 1 
//        AND is_completed = 0 
//        AND user_id = ?`,
//       [user.id]
//     );

//     // If no active, incomplete rewards found, return early
//     if (!activeRewardRows || activeRewardRows.length === 0) {
//       return {
//         userId: user.id,
//         status: "no_active_rewards",
//         message: "No active, incomplete rewards found",
//       };
//     }

//     const {
//       reward_amount,
//       threshold,
//     } = activeRewardRows[0];

//     // Calculate business for all referrals
//     const businessByLeg = calculateBusinessForLegs(user.referrals || []);

//     // Sort legs by business volume (descending)
//     const sortedLegs = Object.entries(businessByLeg)
//       .map(([legId, totalBusiness]) => ({
//         legId: parseInt(legId),
//         totalBusiness,
//       }))
//       .sort((a, b) => b.totalBusiness - a.totalBusiness);

//     const topLeg = sortedLegs[0] || { legId: 0, totalBusiness: 0 };
//     const otherLegsTotalBusiness = sortedLegs
//       .slice(1)
//       .reduce((acc, leg) => acc + leg.totalBusiness, 0);

//     // Final legs structure
//     const finalLegs = [
//       topLeg,
//       { legId: "Other", totalBusiness: otherLegsTotalBusiness },
//     ];

//     // Calculate total business
//     const totalBusiness = finalLegs.reduce((acc, leg) => acc + leg.totalBusiness, 0);

//     const required50A = threshold * 0.5;
//     const required50B = threshold * 0.5;

//     // Check reward conditions
//     if (totalBusiness >= threshold) {
//       if (finalLegs[0].totalBusiness >= required50A && 
//           finalLegs[1].totalBusiness >= required50B) {
//         await updateRewardForUser(user.id, reward_amount);
//         return {
//           userId: user.id,
//           status: "reward_updated",
//           message: "Reward updated successfully",
//           totalBusiness,
//           threshold,
//           legs: finalLegs,
//         };
//       }
//       return {
//         userId: user.id,
//         status: "distribution_not_met",
//         message: "Threshold met but leg distribution not satisfied",
//         totalBusiness,
//         threshold,
//         legs: finalLegs,
//         requirements: { required50A, required50B },
//       };
//     }
    
//     return {
//       userId: user.id,
//       status: "threshold_not_met",
//       message: "Threshold not met",
//       totalBusiness,
//       threshold,
//       legs: finalLegs,
//     };

//   } catch (error) {
//     console.error(`Error processing rewards for user ${userId}:`, error);
//     return {
//       userId: userId,
//       status: "error",
//       message: error.message,
//     };
//   }
// };

exports.rewardForSingleUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId } = req.params; // Get userId from request parameters

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await calculateRewardsForSingleUser(userId);

    res.status(200).json({
      message: "Reward calculation completed",
      result,
    });
  } catch (error) {
    console.error("Error in reward calculation:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

exports.calculateUserBusinessForReward = catchAsyncErrors(
  async (req, res, next) => {
    try {
      const { userId } = req.params; // Get userId from request parameters

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const user = await fetchUserWithReferrals(userId);
      const [activeRewardRows] = await db.promise().query(
        `SELECT * FROM user_rewards 
           WHERE is_active = 1 
           AND is_completed = 0 
           AND user_id = ?`,
        [user.id]
      );

      // If no active, incomplete rewards found, return early
      if (!activeRewardRows || activeRewardRows.length === 0) {
        console.log(`No active, incomplete rewards found for user ${user.id}.`);
        return {
          userId: user.id,
          status: "no_active_rewards",
          message: "No active, incomplete rewards found",
        };
      }

      const {
        id: activeRewardId,
        reward_amount,
        threshold,
        start_date,
        end_date,
        reward_level,
      } = activeRewardRows[0];
      const filteredReferrals = user.referrals.filter((referral) => {
        const referralActivatedAt = new Date(referral.activation_date);
        return (
          referralActivatedAt >= new Date(start_date) &&
          referralActivatedAt <= new Date(end_date)
        );
      });

      // Calculate business for each leg
      const businessByLeg = calculateBusinessForLegs(filteredReferrals || []);

      // Sort legs by business volume (descending)
      const sortedLegs = Object.entries(businessByLeg)
        .map(([legId, totalBusiness]) => ({
          legId: parseInt(legId),
          totalBusiness,
        }))
        .sort((a, b) => b.totalBusiness - a.totalBusiness);

      // Get top leg
      const topLeg = sortedLegs.length > 0 ? sortedLegs[0] : { legId: 0, totalBusiness: 0 };

      // Calculate the sum of all other legs (combined as one leg)
      const otherLegsTotalBusiness = sortedLegs
        .slice(1)
        .reduce((acc, leg) => acc + leg.totalBusiness, 0);

      // Final two legs structure: top leg + combined other legs
      const finalLegs = [
        topLeg,
        { legId: "Other", totalBusiness: otherLegsTotalBusiness },
      ];

      // Sum up the total business from all legs
      const totalBusiness = Object.values(businessByLeg).reduce(
        (acc, value) => acc + value,
        0
      );

      // Calculate the required amounts based on 50:50 ratio
      const required50A = (threshold * 50) / 100;
      const required50B = (threshold * 50) / 100;

      // Check if threshold is met
      if (totalBusiness >= threshold) {
        // Check leg business distribution using the finalLegs structure
        if (
          finalLegs[0].totalBusiness >= required50A &&
          finalLegs[1].totalBusiness >= required50B
        ) {
          // User meets all criteria - return the successful result
          return res.status(200).json({
            success: true,
            message: "User qualifies for reward",
            data: {
              userId,
              totalBusiness,
              legs: [
                {
                  legId: finalLegs[0].legId,
                  totalBusiness: finalLegs[0].totalBusiness,
                  percentage: 50,
                  required: required50A,
                  achieved: finalLegs[0].totalBusiness >= required50A,
                },
                {
                  legId: finalLegs[1].legId,
                  totalBusiness: finalLegs[1].totalBusiness,
                  percentage: 50,
                  required: required50B,
                  achieved: finalLegs[1].totalBusiness >= required50B,
                },
              ],
              qualifies: true,
            },
          });
        } else {
          // User does not meet leg distribution criteria
          return res.status(200).json({
            success: true,
            message:
              "User does not qualify for reward - leg distribution criteria not met",
            data: {
              userId,
              totalBusiness,
              legs: [
                {
                  legId: finalLegs[0].legId,
                  totalBusiness: finalLegs[0].totalBusiness,
                  percentage: 50,
                  required: required50A,
                  achieved: finalLegs[0].totalBusiness >= required50A,
                },
                {
                  legId: finalLegs[1].legId,
                  totalBusiness: finalLegs[1].totalBusiness,
                  percentage: 50,
                  required: required50B,
                  achieved: finalLegs[1].totalBusiness >= required50B,
                },
              ],
              qualifies: false,
            },
          });
        }
      } else {
        // User does not meet minimum threshold
        return res.status(200).json({
          success: true,
          message: "User does not qualify for reward - minimum threshold not met",
          data: {
            userId,
            totalBusiness,
            threshold,
            legs: [
              {
                legId: finalLegs[0].legId,
                totalBusiness: finalLegs[0].totalBusiness,
                percentage: 50,
                required: required50A,
                achieved: finalLegs[0].totalBusiness >= required50A,
              },
              {
                legId: finalLegs[1].legId,
                totalBusiness: finalLegs[1].totalBusiness,
                percentage: 50,
                required: required50B,
                achieved: finalLegs[1].totalBusiness >= required50B,
              },
            ],
            qualifies: false,
          },
        });
      }
    } catch (error) {
      console.error("Error in reward calculation:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);
// Build referral tree from user data
function buildReferralTree(users) {
  const userMap = new Map();
  const rootNodes = [];

  users.forEach((user) => {
    user.referrals = [];
    userMap.set(user.refferal_code, user);
  });

  users.forEach((user) => {
    const parent = userMap.get(user.reffer_by);
    if (parent) {
      parent.referrals.push(user);
    }
  });

  users.forEach((user) => {
    if (user.referrals.length > 0 && !userMap.has(user.reffer_by)) {
      rootNodes.push(user);
    }
  });

  users.forEach((user) => {
    if (user.referrals.length > 0 && !rootNodes.includes(user)) {
      rootNodes.push(user);
    }
  });

  return rootNodes;
}

// Recursive function to calculate total business for a user and their referrals
const calculateTeamBusiness = (user) => {
  let totalBusiness = user.active_plan || 0;
  if (user.referrals && user.referrals.length > 0) {
    user.referrals.forEach((referral) => {
      totalBusiness += calculateTeamBusiness(referral);
    });
  }

  return totalBusiness;
};

const calculateBusinessForLegs = (users) => {
  const result = {};
  users.forEach((user) => {
    result[user.id] = calculateTeamBusiness(user);
  });
  return result;
};

const updateRewardForUser = async (userId, reward) => {
  try {
    console.log(
      `Updating reward for User ID: ${userId}, Reward Amount: ${reward}`
    );

    // Fetch user details to perform the necessary calculations
    const fetchUserSql = `
      SELECT
        max_amount,
        limit_plan,
        active_plan,
        activation_date,
        roi_status,
        reward_level AS user_reward_level
      FROM users
      WHERE id = ? AND status = 'unblock'
    `;

    // Wrap database query in a Promise
    const userResult = await new Promise((resolve, reject) => {
      db.query(fetchUserSql, [userId], (err, result) => {
        if (err) {
          console.error(
            `Error fetching user details for User ID ${userId}:`,
            err
          );
          return reject(new Error("Error fetching user details"));
        }
        resolve(result);
      });
    });

    // Check if user exists
    if (!userResult || userResult.length === 0) {
      console.warn(`No active user found with ID: ${userId}`);
      return { success: false, message: "No active user found" };
    }

    const { max_amount, limit_plan, roi_status, user_reward_level } =
      userResult[0];

    const multiPlier = 4;
    const maxLimit = multiPlier * limit_plan;

    // Calculate final reward amount
    let finalReward = reward;
    if (max_amount + reward > maxLimit) {
      finalReward = maxLimit - max_amount; // Cap the reward
      console.log(
        `Reward capped for User ID ${userId}. Original: ${reward}, Final: ${finalReward}`
      );

      // If no reward can be added, return early
      if (finalReward <= 0) {
        return {
          success: false,
          message: "User has reached maximum reward limit",
          maxLimit,
          currentAmount: max_amount,
        };
      }
    }

    // Set appropriate value based on your business logic
    const reward_level = user_reward_level + 1; // Increment user's reward level by 1

    console.log(
      `Reward capped for User ID ${userId}. Original: ${reward}, Final: ${finalReward}`
    );
    // Prepare update with parameterized query to prevent SQL injection
    const updateSql = `
      UPDATE users
      SET
        reward = reward + ?,
        max_amount = max_amount + ?,
        reward_level = ?,
        working = working + ? ,
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

    const updateParams = [
      finalReward,
      finalReward,
      finalReward,
      reward_level,
      finalReward,
      maxLimit,
      finalReward,
      maxLimit,
      finalReward,
      maxLimit,
      userId,
    ];

    // Execute update
    const updateResult = await new Promise((resolve, reject) => {
      db.query(updateSql, updateParams, (err, result) => {
        if (err) {
          console.error(
            `Error updating user reward for User ID ${userId}:`,
            err
          );
          return reject(new Error("Error updating user reward"));
        }
        resolve(result);
      });
    });

    // Check if update was successful
    if (updateResult.affectedRows === 0) {
      console.warn(`No rows updated for User ID ${userId}`);
      return {
        success: false,
        message: "Update failed - user may be blocked or not found",
      };
    }

    // Log update result
    console.log(`Update result for User ID ${userId}:`, {
      affectedRows: updateResult.affectedRows,
      changedRows: updateResult.changedRows,
    });

    // Update reward status
    try {
      await updateRewardStatus(userId);
    } catch (error) {
      console.error(
        `Error updating reward status for User ID ${userId}:`,
        error
      );
      // Continue execution, as this is a secondary operation
    }

    // Log reward transaction
    const insertTransactionSql = `
      INSERT INTO reward_transaction (user_id, amount, createdAt) 
      VALUES (?, ?, NOW())
    `;

    await new Promise((resolve, reject) => {
      db.query(insertTransactionSql, [userId, finalReward], (err) => {
        if (err) {
          console.error(
            `Error logging reward transaction for User ID ${userId}:`,
            err
          );
          return reject(new Error("Error logging reward transaction"));
        }
        resolve();
      });
    });

    return {
      success: true,
      message: "Reward updated successfully",
      userId,
      originalReward: reward,
      appliedReward: finalReward,
      newTotal: max_amount + finalReward,
      maxLimit,
      reachedLimit: max_amount + finalReward >= maxLimit,
    };
  } catch (error) {
    console.error(
      `Critical error in updateRewardForUser for User ID ${userId}:`,
      error
    );
    throw error; // Re-throw to allow caller to handle
  }
};


exports.updateRewardStatus = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    console.error("Invalid user ID");
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    // Get current active reward
    const [currentActiveReward] = await db
      .promise()
      .query(`SELECT * FROM user_rewards WHERE is_active = 1 AND user_id = ?`, [userId]);

    if (currentActiveReward.length === 0) {
      console.warn(`No active reward found for User ID: ${userId}`);
      return res.status(404).json({ message: "No active reward found" });
    }

    const currentRewardId = currentActiveReward[0].id;

    // Get next reward
    const [nextReward] = await db
      .promise()
      .query(
        "SELECT id FROM user_rewards WHERE id > ? AND user_id = ? ORDER BY id ASC LIMIT 1",
        [currentRewardId, userId]
      );

    if (nextReward.length === 0) {
      console.warn(`No next reward found for User ID: ${userId}`);
      return res.status(404).json({ message: "No next reward found" });
    }

    // Mark current reward as completed
    await db
      .promise()
      .query(
        "UPDATE user_rewards SET is_active = 0, is_completed = 1, completed_date = CURRENT_TIMESTAMP, start_date = NULL, end_date = NULL WHERE id = ?",
        [currentRewardId]
      );

    // Activate next reward
    await db
      .promise()
      .query(
        "UPDATE user_rewards SET is_active = 1, start_date = CURRENT_TIMESTAMP, end_date = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY) WHERE id = ?",
        [nextReward[0].id]
      );

    console.log(`Reward status updated for User ID: ${userId}`);

    return res.status(200).json({
      message: "Reward status updated successfully",
      currentRewardId,
      nextRewardId: nextReward[0].id,
    });
  } catch (error) {
    console.error(`Error updating reward status for User ID ${userId}:`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// exports.updateRewardStatus = async (req, res) => {
//   const userId = req.params.id;

//   if (!userId) {
//     console.error("Invalid user ID");
//     return res.status(400).json({ message: "Invalid user ID" });
//   }

//   try {
//     // Get current active reward
//     const [currentActiveReward] = await db
//       .promise()
//       .query(`SELECT * FROM user_rewards WHERE is_active = 1 AND user_id = ?`, [userId]);

//     if (currentActiveReward.length === 0) {
//       console.warn(`No active reward found for User ID: ${userId}`);
//       return res.status(404).json({ message: "No active reward found" });
//     }

//     const currentRewardId = currentActiveReward[0].id;

//     // Get next reward
//     const [nextReward] = await db
//       .promise()
//       .query(
//         "SELECT id FROM user_rewards WHERE id > ? AND user_id = ? ORDER BY id ASC LIMIT 1",
//         [currentRewardId, userId]
//       );

//     if (nextReward.length === 0) {
//       console.warn(`No next reward found for User ID: ${userId}`);
//       return res.status(404).json({ message: "No next reward found" });
//     }

//     // Mark current reward as completed
//     await db
//       .promise()
//       .query(
//         "UPDATE user_rewards SET is_active = 0, is_completed = 1, completed_date = CURRENT_TIMESTAMP, start_date = NULL, end_date = NULL WHERE id = ?",
//         [currentRewardId]
//       );

//     // Activate next reward
//     await db
//       .promise()
//       .query(
//         "UPDATE user_rewards SET is_active = 1, start_date = CURRENT_TIMESTAMP, end_date = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY) WHERE id = ?",
//         [nextReward[0].id]
//       );

//     console.log(`Reward status updated for User ID: ${userId}`);

//     return res.status(200).json({
//       message: "Reward status updated successfully",
//       currentRewardId,
//       nextRewardId: nextReward[0].id,
//     });
//   } catch (error) {
//     console.error(`Error updating reward status for User ID ${userId}:`, error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
const isRewardPeriodExpired = (end_date, userId) => {
  const currentDate = new Date();
  const endDate = new Date(end_date);

  // Normalize dates to remove time and convert to UTC
  const normalizedCurrent = new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate()
    )
  );

  const normalizedEnd = new Date(
    Date.UTC(
      endDate.getUTCFullYear(),
      endDate.getUTCMonth(),
      endDate.getUTCDate()
    )
  );

  return normalizedCurrent > normalizedEnd;
};

const calculateRewardsForAllUsers = async (users) => {
  for (const user of users) {
    try {
      // Fetch active, incomplete rewards for the user
      const [activeRewardRows] = await db.promise().query(
        `SELECT * FROM user_rewards 
           WHERE is_active = 1 
           AND is_completed = 0 
           AND user_id = ?`,
        [user.id]
      );

      // If no active, incomplete rewards found, skip to next user
      if (!activeRewardRows || activeRewardRows.length === 0) {
        console.log(
          `No active, incomplete rewards found for user ${user.id}. Skipping.`
        );
        continue;
      }

      const {
        id: activeRewardId,
        reward_amount,
        threshold,
        start_date,
        end_date,
        reward_level,
      } = activeRewardRows[0];

      const currentDate = new Date();

      const isRewardExpire = isRewardPeriodExpired(end_date, user.id);

      // Check if reward period has finished
      if (isRewardExpire) {
        // Renew reward period for next 30 days
        const newStartDate = new Date(currentDate);
        const newEndDate = new Date(currentDate);
        newEndDate.setDate(newStartDate.getDate() + 30);

        await db.promise().query(
          `UPDATE user_rewards 
              SET start_date = ?, 
                  end_date = ?
              WHERE id = ?`,
          [newStartDate, newEndDate, activeRewardId]
        );

        // Filter referrals based on the new period
        const filteredReferrals = user.referrals.filter((referral) => {
          const referralActivatedAt = new Date(referral.activation_date);
          return (
            referralActivatedAt >= newStartDate &&
            referralActivatedAt <= newEndDate
          );
        });

        // Calculate business by leg for the new period
        const businessByLeg = calculateBusinessForLegs(filteredReferrals || []);

        // Sort and get top 3 legs
        const sortedLegs = Object.entries(businessByLeg)
          .map(([legId, totalBusiness]) => ({
            legId: parseInt(legId),
            totalBusiness,
          }))
          .sort((a, b) => b.totalBusiness - a.totalBusiness)
          .slice(0, 3);

        // Calculate total business
        const totalBusiness = sortedLegs.reduce(
          (sum, { totalBusiness }) => sum + totalBusiness,
          0
        );

        // Check if threshold is met
        if (totalBusiness >= threshold) {
          const required40 = (threshold * 40) / 100;
          const required30A = (threshold * 30) / 100;
          const required30B = (threshold * 30) / 100;

          const [firstLeg = 0, secondLeg = 0, thirdLeg = 0] = sortedLegs.map(
            (leg) => leg.totalBusiness
          );

          // Check leg business distribution
          if (
            firstLeg >= required40 &&
            secondLeg >= required30A &&
            thirdLeg >= required30B
          ) {
            console.log("stisfy the condition");

            // Update user reward
            await updateRewardForUser(user.id, reward_amount);
          } else {
            console.log(
              `Threshold met, but leg distribution not satisfied for user ${user.id}`
            );
          }
        } else {
          console.log(
            `Threshold not met for user ${user.id}. Current: ${totalBusiness}, Required: ${threshold}`
          );
        }
      } else {
        // Reward period is still active, process as before
        const filteredReferrals = user.referrals.filter((referral) => {
          const referralActivatedAt = new Date(referral.activation_date);
          return (
            referralActivatedAt >= new Date(start_date) &&
            referralActivatedAt <= new Date(end_date)
          );
        });

        // Rest of the existing logic for processing active reward period
        const businessByLeg = calculateBusinessForLegs(filteredReferrals || []);

        const sortedLegs = Object.entries(businessByLeg)
          .map(([legId, totalBusiness]) => ({
            legId: parseInt(legId),
            totalBusiness,
          }))
          .sort((a, b) => b.totalBusiness - a.totalBusiness)
          .slice(0, 3);

        // Calculate total business
        const totalBusiness = sortedLegs.reduce(
          (sum, { totalBusiness }) => sum + totalBusiness,
          0
        );
        // Update reward period and business details

        // Check if threshold is met
        if (totalBusiness >= threshold) {
          const required40 = (threshold * 40) / 100;
          const required30A = (threshold * 30) / 100;
          const required30B = (threshold * 30) / 100;

          const [firstLeg = 0, secondLeg = 0, thirdLeg = 0] = sortedLegs.map(
            (leg) => leg.totalBusiness
          );

          // Check leg business distribution
          if (
            firstLeg >= required40 &&
            secondLeg >= required30A &&
            thirdLeg >= required30B
          ) {
            console.log(user.id, reward_amount);
            // Update user reward
            await updateRewardForUser(user.id, reward_amount);
          } else {
            console.log(
              `Threshold met, but leg distribution not satisfied for user ${user.id}`
            );
          }
        } else {
          console.log(
            `Threshold not met for user ${user.id}. Current: ${totalBusiness}, Required: ${threshold}`
          );
        }
        // ... (similar processing as in the previous version)
      }
    } catch (error) {
      console.error(`Error processing rewards for user ${user.id}:`, error);
      continue;
    }
  }
};

exports.reward = catchAsyncErrors(async (req, res, next) => {
  try {
    const users = await fetchAllUsers();
    const referralTree = buildReferralTree(users);
    await calculateRewardsForAllUsers(referralTree);
    // res.json({ message: "Rewards calculated and updated successfully." });
    res
      .status(200)
      .json({ message: "Rewards calculated and updated successfully." });
  } catch (error) {
    console.error("Error in reward calculation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Main reward calculation controller

exports.initializeRewardsForUser = catchAsyncErrors(async (req, res, next) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Fetch all active rewards
    const [rewards] = await db
      .promise()
      .query(
        "SELECT id, threshold, duration_days, reward_amount FROM reward_plans WHERE is_active = 1 ORDER BY id ASC"
      );

    if (rewards.length === 0) {
      return res.status(404).json({ message: "No active rewards found" });
    }

    const startDate = new Date();
    const rewardEntries = [];

    rewards.forEach((reward, index) => {
      // Create a new endDate for each reward to avoid reference issues
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + reward.duration_days);

      for (let level = 1; level <= 1; level++) {
        const rewardAmount = reward.reward_amount;

        rewardEntries.push([
          user_id,
          reward.id,
          level,
          rewardAmount,
          index === 0 && level === 1 ? startDate : null, // Only first reward's level 1 gets startDate
          index === 0 && level === 1 ? endDate : null, // Only first reward's level 1 gets endDate
          reward.threshold,
          0, // current_business default
          0, // is_completed default (false)
          null, // completed_date (null by default)
          index === 0 && level === 1 ? 1 : 0, // Only first reward's level 1 is active
        ]);
      }
    });

    // Insert all rewards into user_rewards table
    await db.promise().query(
      `INSERT INTO user_rewards
          (user_id, reward_id, level, reward_amount, start_date, end_date, threshold, current_business, is_completed, completed_date, is_active)
          VALUES ?`,
      [rewardEntries]
    );

    res.status(201).json({ message: "All rewards initialized successfully" });
  } catch (error) {
    console.error("Error initializing rewards:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.getUserRewards = catchAsyncErrors(async (req, res, next) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required!" });
  }

  try {
    const [userRewards] = await db
      .promise()
      .execute(
        "SELECT ur.*, rp.title, rp.threshold, rp.duration_days,   rp.description FROM user_rewards ur JOIN reward_plans rp ON ur.reward_id = rp.id WHERE ur.user_id = ?",
        [user_id]
      );

    if (userRewards.length === 0) {
      return res.status(404).json({ error: "No rewards found for this user" });
    }

    res.status(200).json(userRewards);
  } catch (error) {
    console.error("Error fetching user rewards:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.createReward = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    description,
    threshold,
    duration_days,
    is_active,
    reward_amount,
  } = req.body;

  if (
    !title ||
    threshold == null ||
    duration_days == null ||
    is_active == null
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const query = `
    INSERT INTO reward_plans (title, description, threshold, duration_days, is_active, reward_amount)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    title,
    description || "",
    threshold,
    duration_days,
    is_active,
  ];

  try {
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error creating reward:", err);
        return next(err);
      }

      res.status(201).json({
        success: true,
        message: "Reward created successfully",
        reward_id: result.insertId,
      });
    });
  } catch (error) {
    console.error("Exception in createReward:", error);
    next(error);
  }
});

// 1. Get all rewards
exports.getAllRewards = catchAsyncErrors(async (req, res, next) => {
  try {
    db.query("SELECT * FROM reward_plans", (err, results) => {
      if (err) {
        console.error("Error fetching rewards:", err);
        return next(err);
      }
      res.status(200).json({ success: true, data: results });
    });
  } catch (error) {
    console.error("Exception in getAllRewards:", error);
    next(error);
  }
});

// 2. Update reward (partial/dynamic update)
exports.updateReward = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  if (!id || Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No update data provided or missing ID",
    });
  }

  try {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(updates);

    const query = `UPDATE reward_plans SET ${fields} WHERE id = ?`;

    db.query(query, [...values, id], (err, result) => {
      if (err) {
        console.error("Error updating reward:", err);
        return next(err);
      }
      res
        .status(200)
        .json({ success: true, message: "Reward updated successfully" });
    });
  } catch (error) {
    console.error("Exception in updateReward:", error);
    next(error);
  }
});

// 3. Delete reward
exports.deleteReward = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  try {
    db.query("DELETE FROM reward_plans WHERE id = ?", [id], (err, result) => {
      if (err) {
        console.error("Error deleting reward:", err);
        return next(err);
      }
      res
        .status(200)
        .json({ success: true, message: "Reward deleted successfully" });
    });
  } catch (error) {
    console.error("Exception in deleteReward:", error);
    next(error);
  }
});
