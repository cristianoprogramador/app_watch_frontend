/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-sidebar-bg': 'var(--sidebar-bg)',
        'theme-bg': 'var(--bg)',
        'theme-text-color': 'var(--text-color)',
        'theme-bg-card': 'var(--bg-card)',
      }
    },
  },
  plugins: [],
}

