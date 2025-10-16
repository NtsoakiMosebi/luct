import React, { useEffect, useState } from "react";
import api from "../../api/api";
import SubmitFeedback from "../pl/SubmitFeedback";

function MyReports() {
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("");
  const [ratings, setRatings] = useState({}); // store ratings per lecture

  const role = localStorage.getItem("role"); // 'lecturer', 'pl', 'prl'

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
      const res = await api.get("/reports/mine");
      setReports(res.data || []);
    } catch (err) {
      console.error("Error fetching reports:", err.response || err);
      setMessage("Failed to fetch reports");
    }
  };

  // Fetch ratings for each report
  const fetchRatings = async () => {
    const ratingsData = {};
    for (let r of reports) {
      try {
        const res = await api.get(`/reports/ratings/${r.id}/average`);
        ratingsData[r.id] = res.data.avgRating || 0;
      } catch (err) {
        ratingsData[r.id] = 0;
      }
    }
    setRatings(ratingsData);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (reports.length) fetchRatings();
  }, [reports]);

  // Submit rating
  const handleRatingSubmit = async (reportId, value) => {
    try {
      await api.post(`/reports/ratings/${reportId}`, { rating: value });
      fetchRatings();
    } catch (err) {
      console.error("Rating submit error:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>My Submitted Reports</h3>
      {message && <div className="alert alert-danger">{message}</div>}

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Course</th>
            <th>Class</th>
            <th>Total Registered</th>
            <th>Week</th>
            <th>Date</th>
            <th>Topic</th>
            <th>Students Present</th>
            <th>Learning Outcomes</th>
            <th>Recommendations</th>
            <th>PRL Feedback</th>
            <th>PL Feedback</th>
            <th>Status</th>
            <th>Avg Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 && (
            <tr>
              <td colSpan={14} className="text-center">
                No reports found.
              </td>
            </tr>
          )}
          {reports.map((r) => (
            <tr key={r.id}>
              <td>{r.course_name || "-"}</td>
              <td>{r.class_name || "-"}</td>
              <td>{r.total_registered_students || 0}</td>
              <td>{r.week_of_reporting}</td>
              <td>{r.date_of_lecture}</td>
              <td>{r.topic_taught}</td>
              <td>{r.actual_students_present}</td>
              <td>{r.learning_outcomes}</td>
              <td>{r.recommendations}</td>
              <td>{r.prl_feedback || "-"}</td>
              <td>{r.pl_feedback || "-"}</td>
              <td>{r.status}</td>
              <td>{ratings[r.id] || 0}</td>
              <td style={{ minWidth: "250px" }}>
                {/* Feedback */}
                {(role === "pl" && !r.pl_feedback) ||
                (role === "prl" && !r.prl_feedback) ? (
                  <SubmitFeedback
                    reportId={r.id}
                    existingFeedback={role === "pl" ? r.pl_feedback : r.prl_feedback}
                    onFeedbackSubmitted={fetchReports}
                  />
                ) : (
                  <span>Feedback submitted</span>
                )}
                <br />
                {/* Rating */}
                {role === "lecturer" && (
                  <div className="mt-1">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="Rate 1-5"
                      onBlur={(e) => handleRatingSubmit(r.id, e.target.value)}
                      className="form-control form-control-sm"
                    />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyReports;
