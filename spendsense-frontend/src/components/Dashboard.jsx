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
import UpgradeModal from './UpgradeModal'; 
import { DollarSign, TrendingUp, TrendingDown, Plus } from 'lucide-react';

// Notice: Removed the { Toaster } import!

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // --- THE UPGRADE: Read the tier from local storage so Premium users stay Premium! ---
  const [userTier, setUserTier] = useState(localStorage.getItem('userTier') || 'BASIC'); 
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

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

  useEffect(() => {
    fetchStats();
  }, [filters, refreshTrigger]); 

  const handleTransactionSaved = () => {
    setIsModalOpen(false);
    setRefreshTrigger(prev => prev + 1); 
  };

  // When the user upgrades via the demo modal, save it to local storage too
  // --- THE NEW DATABASE-LINKED UPGRADE FUNCTION ---
  const handleUpgrade = async () => {
    try {
      // 1. Tell the Spring Boot database to upgrade this user
      await axios.put('http://localhost:8080/api/users/upgrade');
      
      // 2. Update the React frontend state
      setUserTier('PREMIUM');
      localStorage.setItem('userTier', 'PREMIUM');
      
      // (Optional: You could even fetch a fresh JWT token here in a real app, 
      // but for this portfolio project, updating the state is perfectly fine!)
    } catch (error) {
      console.error("Failed to upgrade user in database:", error);
      toast.error("Upgrade failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative bg-[#fafafa] dark:bg-black transition-colors duration-300 font-sans selection:bg-brand-500/30">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden z-0 opacity-50 dark:opacity-20">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-brand-500/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Notice: The <Toaster /> component has been completely removed from here! */}
      
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        
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
            className="group flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-brand-500/30 active:scale-95"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Add Transaction
          </button>
        </div>

        <DateFilter filters={filters} setFilters={setFilters} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Balance" amount={`$${stats.balance.toFixed(2)}`} Icon={DollarSign} type="neutral" />
          <StatCard title="Income" amount={`$${stats.totalIncome.toFixed(2)}`} Icon={TrendingUp} type="success" />
          <StatCard title="Expenses" amount={`$${stats.totalExpense.toFixed(2)}`} Icon={TrendingDown} type="danger" />
        </div>

        <DashboardCharts refreshTrigger={refreshTrigger} filters={filters} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
             <ExportTransaction 
                userTier={userTier} 
                onRequirePro={() => setIsUpgradeModalOpen(true)} 
             />
             <ImportTransaction 
                onImportSuccess={handleTransactionSaved} 
                userTier={userTier} 
                onRequirePro={() => setIsUpgradeModalOpen(true)} 
             />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-white/5 overflow-hidden transition-colors">
               <div className="p-6 border-b border-gray-200 dark:border-white/5">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Recent Transactions</h2>
               </div>
               <TransactionTable filters={filters} refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>

      </main>

      {/* MODALS */}
      {isModalOpen && (
        <TransactionForm 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleTransactionSaved} 
        />
      )}

      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
        onUpgrade={handleUpgrade} 
      />

    </div>
  );
}

export default Dashboard;