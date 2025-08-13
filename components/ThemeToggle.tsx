'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // Ensure component is mounted before rendering to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    
    // Create ripple effect animation
    const ripple = document.createElement('div')
    ripple.className = 'fixed inset-0 pointer-events-none z-[9999] opacity-0'
    ripple.style.background = resolvedTheme === 'dark' 
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

  // Prevent hydration mismatch by showing loading state
  if (!mounted) {
    return (
      <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
      style={{
        background: isDark 
          ? 'linear-gradient(45deg, #3B82F6, #8B5CF6)'
          : 'linear-gradient(45deg, #FEF3C7, #FDE68A)'
      }}
      whileTap={{ scale: 0.95 }}
      layout
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center"
        animate={{
          x: isDark ? 24 : 2,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        layout
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="w-3 h-3 text-blue-500" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="w-3 h-3 text-yellow-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isDark 
            ? '0 0 20px rgba(59, 130, 246, 0.3)'
            : '0 0 20px rgba(251, 191, 36, 0.3)'
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}

// Alternative minimal version if you prefer simpler styling
export function SimpleThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse w-10 h-10" />
    )
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-blue-600" />
      )}
    </button>
  )
}