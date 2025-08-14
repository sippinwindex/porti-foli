'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Menu, X, Github, Linkedin, Mail, FileText, Gamepad2, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [currentSection, setCurrentSection] = useState('home')
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  
  const { scrollYProgress } = useScroll()
  const navBlur = useTransform(scrollYProgress, [0, 0.1], [0, 20])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setScrolled(scrollPosition > 50)

      // Determine current section based on scroll position
      const sections = ['home', 'about', 'projects', 'contact']
      const sectionHeight = window.innerHeight
      const currentIndex = Math.min(Math.floor(scrollPosition / sectionHeight), sections.length - 1)
      setCurrentSection(sections[currentIndex])
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/', id: 'home' },
    { name: 'About', href: '/about', id: 'about' },
    { name: 'Projects', href: '/projects', id: 'projects' },
    { name: 'Contact', href: '/contact', id: 'contact' }
  ]

  const socialLinks = [
    { 
      href: 'https://github.com/sippinwindex', 
      icon: Github, 
      label: 'GitHub',
      color: 'hover:text-lux-gray-600 dark:hover:text-lux-gray-300'
    },
    { 
      href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/', 
      icon: Linkedin, 
      label: 'LinkedIn',
      color: 'hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400'
    },
    { 
      href: 'mailto:stormblazdesign@gmail.com', 
      icon: Mail, 
      label: 'Email',
      color: 'hover:text-lux-teal-600 dark:hover:text-lux-teal-400'
    },
    { 
      href: '/resume.pdf', 
      icon: FileText, 
      label: 'Resume',
      color: 'hover:text-lux-gold-600 dark:hover:text-lux-gold-400'
    }
  ]

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

  const NavLink: React.FC<{ item: typeof navItems[0] }> = ({ item }) => {
    const [hoverRef, rotation] = use3DHover()
    const isActive = pathname === item.href

    return (
      <motion.div
        ref={hoverRef}
        className="relative group"
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href={item.href}
          className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 block ${
            isActive 
              ? 'text-viva-magenta-600 dark:text-viva-magenta-400 bg-viva-magenta-50 dark:bg-viva-magenta-900/30' 
              : 'text-lux-gray-600 dark:text-lux-gray-300 hover:text-lux-gray-900 dark:hover:text-lux-gray-50 hover:bg-lux-gray-100/50 dark:hover:bg-lux-gray-800/50'
          }`}
        >
          {item.name}
          
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
          
          <span className="relative z-10">{item.name}</span>
        </Link>
      </motion.div>
    )
  }

  const SocialLink: React.FC<{ social: typeof socialLinks[0] }> = ({ social }) => {
    const [hoverRef, rotation] = use3DHover()
    const IconComponent = social.icon

    return (
      <motion.div
        ref={hoverRef}
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <a
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-10 h-10 rounded-xl glass-card border border-lux-gray-200 dark:border-lux-gray-700 flex items-center justify-center transition-all duration-300 ${social.color}`}
          title={social.label}
        >
          <IconComponent className="w-5 h-5" />
        </a>
      </motion.div>
    )
  }

  return (
    <>
      {/* Main Navigation */}
      <motion.nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4 transition-all duration-300 ${
          scrolled 
            ? 'glass-card border-b border-lux-gray-200/50 dark:border-lux-gray-700/50' 
            : 'bg-transparent'
        }`}
        style={{ 
          backdropFilter: `blur(${navBlur}px)`
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            
            {/* Logo / Brand */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-2 glass-card rounded-xl p-2 border border-lux-gray-200/50 dark:border-lux-gray-700/50">
                {navItems.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Social Links */}
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <SocialLink key={social.label} social={social} />
                ))}
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Dino Game Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/dinosaur"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span className="hidden xl:inline">Dino Game</span>
                </Link>
              </motion.div>

              {/* CTA Button */}
              <motion.a
                href="mailto:stormblazdesign@gmail.com"
                className="relative group px-6 py-2 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.05 }}
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
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-lux-gray-700 dark:text-lux-gray-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 text-lux-gray-700 dark:text-lux-gray-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600"
          style={{ 
            width: `${scrollYProgress.get() * 100}%`,
            boxShadow: `0 0 10px rgba(190, 52, 85, 0.6)`
          }}
          initial={{ width: "0%" }}
        />
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
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
              onClick={() => setIsOpen(false)}
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
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        pathname === item.href
                          ? 'text-viva-magenta-600 dark:text-viva-magenta-400 bg-viva-magenta-50 dark:bg-viva-magenta-900/30 border border-viva-magenta-200 dark:border-viva-magenta-700'
                          : 'text-lux-gray-600 dark:text-lux-gray-300 hover:text-lux-gray-900 dark:hover:text-lux-gray-50 hover:bg-lux-gray-100/50 dark:hover:bg-lux-gray-800/50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="space-y-4">
                {/* Dino Game */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/dinosaur"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    <span>Dino Game</span>
                  </Link>
                </motion.div>

                {/* Theme Toggle */}
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ThemeToggle />
                </motion.div>

                {/* Social Links */}
                <motion.div
                  className="flex justify-center gap-4 pt-6 border-t border-lux-gray-200 dark:border-lux-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-xl glass-card border border-lux-gray-200 dark:border-lux-gray-700 flex items-center justify-center transition-all duration-300 ${social.color}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </motion.div>

                {/* Contact CTA */}
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation