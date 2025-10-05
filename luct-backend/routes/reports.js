const express = require("express");
const router = express.Router();
const pool = require("../db");
const { body, validationResult } = require("express-validator");
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


// Submit new report (LECTURER)// 
router.post(
  "/",
  authenticate,
  [
    body("class_id").isInt(),
    body("week_of_reporting").notEmpty(),
    body("date_of_lecture").notEmpty(),
    body("actual_students_present").isInt({ min: 0 }),
    body("topic_taught").notEmpty(),
    body("learning_outcomes").notEmpty(),
    body("recommendations").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const {
      class_id,
      week_of_reporting,
      date_of_lecture,
      actual_students_present,
      topic_taught,
      learning_outcomes,
      recommendations,
    } = req.body;

    try {
      const [result] = await pool.query(
        `INSERT INTO lecture_reports
         (lecturer_id, class_id, week_of_reporting, date_of_lecture, actual_students_present, topic_taught, learning_outcomes, recommendations, prl_feedback, pl_feedback, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          class_id,
          week_of_reporting,
          date_of_lecture,
          actual_students_present,
          topic_taught,
          learning_outcomes,
          recommendations,
          null,
          null,
          "pending",
        ]
      );

      // ✅ Add monitoring log
      await pool.query(
        "INSERT INTO monitoring_logs (user_id, action, target) VALUES (?, ?, ?)",
        [req.user.id, "submitted report", `report_id:${result.insertId}`]
      );

      res.status(201).json({ message: "Report submitted successfully", id: result.insertId });
    } catch (err) {
      console.error("Report submit error:", err);
      res.status(500).json({ error: "Failed to submit report" });
    }
  }
);


// Get MY reports (LECTURER)// 
router.get("/mine", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT lr.*, c.class_name, co.name AS course_name, u.username AS lecturer_name, c.total_registered_students
       FROM lecture_reports lr
       LEFT JOIN classes c ON lr.class_id = c.id
       LEFT JOIN courses co ON c.course_id = co.id
       LEFT JOIN users u ON lr.lecturer_id = u.id
       WHERE lr.lecturer_id = ?
       ORDER BY lr.id DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch my reports error:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});


// Get ALL reports (PL/PRL)// 
router.get("/", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT lr.*, c.class_name, co.name AS course_name, u.username AS lecturer_name, c.total_registered_students
       FROM lecture_reports lr
       LEFT JOIN classes c ON lr.class_id = c.id
       LEFT JOIN courses co ON c.course_id = co.id
       LEFT JOIN users u ON lr.lecturer_id = u.id
       ORDER BY lr.id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch all reports error:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});


// Submit feedback (PL/PRL)// 
router.post("/:id/feedback", authenticate, async (req, res) => {
  const { id } = req.params;
  let { feedback, role } = req.body;

  if (!role || !feedback) {
    return res.status(400).json({ error: "Missing role or feedback" });
  }

  role = role.toLowerCase();
  if (!["pl", "prl"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const column = role === "pl" ? "pl_feedback" : "prl_feedback";

  try {
    const [existing] = await pool.query(
      "SELECT id, pl_feedback, prl_feedback FROM lecture_reports WHERE id = ?",
      [id]
    );

    if (!existing.length) return res.status(404).json({ error: "Report not found" });

    if ((role === "pl" && existing[0].pl_feedback) || (role === "prl" && existing[0].prl_feedback)) {
      return res.status(400).json({ error: `Feedback already submitted by ${role.toUpperCase()}` });
    }

    await pool.query(
      `UPDATE lecture_reports SET ${column} = ? WHERE id = ?`,
      [feedback, id]
    );

    // ✅ Add monitoring log
    await pool.query(
      "INSERT INTO monitoring_logs (user_id, action, target) VALUES (?, ?, ?)",
      [req.user.id, `submitted ${role.toUpperCase()} feedback`, `report_id:${id}`]
    );

    res.json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("Feedback submit error:", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});


// Ratings for lectures//
router.post("/ratings/:lectureId", authenticate, async (req, res) => {
  const { lectureId } = req.params;
  const { rating, comments } = req.body;

  if (!rating) return res.status(400).json({ error: "Rating is required" });

  try {
    await pool.query(
      `INSERT INTO ratings (user_id, rated_entity, entity_id, rating, comments, created_at)
       VALUES (?, 'lecture', ?, ?, ?, NOW())`,
      [req.user.id, lectureId, rating, comments || null]
    );

    // ✅ Add monitoring log
    await pool.query(
      "INSERT INTO monitoring_logs (user_id, action, target) VALUES (?, ?, ?)",
      [req.user.id, "submitted rating", `lecture_id:${lectureId}`]
    );

    res.json({ message: "Rating submitted successfully" });
  } catch (err) {
    console.error("Rating insert error:", err);
    res.status(500).json({ error: "Failed to submit rating" });
  }
});


// Get all ratings for a lecture// 
router.get("/ratings/:lectureId", authenticate, async (req, res) => {
  const { lectureId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT r.*, u.username AS student_name
       FROM ratings r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.rated_entity = 'lecture' AND r.entity_id = ?
       ORDER BY r.created_at DESC`,
      [lectureId]
    );
    res.json({ ratings: rows });
  } catch (err) {
    console.error("Fetch ratings error:", err);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
});

// Get average rating for a lecture//
router.get("/ratings/:lectureId/average", authenticate, async (req, res) => {
  const { lectureId } = req.params;
  try {
    const [[avgRow]] = await pool.query(
      `SELECT AVG(rating) AS avgRating, COUNT(*) AS totalRatings
       FROM ratings
       WHERE rated_entity = 'lecture' AND entity_id = ?`,
      [lectureId]
    );
    res.json(avgRow || { avgRating: 0, totalRatings: 0 });
  } catch (err) {
    console.error("Fetch average rating error:", err);
    res.status(500).json({ error: "Failed to fetch average rating" });
  }
});

// Monitoring logs// 
router.get("/monitoring", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ml.id, ml.user_id, u.name, u.role, ml.action, ml.target, ml.timestamp
      FROM monitoring_logs ml
      JOIN users u ON ml.user_id = u.id
      ORDER BY ml.timestamp DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Monitoring fetch error:", err);
    res.status(500).json({ error: "Failed to fetch monitoring logs" });
  }
});

module.exports = router;
