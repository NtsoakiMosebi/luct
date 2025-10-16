const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const reportsRoutes = require("./routes/reports");
const classesRoutes = require("./routes/classes");
const coursesRoutes = require("./routes/courses");
const ratingsRoutes = require("./routes/ratings");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000", // React local dev
  "https://your-frontend-netlify-url.netlify.app" // Replace with your Netlify URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/ratings", ratingsRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
