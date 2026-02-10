import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- 1. CUSTOM TOOLTIP COMPONENT ---
// This allows us to use Tailwind classes (dark:bg-...) directly!
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-xl transition-colors duration-200">
        <p className="font-bold text-gray-800 dark:text-white mb-1">
          {payload[0].name}
        </p>
        <p className="text-brand-600 dark:text-brand-400 font-medium">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const ExpenseChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Use your real endpoint here
        axios.get('http://localhost:8080/api/transactions/stats/chart')
            .then(response => {
                // Ensure data structure matches { name: 'Food', value: 100 }
                // If your API returns different keys, map them here:
                // const formattedData = response.data.map(item => ({ name: item.categoryName, value: item.totalAmount }));
                setData(response.data);
            })
            .catch(err => console.error("Error fetching chart data:", err));
    }, []);

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

    return (
        // 2. CONTAINER: Updated to use dark:bg-dark-card (#121212)
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 h-96 flex flex-col items-center justify-center transition-all duration-300">
            
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 w-full text-left">
                Expenses by Category
            </h3>

            {data.length > 0 ? (
                // 3. WRAPPER DIV: Fixes the "width=-1" error by ensuring parent has size
                <div className="w-full h-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="totalAmount" // Ensure this matches your API
                                nameKey="categoryName" // Ensure this matches your API
                                stroke="none" 
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            
                            {/* 4. USE CUSTOM TOOLTIP */}
                            <Tooltip content={<CustomTooltip />} />
                            
                            {/* 5. LEGEND: Wrapper Style helps force color inheritance */}
                            <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                iconType="circle"
                                formatter={(value) => (
                                    <span className="text-gray-600 dark:text-gray-300 ml-1">{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                    <p>No expense data yet.</p>
                </div>
            )}
        </div>
    );
};

export default ExpenseChart;