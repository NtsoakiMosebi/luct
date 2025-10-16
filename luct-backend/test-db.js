// luct-backend/test-db.js
require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "123456",
      database: process.env.DB_NAME || "luct_reporting",
    });

    const username = "ntsoaki"; // test user
    const password = "123456";   // plain password to check

    // Fetch user
    const [rows] = await connection.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) {
      console.log("❌ User not found:", username);
      return;
    }

    const user = rows[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("❌ Invalid password for user:", username);
      return;
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, faculty_id: user.faculty_id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    console.log("✅ Login successful!");
    console.log("User:", { id: user.id, username: user.username, role: user.role });
    console.log("JWT token:", token);

    await connection.end();
  } catch (err) {
    console.error("Database error:", err.message);
  }
})();
