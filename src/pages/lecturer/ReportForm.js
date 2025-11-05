// ✅ PATCHED VERSION of ReportForm.js
import React, { useEffect, useState } from "react";
import api from "../../api/api";

const ReportForm = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    class_id: "",
    week_of_reporting: "",
    date_of_lecture: "",
    actual_students_present: "",
    topic_taught: "",
    learning_outcomes: "",
    recommendations: "",
  });
  const [msg, setMsg] = useState("");

  const lecturer_name = localStorage.getItem("name") || "Lecturer";

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get("/classes");
        setClasses(res.data || []);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  const handleClassSelect = (e) => {
    const id = e.target.value;
    setFormData({ ...formData, class_id: id });
    const selected = classes.find((c) => String(c.id) === id);
    setSelectedClass(selected);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reports", {
        ...formData,
        lecturer_name,
      });
      setMsg("✅ Report submitted successfully!");
      setFormData({
        class_id: "",
        week_of_reporting: "",
        date_of_lecture: "",
        actual_students_present: "",
        topic_taught: "",
        learning_outcomes: "",
        recommendations: "",
      });
      setSelectedClass(null);
    } catch (err) {
      console.error("Submit report error:", err);
      setMsg("❌ Failed to submit report");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Submit Lecture Report</h2>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={handleSubmit}>
        {/* Class Selection */}
        <div className="mb-3">
          <label>Class</label>
          <select
            className="form-select"
            name="class_id"
            value={formData.class_id}
            onChange={handleClassSelect}
            required
          >
            <option value="">Select a class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.course_name} ({c.course_code}) - {c.class_name}
              </option>
            ))}
          </select>
        </div>

        {/* Auto-display selected class info */}
        {selectedClass && (
          <div className="card p-3 mb-3 bg-dark text-white">
            <p><strong>Faculty:</strong> Faculty of ICT</p>
            <p><strong>Course Code:</strong> {selectedClass.course_code}</p>
            <p><strong>Venue:</strong> {selectedClass.venue}</p>
            <p><strong>Scheduled Time:</strong> {selectedClass.scheduled_time}</p>
            <p><strong>Total Registered Students:</strong> {selectedClass.total_registered_students}</p>
          </div>
        )}

        {/* Rest of form fields */}
        <div className="mb-3">
          <label>Week of Reporting</label>
          <input type="text" name="week_of_reporting" value={formData.week_of_reporting} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label>Date of Lecture</label>
          <input type="date" name="date_of_lecture" value={formData.date_of_lecture} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label>Actual Students Present</label>
          <input type="number" name="actual_students_present" value={formData.actual_students_present} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label>Topic Taught</label>
          <input type="text" name="topic_taught" value={formData.topic_taught} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label>Learning Outcomes</label>
          <textarea name="learning_outcomes" value={formData.learning_outcomes} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label>Recommendations</label>
          <textarea name="recommendations" value={formData.recommendations} onChange={handleChange} className="form-control" required />
        </div>

        <button className="btn btn-primary">Submit Report</button>
      </form>
    </div>
  );
};

export default ReportForm;
