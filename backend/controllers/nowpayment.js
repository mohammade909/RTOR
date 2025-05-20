// controllers/paymentController.js
const axios = require("axios");
const crypto = require("crypto");
const db = require("../config/database");

// NOWPayments API configuration
const NOWPAYMENTS_API_URL = "https://api.nowpayments.io/v1";
// Load API key from environment variables for better security
const NOWPAYMENTS_API_KEY = "SEWYR4R-Q424W78-H98A31X-JVP9XHS";
// Load IPN secret key from environment variables for better security
const IPN_SECRET_KEY = "OJXfNdKabLsUJ0+Zdqt9qUJj+1SQDDvr";
// Base URL for your application - should be configurable for different environments
const BASE_URL =
  "http://localhost:8000/api/v1/now-payments";

const headers = {
  "x-api-key": NOWPAYMENTS_API_KEY,
  "Content-Type": "application/json",
};

// Create payment endpoint
// exports.createPayment = async (req, res) => {
//   try {
//     const {
//       price_amount = 0.10,
//       price_currency = 'usd',
//       id,
//       pay_currency = 'usdtbsc'
//     } = req.body;

//     // Validate price amount is a positive number
//     if (isNaN(price_amount) || price_amount <= 0) {
//       return res.status(400).json({ error: 'Price amount must be a positive number' });
//     }

//     // Validate price currency is supported
//     const supportedFiatCurrencies = ['usd', 'eur', 'gbp', 'jpy'];
//     if (!supportedFiatCurrencies.includes(price_currency.toLowerCase())) {
//       return res.status(400).json({
//         error: `Unsupported price currency. Supported: ${supportedFiatCurrencies.join(', ')}`
//       });
//     }

//     // Get available cryptocurrencies to validate pay_currency
//     try {
//       const currenciesResponse = await axios.get(`${NOWPAYMENTS_API_URL}/currencies`, {
//         headers,
//         timeout: 10000 // 10 seconds timeout
//       });

//       // Extract the supported currencies from the response
//       const supportedCryptoCurrencies = currenciesResponse.data.currencies || [];

//       // Check if the pay_currency is in the supported list
//       if (supportedCryptoCurrencies.length > 0 &&
//           !supportedCryptoCurrencies.includes(pay_currency.toLowerCase())) {
//         return res.status(400).json({
//           error: `Unsupported payment currency. Please choose from available options.${supportedCryptoCurrencies}`
//         });
//       }
//     } catch (currencyError) {
//       console.error('Error fetching supported currencies:', currencyError.message);
//       // Continue with the payment process instead of failing
//       // We'll let the NowPayments API handle currency validation
//     }

//     // Prepare payment data with proper callback URLs
//     const paymentData = {
//       price_amount: parseFloat(price_amount).toFixed(2),
//       price_currency: price_currency.toLowerCase(),
//       order_id: id,
//       ipn_callback_url: `${BASE_URL}/payment-callback`, // Use environment-specific URL
//       success_url: `${BASE_URL}/payment-success`,
//       cancel_url: `${BASE_URL}/payment-cancel`,
//       pay_currency: pay_currency.toLowerCase()
//     };

//     // Create the payment
//     const response = await axios.post(`${NOWPAYMENTS_API_URL}/payment`, paymentData, {
//       headers,
//       timeout: 10000 // 10 seconds timeout
//     });

//     // Return the payment data along with additional useful information
//     res.json({
//       success: true,
//       payment_id: response.data.payment_id,
//       payment_status: response.data.payment_status,
//       pay_address: response.data.pay_address,
//       pay_amount: response.data.pay_amount,
//       price_amount: response.data.price_amount,
//       price_currency: response.data.price_currency,
//       pay_currency: response.data.pay_currency,
//       expires_at: response.data.expires_at,
//       order_id: paymentData.id,
//       verification_url: `https://nowpayments.io/payment/?iid=${response.data.payment_id}`,
//       timestamp: new Date().toISOString()
//     });

//   } catch (error) {
//     console.error('Error creating payment:', error.response ? error.response.data : error.message);

