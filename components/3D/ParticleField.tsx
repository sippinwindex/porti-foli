// Fixed components/3D/ParticleField.tsx - Uses your theme colors and stable rendering
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
  color: string
}

interface ParticleFieldProps {
  particleCount?: number
  colorScheme?: 'cyberpunk' | 'synthwave' | 'cosmic' | 'aurora' | 'viva-magenta'
  animation?: 'float' | 'drift' | 'spiral' | 'chaos' | 'constellation'
  interactive?: boolean
  speed?: number
  className?: string
}

export default function ParticleField({
  particleCount = 50,
  colorScheme = 'viva-magenta',
  animation = 'constellation',
  interactive = true,
  speed = 1,
  className = ''
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const dimensionsRef = useRef({ width: 0, height: 0 })

  // Enhanced color schemes using your theme colors
  const colorSchemes = useMemo(() => ({
    cyberpunk: {
      colors: ['#00FFFF', '#FF00FF', '#FFFF00'],
      primary: '#00FFFF',
      secondary: '#FF00FF',
      accent: '#FFFF00'
    },
    synthwave: {
      colors: ['#FF1493', '#8A2BE2', '#00FFFF'],
      primary: '#FF1493',
      secondary: '#8A2BE2', 
      accent: '#00FFFF'
    },
    cosmic: {
      colors: ['#4B0082', '#8A2BE2', '#FFD700'],
      primary: '#4B0082',
      secondary: '#8A2BE2',
      accent: '#FFD700'
    },
    aurora: {
      colors: ['#00FF7F', '#1E90FF', '#FF1493'],
      primary: '#00FF7F',
      secondary: '#1E90FF',
      accent: '#FF1493'
    },
    'viva-magenta': {
      colors: ['#BE3455', '#D4AF37', '#98A869', '#008080'],
      primary: '#BE3455',    // Your viva-magenta
      secondary: '#D4AF37',  // Your lux-gold
      accent: '#98A869'      // Your lux-sage
    }
  }), [])

  const currentColorScheme = colorSchemes[colorScheme]

  // Enhanced particle initialization
  const initializeParticles = useCallback(() => {
    const { width, height } = dimensionsRef.current
    if (width === 0 || height === 0) return

    particlesRef.current = Array.from({ length: particleCount }, (_, i) => {
      const colors = currentColorScheme.colors
      const selectedColor = colors[Math.floor(Math.random() * colors.length)]
      
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * 0.5,
        vy: (Math.random() - 0.5) * speed * 0.5,
        radius: Math.random() * 2 + 1, // Smaller particles for better performance
        opacity: Math.random() * 0.6 + 0.2,
        hue: 0, // Not used anymore, using direct colors
        life: 0,
        maxLife: Math.random() * 300 + 200,
        color: selectedColor
      }
    })
  }, [particleCount, speed, currentColorScheme])

  // Enhanced particle updates with optimized animations
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
          const distance = 50 + particle.life * 0.3
          particle.x = centerX + Math.cos(angle) * distance
          particle.y = centerY + Math.sin(angle) * distance
          break
        case 'chaos':
          particle.vx += (Math.random() - 0.5) * 0.05
          particle.vy += (Math.random() - 0.5) * 0.05
          particle.vx = Math.max(-2, Math.min(2, particle.vx)) // Limit velocity
          particle.vy = Math.max(-2, Math.min(2, particle.vy))
          particle.x += particle.vx * speed
          particle.y += particle.vy * speed
          break
        case 'constellation':
          // Gentle floating with constellation-like movement
          particle.y += particle.vy * speed * 0.1
          particle.x += Math.sin(particle.life * 0.003) * 0.2
          particle.vy += Math.sin(particle.life * 0.005) * 0.005
          break
        case 'float':
        default:
          particle.y += particle.vy * speed * 0.2
          particle.x += Math.sin(particle.life * 0.008) * 0.3
          break
      }

      // Interactive mode: attract to mouse with smoother effect
      if (interactive) {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 150 && distance > 0) {
          const force = (150 - distance) / 150 * 0.005
          particle.vx += dx * force
          particle.vy += dy * force
          
          // Add slight repulsion when very close
          if (distance < 50) {
            const repulsion = (50 - distance) / 50 * 0.01
            particle.vx -= dx * repulsion
            particle.vy -= dy * repulsion
          }
        }
      }

      // Wrap around screen edges with buffer
      const buffer = 20
      if (particle.x < -buffer) particle.x = width + buffer
      if (particle.x > width + buffer) particle.x = -buffer
      if (particle.y < -buffer) particle.y = height + buffer
      if (particle.y > height + buffer) particle.y = -buffer

      // Update life cycle with smooth transitions
      particle.life++
      if (particle.life > particle.maxLife) {
        particle.life = 0
        particle.x = Math.random() * width
        particle.y = Math.random() * height
        particle.opacity = Math.random() * 0.6 + 0.2
        // Reassign color
        const colors = currentColorScheme.colors
        particle.color = colors[Math.floor(Math.random() * colors.length)]
      }

      // Enhanced fade in/out with smoother transitions
      const lifeCycle = particle.life / particle.maxLife
      if (lifeCycle < 0.1) {
        particle.opacity *= lifeCycle / 0.1
      } else if (lifeCycle > 0.9) {
        particle.opacity *= (1 - lifeCycle) / 0.1
      }
      
      // Ensure opacity stays within bounds
      particle.opacity = Math.max(0, Math.min(1, particle.opacity))
    })
  }, [animation, speed, interactive, currentColorScheme])

  // Enhanced rendering with better performance and your theme colors
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = dimensionsRef.current

    // Clear canvas with slight trail effect for smoother animation
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
    ctx.fillRect(0, 0, width, height)

    // Render particles with enhanced effects
    particlesRef.current.forEach(particle => {
      // Validate particle properties
      if (!isFinite(particle.x) || !isFinite(particle.y) || 
          !isFinite(particle.radius) || particle.radius <= 0) {
        return
      }

      const safeRadius = Math.max(0.5, Math.min(4, particle.radius))
      const safeOpacity = Math.max(0, Math.min(1, particle.opacity))
      
      try {
        // Create enhanced gradient with your theme colors
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, safeRadius * 2
        )

        // Use actual hex colors instead of HSL
        const baseColor = particle.color
        
        // Convert hex to RGB for alpha manipulation
        const hex = baseColor.replace('#', '')
        const r = parseInt(hex.substr(0, 2), 16)
        const g = parseInt(hex.substr(2, 2), 16)
        const b = parseInt(hex.substr(4, 2), 16)

        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${safeOpacity})`)
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${safeOpacity * 0.6})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        // Draw particle with enhanced blend mode
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, safeRadius, 0, Math.PI * 2)
        ctx.fill()
        
        // Add subtle glow effect for viva-magenta scheme
        if (colorScheme === 'viva-magenta') {
          ctx.globalCompositeOperation = 'soft-light'
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${safeOpacity * 0.3})`
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, safeRadius * 1.5, 0, Math.PI * 2)
          ctx.fill()
        }
        
        ctx.restore()
      } catch (error) {
        console.warn('Particle rendering error:', error)
        // Fallback: draw simple circle
        ctx.save()
        ctx.fillStyle = `${particle.color}${Math.floor(safeOpacity * 255).toString(16).padStart(2, '0')}`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, safeRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    })

    // Add connecting lines for constellation effect
    if (animation === 'constellation' && particlesRef.current.length > 1) {
      ctx.save()
      ctx.globalCompositeOperation = 'soft-light'
      ctx.strokeStyle = currentColorScheme.primary + '30' // Add transparency
      ctx.lineWidth = 0.5
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
          
          if (distance < 100) {
            const opacity = (100 - distance) / 100 * 0.3
            ctx.globalAlpha = opacity
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }
      ctx.restore()
    }
  }, [animation, colorScheme, currentColorScheme])

  // Optimized animation loop
  const animate = useCallback(() => {
    updateParticles()
    render()
    animationRef.current = requestAnimationFrame(animate)
  }, [updateParticles, render])

  // Enhanced mouse movement handling
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

  // Enhanced resize handling with debouncing
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = canvas.parentElement
    if (!container) return

    const rect = container.getBoundingClientRect()
    const width = rect.width || window.innerWidth
    const height = rect.height || window.innerHeight

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    // Scale context for high DPI displays
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    dimensionsRef.current = { width, height }
    
    // Reinitialize particles with new dimensions
    initializeParticles()
  }, [initializeParticles])

  // Setup and cleanup with proper error handling
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout

    const debouncedResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResize, 100)
    }

    // Initial setup
    debouncedResize()
    
    const canvas = canvasRef.current
    if (canvas && interactive) {
      canvas.addEventListener('mousemove', handleMouseMove, { passive: true })
    }

    window.addEventListener('resize', debouncedResize, { passive: true })

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      clearTimeout(resizeTimeout)
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove)
      }
      
      window.removeEventListener('resize', debouncedResize)
    }
  }, [handleResize, handleMouseMove, animate, interactive])

  // Reinitialize when props change
  useEffect(() => {
    if (dimensionsRef.current.width > 0 && dimensionsRef.current.height > 0) {
      initializeParticles()
    }
  }, [initializeParticles, colorScheme, particleCount])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100%',
        opacity: 0.4, // Reduced opacity for better readability
        mixBlendMode: 'screen' // Enhanced blend mode for your theme
      }}
      aria-hidden="true"
    />
  )
}