import React from "react";
import { Wallet, LogOut } from "lucide-react"; 
import { Link } from "react-router-dom"; // Added so the logo is clickable
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    // 1. GLASSMORPHISM & STICKY: Brought over the blur and transparency from the Hero
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-[#121212]/70 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20"> {/* 2. Matched h-20 height */}
          
          {/* LEFT SIDE: Modern Logo & Name */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-brand-600 to-purple-500 p-2 rounded-xl shadow-lg group-hover:shadow-brand-500/25 transition-all">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white group-hover:opacity-80 transition-opacity">
              SpendSense
            </span>
          </Link>

          {/* RIGHT SIDE: User Info & Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <ThemeToggle />

            {/* 3. Upgraded Typography for User Greeting */}
            <span className="text-gray-600 dark:text-gray-300 text-sm font-medium hidden sm:block">
              Welcome, <span className="text-gray-900 dark:text-white font-bold">User</span>
            </span>

            {/* DIVIDER */}
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>

            {/* 4. Upgraded Logout Button with subtle background hover */}
            <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all duration-200">
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:block">Logout</span>
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  );
}