import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

export default function TransactionForm({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Default to today
    category: 'Food', // Default category
    type: 'Expense' // Capitalized to match likely Backend Enum if needed, or keep as 'EXPENSE' based on your API
  });

  // Ensure these match your Backend Categories exactly
  const categories = ['Food', 'Rent', 'Utilities', 'Transport', 'Entertainment', 'Salary', 'Freelance', 'Shopping'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // NOTE: Ensure 'type' casing matches your backend (e.g., 'Expense' vs 'EXPENSE')
      await axios.post('http://localhost:8080/api/transactions', formData);
      onSave(); 
      onClose(); 
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Error saving transaction. Check console.");
    }
  };

  return (
    // 1. BACKDROP: Stays roughly the same, maybe slightly darker in dark mode
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
      
      {/* 2. MODAL CARD: bg-white -> dark:bg-dark-card */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">New Transaction</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Type Toggle */}
          <div className="flex bg-gray-100 dark:bg-slate-700/50 p-1 rounded-lg transition-colors">
            <button
              type="button"
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                formData.type === 'Expense' 
                  ? 'bg-white text-red-600 shadow-sm dark:bg-slate-600 dark:text-red-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setFormData({...formData, type: 'Expense'})}
            >
              Expense
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                formData.type === 'Income' 
                  ? 'bg-white text-green-600 shadow-sm dark:bg-slate-600 dark:text-green-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setFormData({...formData, type: 'Income'})}
            >
              Income
            </button>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Amount ($)</label>
              <input
                type="number"
                name="amount"
                required
                value={formData.amount}
                onChange={handleChange}
                // Dark mode inputs: dark background, light text, brand focus ring
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none 
                           bg-white dark:bg-slate-700 dark:text-white transition-colors"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none 
                           bg-white dark:bg-slate-700 dark:text-white dark:color-scheme-dark transition-colors"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-brand-500 
                         bg-white dark:bg-slate-700 dark:text-white transition-colors appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="dark:bg-slate-800">{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-brand-500 
                         bg-white dark:bg-slate-700 dark:text-white transition-colors"
              placeholder="e.g. Grocery shopping"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm mt-2"
          >
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
}