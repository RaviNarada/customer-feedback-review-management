import { type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import StudentDashboard from './components/student-review/StudentDashboard';
import FeedbackForm from './components/student-review/FeedbackForm';

const ProtectedRoute = ({ children, allowedRole }: { children: JSX.Element; allowedRole: string }) => {
  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('userRole');
  if (!token || userRole !== allowedRole) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/trainee-dashboard" element={
          <ProtectedRoute allowedRole="TRAINEE"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/trainee-dashboard/feedback/:courseId" element={
          <ProtectedRoute allowedRole="TRAINEE"><FeedbackForm /></ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;