require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const db = require("./db"); // Import database connection

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL");
});

app.get("/", (req, res) => {
  res.send("StreetLeague Backend Running!");
});

app.listen(5000, () => console.log("Server running on port 5000"));
