const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../config/config.env" });

const sendAdminToken = (admin, statusCode, res) => {
  const token = jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );
  delete admin.password;
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  
  const expireAt = Date.now() + 1000 * 60 * 1000;
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    admin,
    expireAt
  });
};
module.exports = sendAdminToken;
