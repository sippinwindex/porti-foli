// components/Navigation.tsx - FIXED VERSION
'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { 
  Home, 
  User, 
  FolderOpen, 
  MessageCircle, 
  BookOpen, 
  Gamepad2, 
  Github, 
  Linkedin, 
  Mail, 
  Menu, 
  X,
  ExternalLink,
  Twitter,
  FileText,
  Calendar,
  Briefcase,
  Sun,
  Moon
} from 'lucide-react'

interface NavItem {
  id: string
  name: string
  label: string
  href: string
  icon: React.ElementType
  external?: boolean
  description?: string
}

interface SocialLink {
  platform: string
  name: string
  href: string
  icon: React.ElementType
  external?: boolean
  description?: string
  color: string
}

const Navigation: React.FC = () => {
  // ✅ FIXED: Proper state management
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState('home')
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  
  // Hooks
  const router = useRouter()
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const shouldReduceMotion = useReducedMotion()
  
  // Refs
  const navRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  
  // ✅ FIXED: Stable scroll progress
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  // ✅ FIXED: Robust theme initialization
  useEffect(() => {
    setMounted(true)
    
    const initializeTheme = () => {
      try {
        const savedTheme = localStorage.getItem('theme')
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const shouldUseDarkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
        
        setDarkMode(shouldUseDarkMode)
        
        // Apply theme immediately
        if (shouldUseDarkMode) {
          document.documentElement.classList.add('dark')
          document.documentElement.style.colorScheme = 'dark'
        } else {
          document.documentElement.classList.remove('dark')
          document.documentElement.style.colorScheme = 'light'
        }
      } catch (error) {
        console.warn('Theme initialization failed:', error)
        setDarkMode(false)
        document.documentElement.classList.remove('dark')
        document.documentElement.style.colorScheme = 'light'
      }
    }

    initializeTheme()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches)
        if (e.matches) {
          document.documentElement.classList.add('dark')
          document.documentElement.style.colorScheme = 'dark'
        } else {
          document.documentElement.classList.remove('dark')
          document.documentElement.style.colorScheme = 'light'
        }
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [])

  // ✅ FIXED: Theme toggle
  const toggleTheme = useCallback(() => {
    try {
      const newDarkMode = !darkMode
      setDarkMode(newDarkMode)
      
      if (newDarkMode) {
        document.documentElement.classList.add('dark')
        document.documentElement.style.colorScheme = 'dark'
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.style.colorScheme = 'light'
        localStorage.setItem('theme', 'light')
      }
    } catch (error) {
      console.warn('Theme toggle failed:', error)
    }
  }, [darkMode])

  // ✅ FIXED: Navigation items with proper section mapping
  const navigationItems: NavItem[] = useMemo(() => [
    { 
      id: 'hero', // Changed from 'home' to 'hero' to match section IDs
      name: 'Home', 
      label: 'Home', 
      href: '/', 
      icon: Home, 
      description: 'Welcome page' 
    },
    { 
      id: 'about', 
      name: 'About', 
      label: 'About', 
      href: '/#about', // Updated to scroll to section
      icon: User, 
      description: 'Learn about me' 
    },
    { 
      id: 'projects', 
      name: 'Projects', 
      label: 'Projects', 
      href: '/#projects', // Updated to scroll to section
      icon: FolderOpen, 
      description: 'My work' 
    },
    { 
      id: 'experience', 
      name: 'Experience', 
      label: 'Experience', 
      href: '/#experience', 
      icon: Calendar, 
      description: 'My professional journey' 
    },
    { 
      id: 'blog', 
      name: 'Blog', 
      label: 'Blog', 
      href: '/blog', 
      icon: BookOpen, 
      description: 'Thoughts & tutorials' 
    },
    { 
      id: 'contact', 
      name: 'Contact', 
      label: 'Contact', 
      href: '/#contact', 
      icon: MessageCircle, 
      description: 'Get in touch' 
    }
  ], [])

  // Social links
  const socialLinks: SocialLink[] = useMemo(() => [
    { 
      platform: 'GitHub',
      name: 'GitHub', 
      href: 'https://github.com/sippinwindex', 
      icon: Github, 
      external: true,
      description: 'View my code',
      color: 'hover:text-gray-700 dark:hover:text-gray-300'
    },
    { 
      platform: 'LinkedIn',
      name: 'LinkedIn', 
      href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/', 
      icon: Linkedin, 
      external: true,
      description: 'Professional profile',
      color: 'hover:text-blue-600 dark:hover:text-blue-400'
    },
    { 
      platform: 'Twitter',
      name: 'Twitter', 
      href: 'https://x.com/FullyStackedUp', 
      icon: Twitter, 
      external: true,
      description: 'Follow me on Twitter',
      color: 'hover:text-sky-500 dark:hover:text-sky-400'
    }
  ], [])

  // ✅ FIXED: Debounced scroll detection
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null
    
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrollY / Math.max(maxScroll, 1), 1)
      
      setScrolled(scrollY > 20) // Reduced threshold
      setScrollProgress(progress)
      
      // Clear any existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      
      // Set new timeout to detect when scrolling stops
      scrollTimeout = setTimeout(() => {
        // This runs when scrolling has stopped
      }, 150)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [])

  // ✅ FIXED: Better section detection
  useEffect(() => {
    if (pathname !== '/') {
      // Set current section based on pathname
      if (pathname === '/blog') {
        setCurrentSection('blog')
        return
      }
      // Handle other paths...
      return
    }

    // Only do intersection observer on home page
    const sections = ['hero', 'about', 'projects', 'experience', 'contact']
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-10% 0px -60% 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      // Find the section with the highest intersection ratio
      let maxRatio = 0
      let activeSection = 'hero'
      
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio
          activeSection = entry.target.id
        }
      })
      
      if (maxRatio > 0) {
        setCurrentSection(activeSection)
      }
    }, observerOptions)

    const elements: Element[] = []
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
        elements.push(element)
      }
    })

    return () => {
      elements.forEach(element => observer.unobserve(element))
      observer.disconnect()
    }
  }, [pathname])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // ✅ FIXED: Navigation handler with proper section scrolling
  const handleNavigation = useCallback((href: string, id: string) => {
    setIsOpen(false)
    
    if (href.startsWith('/#') && pathname === '/') {
      // Scroll to section on same page
      const targetId = href.replace('/#', '')
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ 
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start' 
        })
        // Update URL without causing navigation
        window.history.replaceState(null, '', href)
        setCurrentSection(targetId)
      }
    } else {
      // Navigate to different page
      router.push(href)
    }
  }, [router, pathname, prefersReducedMotion])

  // ✅ FIXED: Active path detection
  const isActivePath = useCallback((href: string, id: string) => {
    if (pathname !== '/') {
      return pathname === href
    }
    
    // On home page, check current section
    if (href.startsWith('/#')) {
      const sectionId = href.replace('/#', '')
      return currentSection === sectionId
    }
    
    return currentSection === id
  }, [pathname, currentSection])

  // Theme Toggle Component
  const ThemeToggleComponent = React.memo(() => {
    if (!mounted) {
      return (
        <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      )
    }

    return (
      <motion.button
        onClick={toggleTheme}
        className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-viva-magenta-500 focus:ring-offset-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        whileTap={{ scale: 0.95 }}
        aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center"
          animate={{
            x: darkMode ? 24 : 2,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          {darkMode ? (
            <Moon className="w-3 h-3 text-viva-magenta-500" />
          ) : (
            <Sun className="w-3 h-3 text-lux-gold-500" />
          )}
        </motion.div>
      </motion.button>
    )
  })
  ThemeToggleComponent.displayName = 'ThemeToggleComponent'

  // Navigation Link Component
  const NavLink = React.memo<{
    item: NavItem
    index: number
    isMobile?: boolean
  }>(({ item, index, isMobile = false }) => {
    const isActive = isActivePath(item.href, item.id)
    const IconComponent = item.icon

    const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      handleNavigation(item.href, item.id)
    }, [item.href, item.id])

    return (
      <motion.div
        className="relative group"
        initial={{ opacity: 0, y: isMobile ? 20 : -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: shouldReduceMotion ? 0 : index * 0.1, 
          duration: shouldReduceMotion ? 0.2 : 0.6 
        }}
      >
        <motion.a
          href={item.href}
          onClick={handleClick}
          className={`
            relative flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-300 cursor-pointer select-none
            ${isActive 
              ? 'text-white bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 shadow-lg' 
              : 'text-gray-600 dark:text-gray-300 hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
            }
            ${isMobile ? 'text-lg justify-start w-full' : 'text-sm'}
          `}
          whileHover={{ 
            scale: shouldReduceMotion ? 1 : 1.05, 
            y: shouldReduceMotion ? 0 : -2 
          }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
        >
          <motion.div
            className="flex-shrink-0 pointer-events-none"
            animate={isActive && !shouldReduceMotion ? { 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <IconComponent className="w-5 h-5" />
          </motion.div>
          
          <span className={`pointer-events-none ${isMobile ? 'block' : 'hidden lg:block'}`}>
            {item.label}
          </span>

          {isMobile && item.description && (
            <div className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
              {item.description}
            </div>
          )}

          {item.external && <ExternalLink className="w-4 h-4 ml-auto" />}

          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-viva-magenta-600/20 to-lux-gold-600/20 border border-viva-magenta-500/30 pointer-events-none"
              layoutId="activeNavItem"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.a>
      </motion.div>
    )
  })
  NavLink.displayName = 'NavLink'

  // Social Link Component
  const SocialLink = React.memo<{
    social: SocialLink
    index: number
  }>(({ social, index }) => {
    const IconComponent = social.icon

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          delay: shouldReduceMotion ? 0 : 0.5 + index * 0.1, 
          type: "spring", 
          stiffness: 300
        }}
      >
        <motion.a
          href={social.href}
          target={social.external ? '_blank' : undefined}
          rel={social.external ? 'noopener noreferrer' : undefined}
          className={`
            block w-11 h-11 rounded-xl border border-gray-200/50 dark:border-gray-700/50
            flex items-center justify-center transition-all duration-300
            hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:border-viva-magenta-300 dark:hover:border-viva-magenta-600 ${social.color}
            bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md
          `}
          whileHover={{ 
            y: shouldReduceMotion ? 0 : -3,
            scale: shouldReduceMotion ? 1 : 1.1
          }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.9 }}
          title={social.description}
          aria-label={`Visit ${social.platform} profile`}
        >
          <IconComponent className="w-5 h-5 pointer-events-none" />
        </motion.a>
      </motion.div>
    )
  })
  SocialLink.displayName = 'SocialLink'

  // Loading state
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-[1000] px-4 sm:px-6 lg:px-8 py-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="hidden lg:flex items-center gap-6">
              <div className="w-96 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* ✅ FIXED: Properly spaced navbar */}
      <motion.nav 
        ref={navRef}
        className={`
          fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ease-out
          ${scrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg' 
            : 'bg-transparent'
          }
        `}
        style={{ 
          height: '5rem',
          minHeight: '5rem',
          maxHeight: '5rem'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 h-full"> {/* ✅ FIXED: Better padding */}
          <div className="flex items-center justify-between h-full">
            
            {/* ✅ FIXED: Logo with proper spacing */}
            <Link 
              href="/" 
              className="flex items-center gap-4 text-xl font-bold text-gray-900 dark:text-gray-50 hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400 transition-colors z-10 relative" // ✅ Increased gap
              onClick={() => {
                if (pathname === '/') {
                  setCurrentSection('hero')
                  document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              <motion.div 
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-viva-magenta-500 to-lux-gold-500 flex items-center justify-center text-white font-bold text-sm shadow-lg"
                animate={!shouldReduceMotion ? { 
                  boxShadow: [
                    "0 0 20px rgba(190, 24, 93, 0.3)",
                    "0 0 30px rgba(212, 175, 55, 0.3)",
                    "0 0 20px rgba(190, 24, 93, 0.3)"
                  ]
                } : {}}
                transition={{ duration: 3, repeat: Infinity }}
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
              >
                JF
              </motion.div>
              <span className="hidden sm:block">Juan Fernandez</span>
            </Link>

            {/* ✅ FIXED: Desktop Navigation with proper spacing */}
            <div className="hidden lg:flex items-center gap-10"> {/* ✅ Increased gap */}
              <div 
                className="flex items-center gap-2 rounded-xl p-2"
                style={{
                  background: darkMode 
                    ? 'rgba(31, 41, 55, 0.8)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                }}
              >
                {navigationItems.map((item, index) => (
                  <NavLink key={item.id} item={item} index={index} />
                ))}
              </div>
            </div>

            {/* ✅ FIXED: Desktop Social Links & Controls with proper spacing */}
            <div className="hidden lg:flex items-center gap-6"> {/* ✅ Increased gap */}
              <div className="flex items-center gap-4"> {/* ✅ Increased gap */}
                {socialLinks.map((social, index) => (
                  <SocialLink key={social.platform} social={social} index={index} />
                ))}
              </div>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
              
              <ThemeToggleComponent />

              {/* ✅ Email Button with margin */}
              <motion.a
                href="mailto:jafernandez94@gmail.com"
                className="relative group p-3 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ml-2" // ✅ Added margin
                whileHover={{ 
                  scale: shouldReduceMotion ? 1 : 1.05, 
                  y: shouldReduceMotion ? 0 : -2 
                }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                title="Send me an email"
                aria-label="Contact via email"
              >
                <Mail className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-viva-magenta-500 to-lux-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                />
              </motion.a>
            </div>

            {/* ✅ FIXED: Mobile controls with proper spacing */}
            <div className="flex lg:hidden items-center gap-4"> {/* ✅ Increased gap */}
              <ThemeToggleComponent />
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-20 relative"
                aria-label="Toggle mobile menu"
              >
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>

        {/* ✅ FIXED: Stable scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-viva-magenta-500 to-lux-gold-500 origin-left z-[1001]"
          style={{ 
            scaleX,
            boxShadow: shouldReduceMotion ? 'none' : `0 0 10px rgba(190, 24, 93, 0.6)`
          }}
        />
      </motion.nav>

      {/* Mobile Menu (unchanged from your version) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              ref={mobileMenuRef}
              className="fixed top-20 right-4 left-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl z-[1000] lg:hidden overflow-hidden max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
              <div className="p-6">
                <div className="space-y-2 mb-6">
                  {navigationItems.map((item, index) => (
                    <NavLink 
                      key={item.id} 
                      item={item} 
                      index={index} 
                      isMobile={true}
                    />
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    {socialLinks.map((social, index) => (
                      <SocialLink key={social.platform} social={social} index={index} />
                    ))}
                  </div>
                  
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.3 }}
                  >
                    <motion.a
                      href="mailto:jafernandez94@gmail.com"
                      className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white font-semibold rounded-xl shadow-lg"
                      whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                      whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                    >
                      <Mail className="w-5 h-5" />
                      <span>Send Email</span>
                    </motion.a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation