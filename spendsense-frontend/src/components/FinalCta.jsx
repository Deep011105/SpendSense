import React from 'react';
import { Link } from 'react-router-dom';

export default function FinalCta() {
  return (
    <div className="relative isolate overflow-hidden bg-gray-50 dark:bg-black px-6 py-24 text-center sm:py-32 lg:px-8 border-t border-gray-200 dark:border-white/10 transition-colors duration-300">
       
       {/* Background Glow Effect - Adjusted for both modes */}
       <div className="absolute inset-0 -z-10 flex justify-center mt-12 overflow-hidden pointer-events-none">
          <div className="w-[60rem] h-[30rem] bg-gradient-to-r from-brand-400/40 to-purple-400/40 dark:from-brand-600/30 dark:to-purple-600/30 rounded-full blur-[100px] opacity-70 transition-colors duration-300"></div>
       </div>

       {/* Text Colors updated with dark: variants */}
       <h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl transition-colors duration-300">
          Ready to take control?
       </h2>
       <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300 transition-colors duration-300">
          Join SpendSense today. Start tracking your expenses, visualize your wealth, and hit your financial goals faster than ever.
       </p>
       
       <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link 
            to="/signup" 
            className="rounded-full bg-brand-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-brand-700 hover:shadow-brand-500/25 transition-all hover:-translate-y-1 active:scale-95"
          >
             Get Started for Free
          </Link>
       </div>
    </div>
  );
}