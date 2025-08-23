// Enhanced ParticleField with Crisp Particles and Spider-web Connections
'use client'

import { useEffect, useRef, useCallback, useMemo, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  life: number
  maxLife: number
  color: string
  scale: number
  baseOpacity: number
  pulsePhase: number
}

interface ParticleFieldProps {
  particleCount?: number
  colorScheme?: 'cyberpunk' | 'synthwave' | 'cosmic' | 'aurora' | 'viva-magenta' | 'brand' | 'monochrome' | 'light-mode'
  animation?: 'float' | 'drift' | 'spiral' | 'chaos' | 'constellation' | 'flow' | 'orbit'
  interactive?: boolean
  speed?: number
  className?: string
}

export default function EnhancedParticleField({
  particleCount = 25,
  colorScheme = 'light-mode',
  animation = 'constellation',
  interactive = true,
  speed = 0.3,
  className = ''
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const dimensionsRef = useRef({ width: 0, height: 0 })
  
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Enhanced theme detection with your color system
  const isLightMode = useMemo(() => {
    if (typeof window === 'undefined' || !mounted) return colorScheme === 'light-mode'
    
    if (colorScheme === 'light-mode') return true
    if (colorScheme === 'aurora' || colorScheme === 'cyberpunk' || colorScheme === 'synthwave' || colorScheme === 'cosmic') return false
    
    try {
      const htmlElement = document.documentElement
      const hasExplicitDarkClass = htmlElement.classList.contains('dark')
      const hasExplicitLightClass = htmlElement.classList.contains('light')
      
      if (hasExplicitDarkClass) return false
      if (hasExplicitLightClass) return true
      
      return !window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch (error) {
      return true
    }
  }, [colorScheme, mounted])

  // Enhanced color schemes - supporting both existing and new schemes
  const colorSchemes = useMemo(() => ({
    'light-mode': {
      colors: [
        '#BE3455', // viva-magenta
        '#D4AF37', // lux-gold  
        '#98A869', // lux-sage
        '#008080', // lux-teal
        '#4A2C2A'  // lux-brown (subtle)
      ],
      primary: '#BE3455',
      secondary: '#D4AF37',
      accent: '#98A869',
      opacity: 0.7,
      connectionOpacity: 0.25,
      maxConnections: 4,
      connectionDistance: 120
    },
    cyberpunk: {
      colors: ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00'],
      primary: '#00FFFF',
      secondary: '#FF00FF',
      accent: '#FFFF00',
      opacity: 0.8,
      connectionOpacity: 0.4,
      maxConnections: 5,
      connectionDistance: 140
    },
    synthwave: {
      colors: ['#FF1493', '#8A2BE2', '#00FFFF', '#FF6347'],
      primary: '#FF1493',
      secondary: '#8A2BE2', 
      accent: '#00FFFF',
      opacity: 0.7,
      connectionOpacity: 0.35,
      maxConnections: 4,
      connectionDistance: 130
    },
    cosmic: {
      colors: ['#4B0082', '#8A2BE2', '#FFD700', '#FF69B4'],
      primary: '#4B0082',
      secondary: '#8A2BE2',
      accent: '#FFD700',
      opacity: 0.7,
      connectionOpacity: 0.3,
      maxConnections: 4,
      connectionDistance: 130
    },
    aurora: {
      colors: [
        '#FF6B8A', // Brighter viva-magenta for dark
        '#FFD700', // Brighter gold for dark
        '#B8D687', // Brighter sage for dark
        '#40E0D0', // Brighter teal for dark
        '#8B5A5A'  // Brighter brown for dark
      ],
      primary: '#FF6B8A',
      secondary: '#FFD700',
      accent: '#40E0D0',
      opacity: 0.8,
      connectionOpacity: 0.4,
      maxConnections: 5,
      connectionDistance: 140
    },
    'viva-magenta': {
      colors: ['#BE3455', '#D4AF37', '#98A869', '#008080'],
      primary: '#BE3455',
      secondary: '#D4AF37',
      accent: '#98A869',
      opacity: 0.7,
      connectionOpacity: 0.35,
      maxConnections: 4,
      connectionDistance: 130
    },
    brand: {
      colors: ['#BE3455', '#D4AF37', '#98A869'],
      primary: '#BE3455',
      secondary: '#D4AF37',
      accent: '#98A869',
      opacity: 0.7,
      connectionOpacity: 0.3,
      maxConnections: 4,
      connectionDistance: 120
    },
    monochrome: {
      colors: ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0'],
      primary: '#ffffff',
      secondary: '#f0f0f0',
      accent: '#e0e0e0',
      opacity: 0.6,
      connectionOpacity: 0.2,
      maxConnections: 3,
      connectionDistance: 100
    }
  }), [])

  const currentColorScheme = colorSchemes[colorScheme]

  // Enhanced reduced motion detection
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || !mounted) return false
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch (error) {
      return false
    }
  }, [mounted])

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined' || !mounted) return false
    return window.innerWidth < 768
  }, [mounted])

  // Enhanced color processing
  const processColor = useCallback((baseColor: string, isLightMode: boolean) => {
    if (!isLightMode) return baseColor

    // For light mode, we might want to adjust colors for better visibility
    if (colorScheme === 'light-mode') {
      const hex = baseColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)  
      const b = parseInt(hex.substr(4, 2), 16)
      
      // Slightly darken colors for light mode visibility
      const factor = 0.85
      const rAdjusted = Math.floor(r * factor)
      const gAdjusted = Math.floor(g * factor)
      const bAdjusted = Math.floor(b * factor)
      
      return `#${rAdjusted.toString(16).padStart(2, '0')}${gAdjusted.toString(16).padStart(2, '0')}${bAdjusted.toString(16).padStart(2, '0')}`
    }
    
    return baseColor
  }, [colorScheme])

  // Initialize particles with enhanced color system
  const initializeParticles = useCallback(() => {
    if (!mounted) return
    
    const { width, height } = dimensionsRef.current
    if (width === 0 || height === 0) return

    const actualCount = isMobile ? Math.min(particleCount, 15) : particleCount

    if (particlesRef.current.length === actualCount) {
      // Update existing particle colors for theme changes
      particlesRef.current.forEach(particle => {
        const colors = currentColorScheme.colors
        const selectedColor = colors[Math.floor(Math.random() * colors.length)]
        particle.color = processColor(selectedColor, isLightMode)
        particle.baseOpacity = isLightMode ? 
          Math.random() * 0.4 + 0.3 : 
          Math.random() * 0.5 + 0.4
      })
      return
    }

    particlesRef.current = Array.from({ length: actualCount }, (_, i) => {
      const colors = currentColorScheme.colors
      const baseColor = colors[Math.floor(Math.random() * colors.length)]
      const selectedColor = processColor(baseColor, isLightMode)
      
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * 0.4,
        vy: (Math.random() - 0.5) * speed * 0.4,
        radius: Math.random() * 2 + 1.5, // Slightly larger for visibility
        opacity: Math.random() * 0.5 + 0.5,
        life: 0,
        maxLife: Math.random() * 300 + 200,
        color: selectedColor,
        scale: Math.random() * 0.8 + 0.4,
        baseOpacity: isLightMode ? 
          Math.random() * 0.4 + 0.3 : 
          Math.random() * 0.5 + 0.4,
        pulsePhase: Math.random() * Math.PI * 2
      }
    })
  }, [particleCount, speed, currentColorScheme, processColor, isLightMode, isMobile, mounted])

  // Enhanced particle update logic
  const lastTime = useRef(0)
  const updateParticles = useCallback(() => {
    if (!mounted) return
    
    const { width, height } = dimensionsRef.current
    const now = performance.now()
    
    if (now - lastTime.current < 33) return // 30fps cap
    lastTime.current = now

    const time = now * 0.001 * speed * 0.5
    
    particlesRef.current.forEach((particle, i) => {
      // Update pulse phase for subtle breathing effect
      particle.pulsePhase += 0.02

      switch (animation) {
        case 'drift':
          particle.x += particle.vx * speed * 0.6
          particle.y += particle.vy * speed * 0.6
          break
          
        case 'spiral':
          if (i % 3 === 0) {
            const centerX = width / 2
            const centerY = height / 2
            const angle = particle.life * 0.01
            const distance = 40 + particle.life * 0.3
            particle.x = centerX + Math.cos(angle) * distance
            particle.y = centerY + Math.sin(angle) * distance
          }
          break
          
        case 'chaos':
          particle.vx += (Math.random() - 0.5) * 0.04
          particle.vy += (Math.random() - 0.5) * 0.04
          particle.vx = Math.max(-1.2, Math.min(1.2, particle.vx))
          particle.vy = Math.max(-1.2, Math.min(1.2, particle.vy))
          particle.x += particle.vx * speed * 0.6
          particle.y += particle.vy * speed * 0.6
          break
          
        case 'constellation':
          particle.y += particle.vy * speed * 0.15
          particle.x += Math.sin(time + i * 0.3) * 0.15
          break
          
        case 'flow':
          particle.x += Math.sin(time * 0.4 + i * 0.15) * 0.2 * speed
          particle.y += Math.cos(time * 0.3 + i * 0.1) * 0.2 * speed
          break
          
        case 'orbit':
          const radius = 0.4 + Math.sin(i * 0.15) * 0.3
          particle.x += Math.cos(time + i * 0.15) * radius * 0.3 * speed
          particle.y += Math.sin(time + i * 0.15) * radius * 0.3 * speed
          break
          
        case 'float':
        default:
          particle.y += particle.vy * speed * 0.15
          particle.x += Math.sin(particle.life * 0.015) * 0.25
          break
      }

      // Enhanced mouse interaction
      if (interactive && !isMobile) {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distanceSquared = dx * dx + dy * dy
        
        if (distanceSquared < 30000 && distanceSquared > 0) {
          const force = (30000 - distanceSquared) / 30000 * 0.004
          particle.vx += dx * force
          particle.vy += dy * force
          
          if (distanceSquared < 4000) {
            const repulsion = (4000 - distanceSquared) / 4000 * 0.008
            particle.vx -= dx * repulsion
            particle.vy -= dy * repulsion
          }
          
          particle.radius = particle.scale * (hovered ? 1.5 : 1.2)
          particle.opacity = particle.baseOpacity * (hovered ? 1.3 : 1.1)
        } else {
          particle.radius = particle.scale
          particle.opacity = particle.baseOpacity
        }
      }

      // Boundary wrapping
      const buffer = 30
      if (particle.x > width + buffer) particle.x = -buffer
      if (particle.x < -buffer) particle.x = width + buffer
      if (particle.y > height + buffer) particle.y = -buffer
      if (particle.y < -buffer) particle.y = height + buffer

      // Enhanced lifecycle
      particle.life++
      if (particle.life > particle.maxLife) {
        particle.life = 0
        particle.x = Math.random() * width
        particle.y = Math.random() * height
        particle.opacity = particle.baseOpacity
        particle.pulsePhase = Math.random() * Math.PI * 2
        
        // Refresh color for theme changes
        const colors = currentColorScheme.colors
        const newColor = colors[Math.floor(Math.random() * colors.length)]
        particle.color = processColor(newColor, isLightMode)
      }

      // Enhanced opacity lifecycle with subtle pulse
      const lifeCycle = particle.life / particle.maxLife
      const pulseMultiplier = 1 + Math.sin(particle.pulsePhase) * 0.1
      
      if (lifeCycle < 0.1) {
        particle.opacity = particle.baseOpacity * (lifeCycle / 0.1) * pulseMultiplier
      } else if (lifeCycle > 0.9) {
        particle.opacity = particle.baseOpacity * ((1 - lifeCycle) / 0.1) * pulseMultiplier
      } else {
        particle.opacity = particle.baseOpacity * pulseMultiplier
      }
      
      particle.opacity = Math.max(0, Math.min(1, particle.opacity))
    })
  }, [animation, speed, interactive, currentColorScheme, hovered, processColor, isLightMode, isMobile, mounted])

  // Helper function to parse color
  const parseColor = useCallback((colorStr: string) => {
    if (colorStr.startsWith('#')) {
      const hex = colorStr.replace('#', '')
      return {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16)
      }
    }
    // Default fallback
    return { r: 255, g: 255, b: 255 }
  }, [])

  // Enhanced rendering with crisp particles and elegant connections
  const render = useCallback(() => {
    if (!mounted) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = dimensionsRef.current

    // Clear canvas completely for crisp rendering
    ctx.clearRect(0, 0, width, height)

    // Render spider-web connections first (behind particles)
    if (particlesRef.current.length > 1) {
      ctx.save()
      
      const maxConnections = currentColorScheme.maxConnections
      const connectionDistance = currentColorScheme.connectionDistance
      const baseConnectionOpacity = currentColorScheme.connectionOpacity
      
      // Create gradient connections using multiple colors
      for (let i = 0; i < particlesRef.current.length; i++) {
        let connectionsCount = 0
        const particle1 = particlesRef.current[i]
        
        for (let j = i + 1; j < particlesRef.current.length && connectionsCount < maxConnections; j++) {
          const particle2 = particlesRef.current[j]
          const dx = particle1.x - particle2.x
          const dy = particle1.y - particle2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < connectionDistance) {
            // Calculate opacity based on distance
            const distanceOpacity = (connectionDistance - distance) / connectionDistance
            const finalOpacity = baseConnectionOpacity * distanceOpacity * Math.min(particle1.opacity, particle2.opacity)
            
            // Create gradient line between particles
            const gradient = ctx.createLinearGradient(particle1.x, particle1.y, particle2.x, particle2.y)
            
            const color1 = parseColor(particle1.color)
            const color2 = parseColor(particle2.color)
            
            gradient.addColorStop(0, `rgba(${color1.r}, ${color1.g}, ${color1.b}, ${finalOpacity})`)
            gradient.addColorStop(0.5, `rgba(${Math.floor((color1.r + color2.r) / 2)}, ${Math.floor((color1.g + color2.g) / 2)}, ${Math.floor((color1.b + color2.b) / 2)}, ${finalOpacity * 0.8})`)
            gradient.addColorStop(1, `rgba(${color2.r}, ${color2.g}, ${color2.b}, ${finalOpacity})`)
            
            ctx.strokeStyle = gradient
            ctx.lineWidth = isLightMode ? 0.8 : 1.2
            ctx.lineCap = 'round'
            
            // Add slight glow effect for connections in dark mode
            if (!isLightMode && finalOpacity > 0.2) {
              ctx.shadowColor = `rgba(${Math.floor((color1.r + color2.r) / 2)}, ${Math.floor((color1.g + color2.g) / 2)}, ${Math.floor((color1.b + color2.b) / 2)}, 0.3)`
              ctx.shadowBlur = 3
            }
            
            ctx.beginPath()
            ctx.moveTo(particle1.x, particle1.y)
            ctx.lineTo(particle2.x, particle2.y)
            ctx.stroke()
            
            // Reset shadow
            ctx.shadowBlur = 0
            
            connectionsCount++
          }
        }
      }
      ctx.restore()
    }
    
    // Render crisp particles on top
    particlesRef.current.forEach(particle => {
      if (!isFinite(particle.x) || !isFinite(particle.y) || 
          !isFinite(particle.radius) || particle.radius <= 0) {
        return
      }

      const safeRadius = Math.max(0.8, Math.min(4, particle.radius))
      const safeOpacity = Math.max(0, Math.min(1, particle.opacity * currentColorScheme.opacity))
      
      const color = parseColor(particle.color)
      
      ctx.save()
      
      // Create subtle glow for particles in dark mode
      if (!isLightMode && safeOpacity > 0.3) {
        ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`
        ctx.shadowBlur = 4
      }
      
      // Main particle circle - crisp and clean
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${safeOpacity})`
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, safeRadius, 0, Math.PI * 2)
      ctx.fill()
      
      // Add inner bright core for better definition
      const coreOpacity = Math.min(1, safeOpacity * 1.5)
      const coreRadius = safeRadius * 0.4
      ctx.fillStyle = `rgba(${Math.min(255, color.r + 40)}, ${Math.min(255, color.g + 40)}, ${Math.min(255, color.b + 40)}, ${coreOpacity})`
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, coreRadius, 0, Math.PI * 2)
      ctx.fill()
      
      // Add outer ring for particles under mouse interaction
      if (interactive && !isMobile && hovered) {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          const ringOpacity = (100 - distance) / 100 * 0.3
          ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${ringOpacity})`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, safeRadius * 1.8, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
      
      ctx.restore()
    })
  }, [isLightMode, currentColorScheme, interactive, isMobile, hovered, parseColor, mounted])

  const animate = useCallback(() => {
    if (prefersReducedMotion || !mounted) return
    
    updateParticles()
    render()
    animationRef.current = requestAnimationFrame(animate)
  }, [updateParticles, render, prefersReducedMotion, mounted])

  // Enhanced mouse interaction
  const lastMouseUpdate = useRef(0)
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!interactive || isMobile || !mounted) return
    
    const now = performance.now()
    if (now - lastMouseUpdate.current < 40) return
    lastMouseUpdate.current = now
    
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }, [interactive, isMobile, mounted])

  const handleMouseEnter = useCallback(() => {
    if (interactive && !isMobile && mounted) setHovered(true)
  }, [interactive, isMobile, mounted])

  const handleMouseLeave = useCallback(() => {
    if (interactive && !isMobile && mounted) setHovered(false)
  }, [interactive, isMobile, mounted])

  // Enhanced resize handling
  const resizeTimeout = useRef<NodeJS.Timeout>()
  const handleResize = useCallback(() => {
    if (!mounted) return
    
    clearTimeout(resizeTimeout.current)
    resizeTimeout.current = setTimeout(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const container = canvas.parentElement
      if (!container) return

      const rect = container.getBoundingClientRect()
      const width = rect.width || (typeof window !== 'undefined' ? window.innerWidth : 0)
      const height = rect.height || (typeof window !== 'undefined' ? window.innerHeight : 0)

      const dpr = Math.min((typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
      }

      dimensionsRef.current = { width, height }
      initializeParticles()
    }, 100)
  }, [initializeParticles, mounted])

  // Setup effect
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    handleResize()
    
    const canvas = canvasRef.current
    if (canvas && interactive && !isMobile) {
      canvas.addEventListener('mousemove', handleMouseMove, { passive: true })
      canvas.addEventListener('mouseenter', handleMouseEnter, { passive: true })
      canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize, { passive: true })
    }
    
    if (!prefersReducedMotion) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      clearTimeout(resizeTimeout.current)
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseenter', handleMouseEnter)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
      
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [handleResize, handleMouseMove, handleMouseEnter, handleMouseLeave, animate, interactive, isMobile, prefersReducedMotion, mounted])

  // Update colors when theme changes
  useEffect(() => {
    if (mounted && particlesRef.current.length > 0) {
      initializeParticles() // Reinitialize with new colors
    }
  }, [currentColorScheme, mounted, initializeParticles])

  // Don't render during SSR or if reduced motion
  if (!mounted || prefersReducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-${interactive && !isMobile ? 'auto' : 'none'} absolute inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100%',
        opacity: isMobile ? 0.5 : (isLightMode ? 0.8 : 0.9),
        transition: 'opacity 0.3s ease'
      }}
      aria-hidden="true"
    />
  )
}