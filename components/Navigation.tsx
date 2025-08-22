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
      {/* FIXED: Modern Navbar with Proper Container and Spacing */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 w-full h-16 z-[1000] transition-all duration-300 will-change-auto ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg' 
            : 'bg-black/60 backdrop-blur-sm border-b border-white/5'
        }`}
      >
        {/* FIXED: Proper Container with Better Spacing */}
        <div className="h-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-full">
            
            {/* FIXED: Logo Section with Better Spacing */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center flex-shrink-0"
            >
              <Link 
                href="/"
                className="flex items-center space-x-3 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#BE3455] to-[#D4AF37] rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-lg group-hover:shadow-xl transition-shadow">
                  JF
                </div>
                <span className="text-white font-semibold text-lg tracking-tight hidden sm:block group-hover:text-[#BE3455] transition-colors">
                  Juan Fernandez
                </span>
              </Link>
            </motion.div>

            {/* FIXED: Center Navigation Pills with Proper Spacing - Desktop Only */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center bg-black/40 backdrop-blur-sm border border-white/10 rounded-full p-1.5 shadow-lg">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="relative"
                    >
                      <motion.div
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                          isActive 
                            ? 'text-white shadow-lg' 
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden xl:block">{item.name}</span>
                        
                        {/* FIXED: Active Background with Proper Animation */}
                        {isActive && (
                          <motion.div
                            layoutId="navbar-active"
                            className="absolute inset-0 bg-gradient-to-r from-[#BE3455] to-[#D4AF37] rounded-full"
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

            {/* FIXED: Right Actions with Better Spacing and Organization */}
            <div className="flex items-center space-x-3">
              
              {/* FIXED: Social Links - Hidden on mobile, compact on tablet */}
              <div className="hidden md:flex items-center space-x-2">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 hover:text-white transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={link.name}
                  >
                    <link.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>

              {/* FIXED: Theme Toggle with Better Styling */}
              <motion.button
                onClick={cycleTheme}
                className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!mounted}
                title={`Current theme: ${theme}`}
              >
                {getThemeIcon()}
              </motion.button>

              {/* FIXED: Contact Button - Better Responsive Behavior */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden lg:block"
              >
                <Link
                  href="/contact"
                  className="flex items-center space-x-2 bg-gradient-to-r from-[#BE3455] to-[#D4AF37] text-white px-4 py-2.5 rounded-full font-medium text-sm shadow-lg hover:shadow-xl transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact</span>
                </Link>
              </motion.div>

              {/* FIXED: Mobile Menu Button with Better Positioning */}
              <motion.button
                className="lg:hidden w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 hover:text-white transition-all"
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

        {/* FIXED: Progress Bar with Proper Positioning */}
        <ScrollProgress 
          className="absolute bottom-0 left-0 right-0"
          height="2px"
          color="linear-gradient(90deg, #BE3455 0%, #D4AF37 50%, #008080 100%)"
          smooth={true}
        />
      </motion.nav>

      {/* FIXED: Mobile Menu with Better Spacing and Animation */}
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

            {/* FIXED: Mobile Menu Panel with Better Layout */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black/95 backdrop-blur-xl border-l border-white/10 z-[1000] shadow-2xl"
            >
              <div className="flex flex-col h-full">
                
                {/* FIXED: Mobile Menu Header with Proper Spacing */}
                <div className="flex items-center justify-between p-6 border-b border-white/10" style={{ marginTop: '4rem' }}>
                  <h2 className="text-lg font-semibold text-white">
                    Menu
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* FIXED: Mobile Navigation Items with Better Spacing */}
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
                              ? 'bg-gradient-to-r from-[#BE3455] to-[#D4AF37] text-white shadow-lg' 
                              : 'text-white/70 hover:text-white hover:bg-white/5'
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

                {/* FIXED: Mobile Footer Actions with Better Layout */}
                <div className="px-6 py-6 border-t border-white/10 space-y-6">
                  
                  {/* Theme Toggle Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/70">
                      Theme
                    </span>
                    <button
                      onClick={cycleTheme}
                      disabled={!mounted}
                      className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg transition-all hover:bg-white/20 disabled:opacity-50"
                    >
                      {getThemeIcon()}
                      <span className="text-sm text-white/70">
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
                        className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/20 transition-all"
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
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#BE3455] to-[#D4AF37] text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
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