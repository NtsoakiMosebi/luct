
import React, { useState, useEffect } from "react";
import api from "../../api/api";
import ReportsList from "./ReportsList";
import Monitoring from "./Monitoring";
import AssignCourses from "./AssignCourses";

const PLDashboard = () => {
  const [activeCard, setActiveCard] = useState("");
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [error, setError] = useState(null);

  const [showCourses, setShowCourses] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [showRatings, setShowRatings] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch Courses
  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  
  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  };

  
  const fetchRatings = async () => {
    try {
      const res = await api.get("/ratings/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRatings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching ratings:", err);
      setRatings([]);
    } finally {
      setLoadingRatings(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchClasses();
    fetchRatings();
  }, []);

  const renderCardContent = () => {
    switch (activeCard) {
      case "courses":
        return <AssignCourses courses={courses} />;
      case "reports":
        return <ReportsList />;
      case "monitoring":
        return <Monitoring />;
      case "classes":
        return (
          <div className="mt-4 container text-white">
            <h3>Classes</h3>
            <table className="table table-dark table-hover mt-2">
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Course</th>
                  <th>Lecturer</th>
                  <th>Venue</th>
                  <th>Time</th>
                  <th>Total Students</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id}>
                    <td>{cls.class_name}</td>
                    <td>{cls.course_name}</td>
                    <td>{cls.lecturer_name}</td>
                    <td>{cls.venue}</td>
                    <td>{cls.scheduled_time}</td>
                    <td>{cls.total_registered_students}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "ratings":
        return (
          <div className="mt-4 container">
            <h3 className="text-white">All Ratings (Read-Only)</h3>
            {loadingRatings ? (
              <p className="text-white">Loading ratings...</p>
            ) : (
              <div className="list-group mt-3 text-start">
                {ratings.length === 0 && <p className="text-white">No ratings yet.</p>}
                {ratings.map((r) => (
                  <div
                    key={r.id}
                    className="list-group-item bg-primary text-white mb-2 rounded rating-item"
                  >
                    <p>
                      <strong>{r.rater_name || "User"}</strong> rated{" "}
                      <strong>{r.class_name || r.lecture_name || "Lecture/Class"}</strong>:{" "}
                      {"★".repeat(r.rating || 0)} ({r.rating || 0}/5)
                    </p>
                    {r.comments && <p>{r.comments}</p>}
                    <small className="text-light">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleString()
                        : "Date not available"}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return <p className="text-white mt-4">Select a feature to view details.</p>;
    }
  };

  return (
    <div className="pl-dashboard text-white text-center">
      <h1>Welcome, Program Leader</h1>
      <p className="text-muted">
        Manage courses, view reports, monitor users, and see ratings.
      </p>

      <div className="d-flex justify-content-center gap-4 mt-4 flex-wrap">
        <div className="card bg-dark text-white p-4" style={{ width: "220px" }}>
          <h3>Courses</h3>
          <p>Add, assign lectures/modules.</p>
          <button className="btn btn-primary mt-3" onClick={() => setActiveCard("courses")}>
            Manage Courses
          </button>
        </div>

        <div className="card bg-dark text-white p-4" style={{ width: "220px" }}>
          <h3>Reports</h3>
          <p>View reports from PRL.</p>
          <button className="btn btn-secondary mt-3" onClick={() => setActiveCard("reports")}>
            View Reports
          </button>
        </div>

        <div className="card bg-dark text-white p-4" style={{ width: "220px" }}>
          <h3>Monitoring</h3>
          <p>Track recent actions by users.</p>
          <button className="btn btn-primary mt-3" onClick={() => setActiveCard("monitoring")}>
            Monitor
          </button>
        </div>

        <div className="card bg-dark text-white p-4" style={{ width: "220px" }}>
          <h3>Classes</h3>
          <p>View all classes.</p>
          <button className="btn btn-secondary mt-3" onClick={() => setActiveCard("classes")}>
            View Classes
          </button>
        </div>

        <div className="card bg-dark text-white p-4" style={{ width: "220px" }}>
          <h3>Ratings</h3>
          <p>View ratings (read-only).</p>
          <button className="btn btn-primary mt-3" onClick={() => setActiveCard("ratings")}>
            View Ratings
          </button>
        </div>
      </div>

      <div className="mt-5">{renderCardContent()}</div>

      <footer className="mt-5 text-muted">LUCT Reporting 2025</footer>
    </div>
  );
};

export default PLDashboard;
