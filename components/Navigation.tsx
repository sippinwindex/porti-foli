// Clean Navigation Component - Fixed infinite loops and navigation
'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
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

const CleanNavigation: React.FC = () => {
  // Minimal state - prevent unnecessary re-renders
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  
  // Hooks
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  
  // Refs
  const progressBarRef = useRef<HTMLDivElement>(null)
  
  // Static navigation items - using useMemo to prevent recreating on every render
  const navigationItems: NavItem[] = useMemo(() => [
    { id: 'home', name: 'Home', label: 'Home', href: '/', icon: Home },
    { id: 'about', name: 'About', label: 'About', href: '/about', icon: User },
    { id: 'projects', name: 'Projects', label: 'Projects', href: '/projects', icon: FolderOpen },
    { id: 'blog', name: 'Blog', label: 'Blog', href: '/blog', icon: BookOpen },
    { id: 'contact', name: 'Contact', label: 'Contact', href: '/contact', icon: MessageCircle },
    { id: 'dino-game', name: 'Game', label: 'Game', href: '/dino-game', icon: Gamepad2 },
    { id: 'admin', name: 'Admin', label: 'Admin', href: '/admin', icon: Settings }
  ], [])

  const socialLinks: SocialLink[] = useMemo(() => [
    { 
      platform: 'GitHub', name: 'GitHub', href: 'https://github.com/sippinwindex', 
      icon: Github, external: true, description: 'View my code',
      color: 'hover:text-gray-700 dark:hover:text-gray-300'
    },
    { 
      platform: 'LinkedIn', name: 'LinkedIn', href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/', 
      icon: Linkedin, external: true, description: 'Professional profile',
      color: 'hover:text-blue-600 dark:hover:text-blue-400'
    },
    { 
      platform: 'Twitter', name: 'Twitter', href: 'https://x.com/FullyStackedUp', 
      icon: Twitter, external: true, description: 'Follow me on Twitter',
      color: 'hover:text-sky-500 dark:hover:text-sky-400'
    }
  ], [])

  // Theme initialization - run once on mount
  useEffect(() => {
    setMounted(true)
    
    try {
      const savedTheme = localStorage.getItem('theme')
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const shouldUseDarkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
      
      setDarkMode(shouldUseDarkMode)
      
      if (shouldUseDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch (error) {
      console.warn('Theme initialization failed:', error)
    }
  }, []) // Empty dependency array - run once

  // Theme toggle - simple function
  const toggleTheme = () => {
    try {
      const newDarkMode = !darkMode
      setDarkMode(newDarkMode)
      
      if (newDarkMode) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    } catch (error) {
      console.warn('Theme toggle failed:', error)
    }
  }

  // Scroll detection - optimized
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
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, []) // Empty dependency array

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Active path detection - simple function
  const isActivePath = (href: string) => pathname === href

  // Loading state
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-[1000] px-6 py-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* Navigation Bar */}
      <nav 
        className={`
          fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ease-out h-20
          ${scrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg' 
            : 'bg-transparent'
          }
        `}
      >
        <div className="container mx-auto px-6 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Logo - Simple Link */}
            <Link 
              href="/" 
              className="flex items-center gap-4 text-xl font-bold text-gray-900 dark:text-gray-50 hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-viva-magenta-500 to-lux-gold-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                JF
              </div>
              <span className="hidden sm:block">Juan Fernandez</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-1 rounded-xl p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50">
                {navigationItems.map((item) => {
                  const isActive = isActivePath(item.href)
                  const IconComponent = item.icon
                  
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm
                        ${isActive 
                          ? 'text-white bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 shadow-lg' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                        }
                      `}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="hidden lg:block">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Social Links */}
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={social.platform}
                      href={social.href}
                      target={social.external ? '_blank' : undefined}
                      rel={social.external ? 'noopener noreferrer' : undefined}
                      className={`
                        w-10 h-10 rounded-lg border border-gray-200/50 dark:border-gray-700/50
                        flex items-center justify-center transition-all duration-300
                        hover:bg-gray-200/50 dark:hover:bg-gray-700/50 ${social.color}
                        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                      `}
                      title={social.description}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-viva-magenta-500/50 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              >
                <div
                  className="absolute w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 top-0.5"
                  style={{
                    left: darkMode ? '26px' : '2px'
                  }}
                >
                  {darkMode ? (
                    <Moon className="w-3 h-3 text-slate-600" />
                  ) : (
                    <Sun className="w-3 h-3 text-amber-600" />
                  )}
                </div>
              </button>

              {/* Email Button */}
              <a
                href="mailto:jafernandez94@gmail.com"
                className="p-3 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                title="Send me an email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-4">
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-10 h-6 rounded-full bg-gray-200 dark:bg-gray-700 relative"
                aria-label="Toggle theme"
              >
                <div
                  className="absolute w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 top-0.5"
                  style={{
                    left: darkMode ? '18px' : '2px'
                  }}
                >
                  {darkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                </div>
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="fixed left-0 right-0 w-full h-1 z-[999] pointer-events-none"
        style={{
          top: '80px',
          background: 'linear-gradient(90deg, #BE3455 0%, #D4AF37 50%, #008080 100%)',
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
          transition: 'transform 0.1s ease'
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
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed right-4 left-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl z-[999] lg:hidden overflow-hidden"
              style={{ top: '88px' }}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6">
                {/* Mobile Navigation Links */}
                <div className="space-y-2 mb-6">
                  {navigationItems.map((item) => {
                    const isActive = isActivePath(item.href)
                    const IconComponent = item.icon
                    
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 w-full
                          ${isActive 
                            ? 'text-white bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 shadow-lg' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                          }
                        `}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>

                {/* Mobile Social Links */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    {socialLinks.map((social) => {
                      const IconComponent = social.icon
                      return (
                        <a
                          key={social.platform}
                          href={social.href}
                          target={social.external ? '_blank' : undefined}
                          rel={social.external ? 'noopener noreferrer' : undefined}
                          className="w-12 h-12 rounded-xl border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <IconComponent className="w-5 h-5" />
                        </a>
                      )
                    })}
                  </div>
                  
                  {/* Mobile Email Button */}
                  <div className="text-center">
                    <a
                      href="mailto:jafernandez94@gmail.com"
                      className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white font-semibold rounded-xl shadow-lg"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Send Email</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default CleanNavigation