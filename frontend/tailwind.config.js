/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-indigo': '0 0 40px -10px rgba(99, 102, 241, 0.20)',
        'glow-purple': '0 0 40px -10px rgba(168, 85, 247, 0.20)',
        'glow-blue':   '0 0 40px -10px rgba(59, 130, 246, 0.20)',
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
};
