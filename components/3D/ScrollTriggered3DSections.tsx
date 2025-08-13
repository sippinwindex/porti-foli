'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView, useSpring, Variants } from 'framer-motion'
import { Star, GitFork, ExternalLink, Github, Globe, Calendar, TrendingUp, Code } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  techStack: string[]
  github?: {
    stars: number
    forks: number
    url: string
  }
  vercel?: {
    isLive: boolean
    liveUrl?: string
  }
  deploymentScore?: number
}

interface PortfolioStats {
  totalProjects: number
  totalStars: number
  liveProjects: number
  recentActivity: {
    activeProjects: number
  }
}

interface ScrollTriggered3DSectionsProps {
  projects?: Project[]
  stats?: PortfolioStats
}

// Default project data for placeholders
const defaultProjects: Project[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `placeholder-${i}`,
  name: `Placeholder Project ${i + 1}`,
  description: 'This is a placeholder for a featured project, showcasing the layout and animations.',
  techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  github: {
    stars: 0,
    forks: 0,
    url: ''
  },
  deploymentScore: 0
}))

const ScrollTriggered3DSections: React.FC<ScrollTriggered3DSectionsProps> = ({ 
  projects = [], 
  stats = {} as PortfolioStats
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Smooth spring animations
  const springScrollY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const backgroundY = useTransform(springScrollY, [0, 1], ["0%", "100%"])

  // Projects Section Component
  const ProjectsSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
    
    const projectVariants: Variants = {
      hidden: { opacity: 0, y: 100, rotateX: -15 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
          delay: i * 0.2,
          duration: 0.8,
          // FIX: Added 'as const' to assert a specific tuple type for the cubic-bezier easing.
          ease: [0.22, 1, 0.36, 1] as const
        }
      })
    }

    const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
      const cardRef = useRef<HTMLDivElement>(null)
      const [rotation, setRotation] = useState({ x: 0, y: 0 })
      const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })

      const handleMouseMove = (e: React.MouseEvent) => {
        const card = cardRef.current
        if (!card) return

        const rect = card.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const rotateX = (e.clientY - centerY) / 20
        const rotateY = (centerX - e.clientX) / 20
        
        const glowX = ((e.clientX - rect.left) / rect.width) * 100
        const glowY = ((e.clientY - rect.top) / rect.height) * 100
        
        setRotation({ x: rotateX, y: rotateY })
        setGlowPosition({ x: glowX, y: glowY })
      }

      const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 })
        setGlowPosition({ x: 50, y: 50 })
      }

      return (
        <motion.div
          ref={cardRef}
          custom={index}
          variants={projectVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="group relative"
          style={{
            transformStyle: 'preserve-3d',
            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative p-8 rounded-2xl glass-card border border-lux-gray-200/50 dark:border-lux-gray-700/50 overflow-hidden transition-all duration-500 group-hover:border-viva-magenta-300/50 dark:group-hover:border-viva-magenta-700/50">
            
            {/* Dynamic Glow Effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(190, 52, 85, 0.3) 0%, transparent 70%)`
              }}
            />
            
            {/* Project Header */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-lux-gray-900 dark:text-lux-gray-50 mb-2 group-hover:text-viva-magenta-600 dark:group-hover:text-viva-magenta-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-lux-gray-600 dark:text-lux-gray-400 text-sm mb-4">
                    {project.description}
                  </p>
                </div>
                
                {/* Live Status Indicator */}
                {project.vercel?.isLive && (
                  <motion.div 
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-700 dark:text-green-400 text-xs font-medium">Live</span>
                  </motion.div>
                )}
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.slice(0, 4).map((tech, techIndex) => (
                  <motion.span
                    key={tech}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-viva-magenta-50 dark:bg-viva-magenta-900/30 text-viva-magenta-700 dark:text-viva-magenta-300 border border-viva-magenta-200 dark:border-viva-magenta-800"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(190, 52, 85, 0.2)" }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ delay: (index * 0.2) + (techIndex * 0.1) + 0.5 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>

              {/* GitHub Stats */}
              {project.github && (
                <div className="flex items-center gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-1 text-lux-gold-600 dark:text-lux-gold-400">
                    <Star className="w-4 h-4" />
                    <span>{project.github.stars}</span>
                  </div>
                  <div className="flex items-center gap-1 text-lux-teal-600 dark:text-lux-teal-400">
                    <GitFork className="w-4 h-4" />
                    <span>{project.github.forks}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>{project.deploymentScore || 0}/100</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  className="group/btn flex-1 relative px-4 py-2 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white font-medium rounded-lg overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View Project
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-lux-gold-600 to-viva-magenta-600"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
                
                <motion.button
                  className="px-4 py-2 border-2 border-lux-gray-300 dark:border-lux-gray-600 text-lux-gray-700 dark:text-lux-gray-300 rounded-lg hover:border-viva-magenta-400 dark:hover:border-viva-magenta-600 hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <motion.div
                className="w-20 h-20 border border-viva-magenta-400 dark:border-viva-magenta-600 rounded-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )
    }

    // FIX: Use real projects if available, otherwise fall back to the structured defaultProjects array.
    const projectsToDisplay = projects.length > 0 ? projects.slice(0, 6) : defaultProjects;

    return (
      <section ref={sectionRef} className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-lux-gray-900 dark:text-lux-gray-50 mb-6">
              Featured{' '}
              <span className="bg-gradient-to-r from-viva-magenta-600 via-lux-gold-500 to-viva-magenta-600 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="text-xl text-lux-gray-600 dark:text-lux-gray-400 max-w-2xl mx-auto">
              Showcasing my latest work with live GitHub integration and deployment status
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* FIX: Map over the guaranteed array of Project objects. */}
            {projectsToDisplay.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // GitHub Stats Section Component
  const GitHubStatsSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
    const [animatedStats, setAnimatedStats] = useState({
      totalProjects: 0,
      totalStars: 0,
      liveProjects: 0,
      totalCommits: 0
    })

    // Animate numbers counting up
    useEffect(() => {
      if (!isInView) return
      
      const targetStats = {
        totalProjects: stats.totalProjects || 25,
        totalStars: stats.totalStars || 150,
        liveProjects: stats.liveProjects || 12,
        totalCommits: 500
      }

      const duration = 2000
      const steps = 60
      const interval = duration / steps

      let step = 0
      const timer = setInterval(() => {
        step++
        const progress = step / steps
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)

        setAnimatedStats({
          totalProjects: Math.floor(targetStats.totalProjects * easeOutQuart),
          totalStars: Math.floor(targetStats.totalStars * easeOutQuart),
          liveProjects: Math.floor(targetStats.liveProjects * easeOutQuart),
          totalCommits: Math.floor(targetStats.totalCommits * easeOutQuart)
        })

        if (step >= steps) {
          clearInterval(timer)
          setAnimatedStats(targetStats)
        }
      }, interval)

      return () => clearInterval(timer)
    }, [isInView, stats])

    const StatCard: React.FC<{ 
      label: string
      value: number
      icon: React.ElementType
      delay: number
      gradient: string 
    }> = ({ label, value, icon: Icon, delay, gradient }) => (
      <motion.div
        className="relative group"
        initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
        animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0, scale: 0.8, rotateY: -15 }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const }}
        whileHover={{ scale: 1.05, y: -10 }}
      >
        <div className={`relative p-8 rounded-2xl glass-card border border-lux-gray-200/50 dark:border-lux-gray-700/50 overflow-hidden ${gradient}`}>
          {/* Animated Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(255,255,255,0.05) 0%, transparent 100%)",
                "linear-gradient(225deg, rgba(255,255,255,0.05) 0%, transparent 100%)",
                "linear-gradient(45deg, rgba(255,255,255,0.05) 0%, transparent 100%)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          <div className="relative z-10 text-center">
            <motion.div 
              className="flex justify-center mb-4"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Icon className="w-12 h-12 text-viva-magenta-600 dark:text-viva-magenta-400" />
            </motion.div>
            <motion.div 
              className="text-4xl font-bold text-lux-gray-900 dark:text-lux-gray-50 mb-2"
              key={value} // Re-trigger animation on value change
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {value.toLocaleString()}
            </motion.div>
            <div className="text-lux-gray-600 dark:text-lux-gray-400 font-medium">{label}</div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
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
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    )

    return (
      <section ref={sectionRef} className="py-20 bg-gradient-to-br from-lux-gray-50 via-viva-magenta-50/20 to-lux-gold-50/20 dark:from-lux-gray-900 dark:via-viva-magenta-900/10 dark:to-lux-gold-900/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-lux-gray-900 dark:text-lux-gray-50 mb-6">
              Live GitHub{' '}
              <span className="bg-gradient-to-r from-lux-teal-600 to-viva-magenta-600 bg-clip-text text-transparent">
                Integration
              </span>
            </h2>
            <p className="text-xl text-lux-gray-600 dark:text-lux-gray-400 max-w-2xl mx-auto">
              Real-time stats from my repositories and deployment platforms
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <StatCard
              label="Total Projects"
              value={animatedStats.totalProjects}
              icon={Code}
              delay={0.2}
              gradient="bg-gradient-to-br from-viva-magenta-50/50 to-lux-teal-50/50 dark:from-viva-magenta-900/20 dark:to-lux-teal-900/20"
            />
            <StatCard
              label="GitHub Stars"
              value={animatedStats.totalStars}
              icon={Star}
              delay={0.4}
              gradient="bg-gradient-to-br from-lux-gold-50/50 to-viva-magenta-50/50 dark:from-lux-gold-900/20 dark:to-viva-magenta-900/20"
            />
            <StatCard
              label="Live Projects"
              value={animatedStats.liveProjects}
              icon={Globe}
              delay={0.6}
              gradient="bg-gradient-to-br from-green-50/50 to-lux-teal-50/50 dark:from-green-900/20 dark:to-lux-teal-900/20"
            />
            <StatCard
              label="Total Commits"
              value={animatedStats.totalCommits}
              icon={TrendingUp}
              delay={0.8}
              gradient="bg-gradient-to-br from-viva-magenta-50/50 to-lux-gold-50/50 dark:from-viva-magenta-900/20 dark:to-lux-gold-900/20"
            />
          </div>

          {/* Language Stats */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <h3 className="text-2xl font-bold text-lux-gray-900 dark:text-lux-gray-50 text-center mb-8">Most Used Technologies</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'React', percentage: 35, color: 'viva-magenta' },
                { name: 'TypeScript', percentage: 28, color: 'lux-teal' },
                { name: 'Next.js', percentage: 22, color: 'lux-gray' },
                { name: 'Node.js', percentage: 15, color: 'lux-gold' }
              ].map((tech, index) => (
                <motion.div
                  key={tech.name}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-lux-gray-200 dark:text-lux-gray-700"
                      />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke={`rgb(var(--${tech.color}-600))`}
                        strokeWidth="8"
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
                        animate={isInView ? { strokeDashoffset: 2 * Math.PI * 36 * (1 - tech.percentage / 100) } : { strokeDashoffset: 2 * Math.PI * 36 }}
                        transition={{ duration: 1.5, delay: 1.5 + index * 0.2 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lux-gray-900 dark:text-lux-gray-50 font-bold text-sm">{tech.percentage}%</span>
                    </div>
                  </div>
                  <p className="text-lux-gray-700 dark:text-lux-gray-300 font-medium">{tech.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <motion.div ref={containerRef} className="relative">
      {/* Parallax Background */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-lux-offwhite via-viva-magenta-50/10 to-lux-gold-50/10 dark:from-lux-black dark:via-viva-magenta-900/5 dark:to-lux-gold-900/5" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(190, 52, 85, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)`
        }} />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        <ProjectsSection />
        <GitHubStatsSection />
      </div>
    </motion.div>
  )
}

export default ScrollTriggered3DSections