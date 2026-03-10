import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  // 1. These "states" hold what the user types
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. This hook helps us change pages
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Stops the page from refreshing
    
    // 3. For now, we just pretend login works and redirect
    if (isAdmin) {
      navigate('/admin-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  return (
    // The outer div uses the gradient from your image
    <div className="min-h-screen bg-gradient-to-br from-[#2d0a6b] via-[#5b247a] to-[#e94e77] flex flex-col text-white">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 bg-white/10 backdrop-blur-md">
        <div className="text-xl font-bold italic">FEEDBACK SYSTEM</div>
        <button 
          onClick={() => setIsAdmin(!isAdmin)}
          className="border border-white/40 px-4 py-1 rounded-full hover:bg-white hover:text-purple-900 transition-all"
        >
          {isAdmin ? "Student Login" : "Admin Login"}
        </button>
      </nav>

      {/* Login Card */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-[rgba(255,255,255,0.1)] p-8 rounded-xl shadow-lg w-96 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isAdmin ? "Admin Login" : "Student Login"}
          </h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input 
                type="text" 
                className="w-full border border-[#6a0dad]/40 bg-[rgba(255,255,255,0.1)] p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-white/60"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input 
                type="password" 
                className="w-full border border-[#6a0dad]/40 bg-[rgba(255,255,255,0.1)] p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-white/60"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="w-full bg-[#5b247a] text-white py-2 rounded font-bold hover:bg-[#2d0a6b]">
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;