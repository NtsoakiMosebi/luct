import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

const ReportsReview = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports"); // returns array directly
        setReports(res.data || []); // ✅ use res.data, not res.data.reports
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        setError("Failed to fetch reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!reports.length) return <p>No reports available.</p>;

  return (
    <div className="container mt-4">
      <h3>Review Reports</h3>
      <table className="table table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>Course</th>
            <th>Lecturer</th>
            <th>Date</th>
            <th>Topic</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.course_name || report.courseName}</td>
              <td>{report.lecturer_name || report.lecturerName}</td>
              <td>{report.date_of_lecture}</td>
              <td>{report.topic_taught}</td>
              <td>
                <Link
                  className="btn btn-sm btn-primary"
                  to={`/prl/feedback/${report.id}`}
                >
                  Add Feedback
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsReview;
