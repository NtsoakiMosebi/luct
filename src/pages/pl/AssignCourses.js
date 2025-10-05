import React, { useEffect, useState } from "react";
import api from "../../api/api";

const AssignCourses = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get("/classes");
        setClasses(res.data || []);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load classes.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Assign Courses</h2>
      {loading && <p>Loading classes...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && classes.length > 0 && (
        <div className="mt-4">
          <select
            className="form-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select a class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.course_name} - {c.class_name} - {c.venue || "-"}
              </option>
            ))}
          </select>

          {selectedClass && (
            <div className="mt-3 card p-3">
              <p>
                <strong>Total Registered Students:</strong>{" "}
                {classes.find((c) => c.id == selectedClass)?.total_registered_students || 0}
              </p>
              <p>
                <strong>Scheduled Time:</strong>{" "}
                {classes.find((c) => c.id == selectedClass)?.scheduled_time || "Not set"}
              </p>
            </div>
          )}
        </div>
      )}

      {!loading && classes.length === 0 && <p>No classes available.</p>}
    </div>
  );
};

export default AssignCourses;
