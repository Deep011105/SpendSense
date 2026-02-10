/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Your Brand Color (Indigo/Blue)
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        // NEW "True Black" Theme
        dark: {
          bg: '#000000',      // Pure Black background
          card: '#121212',    // Very dark gray (standard for dark mode cards)
          text: '#ffffff',    // Pure White text for maximum contrast
          muted: '#a1a1aa',   // Light Gray for secondary text
          border: '#27272a'   // Dark Gray for borders
        }
      },
    },
  },
  plugins: [],
}