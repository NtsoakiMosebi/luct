// src/pages/PRLDashboard/PRLDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const PRLDashboard = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [ratings, setRatings] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [error, setError] = useState(null);

  const [showCourses, setShowCourses] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [showRatings, setShowRatings] = useState(false);

  // 🔹 Fetch all data on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch courses error:", err);
        setError("Failed to fetch courses.");
      } finally {
        setLoadingCourses(false);
      }
    };

    const fetchClasses = async () => {
      try {
        const res = await api.get("/classes");
        setClasses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch classes error:", err);
        setError("Failed to fetch classes.");
      } finally {
        setLoadingClasses(false);
      }
    };

    const fetchRatings = async () => {
      try {
        const res = await api.get("/ratings/all");
        setRatings(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch ratings error:", err);
        setError("Failed to fetch ratings.");
      } finally {
        setLoadingRatings(false);
      }
    };

    fetchCourses();
    fetchClasses();
    fetchRatings();
  }, []);

  return (
    <div className="prl-dashboard text-white text-center">
      <h1>Welcome, PRL</h1>
      <p className="text-muted">
        Review reports, provide feedback, and monitor lectures.
      </p>

      {/* ✅ Dashboard Buttons */}
      <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">
        {/* Review Reports */}
        <div className="card p-3" style={{ width: "250px", backgroundColor: "darkgray" }}>
          <h3>Review Reports</h3>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/prl/reports-review")}
          >
            Review Now
          </button>
        </div>

        {/* Feedback */}
        <div className="card p-3" style={{ width: "250px", backgroundColor: "darkgray" }}>
          <h3>Provide Feedback</h3>
          <button
            className="btn btn-success mt-3"
            onClick={() => navigate("/prl/feedback-form")}
          >
            Give Feedback
          </button>
        </div>

        {/* Courses */}
        <div className="card p-3" style={{ width: "250px", backgroundColor: "darkgray" }}>
          <h3>View Courses</h3>
          <button
            className="btn btn-primary mt-3"
            onClick={() => setShowCourses(!showCourses)}
          >
            {loadingCourses ? "Loading..." : `Courses (${courses.length})`}
          </button>
        </div>

        {/* Classes */}
        <div className="card p-3" style={{ width: "250px", backgroundColor: "darkgray" }}>
          <h3>View Classes</h3>
          <button
            className="btn btn-success mt-3"
            onClick={() => setShowClasses(!showClasses)}
          >
            {loadingClasses ? "Loading..." : `Classes (${classes.length})`}
          </button>
        </div>

        {/* Ratings */}
        <div className="card p-3" style={{ width: "250px", backgroundColor: "darkgray" }}>
          <h3>View Ratings</h3>
          <button
            className="btn btn-primary mt-3"
            onClick={() => setShowRatings(!showRatings)}
          >
            {loadingRatings ? "Loading..." : `Ratings (${ratings.length})`}
          </button>
        </div>
      </div>

      {error && <p className="text-danger mt-3">{error}</p>}

      {/* ✅ Courses Table */}
      {showCourses && (
        <div className="mt-4 container">
          <h3>All Courses</h3>
          <table className="table table-dark table-hover mt-2">
            <thead>
              <tr>
                <th>ID</th>
                <th>Course Name</th>
                <th>Code</th>
                <th>Semester</th>
                <th>Faculty</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.name}</td>
                    <td>{course.code}</td>
                    <td>{course.semester}</td>
                    <td>{course.faculty_name || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No courses available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Classes Table */}
      {showClasses && (
        <div className="mt-4 container">
          <h3>All Classes</h3>
          <table className="table table-dark table-hover mt-2">
            <thead>
              <tr>
                <th>ID</th>
                <th>Class Name</th>
                <th>Course</th>
                <th>Lecturer</th>
                <th>Venue</th>
                <th>Time</th>
                <th>Total Students</th>
              </tr>
            </thead>
            <tbody>
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <tr key={cls.id}>
                    <td>{cls.id}</td>
                    <td>{cls.class_name}</td>
                    <td>{cls.course_name}</td>
                    <td>{cls.lecturer_name || "N/A"}</td>
                    <td>{cls.venue}</td>
                    <td>{cls.scheduled_time}</td>
                    <td>{cls.total_registered_students}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No classes available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Ratings Table */}
      {showRatings && (
        <div className="mt-4 container">
          <h3>Ratings Overview</h3>
          <table className="table table-dark table-hover mt-2">
            <thead>
              <tr>
                <th>Class / Lecture</th>
                <th>Lecturer</th>
                <th>User</th>
                <th>Rating</th>
                <th>Comments</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ratings.length > 0 ? (
                ratings.map((r) => (
                  <tr key={r.id}>
                    <td>{r.class_name || r.lecture_name || "N/A"}</td>
                    <td>{r.lecturer_name || "N/A"}</td>
                    <td>{r.rater_name || "Unknown"}</td>
                    <td style={{ color: "hotpink", fontWeight: "bold" }}>{r.rating} ★</td>
                    <td>{r.comments || "-"}</td>
                    <td>{r.created_at ? new Date(r.created_at).toLocaleString() : "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No ratings available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PRLDashboard;
