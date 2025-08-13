'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { 
  Home, User, Briefcase, Calendar, Mail, Github, Linkedin, 
  Twitter, FileText, Menu, X, ExternalLink, MessageCircle 
} from 'lucide-react'
import Link from 'next/link'

const Enhanced3DNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState('home')
  const navRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll()
  const navBackground = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["rgba(250, 250, 250, 0)", "rgba(250, 250, 250, 0.95)"]
  )
  const navBackgroundDark = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["rgba(18, 18, 18, 0)", "rgba(18, 18, 18, 0.95)"]
  )
  const navBlur = useTransform(scrollYProgress, [0, 0.1], [0, 20])

  // Navigation items with icons and routes
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'about', label: 'About', icon: User, href: '/about' },
    { id: 'projects', label: 'Projects', icon: Briefcase, href: '/projects' },
    { id: 'experience', label: 'Experience', icon: Calendar, href: '/experience' },
    { id: 'contact', label: 'Contact', icon: Mail, href: '/contact' }
  ]

  // Social links
  const socialLinks = [
    { 
      platform: 'GitHub', 
      href: 'https://github.com/sippinwindex', 
      icon: Github,
      color: 'hover:text-lux-gray-600 dark:hover:text-lux-gray-300'
    },
    { 
      platform: 'LinkedIn', 
      href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/', 
      icon: Linkedin,
      color: 'hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400'
    },
    { 
      platform: 'Twitter', 
      href: 'https://x.com/FullyStackedUp', 
      icon: Twitter,
      color: 'hover:text-lux-teal-600 dark:hover:text-lux-teal-400'
    },
    { 
      platform: 'Resume', 
      href: 'https://flowcv.com/resume/moac4k9d8767', 
      icon: FileText,
      color: 'hover:text-lux-gold-600 dark:hover:text-lux-gold-400'
    }
  ]

  // Track scroll progress and current section
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrolled / maxScroll
      setScrollProgress(progress)

      // Determine current section based on scroll position
      const sections = ['home', 'about', 'projects', 'experience', 'contact']
      const sectionHeight = maxScroll / (sections.length - 1)
      const currentIndex = Math.min(Math.floor(scrolled / sectionHeight), sections.length - 1)
      setCurrentSection(sections[currentIndex])
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 3D Hover Effect Hook
  const use3DHover = () => {
    const ref = useRef<HTMLDivElement>(null)
    const [rotation, setRotation] = useState({ x: 0, y: 0 })

    useEffect(() => {
      const element = ref.current
      if (!element) return

      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const rotateX = (e.clientY - centerY) / 10
        const rotateY = (centerX - e.clientX) / 10
        
        setRotation({ x: rotateX, y: rotateY })
      }

      const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 })
      }

      element.addEventListener('mousemove', handleMouseMove)
      element.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        element.removeEventListener('mousemove', handleMouseMove)
        element.removeEventListener('mouseleave', handleMouseLeave)
      }
    }, [])

    return [ref, rotation] as const
  }

  // Navigation Link Component
  const NavLink: React.FC<{ 
    item: typeof navItems[0]
    index: number
    isMobile?: boolean 
  }> = ({ item, index, isMobile = false }) => {
    const [hoverRef, rotation] = use3DHover()
    const isActive = currentSection === item.id
    const IconComponent = item.icon

    return (
      <motion.div
        ref={hoverRef}
        className="relative group"
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
        initial={{ opacity: 0, y: isMobile ? 20 : -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
      >
        <motion.div
          className={`
            relative flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-300 
            ${isActive 
              ? 'text-viva-magenta-600 dark:text-viva-magenta-400 bg-viva-magenta-50 dark:bg-viva-magenta-900/30 border border-viva-magenta-200 dark:border-viva-magenta-700' 
              : 'text-lux-gray-600 dark:text-lux-gray-300 hover:text-lux-gray-900 dark:hover:text-lux-gray-50 hover:bg-lux-gray-100/50 dark:hover:bg-lux-gray-800/50'
            }
            ${isMobile ? 'text-lg justify-center' : 'text-sm'}
          `}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href={item.href} className="flex items-center gap-3 w-full">
            {/* Icon */}
            <motion.div
              className="flex-shrink-0"
              animate={isActive ? { 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <IconComponent className="w-5 h-5" />
            </motion.div>
            
            {/* Label */}
            <span className={isMobile ? 'block' : 'hidden lg:block'}>
              {item.label}
            </span>
          </Link>

          {/* Active Indicator */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-viva-magenta-50 to-lux-gold-50 dark:from-viva-magenta-900/20 dark:to-lux-gold-900/20 border border-viva-magenta-200 dark:border-viva-magenta-700"
              layoutId="activeNav"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          {/* Hover Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-viva-magenta-50/50 to-lux-gold-50/50 dark:from-viva-magenta-900/10 dark:to-lux-gold-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
          />
        </motion.div>
      </motion.div>
    )
  }

  // Social Link Component
  const SocialLink: React.FC<{ 
    social: typeof socialLinks[0]
    index: number 
  }> = ({ social, index }) => {
    const [hoverRef, rotation] = use3DHover()
    const IconComponent = social.icon

    return (
      <motion.div
        ref={hoverRef}
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 300 }}
      >
        <motion.a
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            block w-10 h-10 rounded-xl bg-lux-gray-100/50 dark:bg-lux-gray-800/50 backdrop-blur-sm border border-lux-gray-200 dark:border-lux-gray-700
            flex items-center justify-center transition-all duration-300
            hover:bg-lux-gray-200/50 dark:hover:bg-lux-gray-700/50 hover:border-viva-magenta-300 dark:hover:border-viva-magenta-600 hover:scale-110 ${social.color}
          `}
          whileHover={{ y: -3, rotateY: 10 }}
          whileTap={{ scale: 0.9 }}
          title={social.platform}
        >
          <IconComponent className="w-5 h-5" />
        </motion.a>
      </motion.div>
    )
  }

  // Mobile Menu Component
  const MobileMenu = () => (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-lux-black/50 dark:bg-lux-black/70 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Content */}
          <motion.div
            className="absolute top-20 left-4 right-4 glass-card border border-lux-gray-200/50 dark:border-lux-gray-700/50 rounded-2xl p-8"
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Navigation Links */}
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

            {/* Social Links */}
            <div className="flex justify-center gap-4 pt-6 border-t border-lux-gray-200 dark:border-lux-gray-700">
              {socialLinks.map((social, index) => (
                <SocialLink key={social.platform} social={social} index={index} />
              ))}
            </div>

            {/* Contact CTA */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.a
                href="mailto:stormblazdesign@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white font-semibold rounded-xl shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Let's Talk</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {/* Main Navigation */}
      <motion.nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 py-4"
        style={{ 
          backgroundColor: 'var(--nav-bg, rgba(250, 250, 250, 0.95))',
          backdropFilter: `blur(${navBlur}px)`,
          borderBottom: '1px solid rgba(var(--lux-gray-200), 0.5)'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <style jsx>{`
          :global(.dark) nav {
            --nav-bg: rgba(18, 18, 18, 0.95);
            border-bottom-color: rgba(var(--lux-gray-700), 0.5);
          }
          :global(.light) nav {
            --nav-bg: rgba(250, 250, 250, 0.95);
            border-bottom-color: rgba(var(--lux-gray-200), 0.5);
          }
        `}</style>
        
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            
            {/* Logo / Brand */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ x: 5 }}
              >
                <Link href="/" className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-viva-magenta-600 to-lux-gold-600 flex items-center justify-center font-bold text-white shadow-lg"
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(190, 52, 85, 0.3)",
                        "0 0 30px rgba(212, 175, 55, 0.3)",
                        "0 0 20px rgba(190, 52, 85, 0.3)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    JF
                  </motion.div>
                  <span className="hidden sm:block font-bold text-lux-gray-900 dark:text-lux-gray-50 text-lg">
                    Juan Fernandez
                  </span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-2 glass-card rounded-xl p-2 border border-lux-gray-200/50 dark:border-lux-gray-700/50">
                {navItems.map((item, index) => (
                  <NavLink key={item.id} item={item} index={index} />
                ))}
              </div>
            </div>

            {/* Desktop Social + CTA */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Social Links */}
              <div className="flex items-center gap-2">
                {socialLinks.map((social, index) => (
                  <SocialLink key={social.platform} social={social} index={index} />
                ))}
              </div>

              {/* CTA Button */}
              <motion.a
                href="mailto:stormblazdesign@gmail.com"
                className="relative group px-6 py-2 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Let's Talk
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-lux-gold-600 to-viva-magenta-600"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden relative w-10 h-10 rounded-xl glass-card border border-lux-gray-200 dark:border-lux-gray-700 flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-5 h-5 flex flex-col justify-center items-center"
                animate={isMenuOpen ? "open" : "closed"}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-lux-gray-700 dark:text-lux-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-lux-gray-700 dark:text-lux-gray-300" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600"
          style={{ 
            width: `${scrollProgress * 100}%`,
            boxShadow: `0 0 10px rgba(190, 52, 85, 0.6)`
          }}
          initial={{ width: "0%" }}
        />
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu />
    </>
  )
}

export default Enhanced3DNavigation