const {
  createBonus,
  getBonuses,
  getBonusById,
  updateBonus,
  deleteBonus,
} = require("../services/bonusService");
const { createTransaction } = require("../controllers/transactionController");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database");
const moment = require("moment");
// Create a new bonus

exports.addBonus = catchAsyncErrors(async (req, res) => {
  const { amount, bonus_type, status } = req.body;

  if (!amount || !bonus_type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await createBonus(amount, bonus_type, status);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});
// Get all bonuses
exports.getAllBonuses = catchAsyncErrors(async (req, res) => {
  try {
    const bonuses = await getBonuses();
    res.status(200).json(bonuses);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get a single bonus by ID
exports.getBonus = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  try {
    const bonus = await getBonusById(id);
    if (!bonus) {
      return res.status(404).json({ message: "Bonus not found" });
    }
    res.status(200).json(bonus);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update a bonus (Admin Only)
exports.updateBonus = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  // Only include fields that are present in the request body
  // const allowedFields = ['amount', 'bonus_type', 'status'];

  // allowedFields.forEach(field => {
  //   if (req.body[field] !== undefined) {
  //     updateFields[field] = req.body[field];
  //   }
  // });

  try {
    // Validate that at least one field is being updated
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        message:
          "No valid fields to update. Please provide at least one of: amount, bonus_type, status",
      });
    }

    const result = await updateBonus(id, updateFields);
    res.status(200).json(result);
  } catch (error) {
    // Handle errors with appropriate status codes
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      message: error.message || "An error occurred while updating the bonus",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
});

// Delete a bonus (Admin Only)
exports.deleteBonus = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteBonus(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

exports.processCommunityBonuses = catchAsyncErrors(async (req, res) => {
  const connection = db;
  const logger = createLogger('community-bonus');

  try {
    logger.info('Starting community bonus processing');
    await connection.promise().beginTransaction();

    const today = moment().format("YYYY-MM-DD");
    const todayStart = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    const todayEnd = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");

    logger.info(`Processing for date: ${today}`);

    const [users] = await connection
      .promise()
      .query(`SELECT * FROM users WHERE is_active = 'active' AND status = 'unblock'`);

    logger.info(`Found ${users.length} active and unblocked users to process`);

    const results = {
      processed: 0,
      skipped: 0,
      details: [],
    };

    for (const user of users) {
      logger.info(`Processing user ID: ${user.id}, referral code: ${user.refferal_code}`);

      const [existingTransaction] = await connection.promise().query(
        `SELECT * FROM transactions 
         WHERE user_id = ? 
         AND transaction_type = 'community_bonus' 
         AND created_at BETWEEN ? AND ?`,
        [user.id, todayStart, todayEnd]
      );

      if (existingTransaction.length > 0) {
        logger.info(`User ${user.id} already received bonus today, skipping`);
        results.skipped++;
        results.details.push({
          user_id: user.id,
          status: "skipped",
          reason: "Already received community bonus today",
        });
        continue;
      }

      const [directMembers] = await connection
        .promise()
        .query(`SELECT * FROM users WHERE reffer_by = ?`, [user.refferal_code]);

      const directMemberCount = directMembers.length;
      logger.info(`User ${user.id} has ${directMemberCount} direct members`);

      if (directMemberCount === 0) {
        logger.info(`User ${user.id} has no direct members, skipping`);
        results.skipped++;
        results.details.push({
          user_id: user.id,
          status: "skipped",
          reason: "No direct members",
        });
        continue;
      }

      logger.info(`Finding bonus tier for user ${user.id}`);
      const [bonusTiers] = await connection.promise().query(
        `SELECT * FROM bonuses 
         WHERE status = 'approved' 
         AND bonus_type = 'community_income'
         ORDER BY direct_members DESC`
      );

      let matchedTier = null;
      logger.info(`Checking ${bonusTiers.length} bonus tiers for qualification`);

      for (const tier of bonusTiers) {
        logger.info(`Checking tier: direct_members=${tier.direct_members}, amount=${tier.amount}`);
        if (directMemberCount >= tier.direct_members) {
          matchedTier = tier;
          logger.info(`User ${user.id} qualifies for tier: ${JSON.stringify(matchedTier)}`);
          break;
        }
      }

      if (!matchedTier) {
        logger.info(`User ${user.id} does not qualify for any bonus tier, skipping`);
        results.skipped++;
        results.details.push({
          user_id: user.id,
          status: "skipped",
          reason: "No applicable bonus tier found",
          direct_members: directMemberCount,
        });
        continue;
      }

      const bonusAmount = matchedTier.amount;

      if (bonusAmount <= 0) {
        logger.info(`User ${user.id} calculated bonus amount is zero, skipping`);
        results.skipped++;
        results.details.push({
          user_id: user.id,
          status: "skipped",
          reason: "Calculated bonus amount is zero",
        });
        continue;
      }

      const multiPlier = 5;
      const limit_plan = user.limit_plan || 1000;
      const maxLimit = multiPlier * limit_plan;
      logger.info(`User ${user.id} max reward limit: ${maxLimit}, current amount: ${user.max_amount}`);

      let finalBonus = bonusAmount;
      if (user.max_amount + bonusAmount > maxLimit) {
        finalBonus = maxLimit - user.max_amount;
        logger.info(`User ${user.id} would exceed max limit, capping bonus to ${finalBonus}`);

        if (finalBonus <= 0) {
          logger.info(`User ${user.id} has reached maximum reward limit, skipping`);
          results.skipped++;
          results.details.push({
            user_id: user.id,
            status: "skipped",
            reason: "User has reached maximum reward limit",
            maxLimit,
            currentAmount: user.max_amount,
          });
          continue;
        }
      }

      logger.info(`Updating user ${user.id} with bonus amount ${finalBonus}`);
      await connection.promise().query(
        `UPDATE users
         SET 
           community_income = community_income + ?,
           working = working + ?,
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
          finalBonus,
          finalBonus,
          finalBonus,
          finalBonus,
          maxLimit,
          finalBonus,
          maxLimit,
          finalBonus,
          maxLimit,
          user.id,
        ]
      );

      logger.info(`Adding transaction record for user ${user.id}`);
      await connection.promise().query(
        `INSERT INTO transactions
         (user_id, amount, transaction_type, source, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [user.id, finalBonus, "credit", "community_bonus", "completed"]
      );

      results.processed++;
      results.details.push({
        user_id: user.id,
        status: "processed",
        directMembers: directMemberCount,
        matchedTier: {
          id: matchedTier.id,
          directMembers: matchedTier.direct_members,
          amount: matchedTier.amount,
        },
        originalBonus: bonusAmount,
        finalBonus: finalBonus,
        maxLimit: maxLimit,
      });

      logger.info(`Successfully processed bonus for user ${user.id}`);
    }

    await connection.promise().commit();
    logger.info(`Community bonus processing completed. Processed: ${results.processed}, Skipped: ${results.skipped}`);

    return res.status(200).json({
      success: true,
      message: "Community bonuses processed successfully",
      results,
    });
  } catch (error) {
    logger.error(`Error processing community bonuses: ${error.message}`, { stack: error.stack });
    await connection.promise().rollback();

    return res.status(500).json({
      success: false,
      message: "Failed to process community bonuses",
      error: error.message,
    });
  }
});

// New helper function to calculate total team volume from the entire referral tree
const calculateTotalTeamVolume = async (referralTree) => {
  const logger = createLogger('team-volume');
  logger.info(`Calculating total team volume`);
  
  // Use recursion to sum up active_plan values across the entire tree
  const calculateVolume = (members) => {
    let totalVolume = 0;
    
    for (const member of members) {
      // Add this member's active_plan value (default to 0 if not set)
      totalVolume += Number(member.active_plan || 0);
      
      // Recursively add volumes from all referrals (downline)
      if (member.referrals && member.referrals.length > 0) {
        totalVolume += calculateVolume(member.referrals);
      }
    }
    
    return totalVolume;
  };
  
  const totalVolume = calculateVolume(referralTree);
  logger.info(`Total team volume calculated: ${totalVolume}`);
  
  return totalVolume;
};

// New helper function to extract all team member IDs from the referral tree
const extractAllTeamMemberIds = (referralTree) => {
  const logger = createLogger('team-ids');
  logger.info(`Extracting all team member IDs`);
  
  const memberIds = [];
  
  // Use recursion to extract all member IDs from the entire tree
  const extractIds = (members) => {
    for (const member of members) {
      memberIds.push(member.id);
      
      // Recursively extract IDs from all referrals (downline)
      if (member.referrals && member.referrals.length > 0) {
        extractIds(member.referrals);
      }
    }
  };
  
  extractIds(referralTree);
  logger.info(`Total team member IDs extracted: ${memberIds.length}`);
  
  return memberIds;
};

const getFullReferralTree = async (referral_code) => {
  const logger = createLogger('referral-tree');
  logger.info(`Getting full referral tree for code: ${referral_code}`);
  
  const fetchReferralTree = async (referralCode) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, username, is_active, created_at, active_plan, email, status, refferal_code
        FROM users
        WHERE reffer_by = ?
      `;
      
      db.query(sql, [referralCode], async (err, result) => {
        if (err) {
          logger.error(`Error fetching referrals for code ${referralCode}:`, err);
          return reject(new ErrorHandler("Error fetching tree!", 500));
        }

        logger.info(`Found ${result.length} direct referrals for code ${referralCode}`);
        const tree = [];
        
        for (const user of result) {
          try {
            const userTree = await fetchReferralTree(user.refferal_code);
            tree.push({ ...user, referrals: userTree });
          } catch (innerErr) {
            return reject(innerErr);
          }
        }

        resolve(tree);
      });
    });
  };

  try {
    const referralTree = await fetchReferralTree(referral_code);
    logger.info(`Successfully retrieved referral tree for code ${referral_code}`);
    return referralTree;
  } catch (error) {
    logger.error(`Error in getFullReferralTree: ${error.message}`, { stack: error.stack });
    throw error;
  }
};

async function countTotalTeamWithActiveInactive(user) {
  const logger = createLogger('referral-tree');
  logger.info(`Counting team members for user ID: ${user.id}, referral code: ${user.refferal_code}`);
  
  try {
    // Get the full referral tree
    const referralTree = await getFullReferralTree(user.refferal_code);
    
    // Count team members using an iterative approach
    let totalTeam = 0;
    let activeCount = 0;
    let inactiveCount = 0;
    
    // Function to process the tree recursively
    const processTree = (members) => {
      for (const member of members) {
        totalTeam++;
        
        if (member.is_active === "active") {
          activeCount++;
        } else if (member.is_active === "inactive") {
          inactiveCount++;
        }
        
        if (member.referrals && member.referrals.length > 0) {
          processTree(member.referrals);
        }
      }
    };
    
    // Process the tree
    processTree(referralTree);
    
    logger.info(`User ${user.id} team stats: active=${activeCount}, inactive=${inactiveCount}, total=${totalTeam}`);
    
    return { totalTeam, activeCount, inactiveCount };
  } catch (error) {
    logger.error(`Error counting team members: ${error.message}`, { stack: error.stack });
    throw error;
  }
}


function createLogger(module) {
  return {
    info: (message, meta = {}) => console.log(`[INFO][${module}] ${message}`, meta),
    error: (message, meta = {}) => console.error(`[ERROR][${module}] ${message}`, meta),
    warn: (message, meta = {}) => console.warn(`[WARN][${module}] ${message}`, meta),
    debug: (message, meta = {}) => console.debug(`[DEBUG][${module}] ${message}`, meta),
  };
}


exports.getUserCommunityBonusStats = catchAsyncErrors( async (req, res) => {
  const { userId } = req.params;

  try {
    // Get user details
    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get direct members count
    const [directMembers] = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE reffer_by = ?",
      [user[0].refferal_code]
    );

    // Get total received community bonuses
    const [bonuses] = await pool.query(
      `SELECT SUM(amount) as totalBonus FROM transactions 
       WHERE user_id = ? AND transaction_type = 'community_bonus'`,
      [userId]
    );

    // Get bonus tier information
    const [bonusTiers] = await pool.query(
      `SELECT * FROM bounses WHERE bonus_type = 'community' ORDER BY direct_members ASC`
    );

    // Calculate remaining capacity
    const multiPlier = 3;
    const limit_plan = user[0].limit_plan || 1000;
    const maxLimit = multiPlier * limit_plan;
    const remainingCapacity = Math.max(0, maxLimit - user[0].max_amount);

    return res.status(200).json({
      success: true,
      data: {
        userId: user[0].id,
        username: user[0].username,
        directMembers: directMembers[0].count,
        totalReceivedBonus: bonuses[0].totalBonus || 0,
        maxAmount: user[0].max_amount,
        maxLimit: maxLimit,
        remainingCapacity: remainingCapacity,
        bonusTiers: bonusTiers,
      },
    });
  } catch (error) {
    console.error("Error getting user community bonus stats:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get user community bonus statistics",
      error: error.message,
    });
  }
})
