import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const LecturerDashboard = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Lecturer";

  const [logs, setLogs] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [avgRatings, setAvgRatings] = useState({});
  const [showLogs, setShowLogs] = useState(false);
  const [showRatings, setShowRatings] = useState(false);

  const [newRatings, setNewRatings] = useState({}); // store rating + comments

  // Fetch Monitoring Logs
  const fetchLogs = async () => {
    try {
      const res = await api.get("/reports/monitoring");
      setLogs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

 
  const fetchRatings = async () => {
    try {
      const res = await api.get("/reports");
      setRatings(res.data || []);

      
      res.data.forEach(async (r) => {
        try {
          const avgRes = await api.get(`/reports/ratings/${r.id}/average`);
          setAvgRatings((prev) => ({ ...prev, [r.id]: avgRes.data }));
        } catch (err) {
          console.error("Error fetching avg rating:", err);
        }
      });
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

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

  // Handle star click
  const handleStarClick = (reportId, value) => {
    setNewRatings((prev) => ({
      ...prev,
      [reportId]: { ...prev[reportId], rating: value },
    }));
  };


  const handleCommentChange = (reportId, comment) => {
    setNewRatings((prev) => ({
      ...prev,
      [reportId]: { ...prev[reportId], comments: comment },
    }));
  };

  
  const submitRating = async (reportId) => {
    const data = newRatings[reportId];
    if (!data || !data.rating) return alert("Please select a rating (1-5)");

    try {
      await api.post(`/reports/ratings/${reportId}`, {
        rating: data.rating,
        comments: data.comments || "",
      });
      alert("Rating submitted successfully!");
      fetchRatings();
      setNewRatings((prev) => ({ ...prev, [reportId]: {} }));
    } catch (err) {
      console.error("Failed to submit rating:", err);
      alert("Failed to submit rating");
    }
  };

  
  const renderStars = (reportId) => {
    const ratingValue = newRatings[reportId]?.rating || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            cursor: "pointer",
            color: i <= ratingValue ? "#FFD700" : "#ccc",
            fontSize: "20px",
            marginRight: "2px",
          }}
          onClick={() => handleStarClick(reportId, i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="lecturer-dashboard text-white text-center">
      <h1>Welcome, {name}</h1>
      <p className="text-muted">Faculty: Information Communications Technology</p>

      <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">
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
          <p>View your recent actions and submissions.</p>
          <button className="btn btn-secondary mt-3" onClick={handleViewLogs}>
            {showLogs ? "Hide Logs" : "View Logs"}
          </button>
        </div>

        {/* Ratings */}
        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>Rate Lectures</h3>
          <p>Submit and view ratings for lectures.</p>
          <button className="btn btn-primary mt-3" onClick={handleViewRatings}>
            {showRatings ? "Hide Ratings" : "Rate Lectures"}
          </button>
        </div>
      </div>

      {/* Monitoring Logs */}
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
                logs.map((log) => (
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

      {/* Ratings */}
      {showRatings && (
        <div className="container mt-5">
          <h4>Lecture Ratings</h4>
          <table className="table table-striped text-dark">
            <thead>
              <tr>
                <th>Lecture / Report ID</th>
                <th>Average Rating</th>
                <th>Total Ratings</th>
                <th>Your Rating</th>
              </tr>
            </thead>
            <tbody>
              {ratings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center">
                    No reports found
                  </td>
                </tr>
              ) : (
                ratings.map((r) => (
                  <tr key={r.id}>
                    <td>{r.class_name || r.course_name}</td>
                    <td>
                      {avgRatings[r.id] && typeof avgRatings[r.id].avgRating === "number"
                        ? avgRatings[r.id].avgRating.toFixed(1)
                        : "-"}
                    </td>
                    <td>{avgRatings[r.id]?.totalRatings || 0}</td>
                    <td>
                      {renderStars(r.id)}
                      <input
                        type="text"
                        placeholder="Comments"
                        className="form-control mt-1"
                        style={{ width: "200px", display: "inline-block" }}
                        value={newRatings[r.id]?.comments || ""}
                        onChange={(e) => handleCommentChange(r.id, e.target.value)}
                      />
                      <button
                        className="btn btn-success btn-sm mt-1"
                        onClick={() => submitRating(r.id)}
                      >
                        Submit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <footer className="mt-5 text-muted">LUCT Reporting 2025</footer>
    </div>
  );
};

export default LecturerDashboard;
