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
  Briefcase
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'

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
  // State management
  const [isOpen, setIsOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
  
  // Scroll progress and transforms
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  const navBlur = useTransform(scrollYProgress, [0, 0.1], [0, shouldReduceMotion ? 8 : 20])

  // Initialize theme and mounted state
  useEffect(() => {
    setMounted(true)
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

  // Navigation items with both old and new structure
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
      id: 'dino-game',
      name: 'Dino Game', 
      label: 'Game',
      href: '/dino-game',
      icon: Gamepad2, 
      description: 'Play the game' 
    },
    { 
      id: 'contact', 
      name: 'Contact', 
      label: 'Contact', 
      href: '/contact', 
      icon: MessageCircle, 
      description: 'Get in touch' 
    }
  ], [])

  // Social links with enhanced structure
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
    },
    { 
      platform: 'Resume',
      name: 'Resume', 
      href: 'https://flowcv.com/resume/moac4k9d8767', 
      icon: FileText, 
      external: true,
      description: 'Download my resume',
      color: 'hover:text-amber-600 dark:hover:text-amber-400'
    },
    { 
      platform: 'Email',
      name: 'Email', 
      href: 'mailto:jafernandez94@gmail.com', 
      icon: Mail, 
      external: true,
      description: 'Send me a message',
      color: 'hover:text-green-600 dark:hover:text-green-400'
    }
  ], [])

  // Enhanced scroll detection with progress tracking
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          const progress = Math.min(scrollY / Math.max(maxScroll, 1), 1)
          
          setScrolled(scrollY > 50)
          setScrollProgress(progress)
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Enhanced section detection
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
    setIsMenuOpen(false)
  }, [pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsMenuOpen(false)
      }
    }

    if (isOpen || isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isMenuOpen])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (isOpen || isMenuOpen)) {
        setIsOpen(false)
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isMenuOpen])

  // Enhanced navigation with smooth scrolling for home page
  const handleNavigation = useCallback((href: string) => {
    setIsOpen(false)
    setIsMenuOpen(false)
    
    if (href.startsWith('/#') && pathname === '/') {
      // Smooth scroll to section on home page
      const targetId = href.replace('/#', '')
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ 
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start' 
        })
        window.history.pushState(null, '', href)
      }
    } else {
      // Navigate to page
      router.push(href)
    }
  }, [router, pathname, prefersReducedMotion])

  const isActivePath = useCallback((href: string, id: string) => {
    const isActive = currentSection === id || 
                   (pathname === href) ||
                   (href.includes('#') && pathname === '/' && `/#${currentSection}` === href)
    return isActive
  }, [pathname, currentSection])

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
      handleNavigation(item.href)
    }, [item.href])

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
            block w-10 h-10 rounded-xl border border-gray-200/50 dark:border-gray-700/50
            flex items-center justify-center transition-all duration-300
            hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:border-viva-magenta-300 dark:hover:border-viva-magenta-600 ${social.color}
            bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
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
        className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-viva-magenta-500 focus:ring-offset-2 bg-gray-200 dark:bg-gray-700"
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
            <svg className="w-3 h-3 text-viva-magenta-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          ) : (
            <svg className="w-3 h-3 text-lux-gold-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          )}
        </motion.div>
      </motion.button>
    )
  })
  ThemeToggleComponent.displayName = 'ThemeToggleComponent'

  // Loading state
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
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
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled 
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg' 
            : 'bg-transparent'
          }
        `}
        style={{ 
          height: '5rem',
          backdropFilter: scrolled ? `blur(${navBlur}px)` : 'none'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Enhanced Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-gray-50 hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400 transition-colors z-10 relative"
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
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

            {/* Desktop Social Links & Theme Toggle */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2">
                {socialLinks.slice(0, 3).map((social, index) => (
                  <SocialLink key={social.platform} social={social} index={index} />
                ))}
              </div>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
              
              <ThemeToggleComponent />

              <motion.a
                href="mailto:jafernandez94@gmail.com"
                className="relative group px-6 py-2 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg"
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

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-3">
              <ThemeToggleComponent />
              
              <button
                onClick={() => {
                  setIsOpen(!isOpen)
                  setIsMenuOpen(!isMenuOpen)
                }}
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

        {/* Scroll Progress Indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-viva-magenta-500 to-lux-gold-500 origin-left"
          style={{ 
            scaleX,
            boxShadow: shouldReduceMotion ? 'none' : `0 0 10px rgba(190, 24, 93, 0.6)`
          }}
        />
      </motion.nav>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {(isOpen || isMenuOpen) && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setIsOpen(false)
                setIsMenuOpen(false)
              }}
            />

            {/* Mobile Menu */}
            <motion.div
              ref={mobileMenuRef}
              className="fixed top-20 right-4 left-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl z-50 lg:hidden overflow-hidden max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
              <div className="p-6">
                {/* Mobile Navigation Items */}
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

                {/* Mobile Social Links */}
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
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white font-semibold rounded-xl shadow-lg"
                      whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                      whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Let's Talk</span>
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