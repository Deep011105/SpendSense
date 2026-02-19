import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Loader2, Wallet, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // 1. FRONTEND VALIDATION
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating your account...");

    try {
      // NOTE: Update this URL to match your Spring Boot Security registration endpoint
      // We only send name, email, and password to the backend (drop confirmPassword)
      await axios.post('http://localhost:8080/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      toast.success("Account created successfully! Please log in.", { id: toastId });
      
      // Send them to the login page to authenticate
      navigate('/login');
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to create account. Email may already exist.", 
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#fafafa] dark:bg-black transition-colors duration-300 font-sans selection:bg-brand-500/30 px-4 sm:px-6 lg:px-8 py-12">
      
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-brand-500/20 dark:bg-brand-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* BACK TO HOME LINK */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-20 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* GLASSMORPHISM SIGNUP CARD */}
      <div className="relative z-10 w-full max-w-md my-auto">
        <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 p-8 sm:p-10 transition-colors duration-300">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-gradient-to-tr from-brand-600 to-purple-500 p-3 rounded-2xl shadow-lg shadow-brand-500/25 mb-4 inline-flex">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
              Create an account
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Start mastering your finances today.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* Full Name Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Confirm</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
            </div>

            {/* Terms Agreement
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
              By signing up, you agree to our <a href="#" className="text-brand-600 dark:text-brand-400 hover:underline">Terms of Service</a> and <a href="#" className="text-brand-600 dark:text-brand-400 hover:underline">Privacy Policy</a>.
            </p> */}

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
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}