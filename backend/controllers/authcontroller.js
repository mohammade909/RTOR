const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const sendToken = require("../utils/jwtToken");
const asyncHandler = require("express-async-handler");
const fetchSetRoiFromAdminSettings = require("../utils/settings");
const sendAdminToken = require("../utils/adminjwtToken");
const { sendMail, verifyMail } = require("../utils/mailer");

const db = require("../config/database");

const generateReferralCode = async () => {
  const randomNumber = Math.floor(Math.random() * 999999) + 1; // Generate a random number between 1 and 999999
  const formattedNumber = randomNumber.toString().padStart(6, "0"); // Format number to 6 digits with leading zeros if necessary
  return `RTR${formattedNumber}`;
};

exports.signup = catchAsyncErrors(async (request, response, next) => {
  const { phone, email, password, confirmPassword, referralBy, fullname } =
    request.body;

  // Check if admin allows registrations
  const { setregister } = await fetchSetRoiFromAdminSettings();
  if (setregister !== 1) {
    return next(new ErrorHandler("Admin not allowing new registration.", 400));
  }

  // Generate username (Referral Code)
  const username = await generateReferralCode();

  // Validate required fields
  if (!username || !email || !password || !confirmPassword || !fullname) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match.", 400));
  }

  try {
    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });

    if (existingUser) {
      return response
        .status(400)
        .json({ error: "User with this email already exists." });
    }

    const referralCode = username;

    // Begin transaction
    db.beginTransaction(async (transactionErr) => {
      if (transactionErr) {
        console.error("Error starting transaction:", transactionErr);
        return next(new ErrorHandler("Error during signup!", 500));
      }

      try {
        let referringUser;
        if (referralBy) {
          // Check if referral code exists
          referringUser = await new Promise((resolve, reject) => {
            db.query(
              "SELECT * FROM users WHERE refferal_code = ?",
              [referralBy],
              (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) {
                  return response
                    .status(400)
                    .json({ error: "Invalid referral code." });
                }
                resolve(results[0]);
              }
            );
          });

          // Update referrer's total team count
          await new Promise((resolve, reject) => {
            db.query(
              "UPDATE users SET total_team = total_team + 1 WHERE id = ?",
              [referringUser.id],
              (err, result) => {
                if (err) return reject(err);
                resolve(result);
              }
            );
          });
        }

        // Insert new user
        const sql = `
          INSERT INTO users (username,fullname, phone, email, password, refferal_code ${
            referralBy ? ", reffer_by" : ""
          })
          VALUES (?, ?,?, ?, ?, ? ${referralBy ? ", ?" : ""})
        `;
        const values = [
          username,
          fullname,
          phone,
          email,
          password,
          referralCode,
        ];
        if (referralBy) values.push(referralBy);

        const insertResult = await new Promise((resolve, reject) => {
          db.query(sql, values, (err, result) => {
            if (err) {
              if (err.code === "ER_DUP_ENTRY") {
                return response
                  .status(400)
                  .json({ error: "User with this email already exists." });
              }
              return reject(err);
            }
            resolve(result);
          });
        });

        if (insertResult.affectedRows > 0) {
          const userId = insertResult.insertId;

          // Fetch the newly inserted user's full data
          const auth = await new Promise((resolve, reject) => {
            db.query(
              "SELECT * FROM users WHERE id = ?",
              [userId],
              (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
              }
            );
          });

          db.commit((commitErr) => {
            if (commitErr) {
              console.error("Error committing transaction:", commitErr);
              return next(new ErrorHandler("Error during signup!", 500));
            }

            sendMail(email, username, password);
            sendToken(auth, 201, response);
          });
        } else {
          throw new ErrorHandler("User could not be created", 400);
        }
      } catch (err) {
        db.rollback(() => {
          console.error("Error during signup:", err);
          return next(
            err instanceof ErrorHandler
              ? err
              : new ErrorHandler("Error during signup!", 500)
          );
        });
      }
    });
  } catch (err) {
    return next(new ErrorHandler("Error checking existing email!", 500));
  }
});

