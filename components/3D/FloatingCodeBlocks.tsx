'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Code, Terminal, Braces, FileCode, Cpu, Database } from 'lucide-react'

interface CodeBlock {
  id: string
  language: string
  code: string
  icon: React.ElementType
  color: string
  position: { x: number; y: number; z: number }
}

interface FloatingCodeBlocksProps {
  techStack?: string[]
  isVisible?: boolean
  onBlockClick?: (language: string) => void
}

const FloatingCodeBlocks: React.FC<FloatingCodeBlocksProps> = ({
  techStack = ['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Three.js'],
  isVisible = true,
  onBlockClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360])

  // Code snippets for different technologies
  const codeSnippets: Record<string, { code: string; icon: React.ElementType; color: string }> = {
    React: {
      code: `const Portfolio = () => {
  return (
    <div className="hero-3d">
      <h1>Juan Fernandez</h1>
      <p>Full Stack Developer</p>
    </div>
  )
}`,
      icon: Code,
      color: 'from-viva-magenta-500 to-viva-magenta-700'
    },
    TypeScript: {
      code: `interface Developer {
  name: string
  skills: string[]
  experience: number
  passion: 'unlimited'
}

const juan: Developer = {
  name: 'Juan Fernandez',
  skills: ['React', 'Node.js'],
  experience: 5,
  passion: 'unlimited'
}`,
      icon: FileCode,
      color: 'from-lux-teal-500 to-lux-teal-700'
    },
    'Next.js': {
      code: `export default function Page() {
  return (
    <main className="glass-hero">
      <Interactive3DHero />
      <ScrollTriggered3DSections />
    </main>
  )
}`,
      icon: Terminal,
      color: 'from-lux-gray-600 to-lux-gray-800'
    },
    'Node.js': {
      code: `const express = require('express')
const app = express()

app.get('/api/projects', async (req, res) => {
  const projects = await getGitHubProjects()
  res.json(projects)
})

app.listen(3000)`,
      icon: Database,
      color: 'from-lux-gold-500 to-lux-gold-700'
    },
    Python: {
      code: `def analyze_portfolio_performance():
    metrics = {
        'load_time': '< 2s',
        'lighthouse_score': 95,
        'user_engagement': 'high'
    }
    return optimize_experience(metrics)`,
      icon: Cpu,
      color: 'from-green-500 to-green-700'
    },
    'Three.js': {
      code: `const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()
const renderer = new THREE.WebGLRenderer()

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
  color: 0xBE3455
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)`,
      icon: Braces,
      color: 'from-purple-500 to-purple-700'
    }
  }

  // Generate code blocks with 3D positions
  const codeBlocks: CodeBlock[] = techStack.map((tech, index) => {
    const snippet = codeSnippets[tech] || codeSnippets.React
    const angle = (index / techStack.length) * Math.PI * 2
    const radius = 200
    
    return {
      id: `code-${tech}-${index}`,
      language: tech,
      code: snippet.code,
      icon: snippet.icon,
      color: snippet.color,
      position: {
        x: Math.cos(angle) * radius,
        y: Math.sin(index * 0.5) * 100,
        z: Math.sin(angle) * radius
      }
    }
  })

  // Mouse tracking for parallax
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
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      return () => container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Individual code block component
  const CodeBlockCard: React.FC<{ 
    block: CodeBlock
    index: number 
  }> = ({ block, index }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
    const cardRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent) => {
      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const rotateX = (e.clientY - centerY) / 10
      const rotateY = (centerX - e.clientX) / 10
      const rotateZ = hoveredBlock === block.id ? 5 : 0
      
      setRotation({ x: rotateX, y: rotateY, z: rotateZ })
    }

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0, z: 0 })
      setHoveredBlock(null)
    }

    const handleMouseEnter = () => {
      setHoveredBlock(block.id)
    }

    return (
      <motion.div
        ref={cardRef}
        className="absolute cursor-pointer"
        style={{
          transform: `perspective(1000px) translateX(${block.position.x + mousePosition.x * 30}px) translateY(${block.position.y + mousePosition.y * 20}px) translateZ(${block.position.z}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
          transformStyle: 'preserve-3d',
          left: '50%',
          top: '50%'
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { 
          opacity: isVisible ? 1 : 0.3, 
          scale: 1,
          y: [0, -10, 0]
        } : { opacity: 0, scale: 0 }}
        transition={{ 
          delay: index * 0.2,
          duration: 0.8,
          y: {
            duration: 3 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        whileHover={{ scale: 1.1, z: 50 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={() => onBlockClick?.(block.language)}
      >
        <div className={`
          relative w-80 h-48 rounded-2xl overflow-hidden
          glass-3d border border-lux-gray-200/20 dark:border-lux-gray-700/20
          ${hoveredBlock === block.id ? 'shadow-2xl' : 'shadow-lg'}
          transition-all duration-300
        `}>
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${block.color} opacity-10`} />
          
          {/* Glow Effect */}
          {hoveredBlock === block.id && (
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${block.color} opacity-20 blur-xl`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.2 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Header */}
          <div className="relative z-10 p-4 border-b border-lux-gray-200/20 dark:border-lux-gray-700/20">
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-2 rounded-lg bg-gradient-to-br ${block.color}`}
                animate={{ rotate: hoveredBlock === block.id ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <block.icon className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-sm font-semibold text-lux-gray-900 dark:text-lux-gray-50">
                  {block.language}
                </h3>
                <p className="text-xs text-lux-gray-600 dark:text-lux-gray-400">
                  Live Code
                </p>
              </div>
              
              {/* Terminal Dots */}
              <div className="ml-auto flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            </div>
          </div>

          {/* Code Content */}
          <div className="relative z-10 p-4 h-32 overflow-hidden">
            <motion.pre 
              className="text-xs text-lux-gray-700 dark:text-lux-gray-300 font-mono leading-relaxed"
              animate={{
                y: hoveredBlock === block.id ? 0 : -10
              }}
              transition={{ duration: 0.3 }}
            >
              <code>{block.code}</code>
            </motion.pre>
            
            {/* Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/90 dark:from-lux-gray-800/90 to-transparent" />
          </div>

          {/* Scanning Line Effect */}
          {hoveredBlock === block.id && (
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-viva-magenta-500 to-transparent"
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

          {/* Matrix Rain Effect */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px h-full opacity-20"
                style={{
                  left: `${10 + i * 12}%`,
                  background: `linear-gradient(to bottom, transparent, ${block.color.includes('viva-magenta') ? '#BE3455' : '#D4AF37'}, transparent)`
                }}
                animate={{
                  y: ['-100%', '100%'],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden perspective-2000"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0"
        style={{ y, rotateY }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(190, 52, 85, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(190, 52, 85, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-viva-magenta-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Code Blocks */}
      <div className="relative z-10 w-full h-full">
        {codeBlocks.map((block, index) => (
          <CodeBlockCard key={block.id} block={block} index={index} />
        ))}
      </div>

      {/* Center Focus Point */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="relative">
          <motion.div
            className="w-4 h-4 rounded-full bg-gradient-to-r from-viva-magenta-500 to-lux-gold-500"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute inset-0 w-4 h-4 rounded-full border-2 border-viva-magenta-400"
            animate={{ rotate: 360 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </motion.div>

      {/* Technology Labels */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <motion.div
          className="flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.5 }}
        >
          {techStack.map((tech, index) => (
            <motion.button
              key={tech}
              className={`
                px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm
                ${hoveredBlock?.includes(tech) 
                  ? 'bg-viva-magenta-50 dark:bg-viva-magenta-900/30 text-viva-magenta-700 dark:text-viva-magenta-300 border-viva-magenta-300 dark:border-viva-magenta-700'
                  : 'bg-white/50 dark:bg-lux-gray-800/50 text-lux-gray-700 dark:text-lux-gray-300 border-lux-gray-300 dark:border-lux-gray-600'
                }
                hover:bg-viva-magenta-50 dark:hover:bg-viva-magenta-900/30 
                hover:text-viva-magenta-700 dark:hover:text-viva-magenta-300
                hover:border-viva-magenta-300 dark:hover:border-viva-magenta-700
                transition-all duration-300
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onBlockClick?.(tech)}
            >
              {tech}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default FloatingCodeBlocks