//     // Enhanced error handling
//     let statusCode = 500;
//     let errorMessage = 'Internal server error';

//     if (error.response) {
//       statusCode = error.response.status;
//       errorMessage = error.response.data.message || JSON.stringify(error.response.data);
//     } else if (error.request) {
//       errorMessage = 'No response received from payment gateway';
//     } else if (error.code === 'ECONNABORTED') {
//       errorMessage = 'Request to payment gateway timed out';
//     }

//     res.status(statusCode).json({
//       success: false,
//       error: errorMessage,
//       timestamp: new Date().toISOString()
//     });
//   }
// };

exports.createPayment = async (req, res) => {
  // Initialize logger (assuming you have a logger setup)
  const logger = req.logger || console;
  const requestId = req.id || Math.random().toString(36).substring(2, 9);

  try {
    logger.info(`[${requestId}] Payment creation initiated`, {
      body: req.body,
      headers: req.headers,
      ip: req.ip,
    });

    const {
      price_amount = 0.1,
      price_currency = "usd",
      pay_currency = "usdtbsc",
      id,
    } = req.body;

    // Validate price amount is a positive number
    if (isNaN(price_amount) || price_amount <= 0) {
      logger.warn(`[${requestId}] Invalid price amount`, { price_amount });
      return res
        .status(400)
        .json({ error: "Price amount must be a positive number" });
    }

    // Validate price currency is supported
    const supportedFiatCurrencies = ["usd", "eur", "gbp", "jpy"];
    if (!supportedFiatCurrencies.includes(price_currency.toLowerCase())) {
      logger.warn(`[${requestId}] Unsupported price currency`, {
        price_currency,
      });
      return res.status(400).json({
        error: `Unsupported price currency. Supported: ${supportedFiatCurrencies.join(
          ", "
        )}`,
      });
    }

    // Get available cryptocurrencies to validate pay_currency
    try {
      logger.debug(
        `[${requestId}] Fetching supported currencies from NowPayments`
      );
      const currenciesResponse = await axios.get(
        `${NOWPAYMENTS_API_URL}/currencies`,
        {
          headers,
          timeout: 10000, // 10 seconds timeout
        }
      );

      // Extract the supported currencies from the response
      const supportedCryptoCurrencies =
        currenciesResponse.data.currencies || [];

      // Check if the pay_currency is in the supported list
      if (
        supportedCryptoCurrencies.length > 0 &&
        !supportedCryptoCurrencies.includes(pay_currency.toLowerCase())
      ) {
        logger.warn(`[${requestId}] Unsupported payment currency`, {
          pay_currency,
          supportedCryptoCurrencies,
        });
        return res.status(400).json({
          error: `Unsupported payment currency. Please choose from available options.${supportedCryptoCurrencies}`,
        });
      }
    } catch (currencyError) {
      logger.error(
        `[${requestId}] Error fetching supported currencies:`,
        currencyError.message
      );
      // Continue with the payment process instead of failing
      // We'll let the NowPayments API handle currency validation
    }

    // Prepare payment data with proper callback URLs
    const ipnCallbackUrl = `${BASE_URL}/payment-callback`;
    const paymentData = {
      price_amount: parseFloat(price_amount).toFixed(2),
      price_currency: price_currency.toLowerCase(),
      order_id: id,
      ipn_callback_url: ipnCallbackUrl,
      success_url: `${BASE_URL}/payment-success`,
      cancel_url: `${BASE_URL}/payment-cancel`,
      pay_currency: pay_currency.toLowerCase(),
    };

    logger.info(`[${requestId}] Creating payment with NowPayments`, {
      paymentData,
      callbackUrl: ipnCallbackUrl,
    });

    // Create the payment
    const response = await axios.post(
      `${NOWPAYMENTS_API_URL}/payment`,
      paymentData,
      {
        headers,
        timeout: 10000, // 10 seconds timeout
      }
    );

    // Log the payment creation response
    logger.info(`[${requestId}] Payment created successfully`, {
      paymentId: response.data.payment_id,
      payAddress: response.data.pay_address,
      amount: response.data.pay_amount,
      currency: response.data.pay_currency,
      expiresAt: response.data.expires_at,
    });

    // Store payment details in database for IPN verification tracking
    // try {
    //   await PaymentModel.create({
    //     paymentId: response.data.payment_id,
    //     orderId: id,
    //     amount: paymentData.price_amount,
    //     currency: paymentData.price_currency,
    //     payCurrency: paymentData.pay_currency,
    //     status: 'created',
    //     ipnCallbackUrl,
    //     ipnStatus: 'pending',
    //     createdAt: new Date(),
    //     expiresAt: response.data.expires_at
    //   });
    //   logger.debug(`[${requestId}] Payment details stored in database`);
    // } catch (dbError) {
    //   logger.error(`[${requestId}] Failed to store payment details in database:`, dbError.message);
    //   // Continue even if database storage fails
    // }

    // Return the payment data along with additional useful information
    const responseData = {
      success: true,
      payment_id: response.data.payment_id,
      payment_status: response.data.payment_status,
      pay_address: response.data.pay_address,
      pay_amount: response.data.pay_amount,
      price_amount: response.data.price_amount,
      price_currency: response.data.price_currency,
      pay_currency: response.data.pay_currency,
      expires_at: response.data.expires_at,
      order_id: paymentData.id,
      verification_url: `https://nowpayments.io/payment/?iid=${response.data.payment_id}`,
      timestamp: new Date().toISOString(),
      ipn_callback_url: ipnCallbackUrl,
    };

    logger.info(`[${requestId}] Payment creation completed`, {
      paymentId: response.data.payment_id,
      status: "success",
    });

    res.json(responseData);
  } catch (error) {
    logger.error(`[${requestId}] Error creating payment:`, {
      error: error.message,
      stack: error.stack,
      response: error.response ? error.response.data : null,
    });

    // Enhanced error handling
    let statusCode = 500;
    let errorMessage = "Internal server error";

    if (error.response) {
      statusCode = error.response.status;
      errorMessage =
        error.response.data.message || JSON.stringify(error.response.data);
      logger.error(`[${requestId}] Payment API error response:`, {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      errorMessage = "No response received from payment gateway";
      logger.error(`[${requestId}] No response from payment gateway`);
    } else if (error.code === "ECONNABORTED") {
      errorMessage = "Request to payment gateway timed out";
      logger.error(`[${requestId}] Request timeout`);
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      requestId,
    });
  }
};

// Payment callback (IPN) endpoint
exports.handlePaymentCallback = async (req, res) => {
  try {
    console.log("Payment callback received", new Date().toISOString());
    console.log("Headers:", JSON.stringify(req.headers));

    // Get NOWPayments signature from headers
    const nowpaymentsSignature = req.headers["x-nowpayments-sig"];

    if (!nowpaymentsSignature) {
      console.error("Missing signature header");
      return res.status(400).json({ error: "Missing signature header" });
    }

    // Use raw body for HMAC validation to ensure exact matching
    const requestBody = req.rawBody || JSON.stringify(req.body);

    // Create HMAC signature using the IPN secret key
    const hmac = crypto.createHmac("sha512", IPN_SECRET_KEY);
    const signature = hmac.update(requestBody).digest("hex");

    console.log("Computed signature:", signature);
    console.log("NOWPayments signature:", nowpaymentsSignature);

    // Verify signature
    if (signature !== nowpaymentsSignature) {
      console.error("Invalid signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Process the payment notification
    const { price_amount, order_id, purchase_id, payment_status } = req.body;

    console.log(`Payment notification validated for payment with status `);
    console.log("Payment details:", JSON.stringify(req.body));

    // Update order status in your database based on payment_status
    // payment_status can be: waiting, confirming, confirmed, sending, partially_paid, finished, failed, refunded, expired

    if (payment_status == "finished") {
      await updateUserPayment(order_id, price_amount, purchase_id);
    }
    // Here you would typically update your database

    // NOWPayments expects a 200 OK response with no body or a simple JSON response
    res.status(200).json({ status: "OK" });
  } catch (error) {
    console.error("Error processing payment callback:", error);
    // Still return 200 to prevent NOWPayments from continually retrying
    res.status(200).json({ status: "Error processing payment, but received" });
  }
};

// Get payment status endpoint
exports.getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const response = await axios.get(
      `${NOWPAYMENTS_API_URL}/payment/${paymentId}`,
      { headers }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error getting payment status:",
      error.response ? error.response.data : error.message
    );
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : "Internal server error",
    });
  }
};

