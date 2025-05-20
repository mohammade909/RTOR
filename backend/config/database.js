const mysql = require('mysql2');
// dotenv.config({ path: "./config.env" });
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'jaimatadi@123',
  database: 'r2r',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


 connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});
module.exports = connection;




