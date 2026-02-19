import React, { useState } from 'react';
import axios from 'axios';
import { FileDown, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ExportTransaction = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if(!startDate || !endDate) {
            // Replaced blocky alerts with sleek toast notifications
            toast.error("Please select both start and end dates.");
            return;
        }

        setLoading(true);
        // Optional: A loading toast so the user knows it's working
        const toastId = toast.loading("Preparing your export...");

        try {
            const response = await axios.get('http://localhost:8080/api/transactions/export', {
                params: { startDate, endDate },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `transactions_${startDate}_to_${endDate}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            // Success toast!
            toast.success("Export successful!", { id: toastId });
            
            // Clear inputs after successful download
            setStartDate('');
            setEndDate('');
        } catch (error) {
            console.error("Error downloading file:", error);
            toast.error("Failed to download export.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        // 1. GLASSMORPHISM CONTAINER
        <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/5 w-full transition-all duration-300">
            
            {/* 2. PREMIUM HEADER with Icon */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-100 dark:bg-brand-500/20 rounded-lg text-brand-600 dark:text-brand-400">
                    <FileDown className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                    Export Data
                </h3>
            </div>
            
            <div className="flex flex-col gap-4">
                {/* 3. UPGRADED INPUTS: Match the DateFilter styling exactly */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From Date</label>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white dark:[color-scheme:dark] outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all cursor-pointer" 
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To Date</label>
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white dark:[color-scheme:dark] outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all cursor-pointer"
                    />
                </div>

                {/* 4. PREMIUM BUTTON with Spinners and subtle hover states */}
                <button 
                    onClick={handleDownload} 
                    disabled={loading}
                    className={`mt-2 flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 active:scale-95
                        ${loading 
                            ? 'bg-gray-100 dark:bg-white/5 cursor-not-allowed text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-white/5' 
                            : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg hover:shadow-brand-500/25 border border-transparent'
                        }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Exporting...
                        </>
                    ) : (
                        'Download CSV'
                    )}
                </button>
            </div>
        </div>
    );
};

export default ExportTransaction;