import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import {jwtDecode} from "jwt-decode";

const LecturesRating = ({ isPL = false }) => {
  const { lectureId } = useParams();
  const [ratings, setRatings] = useState([]); // For PL only
  const [average, setAverage] = useState({ avgRating: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comments, setComments] = useState("");
  const [msg, setMsg] = useState("");

  const token = localStorage.getItem("token");
  let userId = null;
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id || decoded.user_id;
      role = decoded.role || localStorage.getItem("role");
    } catch {
      console.warn("Invalid token");
    }
  }

  // Fetch ratings/average
  const fetchData = async () => {
    try {
      if (isPL) {
        // PL sees all ratings
        const res = await api.get("/ratings/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRatings(res.data || []);
      } else if (lectureId) {
        // Student sees only average rating
        const resAvg = await api.get(`/ratings/${lectureId}/average`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAverage(resAvg.data || { avgRating: 0, totalRatings: 0 });
      }
    } catch (err) {
      console.error("Error fetching ratings:", err);
      setMsg("❌ Failed to load ratings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lectureId]);

  // Handle student rating submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || isPL) {
      setMsg("⚠️ You cannot submit ratings.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setMsg("⚠️ Please select a rating out of 5.");
      return;
    }

    try {
      await api.post(
        `/ratings/${lectureId}`,
        { rating, comments, entityType: "lecture" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("✅ Rating submitted successfully!");
      setRating(0);
      setComments("");
      fetchData(); // Refresh average after submission
    } catch (err) {
      console.error("Error submitting rating:", err);
      setMsg("❌ Failed to submit rating.");
    }
  };

  if (loading) return <p className="text-center text-white">Loading ratings...</p>;

  return (
    <div className="container mt-4 text-white text-center">
      <h2>Lecture Ratings</h2>

      {isPL && (
        <p className="text-warning">
          Viewing all lecture ratings as Program Leader. You cannot submit ratings.
        </p>
      )}

      {!isPL && (
        <p className="average-rating">
          ⭐ Average Rating: <strong>{Number(average.avgRating || 0).toFixed(1)}</strong> / 5 (
          {average.totalRatings} total)
        </p>
      )}

      {!isPL && userId && (
        <form className="rating-form mb-4" onSubmit={handleSubmit}>
          <h4>Rate this lecture (out of 5)</h4>

          <div className="rating-stars mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${(hovered || rating) >= star ? "active" : ""}`}
                onClick={() => {
                  setRating(star);
                  setMsg("");
                }}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                style={{ cursor: "pointer", fontSize: "1.5rem", color: (hovered || rating) >= star ? "#FFD700" : "#ccc" }}
              >
                ★
              </span>
            ))}
          </div>

          {rating > 0 && (
            <p className="text-success">
              You selected: <strong>{rating}</strong> / 5
            </p>
          )}

          <textarea
            className="form-control mb-2"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Optional comment..."
            rows={3}
          />

          <button type="submit" className="btn btn-primary">
            Submit Rating
          </button>
          {msg && <p className="mt-2 text-info">{msg}</p>}
        </form>
      )}

      {isPL && (
        <>
          <h3 className="mt-5">All Ratings</h3>
          <div className="list-group mt-3 text-start">
            {ratings.length === 0 && <p>No ratings yet.</p>}
            {ratings.map((r) => (
              <div
                key={r.id}
                className="list-group-item bg-dark text-white mb-2 rounded rating-item"
              >
                <p>
                  <strong>{r.username || "User"}</strong> rated{" "}
                  <strong>{r.lecture_name || "Lecture"}</strong>: {"★".repeat(r.rating || 0)} ({r.rating || 0}/5)
                </p>
                {r.comments && <p>{r.comments}</p>}
                <small className="text-muted">
                  {r.created_at ? new Date(r.created_at).toLocaleString() : "Date not available"}
                </small>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LecturesRating;
