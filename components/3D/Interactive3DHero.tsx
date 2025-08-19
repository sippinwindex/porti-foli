'use client'

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion, useInView } from 'framer-motion'
import { Github, Linkedin, Mail, ExternalLink, Star, GitFork, Calendar, Code, Zap, Award, Download } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  featured: boolean
  github?: {
    stars: number
    forks: number
    url: string
  }
  vercel?: {
    isLive: boolean
    liveUrl?: string
  }
}

interface Interactive3DHeroProps {
  projects: Project[]
}

// Memoized constants to prevent recreation
const TECH_STACK = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Three.js', 'Python', 'GraphQL']
const PARTICLE_COUNT = 25 // Reduced for better performance

const Interactive3DHero: React.FC<Interactive3DHeroProps> = ({ projects = [] }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  const prefersReducedMotion = useReducedMotion()
  const isInView = useInView(containerRef, { once: true })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Enhanced spring animations with reduced motion support
  const springConfig = useMemo(() => ({
    stiffness: prefersReducedMotion ? 200 : 100,
    damping: prefersReducedMotion ? 40 : 30,
    mass: 0.8
  }), [prefersReducedMotion])

  const springScrollY = useSpring(scrollYProgress, springConfig)
  const y = useTransform(springScrollY, [0, 1], ["0%", prefersReducedMotion ? "20%" : "50%"])
  const opacity = useTransform(springScrollY, [0, 0.5, 1], [1, 0.9, 0.7])
  const scale = useTransform(springScrollY, [0, 1], [1, prefersReducedMotion ? 0.95 : 0.8])

  // ✅ Fixed: Remove prefersReducedMotion from dependencies (it's a stable prop)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (rect && !prefersReducedMotion) { // Use directly in the function
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height
      
      // Throttle updates for better performance
      requestAnimationFrame(() => {
        setMousePosition({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) })
      })
    }
  }, []) // ✅ Empty dependency array

  useEffect(() => {
    const container = heroRef.current
    if (!container) return

    container.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Loading sequence with better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 800)
    return () => clearTimeout(timer)
  }, [])

  // ✅ Fixed: Memoized calculations for better performance
  const calculatedStats = useMemo(() => {
    if (!projects.length) {
      return [
        { label: "Projects Built", value: "8+", icon: Code, color: "text-blue-600" },
        { label: "GitHub Stars", value: "50+", icon: Star, color: "text-yellow-600" },
        { label: "Live Projects", value: "6+", icon: Zap, color: "text-green-600" },
        { label: "Years Experience", value: "5+", icon: Calendar, color: "text-purple-600" }
      ]
    }

    const totalStars = projects.reduce((acc, p) => acc + (p.github?.stars || 0), 0)
    const totalForks = projects.reduce((acc, p) => acc + (p.github?.forks || 0), 0)
    const liveProjects = projects.filter(p => p.vercel?.isLive).length
    
    return [
      { label: "Projects Built", value: projects.length.toString(), icon: Code, color: "text-blue-600" },
      { label: "GitHub Stars", value: totalStars.toString(), icon: Star, color: "text-yellow-600" },
      { label: "Live Projects", value: liveProjects.toString(), icon: Zap, color: "text-green-600" },
      { label: "Years Experience", value: "5+", icon: Calendar, color: "text-purple-600" }
    ]
  }, [projects])

  // ✅ Fixed: Optimized floating particles with proper structure
  const FloatingParticles = React.memo(() => {
    if (prefersReducedMotion) return null

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
          const particle = {
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 2,
            duration: 3 + Math.random() * 4,
            moveX: Math.random() * 40 - 20
          }

          return (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-60"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, particle.moveX, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut"
              }}
            />
          )
        })}
      </div>
    )
  })
  FloatingParticles.displayName = 'FloatingParticles'

  // Enhanced 3D Card with better performance
  const ThreeDCard: React.FC<{ children: React.ReactNode; className?: string }> = React.memo(({ 
    children, 
    className = "" 
  }) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const [rotation, setRotation] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      const card = cardRef.current
      if (!card || prefersReducedMotion) return // Use directly

      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const rotateX = (e.clientY - centerY) / 15
      const rotateY = (centerX - e.clientX) / 15
      
      setRotation({ x: rotateX, y: rotateY })
    }, []) // ✅ Empty dependency array

    const handleMouseEnter = useCallback(() => setIsHovered(true), [])
    const handleMouseLeave = useCallback(() => {
      setIsHovered(false)
      setRotation({ x: 0, y: 0 })
    }, [])

    return (
      <motion.div
        ref={cardRef}
        className={`preserve-3d transition-transform duration-300 ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: prefersReducedMotion 
            ? 'none' 
            : `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="relative">
          {children}
          {/* Enhanced glow effect */}
          {!prefersReducedMotion && isHovered && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl -z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      </motion.div>
    )
  })
  ThreeDCard.displayName = 'ThreeDCard'

  // Enhanced social links with better accessibility
  const socialLinks = useMemo(() => [
    { 
      href: "https://github.com/sippinwindex", 
      icon: Github, 
      label: "GitHub Profile",
      color: "hover:text-gray-800 dark:hover:text-gray-200" 
    },
    { 
      href: "https://www.linkedin.com/in/juan-fernandez-fullstack/", 
      icon: Linkedin, 
      label: "LinkedIn Profile",
      color: "hover:text-blue-600" 
    },
    { 
      href: "mailto:stormblazdesign@gmail.com", 
      icon: Mail, 
      label: "Send Email",
      color: "hover:text-red-600" 
    }
  ], [])

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Enhanced Loading Animation */}
      {!isLoaded && (
        <motion.div
          className="fixed inset-0 z-50 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-center">
            <motion.div
              className="relative w-16 h-16 mx-auto mb-6"
              animate={{ rotate: prefersReducedMotion ? 0 : 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </motion.div>
            <motion.p
              className="text-gray-900 dark:text-gray-50 text-lg font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Crafting Experience...
            </motion.p>
            <motion.div
              className="mt-4 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Main Hero Section */}
      <motion.div
        ref={heroRef}
        className="relative min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800/90 dark:to-gray-900 overflow-hidden"
        style={{ y, opacity, scale }}
      >
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0">
          {/* Dynamic Gradient Background with mouse interaction */}
          {!prefersReducedMotion && (
            <motion.div
              className="absolute inset-0 transition-all duration-1000"
              style={{
                background: `radial-gradient(circle at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%, 
                  rgba(59, 130, 246, 0.08) 0%, 
                  rgba(147, 51, 234, 0.04) 30%, 
                  transparent 70%)`
              }}
            />
          )}
          
          <FloatingParticles />
          
          {/* Enhanced Grid Overlay */}
          {!prefersReducedMotion && (
            <motion.div 
              className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
                transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`
              }}
            />
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Column - Enhanced Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Status Badge */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.4 }}
              >
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 backdrop-blur-sm shadow-sm">
                  <motion.div 
                    className="w-2 h-2 bg-emerald-500 rounded-full mr-2"
                    animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Available for new opportunities
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-gray-50 leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Hi, I'm{' '}
                <motion.span 
                  className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text text-transparent"
                  animate={prefersReducedMotion ? {} : { 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Juan Fernandez
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-4 font-medium">
                  Full Stack Developer &{' '}
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    3D Experience Creator
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                  Crafting immersive digital experiences with cutting-edge web technologies. 
                  Specializing in React, Next.js, Three.js, and everything that makes the web come alive.
                </p>
              </motion.div>

              {/* Enhanced Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.9 }}
              >
                <motion.button
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    View My Work
                    <ExternalLink className="w-4 h-4" />
                  </span>
                  {!prefersReducedMotion && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
                
                <motion.button
                  className="group px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-50 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download CV
                  </span>
                </motion.button>
              </motion.div>

              {/* Enhanced Social Links */}
              <motion.div 
                className="flex gap-3"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.1 }}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md ${social.color}`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <social.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-all duration-200" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Enhanced 3D Interactive Card */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <ThreeDCard className="w-full max-w-md">
                <div className="relative p-6 sm:p-8 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
                  {/* Enhanced Profile Section */}
                  <motion.div
                    className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6"
                    animate={prefersReducedMotion ? {} : { 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-1">
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-inner">
                        <Code className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                      </div>
                    </div>
                    {/* Floating indicators */}
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                      animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                  </motion.div>

                  {/* Enhanced Stats */}
                  <div className="space-y-3 mb-6">
                    {calculatedStats.map((stat, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30 hover:bg-gray-100/80 dark:hover:bg-gray-600/50 transition-all duration-200"
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                      >
                        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                          {stat.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">
                            {stat.value}
                          </span>
                          <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Enhanced Tech Stack */}
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {TECH_STACK.slice(0, 5).map((tech, index) => (
                        <motion.div
                          key={index}
                          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm"
                          whileHover={{ scale: 1.05, y: -2 }}
                          animate={prefersReducedMotion ? {} : { 
                            y: [0, -1, 0],
                          }}
                          transition={{ 
                            duration: 3,
                            delay: index * 0.3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                        >
                          {tech}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </ThreeDCard>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 cursor-pointer group"
            animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm font-medium group-hover:text-blue-500 transition-colors">
              Scroll to explore
            </span>
            <div className="relative w-6 h-10 border-2 border-gray-300 dark:border-gray-600 group-hover:border-blue-400 rounded-full flex justify-center transition-colors">
              <motion.div
                className="w-1 h-3 bg-blue-500 rounded-full mt-2"
                animate={prefersReducedMotion ? {} : { y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Interactive3DHero