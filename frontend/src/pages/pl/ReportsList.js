import React, { useEffect, useState } from "react";
import api from "../../api/api";

function SubmitFeedback({ reportId, existingFeedback, onFeedbackSubmitted }) {
  const [feedback, setFeedback] = useState(existingFeedback || "");
  const [msg, setMsg] = useState("");
  const role = localStorage.getItem("role");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) return setMsg("Error: User role not found");
    if (!feedback.trim()) return setMsg("Feedback cannot be empty");

    try {
      await api.post(`/reports/${reportId}/feedback`, { feedback, role });
      setMsg("✅ Feedback submitted successfully!");
      if (onFeedbackSubmitted) onFeedbackSubmitted();
    } catch (err) {
      console.error(err);
      setMsg("❌ Error submitting feedback");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
      <textarea
        className="form-control"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Write your feedback here..."
        required
      />
      <button className="btn btn-primary btn-sm" type="submit">
        Submit
      </button>
      {msg && <small className="text-success">{msg}</small>}
    </form>
  );
}

function ReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const role = localStorage.getItem("role");

  const fetchReports = async () => {
    try {
      const endpoint = role === "lecturer" ? "/reports/mine" : "/reports";
      const res = await api.get(endpoint);
      setReports(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [role]);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!reports.length) return <p>No reports available.</p>;

  return (
    <div className="container my-3">
      <h3>Lecture Reports</h3>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Course</th>
              <th>Class</th>
              <th>Lecturer</th>
              <th>Date</th>
              <th>Week</th>
              <th>Students Present</th>
              <th>Topic Taught</th>
              <th>Learning Outcomes</th>
              <th>Recommendations</th>
              <th>PL Feedback</th>
              <th>PRL Feedback</th>
              <th>Status</th>
              {role === "prl" || role === "pl" ? <th>Submit Feedback</th> : null}
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>{r.course_name || r.course_id}</td>
                <td>{r.class_name || "-"}</td>
                <td>{r.lecturer_name || r.lecturer_id}</td>
                <td>{r.date_of_lecture}</td>
                <td>{r.week_of_reporting}</td>
                <td>{r.actual_students_present}</td>
                <td>{r.topic_taught}</td>
                <td>{r.learning_outcomes}</td>
                <td>{r.recommendations}</td>
                <td>{r.pl_feedback || "None"}</td>
                <td>{r.prl_feedback || "None"}</td>
                <td>{r.status}</td>
                {(role === "prl" || role === "pl") && (
                  <td>
                    <SubmitFeedback
                      reportId={r.id}
                      existingFeedback={role === "pl" ? r.pl_feedback : r.prl_feedback}
                      onFeedbackSubmitted={fetchReports}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportsList;