exports.adminsignin = catchAsyncErrors(async (request, response, next) => {
  const { email, password } = request.body;

  const table = "users";
  const sql = `SELECT * FROM ${table} WHERE email=? AND password=? AND role !='user';`;
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error("Error during login:", err);
      return next(new ErrorHandler("Error during login!", 400));
    }
    if (result.length > 0) {
      const admin = result[0];

      // Update last_login column with current date and time
      const updateLastLoginSql = `UPDATE ${table} SET last_login = NOW() WHERE id = ?`;
      db.query(updateLastLoginSql, [admin.id], (updateErr) => {
        if (updateErr) {
          console.error("Error updating last login:", updateErr);
          return next(new ErrorHandler("Error updating last login!", 500));
        }

        sendAdminToken(admin, 201, response);
      });
    } else {
      return response
        .status(404)
        .json({ message: "Admin not found with provided credentials" });
    }
  });
});

exports.signin = catchAsyncErrors(async (request, response, next) => {
  const { email, password } = request.body;
  const table = "users";
  const sql = `SELECT * FROM ${table} WHERE (email=? OR username=?) AND password=? AND role != 'admin';`;

  const { setlogin } = await fetchSetRoiFromAdminSettings();

  if (setlogin !== 1) {
    return response
      .status(404)
      .json({ message: "Admin not allowed user login" });
  } else {
    db.query(sql, [email, email, password], (err, result) => {
      if (err) {
        console.error("Error during login:", err);
        return next(new ErrorHandler("Error during login!", 500));
      }
      if (result.length > 0) {
        const auth = result[0];

        const updateLastLoginSql = `UPDATE ${table} SET last_login = NOW() WHERE id = ?`;
        db.query(updateLastLoginSql, [auth.id], (updateErr) => {
          if (updateErr) {
            console.error("Error updating last login:", updateErr);
            return next(new ErrorHandler("Error updating last login!", 500));
          }

          sendToken(auth, 201, response);
        });
      } else {
        return response
          .status(404)
          .json({ message: "User not found with provided credentials" });
      }
    });
  }
});

exports.signout = catchAsyncErrors(async (request, response, next) => {
  response.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  response.status(200).json({
    success: true,
    message: "Logout successfully !",
  });
});

exports.PasswordChange = catchAsyncErrors(async (request, response, next) => {
  const { email, currentpassword, newpassword } = request.body;
  const sql = `SELECT * FROM users WHERE email=? AND password=?;`;
  db.query(sql, [email, currentpassword], (err, result) => {
    if (err) {
      console.error("Error during login:", err);
      return next(new ErrorHandler("Error during login !", 500));
    }
    if (result.length > 0) {
      const sql2 = `update users set password='${newpassword}' WHERE email='${email}' AND password='${currentpassword}';`;
      db.query(sql2, (err, result) => {
        if (err) {
          console.error("Error during password change:", err);
          return next(new ErrorHandler("Error during password change !", 500));
        } else {
          return response
            .status(400)
            .json({ message: "Password change succesfully" });
        }
      });
    } else {
      return response.status(404).json({ message: "password does'nt match" });
    }
  });
});
exports.signoutadmin = catchAsyncErrors(async (request, response, next) => {
  response.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  response.status(200).json({
    success: true,
    message: "Logout successfully !",
  });
});

