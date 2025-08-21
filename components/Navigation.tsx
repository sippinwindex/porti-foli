// components/Navbar.tsx - COMPLETELY FIXED VERSION
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/lib/theme-provider'
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
  ExternalLink
} from 'lucide-react'

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: User },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Contact', href: '/contact', icon: Mail }
]

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
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Handle mounting for theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen)
  }

  const cycleTheme = () => {
    const themeOrder: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = themeOrder.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    setTheme(themeOrder[nextIndex])
  }

  const getThemeIcon = () => {
    if (!mounted) return <Monitor className="w-5 h-5" />
    
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5 text-yellow-500" />
      case 'dark':
        return <Moon className="w-5 h-5 text-blue-400" />
      case 'system':
        return <Monitor className="w-5 h-5 text-gray-500" />
      default:
        return <Monitor className="w-5 h-5" />
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light Mode'
      case 'dark':
        return 'Dark Mode'
      case 'system':
        return 'System Theme'
      default:
        return 'Theme'
    }
  }

  return (
    <>
      {/* Fixed Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/"
                className="flex items-center space-x-2 font-bold text-xl text-gray-900 dark:text-white"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">JF</span>
                </div>
                <span className="hidden sm:block">Juan Fernandez</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    <span className="relative z-10 flex items-center space-x-1">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg"
                        initial={false}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Social Links */}
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={link.name}
                >
                  <link.icon className="w-5 h-5" />
                </motion.a>
              ))}

              {/* Theme Toggle */}
              <motion.button
                onClick={cycleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={getThemeLabel()}
              >
                {getThemeIcon()}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={toggleMobileMenu}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Navigation
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation Items */}
                <div className="flex-1 px-6 py-4 space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
                          />
                        )}
                      </Link>
                    )
                  })}
                </div>

                {/* Mobile Actions */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Theme
                    </span>
                    <button
                      onClick={cycleTheme}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors"
                    >
                      {getThemeIcon()}
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </span>
                    </button>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center justify-center space-x-4 pt-4">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <link.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navbar Spacer */}
      <div className="h-16" />
    </>
  )
}