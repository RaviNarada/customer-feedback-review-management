import React from 'react';
import { useNavigate } from 'react-router-dom';

const TraineeDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-pink-50 p-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-pink-600">My Feedback Portal</h1>
        <button 
          onClick={handleLogout}
          className="border-2 border-pink-600 text-pink-600 px-6 py-2 rounded-xl hover:bg-pink-600 hover:text-white transition-all font-bold"
        >
          Logout
        </button>
      </div>
      
      <div className="mt-8 bg-white p-10 rounded-3xl shadow-sm text-center">
        <h2 className="text-xl font-bold">Welcome, Trainee!</h2>
        <p className="text-gray-500">Ready to submit your trainer review?</p>
      </div>
    </div>
  );
};

export default TraineeDashboard;