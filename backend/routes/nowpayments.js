const express = require("express");

const { createPayment, getPaymentStatus, getCurrencies, handlePaymentCallback, getMinimumAmount, handlePaymentSuccess, handlePaymentCancel } = require("../controllers/nowpayment");
const router = express.Router();

router.post("/payment-callback", 
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    }
  }),
  handlePaymentCallback
);
router.post("/create-payment", createPayment);
router.get("/payment-status/:paymentId",getPaymentStatus);
router.get("/currencies", getCurrencies);
// router.post("/payment-callback", handlePaymentCallback);
router.get("/min-amount/:currency_from/:currency_to", getMinimumAmount);
router.get("/payment-success", handlePaymentSuccess);
router.get("/payment-cancel", handlePaymentCancel);

module.exports = router;
