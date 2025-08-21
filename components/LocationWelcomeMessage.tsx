// components/LocationWelcomeMessage.tsx
'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { 
  MapPin, 
  Globe, 
  X, 
  Heart, 
  Coffee,
  Sun,
  Mountain,
  Waves,
  Building2,
  TreePine,
  Sparkles,
  Clock,
  Eye,
  Palette
} from 'lucide-react'

// Enhanced location hook with proper cleanup
import { 
  useUserLocation, 
  getTimeGreeting, 
  getCurrentTimeInTimezone, 
  getCountryFlag,
  type LocationData 
} from '@/hooks/useUserLocation'

interface WelcomeMessage {
  greeting: string
  message: string
  emoji: string
  icon: React.ElementType
  color: string
}

interface LocationWelcomeMessageProps {
  onClose?: () => void
}

const LocationWelcomeMessage: React.FC<LocationWelcomeMessageProps> = ({ onClose }) => {
  // Enhanced location hook with memory leak prevention
  const { 
    data: location, 
    loading: locationLoading, 
    error: locationError,
    refetch,
    clearCache 
  } = useUserLocation({
    enableCaching: true,
    cacheExpiry: 30 * 60 * 1000, // 30 minutes
    fallbackToNavigatorAPI: true,
    retryAttempts: 1, // Reduced retry attempts to prevent spam
    onSuccess: (data) => {
      console.log('Location loaded:', data.city, data.country)
    },
    onError: (error) => {
      console.warn('Location error:', error)
    }
  })
  
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  
  const prefersReducedMotion = useReducedMotion()
  
  // Refs for cleanup
  const visibilityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const autoDismissTimerRef = useRef<NodeJS.Timeout | null>(null)
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup function
  const cleanupTimers = useCallback(() => {
    if (visibilityTimerRef.current) {
      clearTimeout(visibilityTimerRef.current)
      visibilityTimerRef.current = null
    }
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current)
      autoDismissTimerRef.current = null
    }
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current)
      timeUpdateIntervalRef.current = null
    }
  }, [])

  // Set mounted state
  useEffect(() => {
    setMounted(true)
    return cleanupTimers
  }, [cleanupTimers])

  // Check if user has already dismissed the message today
  useEffect(() => {
    if (!mounted) return
    
    try {
      const dismissedDate = localStorage.getItem('locationWelcomeDismissed')
      const today = new Date().toDateString()
      
      if (dismissedDate === today) {
        console.log('Welcome message already dismissed today')
        setIsDismissed(true)
        return
      }
    } catch (error) {
      console.warn('LocalStorage not available:', error)
    }
  }, [mounted])

  // Show message when location data is ready - WITH PROPER CLEANUP
  useEffect(() => {
    if (isDismissed || !mounted || locationLoading || !location) return

    // Clear any existing timer
    if (visibilityTimerRef.current) {
      clearTimeout(visibilityTimerRef.current)
    }

    // Show message after location is loaded
    visibilityTimerRef.current = setTimeout(() => {
      console.log('Showing welcome message for:', location.city)
      setIsVisible(true)
    }, 1500)
    
    return () => {
      if (visibilityTimerRef.current) {
        clearTimeout(visibilityTimerRef.current)
      }
    }
  }, [isDismissed, mounted, locationLoading, location])

  // Update current time - WITH PROPER CLEANUP
  useEffect(() => {
    if (!location?.timezone || !mounted) return

    const updateTime = () => {
      try {
        const timeString = getCurrentTimeInTimezone(location.timezone)
        setCurrentTime(timeString)
      } catch (error) {
        console.warn('Error updating time:', error)
      }
    }

    updateTime()
    
    // Clear any existing interval
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current)
    }
    
    timeUpdateIntervalRef.current = setInterval(updateTime, 60000)
    
    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current)
      }
    }
  }, [location?.timezone, mounted])

  // Enhanced welcome message generator
  const generateWelcomeMessage = useCallback((locationData: LocationData): WelcomeMessage => {
    const { country, city, region, countryCode } = locationData
    const timeGreeting = getTimeGreeting(locationData.timezone)
    const flag = getCountryFlag(countryCode)
    
    // Country-specific messages with fallback
    const countryMessages: Record<string, WelcomeMessage> = {
      'US': {
        greeting: `${timeGreeting} from ${city}!`,
        message: `Welcome to my portfolio! It's great to connect with someone from ${region}. I hope you find my work inspiring! ${flag}`,
        emoji: flag,
        icon: Building2,
        color: 'from-blue-500 via-red-500 to-blue-600'
      },
      'CA': {
        greeting: `${timeGreeting} from ${city}!`,
        message: `Hello neighbor to the north! Thanks for visiting from beautiful ${city}. I'd love to collaborate on projects across borders! ${flag}`,
        emoji: flag,
        icon: Mountain,
        color: 'from-red-500 via-white to-red-600'
      },
      'GB': {
        greeting: `${timeGreeting} from ${city}!`,
        message: `Cheers from across the pond! Lovely to have a visitor from ${city}. Hope you enjoy browsing my work! ${flag}`,
        emoji: flag,
        icon: Building2,
        color: 'from-blue-700 via-white to-red-600'
      },
      // Add more countries as needed...
    }

    // City-specific overrides
    const cityMessages: Record<string, Partial<WelcomeMessage>> = {
      'New York': { message: `The city that never sleeps! I love the energy and innovation of NYC. 🗽` },
      'San Francisco': { message: `From one tech hub to another! Hope you're enjoying the Bay Area innovation scene. 🌉` },
      'Miami': { message: `Hey neighbor! We're practically in the same backyard. Let's grab a coffee sometime! ☕` },
      // Add more cities as needed...
    }

    // Get base message or fallback
    let welcomeMessage = countryMessages[countryCode] || {
      greeting: `${timeGreeting} from ${city}!`,
      message: `Welcome to my portfolio! It's amazing to connect with someone from ${city}, ${country}. Thanks for stopping by! ${flag}`,
      emoji: flag,
      icon: Globe,
      color: 'from-blue-500 via-purple-600 to-pink-600'
    }

    // Override with city-specific message if available
    if (cityMessages[city]) {
      welcomeMessage = {
        ...welcomeMessage,
        ...cityMessages[city]
      }
    }

    return welcomeMessage
  }, [])

  // Enhanced dismiss handler with proper cleanup
  const handleDismiss = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    console.log('Dismissing welcome message')
    
    // Clean up all timers
    cleanupTimers()
    
    setIsVisible(false)
    
    try {
      localStorage.setItem('locationWelcomeDismissed', new Date().toDateString())
    } catch (error) {
      console.warn('Could not save to localStorage:', error)
    }
    
    // Call parent onClose after animation
    setTimeout(() => {
      if (onClose) {
        onClose()
      }
      setIsDismissed(true)
    }, 300)
  }, [onClose, cleanupTimers])

  // Auto-dismiss with proper cleanup
  useEffect(() => {
    if (!isVisible || isDismissed) return
    
    // Clear any existing auto-dismiss timer
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current)
    }
    
    autoDismissTimerRef.current = setTimeout(() => {
      console.log('Auto-dismissing welcome message')
      handleDismiss()
    }, 8000)
    
    return () => {
      if (autoDismissTimerRef.current) {
        clearTimeout(autoDismissTimerRef.current)
      }
    }
  }, [isVisible, isDismissed, handleDismiss])

  // Enhanced navigation handlers
  const handleContactClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('Contact clicked')
    
    // Scroll to contact section
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      })
    }
    
    handleDismiss()
  }, [prefersReducedMotion, handleDismiss])

  const handleViewWorkClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('View work clicked')
    
    // Scroll to projects section
    const projectsSection = document.getElementById('projects')
    if (projectsSection) {
      projectsSection.scrollIntoView({ 
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      })
    }
    
    handleDismiss()
  }, [prefersReducedMotion, handleDismiss])

  // Manual retry handler with debouncing
  const handleRetryLocation = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('Retrying location fetch')
    try {
      clearCache()
      await refetch()
    } catch (error) {
      console.warn('Retry failed:', error)
    }
  }, [clearCache, refetch])

  // Don't render until mounted (prevents hydration issues)
  if (!mounted) return null
  
  // Error state with retry option
  if (locationError && !location) {
    return (
      <motion.div
        className="relative w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          
          <div className="relative z-10 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">Welcome to my portfolio!</h3>
                  <p className="text-sm text-white/80">Location detection failed</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Close welcome message"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-white/90 text-sm mb-4">
              I couldn't detect your location, but I'm excited you're here! Feel free to explore my work.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleRetryLocation}
                className="flex-1 py-2 px-4 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm font-semibold transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleViewWorkClick}
                className="flex-1 py-2 px-4 bg-white hover:bg-gray-50 rounded-xl text-gray-800 text-sm font-semibold transition-colors"
              >
                View Work
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }
  
  // Don't render if dismissed, still loading, or no location
  if (isDismissed || locationLoading || !location) return null

  const welcomeMessage = generateWelcomeMessage(location)
  const IconComponent = welcomeMessage.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="relative w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ 
            duration: prefersReducedMotion ? 0.2 : 0.4,
            ease: "easeOut"
          }}
        >
          <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl">
            {/* Enhanced gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${welcomeMessage.color}`} />
            
            {/* Glass overlay for readability */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            
            {/* Animated background pattern - with reduced motion support */}
            {!prefersReducedMotion && (
              <div className="absolute inset-0 opacity-20">
                <motion.div 
                  className="absolute top-2 right-4 w-16 h-16 rounded-full bg-white/20"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute bottom-4 left-6 w-12 h-12 rounded-full bg-white/15"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
              </div>
            )}

            <div className="relative z-10 p-6">
              {/* Header with location data */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <motion.div
                    className="p-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg"
                    initial={prefersReducedMotion ? {} : { rotate: 0 }}
                    animate={prefersReducedMotion ? {} : { rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <IconComponent className="w-5 h-5 text-white drop-shadow-sm" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white drop-shadow-sm truncate">
                      {welcomeMessage.greeting}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-white/90 font-medium">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{location.city}, {location.region}</span>
                      {currentTime && (
                        <>
                          <span className="text-white/70">•</span>
                          <span className="flex-shrink-0">{currentTime}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Close button */}
                <motion.button
                  onClick={handleDismiss}
                  className="flex-shrink-0 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white shadow-lg transition-all duration-200 ml-3"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  aria-label="Close welcome message"
                  type="button"
                >
                  <X className="w-4 h-4 drop-shadow-sm" />
                </motion.button>
              </div>

              {/* Message content */}
              <div className="space-y-4">
                <p className="text-white/95 text-sm leading-relaxed font-medium drop-shadow-sm">
                  {welcomeMessage.message}
                </p>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <Clock className="w-4 h-4 text-white/90 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-white/80 font-medium">Local Time</p>
                      <p className="text-sm text-white font-semibold drop-shadow-sm truncate">
                        {currentTime || 'Loading...'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <Globe className="w-4 h-4 text-white/90 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-white/80 font-medium">Country</p>
                      <p className="text-sm text-white font-semibold drop-shadow-sm truncate">
                        {location.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    onClick={handleViewWorkClick}
                    className="flex-1 py-2.5 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl text-white text-sm font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -1 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                    type="button"
                  >
                    <Palette className="w-4 h-4 flex-shrink-0" />
                    <span>View Work</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={handleContactClick}
                    className="flex-1 py-2.5 px-4 bg-white text-blue-600 hover:bg-gray-50 rounded-xl text-sm font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -1 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                    type="button"
                  >
                    <Coffee className="w-4 h-4 flex-shrink-0" />
                    <span>Let's Connect</span>
                  </motion.button>
                </div>
              </div>

              {/* Built with indicator */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-center text-xs text-white/70 font-medium">
                  Built with ❤️ in Miami, FL
                </p>
              </div>
            </div>

            {/* Auto-dismiss progress indicator */}
            <div className="absolute bottom-2 left-6 right-6">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="h-full bg-white/60 rounded-full origin-left"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 8, ease: "linear" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LocationWelcomeMessage