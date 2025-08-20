'use client'

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { motion, useScroll, useTransform, useInView, useSpring, Variants, useReducedMotion } from 'framer-motion'
import { Star, GitFork, ExternalLink, Github, Globe, Calendar, TrendingUp, Code, Zap, Award, Eye, Users } from 'lucide-react'

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
  featured?: boolean
  category?: string
  lastUpdated?: string
}

interface PortfolioStats {
  totalProjects: number
  totalStars: number
  liveProjects: number
  totalForks?: number
  topLanguages?: string[]
  recentActivity: {
    activeProjects: number
  }
}

interface ScrollTriggered3DSectionsProps {
  projects?: Project[]
  stats?: PortfolioStats | null
  onProjectClick?: (project: Project) => void
}

// Memoized default data to prevent recreation
const DEFAULT_PROJECTS: Project[] = Array.from({ length: 6 }, (_, i) => ({
  id: `project-${i + 1}`,
  name: `Modern Portfolio ${i + 1}`,
  description: 'A cutting-edge showcase project built with the latest web technologies, featuring responsive design, interactive animations, and optimized performance.',
  techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  github: {
    stars: Math.floor(Math.random() * 100) + 10,
    forks: Math.floor(Math.random() * 25) + 2,
    url: `https://github.com/example/project-${i + 1}`
  },
  vercel: {
    isLive: Math.random() > 0.3,
    liveUrl: `https://project-${i + 1}.vercel.app`
  },
  deploymentScore: Math.floor(Math.random() * 30) + 70,
  featured: i < 2,
  category: ['Web App', 'Mobile', 'SaaS', 'Tool'][Math.floor(Math.random() * 4)],
  lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}))

const DEFAULT_STATS: PortfolioStats = {
  totalProjects: 25,
  totalStars: 150,
  liveProjects: 12,
  totalForks: 45,
  topLanguages: ['TypeScript', 'React', 'Python', 'Node.js'],
  recentActivity: {
    activeProjects: 8
  }
}

