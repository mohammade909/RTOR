const express = require('express');
const router = express.Router()
const  transactionsController = require('../controllers/transactionController')

router.post('/list', transactionsController.getTransaction)
router.route('/tr/:user_id')
  .post(transactionsController.getTransactionById)
router.get("/rewards", transactionsController.getRewardTransactions);
  
  // Route to create a new transaction
router.post("/create", transactionsController.createTransactionService);

// Route to get all transactions
router.get("/all", transactionsController.getTransactions);

router.get("/user/:user_id", transactionsController.getUserTransactions);
router.get(
  "/roi-check/:user_id",
  transactionsController.checkTodayROITransaction
);
router.post(
  "/check-existing/:user_id",
  transactionsController.checkExistingTransactionBySource
);

// Route to update a transaction
router.put(
  "/update/:transaction_id",
  transactionsController.updateTransactionStatus
);
router.get(
  "/matrix",
  transactionsController.getTransactionSummaryBySource
);

module.exports = router

module.exports = router