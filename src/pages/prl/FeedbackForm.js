import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import SubmitFeedback from "../pl/SubmitFeedback"; 

const FeedbackForm = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    try {
      const res = await api.get(`/reports/${id}`);
      setReport(res.data);
    } catch (err) {
      console.error("Failed to fetch report:", err);
      setError("Failed to load report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  if (loading) return <p>Loading report...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!report) return <p>Report not found.</p>;

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <h3>Submit Feedback for Report #{report.id}</h3>
      <p>
        <strong>Course:</strong> {report.course_name} <br />
        <strong>Lecturer:</strong> {report.lecturer_name} <br />
        <strong>Date:</strong> {report.date_of_lecture} <br />
        <strong>Topic:</strong> {report.topic_taught}
      </p>
      <SubmitFeedback
        reportId={report.id}
        existingFeedback={report.prl_feedback}
        onFeedbackSubmitted={fetchReport}
      />
    </div>
  );
};

export default FeedbackForm;
