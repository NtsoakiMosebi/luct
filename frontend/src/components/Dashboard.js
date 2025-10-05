import React from 'react';

function Dashboard({ user }) {
  return (
    <div className="container mt-5">
      <h2>Welcome, {user.name || user.username}!</h2>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Faculty:</strong> {user.facultyName || 'N/A'}</p>

      <div className="mt-4">
        <h4>Dashboard Modules</h4>
        <ul>
          {user.role === 'Lecturer' && (
            <>
              <li>📚 <strong>Classes:</strong> View and manage your classes</li>
              <li>📝 <strong>Reports:</strong> Submit and review reports</li>
              <li>⭐ <strong>Monitoring & Rating:</strong> Track your performance</li>
            </>
          )}

          {user.role === 'Principal Lecturer' && (
            <>
              <li>📖 <strong>Courses:</strong> View all courses and lectures under your stream</li>
              <li>📝 <strong>Reports:</strong> Assess lecture reports and add feedback</li>
              <li>⭐ <strong>Monitoring & Rating</strong></li>
            </>
          )}

          {user.role === 'Program Leader' && (
            <>
              <li>➕ <strong>Courses:</strong> Add and assign lecturer modules</li>
              <li>📝 <strong>Reports:</strong> View reports from PRL</li>
              <li>⭐ <strong>Monitoring, Classes, Lectures & Rating</strong></li>
            </>
          )}

          {user.role === 'Student' && (
            <>
              <li>👤 <strong>Profile & Monitoring</strong></li>
              <li>⭐ <strong>Rating</strong></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