// ProjectCard component with enhanced click handling
const ProjectCard: React.FC<{ 
  project: Project
  index: number
  isInView: boolean
  shouldReduceMotion: boolean
  onProjectClick?: (project: Project) => void
}> = React.memo(({ project, index, isInView, shouldReduceMotion, onProjectClick }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })

  const projectVariants: Variants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 20 : 100, 
      rotateX: shouldReduceMotion ? 0 : -15 
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: shouldReduceMotion ? i * 0.1 : i * 0.2,
        duration: shouldReduceMotion ? 0.4 : 0.8,
        ease: [0.22, 1, 0.36, 1] as const
      }
    })
  }), [shouldReduceMotion])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (shouldReduceMotion) return
    
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
  }, [shouldReduceMotion])

  const handleMouseLeave = useCallback(() => {
    setRotation({ x: 0, y: 0 })
    setGlowPosition({ x: 50, y: 50 })
  }, [])

  // Enhanced project click handler that prioritizes live deployments
  const handleProjectClick = useCallback(() => {
    console.log('ProjectCard: Project clicked:', project.name)
    
    if (onProjectClick) {
      console.log('ProjectCard: Calling onProjectClick callback')
      onProjectClick(project)
    } else {
      // Fallback direct navigation logic
      console.log('ProjectCard: No callback provided, using direct navigation')
      if (project.vercel?.isLive && project.vercel.liveUrl) {
        console.log('ProjectCard: Opening live URL:', project.vercel.liveUrl)
        window.open(project.vercel.liveUrl, '_blank', 'noopener,noreferrer')
      } else if (project.github?.url) {
        console.log('ProjectCard: Opening GitHub URL:', project.github.url)
        window.open(project.github.url, '_blank', 'noopener,noreferrer')
      }
    }
  }, [project, onProjectClick])

  const handleGitHubClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('ProjectCard: GitHub button clicked for:', project.name)
    if (project.github?.url) {
      window.open(project.github.url, '_blank', 'noopener,noreferrer')
    }
  }, [project.github?.url, project.name])

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={projectVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="group relative cursor-pointer"
      style={{
        transformStyle: 'preserve-3d',
        transform: shouldReduceMotion 
          ? 'none' 
          : `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleProjectClick}
    >
      <div className="relative p-8 rounded-2xl glass-card border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-500 group-hover:border-pink-300/50 dark:group-hover:border-pink-700/50 h-full flex flex-col">
        
        {/* Enhanced Dynamic Glow Effect */}
        {!shouldReduceMotion && (
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(190, 52, 85, 0.4) 0%, transparent 70%)`
            }}
          />
        )}
        
        {/* Project Header with Enhanced Stats */}
        <div className="relative z-10 flex-grow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                  {project.name}
                </h3>
                {project.featured && (
                  <motion.div
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <Award className="w-3 h-3" />
                    Featured
                  </motion.div>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>
            </div>
            
            {/* Enhanced Live Status Indicator */}
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

          {/* Enhanced Tech Stack with Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.slice(0, 4).map((tech, techIndex) => (
              <motion.span
                key={tech}
                className="px-3 py-1 text-xs font-medium rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors"
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ delay: (index * 0.2) + (techIndex * 0.1) + 0.5 }}
              >
                {tech}
              </motion.span>
            ))}
            {project.techStack.length > 4 && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>

          {/* Enhanced GitHub Stats with Better Layout */}
          {project.github && (
            <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                <Star className="w-4 h-4" />
                <span className="font-medium">{project.github.stars}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <GitFork className="w-4 h-4" />
                <span className="font-medium">{project.github.forks}</span>
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">{project.deploymentScore || 0}/100</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Action Buttons */}
        <div className="relative z-10 flex gap-3 mt-auto">
          <motion.button
            className="group/btn flex-1 relative px-4 py-3 bg-gradient-to-r from-pink-600 to-yellow-600 text-white font-medium rounded-lg overflow-hidden shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
            whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
            disabled={!project.vercel?.isLive && !project.github?.url}
            onClick={handleProjectClick}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" />
              {project.vercel?.isLive ? 'View Live' : project.github?.url ? 'View Code' : 'Coming Soon'}
            </span>
            {!shouldReduceMotion && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-pink-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
          
          <motion.button
            className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-pink-400 dark:hover:border-pink-600 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
            whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
            onClick={handleGitHubClick}
            disabled={!project.github?.url}
            aria-label="View source code"
          >
            <Github className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Enhanced Floating Decorative Elements */}
        {!shouldReduceMotion && (
          <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none">
            <motion.div
              className="w-20 h-20 border border-pink-400 dark:border-pink-600 rounded-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
})

ProjectCard.displayName = 'ProjectCard'

// StatCard component
const StatCard: React.FC<{ 
  label: string
  value: number
  icon: React.ElementType
  delay: number
  gradient: string 
  description?: string
  isInView: boolean
  shouldReduceMotion: boolean
}> = React.memo(({ label, value, icon: Icon, delay, gradient, description, isInView, shouldReduceMotion }) => (
  <motion.div
    className="relative group h-full"
    initial={{ opacity: 0, scale: 0.8, rotateY: shouldReduceMotion ? 0 : -15 }}
    animate={isInView ? { 
      opacity: 1, 
      scale: 1, 
      rotateY: 0 
    } : { 
      opacity: 0, 
      scale: 0.8, 
      rotateY: shouldReduceMotion ? 0 : -15 
    }}
    transition={{ 
      duration: shouldReduceMotion ? 0.4 : 0.8, 
      delay, 
      ease: [0.22, 1, 0.36, 1] as const 
    }}
    whileHover={{ 
      scale: shouldReduceMotion ? 1 : 1.05, 
      y: shouldReduceMotion ? 0 : -10 
    }}
  >
    <div className={`relative p-8 rounded-2xl glass-card border border-gray-200/50 dark:border-gray-700/50 overflow-hidden h-full ${gradient} transition-all duration-300`}>
      
      {/* Enhanced Animated Background */}
      {!shouldReduceMotion && (
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
      )}
      
      <div className="relative z-10 text-center h-full flex flex-col justify-center">
        <motion.div 
          className="flex justify-center mb-4"
          animate={shouldReduceMotion ? {} : { 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Icon className="w-12 h-12 text-pink-600 dark:text-pink-400" />
        </motion.div>
        <motion.div 
          className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2"
          key={value} // Re-trigger animation on value change
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {value.toLocaleString()}
        </motion.div>
        <div className="text-gray-600 dark:text-gray-400 font-medium mb-1">
          {label}
        </div>
        {description && (
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {description}
          </div>
        )}
      </div>

      {/* Enhanced Floating Particles */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-pink-400/30 rounded-full"
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
      )}
    </div>
  </motion.div>
))

StatCard.displayName = 'StatCard'

const ScrollTriggered3DSections: React.FC<ScrollTriggered3DSectionsProps> = ({ 
  projects = [], 
  stats = null,
  onProjectClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion() ?? false
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const springConfig = useMemo(() => ({ 
    stiffness: shouldReduceMotion ? 200 : 100, 
    damping: shouldReduceMotion ? 40 : 30 
  }), [shouldReduceMotion])

  const springScrollY = useSpring(scrollYProgress, springConfig)
  const backgroundY = useTransform(springScrollY, [0, 1], ["0%", shouldReduceMotion ? "20%" : "100%"])

  // Use provided projects or fallback to defaults
  const displayProjects = projects.length > 0 ? projects.slice(0, 6) : DEFAULT_PROJECTS
  const processedStats = stats || DEFAULT_STATS

  // ProjectsSection component
  const ProjectsSection = React.memo(() => {
    const sectionRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

    return (
      <section ref={sectionRef} className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-50 mb-6">
              Featured{' '}
              <span className="bg-gradient-to-r from-pink-600 via-yellow-500 to-pink-600 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Showcasing my latest work with live GitHub integration and deployment status
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
                isInView={isInView}
                shouldReduceMotion={shouldReduceMotion}
                onProjectClick={onProjectClick}
              />
            ))}
          </div>
        </div>
      </section>
    )
  })

  ProjectsSection.displayName = 'ProjectsSection'

  // Enhanced GitHub Stats Section with Better Performance
  const GitHubStatsSection = React.memo(() => {
    const sectionRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
    const [animatedStats, setAnimatedStats] = useState({
      totalProjects: 0,
      totalStars: 0,
      liveProjects: 0,
      totalCommits: 0
    })

    // Target stats object
    const targetStats = {
      totalProjects: processedStats.totalProjects || 25,
      totalStars: processedStats.totalStars || 150,
      liveProjects: processedStats.liveProjects || 12,
      totalCommits: 500 // Could be calculated from other data
    }

    // Enhanced number animation with proper dependencies
    useEffect(() => {
      if (!isInView) {
        return
      }

      if (shouldReduceMotion) {
        setAnimatedStats(targetStats)
        return
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
    }, [isInView, shouldReduceMotion])

    // Memoized tech data to prevent recreation
    const techData = useMemo(() => [
      { name: 'React', percentage: 35, color: 'text-blue-600' },
      { name: 'TypeScript', percentage: 28, color: 'text-blue-700' },
      { name: 'Next.js', percentage: 22, color: 'text-gray-800' },
      { name: 'Node.js', percentage: 15, color: 'text-green-600' }
    ], [])

    return (
      <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 via-pink-50/20 to-yellow-50/20 dark:from-gray-900 dark:via-pink-900/10 dark:to-yellow-900/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-50 mb-6">
              Live GitHub{' '}
              <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                Integration
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Real-time stats from my repositories and deployment platforms
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <StatCard
              label="Total Projects"
              value={animatedStats.totalProjects}
              icon={Code}
              delay={0.2}
              gradient="bg-gradient-to-br from-pink-50/50 to-blue-50/50 dark:from-pink-900/20 dark:to-blue-900/20"
              description="Active repositories"
              isInView={isInView}
              shouldReduceMotion={shouldReduceMotion}
            />
            <StatCard
              label="GitHub Stars"
              value={animatedStats.totalStars}
              icon={Star}
              delay={0.4}
              gradient="bg-gradient-to-br from-yellow-50/50 to-pink-50/50 dark:from-yellow-900/20 dark:to-pink-900/20"
              description="Community recognition"
              isInView={isInView}
              shouldReduceMotion={shouldReduceMotion}
            />
            <StatCard
              label="Live Projects"
              value={animatedStats.liveProjects}
              icon={Globe}
              delay={0.6}
              gradient="bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-900/20 dark:to-blue-900/20"
              description="Deployed applications"
              isInView={isInView}
              shouldReduceMotion={shouldReduceMotion}
            />
            <StatCard
              label="Total Commits"
              value={animatedStats.totalCommits}
              icon={TrendingUp}
              delay={0.8}
              gradient="bg-gradient-to-br from-pink-50/50 to-yellow-50/50 dark:from-pink-900/20 dark:to-yellow-900/20"
              description="Code contributions"
              isInView={isInView}
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>

          {/* Enhanced Language Stats */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
              Most Used Technologies
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {techData.map((tech, index) => (
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
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        className={tech.color}
                        initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
                        animate={isInView ? { 
                          strokeDashoffset: 2 * Math.PI * 36 * (1 - tech.percentage / 100) 
                        } : { 
                          strokeDashoffset: 2 * Math.PI * 36 
                        }}
                        transition={{ 
                          duration: shouldReduceMotion ? 0.5 : 1.5, 
                          delay: 1.5 + index * 0.2 
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-900 dark:text-gray-50 font-bold text-sm">
                        {tech.percentage}%
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {tech.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    )
  })

  GitHubStatsSection.displayName = 'GitHubStatsSection'

  return (
    <motion.div ref={containerRef} className="relative">
      {/* Enhanced Parallax Background */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white via-pink-50/10 to-yellow-50/10 dark:from-black dark:via-pink-900/5 dark:to-yellow-900/5" />
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

ScrollTriggered3DSections.displayName = 'ScrollTriggered3DSections'

export default React.memo(ScrollTriggered3DSections)