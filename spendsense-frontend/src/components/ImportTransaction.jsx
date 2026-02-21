import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast'; 

// 1. ADDED PROPS: userTier and onRequirePro
const ImportTransaction = ({ onImportSuccess, userTier = 'BASIC', onRequirePro }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        // 2. THE PAYWALL INTERCEPTOR
        if (userTier === 'BASIC') {
            onRequirePro();
            return;
        }

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        const toastId = toast.loading("Uploading statement..."); 

        try {
            await axios.post('http://localhost:8080/api/transactions/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            toast.success("Import Successful!", { id: toastId });
            setFile(null);
            document.getElementById('file-upload').value = '';
            
            if (onImportSuccess) onImportSuccess(); 
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload file.", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    // 3. SMART DISABLED STATE: Only disable if they are Premium and haven't picked a file
    const isButtonDisabled = userTier !== 'BASIC' && (!file || uploading);

    return (
        <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/5 w-full mt-6 transition-all duration-300">
            
            {/* PREMIUM HEADER */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-100 dark:bg-brand-500/20 rounded-lg text-brand-600 dark:text-brand-400">
                    <FileText className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                        Import Data
                    </h3>
                    {/* 4. THE PRO BADGE */}
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-md shadow-orange-500/20">
                        Pro
                    </span>
                </div>
            </div>
            
            <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Upload a CSV file <span className="font-semibold text-gray-800 dark:text-gray-300">(Date, Description, Amount)</span> to auto-add transactions.
                </p>

                <div className="relative mt-2">
                    <input 
                        id="file-upload"
                        type="file" 
                        accept=".csv"
                        onChange={handleFileChange}
                        // Optionally dim the input slightly if they are a Basic user
                        className={`block w-full text-sm text-gray-600 dark:text-gray-400
                          file:mr-4 file:py-2.5 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-brand-50 file:text-brand-700
                          hover:file:bg-brand-100
                          dark:file:bg-white/10 dark:file:text-white
                          dark:hover:file:bg-white/20
                          file:transition-all cursor-pointer outline-none
                          ${userTier === 'BASIC' ? 'opacity-70' : ''}
                        `}
                    />
                </div>

                {/* 5. DYNAMIC BUTTON STYLING */}
                <button 
                    onClick={handleUpload} 
                    disabled={isButtonDisabled}
                    className={`mt-2 flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 active:scale-95
                        ${isButtonDisabled
                            ? 'bg-gray-100 dark:bg-white/5 cursor-not-allowed text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-white/5' 
                            : userTier === 'BASIC'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg hover:shadow-orange-500/25 border border-transparent'
                                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg hover:shadow-brand-500/25 border border-transparent'
                        }`}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : userTier === 'BASIC' ? (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Unlock Import
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            Upload CSV
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ImportTransaction;