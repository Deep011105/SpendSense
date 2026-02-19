import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, ChevronLeft, ChevronRight, Loader2, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

// 1. ADDED refreshTrigger TO PROPS
export default function TransactionTable({ filters, refreshTrigger }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 8; // Slightly smaller page size to fit the aesthetic better

  // 2. TRIGGER UPDATE: Added refreshTrigger to dependencies
  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, filters, refreshTrigger]);

  const fetchTransactions = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/transactions`, {
          params: {
              page: page,
              size: pageSize,
              startDate: filters.startDate, 
              endDate: filters.endDate     
          }
      });
      
      setTransactions(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      const toastId = toast.loading("Deleting...");
      try {
        await axios.delete(`http://localhost:8080/api/transactions/${id}`);
        toast.success("Transaction deleted!", { id: toastId }); 
        fetchTransactions(currentPage);
      } catch (error) {
        toast.error("Failed to delete.", { id: toastId }); 
      }
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          
          {/* 3. PREMIUM HEADER: Glassy, no heavy backgrounds, uppercase tracking */}
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4 whitespace-nowrap">Date</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 whitespace-nowrap">Category</th>
              <th className="px-6 py-4 text-right whitespace-nowrap">Amount</th>
              <th className="px-6 py-4 text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {loading ? (
               // SKELETON LOADER
               <tr>
                 <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                      <Loader2 className="w-8 h-8 animate-spin mb-2 text-brand-500" />
                      <p className="text-sm font-medium">Loading ledger...</p>
                    </div>
                 </td>
               </tr>
            ) : transactions.length === 0 ? (
               // EMPTY STATE
               <tr>
                 <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                      <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-full mb-3">
                        <Receipt className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="text-base font-medium text-gray-600 dark:text-gray-300">No transactions found</p>
                      <p className="text-sm mt-1">Try adjusting your date filters or add a new entry.</p>
                    </div>
                 </td>
               </tr>
            ) : (
              transactions.map((transaction) => (
                // 4. GLASSY ROWS: Subtle hover effect without turning completely gray
                <tr key={transaction.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* 5. SLEEK BADGE: Rounded full, subtle transparency */}
                    <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 border border-gray-200 dark:border-white/5">
                      {transaction.category?.name || transaction.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold tracking-tight ${
                    transaction.type === 'INCOME' 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {transaction.type === 'INCOME' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {/* 6. MODERN DELETE BUTTON: Fades in/out on row hover, circular background */}
                    <button 
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 rounded-full text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 opacity-50 group-hover:opacity-100 transition-all active:scale-95 mx-auto flex"
                      title="Delete Transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {/* 7. GLASSY PAGINATION: Blends perfectly with the bottom of the card */}
      {!loading && transactions.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-white/5 px-6 py-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="ml-3 px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
            >
              Next
            </button>
          </div>

          <div className="hidden sm:flex flex-1 items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage + 1}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages || 1}</span>
              </p>
            </div>
            <div>
              <nav className="inline-flex gap-2" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="p-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 dark:hover:border-brand-500/30 dark:hover:text-brand-400 dark:hover:bg-brand-500/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/10 transition-all"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 dark:hover:border-brand-500/30 dark:hover:text-brand-400 dark:hover:bg-brand-500/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/10 transition-all"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}