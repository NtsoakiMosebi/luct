const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");

// JWT middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });
  const token = authHeader.split(" ")[1];
  try {
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// GET all classes
router.get("/", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id,
        c.class_name,
        c.venue,
        c.scheduled_time,
        c.total_registered_students,
        co.name AS course_name,
        co.code AS course_code,
        u.username AS lecturer_name
      FROM classes c
      LEFT JOIN courses co ON c.course_id = co.id
      LEFT JOIN users u ON c.lecturer_id = u.id
      ORDER BY c.scheduled_time
    `);
    res.json(rows);
  } catch (err) {
    console.error("Fetch classes error:", err);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

// GET classes for a student
router.get("/student/:studentId", authenticate, async (req, res) => {
  const { studentId } = req.params;
  try {
    const [check] = await pool.query(`SHOW TABLES LIKE 'enrollments'`);
    let rows;

    if (check.length > 0) {
      [rows] = await pool.query(`
        SELECT 
          c.id,
          c.class_name,
          c.venue,
          c.scheduled_time,
          c.total_registered_students,
          co.name AS course_name,
          co.code AS course_code,
          u.username AS lecturer_name
        FROM classes c
        JOIN enrollments e ON e.class_id = c.id
        JOIN courses co ON c.course_id = co.id
        JOIN users u ON c.lecturer_id = u.id
        WHERE e.student_id = ?
        ORDER BY c.scheduled_time
      `, [studentId]);
    } else {
      [rows] = await pool.query(`
        SELECT 
          c.id,
          c.class_name,
          c.venue,
          c.scheduled_time,
          c.total_registered_students,
          co.name AS course_name,
          co.code AS course_code,
          u.username AS lecturer_name
        FROM classes c
        LEFT JOIN courses co ON c.course_id = co.id
        LEFT JOIN users u ON c.lecturer_id = u.id
        ORDER BY c.scheduled_time
      `);
    }

    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch student lectures:", err);
    res.status(500).json({ error: "Failed to fetch lectures" });
  }
});

module.exports = router;
