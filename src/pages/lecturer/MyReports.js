import React, { useEffect, useState } from "react";
import api from "../../api/api";
import SubmitFeedback from "../pl/SubmitFeedback";

function MyReports() {
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    fetchReports();
  }, []);

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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 && (
            <tr>
              <td colSpan={13} className="text-center">
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
              <td style={{ minWidth: "250px" }}>
                {(role === "pl" && !r.pl_feedback) ||
                (role === "prl" && !r.prl_feedback) ? (
                  <SubmitFeedback
                    reportId={r.id}
                    existingFeedback={role === "pl" ? r.pl_feedback : r.prl_feedback}
                    onFeedbackSubmitted={fetchReports} // refresh table after submission
                  />
                ) : (
                  <span>Feedback submitted</span>
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
