import React, { useState, useEffect } from "react";
import api from "../api/api";
import { jwtDecode } from "jwt-decode";

const Ratings = ({ entityId, entityType, isPL = false }) => {
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState({ avgRating: 0, totalRatings: 0 });
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comments, setComments] = useState("");
  const [msg, setMsg] = useState("");

  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try { userId = jwtDecode(token).id || jwtDecode(token).user_id; } 
    catch { console.warn("Invalid token"); }
  }

  const fetchRatings = async () => {
    try {
      const url = isPL ? "/ratings/all" : `/ratings/${entityId}`;
      const res = await api.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (isPL) setRatings(res.data);
      else setRatings([]);
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to load ratings.");
    }
  };

  const fetchAvg = async () => {
    try {
      const res = await api.get(`/ratings/${entityId}/average`);
      setAvgRating({ avgRating: res.data.avgRating || 0, totalRatings: res.data.totalRatings || 0 });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRatings();
    if (!isPL) fetchAvg();
  }, [entityId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return setMsg("⚠️ Login first");
    if (rating < 1 || rating > 5) return setMsg("⚠️ Select rating");

    try {
      await api.post(
        `/ratings/${entityId}`,
        { rating, comments, entityType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("✅ Rating submitted successfully");
      setRating(0);
      setComments("");
      fetchAvg();
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.error || "❌ Failed to submit rating");
    }
  };

  return (
    <div className="ratings-component text-white">
      {!isPL && (
        <>
          <h4>Rate this {entityType}</h4>
          {msg && <p>{msg}</p>}
          <form onSubmit={handleSubmit}>
            {[1,2,3,4,5].map((s) => (
              <span
                key={s}
                className={(hovered || rating) >= s ? "active-star" : ""}
                onClick={() => setRating(s)}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                style={{ cursor: "pointer", fontSize: "1.5rem", color: (hovered || rating) >= s ? "#FFD700" : "#ccc" }}
              >
                ★
              </span>
            ))}
            <br />
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="Optional comments"
              rows={3}
              style={{ width: "100%", marginTop: "0.5rem" }}
            />
            <button type="submit" className="btn btn-primary mt-2">Submit Rating</button>
          </form>

          <p className="mt-2">
            ⭐ Average Rating: {avgRating.avgRating.toFixed(1)} / 5 ({avgRating.totalRatings} ratings)
          </p>
        </>
      )}

      {isPL && (
        <>
          <h4>All Ratings</h4>
          {ratings.length === 0 ? (
            <p>No ratings yet.</p>
          ) : (
            <div className="list-group">
              {ratings.map((r) => (
                <div key={r.id} className="list-group-item bg-dark text-white mb-2 rounded">
                  <p>
                    <strong>{r.username || "User"}</strong> rated <strong>{r.lecture_name}</strong>: {"★".repeat(r.rating)} ({r.rating}/5)
                  </p>
                  {r.comments && <p>{r.comments}</p>}
                  <small className="text-muted">{new Date(r.created_at).toLocaleString()}</small>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Ratings;
