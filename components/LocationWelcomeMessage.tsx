'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Sparkles
} from 'lucide-react'

interface LocationData {
  country: string
  countryCode: string
  region: string
  city: string
  timezone: string
  latitude: number
  longitude: number
  isp: string
}

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
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>('')

  // Check if user has already dismissed the message today
  useEffect(() => {
    const dismissedDate = localStorage.getItem('locationWelcomeDismissed')
    const today = new Date().toDateString()
    
    if (dismissedDate === today) {
      setIsDismissed(true)
      setIsLoading(false)
    }
  }, [])

  // Fetch location data
  useEffect(() => {
    if (isDismissed) return

    const fetchLocation = async () => {
      try {
        // Using ipapi.co for location data (free tier: 1000 requests/day)
        const response = await fetch('https://ipapi.co/json/')
        
        if (!response.ok) {
          throw new Error('Failed to fetch location')
        }
        
        const data = await response.json()
        
        const locationData: LocationData = {
          country: data.country_name || 'Unknown',
          countryCode: data.country_code || 'XX',
          region: data.region || 'Unknown',
          city: data.city || 'Unknown',
          timezone: data.timezone || 'UTC',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          isp: data.org || 'Unknown ISP'
        }
        
        setLocation(locationData)
        
        // Show message after a delay
        setTimeout(() => {
          setIsVisible(true)
        }, 2000)
        
      } catch (error) {
        console.warn('Could not fetch location data:', error)
        // Fallback to generic message
        setLocation({
          country: 'Earth',
          countryCode: 'XX', 
          region: 'Internet',
          city: 'Somewhere',
          timezone: 'UTC',
          latitude: 0,
          longitude: 0,
          isp: 'Unknown'
        })
        
        setTimeout(() => {
          setIsVisible(true)
        }, 2000)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocation()
  }, [isDismissed])

  // Update current time in user's timezone
  useEffect(() => {
    if (!location?.timezone) return

    const updateTime = () => {
      try {
        const now = new Date()
        const timeString = now.toLocaleTimeString('en-US', {
          timeZone: location.timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
        setCurrentTime(timeString)
      } catch (error) {
        setCurrentTime(new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }))
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [location?.timezone])

  // Generate personalized welcome message
  const generateWelcomeMessage = useCallback((locationData: LocationData): WelcomeMessage => {
    const { country, city, region, countryCode } = locationData
    const hour = new Date().getHours()
    
    // Time-based greetings
    let timeGreeting = 'Hello'
    if (hour < 12) timeGreeting = 'Good morning'
    else if (hour < 17) timeGreeting = 'Good afternoon'
    else timeGreeting = 'Good evening'

    // Country-specific messages
    const countryMessages: Record<string, WelcomeMessage> = {
      'US': {
        greeting: `${timeGreeting} from ${city}!`,
        message: `Welcome to my portfolio! It's great to connect with someone from the ${region === city ? 'great state of' : ''} ${region}. I hope you find my work inspiring! 🇺🇸`,
        emoji: '🇺🇸',
        icon: Building2,
        color: 'from-blue-600 to-red-600'
      },
      'CA': {
        greeting: `${timeGreeting} from ${city}!`,
        message: `Hello neighbor to the north! Thanks for visiting from beautiful ${city}. I'd love to collaborate on projects across borders! 🇨🇦`,
        emoji: '🇨🇦',
        icon: Mountain,
        color: 'from-red-600 to-red-700'
      },
      'GB': {
        greeting: `${timeGreeting} from ${city}!`,
        message: `Cheers from across the pond! Lovely to have a visitor from ${city}. Hope you enjoy browsing my work! 🇬🇧`,
        emoji: '🇬🇧',
        icon: Building2,
        color: 'from-blue-800 to-red-600'
      },
      'AU': {
        greeting: `G'day from ${city}!`,
        message: `Thanks for stopping by from down under! ${city} looks amazing from here. Let's build something great together! 🇦🇺`,
        emoji: '🇦🇺',
        icon: Sun,
        color: 'from-yellow-500 to-green-600'
      },
      'DE': {
        greeting: `Guten Tag from ${city}!`,
        message: `Wonderful to connect with someone from ${city}! I admire German engineering and would love to collaborate. 🇩🇪`,
        emoji: '🇩🇪',
        icon: Building2,
        color: 'from-gray-800 to-red-600'
      },
      'FR': {
        greeting: `Bonjour from ${city}!`,
        message: `Enchanté! It's a pleasure to have a visitor from beautiful ${city}. I hope my work inspires you! 🇫🇷`,
        emoji: '🇫🇷',
        icon: Heart,
        color: 'from-blue-600 to-red-600'
      },
      'JP': {
        greeting: `こんにちは from ${city}!`,
        message: `Arigatou gozaimasu for visiting from ${city}! I have great respect for Japanese innovation and design. 🇯🇵`,
        emoji: '🇯🇵',
        icon: Mountain,
        color: 'from-red-600 to-white'
      },
      'BR': {
        greeting: `Olá from ${city}!`,
        message: `Bem-vindo! Great to connect with someone from vibrant ${city}. Let's create something amazing together! 🇧🇷`,
        emoji: '🇧🇷',
        icon: Sun,
        color: 'from-green-500 to-yellow-500'
      },
      'IN': {
        greeting: `Namaste from ${city}!`,
        message: `Welcome! It's wonderful to have a visitor from ${city}. I'm excited about the incredible tech innovation in India! 🇮🇳`,
        emoji: '🇮🇳',
        icon: Sparkles,
        color: 'from-orange-500 to-green-600'
      },
      'MX': {
        greeting: `¡Hola from ${city}!`,
        message: `¡Bienvenidos! So happy to connect with someone from beautiful ${city}. Let's build something increíble! 🇲🇽`,
        emoji: '🇲🇽',
        icon: Sun,
        color: 'from-green-600 to-red-600'
      }
    }

    // City-specific messages for major cities
    const cityMessages: Record<string, Partial<WelcomeMessage>> = {
      'New York': { message: 'The city that never sleeps! I love the energy and innovation of NYC. 🗽' },
      'San Francisco': { message: 'From one tech hub to another! Hope you\'re enjoying the Bay Area innovation scene. 🌉' },
      'Los Angeles': { message: 'City of Angels! Love the creative energy that flows from LA. 🌴' },
      'Miami': { message: 'Hey neighbor! We\'re practically in the same backyard. Let\'s grab a coffee sometime! ☕' },
      'London': { message: 'Brilliant! The tech scene in London is absolutely thriving. 🎡' },
      'Tokyo': { message: 'Incredible tech innovation comes from Tokyo! Huge inspiration for my work. 🗼' },
      'Berlin': { message: 'Amazing startup culture in Berlin! Would love to visit and collaborate. 🚀' },
      'Toronto': { message: 'Toronto\'s tech scene is booming! Great to connect with my northern neighbors. 🍁' },
      'Sydney': { message: 'Beautiful harbor city! The Australian tech scene is really impressive. 🏄‍♂️' },
      'Paris': { message: 'The City of Light! French elegance meets modern innovation. ✨' }
    }

    // Get base message
    let welcomeMessage = countryMessages[countryCode] || {
      greeting: `${timeGreeting} from ${city}!`,
      message: `Welcome to my portfolio! It's amazing to connect with someone from ${city}, ${country}. Thanks for stopping by! 🌍`,
      emoji: '🌍',
      icon: Globe,
      color: 'from-blue-500 to-purple-600'
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

  // ✅ FIXED: Enhanced dismiss handler with proper event handling
  const handleDismiss = useCallback((e?: React.MouseEvent) => {
    // Prevent event bubbling if called from click event
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    console.log('LocationWelcomeMessage: Dismissing message')
    setIsVisible(false)
    localStorage.setItem('locationWelcomeDismissed', new Date().toDateString())
    
    // Call the onClose prop if provided (for parent component control)
    if (onClose) {
      onClose()
    }
    
    setTimeout(() => setIsDismissed(true), 300)
  }, [onClose])

  // ✅ FIXED: Enhanced contact handler with proper navigation
  const handleContactClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('LocationWelcomeMessage: Contact clicked')
    
    // Create and trigger email link
    const emailSubject = encodeURIComponent(`Hello from ${location?.city || 'a visitor'}!`)
    const emailBody = encodeURIComponent(`Hi Juan,\n\nI visited your portfolio from ${location?.city}, ${location?.region} and would love to connect!\n\nBest regards`)
    const emailUrl = `mailto:jafernandez94@gmail.com?subject=${emailSubject}&body=${emailBody}`
    
    // Open email client
    window.location.href = emailUrl
    
    // Dismiss the message after clicking
    setTimeout(() => handleDismiss(), 500)
  }, [location, handleDismiss])

  // ✅ FIXED: Enhanced view work handler with proper scrolling
  const handleViewWorkClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('LocationWelcomeMessage: View work clicked')
    
    // Scroll to projects section
    const projectsSection = document.getElementById('projects')
    if (projectsSection) {
      projectsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    } else {
      // Fallback: navigate to projects page if section not found
      window.location.href = '/projects'
    }
    
    // Dismiss the message
    handleDismiss()
  }, [handleDismiss])

  // Don't render if dismissed or still loading
  if (isDismissed || isLoading || !location) return null

  const welcomeMessage = generateWelcomeMessage(location)
  const IconComponent = welcomeMessage.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="relative w-full max-w-md z-20" // ✅ FIXED: Proper z-index below navbar
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.6 
          }}
        >
          <motion.div
            className={`
              relative overflow-hidden rounded-2xl border border-white/20 
              bg-gradient-to-br ${welcomeMessage.color} p-6 text-white shadow-2xl 
              backdrop-blur-xl
            `}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/20" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />
              <div className="absolute top-1/2 right-1/4 h-8 w-8 rounded-full bg-white/15" />
            </div>

            {/* ✅ FIXED: Enhanced dismiss button with proper event handling */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 rounded-full bg-white/20 p-2 transition-all duration-200 hover:bg-white/30 hover:scale-110 z-30 cursor-pointer"
              aria-label="Dismiss welcome message"
              type="button"
              style={{ 
                pointerEvents: 'auto',
                userSelect: 'none'
              }}
            >
              <X className="h-4 w-4 pointer-events-none" />
            </button>

            {/* Content */}
            <div className="relative">
              {/* Header */}
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-2">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {welcomeMessage.greeting}
                  </h3>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <MapPin className="h-3 w-3" />
                    <span>{location.city}, {location.region}</span>
                    {currentTime && (
                      <>
                        <span>•</span>
                        <span>{currentTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Message */}
              <p className="text-sm leading-relaxed opacity-95 mb-4">
                {welcomeMessage.message}
              </p>

              {/* ✅ FIXED: Enhanced action buttons with proper event handling */}
              <div className="flex gap-3">
                <motion.button
                  onClick={handleContactClick}
                  className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/30 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  style={{ 
                    pointerEvents: 'auto',
                    userSelect: 'none'
                  }}
                >
                  <Coffee className="h-4 w-4" />
                  <span>Let's Connect</span>
                </motion.button>
                
                <motion.button
                  onClick={handleViewWorkClick}
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/20 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  style={{ 
                    pointerEvents: 'auto',
                    userSelect: 'none'
                  }}
                >
                  <Waves className="h-4 w-4" />
                  <span>View Work</span>
                </motion.button>
              </div>

              {/* Small Credits */}
              <div className="mt-4 text-xs opacity-60">
                <span>Built with ❤️ in Miami, FL</span>
              </div>
            </div>

            {/* Enhanced Floating Particles for extra polish */}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LocationWelcomeMessage