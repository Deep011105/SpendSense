import React from 'react';
import { Calendar } from 'lucide-react';

export default function DateFilter({ filters, setFilters }) {
    
    // Helper to quickly set ranges
    const setRange = (days) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        
        setFilters({
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        });
    };

    const setThisMonth = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1); // 1st of month
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last of month
        
        setFilters({
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        });
    };

    return (
        // 1. GLASSMORPHISM WRAPPER: Matches the charts and tables perfectly
        <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-white/5 flex flex-wrap items-center gap-4 transition-colors mb-8">
            
            {/* 2. GLOWING ICON: Adds a touch of premium feel to the label */}
            <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-100 dark:bg-brand-500/20 rounded-lg text-brand-600 dark:text-brand-400">
                    <Calendar className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">Timeframe</span>
            </div>

            {/* 3. QUICK BUTTONS: Upgraded to sleek pills with subtle hover borders */}
            <div className="flex flex-wrap gap-2">
                <button onClick={setThisMonth} className="px-4 py-2 text-xs font-semibold rounded-full bg-gray-100/80 dark:bg-white/5 hover:bg-brand-50 dark:hover:bg-brand-500/20 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-all border border-transparent hover:border-brand-200 dark:hover:border-brand-500/30">
                    This Month
                </button>
                <button onClick={() => setRange(30)} className="px-4 py-2 text-xs font-semibold rounded-full bg-gray-100/80 dark:bg-white/5 hover:bg-brand-50 dark:hover:bg-brand-500/20 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-all border border-transparent hover:border-brand-200 dark:hover:border-brand-500/30">
                    Last 30 Days
                </button>
                <button onClick={() => setRange(90)} className="px-4 py-2 text-xs font-semibold rounded-full bg-gray-100/80 dark:bg-white/5 hover:bg-brand-50 dark:hover:bg-brand-500/20 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-all border border-transparent hover:border-brand-200 dark:hover:border-brand-500/30">
                    Last 3 Months
                </button>
            </div>

            {/* DIVIDER */}
            <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden lg:block"></div>

            {/* 4. PREMIUM INPUTS: Smoother borders, focus rings, and dark mode calendar icon support */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <input 
                    type="date" 
                    value={filters.startDate}
                    onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                    className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white dark:[color-scheme:dark] outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all cursor-pointer"
                />
                <span className="text-gray-400 font-medium">to</span>
                <input 
                    type="date" 
                    value={filters.endDate}
                    onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                    className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white dark:[color-scheme:dark] outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all cursor-pointer"
                />
            </div>
        </div>
    );
}