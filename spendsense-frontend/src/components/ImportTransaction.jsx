import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, Loader } from 'lucide-react';
import toast from 'react-hot-toast'; // <--- Import this

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
        
        // Create a "Loading" toast
        const loadingToast = toast.loading("Uploading statement..."); 

        try {
            await axios.post('http://localhost:8080/api/transactions/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Success! Dismiss loading and show success
            toast.dismiss(loadingToast);
            toast.success("Import Successful!");
            
            setFile(null);
            if (onImportSuccess) onImportSuccess(); 
        } catch (error) {
            console.error(error);
            toast.dismiss(loadingToast);
            toast.error("Failed to upload file.");
        } finally {
            setUploading(false);
        }
    };

    return (
        // 1. CONTAINER: Updated border to gray-800 for subtle separation in black theme
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-800 max-w-md mt-6 transition-colors duration-300">
            
            <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                Import Statement
            </h3>
            
            <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload a CSV file (Date, Description, Amount) to auto-add transactions.
                </p>

                <div className="relative">
                    {/* 2. FILE INPUT: Changed slate-700 -> gray-800 for neutral look */}
                    <input 
                        type="file" 
                        accept=".csv"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 dark:text-gray-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-brand-50 file:text-brand-700
                          hover:file:bg-brand-100
                          dark:file:bg-gray-800 dark:file:text-brand-400
                          file:transition-colors
                        "
                    />
                </div>

                <button 
                    onClick={handleUpload} 
                    disabled={!file || uploading}
                    // 3. BUTTON: Disabled state now uses gray-800 instead of slate-700
                    className={`w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200 
                        ${!file || uploading
                            ? 'bg-gray-300 dark:bg-gray-800 cursor-not-allowed text-gray-500 dark:text-gray-500' 
                            : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm'
                        }`}
                >
                    {uploading ? <Loader className="animate-spin w-5 h-5"/> : <Upload className="w-5 h-5"/>}
                    {uploading ? 'Processing...' : 'Upload CSV'}
                </button>
            </div>
        </div>
    );
};

export default ImportTransaction;