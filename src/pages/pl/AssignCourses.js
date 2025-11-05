import React, { useEffect, useState } from "react";
import api from "../../api/api";

const AssignCourses = () => {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [venue, setVenue] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, lecturersRes] = await Promise.all([
          api.get("/classes/courses", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/classes/lecturers", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setCourses(coursesRes.data || []);
        setLecturers(lecturersRes.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses or lecturers.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleAssign = async () => {
    if (!selectedCourse || !selectedLecturer) {
      setError("Please select both course and lecturer.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const res = await api.post(
        "/classes/assign",
        {
          course_id: parseInt(selectedCourse),
          lecturer_id: parseInt(selectedLecturer),
          venue: venue || null,
          scheduled_time: scheduledTime || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(res.data.message || "Lecturer assigned successfully!");
      setSelectedCourse("");
      setSelectedLecturer("");
      setVenue("");
      setScheduledTime("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to assign lecturer.");
    }
  };

  if (loading) return <p>Loading courses and lecturers...</p>;

  return (
    <div className="container mt-5">
      <h2>Assign Lecturers to Classes</h2>
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}

      <div className="mb-3">
        <label>Select Course:</label>
        <select className="form-select" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">-- Choose a course --</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Select Lecturer:</label>
        <select className="form-select" value={selectedLecturer} onChange={(e) => setSelectedLecturer(e.target.value)}>
          <option value="">-- Choose a lecturer --</option>
          {lecturers.map(l => (
            <option key={l.id} value={l.id}>{l.username}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Venue (optional):</label>
        <input type="text" className="form-control" value={venue} onChange={e => setVenue(e.target.value)} />
      </div>

      <div className="mb-3">
        <label>Scheduled Time (optional):</label>
        <input type="datetime-local" className="form-control" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} />
      </div>

      <button className="btn btn-primary" onClick={handleAssign}>Assign Lecturer</button>
    </div>
  );
};

export default AssignCourses;
