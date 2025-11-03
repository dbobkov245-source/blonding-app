/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Нейтральная база
        'background': '#f8fafc', // Почти белый (bg-slate-50)
        'surface': '#ffffff',    // Чисто белый (для карточек)
        'text-primary': '#0f172a', // Почти черный (text-slate-900)
        'text-secondary': '#64748b', // Серый (text-slate-500)
        
        // Акцентный цвет (ваш фиолетовый)
        'primary': '#7c3aed',     // (purple-600)
        'primary-hover': '#6d28d9', // (purple-700)
        
        // Акцент для тестов (ваш розовый)
        'accent': '#ec4899',      // (pink-500)
        'accent-hover': '#db2777',   // (pink-600)
      },
      fontFamily: {
        // Выбранные вами шрифты - отличные!
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
