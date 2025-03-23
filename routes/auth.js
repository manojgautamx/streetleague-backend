const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db"); // Database connection file
const router = express.Router();


router.post("/signup", async (req, res) => {
    try {
      const { name, email, password, location, age, player_type } = req.body;
  
      // Check if all required fields are present
      if (!name || !email || !password || !location || !age || !player_type) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Hash password (Fixing possible undefined password)
      const hashedPassword = await bcrypt.hash(password, 10);
  
      db.query(
        "INSERT INTO users (name, email, password, location, age, player_type) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, hashedPassword, location, age, player_type],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
  
          res.status(201).json({ message: "User registered!" });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) return res.status(401).json({ message: "User not found" });

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: "1h" });
    res.json({ token, user });
  });
});

module.exports = router;

const authenticateUser = require("../middleware/authMiddleware"); // Import middleware
// Get User Profile (Protected)
router.get("/profile", authenticateUser, (req, res) => {
  db.query("SELECT id, name, email, location, age, player_type FROM users WHERE id = ?", 
  [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) return res.status(404).json({ message: "User not found" });

    res.json(result[0]); // Return user details (excluding password)
  });
});
