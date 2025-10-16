import React, { useEffect, useState } from "react";
import api from "../../api/api";

const Monitoring = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await api.get("/reports/monitoring");
      setLogs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <p>Loading monitoring logs...</p>;

  return (
    <div className="container mt-4">
      <h3>Monitoring Logs</h3>
      {logs.length === 0 ? (
        <p>No logs available.</p>
      ) : (
        <table className="table table-striped table-bordered table-dark">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Action</th>
              <th>Target</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.name}</td>
                <td>{log.role}</td>
                <td>{log.action}</td>
                <td>{log.target}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Monitoring;
