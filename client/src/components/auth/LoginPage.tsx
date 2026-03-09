import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); 
    setIsLoading(true);

    if (isRegister && formData.password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister 
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (isRegister) {
        alert("Registration Successful! Please login.");
        
        
        setFormData({ name: '', email: '', password: '' });
        setConfirmPassword('');
        setIsRegister(false); 
      } else {
        
        sessionStorage.setItem('token', data.token);
        
        // Automatic redirect based on role from backend
        const userRole = data.user?.role || data.role;
        sessionStorage.setItem('userRole', userRole);
        
        if (userRole === 'ADMIN') {
          navigate('/admin-dashboard');
        } else {
          navigate('/trainee-dashboard');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d0a6b] via-[#5b247a] to-[#e94e77] flex flex-col text-white font-sans tracking-tight">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 bg-white/10 backdrop-blur-md border-b border-white/10">
        
       <div className="flex items-center gap-2 text-2xl font-bold italic tracking-tighter">
  <img
    src="./src/assets/Logo.PNG"
    alt="Logo"
    className="h-10 object-contain"
  />
  <span>
    TRAINER<span className="text-pink-400 font-light">PULSE</span>
  </span>
</div>
</nav>
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-gray-900">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-extrabold text-[#2d0a6b]">
              {isRegister ? "Register" : "Login"}
            </h2>
            <p className="text-gray-400 mt-2 font-medium">
              {isRegister ? "Join the trainer feedback system" : "Enter your credentials to access your dashboard"}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center text-sm font-bold animate-pulse">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  required
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#5b247a] text-gray-800"
                  placeholder="Enter your name"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-bold text-gray-700">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                required
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#5b247a] text-gray-800"
                placeholder="name@company.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  required
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#e94e77] text-gray-800"
                  placeholder="••••••••"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-[#5b247a]"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="text-sm font-bold text-gray-700">Confirm Password</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className={`w-full bg-gray-50 border p-3 rounded-xl outline-none transition-all text-gray-800 ${
                    confirmPassword && formData.password !== confirmPassword 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:ring-[#e94e77]'
                  }`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            <button 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#2d0a6b] to-[#e94e77] text-white py-4 rounded-2xl font-bold shadow-xl hover:opacity-90 active:scale-95 transition-all text-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : (isRegister ? "Create Account" : "Sign In")}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setIsRegister(!isRegister);
                setConfirmPassword('');
                setErrorMessage('');
              }}
              className="text-[#5b247a] font-bold hover:text-[#e94e77] transition-colors underline underline-offset-4"
            >
              {isRegister ? "Already have an account? Login" : "Need an account? Register here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;