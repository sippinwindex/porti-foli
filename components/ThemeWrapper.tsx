// components/ThemeWrapper.tsx - Wrapper to ensure proper theme initialization
'use client'

import React, { useEffect, useState } from 'react'

interface ThemeWrapperProps {
  children: React.ReactNode
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Prevent theme flash by ensuring proper initialization
    const initializeTheme = () => {
      try {
        const savedTheme = localStorage.getItem('theme')
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const shouldUseDarkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
        
        // Apply theme immediately before mounting
        const root = document.documentElement
        
        if (shouldUseDarkMode) {
          root.classList.add('dark')
          root.style.colorScheme = 'dark'
        } else {
          root.classList.remove('dark')
          root.style.colorScheme = 'light'
        }

        // Add theme transition class to prevent flash
        root.classList.add('theme-transition-disabled')
        
        // Remove transition prevention after a short delay
        setTimeout(() => {
          root.classList.remove('theme-transition-disabled')
        }, 100)
        
      } catch (error) {
        console.warn('Theme initialization failed:', error)
        // Fallback to light mode
        document.documentElement.classList.remove('dark')
        document.documentElement.style.colorScheme = 'light'
      }
    }

    initializeTheme()
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-viva-magenta-600"></div>
      </div>
    )
  }

  return <>{children}</>
}