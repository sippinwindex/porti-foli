'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Gamepad2, Github, Linkedin, Mail, FileText } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ]

  const socialLinks = [
    { 
      href: 'https://github.com/sippinwindex', 
      icon: Github, 
      label: 'GitHub',
      color: 'hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400'
    },
    { 
      href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/', 
      icon: Linkedin, 
      label: 'LinkedIn',
      color: 'hover:text-blue-600 dark:hover:text-blue-400'
    },
    { 
      href: 'mailto:stormblazdesign@gmail.com', 
      icon: Mail, 
      label: 'Email',
      color: 'hover:text-green-600 dark:hover:text-green-400'
    },
    { 
      href: '/resume.pdf', 
      icon: FileText, 
      label: 'Resume',
      color: 'hover:text-lux-gold-600 dark:hover:text-lux-gold-400'
    }
  ]

  // Smooth scroll function for in-page navigation
  const scrollToSection = (sectionId: string) => {
    if (pathname === '/') {
      // If we're on the home page, scroll to section
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setIsOpen(false) // Close mobile menu
      }
    } else {
      // If we're on a different page, navigate to home first then scroll
      window.location.href = `/#${sectionId}`
    }
  }

  // Handle navigation based on current page
  const handleNavClick = (href: string, e?: React.MouseEvent) => {
    if (href === '/') {
      if (pathname === '/') {
        // Already on home page, scroll to top
        e?.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setIsOpen(false)
      }
      // Let Next.js handle navigation to home for other pages
    } else if (href === '/about' && pathname === '/') {
      // On home page, scroll to about section
      e?.preventDefault()
      scrollToSection('about')
    } else if (href === '/projects' && pathname === '/') {
      // On home page, scroll to projects section
      e?.preventDefault()
      scrollToSection('projects')
    } else if (href === '/contact' && pathname === '/') {
      // On home page, scroll to contact section
      e?.preventDefault()
      scrollToSection('contact')
    }
    // For other cases, let Next.js handle normal routing
    setIsOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="font-bold text-xl text-gray-900 dark:text-white hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400 transition-colors"
            onClick={(e) => handleNavClick('/', e)}
          >
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-viva-magenta-600 to-lux-gold-600 flex items-center justify-center font-bold text-white text-sm">
                JF
              </div>
              <span>Juan Fernandez</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                              (pathname === '/' && item.href !== '/' && 
                               ['about', 'projects', 'contact'].includes(item.name.toLowerCase()))
              
              return (
                <button
                  key={item.name}
                  onClick={(e) => handleNavClick(item.href, e)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-viva-magenta-600 dark:text-viva-magenta-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-viva-magenta-600"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
            
            {/* Social Links */}
            <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-6">
              {socialLinks.slice(0, 2).map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg text-gray-600 dark:text-gray-400 transition-colors ${social.color}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Dino Game Link */}
            <Link
              href="/dinosaur"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden lg:inline">Dino Game</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                                (pathname === '/' && item.href !== '/' && 
                                 ['about', 'projects', 'contact'].includes(item.name.toLowerCase()))
                
                return (
                  <button
                    key={item.name}
                    onClick={(e) => handleNavClick(item.href, e)}
                    className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive
                        ? 'text-viva-magenta-600 dark:text-viva-magenta-400 bg-viva-magenta-50 dark:bg-viva-magenta-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                  </button>
                )
              })}
              
              {/* Mobile Social Links */}
              <div className="flex justify-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg text-gray-600 dark:text-gray-400 transition-colors ${social.color}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
              
              {/* Mobile Dino Game Link */}
              <Link
                href="/dinosaur"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 mt-4"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Dino Game</span>
              </Link>

              {/* Mobile Theme Toggle */}
              <div className="flex justify-center pt-2">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}