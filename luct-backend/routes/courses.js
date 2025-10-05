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
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// GET all courses
router.get("/", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.code, c.semester, f.name AS faculty_name
       FROM courses c
       LEFT JOIN faculties f ON c.faculty_id = f.id
       ORDER BY f.name, c.name`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// Assign lecturer to a course (creates a class)
router.post("/assign", authenticate, async (req, res) => {
  const { course_id, lecturer_id, venue, scheduled_time, total_registered_students } = req.body;

  if (!course_id || !lecturer_id) return res.status(400).json({ error: "Missing course_id or lecturer_id" });

  try {
    const className = `Class_${Date.now()}`;
    const [result] = await pool.query(
      `INSERT INTO classes (course_id, lecturer_id, venue, scheduled_time, total_registered_students, class_name)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [course_id, lecturer_id, venue || null, scheduled_time || null, total_registered_students || 0, className]
    );
    res.status(201).json({ message: "Course assigned successfully", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to assign course" });
  }
});

module.exports = router;
