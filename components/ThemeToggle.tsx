'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Laptop } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ThemeToggleProps {
  variant?: 'default' | 'minimal' | '3d'
  showSystemOption?: boolean
  className?: string
}

export default function ThemeToggle({ 
  variant = 'default', 
  showSystemOption = false,
  className = '' 
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme()
  const [is3DHovered, setIs3DHovered] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  // Ensure component is mounted before rendering to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // 3D hover effect for variant='3d'
  useEffect(() => {
    if (variant !== '3d') return

    const handleMouseMove = (e: MouseEvent) => {
      const toggle = toggleRef.current
      if (!toggle) return

      const rect = toggle.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const rotateX = (e.clientY - centerY) / 10
      const rotateY = (centerX - e.clientX) / 10
      
      setRotation({ x: rotateX, y: rotateY })
    }

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 })
      setIs3DHovered(false)
    }

    const handleMouseEnter = () => {
      setIs3DHovered(true)
    }

    const toggle = toggleRef.current
    if (toggle) {
      toggle.addEventListener('mousemove', handleMouseMove)
      toggle.addEventListener('mouseleave', handleMouseLeave)
      toggle.addEventListener('mouseenter', handleMouseEnter)

      return () => {
        toggle.removeEventListener('mousemove', handleMouseMove)
        toggle.removeEventListener('mouseleave', handleMouseLeave)
        toggle.removeEventListener('mouseenter', handleMouseEnter)
      }
    }
  }, [variant])

  const toggleTheme = () => {
    if (showSystemOption) {
      // Cycle through system -> light -> dark -> system
      if (theme === 'system') {
        setTheme('light')
      } else if (theme === 'light') {
        setTheme('dark')
      } else {
        setTheme('system')
      }
    } else {
      // Simple toggle between light and dark
      const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
      setTheme(newTheme)
    }
    
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
      <div className={`w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse ${className}`} />
    )
  }

  const isDark = resolvedTheme === 'dark'
  const isSystem = theme === 'system'

  // Get current icon based on theme
  const getCurrentIcon = () => {
    if (isSystem) return Laptop
    if (isDark) return Moon
    return Sun
  }

  const getCurrentColor = () => {
    if (isSystem) return 'text-purple-500'
    if (isDark) return 'text-blue-500'
    return 'text-yellow-500'
  }

  // Minimal variant
  if (variant === 'minimal') {
    const Icon = getCurrentIcon()
    return (
      <motion.button
        onClick={toggleTheme}
        className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <Icon className={`w-5 h-5 ${getCurrentColor()}`} />
      </motion.button>
    )
  }

  // 3D variant
  if (variant === '3d') {
    const Icon = getCurrentIcon()
    return (
      <motion.button
        ref={toggleRef}
        onClick={toggleTheme}
        className={`relative p-3 rounded-xl glass-3d border border-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Current theme: ${theme}. Click to change.`}
      >
        {/* 3D background layers */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-viva-magenta-500/20 to-lux-gold-500/20"
          animate={{
            opacity: is3DHovered ? 0.8 : 0.4,
            scale: is3DHovered ? 1.05 : 1
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-viva-magenta-400/60 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          className="relative z-10"
          animate={{
            rotateY: is3DHovered ? 180 : 0,
            scale: is3DHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 300 }}
        >
          <Icon className={`w-6 h-6 ${getCurrentColor()}`} />
        </motion.div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            boxShadow: is3DHovered 
              ? '0 0 30px rgba(190, 52, 85, 0.4), inset 0 0 20px rgba(212, 175, 55, 0.2)'
              : '0 0 10px rgba(190, 52, 85, 0.2)'
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    )
  }

  // Default enhanced variant with smooth transitions
  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${className}`}
      style={{
        background: isSystem 
          ? 'linear-gradient(45deg, #8B5CF6, #3B82F6)'
          : isDark 
          ? 'linear-gradient(45deg, #3B82F6, #8B5CF6)'
          : 'linear-gradient(45deg, #FEF3C7, #FDE68A)'
      }}
      whileTap={{ scale: 0.95 }}
      layout
      aria-label={`Current theme: ${theme}. Click to ${showSystemOption ? 'cycle themes' : 'toggle theme'}.`}
    >
      <motion.div
        className="absolute top-0.5 w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center"
        animate={{
          x: isSystem ? 14 : isDark ? 28 : 2,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        layout
      >
        <AnimatePresence mode="wait">
          {isSystem ? (
            <motion.div
              key="laptop"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Laptop className="w-3 h-3 text-purple-500" />
            </motion.div>
          ) : isDark ? (
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
      
      {/* Enhanced glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isSystem
            ? '0 0 20px rgba(139, 92, 246, 0.4)'
            : isDark 
            ? '0 0 20px rgba(59, 130, 246, 0.4)'
            : '0 0 20px rgba(251, 191, 36, 0.4)'
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Theme indicator dots */}
      {showSystemOption && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {['system', 'light', 'dark'].map((themeOption, index) => (
            <motion.div
              key={themeOption}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                theme === themeOption 
                  ? 'bg-viva-magenta-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              animate={{
                scale: theme === themeOption ? 1.2 : 1,
                opacity: theme === themeOption ? 1 : 0.5
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      )}
    </motion.button>
  )
}

// Export additional variants for convenience
export function SimpleThemeToggle({ className = '' }: { className?: string }) {
  return <ThemeToggle variant="minimal" className={className} />
}

export function ThreeDThemeToggle({ className = '' }: { className?: string }) {
  return <ThemeToggle variant="3d" className={className} />
}

export function SystemThemeToggle({ className = '' }: { className?: string }) {
  return <ThemeToggle showSystemOption={true} className={className} />
}