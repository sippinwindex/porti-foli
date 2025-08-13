'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion'
import { TrendingUp, Star, Code, GitBranch, Activity, Zap } from 'lucide-react'

interface LanguageData {
  name: string
  percentage: number
  color: string
  icon: string
  projects: number
  experience: number // years
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  commits?: number
}

interface LanguageVisualizationProps {
  languages?: LanguageData[]
  showStats?: boolean
  interactive?: boolean
  layout?: 'grid' | 'circle' | 'spiral'
}

const defaultLanguages: LanguageData[] = [
  {
    name: 'TypeScript',
    percentage: 35,
    color: '#3178C6',
    icon: '⚡',
    projects: 12,
    experience: 3,
    proficiency: 'Expert',
    commits: 1250
  },
  {
    name: 'React',
    percentage: 28,
    color: '#61DAFB',
    icon: '⚛️',
    projects: 15,
    experience: 4,
    proficiency: 'Expert',
    commits: 1100
  },
  {
    name: 'Next.js',
    percentage: 22,
    color: '#000000',
    icon: '▲',
    projects: 8,
    experience: 2,
    proficiency: 'Advanced',
    commits: 890
  },
  {
    name: 'Node.js',
    percentage: 18,
    color: '#339933',
    icon: '🟢',
    projects: 10,
    experience: 3,
    proficiency: 'Advanced',
    commits: 750
  },
  {
    name: 'Python',
    percentage: 15,
    color: '#3776AB',
    icon: '🐍',
    projects: 6,
    experience: 2,
    proficiency: 'Intermediate',
    commits: 420
  },
  {
    name: 'Three.js',
    percentage: 12,
    color: '#049EF4',
    icon: '🎮',
    projects: 4,
    experience: 1,
    proficiency: 'Intermediate',
    commits: 320
  }
]

