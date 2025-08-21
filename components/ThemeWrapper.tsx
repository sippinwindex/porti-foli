// components/ThemeWrapper.tsx - Optimized wrapper to prevent theme flash
'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

interface ThemeWrapperProps {
  children: React.ReactNode
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    // Immediate theme initialization to prevent flash
    const initializeTheme = () => {
      try {
        // Get saved theme from localStorage
        const savedTheme = localStorage.getItem('portfolio-theme')
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        
        // Determine theme to apply
        let themeToApply = 'light'
        if (savedTheme === 'dark') {
          themeToApply = 'dark'
        } else if (savedTheme === 'system' || !savedTheme) {
          themeToApply = systemPrefersDark ? 'dark' : 'light'
        }
        
        // Apply theme immediately
        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(themeToApply)
        root.setAttribute('data-theme', themeToApply)
        root.style.colorScheme = themeToApply
        
        // Add theme transition prevention temporarily
        root.classList.add('theme-transition-disabled')
        
        // Remove transition prevention after mount
        setTimeout(() => {
          root.classList.remove('theme-transition-disabled')
        }, 100)
        
      } catch (error) {
        console.warn('Theme initialization failed:', error)
        // Fallback to light mode
        const root = document.documentElement
        root.classList.remove('dark')
        root.classList.add('light')
        root.setAttribute('data-theme', 'light')
        root.style.colorScheme = 'light'
      }
    }

    // Only initialize on first mount
    if (!mounted) {
      initializeTheme()
      setMounted(true)
    }
  }, [mounted])

  // Show loading state only briefly to prevent flash
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Loading spinner */}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--viva-magenta)]"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen transition-colors duration-200">
      {children}
    </div>
  )
}