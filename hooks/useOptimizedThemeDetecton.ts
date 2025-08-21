// SSR Safe Optimized Theme Detection - Prevents Cascade Performance Issues
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export function useOptimizedThemeDetection() {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mounted, setMounted] = useState(false) // ✅ SSR safety
  const lastChangeTime = useRef(0)
  const changeTimeout = useRef<NodeJS.Timeout>()

  // ✅ SSR SAFE: Debounced theme change to prevent rapid updates
  const debouncedSetTheme = useCallback((newTheme: 'light' | 'dark') => {
    const now = Date.now()
        
    // ✅ PREVENT rapid theme changes (less than 300ms apart)
    if (now - lastChangeTime.current < 300) {
      clearTimeout(changeTimeout.current)
      changeTimeout.current = setTimeout(() => {
        debouncedSetTheme(newTheme)
      }, 300)
      return
    }

    lastChangeTime.current = now
        
    if (currentTheme === newTheme) return // ✅ SKIP if no change
        
    setIsTransitioning(true)
        
    // ✅ DELAY theme state update to allow smooth transition
    requestAnimationFrame(() => {
      setCurrentTheme(newTheme)
            
      // ✅ END transition after animation completes
      setTimeout(() => {
        setIsTransitioning(false)
      }, 200) // Shorter than your CSS transitions
    })
  }, [currentTheme])

  // ✅ SSR SAFE: Set mounted flag
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // ✅ SSR SAFE: Only run on client after mounted
    if (!mounted || typeof window === 'undefined') return

    const detectTheme = () => {
      if (isTransitioning) return // ✅ SKIP detection during transitions
            
      try {
        const htmlElement = document.documentElement
        const hasExplicitDarkClass = htmlElement.classList.contains('dark')
        const hasExplicitLightClass = htmlElement.classList.contains('light')
            
        let detectedTheme: 'light' | 'dark'
            
        if (hasExplicitDarkClass) {
          detectedTheme = 'dark'
        } else if (hasExplicitLightClass) {
          detectedTheme = 'light'  
        } else {
          // ✅ PERFORMANCE: Use matchMedia directly, no event listener
          detectedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
            
        debouncedSetTheme(detectedTheme)
      } catch (error) {
        console.warn('Theme detection failed:', error)
        // ✅ FALLBACK to light theme
        debouncedSetTheme('light')
      }
    }

    // ✅ PERFORMANCE: Throttled mutation observer
    let observerTimeout: NodeJS.Timeout
    const observer = new MutationObserver(() => {
      clearTimeout(observerTimeout)
      observerTimeout = setTimeout(detectTheme, 50) // ✅ THROTTLE
    })
        
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // ✅ PERFORMANCE: Throttled media query listener
    let mediaTimeout: NodeJS.Timeout
    let mediaQuery: MediaQueryList | null = null
    
    try {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const mediaHandler = () => {
        clearTimeout(mediaTimeout)
        mediaTimeout = setTimeout(detectTheme, 50) // ✅ THROTTLE
      }
      
      mediaQuery.addEventListener('change', mediaHandler)
    } catch (error) {
      console.warn('Media query listener setup failed:', error)
    }

    // Initial detection
    detectTheme()

    return () => {
      clearTimeout(observerTimeout)
      clearTimeout(mediaTimeout)
      clearTimeout(changeTimeout.current)
      observer.disconnect()
      
      if (mediaQuery) {
        try {
          mediaQuery.removeEventListener('change', () => {})
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    }
  }, [debouncedSetTheme, isTransitioning, mounted])

  return {
    currentTheme,
    isTransitioning,
    mounted, // ✅ Expose mounted state
    // ✅ STABLE reference - won't cause re-renders
    isLight: currentTheme === 'light',
    isDark: currentTheme === 'dark'
  }
}

// ✅ SSR SAFE: Simple theme detection hook without complex features
export function useSimpleThemeDetection(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    const detectTheme = () => {
      try {
        const htmlElement = document.documentElement
        if (htmlElement.classList.contains('dark')) {
          setTheme('dark')
        } else if (htmlElement.classList.contains('light')) {
          setTheme('light')
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          setTheme(prefersDark ? 'dark' : 'light')
        }
      } catch (error) {
        setTheme('light') // Safe fallback
      }
    }

    detectTheme()

    // Simple observer for class changes
    const observer = new MutationObserver(detectTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [mounted])

  return theme
}

// ✅ SSR SAFE: Utility function for one-time theme detection
export function getThemeOnce(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'

  try {
    const htmlElement = document.documentElement
    if (htmlElement.classList.contains('dark')) return 'dark'
    if (htmlElement.classList.contains('light')) return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch (error) {
    return 'light'
  }
}