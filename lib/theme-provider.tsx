// lib/theme-provider.tsx - Enhanced Theme Provider for consistent theming
'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'dark' | 'light'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  systemTheme: 'dark' | 'light'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  enableSystem = true,
  disableTransitionOnChange = false
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>('light')
  const [mounted, setMounted] = useState(false)

  // Determine the resolved theme (actual theme being used)
  const resolvedTheme = theme === 'system' ? systemTheme : theme

  // Update system theme based on media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    }

    // Set initial system theme
    updateSystemTheme()

    // Listen for changes
    mediaQuery.addEventListener('change', updateSystemTheme)

    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [])

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme
      if (storedTheme && ['dark', 'light', 'system'].includes(storedTheme)) {
        setThemeState(storedTheme)
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error)
    }
    setMounted(true)
  }, [storageKey])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement

    // Disable transitions temporarily if requested
    if (disableTransitionOnChange) {
      const style = document.createElement('style')
      style.innerHTML = `
        *, *::before, *::after {
          transition: none !important;
          animation-duration: 0s !important;
        }
      `
      document.head.appendChild(style)
      
      // Remove the style after a short delay
      setTimeout(() => {
        document.head.removeChild(style)
      }, 100)
    }

    // Apply theme classes
    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
    
    // Set color-scheme for native elements
    root.style.colorScheme = resolvedTheme

    // Apply CSS custom properties for theme-aware styling
    if (resolvedTheme === 'dark') {
      root.style.setProperty('--theme-bg', '#0f172a')
      root.style.setProperty('--theme-fg', '#f8fafc')
      root.style.setProperty('--theme-border', 'rgba(255, 255, 255, 0.1)')
      root.style.setProperty('--theme-glass-bg', 'rgba(0, 0, 0, 0.1)')
      root.style.setProperty('--theme-glass-border', 'rgba(255, 255, 255, 0.1)')
      root.style.setProperty('--theme-card-bg', 'rgba(0, 0, 0, 0.8)')
    } else {
      root.style.setProperty('--theme-bg', '#ffffff')
      root.style.setProperty('--theme-fg', '#0f172a')
      root.style.setProperty('--theme-border', 'rgba(0, 0, 0, 0.1)')
      root.style.setProperty('--theme-glass-bg', 'rgba(255, 255, 255, 0.1)')
      root.style.setProperty('--theme-glass-border', 'rgba(255, 255, 255, 0.2)')
      root.style.setProperty('--theme-card-bg', 'rgba(255, 255, 255, 0.8)')
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#0f172a' : '#ffffff')
    }

  }, [resolvedTheme, mounted, disableTransitionOnChange])

  // Set theme and persist to localStorage
  const setTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme)
      setThemeState(newTheme)
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
      setThemeState(newTheme)
    }
  }, [storageKey])

  // Toggle between light and dark (ignores system)
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }, [resolvedTheme, setTheme])

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    systemTheme
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className="contents">{children}</div>
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Higher-order component for theme-aware components
export function withTheme<P extends object>(Component: React.ComponentType<P>) {
  return function ThemedComponent(props: P) {
    const theme = useTheme()
    return <Component {...props} theme={theme} />
  }
}

// Hook for theme-aware styling
export function useThemeStyles() {
  const { resolvedTheme } = useTheme()
  
  return {
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    resolvedTheme,
    
    // Glass morphism styles
    glass: {
      background: resolvedTheme === 'dark' 
        ? 'rgba(0, 0, 0, 0.1)' 
        : 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      border: resolvedTheme === 'dark'
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : '1px solid rgba(255, 255, 255, 0.2)'
    },
    
    // Card styles
    card: {
      background: resolvedTheme === 'dark'
        ? 'rgba(31, 41, 55, 0.9)'
        : 'rgba(255, 255, 255, 0.9)',
      border: resolvedTheme === 'dark'
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : '1px solid rgba(0, 0, 0, 0.1)'
    },
    
    // Navigation styles
    nav: {
      background: resolvedTheme === 'dark'
        ? 'rgba(31, 41, 55, 0.8)'
        : 'rgba(255, 255, 255, 0.8)',
      border: resolvedTheme === 'dark'
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : '1px solid rgba(0, 0, 0, 0.1)'
    }
  }
}

// Theme-aware CSS class utility - FIXED VERSION
export function themeClass(lightClass: string, darkClass: string, resolvedTheme?: 'light' | 'dark') {
  // If resolvedTheme is provided, use it directly without calling useTheme
  if (resolvedTheme) {
    return resolvedTheme === 'dark' ? darkClass : lightClass
  }
  
  // If no resolvedTheme provided, this function can't be used outside of a React component
  throw new Error('themeClass: resolvedTheme parameter is required when called outside a React component. Use useThemeClass hook instead.')
}

// New custom hook for theme-aware CSS classes
export function useThemeClass() {
  const { resolvedTheme } = useTheme()
  
  return (lightClass: string, darkClass: string) => {
    return resolvedTheme === 'dark' ? darkClass : lightClass
  }
}

// Theme transition utility
export function withThemeTransition(element: HTMLElement, duration = 300) {
  const originalTransition = element.style.transition
  element.style.transition = `background-color ${duration}ms ease, color ${duration}ms ease, border-color ${duration}ms ease`
  
  return () => {
    element.style.transition = originalTransition
  }
}