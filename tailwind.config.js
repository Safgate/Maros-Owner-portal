/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-navy': 'var(--dark-navy)',
        'navy-deep': 'var(--navy-deep)',
        'navy-mid': 'var(--navy-mid)',
        'navy-light': 'var(--navy-light)',
        'moroccan-gold': 'var(--moroccan-gold)',
        'gold-light': 'var(--gold-light)',
        'gold-dark': 'var(--gold-dark)',
        'warm-cream': 'var(--warm-cream)',
        'cream-light': 'var(--cream-light)',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
