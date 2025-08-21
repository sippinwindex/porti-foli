// Fixed Navigation Component with working page navigation
'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { 
  Home, 
  User, 
  FolderOpen, 
  MessageCircle, 
  Github, 
  Linkedin, 
  Mail, 
  Menu, 
  X,
  Twitter,
  Sun,
  Moon,
  BookOpen,
  Gamepad2,
  Settings
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

const FixedNavigation: React.FC = () => {
  // State
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  // Hooks
  const router = useRouter()
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  
  // Refs
  const navRef = useRef<HTMLElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  
  // Navigation items
  const navigationItems: NavItem[] = useMemo(() => [
    { 
      id: 'home',
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
      href: '/about',
      icon: User, 
      description: 'Learn about me' 
    },
    { 
      id: 'projects', 
      name: 'Projects', 
      label: 'Projects', 
      href: '/projects',
      icon: FolderOpen, 
      description: 'My work' 
    },
    { 
      id: 'blog', 
      name: 'Blog', 
      label: 'Blog', 
      href: '/blog',
      icon: BookOpen, 
      description: 'Latest articles' 
    },
    { 
      id: 'contact', 
      name: 'Contact', 
      label: 'Contact', 
      href: '/contact',
      icon: MessageCircle, 
      description: 'Get in touch' 
    },
    { 
      id: 'dino-game', 
      name: 'Game', 
      label: 'Game', 
      href: '/dino-game',
      icon: Gamepad2, 
      description: 'Synthwave Runner' 
    },
    { 
      id: 'admin', 
      name: 'Admin', 
      label: 'Admin', 
      href: '/admin',
      icon: Settings, 
      description: 'Admin panel' 
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

  // Theme initialization
  useEffect(() => {
    setMounted(true)
    
    const initializeTheme = () => {
      try {
        const savedTheme = localStorage.getItem('theme')
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const shouldUseDarkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
        
        setDarkMode(shouldUseDarkMode)
        
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
      }
    }

    initializeTheme()
  }, [])

  // Theme toggle
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

  // Scroll detection
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const windowHeight = window.innerHeight
          const documentHeight = document.documentElement.scrollHeight
          
          setScrolled(scrollY > 50)
          
          const maxScroll = documentHeight - windowHeight
          const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0
          setScrollProgress(progress)
          
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${progress})`
          }
          
          ticking = false
        })
        ticking = true
      }
    }
    
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Active path detection
  const isActivePath = useCallback((href: string) => {
    return pathname === href
  }, [pathname])

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
        className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-viva-magenta-500/50 focus:ring-offset-2 bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300/80 dark:hover:bg-gray-600/80 border border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm overflow-hidden"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      >
        <div className="absolute inset-0 rounded-full">
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: darkMode
                ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <motion.div
          className="absolute w-5 h-5 bg-white dark:bg-gray-100 rounded-full shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-300"
          style={{
            top: '2px',
            left: '2px'
          }}
          animate={{
            x: darkMode ? 24 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          <AnimatePresence mode="wait">
            {darkMode ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-3 h-3 text-slate-600" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-3 h-3 text-amber-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.button>
    )
  })
  ThemeToggleComponent.displayName = 'ThemeToggleComponent'

  // 🔥 FIXED: Navigation Link Component - Removed conflicting onClick handler
  const NavLink = React.memo<{
    item: NavItem
    index: number
    isMobile?: boolean
  }>(({ item, index, isMobile = false }) => {
    const isActive = isActivePath(item.href)
    const IconComponent = item.icon

    // 🔥 FIXED: Handle mobile menu close on navigation
    const handleLinkClick = useCallback(() => {
      if (isMobile && isOpen) {
        setIsOpen(false)
      }
    }, [isMobile])

    return (
      <motion.div
        className="relative group"
        initial={{ opacity: 0, y: isMobile ? 20 : -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: prefersReducedMotion ? 0 : index * 0.1, 
          duration: prefersReducedMotion ? 0.2 : 0.6 
        }}
      >
        {/* 🔥 FIXED: Let Next.js Link handle the navigation - NO preventDefault */}
        <Link
          href={item.href}
          onClick={handleLinkClick}
          className={`
            relative flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 
            cursor-pointer select-none z-10 whitespace-nowrap text-left group
            ${isActive 
              ? 'text-white bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 shadow-lg' 
              : 'text-gray-600 dark:text-gray-300 hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
            }
            ${isMobile ? 'text-lg justify-start w-full min-h-[3rem] gap-3 px-4 py-3 rounded-xl' : 'text-sm min-h-[2.5rem]'}
          `}
        >
          <motion.div
            className="flex items-center gap-2 w-full relative z-10"
            whileHover={{ 
              scale: prefersReducedMotion ? 1 : (isMobile ? 1.01 : 1.02), 
              y: prefersReducedMotion ? 0 : -1 
            }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
          >
            <div className="flex-shrink-0 flex items-center justify-center">
              <IconComponent className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
            </div>
            
            <span className={`${isMobile ? 'block' : 'hidden lg:block'} flex-1 ${isMobile ? 'text-left' : ''}`}>
              {item.label}
            </span>

            {isActive && !isMobile && (
              <motion.div
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-viva-magenta-600/20 to-lux-gold-600/20 border border-viva-magenta-500/30"
                layoutId="activeNavItem"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ zIndex: -1 }}
              />
            )}
          </motion.div>
        </Link>
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
          delay: prefersReducedMotion ? 0 : 0.5 + index * 0.1, 
          type: "spring", 
          stiffness: 300
        }}
      >
        <motion.a
          href={social.href}
          target={social.external ? '_blank' : undefined}
          rel={social.external ? 'noopener noreferrer' : undefined}
          className={`
            block w-12 h-12 rounded-xl border border-gray-200/50 dark:border-gray-700/50
            flex items-center justify-center transition-all duration-300
            hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:border-viva-magenta-300 dark:hover:border-viva-magenta-600 ${social.color}
            bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md
            cursor-pointer z-10
          `}
          whileHover={{ 
            y: prefersReducedMotion ? 0 : -3,
            scale: prefersReducedMotion ? 1 : 1.1
          }}
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.9 }}
          title={social.description}
          aria-label={`Visit ${social.platform} profile`}
        >
          <IconComponent className="w-5 h-5" />
        </motion.a>
      </motion.div>
    )
  })
  SocialLink.displayName = 'SocialLink'

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
      {/* Navigation Bar */}
      <nav 
        ref={navRef}
        className={`
          fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ease-out
          ${scrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg' 
            : 'bg-transparent'
          }
        `}
        style={{ 
          height: '5rem',
          minHeight: '5rem',
          maxHeight: '5rem',
          overflow: 'visible'
        }}
      >
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* 🔥 FIXED: Logo with proper Link */}
            <Link 
              href="/" 
              className="flex items-center gap-4 text-xl font-bold text-gray-900 dark:text-gray-50 hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400 transition-colors z-20 relative cursor-pointer"
            >
              <motion.div 
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-viva-magenta-500 to-lux-gold-500 flex items-center justify-center text-white font-bold text-sm shadow-lg"
                animate={!prefersReducedMotion ? { 
                  boxShadow: [
                    "0 0 20px rgba(190, 24, 93, 0.3)",
                    "0 0 30px rgba(212, 175, 55, 0.3)",
                    "0 0 20px rgba(190, 24, 93, 0.3)"
                  ]
                } : {}}
                transition={{ duration: 3, repeat: Infinity }}
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
              >
                JF
              </motion.div>
              <span className="hidden sm:block">Juan Fernandez</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <div 
                className="flex items-center gap-1 rounded-xl p-1"
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

            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <SocialLink key={social.platform} social={social} index={index} />
                ))}
              </div>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
              
              <ThemeToggleComponent />

              <motion.a
                href="mailto:jafernandez94@gmail.com"
                className="relative group p-3 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ml-2 cursor-pointer z-10"
                whileHover={{ 
                  scale: prefersReducedMotion ? 1 : 1.05, 
                  y: prefersReducedMotion ? 0 : -2 
                }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
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

            {/* Mobile controls */}
            <div className="flex lg:hidden items-center gap-4">
              <ThemeToggleComponent />
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-20 relative cursor-pointer"
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
      </nav>

      {/* Progress bar */}
      <div
        ref={progressBarRef}
        className="fixed left-0 right-0 w-full h-1 z-[999] pointer-events-none"
        style={{
          top: '5rem',
          background: 'linear-gradient(90deg, #BE3455 0%, #D4AF37 50%, #008080 100%)',
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
          transition: prefersReducedMotion ? 'none' : 'transform 0.1s ease',
          borderRadius: '0 0 2px 2px'
        }}
      />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed right-4 left-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl z-[999] lg:hidden overflow-hidden max-h-[80vh] overflow-y-auto"
              style={{ 
                top: 'calc(5rem + 0.25rem)'
              }}
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
                    transition={{ delay: prefersReducedMotion ? 0 : 0.3 }}
                  >
                    <motion.a
                      href="mailto:jafernandez94@gmail.com"
                      className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white font-semibold rounded-xl shadow-lg cursor-pointer"
                      whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                      whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
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

export default FixedNavigation