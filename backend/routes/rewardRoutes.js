const express = require("express");
const router = express.Router();
const {
  reward,
  initializeRewardsForUser,
  getUserRewards,
  getAllRewards,
  createReward,
  updateReward,
  deleteReward,
  calculateUserBusinessForReward,
  rewardForSingleUser,
} = require("../controllers/rewardController");

router.get("/", getAllRewards);
router.get("/update-rewards", reward);
router.post("/", createReward);
router.route("/:id").put(updateReward).delete(deleteReward);

router.post("/initialize", initializeRewardsForUser);
router.get("/user/:user_id", getUserRewards);
router.get("/user/business/:userId", calculateUserBusinessForReward);
router.get("/user/claim/:userId", rewardForSingleUser);

module.exports = router;
