import React from 'react';

export default function StatCard({ title, amount, Icon, type = 'neutral' }) {
  
  // 1. ADVANCED DYNAMIC STYLING
  // We are defining specific glows, icon backgrounds, and hover border colors for each type
  const styles = {
    neutral: {
      glow: 'from-brand-500/20 to-purple-500/20 dark:from-brand-500/10 dark:to-purple-500/10',
      iconBg: 'bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 ring-brand-500/30',
      borderHover: 'hover:border-brand-500/30 dark:hover:border-brand-400/30',
    },
    success: {
      glow: 'from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/10 dark:to-teal-500/10',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30',
      borderHover: 'hover:border-emerald-500/30 dark:hover:border-emerald-400/30',
    },
    danger: {
      glow: 'from-rose-500/20 to-orange-500/20 dark:from-rose-500/10 dark:to-orange-500/10',
      iconBg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 ring-rose-500/30',
      borderHover: 'hover:border-rose-500/30 dark:hover:border-rose-400/30',
    },
  };

  const currentStyle = styles[type] || styles.neutral;

  return (
    // 2. THE GLASSMORPHISM CONTAINER 
    // Uses the 'group' class so child elements react when you hover over the main card
    <div className={`group relative overflow-hidden bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${currentStyle.borderHover}`}>
      
      {/* 3. AMBIENT BACKGROUND GLOW */}
      {/* This creates a soft, colored light bleed from the top right corner that intensifies on hover */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${currentStyle.glow} rounded-full blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-100 opacity-60`}></div>

      <div className="relative z-10 flex items-start justify-between">
        
        {/* TEXT CONTENT */}
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            {title}
          </p>
          {/* Numbers get tighter tracking and a slightly bolder font to look like a real dashboard */}
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {amount}
          </p>
        </div>
        
        {/* 4. PREMIUM ICON WRAPPER */}
        {/* Added a subtle inner ring and rounded-xl (squircle) shape instead of a basic circle */}
        <div className={`p-3.5 rounded-xl ring-1 ring-inset ${currentStyle.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300 ease-out`}>
          <Icon className="w-6 h-6" />
        </div>

      </div>
    </div>
  );
}