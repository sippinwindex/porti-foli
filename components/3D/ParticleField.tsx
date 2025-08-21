// SSR Safe Enhanced ParticleField.tsx - Perfect Light/Dark Mode + Major Performance Improvements
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
  
  // ✅ SSR SAFETY: Add mounted state
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState(false)

  // ✅ SSR SAFE: Detect reduced motion and mobile with mounted check
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

  // Color schemes remain the same...
  const colorSchemes = useMemo(() => ({
    'light-mode': {
      colors: ['#BE3455', '#D4AF37', '#98A869', '#008080'],
      primary: '#BE3455',
      secondary: '#D4AF37',
      accent: '#98A869',
      opacity: 0.4,
      mixBlendMode: 'multiply' as const,
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

  const processColor = useCallback((baseColor: string, isLightMode: boolean) => {
    if (!isLightMode) return baseColor

    const hex = baseColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    const factor = 0.7
    const rAdjusted = Math.floor(r * factor)
    const gAdjusted = Math.floor(g * factor)
    const bAdjusted = Math.floor(b * factor)
    
    return `rgb(${rAdjusted}, ${gAdjusted}, ${bAdjusted})`
  }, [])

  // ✅ SSR SAFE: Theme detection with mounted check
  const isLightMode = useMemo(() => {
    if (typeof window === 'undefined' || !mounted) return colorScheme === 'light-mode'
    
    try {
      const htmlElement = document.documentElement
      const hasExplicitDarkClass = htmlElement.classList.contains('dark')
      const hasExplicitLightClass = htmlElement.classList.contains('light')
      
      if (hasExplicitDarkClass) return false
      if (hasExplicitLightClass) return true
      
      return colorScheme === 'light-mode'
    } catch (error) {
      return colorScheme === 'light-mode'
    }
  }, [colorScheme, mounted])

  // Initialize particles safely
  const initializeParticles = useCallback(() => {
    if (!mounted) return
    
    const { width, height } = dimensionsRef.current
    if (width === 0 || height === 0) return

    const actualCount = isMobile ? Math.min(particleCount, 15) : particleCount

    if (particlesRef.current.length === actualCount) {
      particlesRef.current.forEach(particle => {
        const colors = currentColorScheme.colors
        let selectedColor = colors[Math.floor(Math.random() * colors.length)]
        particle.color = processColor(selectedColor, isLightMode)
      })
      return
    }

    particlesRef.current = Array.from({ length: actualCount }, (_, i) => {
      const colors = currentColorScheme.colors
      let selectedColor = colors[Math.floor(Math.random() * colors.length)]
      selectedColor = processColor(selectedColor, isLightMode)
      
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * 0.3,
        vy: (Math.random() - 0.5) * speed * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.2,
        hue: 0,
        life: 0,
        maxLife: Math.random() * 200 + 100,
        color: selectedColor,
        scale: Math.random() * 0.8 + 0.2,
        baseOpacity: isLightMode ? Math.random() * 0.3 + 0.1 : Math.random() * 0.4 + 0.1
      }
    })
  }, [particleCount, speed, currentColorScheme, processColor, isLightMode, isMobile, mounted])

  const lastTime = useRef(0)
  const updateParticles = useCallback(() => {
    if (!mounted) return
    
    const { width, height } = dimensionsRef.current
    const now = performance.now()
    
    if (now - lastTime.current < 33) return
    lastTime.current = now

    const time = now * 0.001 * speed * 0.5
    
    particlesRef.current.forEach((particle, i) => {
      switch (animation) {
        case 'drift':
          particle.x += particle.vx * speed * 0.5
          particle.y += particle.vy * speed * 0.5
          break
          
        case 'spiral':
          if (i % 3 === 0) {
            const centerX = width / 2
            const centerY = height / 2
            const angle = particle.life * 0.01
            const distance = 30 + particle.life * 0.2
            particle.x = centerX + Math.cos(angle) * distance
            particle.y = centerY + Math.sin(angle) * distance
          }
          break
          
        case 'chaos':
          particle.vx += (Math.random() - 0.5) * 0.03
          particle.vy += (Math.random() - 0.5) * 0.03
          particle.vx = Math.max(-1, Math.min(1, particle.vx))
          particle.vy = Math.max(-1, Math.min(1, particle.vy))
          particle.x += particle.vx * speed * 0.5
          particle.y += particle.vy * speed * 0.5
          break
          
        case 'constellation':
          particle.y += particle.vy * speed * 0.1
          particle.x += Math.sin(time + i * 0.2) * 0.1
          break
          
        case 'flow':
          particle.x += Math.sin(time * 0.3 + i * 0.1) * 0.001 * speed
          particle.y += Math.cos(time * 0.2 + i * 0.05) * 0.001 * speed
          break
          
        case 'orbit':
          const radius = 0.3 + Math.sin(i * 0.1) * 0.2
          particle.x += Math.cos(time + i * 0.1) * radius * 0.0005 * speed
          particle.y += Math.sin(time + i * 0.1) * radius * 0.0005 * speed
          break
          
        case 'float':
        default:
          particle.y += particle.vy * speed * 0.1
          particle.x += Math.sin(particle.life * 0.01) * 0.2
          break
      }

      if (interactive && !isMobile) {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distanceSquared = dx * dx + dy * dy
        
        if (distanceSquared < 22500 && distanceSquared > 0) {
          const force = (22500 - distanceSquared) / 22500 * 0.003
          particle.vx += dx * force
          particle.vy += dy * force
          
          if (distanceSquared < 2500) {
            const repulsion = (2500 - distanceSquared) / 2500 * 0.005
            particle.vx -= dx * repulsion
            particle.vy -= dy * repulsion
          }
          
          particle.radius = particle.scale * (hovered ? 1.3 : 1.0)
          particle.opacity = particle.baseOpacity * (hovered ? 1.2 : 1.0)
        }
      }

      const buffer = 20
      if (particle.x > width + buffer) particle.x = -buffer
      if (particle.x < -buffer) particle.x = width + buffer
      if (particle.y > height + buffer) particle.y = -buffer
      if (particle.y < -buffer) particle.y = height + buffer

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
  }, [animation, speed, interactive, currentColorScheme, hovered, processColor, isLightMode, isMobile, mounted])

  const render = useCallback(() => {
    if (!mounted) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = dimensionsRef.current

    if (isLightMode) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
    } else {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
    }
    ctx.fillRect(0, 0, width, height)

    ctx.globalCompositeOperation = currentColorScheme.mixBlendMode
    
    particlesRef.current.forEach(particle => {
      if (!isFinite(particle.x) || !isFinite(particle.y) || 
          !isFinite(particle.radius) || particle.radius <= 0) {
        return
      }

      const safeRadius = Math.max(0.5, Math.min(3, particle.radius))
      const safeOpacity = Math.max(0, Math.min(1, particle.opacity * currentColorScheme.opacity))
      
      try {
        if (isMobile || currentColorScheme.glowIntensity < 0.5) {
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

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${safeOpacity})`
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, safeRadius, 0, Math.PI * 2)
          ctx.fill()
        } else {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, safeRadius * 1.5
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

          const glowMultiplier = currentColorScheme.glowIntensity * 0.7
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${safeOpacity})`)
          gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${safeOpacity * 0.4 * glowMultiplier})`)
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, safeRadius, 0, Math.PI * 2)
          ctx.fill()
        }
      } catch (error) {
        const alpha = Math.floor(safeOpacity * 255).toString(16).padStart(2, '0')
        ctx.fillStyle = `${particle.color}${alpha}`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, safeRadius, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    if (animation === 'constellation' && !isMobile && particlesRef.current.length < 30) {
      ctx.save()
      
      const lineOpacity = isLightMode ? 0.1 : 0.2
      const maxConnections = 3
      
      ctx.globalCompositeOperation = isLightMode ? 'multiply' : 'soft-light'
      ctx.strokeStyle = currentColorScheme.primary + Math.floor(lineOpacity * 255).toString(16).padStart(2, '0')
      ctx.lineWidth = 0.5
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        let connectionsCount = 0
        for (let j = i + 1; j < particlesRef.current.length && connectionsCount < maxConnections; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 70) {
            const opacity = (70 - distance) / 70 * lineOpacity
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
  }, [animation, isLightMode, currentColorScheme, isMobile, mounted])

  const animate = useCallback(() => {
    if (prefersReducedMotion || !mounted) return
    
    updateParticles()
    render()
    animationRef.current = requestAnimationFrame(animate)
  }, [updateParticles, render, prefersReducedMotion, mounted])

  const lastMouseUpdate = useRef(0)
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!interactive || isMobile || !mounted) return
    
    const now = performance.now()
    if (now - lastMouseUpdate.current < 50) return
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
      }

      dimensionsRef.current = { width, height }
      initializeParticles()
    }, 100)
  }, [initializeParticles, mounted])

  // ✅ SSR SAFE: Setup with mounted check
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

  useEffect(() => {
    if (mounted && particlesRef.current.length > 0) {
      particlesRef.current.forEach(particle => {
        const colors = currentColorScheme.colors
        const newColor = colors[Math.floor(Math.random() * colors.length)]
        particle.color = processColor(newColor, isLightMode)
      })
    }
  }, [currentColorScheme, mounted, processColor, isLightMode])

  // ✅ SSR SAFE: Return null during SSR and if reduced motion
  if (!mounted || prefersReducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-${interactive && !isMobile ? 'auto' : 'none'} absolute inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100%',
        opacity: isMobile ? 0.4 : (isLightMode ? 0.6 : 0.5),
        mixBlendMode: currentColorScheme.mixBlendMode
      }}
      aria-hidden="true"
    />
  )
}

// ✅ SSR SAFE: Hooks with mounted checks
export function useParticleField(theme?: 'light' | 'dark') {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const detectedTheme = useMemo(() => {
    if (theme) return theme
    if (!mounted || typeof window === 'undefined') return 'light'
    
    try {
      const htmlElement = document.documentElement
      const hasExplicitDarkClass = htmlElement.classList.contains('dark')
      const hasExplicitLightClass = htmlElement.classList.contains('light')
      
      if (hasExplicitDarkClass) return 'dark'
      if (hasExplicitLightClass) return 'light'
      
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } catch (error) {
      return 'light'
    }
  }, [theme, mounted])

  return useMemo(() => {
    const isMobile = mounted && typeof window !== 'undefined' && window.innerWidth < 768
    
    return {
      particleCount: isMobile ? 15 : 25,
      colorScheme: detectedTheme === 'light' ? 'light-mode' as const : 'aurora' as const,
      animation: 'constellation' as const,
      interactive: !isMobile,
      speed: 0.3
    }
  }, [detectedTheme, mounted])
}

export function getParticleConfig(theme: 'light' | 'dark', colorScheme?: string) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  
  const baseConfig = {
    particleCount: isMobile ? 15 : 25,
    interactive: !isMobile,
    speed: 0.3,
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