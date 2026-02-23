import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

// --- PREMIUM CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="font-bold text-gray-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <p className="text-gray-600 dark:text-gray-300">
              {/* THE FIX: Force it to be a Number before calling toFixed! */}
              <span className="font-medium">{entry.name}:</span> <span className="text-gray-900 dark:text-white font-semibold">${Number(entry.value).toFixed(2)}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- THE FIX: Added 'filters' to the props ---
export default function DashboardCharts({ refreshTrigger, filters }) {
  const [barData, setBarData] = useState([]); 
  const [pieData, setPieData] = useState([]); 

  useEffect(() => {
    // 1. Prepare the date parameters safely
    const params = filters ? {
      startDate: filters.startDate,
      endDate: filters.endDate
    } : {};

    // 2. Fetch Monthly Trends (Passing params!)
    axios.get('http://localhost:8080/api/transactions/stats/monthly', { params })
      .then(res => setBarData(res.data))
      .catch(err => {
        console.error("Error fetching bar chart data:", err);
        setBarData([
            { month: 'Jan', income: 0, expense: 0 },
            { month: 'Feb', income: 0, expense: 0 }
        ]);
      });

    // 3. Fetch Expense Breakdown (Passing params!)
    axios.get('http://localhost:8080/api/transactions/stats/chart', { params })
      .then(res => setPieData(res.data))
      .catch(err => console.error("Error fetching pie chart data:", err));
      
  // 4. THE FIX: Added 'filters' to the dependency array so it refetches when dates change!
  }, [refreshTrigger, filters]); 

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* CHART 1: MONTHLY TRENDS */}
      <div className="lg:col-span-2 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/5 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight mb-6">Financial Trends</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.15} />
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
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(156, 163, 175, 0.1)'}} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
              
              <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} name="Income" barSize={24} />
              <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} name="Expense" barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: EXPENSE BREAKDOWN */}
      {/* --- CHART 2: EXPENSE BREAKDOWN --- */}
      <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/5 transition-colors flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight mb-2">Where money goes</h3>
        
        {/* THE FIX 1: Increased min-height from 18rem to 22rem so the Legend fits! */}
        <div className="flex-1 w-full min-h-[22rem]"> 
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%" // Lifted the pie up slightly to make room for the legend
                  
                  // THE FIX 2: Switched from fixed pixels to percentages!
                  innerRadius="55%" 
                  outerRadius="75%" 
                  
                  paddingAngle={5}
                  dataKey="totalAmount" 
                  nameKey="categoryName" 
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                
                {/* THE FIX 3: Made the legend text smaller and gave it padding */}
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle" 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                <p>No expense data yet.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}