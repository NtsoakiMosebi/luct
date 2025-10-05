require("dotenv").config(); // ✅ Load environment variables first

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const reportsRoutes = require("./routes/reports");
const classesRoutes = require("./routes/classes");
const coursesRoutes = require("./routes/courses");
const ratingsRoutes = require("./routes/ratings");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // enable CORS for all origins
app.use(express.json()); // parse JSON bodies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/ratings", ratingsRoutes);

// Root route for testing
app.get("/", (req, res) => {
  res.send("✅ Backend running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
