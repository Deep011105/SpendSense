import React from 'react';
import { Moon, Sun } from 'lucide-react';
import useDarkMode from '../hooks/useDarkMode';

const ThemeToggle = () => {
    const [theme, setTheme] = useDarkMode();

    return (
        // 1. PREMIUM CONTAINER: Matches the squircle shape and frosted glass of the Navbar
        <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="relative p-2.5 rounded-xl transition-all duration-300
                bg-gray-100/80 hover:bg-gray-200/80
                dark:bg-white/5 dark:hover:bg-white/10
                backdrop-blur-md border border-transparent hover:border-gray-300 dark:hover:border-white/10
                text-gray-600 dark:text-gray-400
                shadow-sm active:scale-95 group overflow-hidden"
            title="Toggle Theme"
            aria-label="Toggle Dark Mode"
        >
            {/* 2. ANIMATED ICON WRAPPER */}
            {/* We render BOTH icons on top of each other and animate their scale and rotation based on the state */}
            <div className="relative w-5 h-5 flex items-center justify-center">
                
                {/* SUN ICON: Spins in and glows yellow when Dark Mode is active */}
                <Sun 
                    className={`absolute inset-0 w-5 h-5 transition-all duration-500 transform group-hover:text-yellow-400 ${
                        theme === 'dark' 
                        ? 'opacity-100 rotate-0 scale-100' 
                        : 'opacity-0 -rotate-90 scale-50'
                    }`} 
                />
                
                {/* MOON ICON: Spins in and glows brand-blue when Light Mode is active */}
                <Moon 
                    className={`absolute inset-0 w-5 h-5 transition-all duration-500 transform group-hover:text-brand-600 ${
                        theme === 'light' 
                        ? 'opacity-100 rotate-0 scale-100' 
                        : 'opacity-0 rotate-90 scale-50'
                    }`} 
                />
                
            </div>
        </button>
    );
};

export default ThemeToggle;