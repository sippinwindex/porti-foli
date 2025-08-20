// components/3D/ParticleField.tsx - FIXED VERSION
'use client'

import { useEffect, useRef, useCallback, useMemo } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  hue: number
  life: number
  maxLife: number
}

interface ParticleFieldProps {
  particleCount?: number
  colorScheme?: 'cyberpunk' | 'synthwave' | 'cosmic' | 'aurora'
  animation?: 'float' | 'drift' | 'spiral' | 'chaos'
  interactive?: boolean
  speed?: number
  className?: string
}

export default function ParticleField({
  particleCount = 50,
  colorScheme = 'cyberpunk',
  animation = 'float',
  interactive = true,
  speed = 1,
  className = ''
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const dimensionsRef = useRef({ width: 0, height: 0 })

  // Color schemes
  const colorSchemes = useMemo(() => ({
    cyberpunk: {
      primary: [0, 255, 255], // Cyan
      secondary: [255, 0, 255], // Magenta
      accent: [255, 255, 0], // Yellow
      hueRange: [180, 300]
    },
    synthwave: {
      primary: [255, 20, 147], // Deep pink
      secondary: [138, 43, 226], // Blue violet
      accent: [0, 255, 255], // Cyan
      hueRange: [280, 320]
    },
    cosmic: {
      primary: [75, 0, 130], // Indigo
      secondary: [138, 43, 226], // Blue violet
      accent: [255, 215, 0], // Gold
      hueRange: [240, 280]
    },
    aurora: {
      primary: [0, 255, 127], // Spring green
      secondary: [30, 144, 255], // Dodger blue
      accent: [255, 20, 147], // Deep pink
      hueRange: [120, 200]
    }
  }), [])

  // FIXED: Safe gradient creation with validation
  const createSafeRadialGradient = useCallback((
    ctx: CanvasRenderingContext2D,
    x0: number,
    y0: number,
    r0: number,
    x1: number,
    y1: number,
    r1: number
  ) => {
    // Ensure all values are finite and non-negative
    const safeR0 = Math.max(0, isFinite(r0) ? r0 : 0)
    const safeR1 = Math.max(0, isFinite(r1) ? r1 : 1) // Minimum radius of 1
    const safeX0 = isFinite(x0) ? x0 : 0
    const safeY0 = isFinite(y0) ? y0 : 0
    const safeX1 = isFinite(x1) ? x1 : 0
    const safeY1 = isFinite(y1) ? y1 : 0

    // Additional safety: ensure r1 is not zero when r0 is zero
    const finalR1 = safeR0 === 0 && safeR1 === 0 ? 1 : safeR1

    try {
      return ctx.createRadialGradient(safeX0, safeY0, safeR0, safeX1, safeY1, finalR1)
    } catch (error) {
      console.warn('Gradient creation failed, using fallback:', error)
      // Fallback: create a simple gradient
      return ctx.createRadialGradient(safeX0, safeY0, 0, safeX1, safeY1, 10)
    }
  }, [])

  // Initialize particles
  const initializeParticles = useCallback(() => {
    const { width, height } = dimensionsRef.current
    if (width === 0 || height === 0) return

    particlesRef.current = Array.from({ length: particleCount }, () => {
      const hueRange = colorSchemes[colorScheme].hueRange
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * 0.5,
        vy: (Math.random() - 0.5) * speed * 0.5,
        radius: Math.random() * 3 + 1, // Ensure minimum radius
        opacity: Math.random() * 0.8 + 0.2,
        hue: hueRange[0] + Math.random() * (hueRange[1] - hueRange[0]),
        life: 0,
        maxLife: Math.random() * 200 + 100
      }
    })
  }, [particleCount, colorScheme, speed, colorSchemes])

  // Update particle positions
  const updateParticles = useCallback(() => {
    const { width, height } = dimensionsRef.current
    
    particlesRef.current.forEach(particle => {
      // Update position based on animation type
      switch (animation) {
        case 'drift':
          particle.x += particle.vx * speed
          particle.y += particle.vy * speed
          break
        case 'spiral':
          const centerX = width / 2
          const centerY = height / 2
          const angle = particle.life * 0.02
          const distance = 50 + particle.life * 0.5
          particle.x = centerX + Math.cos(angle) * distance
          particle.y = centerY + Math.sin(angle) * distance
          break
        case 'chaos':
          particle.vx += (Math.random() - 0.5) * 0.1
          particle.vy += (Math.random() - 0.5) * 0.1
          particle.x += particle.vx * speed
          particle.y += particle.vy * speed
          break
        case 'float':
        default:
          particle.y += particle.vy * speed * 0.3
          particle.x += Math.sin(particle.life * 0.01) * 0.5
          break
      }

      // Interactive mode: attract to mouse
      if (interactive) {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          const force = (100 - distance) / 100 * 0.01
          particle.vx += dx * force
          particle.vy += dy * force
        }
      }

      // Wrap around screen edges
      if (particle.x < 0) particle.x = width
      if (particle.x > width) particle.x = 0
      if (particle.y < 0) particle.y = height
      if (particle.y > height) particle.y = 0

      // Update life cycle
      particle.life++
      if (particle.life > particle.maxLife) {
        particle.life = 0
        particle.x = Math.random() * width
        particle.y = Math.random() * height
        particle.opacity = Math.random() * 0.8 + 0.2
      }

      // Fade in/out based on life cycle
      const lifeCycle = particle.life / particle.maxLife
      if (lifeCycle < 0.1) {
        particle.opacity *= lifeCycle / 0.1
      } else if (lifeCycle > 0.9) {
        particle.opacity *= (1 - lifeCycle) / 0.1
      }
    })
  }, [animation, speed, interactive])

  // FIXED: Safe rendering with gradient validation
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = dimensionsRef.current

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Render particles
    particlesRef.current.forEach(particle => {
      // Validate particle properties before rendering
      if (!isFinite(particle.x) || !isFinite(particle.y) || 
          !isFinite(particle.radius) || particle.radius <= 0) {
        return // Skip invalid particles
      }

      // FIXED: Safe radius calculation
      const safeRadius = Math.max(1, Math.min(50, particle.radius)) // Clamp between 1-50
      
      try {
        // Create safe gradient
        const gradient = createSafeRadialGradient(
          ctx,
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          safeRadius
        )

        // Add color stops
        const alpha = Math.max(0, Math.min(1, particle.opacity)) // Clamp alpha
        gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${alpha})`)
        gradient.addColorStop(0.7, `hsla(${particle.hue}, 80%, 50%, ${alpha * 0.5})`)
        gradient.addColorStop(1, `hsla(${particle.hue}, 90%, 40%, 0)`)

        // Draw particle
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, safeRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      } catch (error) {
        console.warn('Particle rendering error:', error)
        // Fallback: draw simple circle
        ctx.save()
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, safeRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    })
  }, [createSafeRadialGradient])

  // Animation loop
  const animate = useCallback(() => {
    updateParticles()
    render()
    animationRef.current = requestAnimationFrame(animate)
  }, [updateParticles, render])

  // Handle mouse movement
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!interactive) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }, [interactive])

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = canvas.parentElement
    if (!container) return

    const rect = container.getBoundingClientRect()
    const width = rect.width || window.innerWidth
    const height = rect.height || window.innerHeight

    // Update canvas size
    canvas.width = width
    canvas.height = height
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    dimensionsRef.current = { width, height }
    
    // Reinitialize particles with new dimensions
    initializeParticles()
  }, [initializeParticles])

  // Setup and cleanup
  useEffect(() => {
    handleResize()
    
    const canvas = canvasRef.current
    if (canvas && interactive) {
      canvas.addEventListener('mousemove', handleMouseMove)
    }

    window.addEventListener('resize', handleResize)

    // Start animation
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove)
      }
      
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize, handleMouseMove, animate, interactive])

  // Reinitialize when props change
  useEffect(() => {
    initializeParticles()
  }, [initializeParticles])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100%',
        opacity: 0.6
      }}
    />
  )
}