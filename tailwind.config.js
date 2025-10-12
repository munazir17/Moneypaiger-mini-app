/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Moneypaiger theme: Green for money, blue for paging/notifications
        primary: '#10B981',
        secondary: '#3B82F6'
      }
    },
  },
  plugins: [],
}
