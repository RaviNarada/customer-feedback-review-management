import  { type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import LoginPage from './components/auth/LoginPage';
import AdminDashboard from './components/admin-dashboard/AdminDashboard';
import TraineeDashboard from './components/trainee-dashboard/TraineeDashboard';

const ProtectedRoute = ({ children, allowedRole }: { children: JSX.Element, allowedRole: string }) => {
  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('userRole');

  if (!token || userRole !== allowedRole) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard/>
          </ProtectedRoute>
        } />

        <Route path="/trainee-dashboard" element={
          <ProtectedRoute allowedRole="TRAINEE">
            <TraineeDashboard />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;