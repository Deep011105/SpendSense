import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast'; 

const ImportTransaction = ({ onImportSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        
        // We can capture the ID of the loading toast to update it later
        const toastId = toast.loading("Uploading statement..."); 

        try {
            await axios.post('http://localhost:8080/api/transactions/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Success! Replace the loading toast with a success message
            toast.success("Import Successful!", { id: toastId });
            
            setFile(null);
            // Reset the file input visually
            document.getElementById('file-upload').value = '';
            
            if (onImportSuccess) onImportSuccess(); 
        } catch (error) {
            console.error(error);
            // Replace the loading toast with an error message
            toast.error("Failed to upload file.", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    return (
        // 1. GLASSMORPHISM CONTAINER: Matches Export component exactly
        <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/5 w-full transition-all duration-300">
            
            {/* 2. PREMIUM HEADER with Icon */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-100 dark:bg-brand-500/20 rounded-lg text-brand-600 dark:text-brand-400">
                    <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                    Import Data
                </h3>
            </div>
            
            <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Upload a CSV file <span className="font-semibold text-gray-800 dark:text-gray-300">(Date, Description, Amount)</span> to auto-add transactions.
                </p>

                {/* 3. MODERN FILE INPUT: Styled the 'Choose File' button as a rounded pill */}
                <div className="relative mt-2">
                    <input 
                        id="file-upload"
                        type="file" 
                        accept=".csv"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-600 dark:text-gray-400
                          file:mr-4 file:py-2.5 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-brand-50 file:text-brand-700
                          hover:file:bg-brand-100
                          dark:file:bg-white/10 dark:file:text-white
                          dark:hover:file:bg-white/20
                          file:transition-all file:cursor-pointer
                          cursor-pointer outline-none
                        "
                    />
                </div>

                {/* 4. PREMIUM BUTTON: Matches Export with Spinners and subtle hover states */}
                <button 
                    onClick={handleUpload} 
                    disabled={!file || uploading}
                    className={`mt-2 flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 active:scale-95
                        ${!file || uploading
                            ? 'bg-gray-100 dark:bg-white/5 cursor-not-allowed text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-white/5' 
                            : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg hover:shadow-brand-500/25 border border-transparent'
                        }`}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
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