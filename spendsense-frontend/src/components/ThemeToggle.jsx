import React from 'react';
import { Moon, Sun } from 'lucide-react';
import useDarkMode from '../hooks/useDarkMode';

const ThemeToggle = () => {
    const [theme, setTheme] = useDarkMode();

    return (
        <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-full transition-colors duration-200
                bg-gray-200 text-gray-800 hover:bg-gray-300
                dark:bg-gray-700 dark:text-yellow-400 dark:hover:bg-gray-600"
            title="Toggle Theme"
        >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

export default ThemeToggle;