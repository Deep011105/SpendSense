import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import StatCard from './components/StatCard';
import TransactionTable from './components/TransactionTable';
import TransactionForm from './components/TransactionForm';
import ExportTransaction from './components/ExportTransaction';
import ImportTransaction from './components/ImportTransaction';
import DashboardCharts from './components/DashboardCharts'; // Make sure this is imported!?
import DateFilter from './components/DateFilter'; // Check file name: DateFilter.jsx vs DataFilter
import { DollarSign, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. MOVED TO TOP: Define filters BEFORE using them
  const [filters, setFilters] = useState({
    // Default: Last 30 Days
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });

  // 2. FETCH STATS (Now safe to use 'filters')
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

  // 3. USE EFFECT: Run on Mount AND when filters change
  useEffect(() => {
    fetchStats();
  }, [filters]); 

  // (Removed the duplicate empty useEffect, it's not needed)

  const handleTransactionSaved = () => {
    setIsModalOpen(false);
    fetchStats(); // Update stats immediately
    window.location.reload(); // Reloads table & charts
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HEADER & ADD BUTTON */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Dashboard</h1>
            <p className="text-gray-500 dark:text-dark-muted">Overview of your personal finances.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>

        {/* DATE FILTER */}
        <DateFilter filters={filters} setFilters={setFilters} />

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Balance" 
            amount={`$${stats.balance.toFixed(2)}`} 
            Icon={DollarSign} 
            type="neutral" 
          />
          <StatCard 
            title="Income" 
            amount={`$${stats.totalIncome.toFixed(2)}`} 
            Icon={TrendingUp} 
            type="success" 
          />
          <StatCard 
            title="Expenses" 
            amount={`$${stats.totalExpense.toFixed(2)}`} 
            Icon={TrendingDown} 
            type="danger" 
          />
        </div>

        {/* CHARTS SECTION (Added back in) */}
        <DashboardCharts />

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-6">
             <ExportTransaction />
             <ImportTransaction onImportSuccess={() => window.location.reload()} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
               <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text">Recent Transactions</h2>
               </div>
               {/* Pass filters to table */}
               <TransactionTable filters={filters} />
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

export default App;