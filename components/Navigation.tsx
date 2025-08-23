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
                {/* ✅ FIXED: Added initials to the logo box with proper theming */}
                <div className="w-10 h-10 bg-gradient-to-br from-viva-magenta-600 via-lux-gold-500 to-viva-magenta-700 dark:from-viva-magenta-500 dark:via-lux-gold-400 dark:to-viva-magenta-600 rounded-xl flex items-center justify-center font-bold text-base text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  JF
                </div>
                {/* ✅ FIXED: Enhanced name styling with gradient and better typography */}
                <div className="hidden sm:block">
                  <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-viva-magenta-600 via-lux-gold-500 to-lux-teal-600 dark:from-viva-magenta-400 dark:via-lux-gold-400 dark:to-lux-teal-400 bg-clip-text text-transparent group-hover:from-lux-gold-500 group-hover:via-viva-magenta-500 group-hover:to-lux-teal-500 dark:group-hover:from-lux-gold-400 dark:group-hover:via-viva-magenta-400 dark:group-hover:to-lux-teal-400 transition-all duration-300">
                    Juan Fernandez
                  </span>
                  <div className={`text-xs font-medium tracking-widest transition-colors duration-300 ${
                    isDark 
                      ? 'text-gray-400 group-hover:text-viva-magenta-400' 
                      : 'text-gray-600 group-hover:text-viva-magenta-600'
                  }`}>
                    FULL-STACK DEVELOPER
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* ✅ FIXED: Center Navigation Pills with Better Styling */}
            <div className="hidden lg:flex items-center mx-8">
              <div className={`flex items-center backdrop-blur-sm border rounded-full p-2 shadow-lg transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600/50'
                  : 'bg-white/50 border-gray-200/50 hover:bg-white/70 hover:border-gray-300/50'
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
                        className={`flex items-center space-x-2 px-5 py-3 rounded-full font-medium text-sm transition-all duration-200 whitespace-nowrap relative ${
                          isActive 
                            ? 'text-white shadow-lg scale-105 ring-2 ring-white/20' 
                            : isDark
                              ? 'text-gray-300 hover:text-white hover:bg-gray-700/30 hover:ring-1 hover:ring-viva-magenta-500/30'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 hover:ring-1 hover:ring-viva-magenta-500/30'
                        }`}
                        whileHover={{ 
                          scale: isActive ? 1.05 : 1.02,
                          boxShadow: isActive 
                            ? "0 8px 32px rgba(190, 52, 85, 0.3)" 
                            : "0 4px 16px rgba(190, 52, 85, 0.1)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <item.icon className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                          isActive 
                            ? 'text-white' 
                            : isDark 
                              ? 'text-gray-400 group-hover:text-viva-magenta-400' 
                              : 'text-gray-500 group-hover:text-viva-magenta-600'
                        }`} />
                        <span className="hidden xl:block">{item.name}</span>
                        
                        {/* ✅ FIXED: Active Background with Enhanced Styling */}
                        {isActive && (
                          <motion.div
                            layoutId="navbar-active"
                            className="absolute inset-0 bg-gradient-to-r from-viva-magenta-600 via-lux-gold-500 to-viva-magenta-600 dark:from-viva-magenta-500 dark:via-lux-gold-400 dark:to-viva-magenta-500 rounded-full shadow-lg"
                            style={{ zIndex: -1 }}
                            initial={false}
                            transition={{ 
                              duration: 0.3, 
                              ease: "easeInOut",
                              type: "spring",
                              stiffness: 300,
                              damping: 30
                            }}
                          />
                        )}
                        
                        {/* ✅ ENHANCED: Hover glow effect */}
                        {!isActive && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-viva-magenta-500/10 via-lux-gold-500/10 to-viva-magenta-500/10 rounded-full opacity-0"
                            style={{ zIndex: -1 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
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
              
              {/* ✅ FIXED: Enhanced Social Links */}
              <div className="hidden md:flex items-center space-x-3">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 flex items-center justify-center border rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isDark
                        ? 'bg-gray-800/60 hover:bg-gray-700/80 border-gray-700/60 text-gray-400 hover:text-white hover:border-viva-magenta-500/50 hover:shadow-lg hover:shadow-viva-magenta-500/20'
                        : 'bg-white/60 hover:bg-white/80 border-gray-200/60 text-gray-600 hover:text-gray-900 hover:border-viva-magenta-500/50 hover:shadow-lg hover:shadow-viva-magenta-500/20'
                    }`}
                    whileHover={{ 
                      scale: 1.05,
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                    title={link.name}
                  >
                    {/* ✅ ENHANCED: Gradient background on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-viva-magenta-500/20 via-lux-gold-500/20 to-viva-magenta-500/20 rounded-xl opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <link.icon className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                  </motion.a>
                ))}
              </div>

              {/* ✅ FIXED: Enhanced Theme Toggle */}
              <motion.button
                onClick={cycleTheme}
                className={`w-10 h-10 flex items-center justify-center border rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isDark
                    ? 'bg-gray-800/60 hover:bg-gray-700/80 border-gray-700/60 text-gray-400 hover:text-white hover:border-lux-gold-500/50 hover:shadow-lg hover:shadow-lux-gold-500/20'
                    : 'bg-white/60 hover:bg-white/80 border-gray-200/60 text-gray-600 hover:text-gray-900 hover:border-lux-gold-500/50 hover:shadow-lg hover:shadow-lux-gold-500/20'
                }`}
                whileHover={{ 
                  scale: 1.05,
                  y: -2 
                }}
                whileTap={{ scale: 0.95 }}
                disabled={!mounted}
                title={`Current theme: ${theme || 'system'} - Click to cycle`}
                type="button"
                aria-label={`Switch theme (current: ${theme || 'system'})`}
              >
                {/* ✅ ENHANCED: Theme-appropriate gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 rounded-xl opacity-0 ${
                    theme === 'light' 
                      ? 'bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-yellow-500/20'
                      : theme === 'dark'
                      ? 'bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-blue-600/20'  
                      : 'bg-gradient-to-br from-lux-gold-500/20 via-viva-magenta-500/20 to-lux-gold-500/20'
                  }`}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    {getThemeIcon()}
                  </motion.div>
                </AnimatePresence>
                
                {/* ✅ ACCESSIBILITY: Focus ring */}
                <motion.div 
                  className="absolute inset-0 rounded-xl border-2 border-transparent"
                  whileFocus={{ 
                    borderColor: isDark ? 'rgb(212, 175, 55)' : 'rgb(190, 52, 85)',
                    boxShadow: isDark 
                      ? '0 0 0 3px rgba(212, 175, 55, 0.2)' 
                      : '0 0 0 3px rgba(190, 52, 85, 0.2)'
                  }}
                />
              </motion.button>

              {/* ✅ FIXED: Enhanced Contact Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden lg:block ml-2"
              >
                <Link
                  href="/contact"
                  className="flex items-center space-x-2 bg-gradient-to-r from-viva-magenta-600 via-lux-gold-500 to-viva-magenta-600 dark:from-viva-magenta-500 dark:via-lux-gold-400 dark:to-viva-magenta-500 text-white px-5 py-3 rounded-full font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:from-lux-gold-500 hover:via-viva-magenta-600 hover:to-lux-gold-500 dark:hover:from-lux-gold-400 dark:hover:via-viva-magenta-500 dark:hover:to-lux-gold-400 group relative overflow-hidden"
                >
                  {/* ✅ ENHANCED: Animated background shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                    style={{ width: '50%' }}
                  />
                  <Mail className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="relative z-10">Contact</span>
                </Link>
              </motion.div>

              {/* ✅ FIXED: Enhanced Mobile Menu Button */}
              <motion.button
                className={`lg:hidden w-10 h-10 flex items-center justify-center border rounded-xl transition-all duration-300 ml-2 group relative overflow-hidden ${
                  isDark
                    ? 'bg-gray-800/60 hover:bg-gray-700/80 border-gray-700/60 text-gray-400 hover:text-white hover:border-viva-magenta-500/50 hover:shadow-lg hover:shadow-viva-magenta-500/20'
                    : 'bg-white/60 hover:bg-white/80 border-gray-200/60 text-gray-600 hover:text-gray-900 hover:border-viva-magenta-500/50 hover:shadow-lg hover:shadow-viva-magenta-500/20'
                }`}
                onClick={toggleMobileMenu}
                whileHover={{ 
                  scale: 1.05,
                  y: -2 
                }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle mobile menu"
                aria-expanded={isOpen}
                type="button"
              >
                {/* ✅ ENHANCED: Gradient background on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-viva-magenta-500/20 via-lux-gold-500/20 to-viva-magenta-500/20 rounded-xl opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <AnimatePresence mode="wait" initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10"
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
                      className="relative z-10"
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* ✅ FIXED: Progress Bar with Proper Positioning and Visibility */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 z-[1001]">
          <ScrollProgress 
            className="w-full h-full"
            height="2px"
            color="linear-gradient(90deg, rgb(190, 52, 85) 0%, rgb(212, 175, 55) 50%, rgb(0, 128, 128) 100%)"
            smooth={true}
          />
        </div>
      </motion.nav>

      {/* ✅ FIXED: Enhanced Mobile Menu */}
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

            {/* ✅ FIXED: Mobile Menu Panel with Enhanced Styling */}
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

                {/* ✅ FIXED: Enhanced Mobile Navigation Items */}
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
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all group relative overflow-hidden ${
                            isActive 
                              ? 'bg-gradient-to-r from-viva-magenta-600 via-lux-gold-500 to-viva-magenta-600 dark:from-viva-magenta-500 dark:via-lux-gold-400 dark:to-viva-magenta-500 text-white shadow-lg' 
                              : isDark
                                ? 'text-gray-300 hover:text-white hover:bg-gray-800/70 hover:shadow-md'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 hover:shadow-md'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {/* ✅ ENHANCED: Hover gradient background for non-active items */}
                          {!isActive && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-viva-magenta-500/10 via-lux-gold-500/10 to-viva-magenta-500/10 rounded-xl opacity-0"
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          <item.icon className={`w-5 h-5 flex-shrink-0 relative z-10 transition-colors duration-300 ${
                            isActive ? 'text-white' : 'group-hover:text-viva-magenta-500'
                          }`} />
                          <span className="relative z-10">{item.name}</span>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto w-2 h-2 bg-white rounded-full relative z-10"
                            />
                          )}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                {/* ✅ FIXED: Enhanced Mobile Footer Actions */}
                <div className={`px-6 py-6 border-t space-y-6 ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  
                  {/* Enhanced Theme Toggle Row */}
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
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all disabled:opacity-50 group relative overflow-hidden ${
                        isDark
                          ? 'bg-gray-800/70 hover:bg-gray-700/80 text-gray-300 hover:text-white border border-gray-700/50 hover:border-lux-gold-500/50'
                          : 'bg-white/70 hover:bg-white/90 text-gray-600 hover:text-gray-900 border border-gray-200/50 hover:border-lux-gold-500/50'
                      }`}
                      aria-label={`Switch theme (current: ${theme || 'system'})`}
                    >
                      {/* ✅ ENHANCED: Theme-appropriate hover background */}
                      <motion.div
                        className={`absolute inset-0 rounded-lg opacity-0 ${
                          theme === 'light' 
                            ? 'bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-yellow-500/20'
                            : theme === 'dark'
                            ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-600/20'  
                            : 'bg-gradient-to-r from-lux-gold-500/20 via-viva-magenta-500/20 to-lux-gold-500/20'
                        }`}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10">{getThemeIcon()}</span>
                      <span className="text-sm relative z-10">
                        {mounted ? (theme ? theme.charAt(0).toUpperCase() + theme.slice(1) : 'System') : 'Loading...'}
                      </span>
                    </button>
                  </div>

                  {/* Enhanced Social Links Row */}
                  <div className="flex items-center justify-center space-x-4">
                    {socialLinks.map((link) => (
                      <motion.a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all group relative overflow-hidden ${
                          isDark
                            ? 'bg-gray-800/70 text-gray-400 hover:text-white hover:bg-gray-700/80 border border-gray-700/50 hover:border-viva-magenta-500/50 hover:shadow-lg hover:shadow-viva-magenta-500/20'
                            : 'bg-white/70 text-gray-600 hover:text-gray-900 hover:bg-white/90 border border-gray-200/50 hover:border-viva-magenta-500/50 hover:shadow-lg hover:shadow-viva-magenta-500/20'
                        }`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        title={link.name}
                      >
                        {/* ✅ ENHANCED: Gradient hover background */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-viva-magenta-500/20 via-lux-gold-500/20 to-viva-magenta-500/20 rounded-xl opacity-0"
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <link.icon className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                      </motion.a>
                    ))}
                  </div>

                  {/* Enhanced Contact Button */}
                  <Link
                    href="/contact"
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-viva-magenta-600 via-lux-gold-500 to-viva-magenta-600 dark:from-viva-magenta-500 dark:via-lux-gold-400 dark:to-viva-magenta-500 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all hover:from-lux-gold-500 hover:via-viva-magenta-600 hover:to-lux-gold-500 dark:hover:from-lux-gold-400 dark:hover:via-viva-magenta-500 dark:hover:to-lux-gold-400 group relative overflow-hidden"
                    onClick={() => setIsOpen(false)}
                  >
                    {/* ✅ ENHANCED: Animated shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                      style={{ width: '50%' }}
                    />
                    <Mail className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="relative z-10">Contact Me</span>
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