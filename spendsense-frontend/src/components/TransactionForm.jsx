import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, DollarSign, Calendar, Tag, AlignLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TransactionForm({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '', 
    type: 'Expense'
  });

  // --- THE UPGRADE: Store categories from the database ---
  const [dbCategories, setDbCategories] = useState([]);

  // 1. Fetch categories when the modal opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/categories');
        setDbCategories(response.data);
        
        // Set the initial default category to the first available Expense category
        const defaultExpenseCat = response.data.find(cat => cat.type === 'EXPENSE');
        if (defaultExpenseCat) {
          setFormData(prev => ({ ...prev, category: defaultExpenseCat.name }));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. Filter the dropdown choices based on what type is currently active
  const activeTypeUpper = formData.type.toUpperCase(); // 'EXPENSE' or 'INCOME'
  const availableCategories = dbCategories.filter(cat => cat.type === activeTypeUpper);

  // 3. Smart Type Switching: Prevent invalid category selections!
  const handleTypeChange = (newType) => {
    const newTypeUpper = newType.toUpperCase();
    const firstValidCategory = dbCategories.find(cat => cat.type === newTypeUpper)?.name || '';
    
    setFormData({ 
      ...formData, 
      type: newType, 
      category: firstValidCategory // Instantly snap the dropdown to a valid choice
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Saving transaction...");
    try {
      await axios.post('http://localhost:8080/api/transactions', formData);
      toast.success("Transaction added successfully!", { id: loadingToast });
      onSave(); 
      onClose(); 
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error("Failed to save transaction.", { id: loadingToast });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20 dark:border-white/10 transition-colors duration-300 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/5">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">New Transaction</h3>
          <button onClick={onClose} className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition-all active:scale-95">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* PREMIUM TYPE TOGGLE */}
          <div className="flex bg-gray-100/80 dark:bg-black/50 p-1.5 rounded-2xl border border-gray-200 dark:border-white/5 backdrop-blur-sm">
            <button
              type="button"
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                formData.type === 'Expense' 
                  ? 'bg-white dark:bg-[#27272a] text-rose-600 dark:text-rose-400 shadow-md ring-1 ring-black/5 dark:ring-white/10' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => handleTypeChange('Expense')} // Updated onClick!
            >
              Expense
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                formData.type === 'Income' 
                  ? 'bg-white dark:bg-[#27272a] text-emerald-600 dark:text-emerald-400 shadow-md ring-1 ring-black/5 dark:ring-white/10' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => handleTypeChange('Income')} // Updated onClick!
            >
              Income
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="number"
                  name="amount"
                  required
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white dark:[color-scheme:dark] outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all cursor-pointer font-medium"
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC CATEGORY DROPDOWN */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Category</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all appearance-none font-medium cursor-pointer"
                >
                {/* Dynamically mapping the filtered categories from the database! */}
                {availableCategories.map(cat => (
                    <option key={cat.id} value={cat.name} className="bg-white dark:bg-gray-800">
                      {cat.name}
                    </option>
                ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Description</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AlignLeft className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
                placeholder="e.g. Weekly groceries"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-brand-500/30 active:scale-95 flex justify-center items-center gap-2"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}