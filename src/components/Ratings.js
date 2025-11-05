import React, { useState, useEffect } from "react";
import api from "../api/api";
import { jwtDecode } from "jwt-decode";

const Ratings = ({ isLecturer = false }) => {
  const [ratings, setRatings] = useState([]);
  const [msg, setMsg] = useState("");

  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      userId = jwtDecode(token).id || jwtDecode(token).user_id;
    } catch {
      console.warn("Invalid token");
    }
  }

  const fetchRatings = async () => {
    if (!token) return setMsg("⚠️ Login first");
    try {
      const url = isLecturer ? "/ratings/lecturer" : "/ratings/all";
      const res = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRatings(res.data || []);
      if (res.data.length === 0) setMsg("No ratings found.");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to load student ratings.");
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  return (
    <div className="ratings-component text-white">
      <h4>Student Ratings {isLecturer ? "for Your Lectures" : ""}</h4>
      {msg && <p>{msg}</p>}

      {ratings.length > 0 && (
        <div className="list-group mt-3">
          {ratings.map((r) => (
            <div key={r.id} className="list-group-item bg-dark text-white mb-2 rounded">
              <p>
                <strong>{r.rater_name || "Student"}</strong> rated <strong>{r.lecture_name || r.class_name}</strong>:{" "}
                {"★".repeat(r.rating || 0)} ({r.rating || 0}/5)
              </p>
              {r.comments && <p>{r.comments}</p>}
              <small className="text-muted">
                {r.created_at ? new Date(r.created_at).toLocaleString() : "Date not available"}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ratings;
