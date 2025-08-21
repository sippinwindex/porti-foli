'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ThemeToggleProps {
  variant?: 'navbar' | 'floating' | 'inline'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export default function ThemeToggle({ 
  variant = 'navbar',
  size = 'md',
  showLabel = false,
  className = '' 
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div 
        className={`${getSizeClasses(size).container} bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse ${className}`}
      />
    )
  }

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const sizeClasses = getSizeClasses(size)
  const variantClasses = getVariantClasses(variant)

  return (
    <div className={`${variantClasses.wrapper} ${className}`}>
      <motion.button
        onClick={toggleTheme}
        className={`
          ${sizeClasses.container} ${variantClasses.button}
          relative rounded-full transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2
          focus:ring-offset-white dark:focus:ring-offset-gray-900
          bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300/80 dark:hover:bg-gray-600/80
          border border-gray-300/50 dark:border-gray-600/50
          backdrop-filter backdrop-blur-sm
          overflow-hidden
        `}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {/* Toggle Track */}
        <div className={`${sizeClasses.track} relative rounded-full overflow-hidden`}>
          {/* Background gradient */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: isDark
                ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Toggle Circle - FIXED: Proper containment */}
          <motion.div
            className={`
              ${sizeClasses.circle}
              absolute bg-white dark:bg-gray-100 rounded-full shadow-lg
              flex items-center justify-center
              border border-gray-200 dark:border-gray-300
            `}
            style={{
              top: '2px',
              left: '2px'
            }}
            animate={{
              x: isDark ? sizeClasses.circleOffset : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
          >
            {/* Icon */}
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="moon"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className={`${sizeClasses.icon} text-slate-600`} />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className={`${sizeClasses.icon} text-amber-600`} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Subtle glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            boxShadow: isDark
              ? '0 0 15px rgba(59, 130, 246, 0.2)'
              : '0 0 15px rgba(251, 191, 36, 0.2)'
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      {/* Optional Label */}
      {showLabel && (
        <motion.span
          className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {isDark ? 'Dark' : 'Light'}
        </motion.span>
      )}
    </div>
  )
}

// FIXED: Helper functions for responsive sizing with proper containment
function getSizeClasses(size: 'sm' | 'md' | 'lg') {
  switch (size) {
    case 'sm':
      return {
        container: 'w-10 h-5',
        track: 'w-full h-full',
        circle: 'w-4 h-4',
        circleOffset: 20, // Reduced to stay within bounds
        icon: 'w-2.5 h-2.5'
      }
    case 'lg':
      return {
        container: 'w-16 h-8',
        track: 'w-full h-full',
        circle: 'w-7 h-7',
        circleOffset: 32, // Adjusted for larger size
        icon: 'w-4 h-4'
      }
    default: // md
      return {
        container: 'w-12 h-6',
        track: 'w-full h-full',
        circle: 'w-5 h-5',
        circleOffset: 24, // Properly calculated offset
        icon: 'w-3 h-3'
      }
  }
}

function getVariantClasses(variant: 'navbar' | 'floating' | 'inline') {
  switch (variant) {
    case 'floating':
      return {
        wrapper: 'fixed top-6 right-6 z-50',
        button: 'shadow-lg'
      }
    case 'inline':
      return {
        wrapper: 'inline-flex items-center',
        button: ''
      }
    default: // navbar
      return {
        wrapper: 'flex items-center',
        button: ''
      }
  }
}