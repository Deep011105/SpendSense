import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import StatCard from './components/StatCard';
import TransactionTable from './components/TransactionTable';
import TransactionForm from './components/TransactionForm';
import ExportTransaction from './components/ExportTransaction';
import { DollarSign, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import ExpenseChart from './components/ExpenseChart';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/transactions/stats');
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleTransactionSaved = () => {
    setIsModalOpen(false);
    window.location.reload(); 
  };

  return (
    // 1. BACKGROUND: Changes from gray-50 to dark-bg
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HEADER & ADD BUTTON */}
        <div className="flex justify-between items-center mb-8">
          <div>
            {/* 2. TEXT: Changes from gray-900 to dark-text (white) */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Dashboard</h1>
            <p className="text-gray-500 dark:text-dark-muted">Overview of your personal finances.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            // 3. BUTTON: Uses our custom 'brand' color
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>

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

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-6">
             <ExportTransaction />
             <ExpenseChart />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-3">
            {/* 4. CARD: Changes from bg-white to bg-dark-card */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
               <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text">Recent Transactions</h2>
               </div>
               <TransactionTable />
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