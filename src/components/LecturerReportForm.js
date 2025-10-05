import React, { useState, useEffect } from "react";
import api from "../../api/api";

const LecturerReportForm = () => {
  const [form, setForm] = useState({
    lecturer_id: "",        // <-- selected lecturer
    class_id: "",
    week_of_reporting: "",
    date_of_lecture: "",
    actual_students_present: "",
    topic_taught: "",
    learning_outcomes: "",
    recommendations: "",
    prl_feedback: null,
    status: "pending",
  });

  const [lecturers, setLecturers] = useState([]);

  useEffect(() => {
    // Fetch all lecturers
    const fetchLecturers = async () => {
      try {
        const res = await api.get("/lecturers"); // your backend endpoint
        setLecturers(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch lecturers", err);
      }
    };
    fetchLecturers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reports", {
        ...form,
        class_id: parseInt(form.class_id),
        actual_students_present: parseInt(form.actual_students_present),
      });
      alert("Report submitted successfully!");
      setForm({
        lecturer_id: "",
        class_id: "",
        week_of_reporting: "",
        date_of_lecture: "",
        actual_students_present: "",
        topic_taught: "",
        learning_outcomes: "",
        recommendations: "",
        prl_feedback: null,
        status: "pending",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to submit report");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Submit Lecture Report</h3>
      <form onSubmit={handleSubmit}>
        {/* Lecturer select */}
        <div className="form-group mt-2">
          <label>Lecturer</label>
          <select
            name="lecturer_id"
            className="form-control"
            value={form.lecturer_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Lecturer --</option>
            {lecturers.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Class ID */}
        <div className="form-group mt-2">
          <label>Class ID</label>
          <input
            type="number"
            name="class_id"
            className="form-control"
            value={form.class_id}
            onChange={handleChange}
            required
          />
        </div>

        {/* Week of reporting */}
        <div className="form-group mt-2">
          <label>Week of Reporting</label>
          <input
            type="text"
            name="week_of_reporting"
            className="form-control"
            value={form.week_of_reporting}
            onChange={handleChange}
            required
          />
        </div>

        {/* Date of lecture */}
        <div className="form-group mt-2">
          <label>Date of Lecture</label>
          <input
            type="date"
            name="date_of_lecture"
            className="form-control"
            value={form.date_of_lecture}
            onChange={handleChange}
            required
          />
        </div>

        {/* Actual students present */}
        <div className="form-group mt-2">
          <label>Actual Students Present</label>
          <input
            type="number"
            name="actual_students_present"
            className="form-control"
            value={form.actual_students_present}
            onChange={handleChange}
            required
          />
        </div>

        {/* Topic Taught */}
        <div className="form-group mt-2">
          <label>Topic Taught</label>
          <input
            type="text"
            name="topic_taught"
            className="form-control"
            value={form.topic_taught}
            onChange={handleChange}
            required
          />
        </div>

        {/* Learning Outcomes */}
        <div className="form-group mt-2">
          <label>Learning Outcomes</label>
          <textarea
            name="learning_outcomes"
            className="form-control"
            value={form.learning_outcomes}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        {/* Recommendations */}
        <div className="form-group mt-2">
          <label>Recommendations</label>
          <textarea
            name="recommendations"
            className="form-control"
            value={form.recommendations}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        <button className="btn btn-primary mt-3">Submit Report</button>
      </form>
    </div>
  );
};

export default LecturerReportForm;
