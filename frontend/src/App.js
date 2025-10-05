import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


import Navbar from "./components/Navbar";


import StudentDashboard from "./pages/student/StudentDashboard";
import LecturesList from "./pages/student/LecturesList";
import LecturesRating from "./pages/student/LecturesRating";

import LecturerDashboard from "./pages/lecturer/LecturerDashboard";
import ReportForm from "./pages/lecturer/ReportForm";
import MyReports from "./pages/lecturer/MyReports";

import PRLDashboard from "./pages/prl/PRLDashboard";
import ReportsReview from "./pages/prl/ReportsReview";

import PLDashboard from "./pages/pl/PLDashboard";
import AssignCourses from "./pages/pl/AssignCourses";
import ReportsList from "./pages/pl/ReportsList";

import Monitoring from "./components/Monitoring"; 

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";


const PrivateRoute = ({ element: Element, role: RequiredRole }) => {
  const userRole = localStorage.getItem("role");
  if (!userRole) return <Navigate to="/login" replace />;
  if (RequiredRole && userRole !== RequiredRole) return <Navigate to="/login" replace />;
  return <Element />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          
          <Route path="/student" element={<PrivateRoute element={StudentDashboard} role="student" />} />
          <Route path="/student/lectures" element={<PrivateRoute element={LecturesList} role="student" />} />
          <Route path="/student/lectures/:lectureId/ratings" element={<PrivateRoute element={LecturesRating} role="student" />} />

          
          <Route path="/lecturer" element={<PrivateRoute element={LecturerDashboard} role="lecturer" />} />
          <Route path="/lecturer/report-form" element={<PrivateRoute element={ReportForm} role="lecturer" />} />
          <Route path="/lecturer/my-reports" element={<PrivateRoute element={MyReports} role="lecturer" />} />

         
          <Route path="/prl" element={<PrivateRoute element={PRLDashboard} role="prl" />} />
          <Route path="/prl/reports-review" element={<PrivateRoute element={ReportsReview} role="prl" />} />

          
          <Route path="/pl" element={<PrivateRoute element={PLDashboard} role="pl" />} />
          <Route path="/pl/assign-courses" element={<PrivateRoute element={AssignCourses} role="pl" />} />
          <Route path="/pl/reports-list" element={<PrivateRoute element={ReportsList} role="pl" />} />

          <Route path="/monitoring" element={<PrivateRoute element={Monitoring} />} />

          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
