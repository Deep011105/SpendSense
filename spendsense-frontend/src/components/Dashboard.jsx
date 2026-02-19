import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import StatCard from './StatCard';
import TransactionTable from './TransactionTable';
import TransactionForm from './TransactionForm';
import ExportTransaction from './ExportTransaction';
import ImportTransaction from './ImportTransaction';
import DashboardCharts from './DashboardCharts';
import DateFilter from './DateFilter';
import { DollarSign, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 1. BROUGHT BACK REFRESH TRIGGER: No more clunky page reloads!
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [filters, setFilters] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/transactions/stats', {
        params: {
          startDate: filters.startDate,
          endDate: filters.endDate
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // 2. TRIGGER UPDATE: Added refreshTrigger to dependency array
  useEffect(() => {
    fetchStats();
  }, [filters, refreshTrigger]); 

  // 3. SMOOTH SAVE: Just increments the trigger to silently update children
  const handleTransactionSaved = () => {
    setIsModalOpen(false);
    setRefreshTrigger(prev => prev + 1); 
  };

  return (
    // 4. BACKGROUND UPGRADE: Matched the Landing Page 'True Black' and off-white
    <div className="min-h-screen relative bg-[#fafafa] dark:bg-black transition-colors duration-300 font-sans selection:bg-brand-500/30">
      
      {/* SUBTLE AMBIENT GLOW: Just enough to look premium, not enough to distract from data */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden z-0 opacity-50 dark:opacity-20">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-brand-500/20 rounded-full blur-[120px]"></div>
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181b', // Darker, sleeker toast background
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
      
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        
        {/* HEADER & ADD BUTTON UPGRADE */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your financial overview at a glance.
            </p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            // Premium Button Styling: Pill shape, glowing shadow, smooth click animation
            className="group flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-brand-500/30 active:scale-95"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Add Transaction
          </button>
        </div>

        <DateFilter filters={filters} setFilters={setFilters} />

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Balance" amount={`$${stats.balance.toFixed(2)}`} Icon={DollarSign} type="neutral" />
          <StatCard title="Income" amount={`$${stats.totalIncome.toFixed(2)}`} Icon={TrendingUp} type="success" />
          <StatCard title="Expenses" amount={`$${stats.totalExpense.toFixed(2)}`} Icon={TrendingDown} type="danger" />
        </div>

        {/* CHARTS SECTION */}
        {/* Pass refreshTrigger down! */}
        <DashboardCharts refreshTrigger={refreshTrigger} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
             <ExportTransaction />
             {/* Use the silent update handler instead of window reload */}
             <ImportTransaction onImportSuccess={handleTransactionSaved} />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-white/5 overflow-hidden transition-colors">
               <div className="p-6 border-b border-gray-200 dark:border-white/5">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Recent Transactions</h2>
               </div>
               {/* Pass both filters and refreshTrigger to table */}
               <TransactionTable filters={filters} refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>

      </main>

      {isModalOpen && (
        <TransactionForm 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleTransactionSaved} 
        />
      )}

    </div>
  );
}

export default Dashboard;