// Fixed components/3D/LanguageVisualization.tsx
'use client'

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { motion, useScroll, useTransform, useInView, useSpring, useReducedMotion } from 'framer-motion'
import { TrendingUp, Star, Code, GitBranch, Activity, Zap, Award, Clock, Target } from 'lucide-react'

interface LanguageData {
  name: string
  percentage: number
  color: string
  icon: string
  projects: number
  experience: number // years
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  commits?: number
  linesOfCode?: number
  lastUsed?: string
}

interface LanguageVisualizationProps {
  languages?: LanguageData[]
  showStats?: boolean
  interactive?: boolean
  layout?: 'grid' | 'circle' | 'spiral'
  maxLanguages?: number
  animationDuration?: number
}

// Enhanced default data with more realistic information
const DEFAULT_LANGUAGES: LanguageData[] = [
  {
    name: 'TypeScript',
    percentage: 35,
    color: '#3178C6',
    icon: '⚡',
    projects: 12,
    experience: 3,
    proficiency: 'Expert',
    commits: 1250,
    linesOfCode: 45000,
    lastUsed: '2024-01-15'
  },
  {
    name: 'React',
    percentage: 28,
    color: '#61DAFB',
    icon: '⚛️',
    projects: 15,
    experience: 4,
    proficiency: 'Expert',
    commits: 1100,
    linesOfCode: 38000,
    lastUsed: '2024-01-14'
  },
  {
    name: 'Next.js',
    percentage: 22,
    color: '#000000',
    icon: '▲',
    projects: 8,
    experience: 2,
    proficiency: 'Advanced',
    commits: 890,
    linesOfCode: 28000,
    lastUsed: '2024-01-13'
  },
  {
    name: 'Node.js',
    percentage: 18,
    color: '#339933',
    icon: '🟢',
    projects: 10,
    experience: 3,
    proficiency: 'Advanced',
    commits: 750,
    linesOfCode: 22000,
    lastUsed: '2024-01-12'
  },
  {
    name: 'Python',
    percentage: 15,
    color: '#3776AB',
    icon: '🐍',
    projects: 6,
    experience: 2,
    proficiency: 'Intermediate',
    commits: 420,
    linesOfCode: 15000,
    lastUsed: '2024-01-10'
  },
  {
    name: 'Three.js',
    percentage: 12,
    color: '#049EF4',
    icon: '🎮',
    projects: 4,
    experience: 1,
    proficiency: 'Intermediate',
    commits: 320,
    linesOfCode: 8000,
    lastUsed: '2024-01-08'
  }
]

