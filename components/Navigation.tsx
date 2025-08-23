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
  { name: 'Game', href: '/dino-game', icon: Gamepad2 },
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

  const isDark = mounted ? resolvedTheme === 'dark' : true

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
      {/* ✅ FIXED: Theme-aware navbar with proper backgrounds and height */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 w-full h-20 z-[1000] transition-all duration-300 will-change-auto ${
          isDark
            ? scrolled 
              ? 'bg-gray-900/90 backdrop-blur-md border-b border-gray-800 shadow-lg' 
              : 'bg-gray-900/70 backdrop-blur-sm border-b border-gray-800/50'
            : scrolled
              ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-lg'
              : 'bg-white/70 backdrop-blur-sm border-b border-gray-200/50'
        }`}
      >
        {/* ✅ FIXED: Enhanced Container with Better Spacing */}
        <div className="h-full mx-auto px-6 sm:px-8 lg:px-10 max-w-7xl">
          <div className="flex items-center justify-between h-full">
            
            {/* ✅ FIXED: Enhanced Logo Section with Better Styling */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center flex-shrink-0"
            >
              <Link 
                href="/"
                className="flex items-center space-x-4 group"
              >
                {/* ✅ FIXED: Added initials to the logo box */}
                <div className="w-10 h-10 bg-gradient-to-br from-viva-magenta to-lux-gold rounded-xl flex items-center justify-center font-bold text-base text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  JF
                </div>
                {/* ✅ FIXED: Enhanced name styling with gradient and better typography */}
                <div className="hidden sm:block">
                  <span className={`font-bold text-xl tracking-wide bg-gradient-to-r from-viva-magenta via-lux-gold to-lux-teal bg-clip-text text-transparent group-hover:from-lux-gold group-hover:via-viva-magenta group-hover:to-lux-teal transition-all duration-300`}>
                    Juan Fernandez
                  </span>
                  <div className={`text-xs font-medium tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'} group-hover:text-viva-magenta transition-colors duration-300`}>
                    FULL-STACK DEVELOPER
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* ✅ FIXED: Center Navigation Pills with Better Spacing */}
            <div className="hidden lg:flex items-center mx-8">
              <div className={`flex items-center backdrop-blur-sm border rounded-full p-2 shadow-lg transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800/40 border-gray-700 hover:bg-gray-800/60'
                  : 'bg-gray-100/40 border-gray-300 hover:bg-gray-100/60'
              }`}>
                {navigationItems.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="relative mx-1"
                    >
                      <motion.div
                        className={`flex items-center space-x-2 px-5 py-3 rounded-full font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                          isActive 
                            ? 'text-white shadow-lg scale-105' 
                            : isDark
                              ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                        }`}
                        whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden xl:block">{item.name}</span>
                        
                        {/* ✅ FIXED: Active Background with Proper Animation */}
                        {isActive && (
                          <motion.div
                            layoutId="navbar-active"
                            className="absolute inset-0 bg-gradient-to-r from-viva-magenta to-lux-gold rounded-full"
                            style={{ zIndex: -1 }}
                            initial={false}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* ✅ FIXED: Right Actions with Better Spacing */}
            <div className="flex items-center space-x-4">
              
              {/* ✅ FIXED: Social Links with Better Spacing */}
              <div className="hidden md:flex items-center space-x-3">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 flex items-center justify-center border rounded-xl transition-all duration-300 ${
                      isDark
                        ? 'bg-gray-800/50 hover:bg-gray-700 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                        : 'bg-gray-100/50 hover:bg-gray-200 border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={link.name}
                  >
                    <link.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>

              {/* ✅ FIXED: Theme Toggle with Better Styling and No Radio Button */}
              <motion.button
                onClick={cycleTheme}
                className={`w-10 h-10 flex items-center justify-center border rounded-xl transition-all duration-300 ${
                  isDark
                    ? 'bg-gray-800/50 hover:bg-gray-700 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                    : 'bg-gray-100/50 hover:bg-gray-200 border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!mounted}
                title={`Current theme: ${theme || 'system'}`}
                type="button"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getThemeIcon()}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* ✅ FIXED: Contact Button - Better Responsive Behavior */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden lg:block ml-2"
              >
                <Link
                  href="/contact"
                  className="flex items-center space-x-2 bg-gradient-to-r from-viva-magenta to-lux-gold text-white px-5 py-3 rounded-full font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:from-lux-gold hover:to-viva-magenta"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact</span>
                </Link>
              </motion.div>

              {/* ✅ FIXED: Mobile Menu Button with Theme Support */}
              <motion.button
                className={`lg:hidden w-10 h-10 flex items-center justify-center border rounded-xl transition-all duration-300 ml-2 ${
                  isDark
                    ? 'bg-gray-800/50 hover:bg-gray-700 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                    : 'bg-gray-100/50 hover:bg-gray-200 border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400'
                }`}
                onClick={toggleMobileMenu}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle mobile menu"
                aria-expanded={isOpen}
                type="button"
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

        {/* ✅ FIXED: Progress Bar with Proper Positioning UNDER the navbar */}
        <ScrollProgress 
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-viva-magenta via-lux-gold to-lux-teal"
          height="2px"
          color="linear-gradient(90deg, #BE3455 0%, #D4AF37 50%, #008080 100%)"
          smooth={true}
        />
      </motion.nav>

      {/* ✅ FIXED: Mobile Menu with Better Theme Support */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
              onClick={() => setIsOpen(false)}
            />

            {/* ✅ FIXED: Mobile Menu Panel with Theme Support */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] backdrop-blur-xl border-l z-[1000] shadow-2xl ${
                isDark
                  ? 'bg-gray-900/95 border-gray-700'
                  : 'bg-white/95 border-gray-300'
              }`}
            >
              <div className="flex flex-col h-full">
                
                {/* ✅ FIXED: Mobile Menu Header */}
                <div className={`flex items-center justify-between p-6 border-b ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`} style={{ marginTop: '5rem' }}>
                  <h2 className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Menu
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                      isDark
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* ✅ FIXED: Mobile Navigation Items */}
                <div className="flex-1 px-6 py-6 space-y-2">
                  {navigationItems.map((item, index) => {
                    const isActive = pathname === item.href
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                            isActive 
                              ? 'bg-gradient-to-r from-viva-magenta to-lux-gold text-white shadow-lg' 
                              : isDark
                                ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span>{item.name}</span>
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

                {/* ✅ FIXED: Mobile Footer Actions */}
                <div className={`px-6 py-6 border-t space-y-6 ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  
                  {/* Theme Toggle Row */}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Theme
                    </span>
                    <button
                      onClick={cycleTheme}
                      disabled={!mounted}
                      type="button"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all disabled:opacity-50 ${
                        isDark
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      {getThemeIcon()}
                      <span className="text-sm">
                        {mounted ? (theme ? theme.charAt(0).toUpperCase() + theme.slice(1) : 'System') : 'Loading...'}
                      </span>
                    </button>
                  </div>

                  {/* Social Links Row */}
                  <div className="flex items-center justify-center space-x-4">
                    {socialLinks.map((link) => (
                      <motion.a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                          isDark
                            ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                            : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <link.icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>

                  {/* Contact Button */}
                  <Link
                    href="/contact"
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-viva-magenta to-lux-gold text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact Me</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}