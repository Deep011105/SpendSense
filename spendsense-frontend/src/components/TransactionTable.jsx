import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

export default function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/transactions');
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await axios.delete(`http://localhost:8080/api/transactions/${id}`);
        setTransactions(transactions.filter(t => t.id !== id));
      } catch (error) {
        alert("Failed to delete transaction");
      }
    }
  };

  if (loading) {
    // UPDATED: Added dark:text-gray-400
    return <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10">
        {/* UPDATED: Added dark text classes */}
        <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">Click "Add Transaction" to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* UPDATED: Divide color for dark mode */}
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        
        {/* UPDATED: Header background */}
        <thead className="bg-gray-50 dark:bg-slate-700/50">
          <tr>
            {/* UPDATED: Text colors for headers (Gray-500 -> Gray-400) */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>

        {/* UPDATED: Body background and divide color */}
        <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
              
              {/* Date: Dark text */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {transaction.date}
              </td>
              
              {/* Description: White text in dark mode */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {transaction.description}
              </td>
              
              {/* Category: Darker badge for dark mode */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  {transaction.category?.name || 'Uncategorized'}
                </span>
              </td>
              
              {/* Amount: Adjusted Green/Red for better contrast on dark (using 400 shade) */}
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                transaction.type === 'INCOME' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {transaction.type === 'INCOME' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </td>

              {/* Delete Button */}
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
  );
}