// Get available currencies endpoint
exports.getCurrencies = async (req, res) => {
  try {
    const response = await axios.get(`${NOWPAYMENTS_API_URL}/currencies`, {
      headers,
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching currencies:",
      error.response ? error.response.data : error.message
    );
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : "Internal server error",
    });
  }
};

// Get minimum payment amount for a specific currency
exports.getMinimumAmount = async (req, res) => {
  try {
    const { currency_from, currency_to } = req.params;

    const response = await axios.get(
      `${NOWPAYMENTS_API_URL}/min-amount?currency_from=${currency_from}&currency_to=${currency_to}`,
      { headers }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error getting minimum amount:",
      error.response ? error.response.data : error.message
    );
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : "Internal server error",
    });
  }
};

// Success and cancel page handlers
exports.handlePaymentSuccess = (req, res) => {
  console.log("Payment success route accessed", req.query);
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  } else {
    res.send(
      "Payment successful! This route will serve the React app in production."
    );
  }
};

exports.handlePaymentCancel = (req, res) => {
  console.log("Payment cancel route accessed", req.query);
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  } else {
    res.send(
      "Payment cancelled! This route will serve the React app in production."
    );
  }
};

// adjust path as needed

async function updateUserPayment(user_id, amount, purchase_id) {
  return new Promise((resolve, reject) => {
    // Start transaction
    db.beginTransaction((err) => {
      if (err) return reject(err);

      // 1. First check if transaction already exists
      const checkTransactionQuery = `
        SELECT id FROM user_deposite 
        WHERE user_id = ? AND purchase_id = ?
        LIMIT 1
      `;

      db.query(
        checkTransactionQuery,
        [user_id, purchase_id],
        (err, results) => {
          if (err) {
            return db.rollback(() => reject(err));
          }

          if (results.length > 0) {
            // Transaction already exists - rollback and return
            db.rollback(() => {
              console.log(
                `[DB Check] Transaction already exists for user ${user_id}, purchase ${purchase_id}`
              );
              resolve({
                skipped: true,
                message: "Transaction already processed",
                existingTransactionId: results[0].id,
              });
            });
            return;
          }

          // 2. Update the user's business (only if transaction doesn't exist)
          const updateUserQuery =
            "UPDATE users SET business = business + ? WHERE id = ?";
          db.query(updateUserQuery, [amount, user_id], (err, updateResult) => {
            if (err) {
              return db.rollback(() => reject(err));
            }

            // 3. Insert payment record with purchase_id
            const insertPaymentQuery = `
            INSERT INTO user_deposite 
            (user_id, amount, status, createdAT, acceptat, currency, purchase_id)
            VALUES (?, ?, ?, NOW(), NOW(), ?, ?)
          `;
            db.query(
              insertPaymentQuery,
              [user_id, amount, "complete", "USDTBSC", purchase_id],
              (err, insertResult) => {
                if (err) {
                  return db.rollback(() => reject(err));
                }

                // Commit transaction
                db.commit((err) => {
                  if (err) {
                    return db.rollback(() => reject(err));
                  }
                  console.log(
                    `[DB Update] User ${user_id} business updated & payment entry added for purchase ${purchase_id}`
                  );
                  resolve({
                    success: true,
                    updateResult,
                    insertResult,
                    purchaseId: purchase_id,
                  });
                });
              }
            );
          });
        }
      );
    });
  });
}
