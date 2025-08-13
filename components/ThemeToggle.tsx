'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true) // Default to dark for luxury feel
  const [mounted, setMounted] = useState(false)

  // Handle system preference detection
  useEffect(() => {
    setMounted(true)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setDarkMode(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', darkMode)
    }
  }, [darkMode, mounted])

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    
    // Create ripple effect animation
    const ripple = document.createElement('div')
    ripple.className = 'fixed inset-0 pointer-events-none z-[9999] opacity-0'
    ripple.style.background = darkMode 
      ? 'radial-gradient(circle at center, #FAFAFA 0%, transparent 70%)'
      : 'radial-gradient(circle at center, #121212 0%, transparent 70%)'
    
    document.body.appendChild(ripple)
    
    // Animate ripple
    ripple.animate([
      { opacity: 0, transform: 'scale(0)' },
      { opacity: 0.8, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(3)' }
    ], {
      duration: 800,
      easing: 'ease-out'
    }).onfinish = () => ripple.remove()
  }

  if (!mounted) {
    return (
      <div className="w-12 h-6 bg-lux-gray-200 dark:bg-lux-gray-700 rounded-full animate-pulse" />
    )
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-viva-magenta-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-lux-black"
      style={{
        background: darkMode 
          ? 'linear-gradient(45deg, #BE3455, #D4AF37)'
          : 'linear-gradient(45deg, #f9d0d9, #fef9c3)'
      }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 bg-white dark:bg-lux-black rounded-full shadow-lg flex items-center justify-center"
        animate={{
          x: darkMode ? 24 : 2,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        layout
      >
        <AnimatePresence mode="wait">
          {darkMode ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="w-3 h-3 text-viva-magenta-500" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="w-3 h-3 text-lux-gold-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: darkMode 
            ? '0 0 20px rgba(190, 52, 85, 0.3)'
            : '0 0 20px rgba(212, 175, 55, 0.3)'
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}