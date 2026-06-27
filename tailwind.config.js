/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50:  '#fdf3ee',
          100: '#fae3d4',
          200: '#f5c4a8',
          300: '#ed9d72',
          400: '#e47040',
          500: '#C4622D',
          600: '#b54e22',
          700: '#963d1e',
          800: '#793220',
          900: '#632c1e',
        },
        ivory: {
          50:  '#fdfcfa',
          100: '#F5F0E8',
          200: '#ede4d4',
          300: '#dfd0b8',
          400: '#cdb896',
          500: '#bda07a',
        },
        sage: {
          50:  '#f2f6f2',
          100: '#e0ebe0',
          200: '#c2d8c2',
          300: '#8FAF8A',
          400: '#6d946a',
          500: '#527550',
          600: '#405d3f',
        },
        charcoal: {
          DEFAULT: '#2D2D2D',
          light:   '#4a4a4a',
          dark:    '#1a1a1a',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
        urdu:    ['Noto Nastaliq Urdu', 'serif'],
      },
      animation: {
        'fade-up':      'fadeUp 0.6s ease forwards',
        'fade-in':      'fadeIn 0.5s ease forwards',
        'slide-right':  'slideRight 0.5s ease forwards',
        'marquee':      'marquee 25s linear infinite',
        'shimmer':      'shimmer 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'luxury':   '0 4px 40px rgba(196, 98, 45, 0.12)',
        'card':     '0 2px 20px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}