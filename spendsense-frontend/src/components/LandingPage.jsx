import React from 'react';
import Hero from './Hero';
import Features from './Features';
import FinalCta from './FinalCta';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* 1. The main Hero section with the Navbar */}
      <Hero />
      
      {/* 2. The Features grid */}
      <Features />
      <FinalCta />
      
      {/* 3. A simple, modern footer */}
      <footer className="border-t border-gray-100 dark:border-white/10 py-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          © {new Date().getFullYear()} SpendSense. All rights reserved.
        </p>
      </footer>
    </div>
  );
}