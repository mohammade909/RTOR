const ErrorHandler = require("../utils/errorHandler");
const dotenv = require("dotenv");
const db = require("../config/database");
dotenv.config({ path: "backend/config/config.env" });

const fetchSetRoiFromAdminSettings = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM adminsettings LIMIT 1;`;
    db.query(sql, (err, result) => {
      if (err) {
        return reject(new ErrorHandler("Error fetching setroi from adminsettings!", 500));
      }
      if (result.length === 0) {
        return reject(new ErrorHandler("Admin settings not found!", 404));
      }
      resolve(result[0]);
    });
  });
};

module.exports = fetchSetRoiFromAdminSettings;
