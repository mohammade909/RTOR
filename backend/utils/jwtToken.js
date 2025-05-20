const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../config/config.env" });

const sendToken = (auth, statusCode, res) => {
  const token = jwt.sign(
    { id: auth.id, role: auth.role },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );
  delete auth.password;
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  const expireAt = Date.now() +  1000 * 60 * 1000;
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    auth,
    expireAt
  });
};
module.exports = sendToken;
