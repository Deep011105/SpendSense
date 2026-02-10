import React from "react";
import { Wallet, LogOut } from "lucide-react"; 
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    // 1. CONTAINER: Changed dark:border-gray-700 -> dark:border-gray-800 (Subtler line)
    <nav className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* LEFT SIDE: Logo & Name */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 text-brand-600 dark:text-brand-500">
              <Wallet className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                SpendSense
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: User Info & Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium hidden sm:block">
              Welcome, User
            </span>

            {/* 2. DIVIDER: Changed dark:bg-gray-700 -> dark:bg-gray-800 */}
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>

            <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200">
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  );
}