import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

const LecturesList = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        let studentId = null;
        const token = localStorage.getItem("token");

        if (token) {
          const decoded = jwtDecode(token);
          studentId = decoded.id || decoded.user_id;
        }

        if (!studentId) {
          studentId = localStorage.getItem("userId"); // fallback
        }

        if (!studentId) {
          setError("Student ID missing. Please login.");
          setLoading(false);
          return;
        }

        const res = await api.get(`/classes/student/${studentId}`);
        setLectures(res.data || []);
      } catch (err) {
        console.error("Failed to fetch lectures:", err);
        setError("Failed to load lectures.");
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  if (loading) return <p className="text-center text-white">Loading lectures...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="container mt-4 text-white">
      <h2 className="mb-4">My Lectures</h2>
      {lectures.length === 0 ? (
        <p>No lectures found.</p>
      ) : (
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Course</th>
              <th>Code</th>
              <th>Lecturer</th>
              <th>Venue</th>
              <th>Scheduled Time</th>
              <th>Registered</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {lectures.map((lecture) => (
              <tr key={lecture.id}>
                <td>{lecture.course_name}</td>
                <td>{lecture.course_code}</td>
                <td>{lecture.lecturer_name}</td>
                <td>{lecture.venue}</td>
                <td>{lecture.scheduled_time}</td>
                <td>{lecture.total_registered_students}</td>
                <td>
                  <Link
                    to={`/student/lectures/${lecture.id}/ratings`}
                    className="btn btn-warning btn-sm"
                  >
                    Give Ratings
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LecturesList;
