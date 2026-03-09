import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-purple-900">Admin Control Panel</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-all font-bold"
        >
          Logout
        </button>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-bold uppercase text-xs">Total Feedbacks</h3>
          <p className="text-3xl font-black text-gray-800">24</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;