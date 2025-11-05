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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded; // id, role, username
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// -----------------------------
// GET all courses (for dropdown)
// -----------------------------
router.get("/courses", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT id, name, code FROM courses ORDER BY name`);
    res.json(rows);
  } catch (err) {
    console.error("Fetch courses error:", err);
    res.status(500).json({ error: "Failed to fetch courses." });
  }
});

// -----------------------------
// GET all lecturers (for dropdown)
// -----------------------------
router.get("/lecturers", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT id, username FROM users WHERE role='lecturer' ORDER BY username`);
    res.json(rows);
  } catch (err) {
    console.error("Fetch lecturers error:", err);
    res.status(500).json({ error: "Failed to fetch lecturers." });
  }
});

// -----------------------------
// Assign lecturer to a course (creates a class)
// -----------------------------
router.post("/assign", authenticate, async (req, res) => {
  const { course_id, lecturer_id, venue, scheduled_time } = req.body;

  if (!course_id || !lecturer_id) {
    return res.status(400).json({ error: "Please select both course and lecturer." });
  }

  try {
    // Check if course exists
    const [courseCheck] = await pool.query(`SELECT id FROM courses WHERE id = ?`, [course_id]);
    if (courseCheck.length === 0) {
      return res.status(400).json({ error: "Selected course does not exist." });
    }

    // Convert scheduled_time to MySQL DATETIME format if provided
    let formattedTime = null;
    if (scheduled_time) {
      formattedTime = new Date(scheduled_time);
      if (isNaN(formattedTime)) formattedTime = null;
      else formattedTime = formattedTime.toISOString().slice(0, 19).replace("T", " ");
    }

    const className = `Class_${Date.now()}`; // auto-generated class name
    const [result] = await pool.query(
      `INSERT INTO classes (course_id, lecturer_id, venue, scheduled_time, total_registered_students, class_name)
       VALUES (?, ?, ?, ?, 0, ?)`,
      [course_id, lecturer_id, venue || null, formattedTime, className]
    );

    res.status(201).json({ message: "Lecturer assigned successfully!", id: result.insertId });
  } catch (err) {
    console.error("Assign lecturer error:", err);
    res.status(500).json({ error: err.sqlMessage || "Failed to assign lecturer." });
  }
});

// -----------------------------
// GET all classes with course & lecturer info
// -----------------------------
router.get("/", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id AS class_id,
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

    // Format scheduled_time
    const formattedRows = rows.map(r => ({
      ...r,
      scheduled_time: r.scheduled_time ? new Date(r.scheduled_time).toLocaleString() : "-"
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error("Fetch classes error:", err);
    res.status(500).json({ error: "Failed to fetch classes." });
  }
});

// -----------------------------
// GET classes for logged-in lecturer
// -----------------------------
router.get("/lecturer", authenticate, async (req, res) => {
  try {
    const lecturerId = req.user.id;

    const [rows] = await pool.query(`
      SELECT 
        c.id AS class_id,
        c.class_name,
        c.venue,
        c.scheduled_time,
        c.total_registered_students,
        co.name AS course_name,
        co.code AS course_code
      FROM classes c
      JOIN courses co ON c.course_id = co.id
      WHERE c.lecturer_id = ?
      ORDER BY c.scheduled_time
    `, [lecturerId]);

    // Format scheduled_time
    const formattedRows = rows.map(r => ({
      ...r,
      scheduled_time: r.scheduled_time ? new Date(r.scheduled_time).toLocaleString() : "-"
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error("Fetch lecturer classes error:", err);
    res.status(500).json({ error: "Failed to fetch assigned classes." });
  }
});

module.exports = router;
