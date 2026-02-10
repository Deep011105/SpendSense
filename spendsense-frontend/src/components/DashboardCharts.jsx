import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

// --- CUSTOM TOOLTIP COMPONENT ---
// This ensures the tooltip looks good in Dark Mode (White text on Dark Card)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 p-3 rounded-lg shadow-xl">
        <p className="font-bold text-gray-800 dark:text-white mb-1">{label}</p>
        <p className="text-brand-600 dark:text-brand-400 font-medium">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardCharts() {
  const [barData, setBarData] = useState([]); // For Monthly Trends
  const [pieData, setPieData] = useState([]); // For Expense Categories

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    // 1. Fetch Monthly Trends (Income vs Expense)
    axios.get('http://localhost:8080/api/transactions/stats/monthly')
      .then(res => setBarData(res.data))
      .catch(err => {
        console.error("Error fetching bar chart data:", err);
        // Fallback/Demo data so the chart doesn't look broken if backend is empty
        setBarData([
            { month: 'Jan', income: 0, expense: 0 },
            { month: 'Feb', income: 0, expense: 0 }
        ]);
      });

    // 2. Fetch Expense Breakdown (Pie Chart)
    axios.get('http://localhost:8080/api/transactions/stats/chart')
      .then(res => setPieData(res.data))
      .catch(err => console.error("Error fetching pie chart data:", err));
  }, []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* --- CHART 1: MONTHLY TRENDS (Bar Chart) --- */}
      <div className="lg:col-span-2 bg-white dark:bg-dark-card p-6 rounded-xl shadow border border-gray-100 dark:border-gray-800 transition-colors">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Financial Trends</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.2} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 12}} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 12}} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} name="Income" barSize={30} />
              <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} name="Expense" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- CHART 2: EXPENSE BREAKDOWN (Pie Chart) --- */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow border border-gray-100 dark:border-gray-800 transition-colors">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Where money goes?</h3>
        <div className="h-72 w-full">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="totalAmount"  // Matches your DTO
                  nameKey="categoryName" // Matches your DTO
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                <p>No expense data yet</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}