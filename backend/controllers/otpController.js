const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const dotenv = require("dotenv");
const db = require("../config/database");
const asyncHandler = require("express-async-handler");

dotenv.config({ path: "backend/config/config.env" });
const nodemailer = require("nodemailer");

const transporter =  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "testyou659@gmail.com",
      pass: "iivn mtvy bcgk nmpf",
  }
})

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOTP = async (req, res) => {
  const { userId, email } = req.body;
  if (!userId || !email) {
    return res.status(400).json({ success: false, message: "User ID and email are required." });
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 minutes
  // Save OTP in the database
  db.query(
    "INSERT INTO otp_requests (user_id, otp, expires_at) VALUES (?, ?, ?)",
    [userId, otp, expiresAt],
    async (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error.", error: err });
      }

      // Send OTP via email
      try {
        await transporter.sendMail({
            from: 'testyou659@gmail.com',
            to: email,
            subject: 'Welcome to TestingYou!',
          text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
        });

        return res.status(200).json({ success: true, message: "OTP sent successfully." });
      } catch (error) {
        return res.status(500).json({ success: false, message: "Error sending email.", error });
      }
    }
  );
};

exports.verifyOTP = (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "User ID and OTP are required." });
  }

  db.query(
    "SELECT * FROM otp_requests WHERE user_id = ? AND otp = ? AND expires_at > NOW()",
    [userId, otp],
    (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error.", error: err });
      }
      
      if (results.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
      }

      db.query(
        "DELETE FROM otp_requests WHERE user_id = ? AND otp = ?",
        [userId, otp],
        (deleteErr) => {
          if (deleteErr) {
            return res.status(500).json({ success: false, message: "Error clearing OTP.", error: deleteErr });
          }

          return res.status(200).json({ success: true, message: "OTP verified successfully." });
        }
      );
    }
  );
};
