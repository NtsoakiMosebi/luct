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
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ✅ Submit rating
router.post("/:lectureId", authenticate, async (req, res) => {
  const { lectureId } = req.params;
  const { rating, comments } = req.body;

  if (!rating) return res.status(400).json({ error: "Rating is required" });

  try {
    const [result] = await pool.query(
      `INSERT INTO ratings (user_id, rated_entity, entity_id, rating, comments, created_at)
       VALUES (?, 'lecture', ?, ?, ?, NOW())`,
      [req.user.id, lectureId, rating, comments || null]
    );

    // ✅ Log rating in monitoring
    await pool.query(
      "INSERT INTO monitoring_logs (user_id, action, target) VALUES (?, ?, ?)",
      [req.user.id, "rated lecture", `lecture:${lectureId}`]
    );

    res.json({ message: "Rating submitted successfully", id: result.insertId });
  } catch (err) {
    console.error("Rating insert error:", err);
    res.status(500).json({ error: "Failed to submit rating" });
  }
});

// ✅ Get all ratings for a lecture
router.get("/:lectureId", authenticate, async (req, res) => {
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

// ✅ Get average rating
router.get("/:lectureId/average", authenticate, async (req, res) => {
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

module.exports = router;
