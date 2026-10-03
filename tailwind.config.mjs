/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        teepul: {
          primary: '#7B1830',
          dark: '#4A0F1D',
          cream: '#FFF8F1',
          beige: '#F3E5D5',
          pink: '#FBE7E7',
          text: '#171717',
          muted: '#6B625D',
          border: '#E8DED6',
        },
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#7B1830',
          600: '#641327',
          700: '#4A0F1D',
          800: '#380B16',
          900: '#171717',
          950: '#0c0a09',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(123, 24, 48, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'luxury-lg': '0 20px 40px -10px rgba(123, 24, 48, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