// Email Verification Controller
exports.emailVerification = catchAsyncErrors(
  async (request, response, next) => {
    const { email } = request.body;
    console.log(email)
    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return next(
        new ErrorHandler("Please provide a valid email address", 400)
      );
    }

    try {
      // Check if admin allows registrations
      const { setregister } = await fetchSetRoiFromAdminSettings();
      if (setregister !== 1) {
        return next(
          new ErrorHandler("Registration is currently disabled by admin", 403)
        );
      }

      // Check if user already exists
      const existingUser = await new Promise((resolve, reject) => {
        db.query(
          "SELECT id FROM users WHERE email = ? LIMIT 1",
          [email],
          (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
          }
        );
      });

      if (existingUser) {
        return next(
          new ErrorHandler("User with this email already exists", 409)
        );
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Set expiration time (15 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      // Delete any existing OTP for this email first
      await new Promise((resolve, reject) => {
        db.query(
          "DELETE FROM otp_requests WHERE email = ?",
          [email],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });

      // Insert new OTP record
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO otp_requests (email, otp, expires_at, created_at) VALUES (?, ?, ?, NOW())",
          [email, otp, expiresAt],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });

      // Send OTP via email
      await sendVerificationEmail(email, otp);

      return response.status(200).json({
        success: true,
        message: "Verification code sent to your email",
        // Don't send OTP in response in production
        // otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    } catch (err) {
      console.error("Error during email verification:", err);
      return next(
        new ErrorHandler(
          "Failed to send verification code. Please try again later.",
          500
        )
      );
    }
  }
);
exports.emailVerificationForUpdate = catchAsyncErrors(
  async (request, response, next) => {
    const { email } = request.body;
    console.log('Received email:', email);
    
    // Clean the email (remove any whitespace)
    const cleanEmail = email.trim();
    console.log('Cleaned email:', cleanEmail);
    console.log('Email length:', cleanEmail.length);
    console.log('Email characters:', cleanEmail.split('').map(char => char.charCodeAt(0)));
    
    // Validate email format with a more robust regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      console.log('Invalid email format');
      console.log('Regex test result:', emailRegex.test(cleanEmail));
      return next(
        new ErrorHandler("Please provide a valid email address", 400)
      );
    }

    try {
      console.log('Starting email verification process...');
      
      // Check if admin allows registrations
      console.log('Checking admin settings...');
      const { setregister } = await fetchSetRoiFromAdminSettings();
      console.log('Admin settings retrieved:', { setregister });
      
      if (setregister !== 1) {
        console.log('Registration disabled by admin');
        return next(
          new ErrorHandler("Registration is currently disabled by admin", 403)
        );
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('Generated OTP:', otp);

      // Set expiration time (15 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);
      console.log('OTP expires at:', expiresAt);

      // Delete any existing OTP for this email first
      console.log('Deleting existing OTP records...');
      try {
        await new Promise((resolve, reject) => {
          db.query(
            "DELETE FROM otp_requests WHERE email = ?",
            [cleanEmail],
            (err, result) => {
              if (err) {
                console.error('Error deleting existing OTP:', err);
                return reject(err);
              }
              console.log('Deleted existing OTP records:', result);
              resolve(result);
            }
          );
        });
      } catch (deleteError) {
        console.error('Failed to delete existing OTP:', deleteError);
        throw deleteError;
      }

      // Insert new OTP record
      console.log('Inserting new OTP record...');
      try {
        await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO otp_requests (email, otp, expires_at, created_at) VALUES (?, ?, ?, NOW())",
            [cleanEmail, otp, expiresAt],
            (err, result) => {
              if (err) {
                console.error('Error inserting OTP:', err);
                return reject(err);
              }
              console.log('OTP record inserted:', result);
              resolve(result);
            }
          );
        });
      } catch (insertError) {
        console.error('Failed to insert OTP record:', insertError);
        throw insertError;
      }

      // Send OTP via email
      console.log('Sending verification email...');
      try {
        await sendVerificationEmail(cleanEmail, otp);
        console.log('Verification email sent successfully');
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        throw emailError;
      }

      console.log('Email verification process completed successfully');
      return response.status(200).json({
        success: true,
        message: "Verification code sent to your email",
        // Don't send OTP in response in production
        // otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    } catch (err) {
      console.error("Error during email verification:", err);
      
      // More specific error handling
      if (err.code === 'ECONNREFUSED') {
        return next(
          new ErrorHandler("Database connection failed", 500)
        );
      } else if (err.code === 'ER_NO_SUCH_TABLE') {
        return next(
          new ErrorHandler("Database table not found", 500)
        );
      } else if (err.message && err.message.includes('email')) {
        return next(
          new ErrorHandler("Failed to send email. Please check your email configuration.", 500)
        );
      } else {
        return next(
          new ErrorHandler(
            "Failed to send verification code. Please try again later.",
            500
          )
        );
      }
    }
  }
);

// Verify OTP Controller
exports.verifyOtp = catchAsyncErrors(async (request, response, next) => {
  const { email, otp } = request.body;
  console.log('Received email:', email);
  console.log('Received OTP:', otp);
  
  // Clean and validate inputs
  const cleanEmail = email?.trim();
  const cleanOtp = otp?.toString().trim();
  
  console.log('Cleaned email:', cleanEmail);
  console.log('Cleaned OTP:', cleanOtp);
  
  // Validate inputs
  if (!cleanEmail || !cleanOtp) {
    console.log('Missing email or OTP');
    return response.status(400).json({
      success: false,
      error: "Email and verification code are required",
    });
  }
  
  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    console.log('Invalid email format');
    return response.status(400).json({
      success: false,
      error: "Invalid email format",
    });
  }
  
  // Validate OTP format (should be 6 digits)
  if (!/^\d{6}$/.test(cleanOtp)) {
    console.log('Invalid OTP format');
    return response.status(400).json({
      success: false,
      error: "Verification code must be 6 digits",
    });
  }

  try {
    console.log('Starting OTP verification process...');
    
    // Check if OTP exists for this email
    console.log('Searching for OTP record...');
    const otpRecord = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM otp_requests WHERE email = ?",
        [cleanEmail],
        (err, results) => {
          if (err) {
            console.error('Database error while searching OTP:', err);
            return reject(err);
          }
          console.log('Query results:', results);
          resolve(results[0]);
        }
      );
    });

    if (!otpRecord) {
      console.log('No OTP record found for email:', cleanEmail);
      return response.status(400).json({
        success: false,
        error: "No verification code found for this email",
      });
    }
    
    console.log('Found OTP record:', {
      id: otpRecord.id,
      email: otpRecord.email,
      otp: otpRecord.otp,
      expires_at: otpRecord.expires_at,
      created_at: otpRecord.created_at
    });

    // Check if OTP is expired
    const now = new Date();
    const expiresAt = new Date(otpRecord.expires_at);
    
    console.log('Current time:', now);
    console.log('OTP expires at:', expiresAt);
    console.log('Time comparison - Now > Expires:', now > expiresAt);

    if (now > expiresAt) {
      console.log('OTP has expired');
      // Delete expired OTP
      try {
        await new Promise((resolve, reject) => {
          db.query(
            "DELETE FROM otp_requests WHERE email = ?",
            [cleanEmail],
            (err, result) => {
              if (err) return reject(err);
              resolve(result);
            }
          );
        });
        console.log('Expired OTP deleted');
      } catch (deleteError) {
        console.error('Error deleting expired OTP:', deleteError);
      }
      
      return response.status(400).json({
        success: false,
        error: "Verification code has expired",
      });
    }

    // Check if OTP matches
    console.log('Comparing OTPs:');
    console.log('Stored OTP:', otpRecord.otp);
    console.log('Provided OTP:', cleanOtp);
    console.log('OTP match:', otpRecord.otp === cleanOtp);
    
    if (otpRecord.otp !== cleanOtp) {
      console.log('OTP mismatch');
      return response.status(400).json({
        success: false,
        error: "Invalid verification code",
      });
    }

    // Mark OTP as verified by deleting it
    console.log('Deleting verified OTP record...');
    try {
      await new Promise((resolve, reject) => {
        db.query(
          "DELETE FROM otp_requests WHERE email = ? AND otp = ?",
          [cleanEmail, cleanOtp],
          (err, result) => {
            if (err) {
              console.error('Error deleting OTP:', err);
              return reject(err);
            }
            console.log('Delete result:', result);
            if (result.affectedRows === 0) {
              console.log('No records were deleted');
              return reject(new Error("No records found to delete"));
            }
            resolve(result);
          }
        );
      });
      console.log('OTP record deleted successfully');
    } catch (deleteError) {
      console.error('Failed to delete OTP record:', deleteError);
      throw deleteError;
    }

    console.log('OTP verification completed successfully');
    return response.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error("Error during OTP verification:", err);
    
    // More specific error handling
    if (err.code === 'ECONNREFUSED') {
      return next(new ErrorHandler("Database connection failed", 500));
    } else if (err.code === 'ER_NO_SUCH_TABLE') {
      return next(new ErrorHandler("Database table not found", 500));
    } else {
      return next(new ErrorHandler("Error verifying code. Please try again.", 500));
    }
  }
});;

