import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { username, password });

      // Save token and user info
      localStorage.setItem("token", res.data.token || "");
      localStorage.setItem("role", res.data.user.role || "");
      localStorage.setItem("name", res.data.user.name || "");
      localStorage.setItem("faculty_id", res.data.user.faculty_id || "");
      
      // ✅ Save userId automatically for student pages
      localStorage.setItem("userId", res.data.user.id || "");

      // Redirect based on role
      switch (res.data.user.role) {
        case "student":
          navigate("/student");
          break;
        case "lecturer":
          navigate("/lecturer");
          break;
        case "prl":
          navigate("/prl");
          break;
        case "pl":
          navigate("/pl");
          break;
        default:
          setError("Unknown role");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="col-md-4 offset-md-4 mt-5">
      <h3 className="text-center mb-4">Login</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}
