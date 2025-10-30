/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981', // green tone for Moneypaiger
        accent: '#2563EB',  // blue tone for highlights
        dark: '#111827',    // dark background
      },
    },
  },
  plugins: [],
}