// Complete Registration Controller
exports.completeRegistration = catchAsyncErrors(
  async (request, response, next) => {
    const {
      email,
      username,
      fullname,
      phone,
      password,
      referralBy, // Optional
    } = request.body;

    try {
      // Check if OTP is verified for this email
      const otpRecord = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM otp_requests WHERE email = ? AND is_verified = 1",
          [email],
          (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
          }
        );
      });

      if (!otpRecord) {
        return response.status(400).json({
          success: false,
          error: "Email not verified. Please verify your email first",
        });
      }

      // Check if user already exists
      const existingUser = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM users WHERE email = ?",
          [email],
          (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
          }
        );
      });

      if (existingUser) {
        return response
          .status(400)
          .json({ error: "User with this email already exists." });
      }

      // Generate unique referral code
      const referralCode = generateReferralCode();

      // Begin transaction
      db.beginTransaction(async (transactionErr) => {
        if (transactionErr) {
          console.error("Error starting transaction:", transactionErr);
          return next(new ErrorHandler("Error during signup!", 500));
        }

        try {
          let referringUser;
          if (referralBy) {
            // Check if referral code exists
            referringUser = await new Promise((resolve, reject) => {
              db.query(
                "SELECT * FROM users WHERE refferal_code = ?",
                [referralBy],
                (err, results) => {
                  if (err) return reject(err);
                  if (results.length === 0) {
                    return response
                      .status(400)
                      .json({ error: "Invalid referral code." });
                  }
                  resolve(results[0]);
                }
              );
            });

            // Update referrer's total team count
            await new Promise((resolve, reject) => {
              db.query(
                "UPDATE users SET total_team = total_team + 1 WHERE id = ?",
                [referringUser.id],
                (err, result) => {
                  if (err) return reject(err);
                  resolve(result);
                }
              );
            });
          }

          // Insert new user
          const sql = `
          INSERT INTO users (username, fullname, phone, email, password, refferal_code, email_verified ${
            referralBy ? ", reffer_by" : ""
          })
          VALUES (?, ?, ?, ?, ?, ?, 1 ${referralBy ? ", ?" : ""})
        `;
          const values = [
            username,
            fullname,
            phone,
            email,
            password,
            referralCode,
          ];
          if (referralBy) values.push(referralBy);

          const insertResult = await new Promise((resolve, reject) => {
            db.query(sql, values, (err, result) => {
              if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                  return response
                    .status(400)
                    .json({ error: "User with this email already exists." });
                }
                return reject(err);
              }
              resolve(result);
            });
          });

          if (insertResult.affectedRows > 0) {
            const userId = insertResult.insertId;

            // Fetch the newly inserted user's full data
            const auth = await new Promise((resolve, reject) => {
              db.query(
                "SELECT * FROM users WHERE id = ?",
                [userId],
                (err, results) => {
                  if (err) return reject(err);
                  resolve(results[0]);
                }
              );
            });

            // Update OTP record to mark it as used
            await new Promise((resolve, reject) => {
              db.query(
                "UPDATE otp_requests SET is_used = 1, updated_at = NOW() WHERE email = ?",
                [email],
                (err, result) => {
                  if (err) return reject(err);
                  resolve(result);
                }
              );
            });

            db.commit((commitErr) => {
              if (commitErr) {
                console.error("Error committing transaction:", commitErr);
                return next(new ErrorHandler("Error during signup!", 500));
              }

              // Send welcome email
              sendWelcomeEmail(email, username);

              // Send token for auto-login
              sendToken(auth, 201, response);
            });
          } else {
            throw new ErrorHandler("User could not be created", 400);
          }
        } catch (err) {
          db.rollback(() => {
            console.error("Error during signup:", err);
            return next(
              err instanceof ErrorHandler
                ? err
                : new ErrorHandler("Error during signup!", 500)
            );
          });
        }
      });
    } catch (err) {
      console.error("Error during registration:", err);
      return next(new ErrorHandler("Error during registration!", 500));
    }
  }
);

