// routes/ratings.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");

// ✅ JWT middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Submit or update rating (for students)
router.post("/:entityId", authenticate, async (req, res) => {
  const entityId = Number(req.params.entityId);
  const { rating, comments, entityType } = req.body; // entityType = 'lecture' or 'class'
  const userId = req.user.id || req.user.user_id;

  if (!rating || !entityType) return res.status(400).json({ error: "Rating and entity type required" });

  try {
    const [existing] = await pool.query(
      `SELECT * FROM ratings WHERE user_id=? AND rated_entity=? AND entity_id=?`,
      [userId, entityType, entityId]
    );

    if (existing.length > 0) {
      // Update existing rating
      await pool.query(
        `UPDATE ratings SET rating=?, comments=?, created_at=NOW() WHERE id=?`,
        [rating, comments || null, existing[0].id]
      );
      return res.json({ message: "Rating updated successfully" });
    }

    // Insert new rating
    await pool.query(
      `INSERT INTO ratings (user_id, rated_entity, entity_id, rating, comments, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [userId, entityType, entityId, rating, comments || null]
    );

    res.json({ message: "Rating submitted successfully" });
  } catch (err) {
    console.error("Rating submission error:", err);
    res.status(500).json({ error: "Failed to submit rating" });
  }
});

// Fetch all ratings (PRL view)
router.get("/all", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.id,
        r.entity_id,
        r.rated_entity,
        r.rating,
        r.comments,
        r.created_at,
        u.name AS rater_name,
        l.name AS lecturer_name,
        c.class_name,
        AVG(r2.rating) OVER (PARTITION BY r.rated_entity, r.entity_id) AS avgRating,
        COUNT(r2.id) OVER (PARTITION BY r.rated_entity, r.entity_id) AS totalRatings
      FROM ratings r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN classes c ON r.rated_entity='class' AND r.entity_id=c.id
      LEFT JOIN users l ON r.rated_entity='class' AND c.lecturer_id=l.id
      LEFT JOIN ratings r2 ON r2.entity_id = r.entity_id AND r2.rated_entity = r.rated_entity
      ORDER BY r.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Fetch all ratings error:", err);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
});

// Fetch ratings for a specific lecture (student view)
router.get("/:entityId", authenticate, async (req, res) => {
  const entityId = Number(req.params.entityId);
  try {
    const [rows] = await pool.query(`
      SELECT r.*, u.name AS rater_name
      FROM ratings r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.entity_id = ? AND r.rated_entity='lecture'
      ORDER BY r.created_at DESC
    `, [entityId]);

    res.json(rows);
  } catch (err) {
    console.error("Fetch lecture ratings error:", err);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
});

// Average rating for a lecture
router.get("/:entityId/average", authenticate, async (req, res) => {
  const entityId = Number(req.params.entityId);
  try {
    const [rows] = await pool.query(`
      SELECT AVG(rating) AS avgRating, COUNT(id) AS totalRatings
      FROM ratings
      WHERE entity_id=? AND rated_entity='lecture'
    `, [entityId]);

    res.json(rows[0] || { avgRating: 0, totalRatings: 0 });
  } catch (err) {
    console.error("Fetch average rating error:", err);
    res.status(500).json({ error: "Failed to fetch average rating" });
  }
});

module.exports = router;
