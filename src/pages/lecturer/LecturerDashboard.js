import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const LecturerDashboard = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Lecturer";
  const token = localStorage.getItem("token");

  // State
  const [classes, setClasses] = useState([]);
  const [reports, setReports] = useState([]);
  const [logs, setLogs] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showRatings, setShowRatings] = useState(false);
  const [msg, setMsg] = useState("");

  // Fetch Lecturer Classes
  const fetchClasses = async () => {
    setLoadingClasses(true);
    try {
      const res = await api.get("/classes/lecturer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data || []);
    } catch (err) {
      console.error("Failed to load classes:", err);
    } finally {
      setLoadingClasses(false);
    }
  };

  // Fetch Monitoring Logs
  const fetchLogs = async () => {
    try {
      const res = await api.get("/reports/monitoring", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  // Fetch Student Ratings
  const fetchRatings = async () => {
    setLoadingRatings(true);
    setMsg("");
    try {
      const res = await api.get("/ratings/lecturer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRatings(res.data || []);
      if (!res.data || res.data.length === 0) {
        setMsg("No student ratings found for your lectures.");
      }
    } catch (err) {
      console.error("Failed to fetch ratings:", err);
      setMsg("❌ Failed to load student ratings.");
    } finally {
      setLoadingRatings(false);
    }
  };

  // Handlers
  const handleViewLogs = () => {
    if (!showLogs) fetchLogs();
    setShowLogs(!showLogs);
    setShowRatings(false);
  };

  const handleViewRatings = () => {
    if (!showRatings) fetchRatings();
    setShowRatings(!showRatings);
    setShowLogs(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="lecturer-dashboard text-white text-center">
      <h1>Welcome, {name}</h1>
      <p className="text-muted">Faculty: Information Communications Technology</p>

      {/* Dashboard Cards */}
      <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">
        {/* My Classes */}
        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>My Classes</h3>
          <p>View all classes you are teaching.</p>
          <button className="btn btn-secondary mt-3" onClick={fetchClasses}>
            Refresh Classes
          </button>
        </div>

        {/* My Reports */}
        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>My Reports</h3>
          <p>View all your submitted reports and track their status.</p>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/lecturer/my-reports")}
          >
            View Reports
          </button>
        </div>

        {/* Submit New Report */}
        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>Submit New Report</h3>
          <p>Create and submit a new report for review.</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/lecturer/report-form")}
          >
            Create Report
          </button>
        </div>

        {/* Monitoring */}
        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>Monitoring</h3>
          <p>View recent actions and submissions.</p>
          <button className="btn btn-secondary mt-3" onClick={handleViewLogs}>
            {showLogs ? "Hide Logs" : "View Logs"}
          </button>
        </div>

        {/* Student Ratings */}
        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>Student Ratings</h3>
          <p>View student ratings for your lectures.</p>
          <button className="btn btn-primary mt-3" onClick={handleViewRatings}>
            {showRatings ? "Hide Ratings" : "View Ratings"}
          </button>
        </div>
      </div>

      {/* Classes Table */}
      <div className="container mt-5">
        <h4>My Classes</h4>
        {loadingClasses ? (
          <p>Loading classes...</p>
        ) : classes.length === 0 ? (
          <p>❌ No classes found.</p>
        ) : (
          <table className="table table-striped text-dark">
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Course</th>
                <th>Venue</th>
                <th>Time</th>
                <th>Registered Students</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id}>
                  <td>{cls.class_name}</td>
                  <td>
                    {cls.course_name} ({cls.course_code})
                  </td>
                  <td>{cls.venue}</td>
                  <td>{new Date(cls.scheduled_time).toLocaleString()}</td>
                  <td>{cls.total_registered_students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Monitoring Logs Table */}
      {showLogs && (
        <div className="container mt-5">
          <h4>Recent Monitoring Logs</h4>
          <table className="table table-striped text-dark">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Target</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    No logs found
                  </td>
                </tr>
              ) : (
                logs
                  .filter(
                    (log) =>
                      (log.role === "lecturer" &&
                        log.action.toLowerCase() === "submitted report") ||
                      (log.role === "student" &&
                        log.action.toLowerCase() === "submitted rating")
                  )
                  .map((log) => (
                    <tr key={log.id}>
                      <td>{log.name}</td>
                      <td>{log.role}</td>
                      <td>{log.action}</td>
                      <td>{log.target}</td>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Student Ratings Table */}
      {showRatings && (
        <div className="container mt-5">
          <h4>Student Ratings for Your Lectures</h4>
          {loadingRatings && <p>Loading ratings...</p>}
          {msg && <p className="text-danger">{msg}</p>}
          {!loadingRatings && ratings.length > 0 && (
            <table className="table table-striped text-dark">
              <thead>
                <tr>
                  <th>Lecture</th>
                  <th>Student Name</th>
                  <th>Rating</th>
                  <th>Comments</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((r) => (
                  <tr key={r.id}>
                    <td>{r.lecture_name || "Lecture"}</td>
                    <td>{r.rater_name || "Anonymous Student"}</td>
                    <td>{"★".repeat(r.rating)}</td>
                    <td>{r.comments || "-"}</td>
                    <td>{r.created_at ? new Date(r.created_at).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <footer className="mt-5 text-muted">LUCT Reporting 2025</footer>
    </div>
  );
};

export default LecturerDashboard;
