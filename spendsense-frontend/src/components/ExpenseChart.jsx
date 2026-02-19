import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- 1. PREMIUM CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 p-4 rounded-xl shadow-2xl transition-all">
        <p className="font-bold text-gray-900 dark:text-white mb-1">
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

// 2. PASSED IN REFRESH TRIGGER
const ExpenseChart = ({ refreshTrigger }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/transactions/stats/chart')
            .then(response => {
                setData(response.data);
            })
            .catch(err => console.error("Error fetching chart data:", err));
            
    // 3. ADDED TO DEPENDENCIES: Now it updates instantly!
    }, [refreshTrigger]);

    // Modern vibrant colors
    const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];

    return (
        // 4. GLASSMORPHISM CONTAINER
        <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/5 h-96 flex flex-col transition-all duration-300">
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight mb-2">
                Expenses by Category
            </h3>

            {data.length > 0 ? (
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="totalAmount" 
                                nameKey="categoryName" 
                                stroke="none" 
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            
                            <Tooltip content={<CustomTooltip />} />
                            
                            <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                iconType="circle"
                                formatter={(value) => (
                                    <span className="text-gray-700 dark:text-gray-300 ml-1 font-medium">{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm">
                    <p>No expense data yet.</p>
                </div>
            )}
        </div>
    );
};

export default ExpenseChart;