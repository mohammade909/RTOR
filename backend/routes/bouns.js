const express = require("express");
const { addBonus, getAllBonuses, getBonus, updateBonus, deleteBonus, processCommunityBonuses } = require("../controllers/bonusController");
const router = express.Router();

// Create a new bonus
router.post("/add", addBonus);

// Get all bonuses
router.get("/", getAllBonuses);
router.get("/community-bonus", processCommunityBonuses);

// Get a specific bonus by ID
router.get("/:id", getBonus);

// Update a bonus (Admin Only)
router.put("/:id", updateBonus);

// Delete a bonus (Admin Only)
router.delete("/:id", deleteBonus);

module.exports = router;
