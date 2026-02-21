import React, { useState, useEffect } from "react";
import { Wallet, LogOut } from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast'; 

export default function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");

  // --- THE UPGRADE: Fetch and format the user's name ---
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      // Extract the part before the '@' symbol (e.g., rajdeepchauhan0105 -> Rajdeepchauhan0105)
      const namePart = email.split('@')[0];
      // Capitalize the first letter
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      setUserName(formattedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userTier');
    localStorage.removeItem('userEmail'); // Don't forget to clear the email too!
    
    toast.dismiss(); 
    toast.success("Logged out successfully", { duration: 3000 });
    
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-[#121212]/70 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20"> 
          
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-brand-600 to-purple-500 p-2 rounded-xl shadow-lg group-hover:shadow-brand-500/25 transition-all">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white group-hover:opacity-80 transition-opacity">
              SpendSense
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <ThemeToggle />

            {/* --- THE UPGRADE: Dynamic User Greeting --- */}
            <span className="text-gray-600 dark:text-gray-300 text-sm font-medium hidden sm:block">
              Welcome, <span className="text-gray-900 dark:text-white font-bold">{userName}</span>
            </span>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:block">Logout</span>
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  );
}