'use client'

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion'

interface Particle {
  id: string
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
  trail: { x: number; y: number; opacity: number }[]
}

interface ParticleFieldProps {
  particleCount?: number
  interactive?: boolean
  colorScheme?: 'viva-magenta' | 'lux-gold' | 'multi' | 'cyberpunk'
  animation?: 'float' | 'spiral' | 'wave' | 'constellation' | 'matrix'
  responsive?: boolean
  showConnections?: boolean
  mouseInfluence?: number
  speed?: number
}

const ParticleField: React.FC<ParticleFieldProps> = ({
  particleCount = 100,
  interactive = true,
  colorScheme = 'multi',
  animation = 'constellation',
  responsive = true,
  showConnections = true,
  mouseInfluence = 100,
  speed = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isVisible, setIsVisible] = useState(true)
  const controls = useAnimation()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  // Color schemes - memoized to prevent recreation
  const colorSchemes = useMemo(() => ({
    'viva-magenta': ['#BE3455', '#E85A4F', '#C73650', '#A91D3A'],
    'lux-gold': ['#D4AF37', '#FFD700', '#F4D03F', '#E6C200'],
    'multi': ['#BE3455', '#D4AF37', '#98A869', '#008080'],
    'cyberpunk': ['#00FFFF', '#FF00FF', '#00FF00', '#FFFF00']
  }), [])

  const colors = useMemo(() => colorSchemes[colorScheme], [colorSchemes, colorScheme])

  // Initialize particles - FIXED: Memoized createParticle function
  const createParticle = useCallback((index: number): Particle => {
    const x = Math.random() * dimensions.width
    const y = Math.random() * dimensions.height
    const z = Math.random() * 100
    
    return {
      id: `particle-${index}`,
      x,
      y,
      z,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      vz: (Math.random() - 0.5) * speed * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 1000 + 500,
      trail: []
    }
  }, [dimensions.width, dimensions.height, colors, speed]) // FIXED: Include all dependencies

  // Initialize particles when dimensions change
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => createParticle(i))
      setParticles(newParticles)
    }
  }, [dimensions.width, dimensions.height, particleCount, createParticle]) // FIXED: Include createParticle

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    if (responsive) {
      window.addEventListener('resize', updateDimensions)
      return () => window.removeEventListener('resize', updateDimensions)
    }
  }, [responsive])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return
      
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      return () => container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [interactive])

  // Animation functions - FIXED: Memoized to avoid recreation
  const applyAnimation = useCallback((particle: Particle, time: number) => {
    switch (animation) {
      case 'spiral':
        const angle = time * 0.001 + particle.life * 0.01
        particle.x += Math.cos(angle) * 0.5
        particle.y += Math.sin(angle) * 0.5
        break
        
      case 'wave':
        particle.y += Math.sin(time * 0.001 + particle.x * 0.01) * 0.2
        particle.x += particle.vx
        break
        
      case 'matrix':
        particle.y += speed * 2
        if (particle.y > dimensions.height) {
          particle.y = -particle.size
          particle.x = Math.random() * dimensions.width
        }
        break
        
      case 'constellation':
        // Apply mouse influence
        if (interactive) {
          const dx = mousePos.x - particle.x
          const dy = mousePos.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < mouseInfluence) {
            const force = (mouseInfluence - distance) / mouseInfluence
            particle.vx += dx * force * 0.001
            particle.vy += dy * force * 0.001
          }
        }
        
        // Apply velocity with damping
        particle.x += particle.vx
        particle.y += particle.vy
        particle.z += particle.vz
        
        particle.vx *= 0.99
        particle.vy *= 0.99
        particle.vz *= 0.99
        break
        
      case 'float':
      default:
        particle.x += particle.vx
        particle.y += particle.vy
        particle.z += particle.vz
        break
    }
  }, [animation, interactive, mousePos.x, mousePos.y, mouseInfluence, speed, dimensions.height, dimensions.width]) // FIXED: Include all dependencies

  // Main animation loop - FIXED: Include all dependencies
  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    
    if (!canvas || !ctx || !dimensions.width || !dimensions.height) {
      animationRef.current = requestAnimationFrame(animate)
      return
    }

    canvas.width = dimensions.width * window.devicePixelRatio
    canvas.height = dimensions.height * window.devicePixelRatio
    canvas.style.width = `${dimensions.width}px`
    canvas.style.height = `${dimensions.height}px`
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    // Update and draw particles
    setParticles(prevParticles => {
      const newParticles = prevParticles.map(particle => {
        const newParticle = { ...particle }
        
        // Update particle life
        newParticle.life += 1
        
        // Apply animation
        applyAnimation(newParticle, time)
        
        // Wrap around edges
        if (newParticle.x < 0) newParticle.x = dimensions.width
        if (newParticle.x > dimensions.width) newParticle.x = 0
        if (newParticle.y < 0) newParticle.y = dimensions.height
        if (newParticle.y > dimensions.height) newParticle.y = 0
        
        // Update trail
        newParticle.trail.push({ 
          x: newParticle.x, 
          y: newParticle.y, 
          opacity: newParticle.opacity 
        })
        if (newParticle.trail.length > 10) {
          newParticle.trail.shift()
        }
        
        // Respawn particle if life exceeded
        if (newParticle.life > newParticle.maxLife) {
          return createParticle(prevParticles.indexOf(particle))
        }
        
        return newParticle
      })

      // Draw connections
      if (showConnections) {
        ctx.strokeStyle = 'rgba(190, 52, 85, 0.1)'
        ctx.lineWidth = 0.5
        
        for (let i = 0; i < newParticles.length; i++) {
          for (let j = i + 1; j < newParticles.length; j++) {
            const p1 = newParticles[i]
            const p2 = newParticles[j]
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < 100) {
              const opacity = (100 - distance) / 100 * 0.2
              ctx.globalAlpha = opacity
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
            }
          }
        }
      }

      // Draw particles
      newParticles.forEach((particle, index) => {
        // Draw trail
        if (particle.trail.length > 1) {
          ctx.strokeStyle = particle.color
          ctx.lineWidth = 1
          ctx.globalAlpha = 0.3
          
          ctx.beginPath()
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y)
          
          for (let i = 1; i < particle.trail.length; i++) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y)
          }
          ctx.stroke()
        }

        // Draw particle
        const size = particle.size * (1 + particle.z * 0.01)
        ctx.globalAlpha = particle.opacity
        
        // Create gradient
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, size
        )
        gradient.addColorStop(0, particle.color)
        gradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
        ctx.fill()

        // Draw glow effect for special particles
        if (index % 10 === 0) {
          ctx.globalAlpha = 0.1
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      ctx.globalAlpha = 1
      return newParticles
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [
    dimensions.width, 
    dimensions.height, 
    createParticle, 
    applyAnimation,
    showConnections
  ]) // FIXED: Include all dependencies

  // Start animation
  useEffect(() => {
    if (isVisible && particles.length > 0) {
      animationRef.current = requestAnimationFrame(animate)
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, isVisible, particles.length])

  // Intersection observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Preset configurations - FIXED: Memoized to prevent recreation
  const presetConfigs = useMemo(() => ({
    hero: () => controls.start({
      filter: "brightness(1.2) contrast(1.1)",
      transition: { duration: 2 }
    }),
    about: () => controls.start({
      filter: "hue-rotate(45deg) saturate(1.3)",
      transition: { duration: 1.5 }
    }),
    projects: () => controls.start({
      filter: "brightness(0.9) contrast(1.2) saturate(1.1)",
      transition: { duration: 1 }
    })
  }), [controls])

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity, scale }}
      animate={controls}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          mixBlendMode: 'screen',
          filter: 'blur(0.5px)'
        }}
      />

      {/* Interactive Elements */}
      {interactive && (
        <motion.div
          className="absolute pointer-events-auto inset-0"
          onHoverStart={() => controls.start({ scale: 1.02 })}
          onHoverEnd={() => controls.start({ scale: 1 })}
        />
      )}

      {/* Performance Monitor */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 text-xs text-lux-gray-600 dark:text-lux-gray-400 bg-white/80 dark:bg-lux-gray-800/80 rounded px-2 py-1 pointer-events-auto">
          Particles: {particles.length} | Animation: {animation}
        </div>
      )}

      {/* Ambient Effects */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(190, 52, 85, 0.05) 0%, transparent 50%)`
        }}
        animate={{
          background: interactive ? [
            `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(190, 52, 85, 0.05) 0%, transparent 50%)`,
            `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.03) 0%, transparent 50%)`,
            `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(190, 52, 85, 0.05) 0%, transparent 50%)`
          ] : undefined
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Preset Triggers */}
      <div className="absolute bottom-4 left-4 space-x-2 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity">
        {Object.keys(presetConfigs).map(preset => (
          <button
            key={preset}
            onClick={() => presetConfigs[preset as keyof typeof presetConfigs]()}
            className="px-2 py-1 text-xs bg-lux-gray-800/50 text-white rounded backdrop-blur-sm hover:bg-lux-gray-700/50 transition-colors"
          >
            {preset}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

export default ParticleField