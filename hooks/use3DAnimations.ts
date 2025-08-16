import { useRef, useEffect, useState, useCallback } from 'react'
import { useSpring, useTransform, useScroll, MotionValue } from 'framer-motion'

export interface MousePosition {
  x: number
  y: number
}

export interface Rotation3D {
  x: number
  y: number
  z: number
}

export interface ParallaxOptions {
  speed?: number
  range?: number
  disabled?: boolean
}

export interface Use3DHoverOptions {
  intensity?: number
  reverse?: boolean
  disabled?: boolean
  resetOnLeave?: boolean
}

export interface FloatingOptions {
  amplitude?: number
  frequency?: number
  offset?: number
  disabled?: boolean
}

// Main 3D hover effect hook
export const use3DHover = (options: Use3DHoverOptions = {}) => {
  const {
    intensity = 10,
    reverse = false,
    disabled = false,
    resetOnLeave = true
  } = options

  const ref = useRef<HTMLElement>(null)
  const [rotation, setRotation] = useState<Rotation3D>({ x: 0, y: 0, z: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (disabled) return

    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const rotateX = ((e.clientY - centerY) / intensity) * (reverse ? -1 : 1)
      const rotateY = ((centerX - e.clientX) / intensity) * (reverse ? -1 : 1)
      
      setRotation({ x: rotateX, y: rotateY, z: 0 })
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      if (resetOnLeave) {
        setRotation({ x: 0, y: 0, z: 0 })
      }
      setIsHovered(false)
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)
    element.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [intensity, reverse, disabled, resetOnLeave])

  return {
    ref,
    rotation,
    isHovered,
    transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`
  }
}

// Mouse tracking hook for parallax effects
export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1, // Normalize to -1 to 1
        y: (e.clientY / window.innerHeight) * 2 - 1
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return mousePosition
}

// Parallax scroll hook
export const useParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.5, range = 200, disabled = false } = options
  const ref = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    disabled ? [0, 0] : [-range * speed, range * speed]
  )

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return { ref, y, opacity, scrollYProgress }
}

// Floating animation hook
export const useFloating = (options: FloatingOptions = {}) => {
  const {
    amplitude = 20,
    frequency = 0.002,
    offset = 0,
    disabled = false
  } = options

  const [position, setPosition] = useState(0)

  useEffect(() => {
    if (disabled) return

    let animationId: number

    const animate = (time: number) => {
      const newPosition = Math.sin((time + offset) * frequency) * amplitude
      setPosition(newPosition)
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [amplitude, frequency, offset, disabled])

  return {
    y: position,
    transform: `translateY(${position}px)`
  }
}

// Smooth spring animations hook
export const useSmoothTransform = (value: MotionValue<number>, config = {}) => {
  const defaultConfig = {
    stiffness: 100,
    damping: 30,
    mass: 1
  }

  return useSpring(value, { ...defaultConfig, ...config })
}

// 3D card tilt effect hook
export const useCardTilt = (maxTilt = 15) => {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const tiltX = ((e.clientY - centerY) / (rect.height / 2)) * maxTilt
    const tiltY = ((centerX - e.clientX) / (rect.width / 2)) * maxTilt

    setTilt({ x: tiltX, y: tiltY })
  }, [maxTilt])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave])

  return {
    ref,
    tilt,
    isHovered,
    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    style: {
      transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      transformStyle: 'preserve-3d' as const,
      transition: isHovered ? 'none' : 'transform 0.3s ease-out'
    }
  }
}

// Magnetic button effect hook
export const useMagneticEffect = (strength = 0.3) => {
  const ref = useRef<HTMLElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength

      setPosition({ x: deltaX, y: deltaY })
    }

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength])

  return {
    ref,
    position,
    transform: `translate(${position.x}px, ${position.y}px)`
  }
}

// Scroll-triggered animations hook
export const useScrollTrigger = (threshold = 0.1) => {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true)
        }
      },
      { threshold }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, hasTriggered])

  return { ref, isVisible, hasTriggered }
}

// Performance-aware animation hook
export const usePerformanceAwareAnimation = () => {
  const [useReducedMotion, setUseReducedMotion] = useState(false)
  const [isLowPerformance, setIsLowPerformance] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setUseReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setUseReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    // Basic performance detection
    const checkPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isOldDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4
      const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4

      setIsLowPerformance(isMobile || isOldDevice || hasLowMemory)
    }

    checkPerformance()

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return {
    useReducedMotion,
    isLowPerformance,
    shouldAnimate: !useReducedMotion && !isLowPerformance
  }
}

// Combined 3D animations hook
export const use3DAnimations = () => {
  const mousePosition = useMousePosition()
  const { shouldAnimate } = usePerformanceAwareAnimation()

  const createHoverEffect = useCallback((options?: Use3DHoverOptions) => {
    return use3DHover({ ...options, disabled: !shouldAnimate })
  }, [shouldAnimate])

  const createParallax = useCallback((options?: ParallaxOptions) => {
    return useParallax({ ...options, disabled: !shouldAnimate })
  }, [shouldAnimate])

  const createFloating = useCallback((options?: FloatingOptions) => {
    return useFloating({ ...options, disabled: !shouldAnimate })
  }, [shouldAnimate])

  return {
    mousePosition,
    shouldAnimate,
    createHoverEffect,
    createParallax,
    createFloating,
    useCardTilt: () => useCardTilt(shouldAnimate ? 15 : 0),
    useMagneticEffect: () => useMagneticEffect(shouldAnimate ? 0.3 : 0),
    useScrollTrigger
  }
}

export default use3DAnimations