const LanguageVisualization: React.FC<LanguageVisualizationProps> = ({
  languages = DEFAULT_LANGUAGES,
  showStats = true,
  interactive = true,
  layout = 'circle',
  maxLanguages = 8,
  animationDuration = 1.5
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null)
  
  const prefersReducedMotion = useReducedMotion()
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Enhanced spring configuration with reduced motion support
  const springConfig = useMemo(() => ({
    stiffness: prefersReducedMotion ? 200 : 100,
    damping: prefersReducedMotion ? 40 : 30,
    mass: 0.8
  }), [prefersReducedMotion])

  const springScrollY = useSpring(scrollYProgress, springConfig)
  const rotateY = useTransform(springScrollY, [0, 1], [0, prefersReducedMotion ? 90 : 360])
  const scale = useTransform(springScrollY, [0, 0.5, 1], [0.9, 1, 0.9])

  // Memoized languages list to prevent recreation
  const displayLanguages = useMemo(() => 
    languages.slice(0, maxLanguages)
  , [languages, maxLanguages])

  // Optimized percentage animation with reduced motion support
  useEffect(() => {
    if (!isInView) return

    if (prefersReducedMotion) {
      // Instantly set values for reduced motion
      const values = displayLanguages.reduce((acc, lang) => ({
        ...acc,
        [lang.name]: lang.percentage
      }), {})
      setAnimatedValues(values)
      return
    }

    const timer = setTimeout(() => {
      displayLanguages.forEach((lang, index) => {
        setTimeout(() => {
          setAnimatedValues(prev => ({
            ...prev,
            [lang.name]: lang.percentage
          }))
        }, index * 150)
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [isInView, displayLanguages, prefersReducedMotion])

  // ✅ FIXED: Remove unnecessary dependencies - use props directly
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return // Use interactive and prefersReducedMotion directly
    
    if (!interactive || prefersReducedMotion) return
    
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    
    // Throttle updates for better performance
    requestAnimationFrame(() => {
      setMousePosition({
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y))
      })
    })
  }, [interactive, prefersReducedMotion]) // ✅ FIXED: Include required dependencies

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // Memoized position calculations
  const getLanguagePosition = useCallback((index: number, total: number) => {
    switch (layout) {
      case 'grid':
        const cols = Math.ceil(Math.sqrt(total))
        const row = Math.floor(index / cols)
        const col = index % cols
        return {
          x: (col - (cols - 1) / 2) * 160,
          y: (row - Math.floor((total - 1) / cols) / 2) * 160
        }
      
      case 'spiral':
        const angle = index * (Math.PI * 2 / 5) // Golden ratio spiral
        const radius = 60 + index * 25
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius
        }
      
      case 'circle':
      default:
        const circleAngle = (index / total) * Math.PI * 2
        const circleRadius = Math.min(200, 120 + total * 8) // Adaptive radius
        return {
          x: Math.cos(circleAngle) * circleRadius,
          y: Math.sin(circleAngle) * circleRadius
        }
    }
  }, [layout])

  // ✅ FIXED: Enhanced Language Card Component with proper dependencies
  const LanguageCard = React.memo<{ 
    language: LanguageData
    index: number
    position: { x: number; y: number }
  }>(({ language, index, position }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 })
    const cardRef = useRef<HTMLDivElement>(null)
    const animatedPercentage = animatedValues[language.name] || 0
    
    const circumference = 2 * Math.PI * 42 // radius of 42
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      const card = cardRef.current
      if (!card) return
      
      // Use props directly instead of dependencies
      if (!interactive || prefersReducedMotion) return

      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const rotateX = (e.clientY - centerY) / 20
      const rotateY = (centerX - e.clientX) / 20
      
      setRotation({ x: rotateX, y: rotateY })
    }, []) // ✅ FIXED: Empty dependency array - props are stable

    const handleMouseLeave = useCallback(() => {
      setRotation({ x: 0, y: 0 })
      setSelectedLanguage(null)
      setHoveredLanguage(null)
    }, [])

    const handleMouseEnter = useCallback(() => {
      if (interactive) { // Use directly
        setHoveredLanguage(language.name)
      }
    }, [language.name]) // ✅ Only keep language.name

    const handleClick = useCallback(() => {
      if (interactive) { // Use directly
        setSelectedLanguage(prev => prev === language.name ? null : language.name)
      }
    }, [language.name]) // ✅ Use functional update to avoid selectedLanguage dependency

    const isSelected = selectedLanguage === language.name
    const isHovered = hoveredLanguage === language.name
    const isAnySelected = selectedLanguage !== null

    // Proficiency color mapping
    const proficiencyColors = {
      Expert: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-300',
      Advanced: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300',
      Intermediate: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-300',
      Beginner: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-300'
    }

    return (
      <motion.div
        ref={cardRef}
        className="absolute cursor-pointer select-none"
        style={{
          left: '50%',
          top: '50%',
          transform: prefersReducedMotion 
            ? `translateX(${position.x}px) translateY(${position.y}px)`
            : `
                perspective(1200px) 
                translateX(${position.x + mousePosition.x * 15}px) 
                translateY(${position.y + mousePosition.y * 10}px) 
                rotateX(${rotation.x}deg) 
                rotateY(${rotation.y}deg)
              `,
          transformStyle: 'preserve-3d'
        }}
        initial={{ opacity: 0, scale: 0, rotateY: -180 }}
        animate={isInView ? { 
          opacity: isAnySelected && !isSelected ? 0.5 : 1, 
          scale: isSelected ? 1.15 : isHovered ? 1.05 : 1,
          rotateY: 0,
          z: isSelected ? 40 : isHovered ? 20 : 0
        } : { opacity: 0, scale: 0, rotateY: -180 }}
        transition={{ 
          delay: index * 0.08,
          duration: animationDuration * 0.8,
          type: "spring",
          stiffness: 200,
          damping: 25
        }}
        whileHover={interactive && !prefersReducedMotion ? { scale: 1.08, z: 25 } : {}}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
      >
        <div className={`
          relative w-36 h-36 rounded-2xl backdrop-blur-xl
          border-2 transition-all duration-300 shadow-lg
          ${isSelected 
            ? 'border-blue-400 dark:border-blue-600 shadow-2xl shadow-blue-500/25 bg-white/95 dark:bg-gray-800/95' 
            : isHovered
            ? 'border-gray-300/60 dark:border-gray-600/60 shadow-xl bg-white/90 dark:bg-gray-800/90'
            : 'border-gray-200/40 dark:border-gray-700/40 bg-white/80 dark:bg-gray-800/80'
          }
        `}>
          
          {/* Enhanced Background Glow */}
          {(isSelected || isHovered) && !prefersReducedMotion && (
            <motion.div
              className="absolute -inset-2 rounded-2xl"
              style={{
                background: `radial-gradient(circle, ${language.color}25 0%, transparent 70%)`
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.1, opacity: isSelected ? 1 : 0.7 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Circular Progress */}
          <div className="absolute inset-3">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-gray-200 dark:text-gray-700"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="42"
                fill="none"
                stroke={language.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ 
                  duration: prefersReducedMotion ? 0.3 : animationDuration, 
                  delay: index * 0.15, 
                  ease: "easeOut" 
                }}
              />
              
              {/* Additional progress ring for visual appeal */}
              {isSelected && !prefersReducedMotion && (
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="48"
                  fill="none"
                  stroke={language.color}
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  strokeDasharray="4,4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              )}
            </svg>
            
            {/* Enhanced Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className="text-2xl mb-1 filter drop-shadow-sm"
                animate={prefersReducedMotion ? {} : { 
                  rotate: isSelected ? 360 : 0,
                  scale: isSelected ? 1.1 : isHovered ? 1.05 : 1 
                }}
                transition={{ duration: 0.6 }}
              >
                {language.icon}
              </motion.div>
              <motion.div 
                className="text-xl font-bold text-gray-900 dark:text-gray-50"
                key={animatedPercentage} // Key change triggers animation
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {Math.round(animatedPercentage)}%
              </motion.div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center leading-tight">
                {language.name}
              </div>
            </div>
          </div>

          {/* Enhanced Floating Particles */}
          {(isSelected || isHovered) && !prefersReducedMotion && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ backgroundColor: language.color }}
                  initial={{
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                  }}
                  animate={{
                    x: [0, Math.random() * 60 - 30, 0],
                    y: [0, Math.random() * 60 - 30, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.5, 1.2, 0.5],
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    delay: Math.random(),
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          )}

          {/* Enhanced Proficiency Indicator */}
          <motion.div
            className="absolute -top-2 -right-2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: isInView ? 1 : 0, rotate: 0 }}
            transition={{ delay: index * 0.1 + 0.6, type: "spring" }}
          >
            <div className={`
              px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm shadow-sm
              ${proficiencyColors[language.proficiency]}
            `}>
              {language.proficiency === 'Expert' && <Award className="w-3 h-3 inline mr-1" />}
              {language.proficiency}
            </div>
          </motion.div>

          {/* Activity Indicator */}
          {isSelected && (
            <motion.div
              className="absolute top-2 left-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm">
                <motion.div
                  className="w-full h-full rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          )}

          {/* Enhanced Scanning Line */}
          {isSelected && !prefersReducedMotion && (
            <motion.div
              className="absolute left-0 right-0 h-0.5 rounded-full"
              style={{ backgroundColor: language.color }}
              initial={{ top: '20%', opacity: 0 }}
              animate={{
                top: ['20%', '80%'],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>
      </motion.div>
    )
  })
  LanguageCard.displayName = 'LanguageCard'

  // Enhanced Stats Panel Component
  const StatsPanel = React.memo(() => {
    if (!selectedLanguage || !showStats) return null
    
    const language = displayLanguages.find(lang => lang.name === selectedLanguage)
    if (!language) return null

    const statsData = [
      { label: 'Usage', value: `${language.percentage}%`, icon: TrendingUp, color: 'text-blue-500' },
      { label: 'Projects', value: language.projects.toString(), icon: Code, color: 'text-blue-500' },
      { label: 'Experience', value: `${language.experience}y`, icon: Clock, color: 'text-amber-500' },
      { label: 'Commits', value: language.commits?.toLocaleString() || '0', icon: GitBranch, color: 'text-emerald-500' }
    ]

    return (
      <motion.div
        className="absolute top-6 left-6 right-6 z-30"
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
              style={{ backgroundColor: `${language.color}20`, border: `2px solid ${language.color}40` }}
              animate={prefersReducedMotion ? {} : { rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {language.icon}
            </motion.div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                {language.name}
                {language.proficiency === 'Expert' && <Award className="w-5 h-5 text-amber-500" />}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language.proficiency} Level • {language.lastUsed && `Last used ${new Date(language.lastUsed).toLocaleDateString()}`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{stat.label}</span>
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-50">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional metrics if available */}
          {language.linesOfCode && (
            <motion.div
              className="mt-4 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-700/50 dark:to-blue-900/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Lines of Code</span>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-50">
                  {language.linesOfCode.toLocaleString()}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  })
  StatsPanel.displayName = 'StatsPanel'

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800/90 dark:to-gray-900"
      style={{ perspective: '2000px' }}
    >
      {/* Enhanced Background Elements */}
      <motion.div
        className="absolute inset-0"
        style={{ rotateY, scale }}
      >
        {/* Dynamic Animated Grid */}
        {!prefersReducedMotion && (
          <motion.div 
            className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, ${displayLanguages[0]?.color || '#3178C6'}60 2px, transparent 2px),
                radial-gradient(circle at 75% 75%, ${displayLanguages[1]?.color || '#61DAFB'}60 2px, transparent 2px)
              `,
              backgroundSize: '80px 80px',
              transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 15}px) rotate(${mousePosition.x * 1}deg)`
            }}
          />
        )}

        {/* Enhanced Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full">
          {displayLanguages.map((_, index) => {
            const nextIndex = (index + 1) % displayLanguages.length
            const pos1 = getLanguagePosition(index, displayLanguages.length)
            const pos2 = getLanguagePosition(nextIndex, displayLanguages.length)
            
            return (
              <motion.line
                key={`line-${index}`}
                x1={`calc(50% + ${pos1.x}px)`}
                y1={`calc(50% + ${pos1.y}px)`}
                x2={`calc(50% + ${pos2.x}px)`}
                y2={`calc(50% + ${pos2.y}px)`}
                stroke="url(#gradient)"
                strokeWidth="1.5"
                strokeOpacity="0.2"
                strokeDasharray="8,4"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 2, delay: index * 0.15 }}
              />
            )
          })}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3178C6" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#61DAFB" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#339933" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Language Cards */}
      <div className="relative z-10 w-full h-full">
        {displayLanguages.map((language, index) => (
          <LanguageCard
            key={language.name}
            language={language}
            index={index}
            position={getLanguagePosition(index, displayLanguages.length)}
          />
        ))}
      </div>

      {/* Enhanced Center Hub */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        initial={{ scale: 0, rotate: -180 }}
        animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
        transition={{ delay: 0.8, duration: 1.2, type: "spring", stiffness: 200 }}
      >
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-blue-500 to-emerald-500 flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20"
            animate={prefersReducedMotion ? {} : {
              boxShadow: [
                "0 0 30px rgba(59, 130, 246, 0.3)",
                "0 0 50px rgba(16, 185, 129, 0.3)",
                "0 0 30px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Activity className="w-8 h-8 text-white" />
          </motion.div>
          
          {/* Enhanced Orbiting Elements */}
          {!prefersReducedMotion && [...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: `${25 + i * 8}px 0`,
                backgroundColor: displayLanguages[i]?.color || '#3178C6'
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.3, 1]
              }}
              transition={{
                rotate: { duration: 6 + i * 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, delay: i * 0.3 }
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Stats Panel */}
      <StatsPanel />

      {/* Enhanced Legend */}
      {!selectedLanguage && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 2 }}
        >
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl px-6 py-3 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center flex items-center gap-2">
              <Target className="w-4 h-4" />
              {interactive ? 'Click on a language to view detailed analytics' : 'Programming Language Proficiency Distribution'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Layout Indicator */}
      <motion.div
        className="absolute top-8 right-8 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200/30 dark:border-gray-600/30">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
            {layout} Layout
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default LanguageVisualization