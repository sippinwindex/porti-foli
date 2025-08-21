// lib/theme-provider.tsx - COMPLETELY FIXED VERSION
'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = 'dark' | 'light'

interface ThemeProviderContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'portfolio-theme'
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')
  const [isClient, setIsClient] = useState(false)

  // Get system theme preference
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }, [])

  // Apply theme to document
  const applyTheme = useCallback((theme: ResolvedTheme) => {
    if (typeof document === 'undefined') return
    
    const root = document.documentElement
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark')
    
    // Add current theme class
    root.classList.add(theme)
    
    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', theme)
    
    // Set color-scheme for native form controls
    root.style.colorScheme = theme
    
    setResolvedTheme(theme)
  }, [])

  // Resolve theme based on current setting
  const resolveTheme = useCallback((currentTheme: Theme): ResolvedTheme => {
    switch (currentTheme) {
      case 'dark':
        return 'dark'
      case 'light':
        return 'light'
      case 'system':
        return getSystemTheme()
      default:
        return 'light'
    }
  }, [getSystemTheme])

  // Set theme with persistence
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    
    // Save to localStorage
    try {
      localStorage.setItem(storageKey, newTheme)
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }
    
    // Apply resolved theme
    const resolved = resolveTheme(newTheme)
    applyTheme(resolved)
  }, [storageKey, resolveTheme, applyTheme])

  // Toggle between light and dark (skip system)
  const toggleTheme = useCallback(() => {
    const newTheme: Theme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }, [resolvedTheme, setTheme])

  // Initialize theme on client side
  useEffect(() => {
    setIsClient(true)
    
    let initialTheme: Theme = defaultTheme
    
    // Try to load from localStorage
    try {
      const savedTheme = localStorage.getItem(storageKey) as Theme
      if (savedTheme && ['dark', 'light', 'system'].includes(savedTheme)) {
        initialTheme = savedTheme
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error)
    }
    
    setThemeState(initialTheme)
    
    const resolved = resolveTheme(initialTheme)
    applyTheme(resolved)
  }, [defaultTheme, storageKey, resolveTheme, applyTheme])

  // Listen for system theme changes
  useEffect(() => {
    if (!isClient) return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (theme === 'system') {
        const resolved = resolveTheme('system')
        applyTheme(resolved)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme, isClient, resolveTheme, applyTheme])

  // Update resolved theme when theme changes
  useEffect(() => {
    if (isClient) {
      const resolved = resolveTheme(theme)
      setResolvedTheme(resolved)
    }
  }, [theme, isClient, resolveTheme])

  const value: ThemeProviderContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

// Theme toggle component
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className={`p-2 rounded-lg border border-gray-300 dark:border-gray-600 ${className}`}
        disabled
      >
        <div className="w-5 h-5 animate-pulse bg-gray-300 rounded" />
      </button>
    )
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {resolvedTheme === 'dark' ? (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>
      
      {/* Optional: Theme selector dropdown */}
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  )
}