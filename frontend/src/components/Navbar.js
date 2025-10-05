import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  // Get role from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setRole(null); // update state
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">LUCT Reporting</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {/* Monitoring link for all logged-in users */}
            {role && (
              <li className="nav-item">
                <Link className="nav-link" to="/monitoring">Monitoring</Link>
              </li>
            )}

            {/* Student Links */}
            {role === "student" && (
              <li className="nav-item">
                <Link className="nav-link" to="/student/dashboard">Dashboard</Link>
              </li>
            )}

            {/* Lecturer Links */}
            {role === "lecturer" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/lecturer/report-form">Submit Report</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/lecturer/my-reports">My Reports</Link>
                </li>
              </>
            )}

            {/* PRL Links */}
            {role === "prl" && (
              <li className="nav-item">
                <Link className="nav-link" to="/prl/reports-review">Review Reports</Link>
              </li>
            )}

            {/* PL Links */}
            {role === "pl" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/pl/assign-courses">Assign Courses</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/pl/reports-list">View Reports</Link>
                </li>
              </>
            )}

            {/* Login / Logout */}
            {role ? (
              <li className="nav-item">
                <button className="btn btn-outline-light ms-2" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
