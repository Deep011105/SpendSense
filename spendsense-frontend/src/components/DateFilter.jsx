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
        <div className="bg-white dark:bg-dark-card p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-4 transition-colors mb-6">
            
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-semibold">Filter:</span>
            </div>

            {/* Quick Buttons */}
            <div className="flex gap-2">
                <button onClick={setThisMonth} className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-900 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    This Month
                </button>
                <button onClick={() => setRange(30)} className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-900 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    Last 30 Days
                </button>
                <button onClick={() => setRange(90)} className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-900 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    Last 3 Months
                </button>
            </div>

            {/* DIVIDER: Updated to gray-800 for true black theme */}
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>

            {/* Manual Pickers */}
            <div className="flex items-center gap-2">
                <input 
                    type="date" 
                    value={filters.startDate}
                    onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                    // INPUTS: Updated to dark:bg-gray-800 to match other forms
                    className="text-xs p-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white dark:color-scheme-dark outline-none focus:border-brand-500 transition-colors"
                />
                <span className="text-gray-400">-</span>
                <input 
                    type="date" 
                    value={filters.endDate}
                    onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                    className="text-xs p-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white dark:color-scheme-dark outline-none focus:border-brand-500 transition-colors"
                />
            </div>
        </div>
    );
}