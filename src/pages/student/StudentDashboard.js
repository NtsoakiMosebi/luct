import React from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="student-dashboard text-white text-center">
      <h1>Welcome, Student</h1>
      <p className="text-muted">Monitor lectures and give ratings.</p>

      <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">
        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>View Lectures</h3>
          <p>See all lectures and their schedules in your program.</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/student/lectures")}
          >
            View Now
          </button>
        </div>

        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>Give Ratings</h3>
          <p>Provide ratings and feedback for the lectures you attend.</p>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/student/lectures")}
          >
            Rate Now
          </button>
        </div>
      </div>

      <footer className="mt-5 text-muted">LUCT Reporting 2025</footer>
    </div>
  );
};

export default StudentDashboard;
