'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { 
  Home, User, Briefcase, Calendar, Mail, Github, Linkedin, 
  Twitter, FileText, Menu, X, MessageCircle, BookOpen, Gamepad2
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  href: string
}

interface SocialLink {
  platform: string
  href: string
  icon: React.ElementType
  color: string
}

const Navigation = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState('home')
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll()
  const navBlur = useTransform(scrollYProgress, [0, 0.1], [0, shouldReduceMotion ? 8 : 20])

  // Initialize theme and mounted state
  useEffect(() => {
    setMounted(true)
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDarkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
    
    setDarkMode(shouldUseDarkMode)
    document.documentElement.classList.toggle('dark', shouldUseDarkMode)
  }, [])

  // Theme toggle function
  const toggleTheme = useCallback(() => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    document.documentElement.classList.toggle('dark', newDarkMode)
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
  }, [darkMode])

  // Fixed navigation items - corrected experience route
  const navItems = useMemo<NavItem[]>(() => [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'about', label: 'About', icon: User, href: '/about' },
    { id: 'projects', label: 'Projects', icon: Briefcase, href: '/projects' },
    { id: 'experience', label: 'Experience', icon: Calendar, href: '/#experience' }, // Fixed: hash link instead of route
    { id: 'blog', label: 'Blog', icon: BookOpen, href: '/blog' },
    { id: 'dino-game', label: 'Game', icon: Gamepad2, href: '/dino-game' },
    { id: 'contact', label: 'Contact', icon: Mail, href: '/contact' }
  ], [])

  // Social links
  const socialLinks = useMemo<SocialLink[]>(() => [
    { 
      platform: 'GitHub', 
      href: 'https://github.com/sippinwindex', 
      icon: Github,
      color: 'hover:text-gray-700 dark:hover:text-gray-300'
    },
    { 
      platform: 'LinkedIn', 
      href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/', 
      icon: Linkedin,
      color: 'hover:text-blue-600 dark:hover:text-blue-400'
    },
    { 
      platform: 'Twitter', 
      href: 'https://x.com/FullyStackedUp', 
      icon: Twitter,
      color: 'hover:text-sky-500 dark:hover:text-sky-400'
    },
    { 
      platform: 'Resume', 
      href: 'https://flowcv.com/resume/moac4k9d8767', 
      icon: FileText,
      color: 'hover:text-amber-600 dark:hover:text-amber-400'
    }
  ], [])

  // Scroll tracking
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          const progress = Math.min(scrolled / Math.max(maxScroll, 1), 1)
          setScrollProgress(progress)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Section detection
  useEffect(() => {
    if (!pathname) return
    
    if (pathname === '/') {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        setCurrentSection(hash)
        return
      }

      const sections = ['hero', 'about', 'projects', 'experience', 'contact']
      const observerOptions = {
        threshold: 0.3,
        rootMargin: '-20% 0px -70% 0px'
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id)
          }
        })
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
    } else if (pathname === '/blog') {
      setCurrentSection('blog')
    } else if (pathname === '/dino-game') {
      setCurrentSection('dino-game')
    } else if (pathname === '/about') {
      setCurrentSection('about')
    } else if (pathname === '/projects') {
      setCurrentSection('projects')
    } else if (pathname === '/contact') {
      setCurrentSection('contact')
    }
  }, [pathname])

  // Theme Toggle Component
  const ThemeToggle = React.memo(() => {
    if (!mounted) {
      return (
        <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      )
    }

    return (
      <motion.button
        onClick={toggleTheme}
        className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gray-200 dark:bg-gray-700"
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
            <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          ) : (
            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          )}
        </motion.div>
      </motion.button>
    )
  })
  ThemeToggle.displayName = 'ThemeToggle'

  // Navigation Link Component - Fixed hover and click issues
  const NavLink = React.memo<{
    item: NavItem
    index: number
    isMobile?: boolean
  }>(({ item, index, isMobile = false }) => {
    const isActive = currentSection === item.id || 
                   (pathname === item.href) ||
                   (item.href.includes('#') && pathname === '/' && `/#${currentSection}` === item.href)
    const IconComponent = item.icon

    const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault() // Prevent default to handle ourselves
      setIsMenuOpen(false)
      
      if (item.href.startsWith('/#') && pathname === '/') {
        // Hash navigation on same page
        const targetId = item.href.replace('/#', '')
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ 
            behavior: shouldReduceMotion ? 'auto' : 'smooth', 
            block: 'start' 
          })
          window.history.pushState(null, '', item.href)
        }
      } else {
        // Regular navigation
        router.push(item.href)
      }
    }, [item.href, pathname, router, shouldReduceMotion])

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
              ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
            }
            ${isMobile ? 'text-lg justify-center' : 'text-sm'}
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

          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 pointer-events-none"
              layoutId="activeNav"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: shouldReduceMotion ? 0.8 : 1 }}
          />
        </motion.a>
      </motion.div>
    )
  })
  NavLink.displayName = 'NavLink'

  // Social Link Component - Fixed
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
          target="_blank"
          rel="noopener noreferrer"
          className={`
            block w-10 h-10 rounded-xl glass border border-gray-200/50 dark:border-gray-700/50
            flex items-center justify-center transition-all duration-300
            hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 ${social.color}
          `}
          whileHover={{ 
            y: shouldReduceMotion ? 0 : -3,
            scale: shouldReduceMotion ? 1 : 1.1
          }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.9 }}
          title={social.platform}
          aria-label={`Visit ${social.platform} profile`}
        >
          <IconComponent className="w-5 h-5 pointer-events-none" />
        </motion.a>
      </motion.div>
    )
  })
  SocialLink.displayName = 'SocialLink'

  // Mobile Menu Component
  const MobileMenu = React.memo(() => (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />

          <motion.div
            className="absolute top-20 left-4 right-4 glass border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30
            }}
          >
            <div className="space-y-4 mb-8">
              {navItems.map((item, index) => (
                <NavLink 
                  key={item.id} 
                  item={item} 
                  index={index} 
                  isMobile={true}
                />
              ))}
            </div>

            <div className="flex justify-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              {socialLinks.map((social, index) => (
                <SocialLink key={social.platform} social={social} index={index} />
              ))}
            </div>

            <div className="flex justify-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <ThemeToggle />
            </div>

            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.3 }}
            >
              <motion.a
                href="mailto:stormblazdesign@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg"
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Let's Talk</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  ))
  MobileMenu.displayName = 'MobileMenu'

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

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
      <motion.nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[1000] px-4 sm:px-6 lg:px-8 py-4"
        style={{ 
          backgroundColor: darkMode ? 'rgba(18, 18, 18, 0.95)' : 'rgba(250, 250, 250, 0.95)',
          backdropFilter: `blur(${navBlur}px)`,
          borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >        
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="block z-10">
              <motion.div
                className="relative group"
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
              >
                <motion.div
                  className="flex items-center gap-3 cursor-pointer"
                  whileHover={{ x: shouldReduceMotion ? 0 : 5 }}
                >
                  <motion.div 
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg"
                    animate={!shouldReduceMotion ? { 
                      boxShadow: [
                        "0 0 20px rgba(59, 130, 246, 0.3)",
                        "0 0 30px rgba(147, 51, 234, 0.3)",
                        "0 0 20px rgba(59, 130, 246, 0.3)"
                      ]
                    } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    JF
                  </motion.div>
                  <span className="hidden sm:block font-bold text-gray-900 dark:text-gray-50 text-lg">
                    Juan Fernandez
                  </span>
                </motion.div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-2 glass rounded-xl p-2 border border-gray-200/50 dark:border-gray-700/50">
                {navItems.map((item, index) => (
                  <NavLink key={item.id} item={item} index={index} />
                ))}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <ThemeToggle />
              
              <div className="flex items-center gap-2">
                {socialLinks.map((social, index) => (
                  <SocialLink key={social.platform} social={social} index={index} />
                ))}
              </div>

              <motion.a
                href="mailto:stormblazdesign@gmail.com"
                className="relative group px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg"
                whileHover={{ 
                  scale: shouldReduceMotion ? 1 : 1.05, 
                  y: shouldReduceMotion ? 0 : -2 
                }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Let's Talk
                </span>
              </motion.a>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-3">
              <ThemeToggle />
              
              <motion.button
                className="relative w-10 h-10 rounded-xl glass border border-gray-200 dark:border-gray-700 flex items-center justify-center z-10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                aria-label={`${isMenuOpen ? 'Close' : 'Open'} navigation menu`}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
          style={{ 
            width: `${scrollProgress * 100}%`,
            boxShadow: shouldReduceMotion ? 'none' : `0 0 10px rgba(59, 130, 246, 0.6)`
          }}
          initial={{ width: "0%" }}
        />
      </motion.nav>

      <MobileMenu />
    </>
  )
}

Navigation.displayName = 'Navigation'

export default React.memo(Navigation)