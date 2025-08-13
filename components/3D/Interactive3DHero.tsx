'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Github, Linkedin, Mail, ExternalLink, Star, GitFork, Calendar, Code } from 'lucide-react'

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

const Interactive3DHero: React.FC<Interactive3DHeroProps> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Smooth spring animations for parallax
  const springScrollY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const y = useTransform(springScrollY, [0, 1], ["0%", "50%"])
  const opacity = useTransform(springScrollY, [0, 0.5, 1], [1, 0.8, 0])
  const scale = useTransform(springScrollY, [0, 1], [1, 0.8])

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroRef.current?.getBoundingClientRect()
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height
        })
      }
    }

    const container = heroRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      return () => container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Loading sequence
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Floating particles component
  const FloatingParticles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-viva-magenta-400 to-lux-gold-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    )
  }

  // 3D Card Component
  const ThreeDCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
    children, 
    className = "" 
  }) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const [rotation, setRotation] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent) => {
      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const rotateX = (e.clientY - centerY) / 10
      const rotateY = (centerX - e.clientX) / 10
      
      setRotation({ x: rotateX, y: rotateY })
    }

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 })
    }

    return (
      <motion.div
        ref={cardRef}
        className={`preserve-3d ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    )
  }

  const stats = [
    { label: "Projects Built", value: projects.length.toString(), icon: Code },
    { label: "GitHub Stars", value: projects.reduce((acc, p) => acc + (p.github?.stars || 0), 0).toString(), icon: Star },
    { label: "Years Experience", value: "5+", icon: Calendar }
  ]

  const techStack = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Three.js']

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Loading Animation */}
      {!isLoaded && (
        <motion.div
          className="fixed inset-0 z-50 bg-lux-offwhite dark:bg-lux-black flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="w-16 h-16 border-4 border-viva-magenta-500 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              className="text-lux-gray-900 dark:text-lux-gray-50 text-lg font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Loading Experience...
            </motion.p>
          </div>
        </motion.div>
      )}

      {/* Main Hero Section */}
      <motion.div
        ref={heroRef}
        className="relative min-h-screen bg-gradient-to-br from-lux-offwhite via-viva-magenta-50/10 to-lux-gold-50/10 dark:from-lux-black dark:via-viva-magenta-900/5 dark:to-lux-gold-900/5 overflow-hidden"
        style={{ y, opacity, scale }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Dynamic Gradient Background */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, 
                rgba(var(--primary-rgb, 14, 165, 233), 0.1) 0%, 
                rgba(var(--accent-rgb, 217, 70, 239), 0.05) 30%, 
                transparent 70%)`
            }}
          />
          
          {/* Floating Particles */}
          <FloatingParticles />
          
          {/* Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(var(--primary-rgb, 14, 165, 233), 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(var(--primary-rgb, 14, 165, 233), 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-viva-magenta-50 to-lux-gold-50 dark:from-viva-magenta-900/20 dark:to-lux-gold-900/20 text-viva-magenta-700 dark:text-viva-magenta-300 border border-viva-magenta-200 dark:border-viva-magenta-700 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-viva-magenta-500 rounded-full mr-2 animate-pulse" />
                  Available for new opportunities
                </span>
              </motion.div>

              <motion.h1 
                className="text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-viva-magenta-600 via-lux-gold-500 to-viva-magenta-600 bg-clip-text text-transparent">
                  Juan Fernandez
                </span>
              </motion.h1>

              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <h2 className="text-2xl lg:text-3xl text-lux-gray-600 dark:text-lux-gray-300 mb-4">
                  Full Stack Developer &{' '}
                  <span className="text-viva-magenta-600 dark:text-viva-magenta-400">3D Experience Creator</span>
                </h2>
                <p className="text-lg text-lux-gray-600 dark:text-lux-gray-400 max-w-2xl leading-relaxed">
                  Crafting immersive digital experiences with cutting-edge web technologies. 
                  Specializing in React, Next.js, Three.js, and everything that makes the web come alive.
                </p>
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <motion.button
                  className="group relative px-8 py-4 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    View My Work
                    <ExternalLink className="w-4 h-4" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-lux-gold-600 to-viva-magenta-600"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
                
                <motion.button
                  className="group px-8 py-4 border-2 border-viva-magenta-300 dark:border-viva-magenta-700 text-lux-gray-900 dark:text-lux-gray-50 font-semibold rounded-xl hover:bg-viva-magenta-50 dark:hover:bg-viva-magenta-900/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    Get In Touch
                    <Mail className="w-4 h-4" />
                  </span>
                </motion.button>
              </motion.div>

              {/* Social Links */}
              <motion.div 
                className="flex gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                {[
                  { href: "https://github.com/sippinwindex", icon: Github, label: "GitHub" },
                  { href: "https://www.linkedin.com/in/juan-fernandez-fullstack/", icon: Linkedin, label: "LinkedIn" },
                  { href: "mailto:stormblazdesign@gmail.com", icon: Mail, label: "Email" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/80 dark:bg-lux-black/80 border border-lux-gray-200 dark:border-lux-gray-700 hover:bg-viva-magenta-50 dark:hover:bg-viva-magenta-900/20 hover:border-viva-magenta-300 dark:hover:border-viva-magenta-700 transition-all duration-300 backdrop-blur-sm"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-lux-gray-600 dark:text-lux-gray-400 hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400 transition-colors" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - 3D Interactive Card */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <ThreeDCard className="w-full max-w-md">
                <div className="relative p-8 rounded-2xl bg-card/80 backdrop-blur-xl border border-border shadow-2xl">
                  {/* Profile Section */}
                  <motion.div
                    className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 p-1"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                      <Code className="w-12 h-12 text-primary-600" />
                    </div>
                  </motion.div>

                  {/* Stats */}
                  <div className="space-y-4 mb-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-lux-gray-100/50 dark:bg-lux-gray-800/50 backdrop-blur-sm border border-lux-gray-200/30 dark:border-lux-gray-700/30"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5 + index * 0.1 }}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(var(--lux-gray-200), 0.8)" }}
                      >
                        <span className="text-lux-gray-700 dark:text-lux-gray-300 text-sm font-medium">{stat.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-viva-magenta-600 dark:text-viva-magenta-400 font-bold">{stat.value}</span>
                          <stat.icon className="w-4 h-4 text-lux-gold-600 dark:text-lux-gold-400" />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Tech Stack */}
                  <motion.div 
                    className="flex flex-wrap justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                  >
                    {techStack.map((tech, index) => (
                      <motion.div
                        key={index}
                        className="px-3 py-1 rounded-md bg-viva-magenta-50 dark:bg-viva-magenta-900/30 text-viva-magenta-700 dark:text-viva-magenta-300 text-xs font-medium border border-viva-magenta-200/50 dark:border-viva-magenta-800/50"
                        whileHover={{ scale: 1.1 }}
                        animate={{ 
                          y: [0, -2, 0],
                        }}
                        transition={{ 
                          duration: 2,
                          delay: index * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {tech}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </ThreeDCard>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-lux-gray-500 dark:text-lux-gray-400"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-sm font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-lux-gray-300 dark:border-lux-gray-600 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-viva-magenta-500 rounded-full mt-2"
                animate={{ y: [0, 10, 0] }}
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