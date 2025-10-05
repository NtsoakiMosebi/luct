
import React from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="student-dashboard text-white text-center">
      <h1>Welcome, Student</h1>
      <p className="text-muted">Monitor lectures and give ratings.</p>

      <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">
        {/* View Lectures Card */}
        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>View Lectures</h3>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/student/lectures")}
          >
            View Now
          </button>
        </div>

        {/* Give Ratings Card */}
        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>Give Ratings</h3>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/student/lectures")}
          >
            Rate Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
