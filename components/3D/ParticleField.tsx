// Enhanced ParticleField.tsx - Perfect Light/Dark Mode Integration with All Color Schemes
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
  colorScheme?: 'cyberpunk' | 'synthwave' | 'cosmic' | 'aurora' | 'viva-magenta' | 'brand' | 'monochrome' | 'light-mode'
  animation?: 'float' | 'drift' | 'spiral' | 'chaos' | 'constellation' | 'flow' | 'orbit'
  interactive?: boolean
  speed?: number
  className?: string
}

export default function ParticleField({
  particleCount = 50,
  colorScheme = 'light-mode',
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

  // ✅ ENHANCED: Color schemes with perfect light/dark mode support
  const colorSchemes = useMemo(() => ({
    'light-mode': {
      colors: ['#BE3455', '#D4AF37', '#98A869', '#008080'], // Your brand colors
      primary: '#BE3455',
      secondary: '#D4AF37',
      accent: '#98A869',
      opacity: 0.4, // Optimized for light backgrounds
      mixBlendMode: 'multiply' as const, // Better for light backgrounds
      glowIntensity: 0.3
    },
    cyberpunk: {
      colors: ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00'],
      primary: '#00FFFF',
      secondary: '#FF00FF',
      accent: '#FFFF00',
      opacity: 0.7,
      mixBlendMode: 'screen' as const,
      glowIntensity: 0.8
    },
    synthwave: {
      colors: ['#FF1493', '#8A2BE2', '#00FFFF', '#FF6347'],
      primary: '#FF1493',
      secondary: '#8A2BE2', 
      accent: '#00FFFF',
      opacity: 0.6,
      mixBlendMode: 'screen' as const,
      glowIntensity: 0.7
    },
    cosmic: {
      colors: ['#4B0082', '#8A2BE2', '#FFD700', '#FF69B4'],
      primary: '#4B0082',
      secondary: '#8A2BE2',
      accent: '#FFD700',
      opacity: 0.6,
      mixBlendMode: 'screen' as const,
      glowIntensity: 0.6
    },
    aurora: {
      colors: ['#BE3455', '#D4AF37', '#98A869', '#008080'],
      primary: '#BE3455',
      secondary: '#D4AF37',
      accent: '#98A869',
      opacity: 0.6,
      mixBlendMode: 'screen' as const,
      glowIntensity: 0.7
    },
    'viva-magenta': {
      colors: ['#BE3455', '#D4AF37', '#98A869', '#008080'],
      primary: '#BE3455',
      secondary: '#D4AF37',
      accent: '#98A869',
      opacity: 0.6,
      mixBlendMode: 'screen' as const,
      glowIntensity: 0.8
    },
    brand: {
      colors: ['#BE3455', '#D4AF37', '#98A869'],
      primary: '#BE3455',
      secondary: '#D4AF37',
      accent: '#98A869',
      opacity: 0.6,
      mixBlendMode: 'screen' as const,
      glowIntensity: 0.6
    },
    monochrome: {
      colors: ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0'],
      primary: '#ffffff',
      secondary: '#f0f0f0',
      accent: '#e0e0e0',
      opacity: 0.5,
      mixBlendMode: 'screen' as const,
      glowIntensity: 0.4
    }
  }), [])

  const currentColorScheme = colorSchemes[colorScheme]

  // ✅ ENHANCED: Color processing for better visibility
  const processColor = useCallback((baseColor: string, isLightMode: boolean) => {
    if (!isLightMode) return baseColor

    // For light mode, ensure colors have enough contrast
    const hex = baseColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    // Darken colors for better visibility on light backgrounds
    const factor = 0.7 // Darken by 30%
    const rAdjusted = Math.floor(r * factor)
    const gAdjusted = Math.floor(g * factor)
    const bAdjusted = Math.floor(b * factor)
    
    return `rgb(${rAdjusted}, ${gAdjusted}, ${bAdjusted})`
  }, [])

  // ✅ ENHANCED: Detect theme mode
  const isLightMode = useMemo(() => {
    if (typeof window === 'undefined') return colorScheme === 'light-mode'
    
    const htmlElement = document.documentElement
    const hasExplicitDarkClass = htmlElement.classList.contains('dark')
    const hasExplicitLightClass = htmlElement.classList.contains('light')
    
    if (hasExplicitDarkClass) return false
    if (hasExplicitLightClass) return true
    
    // Fallback to color scheme preference
    return colorScheme === 'light-mode'
  }, [colorScheme])

  // ✅ ENHANCED: Particle initialization with theme-aware colors
  const initializeParticles = useCallback(() => {
    const { width, height } = dimensionsRef.current
    if (width === 0 || height === 0) return

    particlesRef.current = Array.from({ length: particleCount }, (_, i) => {
      const colors = currentColorScheme.colors
      let selectedColor = colors[Math.floor(Math.random() * colors.length)]
      
      // Process color for current theme
      selectedColor = processColor(selectedColor, isLightMode)
      
      // Add subtle color variation
      if (selectedColor.startsWith('rgb')) {
        const match = selectedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (match) {
          const r = parseInt(match[1])
          const g = parseInt(match[2])
          const b = parseInt(match[3])
          
          // Add small random variations
          const rVaried = Math.max(0, Math.min(255, r + (Math.random() - 0.5) * 30))
          const gVaried = Math.max(0, Math.min(255, g + (Math.random() - 0.5) * 30))
          const bVaried = Math.max(0, Math.min(255, b + (Math.random() - 0.5) * 30))
          
          selectedColor = `rgb(${Math.floor(rVaried)}, ${Math.floor(gVaried)}, ${Math.floor(bVaried)})`
        }
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
        scale: Math.random() * 0.8 + 0.2,
        baseOpacity: isLightMode ? Math.random() * 0.3 + 0.1 : Math.random() * 0.4 + 0.1
      }
    })
  }, [particleCount, speed, currentColorScheme, processColor, isLightMode])

  // ✅ ENHANCED: Particle updates with improved animations
  const updateParticles = useCallback(() => {
    const { width, height } = dimensionsRef.current
    const time = Date.now() * 0.001 * speed
    
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
          particle.y += particle.vy * speed * 0.1
          particle.x += Math.sin(time + i * 0.1) * 0.2
          particle.vy += Math.sin(time + i * 0.005) * 0.005
          particle.x += Math.sin(time + i * 0.1) * 0.001
          particle.y += Math.cos(time + i * 0.1) * 0.001
          break
          
        case 'flow':
          particle.x += Math.sin(time * 0.5 + i * 0.1) * 0.002 * speed
          particle.y += Math.cos(time * 0.3 + i * 0.05) * 0.002 * speed
          particle.radius = particle.scale + Math.sin(time * 0.2 + i * 0.02) * 0.5
          break
          
        case 'orbit':
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

      // ✅ ENHANCED: Interactive mode with better responsiveness
      if (interactive) {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 150 && distance > 0) {
          const force = (150 - distance) / 150 * 0.005
          particle.vx += dx * force
          particle.vy += dy * force
          
          if (distance < 50) {
            const repulsion = (50 - distance) / 50 * 0.01
            particle.vx -= dx * repulsion
            particle.vy -= dy * repulsion
          }
          
          particle.radius = particle.scale * (hovered ? 1.5 : 1.0)
          particle.opacity = particle.baseOpacity * (hovered ? 1.3 : 1.0)
        }
      }

      // Boundary wrapping
      const buffer = 20
      if (particle.x > width + buffer) particle.x = -buffer
      if (particle.x < -buffer) particle.x = width + buffer
      if (particle.y > height + buffer) particle.y = -buffer
      if (particle.y < -buffer) particle.y = height + buffer

      // Life cycle management
      particle.life++
      if (particle.life > particle.maxLife) {
        particle.life = 0
        particle.x = Math.random() * width
        particle.y = Math.random() * height
        particle.opacity = particle.baseOpacity
        const colors = currentColorScheme.colors
        const newColor = colors[Math.floor(Math.random() * colors.length)]
        particle.color = processColor(newColor, isLightMode)
      }

      // Enhanced fade in/out
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
  }, [animation, speed, interactive, currentColorScheme, hovered, processColor, isLightMode])

  // ✅ ENHANCED: Rendering with perfect theme support
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = dimensionsRef.current

    // ✅ ENHANCED: Theme-aware background clearing
    if (isLightMode) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)' // Subtle trail for light mode
    } else {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)' // Dark mode trail
    }
    ctx.fillRect(0, 0, width, height)

    // ✅ ENHANCED: Render particles with theme-optimized effects
    particlesRef.current.forEach(particle => {
      if (!isFinite(particle.x) || !isFinite(particle.y) || 
          !isFinite(particle.radius) || particle.radius <= 0) {
        return
      }

      const safeRadius = Math.max(0.5, Math.min(4, particle.radius))
      const safeOpacity = Math.max(0, Math.min(1, particle.opacity * currentColorScheme.opacity))
      
      try {
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, safeRadius * 2
        )

        let r, g, b
        if (particle.color.startsWith('rgb')) {
          const match = particle.color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
          if (match) {
            r = parseInt(match[1])
            g = parseInt(match[2])
            b = parseInt(match[3])
          } else {
            r = g = b = isLightMode ? 0 : 255
          }
        } else {
          const hex = particle.color.replace('#', '')
          r = parseInt(hex.substr(0, 2), 16)
          g = parseInt(hex.substr(2, 2), 16)
          b = parseInt(hex.substr(4, 2), 16)
        }

        // ✅ ENHANCED: Theme-aware gradient creation
        const glowMultiplier = currentColorScheme.glowIntensity
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${safeOpacity})`)
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${safeOpacity * 0.6 * glowMultiplier})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.save()
        
        // ✅ ENHANCED: Theme-appropriate blend mode
        ctx.globalCompositeOperation = currentColorScheme.mixBlendMode
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, safeRadius, 0, Math.PI * 2)
        ctx.fill()
        
        // ✅ ENHANCED: Add glow effect for enhanced visibility
        if (currentColorScheme.glowIntensity > 0.5) {
          ctx.shadowBlur = safeRadius * 2
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${safeOpacity * 0.3})`
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, safeRadius * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        }
        
        ctx.restore()
      } catch (error) {
        console.warn('Particle rendering error:', error)
        // Fallback rendering
        ctx.save()
        ctx.fillStyle = `${particle.color}${Math.floor(safeOpacity * 255).toString(16).padStart(2, '0')}`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, safeRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    })

    // ✅ ENHANCED: Constellation connecting lines with theme awareness
    if (animation === 'constellation' && particlesRef.current.length > 1) {
      ctx.save()
      
      const lineOpacity = isLightMode ? 0.15 : 0.25
      const maxConnections = Math.min(5, particlesRef.current.length - 1)
      
      ctx.globalCompositeOperation = isLightMode ? 'multiply' : 'soft-light'
      ctx.strokeStyle = currentColorScheme.primary + Math.floor(lineOpacity * 255).toString(16).padStart(2, '0')
      ctx.lineWidth = 0.5
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        let connectionsCount = 0
        for (let j = i + 1; j < particlesRef.current.length && connectionsCount < maxConnections; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
          
          if (distance < 100) {
            const opacity = (100 - distance) / 100 * lineOpacity
            ctx.globalAlpha = opacity
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
            connectionsCount++
          }
        }
      }
      ctx.restore()
    }
  }, [animation, isLightMode, currentColorScheme])

  // Animation loop
  const animate = useCallback(() => {
    updateParticles()
    render()
    animationRef.current = requestAnimationFrame(animate)
  }, [updateParticles, render])

  // ✅ ENHANCED: Mouse interaction with better performance
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

  const handleMouseEnter = useCallback(() => {
    if (interactive) setHovered(true)
  }, [interactive])

  const handleMouseLeave = useCallback(() => {
    if (interactive) setHovered(false)
  }, [interactive])

  // ✅ ENHANCED: Resize handling with theme awareness
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = canvas.parentElement
    if (!container) return

    const rect = container.getBoundingClientRect()
    const width = rect.width || window.innerWidth
    const height = rect.height || window.innerHeight

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    dimensionsRef.current = { width, height }
    initializeParticles()
  }, [initializeParticles])

  // ✅ ENHANCED: Setup and cleanup with better performance
  useEffect(() => {
    setMounted(true)
    
    let resizeTimeout: NodeJS.Timeout

    const debouncedResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResize, 100)
    }

    debouncedResize()
    
    const canvas = canvasRef.current
    if (canvas && interactive) {
      canvas.addEventListener('mousemove', handleMouseMove, { passive: true })
      canvas.addEventListener('mouseenter', handleMouseEnter, { passive: true })
      canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    }

    window.addEventListener('resize', debouncedResize, { passive: true })
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

  // ✅ ENHANCED: Reinitialize particles when theme or settings change
  useEffect(() => {
    if (dimensionsRef.current.width > 0 && dimensionsRef.current.height > 0) {
      initializeParticles()
    }
  }, [initializeParticles, colorScheme, particleCount, isLightMode])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-${interactive ? 'auto' : 'none'} absolute inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100%',
        opacity: isLightMode ? 0.7 : 0.6, // Better visibility balance
        mixBlendMode: currentColorScheme.mixBlendMode
      }}
      aria-hidden="true"
    />
  )
}

