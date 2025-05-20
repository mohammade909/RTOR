const express = require("express");
const router = express.Router();
const {
  salary,
  getSalaryTierStats,
  getAdminSalaryDashboard,
  getSalaryTransactions,
  getTodaySalaryStats,
  getUserSalaries,
  getUserSalaryHistory,
  getUserSalaryStats,
} = require("../controllers/salaryController");

router.get("/", salary);

router.get("/user-salaries", getUserSalaries);
router.get("/transactions", getSalaryTransactions);
router.get("/today-stats", getTodaySalaryStats);
router.get("/today-stats", getTodaySalaryStats);
router.get("/user-history", getUserSalaryHistory);
router.get("/tier-stats", getSalaryTierStats);
router.get("/admin-dashboard", getAdminSalaryDashboard);

module.exports = router;
