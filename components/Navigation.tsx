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
  const [currentHash, setCurrentHash] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle hash changes on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentHash(window.location.hash)
      
      const handleHashChange = () => {
        setCurrentHash(window.location.hash)
      }
      
      window.addEventListener('hashchange', handleHashChange)
      return () => window.removeEventListener('hashchange', handleHashChange)
    }
  }, [pathname])

  const socialLinks = [
    { 
      href: 'https://github.com/sippinwindex', 
      icon: Github, 
      label: 'GitHub',
      color: 'hover:text-gray-800 dark:hover:text-gray-200'
    },
    { 
      href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/', 
      icon: Linkedin, 
      label: 'LinkedIn',
      color: 'hover:text-blue-600 dark:hover:text-blue-400'
    },
    { 
      href: 'mailto:jafernandez94@gmail.com', 
      icon: Mail, 
      label: 'Email',
      color: 'hover:text-green-600 dark:hover:text-green-400'
    },
    { 
      href: '/resume.pdf', 
      icon: FileText, 
      label: 'Resume',
      color: 'hover:text-purple-600 dark:hover:text-purple-400'
    }
  ]

  // Smooth scroll function for in-page navigation
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false) // Close mobile menu
    }
  }

  // Handle navigation based on current page and sections
  const handleNavClick = (section: string, e?: React.MouseEvent) => {
    e?.preventDefault()
    
    // Check if window is available (client-side only)
    if (typeof window === 'undefined') return
    
    if (pathname !== '/') {
      // If not on home page, navigate to home with hash
      window.location.href = `/#${section}`
    } else {
      // If on home page, scroll to section
      scrollToSection(section)
    }
    setIsOpen(false)
  }

  // Navigation items with both section-based and page-based navigation
  const navItems = [
    { name: 'Home', section: 'hero', type: 'section' },
    { name: 'About', section: 'about', type: 'section' },
    { name: 'Projects', section: 'projects', type: 'section' },
    { name: 'Blog', href: '/blog', type: 'page' },
    { name: 'Contact', section: 'contact', type: 'section' },
  ]

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
            className="font-bold text-xl text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                JF
              </div>
              <span>Juan Fernandez</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              // Handle both section and page navigation
              let isActive = false
              
              if (item.type === 'section') {
                isActive = (pathname === '/' && item.section === 'hero' && !currentHash) || 
                          (pathname === '/' && currentHash === `#${item.section}`)
              } else if (item.type === 'page') {
                isActive = pathname === item.href
              }
              
              return (
                <motion.div key={item.name}>
                  {item.type === 'section' ? (
                    <motion.button
                      onClick={(e) => handleNavClick(item.section!, e)}
                      className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10">{item.name}</span>
                      
                      {/* Hover background effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100"
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      {/* Hover underline */}
                      {!isActive && (
                        <motion.div
                          className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100"
                          initial={{ width: 0, x: '-50%' }}
                          whileHover={{ width: '80%' }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  ) : (
                    <Link href={item.href!}>
                      <motion.div
                        className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                          isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10">{item.name}</span>
                        
                        {/* Hover background effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100"
                          initial={{ scale: 0.8 }}
                          whileHover={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                        
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="navbar-indicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        
                        {/* Hover underline */}
                        {!isActive && (
                          <motion.div
                            className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100"
                            initial={{ width: 0, x: '-50%' }}
                            whileHover={{ width: '80%' }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  )}
                </motion.div>
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
                  className={`relative p-2 rounded-lg text-gray-600 dark:text-gray-400 transition-all duration-300 group overflow-hidden ${social.color}`}
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  whileTap={{ scale: 0.95 }}
                  title={social.label}
                >
                  {/* Hover background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0, rotate: 45 }}
                    whileHover={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Icon with animation */}
                  <motion.div
                    className="relative z-10"
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.div>
                  
                  {/* Sparkle effect */}
                  <motion.div
                    className="absolute top-1 right-1 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100"
                    animate={{ 
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      delay: 0.2
                    }}
                  />
                </motion.a>
              ))}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Dino Game Link */}
            <Link href="/dino-game">
              <motion.div
                className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform group overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Content */}
                <motion.div
                  className="relative z-10 flex items-center gap-2"
                  whileHover={{ x: 1 }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Gamepad2 className="w-4 h-4" />
                  </motion.div>
                  <span className="hidden lg:inline font-medium">Dino Game</span>
                </motion.div>
                
                {/* Glowing effect */}
                <motion.div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-30"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
                    filter: 'blur(4px)'
                  }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
              {navItems.map((item, index) => {
                // Handle both section and page navigation for mobile
                let isActive = false
                
                if (item.type === 'section') {
                  isActive = (pathname === '/' && item.section === 'hero' && !currentHash) || 
                            (pathname === '/' && currentHash === `#${item.section}`)
                } else if (item.type === 'page') {
                  isActive = pathname === item.href
                }
                
                return item.type === 'section' ? (
                  <motion.button
                    key={item.name}
                    onClick={(e) => handleNavClick(item.section!, e)}
                    className={`relative block w-full text-left px-3 py-2 text-base font-medium rounded-md transition-all duration-300 group overflow-hidden ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">{item.name}</span>
                    
                    {/* Hover effect */}
                    {!isActive && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100"
                        initial={{ scaleY: 0 }}
                        whileHover={{ scaleY: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.button>
                ) : (
                  <Link key={item.name} href={item.href!} onClick={() => setIsOpen(false)}>
                    <motion.div
                      className={`relative block w-full text-left px-3 py-2 text-base font-medium rounded-md transition-all duration-300 group overflow-hidden ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10">{item.name}</span>
                      
                      {/* Hover effect */}
                      {!isActive && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100"
                          initial={{ scaleY: 0 }}
                          whileHover={{ scaleY: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.div>
                  </Link>
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
              <Link href="/dino-game">
                <motion.div
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 mt-4 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Dino Game</span>
                </motion.div>
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