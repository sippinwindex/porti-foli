'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { 
  Home, User, Briefcase, Calendar, Mail, Github, Linkedin, 
  Twitter, FileText, Menu, X, ExternalLink, MessageCircle, Code 
} from 'lucide-react'
import Link from 'next/link'

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

const Enhanced3DNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState('home')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const navRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll()
  
  // Enhanced spring animations for smoother transitions
  const springConfig = { stiffness: 300, damping: 30, mass: 0.8 }
  const springScrollY = useSpring(scrollYProgress, springConfig)
  
  const navBackground = useTransform(
    springScrollY,
    [0, 0.1],
    ["rgba(18, 18, 18, 0)", "rgba(18, 18, 18, 0.95)"]
  )
  
  const navBlur = useTransform(springScrollY, [0, 0.1], [0, 20])
  const navScale = useTransform(springScrollY, [0, 0.1], [1, 0.98])

  // Memoized navigation items to prevent recreation
  const navItems: NavItem[] = useMemo(() => [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'about', label: 'About', icon: User, href: '/about' },
    { id: 'projects', label: 'Projects', icon: Briefcase, href: '/projects' },
    { id: 'experience', label: 'Experience', icon: Calendar, href: '/experience' },
    { id: 'contact', label: 'Contact', icon: Mail, href: '/contact' }
  ], [])

  // Memoized social links to prevent recreation
  const socialLinks: SocialLink[] = useMemo(() => [
    { 
      platform: 'GitHub', 
      href: 'https://github.com/sippinwindex', 
      icon: Github,
      color: 'hover:text-gray-300'
    },
    { 
      platform: 'LinkedIn', 
      href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/', 
      icon: Linkedin,
      color: 'hover:text-viva-magenta-400'
    },
    { 
      platform: 'Twitter', 
      href: 'https://x.com/FullyStackedUp', 
      icon: Twitter,
      color: 'hover:text-lux-teal-400'
    },
    { 
      platform: 'Resume', 
      href: 'https://flowcv.com/resume/moac4k9d8767', 
      icon: FileText,
      color: 'hover:text-lux-gold-400'
    }
  ], [])

  // Enhanced scroll tracking with performance optimizations
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          const progress = scrolled / maxScroll
          setScrollProgress(progress)

          // Determine current section based on scroll position
          const sections = ['home', 'about', 'projects', 'experience', 'contact']
          const sectionHeight = maxScroll / (sections.length - 1)
          const currentIndex = Math.min(Math.floor(scrolled / sectionHeight), sections.length - 1)
          setCurrentSection(sections[currentIndex])
          
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Enhanced mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = navRef.current?.getBoundingClientRect()
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height
        })
      }
    }

    const nav = navRef.current
    if (nav) {
      nav.addEventListener('mousemove', handleMouseMove, { passive: true })
      return () => nav.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Enhanced 3D Hover Effect Hook with memoization
  const use3DHover = useCallback(() => {
    const ref = useRef<HTMLDivElement>(null)
    const [rotation, setRotation] = useState({ x: 0, y: 0 })

    useEffect(() => {
      const element = ref.current
      if (!element) return

      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const rotateX = (e.clientY - centerY) / 15
        const rotateY = (centerX - e.clientX) / 15
        
        setRotation({ x: rotateX, y: rotateY })
      }

      const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 })
      }

      element.addEventListener('mousemove', handleMouseMove, { passive: true })
      element.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        element.removeEventListener('mousemove', handleMouseMove)
        element.removeEventListener('mouseleave', handleMouseLeave)
      }
    }, [])

    return [ref, rotation] as const
  }, [])

  // Enhanced Navigation Link Component with memoization
  const NavLink = React.memo<{ 
    item: NavItem
    index: number
    isMobile?: boolean 
  }>(({ item, index, isMobile = false }) => {
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
        transition={{ delay: index * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.div
          className={`
            relative flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-300 
            ${isActive 
              ? 'text-viva-magenta-400 bg-viva-magenta-900/30 border border-viva-magenta-700 glass-3d' 
              : 'text-lux-gray-300 hover:text-lux-gray-50 hover:bg-lux-gray-800/50'
            }
            ${isMobile ? 'text-lg justify-center' : 'text-sm'}
          `}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href={item.href} className="flex items-center gap-3 w-full">
            {/* Enhanced Icon with 3D animation */}
            <motion.div
              className="flex-shrink-0"
              animate={isActive ? { 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <IconComponent className="w-5 h-5" />
            </motion.div>
            
            {/* Label */}
            <span className={isMobile ? 'block' : 'hidden lg:block'}>
              {item.label}
            </span>
          </Link>

          {/* Enhanced Active Indicator with 3D depth */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-viva-magenta-900/20 to-lux-gold-900/20 border border-viva-magenta-700/50"
              layoutId="activeNav"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ transform: 'translateZ(-5px)' }}
            />
          )}

          {/* Enhanced Hover Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-viva-magenta-500/10 to-lux-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
          />

          {/* 3D Depth indicator */}
          <div 
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-black/10 opacity-50"
            style={{ transform: 'translateZ(-2px)' }}
          />
        </motion.div>
      </motion.div>
    )
  })

  NavLink.displayName = 'NavLink'

  // Enhanced Social Link Component with memoization
  const SocialLink = React.memo<{ 
    social: SocialLink
    index: number 
  }>(({ social, index }) => {
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
            block w-10 h-10 rounded-xl glass-3d border border-lux-gray-700
            flex items-center justify-center transition-all duration-300
            hover:border-viva-magenta-600 hover:scale-110 ${social.color}
            transform-gpu will-change-transform
          `}
          whileHover={{ y: -3, rotateY: 10, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={social.platform}
        >
          <IconComponent className="w-5 h-5" />
          
          {/* 3D depth shadow */}
          <div 
            className="absolute inset-0 rounded-xl bg-black/20"
            style={{ transform: 'translateZ(-3px)' }}
          />
        </motion.a>
      </motion.div>
    )
  })

  SocialLink.displayName = 'SocialLink'

  // Enhanced Mobile Menu Component
  const MobileMenu = React.memo(() => (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Enhanced Backdrop with blur effect */}
          <motion.div
            className="absolute inset-0 backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(18, 18, 18, 0.8) 0%, rgba(31, 41, 55, 0.9) 100%)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Enhanced Menu Content with 3D effects */}
          <motion.div
            className="absolute top-20 left-4 right-4 glass-card border border-lux-gray-700/50 rounded-2xl p-8 transform-gpu"
            initial={{ opacity: 0, y: -50, scale: 0.95, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -50, scale: 0.95, rotateX: -15 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              transformStyle: 'preserve-3d',
              background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.8) 100%)'
            }}
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
            <div className="flex justify-center gap-4 pt-6 border-t border-lux-gray-700">
              {socialLinks.map((social, index) => (
                <SocialLink key={social.platform} social={social} index={index} />
              ))}
            </div>

            {/* Enhanced Contact CTA with 3D effect */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.a
                href="mailto:stormblazdesign@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white font-semibold rounded-xl shadow-lg transform-gpu"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Let's Talk</span>
                
                {/* 3D button depth */}
                <div 
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-viva-magenta-700 to-lux-gold-700"
                  style={{ transform: 'translateZ(-3px)' }}
                />
              </motion.a>
            </motion.div>

            {/* Floating particles for ambiance */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-viva-magenta-400/30 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  ))

  MobileMenu.displayName = 'MobileMenu'

  return (
    <>
      {/* Enhanced Main Navigation */}
      <motion.nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 py-4 transform-gpu"
        style={{ 
          backgroundColor: navBackground,
          backdropFilter: `blur(${navBlur}px)`,
          scale: navScale,
          transformStyle: 'preserve-3d'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Dynamic background gradient based on mouse position */}
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%, rgba(190, 52, 85, 0.3) 0%, transparent 70%)`
          }}
          animate={{
            background: [
              `radial-gradient(circle at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%, rgba(190, 52, 85, 0.3) 0%, transparent 70%)`,
              `radial-gradient(circle at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%, rgba(212, 175, 55, 0.2) 0%, transparent 70%)`,
              `radial-gradient(circle at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%, rgba(190, 52, 85, 0.3) 0%, transparent 70%)`
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-between">
            
            {/* Enhanced Logo / Brand with 3D effect */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ x: 5 }}
              >
                <Link href="/" className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-viva-magenta-600 to-lux-gold-600 flex items-center justify-center font-bold text-white shadow-lg transform-gpu"
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(190, 52, 85, 0.3)",
                        "0 0 30px rgba(212, 175, 55, 0.3)",
                        "0 0 20px rgba(190, 52, 85, 0.3)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <Code className="w-5 h-5" />
                    {/* 3D logo depth */}
                    <div 
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-viva-magenta-700 to-lux-gold-700"
                      style={{ transform: 'translateZ(-3px)' }}
                    />
                  </motion.div>
                  <span className="hidden sm:block font-bold text-lux-gray-50 text-lg">
                    Juan Fernandez
                  </span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-2 glass-card rounded-xl p-2 border border-lux-gray-700/50">
                {navItems.map((item, index) => (
                  <NavLink key={item.id} item={item} index={index} />
                ))}
              </div>
            </div>

            {/* Enhanced Desktop Social + CTA */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Social Links */}
              <div className="flex items-center gap-2">
                {socialLinks.map((social, index) => (
                  <SocialLink key={social.platform} social={social} index={index} />
                ))}
              </div>

              {/* Enhanced CTA Button with 3D effect */}
              <motion.a
                href="mailto:stormblazdesign@gmail.com"
                className="relative group px-6 py-2 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg transform-gpu"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: 'preserve-3d' }}
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
                {/* 3D button depth */}
                <div 
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-viva-magenta-700 to-lux-gold-700"
                  style={{ transform: 'translateZ(-3px)' }}
                />
              </motion.a>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <motion.button
              className="lg:hidden relative w-10 h-10 rounded-xl glass-card border border-lux-gray-700 flex items-center justify-center transform-gpu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div
                className="w-5 h-5 flex flex-col justify-center items-center"
                animate={isMenuOpen ? "open" : "closed"}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5 text-lux-gray-300" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5 text-lux-gray-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* 3D button depth */}
              <div 
                className="absolute inset-0 rounded-xl bg-lux-gray-800/50"
                style={{ transform: 'translateZ(-2px)' }}
              />
            </motion.button>
          </div>
        </div>

        {/* Enhanced Scroll Progress Bar with 3D effect */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 transform-gpu"
          style={{ 
            width: `${scrollProgress * 100}%`,
            boxShadow: `0 0 10px rgba(190, 52, 85, 0.6), 0 0 20px rgba(212, 175, 55, 0.4)`,
            transformStyle: 'preserve-3d'
          }}
          initial={{ width: "0%" }}
        />

        {/* 3D navigation depth layer */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-lux-gray-900/50 to-transparent opacity-30"
          style={{ transform: 'translateZ(-5px)' }}
        />
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu />
    </>
  )
}

export default Enhanced3DNavigation