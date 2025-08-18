'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { 
  Home, User, Briefcase, Calendar, Mail, Github, Linkedin, 
  Twitter, FileText, Menu, X, ExternalLink, MessageCircle,
  Sun, Moon, BookOpen, Gamepad2
} from 'lucide-react'

const Navigation = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState('home')
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll()
  const navBlur = useTransform(scrollYProgress, [0, 0.1], [0, 20])

  // Navigation items - Updated with correct paths
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'about', label: 'About', icon: User, href: '/#about' },
    { id: 'projects', label: 'Projects', icon: Briefcase, href: '/#projects' },
    { id: 'experience', label: 'Experience', icon: Calendar, href: '/#experience' },
    { id: 'blog', label: 'Blog', icon: BookOpen, href: '/posts' },
    { id: 'dino-game', label: 'Game', icon: Gamepad2, href: '/dinosaur' },
    { id: 'contact', label: 'Contact', icon: Mail, href: '/#contact' }
  ]

  // Social links
  const socialLinks = [
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
  ]

  // Ensure component is mounted before rendering to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Theme toggle functionality
  useEffect(() => {
    if (!mounted) return
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [mounted])

  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }

    // Create ripple effect animation
    const ripple = document.createElement('div')
    ripple.className = 'fixed inset-0 pointer-events-none z-[9999] opacity-0'
    ripple.style.background = darkMode 
      ? 'radial-gradient(circle at center, #FAFAFA 0%, transparent 70%)'
      : 'radial-gradient(circle at center, #121212 0%, transparent 70%)'
    
    document.body.appendChild(ripple)
    
    // Animate ripple
    ripple.animate([
      { opacity: 0, transform: 'scale(0)' },
      { opacity: 0.8, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(3)' }
    ], {
      duration: 800,
      easing: 'ease-out'
    }).onfinish = () => ripple.remove()
  }

  // Track scroll progress and determine current section based on pathname
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrolled / maxScroll
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Determine active section based on pathname and hash
  useEffect(() => {
    // Handle null pathname
    if (!pathname) return
    
    if (pathname === '/') {
      // Check if there's a hash in the URL
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        setCurrentSection(hash)
      } else {
        // Check scroll position for sections on homepage
        const sections = ['hero', 'about', 'projects', 'experience', 'contact']
        const observerOptions = {
          threshold: 0.3,
          rootMargin: '-20% 0px -70% 0px'
        }

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setCurrentSection(entry.target.id)
            }
          })
        }, observerOptions)

        sections.forEach(sectionId => {
          const element = document.getElementById(sectionId)
          if (element) {
            observer.observe(element)
          }
        })

        return () => observer.disconnect()
      }
    } else if (pathname === '/posts') {
      setCurrentSection('blog')
    } else if (pathname === '/dinosaur') {
      setCurrentSection('dino-game')
    } else if (pathname.includes('/photos')) {
      setCurrentSection('about')
    }
  }, [pathname])

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

  // Enhanced Theme Toggle Component
  const ThemeToggle = () => {
    const [hoverRef, rotation] = use3DHover()

    if (!mounted) {
      return (
        <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      )
    }

    return (
      <motion.div
        ref={hoverRef}
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.button
          onClick={toggleTheme}
          className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 glass border border-gray-200/50 dark:border-gray-700/50"
          style={{
            background: darkMode 
              ? 'linear-gradient(45deg, #3B82F6, #8B5CF6)'
              : 'linear-gradient(45deg, #FEF3C7, #FDE68A)'
          }}
          aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          <motion.div
            className="absolute top-0.5 w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center"
            animate={{
              x: darkMode ? 24 : 2,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
          >
            <AnimatePresence mode="wait">
              {darkMode ? (
                <motion.div
                  key="moon"
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon className="w-3 h-3 text-blue-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun className="w-3 h-3 text-yellow-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: darkMode 
                ? '0 0 20px rgba(59, 130, 246, 0.3)'
                : '0 0 20px rgba(251, 191, 36, 0.3)'
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </motion.div>
    )
  }

  // Navigation Link Component
  interface NavLinkProps {
    item: typeof navItems[0]
    index: number
    isMobile?: boolean
  }

  const NavLink: React.FC<NavLinkProps> = ({ item, index, isMobile = false }) => {
    const [hoverRef, rotation] = use3DHover()
    const isActive = currentSection === item.id || 
                   (pathname === item.href) ||
                   (item.href.includes('#') && pathname === '/' && `/#${currentSection}` === item.href)
    const IconComponent = item.icon

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      setIsMenuOpen(false)
      
      // Handle hash navigation on same page
      if (item.href.startsWith('/#') && pathname === '/') {
        e.preventDefault()
        const targetId = item.href.replace('/#', '')
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          // Update URL without reload
          window.history.pushState(null, '', item.href)
        }
      }
      // Let Next.js handle other navigation
    }

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
        <Link href={item.href} onClick={handleClick} className="block">
          <motion.div
            className={`
              relative flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-300 cursor-pointer
              ${isActive 
                ? 'text-white bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 shadow-lg' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
              }
              ${isMobile ? 'text-lg justify-center' : 'text-sm'}
            `}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
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
            
            <span className={isMobile ? 'block' : 'hidden lg:block'}>
              {item.label}
            </span>

            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-viva-magenta-600/20 to-lux-gold-600/20 border border-viva-magenta-500/30"
                layoutId="activeNav"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}

            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-viva-magenta-50/50 to-lux-gold-50/50 dark:from-viva-magenta-900/10 dark:to-lux-gold-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1 }}
            />
          </motion.div>
        </Link>
      </motion.div>
    )
  }

  // Social Link Component
  interface SocialLinkProps {
    social: typeof socialLinks[0]
    index: number
  }

  const SocialLink: React.FC<SocialLinkProps> = ({ social, index }) => {
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
            block w-10 h-10 rounded-xl glass border border-gray-200/50 dark:border-gray-700/50
            flex items-center justify-center transition-all duration-300
            hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:border-viva-magenta-300 dark:hover:border-viva-magenta-600 hover:scale-110 ${social.color}
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
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
      <motion.nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[1000] px-4 sm:px-6 lg:px-8 py-4"
        style={{ 
          backgroundColor: darkMode ? 'rgba(18, 18, 18, 0.95)' : 'rgba(250, 250, 250, 0.95)',
          backdropFilter: `blur(${navBlur}px)`,
          borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >        
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            
            {/* Logo / Brand */}
            <Link href="/" className="block">
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="flex items-center gap-3 cursor-pointer"
                  whileHover={{ x: 5 }}
                >
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
              <ThemeToggle />
              
              <div className="flex items-center gap-2">
                {socialLinks.map((social, index) => (
                  <SocialLink key={social.platform} social={social} index={index} />
                ))}
              </div>

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

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-3">
              <ThemeToggle />
              
              <motion.button
                className="relative w-10 h-10 rounded-xl glass border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-5 h-5 flex flex-col justify-center items-center"
                  animate={isMenuOpen ? "open" : "closed"}
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600"
          style={{ 
            width: `${scrollProgress * 100}%`,
            boxShadow: `0 0 10px rgba(190, 52, 85, 0.6)`
          }}
          initial={{ width: "0%" }}
        />
      </motion.nav>

      <MobileMenu />
    </>
  )
}

export default Navigation