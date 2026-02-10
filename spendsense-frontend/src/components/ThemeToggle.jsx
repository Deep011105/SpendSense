import React from 'react';
import { Moon, Sun } from 'lucide-react';
import useDarkMode from '../hooks/useDarkMode';

const ThemeToggle = () => {
    const [theme, setTheme] = useDarkMode();

    return (
        <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            // UPDATED: Changed dark:bg-gray-700 -> dark:bg-gray-800 for a subtler look
            className="p-2 rounded-full transition-colors duration-200
                bg-gray-100 text-gray-600 hover:bg-gray-200
                dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700"
            title="Toggle Theme"
        >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

export default ThemeToggle;