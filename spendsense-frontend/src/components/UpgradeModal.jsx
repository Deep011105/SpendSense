import React from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UpgradeModal({ isOpen, onClose, onUpgrade }) {
  if (!isOpen) return null;

  const handleFakeUpgrade = () => {
    const toastId = toast.loading("Processing upgrade...");
    setTimeout(() => {
      toast.success("Welcome to SpendSense PRO!", { id: toastId });
      onUpgrade(); // This will flip their tier to 'PREMIUM'
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      
      {/* Premium Glassmorphism Card */}
      <div className="relative bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-amber-200/50 dark:border-amber-500/20">
        
        {/* Ambient Gold Glow */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-amber-500/20 dark:bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Header */}
        <div className="relative p-6 text-center border-b border-gray-100 dark:border-white/5">
          <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Unlock SpendSense <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">PRO</span>
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Take your financial tracking to the next level with powerful power-user features.
          </p>
        </div>

        {/* Feature List */}
        <div className="p-6 space-y-4">
          {[
            'Unlimited CSV Data Exports',
            'Bulk Bank Statement Imports',
            'Advanced Custom Categories',
            'Priority Customer Support'
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="p-6 pt-2 bg-gray-50/50 dark:bg-black/20">
          <button 
            onClick={handleFakeUpgrade}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 active:scale-95 flex items-center justify-center gap-2"
          >
            Upgrade Now (Demo)
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">
            This is a portfolio demo. No real charge will be made.
          </p>
        </div>

      </div>
    </div>
  );
}