const LanguageVisualization: React.FC<LanguageVisualizationProps> = ({
  languages = defaultLanguages,
  showStats = true,
  interactive = true,
  layout = 'circle'
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const springScrollY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const rotateY = useTransform(springScrollY, [0, 1], [0, 360])
  const scale = useTransform(springScrollY, [0, 0.5, 1], [0.8, 1, 0.8])

  // Animate percentage values
  useEffect(() => {
    if (!isInView) return

    const timer = setTimeout(() => {
      languages.forEach((lang, index) => {
        setTimeout(() => {
          setAnimatedValues(prev => ({
            ...prev,
            [lang.name]: lang.percentage
          }))
        }, index * 200)
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [isInView, languages])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height
        })
      }
    }

    const container = containerRef.current
    if (container && interactive) {
      container.addEventListener('mousemove', handleMouseMove)
      return () => container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [interactive])

  // Calculate positions based on layout
  const getLanguagePosition = (index: number, total: number) => {
    switch (layout) {
      case 'grid':
        const cols = Math.ceil(Math.sqrt(total))
        const row = Math.floor(index / cols)
        const col = index % cols
        return {
          x: (col - (cols - 1) / 2) * 200,
          y: (row - Math.floor((total - 1) / cols) / 2) * 200
        }
      
      case 'spiral':
        const angle = index * (Math.PI * 2 / 5) // Golden ratio spiral
        const radius = 50 + index * 30
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius
        }
      
      case 'circle':
      default:
        const circleAngle = (index / total) * Math.PI * 2
        const circleRadius = 180
        return {
          x: Math.cos(circleAngle) * circleRadius,
          y: Math.sin(circleAngle) * circleRadius
        }
    }
  }

  // Language Card Component
  const LanguageCard: React.FC<{ 
    language: LanguageData
    index: number
    position: { x: number; y: number }
  }> = ({ language, index, position }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 })
    const cardRef = useRef<HTMLDivElement>(null)
    const animatedPercentage = animatedValues[language.name] || 0
    
    const circumference = 2 * Math.PI * 45 // radius of 45
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!interactive) return
      
      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const rotateX = (e.clientY - centerY) / 15
      const rotateY = (centerX - e.clientX) / 15
      
      setRotation({ x: rotateX, y: rotateY })
    }

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 })
      setSelectedLanguage(null)
    }

    const handleMouseEnter = () => {
      if (interactive) {
        setSelectedLanguage(language.name)
      }
    }

    const isSelected = selectedLanguage === language.name
    const isAnySelected = selectedLanguage !== null

    return (
      <motion.div
        ref={cardRef}
        className="absolute cursor-pointer"
        style={{
          left: '50%',
          top: '50%',
          transform: `
            perspective(1000px) 
            translateX(${position.x + mousePosition.x * 20}px) 
            translateY(${position.y + mousePosition.y * 15}px) 
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y}deg)
          `,
          transformStyle: 'preserve-3d'
        }}
        initial={{ opacity: 0, scale: 0, rotateY: -180 }}
        animate={isInView ? { 
          opacity: isAnySelected && !isSelected ? 0.4 : 1, 
          scale: isSelected ? 1.2 : 1,
          rotateY: 0,
          z: isSelected ? 50 : 0
        } : { opacity: 0, scale: 0, rotateY: -180 }}
        transition={{ 
          delay: index * 0.1,
          duration: 0.8,
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        whileHover={interactive ? { scale: 1.1, z: 30 } : {}}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={() => interactive && setSelectedLanguage(isSelected ? null : language.name)}
      >
        <div className={`
          relative w-40 h-40 rounded-2xl
          glass-3d border-2 transition-all duration-300
          ${isSelected 
            ? 'border-viva-magenta-400 dark:border-viva-magenta-600 shadow-2xl shadow-viva-magenta-500/20' 
            : 'border-lux-gray-200/30 dark:border-lux-gray-700/30 shadow-lg'
          }
        `}>
          
          {/* Background Glow */}
          {isSelected && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `radial-gradient(circle, ${language.color}20 0%, transparent 70%)`
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Circular Progress */}
          <div className="absolute inset-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-lux-gray-200 dark:text-lux-gray-700"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="45"
                fill="none"
                stroke={language.color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
              />
            </svg>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className="text-3xl mb-1"
                animate={{ 
                  rotate: isSelected ? 360 : 0,
                  scale: isSelected ? 1.2 : 1 
                }}
                transition={{ duration: 0.5 }}
              >
                {language.icon}
              </motion.div>
              <div className="text-2xl font-bold text-lux-gray-900 dark:text-lux-gray-50">
                {Math.round(animatedPercentage)}%
              </div>
              <div className="text-xs font-medium text-lux-gray-600 dark:text-lux-gray-400 text-center">
                {language.name}
              </div>
            </div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ backgroundColor: language.color }}
                animate={{
                  x: [0, Math.random() * 100 - 50, 0],
                  y: [0, Math.random() * 100 - 50, 0],
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

          {/* Proficiency Indicator */}
          <div className="absolute top-2 right-2">
            <motion.div
              className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${language.proficiency === 'Expert' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                  : language.proficiency === 'Advanced'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                  : language.proficiency === 'Intermediate'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                  : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                }
              `}
              initial={{ scale: 0 }}
              animate={{ scale: isInView ? 1 : 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              {language.proficiency}
            </motion.div>
          </div>

          {/* Scanning Line for Selected */}
          {isSelected && (
            <motion.div
              className="absolute left-0 right-0 h-0.5 rounded-full"
              style={{ backgroundColor: language.color }}
              initial={{ top: 0, opacity: 0 }}
              animate={{
                top: ['0%', '100%'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
        </div>
      </motion.div>
    )
  }

  // Stats Panel Component
  const StatsPanel = () => {
    if (!selectedLanguage || !showStats) return null
    
    const language = languages.find(lang => lang.name === selectedLanguage)
    if (!language) return null

    return (
      <motion.div
        className="absolute top-8 left-8 right-8 z-20"
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="glass-card rounded-2xl p-6 border border-lux-gray-200/50 dark:border-lux-gray-700/50">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${language.color}20` }}
            >
              {language.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-lux-gray-900 dark:text-lux-gray-50">
                {language.name}
              </h3>
              <p className="text-sm text-lux-gray-600 dark:text-lux-gray-400">
                {language.proficiency} Level
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-viva-magenta-500" />
                <span className="text-xs font-medium text-lux-gray-600 dark:text-lux-gray-400">Usage</span>
              </div>
              <div className="text-xl font-bold text-lux-gray-900 dark:text-lux-gray-50">
                {language.percentage}%
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Code className="w-4 h-4 text-lux-teal-500" />
                <span className="text-xs font-medium text-lux-gray-600 dark:text-lux-gray-400">Projects</span>
              </div>
              <div className="text-xl font-bold text-lux-gray-900 dark:text-lux-gray-50">
                {language.projects}
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-4 h-4 text-lux-gold-500" />
                <span className="text-xs font-medium text-lux-gray-600 dark:text-lux-gray-400">Experience</span>
              </div>
              <div className="text-xl font-bold text-lux-gray-900 dark:text-lux-gray-50">
                {language.experience}y
              </div>
            </div>

            {language.commits && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <GitBranch className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-medium text-lux-gray-600 dark:text-lux-gray-400">Commits</span>
                </div>
                <div className="text-xl font-bold text-lux-gray-900 dark:text-lux-gray-50">
                  {language.commits.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden perspective-2000 bg-gradient-to-br from-lux-offwhite/50 via-viva-magenta-50/20 to-lux-gold-50/20 dark:from-lux-black/50 dark:via-viva-magenta-900/10 dark:to-lux-gold-900/10"
    >
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0"
        style={{ rotateY, scale }}
      >
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, ${languages[0]?.color || '#BE3455'}40 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, ${languages[1]?.color || '#D4AF37'}40 2px, transparent 2px)
            `,
            backgroundSize: '60px 60px',
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 20}px)`
          }}
        />

        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full">
          {languages.map((_, index) => {
            const nextIndex = (index + 1) % languages.length
            const pos1 = getLanguagePosition(index, languages.length)
            const pos2 = getLanguagePosition(nextIndex, languages.length)
            
            return (
              <motion.line
                key={`line-${index}`}
                x1={`calc(50% + ${pos1.x}px)`}
                y1={`calc(50% + ${pos1.y}px)`}
                x2={`calc(50% + ${pos2.x}px)`}
                y2={`calc(50% + ${pos2.y}px)`}
                stroke="url(#gradient)"
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 2, delay: index * 0.2 }}
              />
            )
          })}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#BE3455" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Language Cards */}
      <div className="relative z-10 w-full h-full">
        {languages.map((language, index) => (
          <LanguageCard
            key={language.name}
            language={language}
            index={index}
            position={getLanguagePosition(index, languages.length)}
          />
        ))}
      </div>

      {/* Center Hub */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        initial={{ scale: 0, rotate: -180 }}
        animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
        transition={{ delay: 0.5, duration: 1, type: "spring" }}
      >
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-viva-magenta-500 to-lux-gold-500 flex items-center justify-center shadow-2xl"
            animate={{
              boxShadow: [
                "0 0 30px rgba(190, 52, 85, 0.3)",
                "0 0 50px rgba(212, 175, 55, 0.3)",
                "0 0 30px rgba(190, 52, 85, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Activity className="w-8 h-8 text-white" />
          </motion.div>
          
          {/* Orbiting Elements */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-viva-magenta-400 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0'
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.5, 1]
              }}
              transition={{
                rotate: { duration: 5 + i, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, delay: i * 0.5 }
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Stats Panel */}
      <StatsPanel />

      {/* Legend */}
      {!selectedLanguage && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 2 }}
        >
          <div className="glass-card rounded-xl px-6 py-3 border border-lux-gray-200/50 dark:border-lux-gray-700/50">
            <p className="text-sm text-lux-gray-600 dark:text-lux-gray-400 text-center">
              {interactive ? 'Click on a language to view detailed stats' : 'Programming Language Distribution'}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default LanguageVisualization