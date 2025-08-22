'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import ScrollProgress from './ScrollProgress'
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Monitor,
  Home, 
  User, 
  Briefcase, 
  Mail,
  Github,
  Linkedin,
  BookOpen,
  Gamepad2,
  Settings
} from 'lucide-react'

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: User },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Blog', href: '/blog', icon: BookOpen },
  { name: 'Contact', href: '/contact', icon: Mail },
  { name: 'Game', href: '/game', icon: Gamepad2 },
  { name: 'Admin', href: '/admin', icon: Settings }
] as const

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/sippinwindex',
    icon: Github
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/juan-fernandez-dev',
    icon: Linkedin
  }
] as const

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme, resolvedTheme } = useTheme()

  // Handle mounting for theme to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll effect with optimized performance
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('mobile-menu-open')
    } else {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('mobile-menu-open')
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('mobile-menu-open')
    }
  }, [isOpen])

  const toggleMobileMenu = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen])

  const cycleTheme = useCallback(() => {
    const themeOrder: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = themeOrder.indexOf(theme as typeof themeOrder[number])
    const nextIndex = (currentIndex + 1) % themeOrder.length
    setTheme(themeOrder[nextIndex])
  }, [theme, setTheme])

  const getThemeIcon = () => {
    if (!mounted) return <Monitor className="w-4 h-4" />
    
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4 text-yellow-500" />
      case 'dark':
        return <Moon className="w-4 h-4 text-blue-400" />
      case 'system':
        return <Monitor className="w-4 h-4 text-gray-500" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  return (
    <>
      {/* Modern Navbar with Glass Effect */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="navbar-logo"
            >
              <Link 
                href="/"
                className="flex items-center space-x-3"
              >
                <div className="logo-icon">
                  JF
                </div>
                <span className="logo-text hidden sm:block">
                  Juan Fernandez
                </span>
              </Link>
            </motion.div>

            {/* Center Navigation Pills - FIXED: Show on desktop */}
            <div className="nav-pills-container hidden lg:flex">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="nav-pill relative"
                  >
                    <motion.div
                      className={`flex items-center space-x-2 ${
                        isActive ? 'active' : ''
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden xl:block whitespace-nowrap">
                        {item.name}
                      </span>
                      
                      {/* Active Background */}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active"
                          className="absolute inset-0 bg-gradient-to-r from-[#BE3455] to-[#D4AF37] rounded-full -z-10"
                          initial={false}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </div>

            {/* Right Actions - FIXED: Proper spacing */}
            <div className="flex items-center space-x-2">
              {/* Social Links - FIXED: Better spacing */}
              <div className="hidden md:flex items-center space-x-2">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={link.name}
                  >
                    <link.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>

              {/* Theme Toggle - FIXED: Proper spacing */}
              <motion.button
                onClick={cycleTheme}
                className="theme-toggle"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!mounted}
                title={`Current theme: ${theme}`}
              >
                {getThemeIcon()}
              </motion.button>

              {/* Contact Button - FIXED: Better responsive behavior */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden md:block"
              >
                <Link
                  href="/contact"
                  className="contact-button"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact</span>
                </Link>
              </motion.div>

              {/* Mobile Menu Button - FIXED: Better styling */}
              <motion.button
                className="mobile-menu-button lg:hidden"
                onClick={toggleMobileMenu}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle mobile menu"
                aria-expanded={isOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* FIXED: Progress Bar - Proper positioning */}
        <ScrollProgress 
          className="absolute bottom-0 left-0 right-0 z-10"
          height="2px"
          color="linear-gradient(90deg, #BE3455 0%, #D4AF37 50%, #008080 100%)"
          smooth={true}
        />
      </motion.nav>

      {/* Mobile Menu - FIXED: Better animations and functionality */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mobile-menu-overlay"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="mobile-menu-panel"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10" style={{ marginTop: 'var(--navbar-height)' }}>
                  <h2 className="text-lg font-semibold text-white">
                    Navigation
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation Items */}
                <div className="flex-1 px-6 py-4 space-y-2">
                  {navigationItems.map((item, index) => {
                    const isActive = pathname === item.href
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span className="font-medium">{item.name}</span>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto w-2 h-2 bg-white rounded-full"
                            />
                          )}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Mobile Actions */}
                <div className="px-6 py-4 border-t border-white/10 space-y-4">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">
                      Theme
                    </span>
                    <button
                      onClick={cycleTheme}
                      disabled={!mounted}
                      className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg transition-colors hover:bg-white/20 disabled:opacity-50"
                    >
                      {getThemeIcon()}
                      <span className="text-sm text-gray-300">
                        {mounted ? (theme ? theme.charAt(0).toUpperCase() + theme.slice(1) : 'System') : 'Loading...'}
                      </span>
                    </button>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center justify-center space-x-4 pt-4">
                    {socialLinks.map((link) => (
                      <motion.a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <link.icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>

                  {/* Mobile Contact Button */}
                  <div className="pt-4">
                    <Link
                      href="/contact"
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#BE3455] to-[#D4AF37] text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      <Mail className="w-4 h-4" />
                      <span>Contact Me</span>
                    </Link>
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