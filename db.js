const mysql = require("mysql2");
require("dotenv").config(); // Load environment variables

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "m@n0jg@ut@mM",
  database: process.env.DB_NAME || "streetleague",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL Database");
});

module.exports = db; // Export the connection
