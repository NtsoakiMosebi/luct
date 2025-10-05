import React from "react";
import { useNavigate } from "react-router-dom";

const LecturerDashboard = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Lecturer";

  return (
    
  

    <div className="lecturer-dashboard text-white text-center">
      <h1>Welcome, Lecturer</h1>
      <p className="text-muted">Faculty: Information Communications Technology</p>

      <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">
        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>My Reports</h3>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/lecturer/my-reports")}
          >
            View Reports
          </button>
        </div>

        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>Submit New Report</h3>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/lecturer/report-form")}
          >
            Create Report
          </button>
        </div>
      </div>
      

      <footer className="mt-5 text-muted">LUCT Reporting 2025</footer>
    </div>
  );
};

export default LecturerDashboard;
