/** Enhanced Tailwind Config - Fully Integrated with Your Theme System */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.css', // ✅ FIX: Corrected glob pattern - removed curly braces
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Your existing Viva Magenta luxury palette - Enhanced
        'viva-magenta': {
          50: '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d0d9',
          300: '#f4a4b8',
          400: '#ed7196',
          500: '#e13d75',
          600: '#d01c5c',
          700: '#BE3455', // Your main brand color
          800: '#a02947',
          900: '#8b2540',
          950: '#4d1020',
        },
        'lux-gold': {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#D4AF37', // Your main gold
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        'lux-sage': {
          50: '#f6f7f3',
          100: '#eaede3',
          200: '#d5dcc9',
          300: '#b8c5a5',
          400: '#98A869', // Your main sage
          500: '#7f8e60',
          600: '#647049',
          700: '#50583d',
          800: '#424934',
          900: '#393f2e',
          950: '#1e2217',
        },
        'lux-teal': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#008080', // Your main teal
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        'lux-brown': {
          50: '#faf9f7',
          100: '#f0ede7',
          200: '#e2dad0',
          300: '#cfc0b0',
          400: '#b8a088',
          500: '#a8886a',
          600: '#9b7759',
          700: '#81634b',
          800: '#4A2C2A', // Your main brown
          900: '#3d2622',
          950: '#211311',
        },
        'lux-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#A0A0A0', // Your main gray
          600: '#6b7280',
          700: '#4b5563',
          800: '#374151',
          900: '#1f2937',
          950: '#030712',
        },
        'lux-black': '#121212',
        'lux-offwhite': '#FAFAFA',
        
        // Enhanced dark mode colors - Integrated with your existing system
        'dark': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        
        // Enhanced primary/secondary system that works with your components
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
      },
      fontFamily: {
        sans: [
          'Inter var', 
          'Inter', 
          'system-ui', 
          '-apple-system', 
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono', 
          'Menlo', 
          'Monaco', 
          'Consolas', 
          'Liberation Mono', 
          'Courier New', 
          'monospace'
        ],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '176': '44rem',
        '192': '48rem',
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        // Your existing animations enhanced
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'float-3d': 'float3d 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'fade-in-left': 'fadeInLeft 0.6s ease-out',
        'fade-in-right': 'fadeInRight 0.6s ease-out',
        'slide-in-up': 'slideInUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'rotate-slow': 'spin 8s linear infinite',
        'rotate-3d': 'rotate3d 20s linear infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'deployment-pulse': 'deploymentPulse 2s ease-in-out infinite',
        'github-star': 'githubStar 1s ease-out',
        'code-scan': 'codeScan 2s ease-in-out infinite',
        'language-orbit': 'languageOrbit 8s linear infinite',
        'hero-particle-float': 'heroParticleFloat 8s linear infinite',
        'hero-profile-rotate': 'heroProfileRotate 10s linear infinite',
        'hero-ambient-shift': 'heroAmbientShift 8s ease-in-out infinite',
        'scroll-bg-shift': 'scrollBgShift 12s ease-in-out infinite',
        'badge-pop-in': 'badgePopIn 0.3s ease-out',
        'stats-icon-glow': 'statsIconGlow 2s ease-in-out infinite',
        'status-pulse': 'statusPulse 2s ease-in-out infinite',
        'status-spin': 'statusSpin 1s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'skeleton-pulse': 'skeletonPulse 2s ease-in-out infinite',
        'skeleton-shimmer': 'skeletonShimmer 2s linear infinite',
        'parallax-drift': 'parallaxDrift 20s ease-in-out infinite',
        'enhanced-gradient-shift': 'enhancedGradientShift 4s ease-in-out infinite',
      },
      keyframes: {
        // Your existing keyframes enhanced with new ones
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        float3d: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotateX(0deg) rotateY(0deg)' 
          },
          '33%': { 
            transform: 'translateY(-10px) rotateX(5deg) rotateY(5deg)' 
          },
          '66%': { 
            transform: 'translateY(-5px) rotateX(-3deg) rotateY(-3deg)' 
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        rotate3d: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.4)'
          },
        },
        deploymentPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)',
            transform: 'scale(1)' 
          },
          '50%': { 
            boxShadow: '0 0 0 10px rgba(34, 197, 94, 0)',
            transform: 'scale(1.1)' 
          },
        },
        githubStar: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.3) rotate(180deg)' },
          '100%': { transform: 'scale(1) rotate(360deg)' },
        },
        codeScan: {
          '0%, 100%': {
            transform: 'translateY(0)',
            opacity: '0'
          },
          '50%': {
            transform: 'translateY(100%)',
            opacity: '1'
          },
        },
        languageOrbit: {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        heroParticleFloat: {
          '0%': {
            transform: 'translateY(100vh) translateX(0) scale(0)',
            opacity: '0'
          },
          '10%': {
            opacity: '0.6',
            transform: 'scale(1)'
          },
          '90%': {
            opacity: '0.6'
          },
          '100%': {
            transform: 'translateY(-100px) translateX(50px) scale(0)',
            opacity: '0'
          },
        },
        heroProfileRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        heroAmbientShift: {
          '0%, 100%': {
            filter: 'hue-rotate(0deg) brightness(1)'
          },
          '50%': {
            filter: 'hue-rotate(30deg) brightness(1.1)'
          },
        },
        scrollBgShift: {
          '0%, 100%': {
            filter: 'hue-rotate(0deg) brightness(1)'
          },
          '50%': {
            filter: 'hue-rotate(20deg) brightness(1.05)'
          },
        },
        badgePopIn: {
          '0%': {
            transform: 'scale(0) rotate(-180deg)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)',
            opacity: '1'
          },
        },
        statsIconGlow: {
          '0%, 100%': {
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
          },
          '50%': {
            boxShadow: '0 4px 25px rgba(190, 52, 85, 0.3)'
          },
        },
        statusPulse: {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': {
            opacity: '0.5',
            transform: 'scale(0.8)'
          },
        },
        statusSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glowPulse: {
          '0%, 100%': {
            opacity: '0.3',
            filter: 'blur(8px)'
          },
          '50%': {
            opacity: '0.8',
            filter: 'blur(12px)'
          },
        },
        skeletonPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        skeletonShimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        parallaxDrift: {
          '0%, 100%': {
            transform: 'translateX(0) translateY(0) rotate(0deg)'
          },
          '33%': {
            transform: 'translateX(20px) translateY(-10px) rotate(1deg)'
          },
          '66%': {
            transform: 'translateX(-15px) translateY(15px) rotate(-1deg)'
          },
        },
        enhancedGradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-luxury': 'linear-gradient(135deg, #BE3455, #D4AF37)',
        'gradient-tech': 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        'gradient-viva-gold': 'linear-gradient(135deg, #BE3455 0%, #D4AF37 100%)',
        'gradient-rainbow': 'linear-gradient(135deg, #BE3455 0%, #D4AF37 25%, #98A869 50%, #008080 75%, #4A2C2A 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'luxury': '0 25px 50px -12px rgba(190, 52, 85, 0.25)',
        'luxury-lg': '0 35px 60px -12px rgba(190, 52, 85, 0.35)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-strong': '0 0 40px rgba(59, 130, 246, 0.6)',
        'glow-viva': '0 0 20px rgba(190, 52, 85, 0.4)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.4)',
        '3d': '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
        '3d-hover': '0 45px 80px -12px rgba(0, 0, 0, 0.4)',
        'depth': '0 20px 40px rgba(0, 0, 0, 0.15)',
        'depth-hover': '0 30px 60px rgba(0, 0, 0, 0.2)',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'ease-out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      transformOrigin: {
        'center-3d': 'center center 0',
      },
      perspective: {
        '500': '500px',
        '800': '800px',
        '1200': '1200px',
        '1500': '1500px',
        '2000': '2000px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Enhanced custom plugin for glass morphism and 3D effects
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        // Glass morphism utilities
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-card': {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-3d': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-hero': {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(32px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        
        // Text utilities
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        },
        '.text-glow': {
          textShadow: '0 0 20px rgba(190, 52, 85, 0.8)',
        },
        
        // 3D utilities
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.perspective-500': {
          perspective: '500px',
        },
        '.perspective-800': {
          perspective: '800px',
        },
        '.perspective-1200': {
          perspective: '1200px',
        },
        '.perspective-1500': {
          perspective: '1500px',
        },
        '.perspective-2000': {
          perspective: '2000px',
        },
        
        // Performance utilities
        '.transform-gpu': {
          transform: 'translateZ(0)',
          willChange: 'transform',
        },
        '.will-change-transform': {
          willChange: 'transform',
        },
        
        // Interactive utilities
        '.hover-lift': {
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        '.hover-scale': {
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
        '.hover-3d': {
          transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transformStyle: 'preserve-3d',
          '&:hover': {
            transform: 'rotateY(5deg) rotateX(3deg) translateZ(20px)',
          },
        },
        
        // Focus utilities
        '.focus-ring': {
          '&:focus-visible': {
            outline: 'none',
            boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.1), 0 0 0 4px rgba(59, 130, 246, 0.5)',
          },
        },
        '.focus-ring-viva': {
          '&:focus-visible': {
            outline: 'none',
            boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.1), 0 0 0 4px rgba(190, 52, 85, 0.5)',
          },
        },
      }
      
      const newComponents = {
        // Enhanced button components
        '.btn-enhanced': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          fontWeight: '600',
          borderRadius: '0.75rem',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: 'translateZ(0)',
          willChange: 'transform',
          '&:focus': {
            outline: 'none',
          },
          '&:hover': {
            transform: 'translateY(-2px) scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        
        '.btn-primary-enhanced': {
          '@apply btn-enhanced': {},
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          color: 'white',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px) scale(1.02)',
          },
        },
        
        '.btn-viva-enhanced': {
          '@apply btn-enhanced': {},
          background: 'linear-gradient(135deg, #BE3455, #D4AF37)',
          color: 'white',
          boxShadow: '0 10px 15px -3px rgba(190, 52, 85, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #a02947, #ca8a04)',
            boxShadow: '0 20px 25px -5px rgba(190, 52, 85, 0.4)',
            transform: 'translateY(-2px) scale(1.02)',
          },
        },
        
        // Enhanced card components
        '.card-enhanced': {
          padding: '1.5rem',
          borderRadius: '1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: 'translateZ(0)',
        },
        
        '.card-3d-enhanced': {
          '@apply card-enhanced': {},
          transformStyle: 'preserve-3d',
          '&:hover': {
            transform: 'rotateY(5deg) rotateX(3deg) translateZ(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          },
        },
        
        // Tech badge component
        '.tech-badge': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.25rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          borderRadius: '9999px',
          background: 'linear-gradient(135deg, rgba(190, 52, 85, 0.1) 0%, rgba(212, 175, 55, 0.1) 100%)',
          color: '#BE3455',
          border: '1px solid rgba(190, 52, 85, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          '&:hover': {
            transform: 'scale(1.05)',
            background: 'linear-gradient(135deg, rgba(190, 52, 85, 0.2) 0%, rgba(212, 175, 55, 0.2) 100%)',
            boxShadow: '0 4px 15px rgba(190, 52, 85, 0.3)',
          },
        },
      }

      addUtilities(newUtilities)
      addComponents(newComponents)
    },
    
    // Plugin for enhanced line clamp support
    function({ addUtilities }) {
      const lineClampUtilities = {
        '.line-clamp-1': {
          display: '-webkit-box',
          '-webkit-line-clamp': '1',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
          'line-clamp': '1',
        },
        '.line-clamp-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
          'line-clamp': '2',
        },
        '.line-clamp-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
          'line-clamp': '3',
        },
        '.line-clamp-4': {
          display: '-webkit-box',
          '-webkit-line-clamp': '4',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
          'line-clamp': '4',
        },
        '.line-clamp-5': {
          display: '-webkit-box',
          '-webkit-line-clamp': '5',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
          'line-clamp': '5',
        },
        '.line-clamp-6': {
          display: '-webkit-box',
          '-webkit-line-clamp': '6',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
          'line-clamp': '6',
        },
      }
      addUtilities(lineClampUtilities)
    },
  ],
}