// Resend OTP Controller
exports.resendOtp = catchAsyncErrors(async (request, response, next) => {
  const { email } = request.body;

  try {
    // Check if user already exists in users table
    const existingUser = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });

    if (existingUser) {
      return response
        .status(400)
        .json({ error: "User with this email already exists." });
    }

    // Generate a new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Check if OTP already exists for this email
    const existingOtp = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM otp_requests WHERE email = ?",
        [email],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });

    if (existingOtp) {
      // Update existing OTP record
      await new Promise((resolve, reject) => {
        db.query(
          "UPDATE otp_requests SET otp = ?, expires_at = ?, is_verified = 0, is_used = 0, updated_at = NOW() WHERE email = ?",
          [otp, expiresAt, email],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });
    } else {
      // Insert new OTP record
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO otp_requests (email, otp, expires_at, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
          [email, otp, expiresAt],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });
    }

    // Send OTP via email
    await sendVerificationEmail(email, otp);

    return response.status(200).json({
      success: true,
      message: "Verification code resent to your email",
    });
  } catch (err) {
    console.error("Error resending OTP:", err);
    return next(new ErrorHandler("Error resending verification code!", 500));
  }
});

// Helper function to send verification email
async function sendVerificationEmail(email, otp) {
  const subject = "Email Verification Code";
  const text = `
Verify Your Email Address

Please use the following verification code to complete your verification process:

${otp}

This code will expire in 15 minutes. If you didn't request this verification, please ignore this email.

© ${new Date().getFullYear()} Your Company Name. All rights reserved.
  `;

  try {
    await verifyMail({ to: email, subject, text }); // use `text` instead of `html`
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

// Helper function to send welcome email
async function sendWelcomeEmail(email, username) {
  const subject = "Welcome to Our Platform";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="YOUR_LOGO_URL" alt="Company Logo" style="max-width: 150px;">
      </div>
      <h2 style="color: #333; text-align: center;">Welcome to Our Platform!</h2>
      <p style="color: #555; line-height: 1.5;">Hello ${username},</p>
      <p style="color: #555; line-height: 1.5;">Thank you for joining our platform. Your account has been successfully created and is now ready to use.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="YOUR_LOGIN_URL" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
      </div>
      <p style="color: #555; line-height: 1.5;">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #777; font-size: 12px; text-align: center;">
        <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      </div>
    </div>
  `;

  // Use your existing email sending function or service
  // This is just a placeholder - replace with your actual email sending code
  try {
    await sendVerificationEmail({ to: email, subject, html });
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Don't throw error here, just log it since this is non-critical
  }
}
