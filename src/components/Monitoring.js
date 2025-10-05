import React, { useEffect, useState } from "react";

function Monitoring() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/api/reports/monitoring", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // ✅ include JWT
      },
    })
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error(err));
  }, []);

  const roles = ["student", "lecturer", "prl", "pl"];

  return (
    <div className="container mt-4">
      <h2>Monitoring Logs</h2>

      {roles.map((role) => {
        const filteredLogs = logs.filter(
          (log) => log.role && log.role.toLowerCase() === role
        );
        if (filteredLogs.length === 0) return null;

        return (
          <div key={role} className="mt-4">
            <h4>{role.toUpperCase()} Logs</h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.name}</td>
                    <td>{log.action}</td>
                    <td>{log.target}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export default Monitoring;
