import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpenseChart = () => {
    const [data, setData] = useState([]);
    
    // Helper to detect if dark mode is active (for the Tooltip inline style)
    const isDarkMode = document.documentElement.classList.contains('dark');

    useEffect(() => {
        axios.get('http://localhost:8080/api/transactions/stats/chart')
            .then(response => {
                setData(response.data);
            })
            .catch(err => console.error("Error fetching chart data:", err));
    }, []);

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

    return (
        // 1. UPDATE CONTAINER: bg-white -> dark:bg-dark-card, border colors
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700 h-96 flex flex-col items-center justify-center transition-colors">
            
            {/* 2. UPDATE HEADING: text-gray-800 -> dark:text-dark-text */}
            <h3 className="text-lg font-bold text-gray-800 dark:text-dark-text mb-4 w-full text-left">
                Expenses by Category
            </h3>

            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="totalAmount"
                            nameKey="categoryName"
                            stroke="none" // Removes the white outline around slices
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value) => `$${value.toFixed(2)}`}
                            // 3. UPDATE TOOLTIP: styling based on mode (CSS classes don't work well inside Recharts)
                            contentStyle={{ 
                                backgroundColor: '#1e293b', // Matches dark-card
                                borderColor: '#374151', 
                                borderRadius: '8px', 
                                color: '#f8fafc' 
                            }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36}
                            // Wrapper style to force legend text color if needed, 
                            // though usually Recharts inherits well.
                        />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-400 dark:text-gray-500">No expense data to display</p>
            )}
        </div>
    );
};

export default ExpenseChart;