// ✅ ENHANCED: Theme-aware particle field hook with auto-detection
export function useParticleField(theme?: 'light' | 'dark') {
  const detectedTheme = useMemo(() => {
    if (theme) return theme
    
    if (typeof window === 'undefined') return 'light'
    
    const htmlElement = document.documentElement
    const hasExplicitDarkClass = htmlElement.classList.contains('dark')
    const hasExplicitLightClass = htmlElement.classList.contains('light')
    
    if (hasExplicitDarkClass) return 'dark'
    if (hasExplicitLightClass) return 'light'
    
    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }, [theme])

  return useMemo(() => ({
    particleCount: typeof window !== 'undefined' && window.innerWidth < 768 ? 25 : 60,
    colorScheme: detectedTheme === 'light' ? 'light-mode' as const : 'aurora' as const,
    animation: 'constellation' as const,
    interactive: true,
    speed: 0.4
  }), [detectedTheme])
}

// ✅ ENHANCED: Utility function for theme-aware particle configuration
export function getParticleConfig(theme: 'light' | 'dark', colorScheme?: string) {
  const baseConfig = {
    particleCount: 50,
    interactive: true,
    speed: 0.4,
    animation: 'constellation' as const
  }

  if (colorScheme) {
    return {
      ...baseConfig,
      colorScheme: colorScheme as any
    }
  }

  return {
    ...baseConfig,
    colorScheme: theme === 'light' ? 'light-mode' as const : 'aurora' as const
  }
}