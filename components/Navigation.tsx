'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { 
  Home, User, Briefcase, Calendar, Mail, Github, Linkedin, 
  Twitter, FileText, Menu, X, MessageCircle, BookOpen, Gamepad2
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'

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
  const navRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll()
  const navBlur = useTransform(scrollYProgress, [0, 0.1], [0, shouldReduceMotion ? 8 : 20])

  // Initialize mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Memoized navigation items
  const navItems = useMemo<NavItem[]>(() => [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'about', label: 'About', icon: User, href: '/about' },
    { id: 'projects', label: 'Projects', icon: Briefcase, href: '/projects' },
    { id: 'experience', label: 'Experience', icon: Calendar, href: '/#experience' },
    { id: 'blog', label: 'Blog', icon: BookOpen, href: '/blog' },
    { id: 'dino-game', label: 'Game', icon: Gamepad2, href: '/dino-game' },
    { id: 'contact', label: 'Contact', icon: Mail, href: '/contact' }
  ], [])

  // Memoized social links
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

  // Navigation Link Component
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
      setIsMenuOpen(false)
      
      if (item.href.startsWith('/#') && pathname === '/') {
        e.preventDefault()
        const targetId = item.href.replace('/#', '')
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ 
            behavior: shouldReduceMotion ? 'auto' : 'smooth', 
            block: 'start' 
          })
          window.history.pushState(null, '', item.href)
        }
      }
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
        <Link href={item.href} onClick={handleClick} className="block">
          <motion.div
            className={`
              relative flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-300 cursor-pointer
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
              className="flex-shrink-0"
              animate={isActive && !shouldReduceMotion ? { 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <IconComponent className="w-5 h-5" />
            </motion.div>
            
            <span className={isMobile ? 'block' : 'hidden lg:block'}>
              {item.label}
            </span>

            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30"
                layoutId="activeNav"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.div>
        </Link>
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
          <IconComponent className="w-5 h-5" />
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

            {/* Theme Toggle in Mobile Menu */}
            <div className="flex justify-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="theme-toggle-container">
                <ThemeToggle variant="inline" size="md" showLabel={true} />
              </div>
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

  // Don't render until mounted to prevent hydration issues
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
          backgroundColor: 'rgba(250, 250, 250, 0.95)',
          backdropFilter: `blur(${navBlur}px)`,
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >        
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="block">
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
              {/* Theme Toggle with proper positioning */}
              <div className="theme-toggle-container navbar-theme-toggle">
                <ThemeToggle variant="navbar" size="md" />
              </div>
              
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
                {!shouldReduceMotion && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.a>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-3">
              {/* Mobile Theme Toggle */}
              <div className="theme-toggle-container">
                <ThemeToggle variant="navbar" size="sm" />
              </div>
              
              <motion.button
                className="relative w-10 h-10 rounded-xl glass border border-gray-200 dark:border-gray-700 flex items-center justify-center"
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