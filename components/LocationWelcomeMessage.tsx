'use client'

import React, { useState, useEffect, useCallback } from 'react'
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

// ✅ UPDATED: Import the enhanced location hook and utilities
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
  // ✅ UPDATED: Use the enhanced location hook with custom options
  const { 
    data: location, 
    loading: locationLoading, 
    error: locationError,
    refetch,
    clearCache 
  } = useUserLocation({
    enableCaching: true,
    cacheExpiry: 30 * 60 * 1000, // 30 minutes for welcome messages
    fallbackToNavigatorAPI: true,
    onSuccess: (data) => {
      console.log('LocationWelcomeMessage: Location loaded successfully:', data.city, data.country)
    },
    onError: (error) => {
      console.warn('LocationWelcomeMessage: Location error:', error)
    }
  })
  
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  
  const prefersReducedMotion = useReducedMotion()

  // ✅ Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ Check if user has already dismissed the message today
  useEffect(() => {
    if (!mounted) return
    
    try {
      const dismissedDate = localStorage.getItem('locationWelcomeDismissed')
      const today = new Date().toDateString()
      
      if (dismissedDate === today) {
        console.log('LocationWelcomeMessage: Already dismissed today')
        setIsDismissed(true)
        return
      }
    } catch (error) {
      console.warn('LocalStorage not available:', error)
    }
  }, [mounted])

  // ✅ Show message when location data is ready
  useEffect(() => {
    if (isDismissed || !mounted || locationLoading || !location) return

    // Show message after location is loaded
    const timer = setTimeout(() => {
      console.log('LocationWelcomeMessage: Showing welcome message for:', location.city)
      setIsVisible(true)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [isDismissed, mounted, locationLoading, location])

  // ✅ Update current time using your utility function
  useEffect(() => {
    if (!location?.timezone || !mounted) return

    const updateTime = () => {
      const timeString = getCurrentTimeInTimezone(location.timezone)
      setCurrentTime(timeString)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [location?.timezone, mounted])

  // ✅ Enhanced welcome message generator using your location data
  const generateWelcomeMessage = useCallback((locationData: LocationData): WelcomeMessage => {
    const { country, city, region, countryCode } = locationData
    const timeGreeting = getTimeGreeting(locationData.timezone)
    const flag = getCountryFlag(countryCode)
    
    // Country-specific messages
    const countryMessages: Record<string, WelcomeMessage> = {
      'US': {
        greeting: `${timeGreeting} from ${city}!`,
        message: `Welcome to my portfolio! It's great to connect with someone from the ${region === city ? 'great state of' : ''} ${region}. I hope you find my work inspiring! ${flag}`,
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
      'AU': {
        greeting: `G'day from ${city}!`,
        message: `Thanks for stopping by from down under! ${city} looks amazing from here. Let's build something great together! ${flag}`,
        emoji: flag,
        icon: Sun,
        color: 'from-blue-600 via-yellow-400 to-green-600'
      },
      'DE': {
        greeting: `Guten Tag from ${city}!`,
        message: `Wonderful to connect with someone from ${city}! I admire German engineering and would love to collaborate. ${flag}`,
        emoji: flag,
        icon: Building2,
        color: 'from-black via-red-500 to-yellow-500'
      },
      'FR': {
        greeting: `Bonjour from ${city}!`,
        message: `Enchanté! It's a pleasure to have a visitor from beautiful ${city}. I hope my work inspires you! ${flag}`,
        emoji: flag,
        icon: Heart,
        color: 'from-blue-600 via-white to-red-600'
      },
      'JP': {
        greeting: `こんにちは from ${city}!`,
        message: `Arigatou gozaimasu for visiting from ${city}! I have great respect for Japanese innovation and design. ${flag}`,
        emoji: flag,
        icon: Mountain,
        color: 'from-red-600 via-white to-red-600'
      },
      'BR': {
        greeting: `Olá from ${city}!`,
        message: `Bem-vindo! Great to connect with someone from vibrant ${city}. Let's create something amazing together! ${flag}`,
        emoji: flag,
        icon: Sun,
        color: 'from-green-500 via-yellow-400 to-blue-600'
      },
      'IN': {
        greeting: `Namaste from ${city}!`,
        message: `Welcome! It's wonderful to have a visitor from ${city}. I'm excited about the incredible tech innovation in India! ${flag}`,
        emoji: flag,
        icon: Sparkles,
        color: 'from-orange-500 via-white to-green-600'
      },
      'MX': {
        greeting: `¡Hola from ${city}!`,
        message: `¡Bienvenidos! So happy to connect with someone from beautiful ${city}. Let's build something increíble! ${flag}`,
        emoji: flag,
        icon: Sun,
        color: 'from-green-600 via-white to-red-600'
      }
    }

    // City-specific messages for major cities
    const cityMessages: Record<string, Partial<WelcomeMessage>> = {
      'New York': { message: `The city that never sleeps! I love the energy and innovation of NYC. 🗽` },
      'San Francisco': { message: `From one tech hub to another! Hope you're enjoying the Bay Area innovation scene. 🌉` },
      'Los Angeles': { message: `City of Angels! Love the creative energy that flows from LA. 🌴` },
      'Miami': { message: `Hey neighbor! We're practically in the same backyard. Let's grab a coffee sometime! ☕` },
      'London': { message: `Brilliant! The tech scene in London is absolutely thriving. 🎡` },
      'Tokyo': { message: `Incredible tech innovation comes from Tokyo! Huge inspiration for my work. 🗼` },
      'Berlin': { message: `Amazing startup culture in Berlin! Would love to visit and collaborate. 🚀` },
      'Toronto': { message: `Toronto's tech scene is booming! Great to connect with my northern neighbors. 🍁` },
      'Sydney': { message: `Beautiful harbor city! The Australian tech scene is really impressive. 🏄‍♂️` },
      'Paris': { message: `The City of Light! French elegance meets modern innovation. ✨` }
    }

    // Get base message
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
        message: cityMessages[city].message || welcomeMessage.message
      }
    }

    return welcomeMessage
  }, [])

  // ✅ Enhanced dismiss handler
  const handleDismiss = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    console.log('LocationWelcomeMessage: Dismissing message')
    setIsVisible(false)
    
    try {
      localStorage.setItem('locationWelcomeDismissed', new Date().toDateString())
    } catch (error) {
      console.warn('Could not save to localStorage:', error)
    }
    
    // Call parent onClose
    setTimeout(() => {
      if (onClose) {
        onClose()
      }
      setIsDismissed(true)
    }, 300)
  }, [onClose])

  // ✅ Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!isVisible || isDismissed) return
    
    const timer = setTimeout(() => {
      console.log('LocationWelcomeMessage: Auto-dismissing')
      handleDismiss()
    }, 8000)
    
    return () => clearTimeout(timer)
  }, [isVisible, isDismissed, handleDismiss])

  // ✅ Enhanced contact handler
  const handleContactClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('LocationWelcomeMessage: Contact clicked')
    
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

  // ✅ Enhanced view work handler
  const handleViewWorkClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('LocationWelcomeMessage: View work clicked')
    
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

  // ✅ NEW: Manual retry handler for failed location requests
  const handleRetryLocation = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('LocationWelcomeMessage: Retrying location fetch')
    clearCache()
    await refetch()
  }, [clearCache, refetch])

  // Don't render until mounted
  if (!mounted) return null
  
  // ✅ UPDATED: Show error state with retry option
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
            {/* ✅ Enhanced gradient background with your color scheme */}
            <div className={`absolute inset-0 bg-gradient-to-br ${welcomeMessage.color}`} />
            
            {/* ✅ Better glass overlay for readability */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            
            {/* ✅ Subtle animated background pattern */}
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
                <motion.div 
                  className="absolute top-8 left-12 w-8 h-8 rounded-full bg-white/25"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.5, 0.25] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
              </div>
            )}

            <div className="relative z-10 p-6">
              {/* ✅ Header with location data */}
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

                {/* ✅ Close button */}
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

              {/* ✅ Enhanced message content */}
              <div className="space-y-4">
                <p className="text-white/95 text-sm leading-relaxed font-medium drop-shadow-sm">
                  {welcomeMessage.message}
                </p>

                {/* ✅ Enhanced info grid with your location data */}
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

                {/* ✅ Enhanced action buttons */}
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

              {/* ✅ Built with indicator */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-center text-xs text-white/70 font-medium">
                  Built with ❤️ in Miami, FL
                </p>
              </div>
            </div>

            {/* ✅ Auto-dismiss progress indicator */}
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

            {/* ✅ Enhanced floating particles */}
            {!prefersReducedMotion && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${30 + i * 20}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.3, 0.7, 0.3],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            )}

            {/* ✅ Animated border effect */}
            {!prefersReducedMotion && (
              <div className="absolute inset-0 rounded-2xl border-2 border-white/20 pointer-events-none">
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)'
                  }}
                  animate={{ 
                    background: [
                      'linear-gradient(0deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)',
                      'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)',
                      'linear-gradient(0deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LocationWelcomeMessage