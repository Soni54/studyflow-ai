// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // IMPORTANT: This line tells Tailwind to look in all your JS, TS, JSX, TSX files in the src directory.
  ],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
        'ping-slow': 'ping 6s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-slower': 'ping 10s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in-up': 'fadeInUp 1s ease-out',
        'bounce-slow': 'bounce 3s infinite',

    },
    keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
  },
  fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
},
    },
  },
  plugins: [],
} 

