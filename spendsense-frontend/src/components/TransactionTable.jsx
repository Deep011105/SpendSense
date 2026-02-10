import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TransactionTable({ filters }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, filters]);

  const fetchTransactions = async (page) => {
    setLoading(true);
    try {
      // Pass the startDate and endDate to the API
      const response = await axios.get(`http://localhost:8080/api/transactions`, {
          params: {
              page: page,
              size: pageSize,
              startDate: filters.startDate, // <--- Use Filter
              endDate: filters.endDate     // <--- Use Filter
          }
      });
      
      setTransactions(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // We keep window.confirm for safety, but replace the success message
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await axios.delete(`http://localhost:8080/api/transactions/${id}`);
        toast.success("Transaction deleted!"); // <--- Nice popup
        fetchTransactions(currentPage);
      } catch (error) {
        toast.error("Failed to delete."); // <--- Nice popup
      }
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center py-10 text-gray-500 dark:text-gray-400">
            <Loader className="w-6 h-6 animate-spin mr-2" />
            Loading transactions...
        </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        {/* 1. TABLE DIVIDER: Changed dark:divide-gray-700 -> dark:divide-gray-800 */}
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          
          {/* 2. HEADER BG: Changed slate-700/50 -> gray-900 (Neutral Dark) */}
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          
          <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-800">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {transaction.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {/* 3. BADGE: Changed dark:bg-blue-900/50 -> dark:bg-blue-500/20 (Subtler) */}
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
                    {transaction.category?.name || 'Uncategorized'}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                  transaction.type === 'INCOME' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'INCOME' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {/* 4. PAGINATION BG & BORDER: Neutral Grays */}
      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-card px-4 py-3 sm:px-6">
        
        {/* Mobile View */}
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:flex flex-1 items-center justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Page <span className="font-medium">{currentPage + 1}</span> of <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                // 5. BUTTON STYLES: dark:ring-gray-700, dark:hover:bg-gray-800
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              
              <button
                aria-current="page"
                className="relative z-10 inline-flex items-center bg-brand-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {currentPage + 1}
              </button>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}