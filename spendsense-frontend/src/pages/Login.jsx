import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Loader2, Wallet, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Verifying credentials...");

    try {
      // NOTE: Update this URL to match your Spring Boot Security login endpoint
      const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
      
      // If using JWTs, save the token to local storage so other axios calls can use it
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      toast.success("Welcome back!", { id: toastId });
      
      // Navigate the user directly to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid email or password.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#fafafa] dark:bg-black transition-colors duration-300 font-sans selection:bg-brand-500/30 px-4 sm:px-6 lg:px-8">
      
      {/* 1. AMBIENT BACKGROUND GLOW: Matches the Landing Page perfectly */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-brand-500/20 dark:bg-brand-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* 2. BACK TO HOME LINK */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-20 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* 3. GLASSMORPHISM LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 p-8 sm:p-10 transition-colors duration-300">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-gradient-to-tr from-brand-600 to-purple-500 p-3 rounded-2xl shadow-lg shadow-brand-500/25 mb-4 inline-flex">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl font-bold transition-all duration-200 active:scale-95 shadow-lg
                  ${loading 
                    ? 'bg-brand-400 dark:bg-brand-800 text-white/80 cursor-not-allowed shadow-none' 
                    : 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-brand-500/30 border border-transparent'
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <a href="/signup" className="font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
              Sign up for free
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}