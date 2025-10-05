import React from "react";
import { useNavigate } from "react-router-dom";

const PLDashboard = () => {
  const navigate = useNavigate();

  return (

      
      <div className="pl-dashboard text-white text-center">
      <h1>Welcome, Program Leader</h1>
      <p className="text-muted">Manage courses and view lecturer reports.</p>

      <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">
        {/* Assign Courses Card */}
        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>Assign Courses</h3>
          <p>Allocate lecturers to courses and schedule modules.</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/pl/assign-courses")}
          >
            Assign Now
          </button>
        </div>

        {/* View Reports Card */}
        <div className="card bg-dark text-white p-4" style={{ width: "250px" }}>
          <h3>View Reports</h3>
          <p>Check reports submitted by lecturers and PRL reviews.</p>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/pl/reports-list")}
          >
            View Reports
          </button>
        </div>
      </div>
     

      <footer className="mt-5 text-muted">LUCT Reporting 2025</footer>
    </div>

  );
};

export default PLDashboard;
