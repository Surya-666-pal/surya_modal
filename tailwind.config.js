/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#0F231C',
          800: '#152F26',
          DEFAULT: '#1B3A2F',
          700: '#234C3E',
          600: '#2D6150',
          500: '#3D7D68'
        },
        saffron: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          DEFAULT: '#F0932B',
          600: '#EA580C',
          700: '#C2410C',
          glow: 'rgba(240, 147, 43, 0.45)'
        },
        cream: {
          50: '#FFFFFF',
          100: '#FDFBF7',
          DEFAULT: '#FBF3E3',
          200: '#F5E6C9',
          300: '#EBD4AA',
          dark: '#E2C896'
        },
        tealAccent: {
          DEFAULT: '#2E7D7B',
          light: '#3C9896',
          dark: '#1F5A58'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Poppins"', '"Manrope"', 'sans-serif'],
        script: ['"Caveat"', '"Kalam"', 'cursive'],
        kongquest: ['"Kong Quest"', '"Plus Jakarta Sans"', 'sans-serif'],
        mrbedfort: ['"Mr Bedfort"', 'cursive'],
        airstream: ['"Airstream NF"', '"Airstream"', 'cursive', 'sans-serif'],
        dustismo: ['"Dustismo Roman"', 'Georgia', 'serif'],
        coolvetica: ['"Coolvetica"', '"Plus Jakarta Sans"', 'sans-serif'],
        dongraffiti: ['"Don Graffiti"', '"Plus Jakarta Sans"', 'sans-serif'],
        allura: ['"Allura"', 'cursive'],
        raustila: ['"Raustila"', 'cursive'],
        engebrechtre: ['"Engebrechtre"', '"Plus Jakarta Sans"', 'sans-serif'],
        leaguespartan: ['"League Spartan"', '"Plus Jakarta Sans"', 'sans-serif'],
        cinzel: ['"Cinzel"', 'Georgia', 'serif'],
        syne: ['"Syne"', 'sans-serif'],
        abril: ['"Abril Fatface"', 'cursive'],
        golden: ['"Mr Dafoe"', '"Lobster Two"', '"Satisfy"', '"Yellowtail"', '"Pacifico"', 'cursive'],
        glow: ['"Montserrat"', '"Plus Jakarta Sans"', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounceSoft 2s infinite',
        'kenburns': 'kenburns 24s ease-in-out infinite alternate',
      },
      keyframes: {
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        kenburns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.08) translate(-1%, -1%)' },
        }
      },
      boxShadow: {
        'saffron-glow': '0 0 25px rgba(240, 147, 43, 0.5)',
        'saffron-soft': '0 10px 30px -5px rgba(240, 147, 43, 0.3)',
        'card-lift': '0 20px 40px -15px rgba(27, 58, 47, 0.12)',
        'card-lift-hover': '0 25px 50px -12px rgba(240, 147, 43, 0.25)',
      }
    },
  },
  plugins: [],
}
