'use client'

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion'
import { Code, Terminal, Braces, FileCode, Cpu, Database, Zap, Globe, Layers } from 'lucide-react'

interface CodeBlock {
  id: string
  language: string
  code: string
  icon: React.ElementType
  color: string
  position: { x: number; y: number; z: number }
  size: 'small' | 'medium' | 'large'
}

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
}

interface FloatingCodeBlocksProps {
  techStack?: string[]
  isVisible?: boolean
  onBlockClick?: (language: string) => void
  onProjectClick?: (project: Project) => void
  projects?: Project[]
  maxBlocks?: number
  animationSpeed?: 'slow' | 'normal' | 'fast'
}

// Optimized constants
const DEFAULT_TECH_STACK = ['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Three.js']
const PARTICLE_COUNT = 15 // Reduced for better performance
const RADIUS_BASE = 180
const ANIMATION_SPEEDS = {
  slow: { duration: 8, delay: 0.3 },
  normal: { duration: 5, delay: 0.2 },
  fast: { duration: 3, delay: 0.1 }
}

const FloatingCodeBlocks: React.FC<FloatingCodeBlocksProps> = ({
  techStack = DEFAULT_TECH_STACK,
  isVisible = true,
  onBlockClick,
  onProjectClick,
  projects = [],
  maxBlocks = 8,
  animationSpeed = 'normal'
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  
  const prefersReducedMotion = useReducedMotion()
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", prefersReducedMotion ? "-20%" : "-50%"])
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 90 : 360])

  // Enhanced code snippets with more realistic examples
  const codeSnippets = useMemo(() => ({
    React: {
      code: `const Portfolio = () => {
  const [projects, setProjects] = useState([])
  
  useEffect(() => {
    fetchGitHubProjects().then(setProjects)
  }, [])

  return (
    <div className="portfolio-3d">
      <Hero3D />
      <ProjectGrid projects={projects} />
    </div>
  )
}`,
      icon: Code,
      color: 'from-blue-500 to-blue-700',
      size: 'large' as const
    },
    TypeScript: {
      code: `interface Developer {
  name: string
  skills: TechStack[]
  experience: number
  passion: 'unlimited'
  currentProject?: Project
}

const juan: Developer = {
  name: 'Juan Fernandez',
  skills: ['React', 'Node.js', 'Three.js'],
  experience: 5,
  passion: 'unlimited',
  currentProject: {
    name: 'Interactive Portfolio',
    status: 'live'
  }
}`,
      icon: FileCode,
      color: 'from-blue-600 to-indigo-700',
      size: 'large' as const
    },
    'Next.js': {
      code: `// app/page.tsx
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Interactive3DHero />
      <FloatingCodeBlocks />
      <ProjectShowcase />
    </main>
  )
}

// Enhanced with App Router
export const metadata = {
  title: 'Juan Fernandez - 3D Portfolio',
  description: 'Interactive developer portfolio'
}`,
      icon: Terminal,
      color: 'from-gray-600 to-gray-800',
      size: 'medium' as const
    },
    'Node.js': {
      code: `const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await github.repos.listForUser({
      username: 'sippinwindex',
      sort: 'updated'
    })
    res.json(projects.data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' })
  }
})

app.listen(3000, () => {
  console.log('🚀 Portfolio API running on port 3000')
})`,
      icon: Database,
      color: 'from-green-500 to-green-700',
      size: 'large' as const
    },
    Python: {
      code: `import asyncio
import aiohttp
from dataclasses import dataclass

@dataclass
class PortfolioMetrics:
    load_time: float
    lighthouse_score: int
    user_engagement: str
    performance_grade: str

async def analyze_portfolio():
    async with aiohttp.ClientSession() as session:
        metrics = await fetch_lighthouse_data(session)
        
    return PortfolioMetrics(
        load_time=1.2,
        lighthouse_score=98,
        user_engagement='excellent',
        performance_grade='A+'
    )

# Real-time performance monitoring
metrics = await analyze_portfolio()`,
      icon: Cpu,
      color: 'from-yellow-500 to-orange-600',
      size: 'medium' as const
    },
    'Three.js': {
      code: `import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true })

// Create floating portfolio cards
const geometry = new THREE.PlaneGeometry(2, 1.2)
const material = new THREE.MeshPhysicalMaterial({
  color: 0xBE3455,
  transmission: 0.9,
  opacity: 0.8,
  roughness: 0.1
})

const portfolioCard = new THREE.Mesh(geometry, material)
portfolioCard.position.set(0, 0, -5)
scene.add(portfolioCard)

function animate() {
  portfolioCard.rotation.y += 0.01
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}`,
      icon: Braces,
      color: 'from-purple-500 to-purple-700',
      size: 'large' as const
    },
    'GraphQL': {
      code: `type Developer {
  id: ID!
  name: String!
  skills: [Skill!]!
  projects: [Project!]!
  experience: Int!
}

type Project {
  id: ID!
  name: String!
  description: String
  techStack: [String!]!
  githubUrl: String
  liveUrl: String
  featured: Boolean!
}

type Query {
  developer(id: ID!): Developer
  projects(featured: Boolean): [Project!]!
}`,
      icon: Globe,
      color: 'from-pink-500 to-rose-600',
      size: 'medium' as const
    },
    Docker: {
      code: `FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS dev
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS prod
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]`,
      icon: Layers,
      color: 'from-cyan-500 to-blue-600',
      size: 'small' as const
    },
    AWS: {
      code: `resource "aws_s3_bucket" "portfolio" {
  bucket = "juan-portfolio-static"
}

resource "aws_cloudfront_distribution" "portfolio_cdn" {
  origin {
    domain_name = aws_s3_bucket.portfolio.bucket_regional_domain_name
    origin_id   = "S3-juan-portfolio"
  }
  
  default_cache_behavior {
    target_origin_id = "S3-juan-portfolio"
    viewer_protocol_policy = "redirect-to-https"
  }
  
  enabled = true
  price_class = "PriceClass_100"
}`,
      icon: Zap,
      color: 'from-orange-500 to-red-600',
      size: 'medium' as const
    }
  }), [])

  // Generate optimized code blocks with better positioning
  const codeBlocks = useMemo((): CodeBlock[] => {
    const displayTechStack = techStack.slice(0, maxBlocks)
    
    return displayTechStack.map((tech, index) => {
      const snippet = codeSnippets[tech] || codeSnippets.React
      const angle = (index / displayTechStack.length) * Math.PI * 2
      const radiusVariation = RADIUS_BASE + Math.sin(index) * 50
      const heightVariation = Math.sin(index * 1.5) * 80
      
      return {
        id: `code-${tech}-${index}`,
        language: tech,
        code: snippet.code,
        icon: snippet.icon,
        color: snippet.color,
        size: snippet.size,
        position: {
          x: Math.cos(angle) * radiusVariation,
          y: heightVariation,
          z: Math.sin(angle) * radiusVariation
        }
      }
    })
  }, [techStack, maxBlocks, codeSnippets])

  // Optimized mouse tracking with proper dependencies
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    
    // Throttle updates for better performance
    requestAnimationFrame(() => {
      setMousePosition({ 
        x: Math.max(-1, Math.min(1, x)), 
        y: Math.max(-1, Math.min(1, y)) 
      })
    })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || prefersReducedMotion) return

    container.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove, prefersReducedMotion])

  // Enhanced block interactions with project integration
  const handleBlockClick = useCallback((language: string) => {
    console.log('FloatingCodeBlocks: Block clicked:', language)
    setSelectedTech(selectedTech === language ? null : language)
    
    if (onBlockClick) {
      onBlockClick(language)
    }

    // Find a project that uses this technology and trigger project click
    if (onProjectClick && projects.length > 0) {
      const projectWithTech = projects.find(project => 
        project.techStack.some(tech => 
          tech.toLowerCase().includes(language.toLowerCase()) ||
          language.toLowerCase().includes(tech.toLowerCase())
        )
      )

      if (projectWithTech) {
        console.log('FloatingCodeBlocks: Found project with tech:', projectWithTech.name)
        setTimeout(() => {
          onProjectClick(projectWithTech)
        }, 300) // Small delay for better UX
      } else {
        console.log('FloatingCodeBlocks: No project found for tech:', language)
      }
    }
  }, [selectedTech, onBlockClick, onProjectClick, projects])

  const handleBlockHover = useCallback((blockId: string | null) => {
    setHoveredBlock(blockId)
  }, [])

  // Enhanced CodeBlockCard with proper component structure
  const CodeBlockCard = React.memo<{ 
    block: CodeBlock
    index: number 
  }>(({ block, index }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
    const cardRef = useRef<HTMLDivElement>(null)
    const isHovered = hoveredBlock === block.id
    const isSelected = selectedTech === block.language

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      const card = cardRef.current
      if (!card || prefersReducedMotion) return

      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const rotateX = (e.clientY - centerY) / 15
      const rotateY = (centerX - e.clientX) / 15
      const rotateZ = isHovered ? 5 : 0
      
      setRotation({ x: rotateX, y: rotateY, z: rotateZ })
    }, [isHovered, prefersReducedMotion])

    const handleMouseLeave = useCallback(() => {
      setRotation({ x: 0, y: 0, z: 0 })
      handleBlockHover(null)
    }, [])

    const handleMouseEnter = useCallback(() => {
      handleBlockHover(block.id)
    }, [block.id])

    // Size variants for different code blocks
    const sizeClasses = {
      small: 'w-64 h-36',
      medium: 'w-80 h-48',
      large: 'w-96 h-56'
    }

    const animationConfig = ANIMATION_SPEEDS[animationSpeed]

    return (
      <motion.div
        ref={cardRef}
        className="absolute cursor-pointer select-none"
        style={{
          transform: prefersReducedMotion 
            ? `translateX(${block.position.x}px) translateY(${block.position.y}px)`
            : `perspective(1200px) translateX(${block.position.x + mousePosition.x * 25}px) translateY(${block.position.y + mousePosition.y * 15}px) translateZ(${block.position.z}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
          transformStyle: 'preserve-3d',
          left: '50%',
          top: '50%'
        }}
        initial={{ opacity: 0, scale: 0, rotateY: -180 }}
        animate={isInView ? { 
          opacity: isVisible ? (isSelected ? 1 : 0.9) : 0.4, 
          scale: isSelected ? 1.1 : 1,
          rotateY: 0,
          y: prefersReducedMotion ? 0 : [0, -8, 0]
        } : { opacity: 0, scale: 0, rotateY: -180 }}
        transition={{ 
          delay: index * 0.15,
          duration: 0.8,
          y: {
            duration: animationConfig.duration + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        whileHover={prefersReducedMotion ? {} : { scale: 1.05, z: 30 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={() => handleBlockClick(block.language)}
      >
        <div className={`
          relative ${sizeClasses[block.size]} rounded-2xl overflow-hidden
          bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl
          border-2 transition-all duration-300
          ${isSelected 
            ? 'border-blue-400 dark:border-blue-600 shadow-2xl shadow-blue-500/25' 
            : isHovered 
              ? 'border-gray-300/60 dark:border-gray-600/60 shadow-xl' 
              : 'border-gray-200/40 dark:border-gray-700/40 shadow-lg'
          }
        `}>
          {/* Enhanced Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${block.color} ${isSelected ? 'opacity-15' : 'opacity-8'} transition-opacity duration-300`} />
          
          {/* Enhanced Glow Effect */}
          {(isHovered || isSelected) && !prefersReducedMotion && (
            <motion.div
              className={`absolute -inset-2 bg-gradient-to-br ${block.color} opacity-20 blur-xl rounded-2xl`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.1, opacity: isSelected ? 0.3 : 0.2 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Enhanced Header */}
          <div className="relative z-10 p-4 border-b border-gray-200/30 dark:border-gray-600/30 bg-gray-50/50 dark:bg-gray-700/50">
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-2 rounded-lg bg-gradient-to-br ${block.color} shadow-sm`}
                animate={isHovered && !prefersReducedMotion ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.6 }}
              >
                <block.icon className="w-4 h-4 text-white" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                  {block.language}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {isSelected ? 'Active' : 'Live Code'}
                </p>
              </div>
              
              {/* Enhanced Terminal Dots */}
              <div className="flex gap-1.5">
                <motion.div 
                  className="w-2.5 h-2.5 rounded-full bg-red-400"
                  animate={isHovered ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                />
                <motion.div 
                  className="w-2.5 h-2.5 rounded-full bg-yellow-400"
                  animate={isHovered ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 1, repeat: isHovered ? Infinity : 0, delay: 0.1 }}
                />
                <motion.div 
                  className="w-2.5 h-2.5 rounded-full bg-green-400"
                  animate={isHovered ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 1, repeat: isHovered ? Infinity : 0, delay: 0.2 }}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Code Content */}
          <div className="relative z-10 p-4 overflow-hidden" style={{ height: `calc(100% - 80px)` }}>
            <motion.pre 
              className="text-xs text-gray-700 dark:text-gray-300 font-mono leading-relaxed h-full overflow-hidden"
              animate={{
                y: isHovered ? 0 : -5,
                scale: isSelected ? 1.02 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <code className="block">{block.code}</code>
            </motion.pre>
            
            {/* Enhanced Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/95 dark:from-gray-800/95 to-transparent pointer-events-none" />
          </div>

          {/* Enhanced Scanning Line Effect */}
          {(isHovered || isSelected) && !prefersReducedMotion && (
            <motion.div
              className={`absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent`}
              initial={{ top: '20%', opacity: 0 }}
              animate={{ 
                top: ['20%', '90%'],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}

          {/* Enhanced Selection Indicator */}
          {isSelected && (
            <motion.div
              className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <motion.div
                className="w-full h-full bg-blue-400 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  })
  CodeBlockCard.displayName = 'CodeBlockCard'

  // Optimized floating particles with proper useMemo
  const FloatingParticles = React.memo(() => {
    if (prefersReducedMotion) return null

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
          const particle = {
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 4 + Math.random() * 4,
            moveX: Math.random() * 60 - 30,
            color: i % 3 === 0 ? 'bg-blue-400/20' : i % 3 === 1 ? 'bg-purple-400/20' : 'bg-pink-400/20'
          }

          return (
            <motion.div
              key={particle.id}
              className={`absolute w-1 h-1 ${particle.color} rounded-full`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -80, 0],
                x: [0, particle.moveX, 0],
                opacity: [0.2, 0.8, 0.2],
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

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ 
        perspective: '2000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Enhanced Background Elements */}
      <motion.div
        className="absolute inset-0"
        style={{ y, rotateY }}
      >
        {/* Dynamic Grid Background */}
        {!prefersReducedMotion && (
          <motion.div 
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px) rotate(${mousePosition.x * 2}deg)`
            }}
          />
        )}

        <FloatingParticles />
      </motion.div>

      {/* Code Blocks Container */}
      <div className="relative z-10 w-full h-full">
        {codeBlocks.map((block, index) => (
          <CodeBlockCard key={block.id} block={block} index={index} />
        ))}
      </div>

      {/* Enhanced Center Focus Point */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <div className="relative">
          <motion.div
            className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {!prefersReducedMotion && (
            <motion.div
              className="absolute inset-0 w-5 h-5 rounded-full border-2 border-blue-400/50"
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
        </div>
      </motion.div>

      {/* Enhanced Technology Labels */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 max-w-4xl">
        <motion.div
          className="flex flex-wrap justify-center gap-2 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.5 }}
        >
          {techStack.slice(0, maxBlocks).map((tech, index) => (
            <motion.button
              key={tech}
              className={`
                px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm transition-all duration-300 shadow-sm
                ${selectedTech === tech
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-400 dark:border-blue-600 shadow-lg'
                  : hoveredBlock?.includes(tech) 
                    ? 'bg-gray-100 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-500'
                    : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }
                hover:bg-blue-50 dark:hover:bg-blue-900/30 
                hover:text-blue-700 dark:hover:text-blue-300
                hover:border-blue-300 dark:hover:border-blue-600
                hover:shadow-md hover:scale-105
              `}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBlockClick(tech)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 + index * 0.05 }}
            >
              {tech}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Code Block Counter */}
      {selectedTech && (
        <motion.div
          className="absolute top-8 right-8 z-30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="px-4 py-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-600 shadow-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Viewing: <span className="text-blue-600 dark:text-blue-400">{selectedTech}</span>
            </span>
          </div>
        </motion.div>
      )}

      {/* Project Integration Indicator */}
      {selectedTech && projects.length > 0 && (
        <motion.div
          className="absolute top-20 right-8 z-30"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="px-3 py-1 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-600 shadow-sm">
            <span className="text-xs text-green-700 dark:text-green-400">
              {projects.filter(p => p.techStack.some(tech => 
                tech.toLowerCase().includes(selectedTech.toLowerCase())
              )).length} related project(s)
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default FloatingCodeBlocks