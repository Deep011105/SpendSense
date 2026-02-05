import React, { useState } from 'react';
import axios from 'axios';

const ExportTransaction = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if(!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }

        setLoading(true);
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
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("Failed to download.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // 1. CONTAINER: bg-white -> dark:bg-dark-card, border colors
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 max-w-md transition-colors">
            
            {/* 2. HEADING: text-gray-800 -> dark:text-dark-text */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text mb-4">
                Export Data
            </h3>
            
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    {/* 3. LABELS: text-gray-600 -> dark:text-gray-400 */}
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">From:</label>
                    
                    {/* 4. INPUTS: Added dark background, lighter border, and white text */}
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent 
                                   bg-white dark:bg-slate-700 dark:text-white dark:color-scheme-dark" 
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">To:</label>
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent 
                                   bg-white dark:bg-slate-700 dark:text-white dark:color-scheme-dark"
                    />
                </div>

                <button 
                    onClick={handleDownload} 
                    disabled={loading}
                    // 5. BUTTON: Updated to use brand colors
                    className={`w-full py-2 px-4 rounded font-semibold transition duration-200 
                        ${loading 
                            ? 'bg-blue-300 dark:bg-blue-900 cursor-not-allowed text-white' 
                            : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm'
                        }`}
                >
                    {loading ? 'Downloading...' : 'Download CSV'}
                </button>
            </div>
        </div>
    );
};

export default ExportTransaction;