const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const {sendResetPasswordEmail} = require("../utils/mailer");
const db = require("../config/database");
const jwt = require("jsonwebtoken");
const SECRET = "dgfyuioujhbvhjiuojkh";

exports.forgotPassword = catchAsyncErrors(async (req, res) => {
    const { email, role } = req.body;
    let user;
    const sql = `SELECT * FROM users WHERE email = ? AND role = ?`;
    db.query(sql, [email, role], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database query error." });
        }
        if (result.length == 0) {
            console.log(result)
            return res.status(404).json({ message: "User not found" });
        }
        user = result[0];
  
        const jwtToken = jwt.sign({ id: user.id, role }, SECRET, {
            expiresIn: "1h",
        });
        const resetUrl = `https://goldfoxmarket.com/reset-password/${jwtToken}`;
        try {
            await sendResetPasswordEmail({
                email: user.email,
                resetUrl,
            });
            const insertQuery = "INSERT INTO resetpass (token, user_id) VALUES (?, ?)";
            db.query(insertQuery, [jwtToken, user.id], (insertErr, insertResult) => {
                if (insertErr) {
                    console.error(insertErr);
                    return res.status(500).json({ message: "Failed to store reset token." });
                }

                if (insertResult.affectedRows > 0) {
                    return res.status(200).json({
                        success: true,
                        message: "Password reset email sent successfully.",
                    });
                } else {
                    return res.status(500).json({ message: "Failed to store reset token." });
                }
            });
        } catch (emailError) {
            return res.status(500).json({
                message: "Failed to send email.",
                error: emailError.message,
            });
        }
    });
});
exports.resetPassword = catchAsyncErrors(async (req, res) => {
  const { newPassword, token } = req.body;
  console.log(newPassword, token)
  try {
      const decoded = jwt.verify(token, SECRET);
      const { id, role } = decoded;
      let user;
      const sql = `SELECT * FROM users WHERE id = ?`;
      db.query(sql, [id], async (err, result) => {
          if (err) {
              return res.status(500).json({ message: 'Database query error.', error: err.message });
          }

          if (result.length < 1) {
              return res.status(404).json({ message: 'User not found.' });
          }

          user = result[0];
          console.log(user)
          const tokenQuery = `SELECT * FROM resetpass WHERE token = ? AND user_id = ?`;
          db.query(tokenQuery, [token, id], async (tokenErr, tokenResult) => {
              if (tokenErr) {
                  return res.status(500).json({ message: 'Error checking token.', error: tokenErr.message });
              }
              if (tokenResult.length < 1) {
                  return res.status(400).json({ message: 'Invalid or expired token.' });
              }
         
              const updateQuery = `UPDATE users SET password = ? WHERE id = ?`;
              db.query(updateQuery, [newPassword, id], (updateErr, updateResult) => {
                  if (updateErr) {
                      return res.status(500).json({ message: 'Failed to update password.', error: updateErr.message });
                  }
                  const deleteTokenQuery = `DELETE FROM resetpass WHERE token = ? AND user_id = ?`;
                  db.query(deleteTokenQuery, [token, id], (deleteErr) => {
                      if (deleteErr) {
                          console.error(deleteErr);
                      }
                  });
                  return res.status(200).json({
                      success: true,
                      message: 'Password reset successfully.',
                  });
              });
          });
      });
  } catch (error) {
      return res.status(400).json({
          success: false,
          message: 'Invalid or expired token.',
          error: error.message,
      });
  }
});