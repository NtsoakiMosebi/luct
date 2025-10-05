
import React from "react";
import { useNavigate } from "react-router-dom";

const PRLDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="prl-dashboard text-white text-center">
      <h1>Welcome, PRL</h1>
      <p className="text-muted">Review reports submitted by lecturers and provide feedback.</p>

      <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">
        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>Review Reports</h3>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/prl/reports-review")}
          >
            Review Now
          </button>
        </div>

        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>Provide Feedback</h3>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/prl/feedback-form")}
          >
            Give Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default PRLDashboard;
