// Enhanced components/3D/ParticleField.tsx - Merged features from both versions
'use client'

import { useEffect, useRef, useCallback, useMemo, useState } from 'react'

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
  scale: number
  baseOpacity: number
}

interface ParticleFieldProps {
  particleCount?: number
  colorScheme?: 'cyberpunk' | 'synthwave' | 'cosmic' | 'aurora' | 'viva-magenta' | 'brand' | 'monochrome'
  animation?: 'float' | 'drift' | 'spiral' | 'chaos' | 'constellation' | 'flow' | 'orbit'
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
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Enhanced color schemes combining both versions
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
      colors: ['#BE3455', '#D4AF37', '#98A869', '#008080'], // From first file
      primary: '#BE3455',
      secondary: '#D4AF37',
      accent: '#98A869'
    },
    'viva-magenta': {
      colors: ['#BE3455', '#D4AF37', '#98A869', '#008080'],
      primary: '#BE3455',    // Your viva-magenta
      secondary: '#D4AF37',  // Your lux-gold
      accent: '#98A869'      // Your lux-sage
    },
    brand: {
      colors: ['#BE3455', '#D4AF37', '#98A869'],
      primary: '#BE3455',
      secondary: '#D4AF37',
      accent: '#98A869'
    },
    monochrome: {
      colors: ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0'],
      primary: '#ffffff',
      secondary: '#f0f0f0',
      accent: '#e0e0e0'
    }
  }), [])

  const currentColorScheme = colorSchemes[colorScheme]

  // Enhanced particle initialization with aurora effects from first file
  const initializeParticles = useCallback(() => {
    const { width, height } = dimensionsRef.current
    if (width === 0 || height === 0) return

    particlesRef.current = Array.from({ length: particleCount }, (_, i) => {
      const colors = currentColorScheme.colors
      let selectedColor = colors[Math.floor(Math.random() * colors.length)]
      
      // Add aurora color variation (from first file)
      if (colorScheme === 'aurora' || colorScheme === 'viva-magenta') {
        // Create slight color variations for aurora effect
        const hex = selectedColor.replace('#', '')
        const r = parseInt(hex.substr(0, 2), 16)
        const g = parseInt(hex.substr(2, 2), 16)
        const b = parseInt(hex.substr(4, 2), 16)
        
        // Add subtle HSL shifts
        const variation = 0.1
        const hueShift = (Math.random() - 0.5) * variation
        const satShift = (Math.random() - 0.5) * 0.2
        const lightShift = (Math.random() - 0.5) * variation
        
        // Convert back to hex (simplified)
        const rVaried = Math.max(0, Math.min(255, r + (Math.random() - 0.5) * 20))
        const gVaried = Math.max(0, Math.min(255, g + (Math.random() - 0.5) * 20))
        const bVaried = Math.max(0, Math.min(255, b + (Math.random() - 0.5) * 20))
        
        selectedColor = `rgb(${Math.floor(rVaried)}, ${Math.floor(gVaried)}, ${Math.floor(bVaried)})`
      }
      
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * 0.5,
        vy: (Math.random() - 0.5) * speed * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        hue: 0,
        life: 0,
        maxLife: Math.random() * 300 + 200,
        color: selectedColor,
        scale: Math.random() * 0.8 + 0.2, // From first file
        baseOpacity: Math.random() * 0.6 + 0.2
      }
    })
  }, [particleCount, speed, currentColorScheme, colorScheme])

  // Enhanced particle updates with additional animation modes from first file
  const updateParticles = useCallback(() => {
    const { width, height } = dimensionsRef.current
    const time = Date.now() * 0.001 * speed // Global time for consistent animations
    
    particlesRef.current.forEach((particle, i) => {
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
          particle.vx = Math.max(-2, Math.min(2, particle.vx))
          particle.vy = Math.max(-2, Math.min(2, particle.vy))
          particle.x += particle.vx * speed
          particle.y += particle.vy * speed
          break
          
        case 'constellation':
          // Enhanced constellation movement from first file
          particle.y += particle.vy * speed * 0.1
          particle.x += Math.sin(time + i * 0.1) * 0.2
          particle.vy += Math.sin(time + i * 0.005) * 0.005
          
          // Add gentle floating motion
          particle.x += Math.sin(time + i * 0.1) * 0.001
          particle.y += Math.cos(time + i * 0.1) * 0.001
          break
          
        case 'flow':
          // Flowing motion like aurora (from first file)
          particle.x += Math.sin(time * 0.5 + i * 0.1) * 0.002 * speed
          particle.y += Math.cos(time * 0.3 + i * 0.05) * 0.002 * speed
          // Add z-like depth movement effect
          particle.radius = particle.scale + Math.sin(time * 0.2 + i * 0.02) * 0.5
          break
          
        case 'orbit':
          // Orbital motion (from first file)
          const radius = 0.5 + Math.sin(i * 0.1) * 0.3
          particle.x += Math.cos(time + i * 0.1) * radius * 0.001 * speed
          particle.y += Math.sin(time + i * 0.1) * radius * 0.001 * speed
          break
          
        case 'float':
        default:
          particle.y += particle.vy * speed * 0.2
          particle.x += Math.sin(particle.life * 0.008) * 0.3
          break
      }

      // Enhanced interactive mode with smoother mouse influence
      if (interactive) {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 150 && distance > 0) {
          const force = (150 - distance) / 150 * 0.005
          particle.vx += dx * force
          particle.vy += dy * force
          
          // Enhanced repulsion when very close
          if (distance < 50) {
            const repulsion = (50 - distance) / 50 * 0.01
            particle.vx -= dx * repulsion
            particle.vy -= dy * repulsion
          }
          
          // Scale effect when hovered (from first file concept)
          particle.radius = particle.scale * (hovered ? 1.5 : 1.0)
        }
      }

      // Enhanced boundary wrapping (from first file)
      const buffer = 20
      if (particle.x > width + buffer) particle.x = -buffer
      if (particle.x < -buffer) particle.x = width + buffer
      if (particle.y > height + buffer) particle.y = -buffer
      if (particle.y < -buffer) particle.y = height + buffer

      // Enhanced life cycle management
      particle.life++
      if (particle.life > particle.maxLife) {
        particle.life = 0
        particle.x = Math.random() * width
        particle.y = Math.random() * height
        particle.opacity = particle.baseOpacity
        // Reassign color with aurora variations
        const colors = currentColorScheme.colors
        particle.color = colors[Math.floor(Math.random() * colors.length)]
      }

      // Enhanced fade in/out with smoother transitions
      const lifeCycle = particle.life / particle.maxLife
      if (lifeCycle < 0.1) {
        particle.opacity = particle.baseOpacity * (lifeCycle / 0.1)
      } else if (lifeCycle > 0.9) {
        particle.opacity = particle.baseOpacity * ((1 - lifeCycle) / 0.1)
      } else {
        particle.opacity = particle.baseOpacity
      }
      
      particle.opacity = Math.max(0, Math.min(1, particle.opacity))
    })
  }, [animation, speed, interactive, currentColorScheme, hovered])

  // Enhanced rendering with better effects and blend modes
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = dimensionsRef.current

    // Clear canvas with enhanced trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
    ctx.fillRect(0, 0, width, height)

    // Render particles with enhanced effects
    particlesRef.current.forEach(particle => {
      if (!isFinite(particle.x) || !isFinite(particle.y) || 
          !isFinite(particle.radius) || particle.radius <= 0) {
        return
      }

      const safeRadius = Math.max(0.5, Math.min(4, particle.radius))
      const safeOpacity = Math.max(0, Math.min(1, particle.opacity))
      
      try {
        // Enhanced gradient with better color handling
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, safeRadius * 2
        )

        let r, g, b
        if (particle.color.startsWith('rgb')) {
          // Parse RGB format
          const match = particle.color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
          if (match) {
            r = parseInt(match[1])
            g = parseInt(match[2])
            b = parseInt(match[3])
          } else {
            r = g = b = 255 // fallback
          }
        } else {
          // Parse hex format
          const hex = particle.color.replace('#', '')
          r = parseInt(hex.substr(0, 2), 16)
          g = parseInt(hex.substr(2, 2), 16)
          b = parseInt(hex.substr(4, 2), 16)
        }

        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${safeOpacity})`)
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${safeOpacity * 0.6})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        // Enhanced rendering with blend modes
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, safeRadius, 0, Math.PI * 2)
        ctx.fill()
        
        // Enhanced glow effect for aurora/viva-magenta schemes
        if (colorScheme === 'viva-magenta' || colorScheme === 'aurora') {
          ctx.globalCompositeOperation = 'soft-light'
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${safeOpacity * 0.3})`
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, safeRadius * 1.5, 0, Math.PI * 2)
          ctx.fill()
        }
        
        ctx.restore()
      } catch (error) {
        console.warn('Particle rendering error:', error)
        // Enhanced fallback rendering
        ctx.save()
        ctx.fillStyle = `${particle.color}${Math.floor(safeOpacity * 255).toString(16).padStart(2, '0')}`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, safeRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    })

    // Enhanced connecting lines for constellation effect
    if (animation === 'constellation' && particlesRef.current.length > 1) {
      ctx.save()
      ctx.globalCompositeOperation = 'soft-light'
      ctx.strokeStyle = currentColorScheme.primary + '30'
      ctx.lineWidth = 0.5
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < Math.min(i + 5, particlesRef.current.length); j++) { // Limit connections for performance
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

  // Enhanced mouse movement handling with hover detection
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

  // Mouse enter/leave handlers for hover effects
  const handleMouseEnter = useCallback(() => {
    if (interactive) setHovered(true)
  }, [interactive])

  const handleMouseLeave = useCallback(() => {
    if (interactive) setHovered(false)
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

  // Enhanced setup and cleanup
  useEffect(() => {
    setMounted(true)
    
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
      canvas.addEventListener('mouseenter', handleMouseEnter, { passive: true })
      canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true })
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
        canvas.removeEventListener('mouseenter', handleMouseEnter)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
      
      window.removeEventListener('resize', debouncedResize)
    }
  }, [handleResize, handleMouseMove, handleMouseEnter, handleMouseLeave, animate, interactive])

  // Reinitialize when props change
  useEffect(() => {
    if (dimensionsRef.current.width > 0 && dimensionsRef.current.height > 0) {
      initializeParticles()
    }
  }, [initializeParticles, colorScheme, particleCount])

  // Don't render until mounted (from first file)
  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-${interactive ? 'auto' : 'none'} absolute inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100%',
        opacity: 0.4,
        mixBlendMode: 'screen'
      }}
      aria-hidden="true"
    />
  )
}

// Enhanced theme-aware particle field hook (from first file)
export function useParticleField(theme: 'light' | 'dark' = 'light') {
  return useMemo(() => ({
    particleCount: typeof window !== 'undefined' && window.innerWidth < 768 ? 25 : 60,
    colorScheme: 'aurora' as const,
    animation: 'constellation' as const,
    interactive: true,
    speed: 0.4
  }), [])
}