// src/pages/PRLDashboard/PRLDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const PRLDashboard = () => {
  const navigate = useNavigate();

  // State variables
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [logs, setLogs] = useState([]);

  // Loading & error states
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [error, setError] = useState(null);

  // Visibility toggles
  const [showCourses, setShowCourses] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [showRatings, setShowRatings] = useState(false);
  const [showMonitoring, setShowMonitoring] = useState(false);

  // 🔹 Fetch Courses
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

  // 🔹 Fetch Classes
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

  // 🔹 Fetch Ratings
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

  // 🔹 Fetch Monitoring Logs
  const fetchLogs = async () => {
    try {
      const res = await api.get("/reports/monitoring");
      const filtered = Array.isArray(res.data)
        ? res.data.filter((log) => log.role === "prl")
        : [];
      setLogs(filtered);
    } catch (err) {
      console.error("Fetch monitoring logs error:", err);
      setError("Failed to fetch monitoring data.");
    } finally {
      setLoadingLogs(false);
    }
  };

  // 🔹 Fetch all data on mount
  useEffect(() => {
    fetchCourses();
    fetchClasses();
    fetchRatings();
    fetchLogs();
  }, []);

  return (
    <div className="prl-dashboard text-white text-center">
      <h1>Welcome, Principal Lecturer (PRL)</h1>
      <p className="text-muted">
        Review reports, provide feedback, monitor classes, and view ratings.
      </p>

      {/* Action Cards */}
      <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">
        {/* Review Reports */}
        <div className="card p-3 bg-dark text-white" style={{ width: "250px" }}>
          <h3>Review Reports</h3>
          <p>View reports submitted by lecturers.</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/prl/reports-review")}
          >
            Review Now
          </button>
        </div>

        {/* Provide Feedback */}
        <div className="card p-3 bg-dark text-white" style={{ width: "250px" }}>
          <h3>Provide Feedback</h3>
          <p>Add comments or evaluations for lecturer reports.</p>
          <button
            className="btn btn-success mt-3"
            onClick={() => navigate("/prl/feedback-form")}
          >
            Give Feedback
          </button>
        </div>

        {/* View Courses */}
        <div className="card p-3 bg-dark text-white" style={{ width: "250px" }}>
          <h3>Courses</h3>
          <p>View all courses and related modules.</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => setShowCourses(!showCourses)}
          >
            {loadingCourses ? "Loading..." : `Courses (${courses.length})`}
          </button>
        </div>

        {/* View Classes */}
        <div className="card p-3 bg-dark text-white" style={{ width: "250px" }}>
          <h3>Classes</h3>
          <p>View lectures under your stream.</p>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => setShowClasses(!showClasses)}
          >
            {loadingClasses ? "Loading..." : `Classes (${classes.length})`}
          </button>
        </div>

        {/* View Ratings */}
        <div className="card p-3 bg-dark text-white" style={{ width: "250px" }}>
          <h3>Ratings</h3>
          <p>View ratings submitted by students for lectures.</p>
          <button
            className="btn btn-warning mt-3"
            onClick={() => setShowRatings(!showRatings)}
          >
            {loadingRatings ? "Loading..." : `Ratings (${ratings.length})`}
          </button>
        </div>

        {/* Monitoring */}
        <div className="card p-3 bg-dark text-white" style={{ width: "250px" }}>
          <h3>Monitoring</h3>
          <p>View system monitoring and recent PRL actions.</p>
          <button
            className="btn btn-info mt-3"
            onClick={() => setShowMonitoring(!showMonitoring)}
          >
            {loadingLogs ? "Loading..." : `Logs (${logs.length})`}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-danger mt-3">{error}</p>}

      {/* Courses Table */}
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

      {/* Classes Table */}
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
                    <td>{new Date(cls.scheduled_time).toLocaleString()}</td>
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

      {/* Ratings Table */}
      {showRatings && (
        <div className="mt-4 container">
          <h3>Ratings Overview</h3>
          <table className="table table-dark table-hover mt-2">
            <thead>
              <tr>
                <th>Lecture / Class</th>
                <th>Lecturer</th>
                <th>Student</th>
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
                    <td style={{ color: "gold", fontWeight: "bold" }}>
                      {r.rating} ★
                    </td>
                    <td>{r.comments || "-"}</td>
                    <td>
                      {r.created_at
                        ? new Date(r.created_at).toLocaleString()
                        : "-"}
                    </td>
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

      {/* Monitoring Logs */}
      {showMonitoring && (
        <div className="mt-4 container">
          <h3>Recent Monitoring Activities</h3>
          <table className="table table-dark table-hover mt-2">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Target</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.name}</td>
                    <td>{log.role}</td>
                    <td>{log.action}</td>
                    <td>{log.target}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No monitoring logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <footer className="mt-5 text-muted">LUCT Reporting System © 2025</footer>
    </div>
  );
};

export default PRLDashboard;
