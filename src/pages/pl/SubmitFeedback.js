import React, { useState } from "react";
import api from "../../api/api";

export default function SubmitFeedback({ lectureId, role, onFeedbackSubmitted }) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); 
      const response = await api.post(
        `/reports/${lectureId}/feedback`,
        { feedback, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(response.data.message);
      setFeedback(""); // clear textarea
      if (onFeedbackSubmitted) onFeedbackSubmitted();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to submit feedback");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-form">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={`Enter your feedback as ${role.toUpperCase()}`}
          required
          rows={4}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}
