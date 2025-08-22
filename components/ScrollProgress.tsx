'use client'

import { useEffect, useState, useRef } from 'react'

interface ScrollProgressProps {
  className?: string
  color?: string
  height?: string
  smooth?: boolean
}

export default function ScrollProgress({ 
  className = '',
  color = 'linear-gradient(90deg, #BE3455 0%, #D4AF37 50%, #008080 100%)',
  height = '2px',
  smooth = true
}: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    const updateScrollProgress = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
        
        if (scrollHeight > 0) {
          const progress = (scrollTop / scrollHeight) * 100
          setScrollProgress(Math.min(100, Math.max(0, progress)))
        } else {
          setScrollProgress(0)
        }
      })
    }

    // Initial calculation
    updateScrollProgress()

    // Add scroll listener with passive option for better performance
    const handleScroll = () => {
      if (smooth) {
        updateScrollProgress()
      } else {
        // Direct update without RAF for immediate response
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
        
        if (scrollHeight > 0) {
          const progress = (scrollTop / scrollHeight) * 100
          setScrollProgress(Math.min(100, Math.max(0, progress)))
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateScrollProgress, { passive: true })

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateScrollProgress)
    }
  }, [smooth])

  return (
    <div
      ref={progressRef}
      className={`scroll-progress ${className}`}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height,
        zIndex: 1001,
        pointerEvents: 'none',
        userSelect: 'none',
        background: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden'
      }}
      aria-hidden="true"
    >
      <div
        className="scroll-progress-bar"
        style={{
          width: `${scrollProgress}%`,
          height: '100%',
          background: color,
          transition: smooth ? 'width 0.1s ease' : 'none',
          boxShadow: '0 0 8px rgba(190, 52, 85, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)',
          willChange: 'width',
          contain: 'layout style paint'
        }}
      />
    </div>
  )
}