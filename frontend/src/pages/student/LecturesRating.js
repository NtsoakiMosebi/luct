import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

const LecturesRating = () => {
  const { lectureId } = useParams();
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = (() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.id || decoded.user_id;
    }
    return localStorage.getItem("userId");
  })();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resRatings = await api.get(`/ratings/${lectureId}`);
        setRatings(resRatings.data.ratings || []);

        const resAvg = await api.get(`/ratings/${lectureId}/average`);
        setAverage(resAvg.data || { avgRating: 0, totalRatings: 0 });
      } catch (err) {
        console.error("Error fetching ratings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lectureId]);

  if (loading) return <p className="text-center text-white">Loading ratings...</p>;

  return (
    <div className="container mt-4 text-white text-center">
      <h2>Lecture Ratings</h2>

      {average && (
        <p>
          ⭐ Average Rating: <strong>{Number(average.avgRating || 0).toFixed(1)}</strong>{" "}
          ({average.totalRatings} total)
        </p>
      )}

      <h3 className="mt-5">All Ratings</h3>
      <div className="list-group mt-3">
        {ratings.length === 0 && <p>No ratings yet.</p>}
        {ratings.map((r) => (
          <div
            key={r.id}
            className="list-group-item bg-dark text-white text-start mb-2 rounded"
          >
            <p>
              <strong>{r.student_name}</strong> rated:{" "}
              <span style={{ color: "gold" }}>{"★".repeat(r.rating || 0)}</span>
            </p>
            {r.comments && <p>{r.comments}</p>}
            <small className="text-muted">{new Date(r.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecturesRating;
