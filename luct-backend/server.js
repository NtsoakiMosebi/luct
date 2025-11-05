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


app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/ratings", ratingsRoutes);

app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
