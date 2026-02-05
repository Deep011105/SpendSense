import React from 'react';

export default function StatCard({ title, amount, Icon, type = 'neutral' }) {
  
  // Dynamic colors based on the "type" prop
  // Light Mode: Pastel background + Dark Text
  // Dark Mode: Dark transparent background + Light Text
  const colorClasses = {
    neutral: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
    success: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
    danger:  'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
  };

  return (
    // 1. CONTAINER: bg-white -> dark:bg-dark-card, border colors
    <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-all duration-300">
      <div>
        {/* 2. TITLE: Gray-500 -> Gray-400 (lighter gray for dark mode) */}
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        
        {/* 3. AMOUNT: Black -> White */}
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{amount}</p>
      </div>
      
      <div className={`p-3 rounded-full ${colorClasses[type]} transition-colors`}>
        {/* Render the Icon component passed as a prop */}
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}